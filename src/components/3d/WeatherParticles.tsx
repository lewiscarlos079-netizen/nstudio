import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';

interface WeatherParticlesProps {
  weather: WeatherType;
  intensity?: number;
  windSpeed?: number;
}

// Rain particle system
function RainParticles({ intensity = 0.5, windSpeed = 0.2 }: { intensity: number; windSpeed: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = Math.floor(500 * intensity);
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 20
      ),
      velocity: new THREE.Vector3(windSpeed * 0.5, -8 - Math.random() * 4, 0),
      length: 0.2 + Math.random() * 0.3,
    }));
  }, [particleCount, windSpeed]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Reset when below ground
      if (particle.position.y < 0) {
        particle.position.y = 15 + Math.random() * 5;
        particle.position.x = (Math.random() - 0.5) * 20;
        particle.position.z = (Math.random() - 0.5) * 20;
      }

      dummy.position.copy(particle.position);
      dummy.scale.set(0.02, particle.length, 0.02);
      dummy.rotation.x = Math.PI / 2 + windSpeed * 0.3;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshBasicMaterial color="#8899aa" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Snow particle system
function SnowParticles({ intensity = 0.5, windSpeed = 0.1 }: { intensity: number; windSpeed: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = Math.floor(300 * intensity);
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        Math.random() * 12 + 3,
        (Math.random() - 0.5) * 25
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * windSpeed,
        -0.5 - Math.random() * 0.5,
        (Math.random() - 0.5) * windSpeed
      ),
      wobble: Math.random() * Math.PI * 2,
      size: 0.03 + Math.random() * 0.04,
    }));
  }, [particleCount, windSpeed]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      particle.wobble += delta * 2;
      particle.position.x += Math.sin(particle.wobble) * 0.01;
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      if (particle.position.y < 0) {
        particle.position.y = 12 + Math.random() * 3;
        particle.position.x = (Math.random() - 0.5) * 25;
        particle.position.z = (Math.random() - 0.5) * 25;
      }

      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </instancedMesh>
  );
}

// Cloud system - volumetric billboards
function CloudSystem({ coverage = 0.5 }: { coverage: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudCount = Math.floor(8 + coverage * 12);
  
  const clouds = useMemo(() => {
    return Array.from({ length: cloudCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        8 + Math.random() * 6,
        (Math.random() - 0.5) * 40
      ),
      scale: 2 + Math.random() * 4,
      speed: 0.02 + Math.random() * 0.03,
      puffs: Math.floor(3 + Math.random() * 4),
    }));
  }, [cloudCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((cloud, i) => {
      cloud.position.x += clouds[i].speed * delta;
      if (cloud.position.x > 25) {
        cloud.position.x = -25;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {Array.from({ length: cloud.puffs }).map((_, j) => (
            <mesh
              key={j}
              position={[
                (j - cloud.puffs / 2) * cloud.scale * 0.4,
                Math.sin(j * 0.8) * cloud.scale * 0.2,
                Math.cos(j * 1.2) * cloud.scale * 0.15,
              ]}
            >
              <sphereGeometry args={[cloud.scale * 0.4, 8, 8]} />
              <meshStandardMaterial 
                color="#e8e8e8" 
                transparent 
                opacity={0.7} 
                roughness={1}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Fog effect
function FogEffect({ intensity = 0.5 }: { intensity: number }) {
  return (
    <fog attach="fog" args={['#aabbcc', 5, 30 - intensity * 15]} />
  );
}

// Lightning flash effect
function LightningFlash({ active = false }: { active: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const flashTime = useRef(0);
  const nextFlash = useRef(Math.random() * 3 + 1);

  useFrame((_, delta) => {
    if (!lightRef.current || !active) {
      if (lightRef.current) lightRef.current.intensity = 0;
      return;
    }

    flashTime.current += delta;
    
    if (flashTime.current > nextFlash.current) {
      // Flash!
      lightRef.current.intensity = 5 + Math.random() * 10;
      nextFlash.current = flashTime.current + 0.05 + Math.random() * 0.1;
      
      // Double flash sometimes
      if (Math.random() > 0.7) {
        setTimeout(() => {
          if (lightRef.current) lightRef.current.intensity = 8;
        }, 100);
      }
    } else {
      lightRef.current.intensity = Math.max(0, lightRef.current.intensity - delta * 30);
    }
    
    if (flashTime.current > nextFlash.current + 0.5) {
      nextFlash.current = flashTime.current + 2 + Math.random() * 5;
    }
  });

  return (
    <pointLight ref={lightRef} position={[0, 20, 0]} color="#ccddff" intensity={0} />
  );
}

export function WeatherParticles({ weather, intensity = 0.5, windSpeed = 0.2 }: WeatherParticlesProps) {
  const showClouds = ['cloudy', 'rain', 'storm', 'snow'].includes(weather);
  const cloudCoverage = weather === 'storm' ? 1 : weather === 'cloudy' ? 0.8 : 0.5;

  return (
    <group>
      {/* Clouds */}
      {showClouds && <CloudSystem coverage={cloudCoverage * intensity} />}
      
      {/* Rain */}
      {(weather === 'rain' || weather === 'storm') && (
        <RainParticles intensity={intensity} windSpeed={windSpeed} />
      )}
      
      {/* Snow */}
      {weather === 'snow' && (
        <SnowParticles intensity={intensity} windSpeed={windSpeed} />
      )}
      
      {/* Fog */}
      {weather === 'fog' && <FogEffect intensity={intensity} />}
      
      {/* Storm lightning */}
      {weather === 'storm' && <LightningFlash active />}
    </group>
  );
}
