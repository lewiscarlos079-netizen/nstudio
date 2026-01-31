import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'tornado';

interface WeatherParticlesProps {
  weather: WeatherType;
  intensity?: number;
  windSpeed?: number;
  windDirection?: number; // Angle in radians
}

// Enhanced Rain with wind physics
function RainParticles({ intensity = 0.5, windSpeed = 0.3, windDirection = 0 }: { 
  intensity: number; 
  windSpeed: number;
  windDirection: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = Math.floor(800 * intensity);
  
  const windVec = useMemo(() => new THREE.Vector3(
    Math.sin(windDirection) * windSpeed * 3,
    0,
    Math.cos(windDirection) * windSpeed * 3
  ), [windSpeed, windDirection]);
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        Math.random() * 20 + 5,
        (Math.random() - 0.5) * 30
      ),
      velocity: new THREE.Vector3(
        windVec.x + (Math.random() - 0.5) * 0.5,
        -12 - Math.random() * 6, // Faster fall
        windVec.z + (Math.random() - 0.5) * 0.5
      ),
      length: 0.25 + Math.random() * 0.35,
    }));
  }, [particleCount, windVec]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Apply wind force
      particle.velocity.x += windVec.x * delta * 0.5;
      particle.velocity.z += windVec.z * delta * 0.5;
      
      // Clamp horizontal velocity
      particle.velocity.x = THREE.MathUtils.clamp(particle.velocity.x, -5, 5);
      particle.velocity.z = THREE.MathUtils.clamp(particle.velocity.z, -5, 5);
      
      tempVec.copy(particle.velocity).multiplyScalar(delta);
      particle.position.add(tempVec);
      
      // Reset when below ground or out of bounds
      if (particle.position.y < 0 || Math.abs(particle.position.x) > 20 || Math.abs(particle.position.z) > 20) {
        particle.position.y = 20 + Math.random() * 8;
        particle.position.x = (Math.random() - 0.5) * 30;
        particle.position.z = (Math.random() - 0.5) * 30;
        particle.velocity.x = windVec.x + (Math.random() - 0.5) * 0.5;
        particle.velocity.z = windVec.z + (Math.random() - 0.5) * 0.5;
      }

      dummy.position.copy(particle.position);
      dummy.scale.set(0.015, particle.length, 0.015);
      
      // Angle rain based on velocity
      const angle = Math.atan2(particle.velocity.x, -particle.velocity.y);
      dummy.rotation.set(0, 0, angle);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <cylinderGeometry args={[1, 0.5, 1, 4]} />
      <meshBasicMaterial color="#8899bb" transparent opacity={0.7} />
    </instancedMesh>
  );
}

// Enhanced Snow with realistic drifting
function SnowParticles({ intensity = 0.5, windSpeed = 0.2, windDirection = 0 }: { 
  intensity: number; 
  windSpeed: number;
  windDirection: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = Math.floor(500 * intensity);
  
  const windVec = useMemo(() => new THREE.Vector3(
    Math.sin(windDirection) * windSpeed * 2,
    0,
    Math.cos(windDirection) * windSpeed * 2
  ), [windSpeed, windDirection]);
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 35
      ),
      velocity: new THREE.Vector3(
        windVec.x,
        -0.8 - Math.random() * 0.6,
        windVec.z
      ),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.5 + Math.random() * 2,
      wobbleAmplitude: 0.3 + Math.random() * 0.4,
      size: 0.04 + Math.random() * 0.06,
      spinSpeed: (Math.random() - 0.5) * 3,
    }));
  }, [particleCount, windVec]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      particle.wobblePhase += delta * particle.wobbleSpeed;
      
      // Wind + wobble motion
      const wobbleX = Math.sin(particle.wobblePhase) * particle.wobbleAmplitude * 0.02;
      const wobbleZ = Math.cos(particle.wobblePhase * 0.7) * particle.wobbleAmplitude * 0.02;
      
      particle.position.x += (windVec.x + wobbleX) * delta;
      particle.position.y += particle.velocity.y * delta;
      particle.position.z += (windVec.z + wobbleZ) * delta;
      
      // Reset when below ground
      if (particle.position.y < 0 || Math.abs(particle.position.x) > 20 || Math.abs(particle.position.z) > 20) {
        particle.position.y = 15 + Math.random() * 5;
        particle.position.x = (Math.random() - 0.5) * 35;
        particle.position.z = (Math.random() - 0.5) * 35;
      }

      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size);
      dummy.rotation.y += particle.spinSpeed * delta;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
    </instancedMesh>
  );
}

// Volumetric clouds with wind movement
function CloudSystem({ coverage = 0.5, windSpeed = 0.1, windDirection = 0 }: { 
  coverage: number;
  windSpeed: number;
  windDirection: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudCount = Math.floor(10 + coverage * 15);
  
  const windVec = useMemo(() => new THREE.Vector2(
    Math.sin(windDirection) * windSpeed,
    Math.cos(windDirection) * windSpeed
  ), [windSpeed, windDirection]);
  
  const clouds = useMemo(() => {
    return Array.from({ length: cloudCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        10 + Math.random() * 8,
        (Math.random() - 0.5) * 50
      ),
      scale: 3 + Math.random() * 5,
      speedMod: 0.5 + Math.random() * 0.5,
      puffs: Math.floor(4 + Math.random() * 5),
      darkness: Math.random() * 0.2,
    }));
  }, [cloudCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((cloud, i) => {
      const data = clouds[i];
      cloud.position.x += windVec.x * data.speedMod * delta * 2;
      cloud.position.z += windVec.y * data.speedMod * delta * 2;
      
      // Wrap around
      if (cloud.position.x > 30) cloud.position.x = -30;
      if (cloud.position.x < -30) cloud.position.x = 30;
      if (cloud.position.z > 30) cloud.position.z = -30;
      if (cloud.position.z < -30) cloud.position.z = 30;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {Array.from({ length: cloud.puffs }).map((_, j) => {
            const offsetX = (j - cloud.puffs / 2) * cloud.scale * 0.35;
            const offsetY = Math.sin(j * 0.9) * cloud.scale * 0.15;
            const offsetZ = Math.cos(j * 1.3) * cloud.scale * 0.12;
            const puffScale = cloud.scale * (0.35 + Math.sin(j) * 0.15);
            
            return (
              <mesh
                key={j}
                position={[offsetX, offsetY, offsetZ]}
              >
                <sphereGeometry args={[puffScale, 10, 10]} />
                <meshStandardMaterial 
                  color={`hsl(0, 0%, ${85 - cloud.darkness * 30}%)`}
                  transparent 
                  opacity={0.75} 
                  roughness={1}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// Enhanced fog with density variation
function FogEffect({ intensity = 0.5 }: { intensity: number }) {
  const fogColor = useMemo(() => {
    const gray = 0.7 - intensity * 0.15;
    return new THREE.Color(gray, gray, gray + 0.05);
  }, [intensity]);
  
  return (
    <fog attach="fog" args={[fogColor, 3, 25 - intensity * 12]} />
  );
}

// Improved lightning with multiple flashes
function LightningFlash({ active = false }: { active: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const flashState = useRef({
    time: 0,
    nextFlash: Math.random() * 2 + 0.5,
    flashing: false,
    flashCount: 0,
    maxFlashes: 0,
  });

  useFrame((_, delta) => {
    if (!lightRef.current || !active) {
      if (lightRef.current) lightRef.current.intensity = 0;
      return;
    }

    const state = flashState.current;
    state.time += delta;
    
    if (!state.flashing && state.time > state.nextFlash) {
      // Start flash sequence
      state.flashing = true;
      state.flashCount = 0;
      state.maxFlashes = Math.random() > 0.6 ? 3 : 1;
    }
    
    if (state.flashing) {
      // Quick flash on/off
      const flashPhase = (state.time - state.nextFlash) * 20;
      const flashIndex = Math.floor(flashPhase);
      
      if (flashIndex < state.maxFlashes * 2) {
        lightRef.current.intensity = flashIndex % 2 === 0 ? 8 + Math.random() * 5 : 0;
      } else {
        // End flash sequence
        state.flashing = false;
        state.nextFlash = state.time + 1.5 + Math.random() * 4;
        lightRef.current.intensity = 0;
      }
    } else {
      lightRef.current.intensity = Math.max(0, lightRef.current.intensity - delta * 25);
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 25, 0]} color="#ccddff" intensity={0} distance={100} />
      <pointLight position={[10, 20, -10]} color="#aabbdd" intensity={0.1} />
    </>
  );
}

// Tornado particles
function TornadoParticles({ intensity = 0.5 }: { intensity: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = Math.floor(400 * intensity);
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const heightRatio = i / particleCount;
      const radius = 0.5 + heightRatio * 4;
      const angle = Math.random() * Math.PI * 2;
      
      return {
        baseRadius: radius,
        angle,
        height: heightRatio * 15,
        speed: 3 + Math.random() * 2,
        size: 0.1 + Math.random() * 0.2,
        wobble: Math.random() * 0.3,
      };
    });
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const currentAngle = particle.angle + time * particle.speed;
      const radius = particle.baseRadius + Math.sin(time * 2 + i) * particle.wobble;
      
      dummy.position.set(
        Math.cos(currentAngle) * radius,
        particle.height,
        Math.sin(currentAngle) * radius
      );
      dummy.scale.setScalar(particle.size);
      dummy.rotation.set(time, time * 0.5, time * 0.3);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#554433" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export function WeatherParticles({ 
  weather, 
  intensity = 0.5, 
  windSpeed = 0.3,
  windDirection = Math.PI * 0.25 // Default diagonal wind
}: WeatherParticlesProps) {
  const showClouds = ['cloudy', 'rain', 'storm', 'snow'].includes(weather);
  const cloudCoverage = weather === 'storm' ? 1 : weather === 'cloudy' ? 0.8 : 0.5;

  return (
    <group>
      {/* Clouds with wind */}
      {showClouds && (
        <CloudSystem 
          coverage={cloudCoverage * intensity} 
          windSpeed={windSpeed}
          windDirection={windDirection}
        />
      )}
      
      {/* Rain with wind physics */}
      {(weather === 'rain' || weather === 'storm') && (
        <RainParticles 
          intensity={intensity * (weather === 'storm' ? 1.5 : 1)} 
          windSpeed={windSpeed * (weather === 'storm' ? 2 : 1)}
          windDirection={windDirection}
        />
      )}
      
      {/* Snow with wind drifting */}
      {weather === 'snow' && (
        <SnowParticles 
          intensity={intensity} 
          windSpeed={windSpeed}
          windDirection={windDirection}
        />
      )}
      
      {/* Fog */}
      {weather === 'fog' && <FogEffect intensity={intensity} />}
      
      {/* Storm lightning */}
      {weather === 'storm' && <LightningFlash active />}
      
      {/* Tornado */}
      {weather === 'tornado' && <TornadoParticles intensity={intensity} />}
    </group>
  );
}
