import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ActionSceneProps {
  isPlaying: boolean;
}

function EnergyCore({ isPlaying }: { isPlaying: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = isPlaying ? 1 : 0.2;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * speed * 2;
      coreRef.current.rotation.x = time * speed * 0.5;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = time * speed * (i % 2 === 0 ? 1 : -1) + i;
        ring.rotation.y = time * speed * 0.5 * (i % 2 === 0 ? -1 : 1);
      });
    }
  });

  return (
    <group>
      {/* Central energy sphere */}
      <Float speed={isPlaying ? 4 : 1} rotationIntensity={isPlaying ? 1 : 0.2}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.4, 3]} />
          <MeshDistortMaterial
            color="#f97316"
            speed={isPlaying ? 5 : 1}
            distort={0.3}
            roughness={0.1}
            metalness={0.9}
            emissive="#f97316"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>
      
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.3} />
      </mesh>
      
      {/* Orbiting energy rings */}
      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 0.6, i * 0.4, 0]}>
            <torusGeometry args={[0.7 + i * 0.2, 0.02, 8, 64]} />
            <meshStandardMaterial 
              color={i === 0 ? '#f97316' : i === 1 ? '#ef4444' : '#fbbf24'}
              emissive={i === 0 ? '#f97316' : i === 1 ? '#ef4444' : '#fbbf24'}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OrbitalParticles({ isPlaying }: { isPlaying: boolean }) {
  const particlesRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return [...Array(16)].map((_, i) => ({
      angle: (i / 16) * Math.PI * 2,
      radius: 1.2 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
      yOffset: (Math.random() - 0.5) * 0.8,
      size: 0.05 + Math.random() * 0.05,
      color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#f97316' : '#fbbf24',
    }));
  }, []);

  useFrame((state) => {
    if (!particlesRef.current || !isPlaying) return;
    const time = state.clock.elapsedTime;
    
    particlesRef.current.children.forEach((particle, i) => {
      const p = particles[i];
      particle.position.x = Math.cos(time * p.speed + p.angle) * p.radius;
      particle.position.z = Math.sin(time * p.speed + p.angle) * p.radius;
      particle.position.y = p.yOffset + Math.sin(time * 2 + i) * 0.1;
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[Math.cos(p.angle) * p.radius, p.yOffset, Math.sin(p.angle) * p.radius]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial 
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightningBolts({ isPlaying }: { isPlaying: boolean }) {
  const boltsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!boltsRef.current || !isPlaying) return;
    const time = state.clock.elapsedTime;
    
    boltsRef.current.children.forEach((bolt, i) => {
      // Flicker effect
      bolt.visible = Math.sin(time * 20 + i * 5) > 0.3;
      bolt.rotation.z = Math.sin(time * 10 + i) * 0.2;
    });
  });

  if (!isPlaying) return null;

  return (
    <group ref={boltsRef}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(angle) * 0.9, 0.3, Math.sin(angle) * 0.9]} rotation={[0, angle, 0]}>
            {/* Lightning bolt segments */}
            {[...Array(4)].map((_, j) => (
              <mesh 
                key={j} 
                position={[
                  (Math.random() - 0.5) * 0.1,
                  j * 0.2,
                  0
                ]}
                rotation={[0, 0, (Math.random() - 0.5) * 0.5]}
              >
                <boxGeometry args={[0.02, 0.25, 0.02]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function ShockwaveRing({ isPlaying }: { isPlaying: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ringRef.current || !isPlaying) return;
    const time = state.clock.elapsedTime;
    
    // Pulsing ring
    const scale = 1 + Math.sin(time * 3) * 0.3;
    ringRef.current.scale.set(scale, scale, scale);
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.5 - Math.sin(time * 3) * 0.3;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <ringGeometry args={[1.5, 1.8, 32]} />
      <meshBasicMaterial 
        color="#f97316" 
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function EnergyBeams({ isPlaying }: { isPlaying: boolean }) {
  const beamsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!beamsRef.current) return;
    const time = state.clock.elapsedTime;
    const speed = isPlaying ? 1 : 0.2;
    
    beamsRef.current.rotation.y = time * speed;
  });

  return (
    <group ref={beamsRef}>
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.05, 1.2, 8]} />
              <meshStandardMaterial 
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={0.8}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function FloatingRunes({ isPlaying }: { isPlaying: boolean }) {
  const runesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!runesRef.current) return;
    const time = state.clock.elapsedTime;
    const speed = isPlaying ? 1 : 0.3;
    
    runesRef.current.children.forEach((rune, i) => {
      rune.position.y = 0.5 + Math.sin(time * speed + i) * 0.2;
      rune.rotation.y = time * speed * 0.5 + i;
    });
  });

  return (
    <group ref={runesRef}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 2, 0.5, Math.sin(angle) * 2]}
            rotation={[0, -angle, 0]}
          >
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial 
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function ActionScene({ isPlaying }: ActionSceneProps) {
  return (
    <group>
      {/* Central energy core */}
      <EnergyCore isPlaying={isPlaying} />
      
      {/* Orbiting particles */}
      <OrbitalParticles isPlaying={isPlaying} />
      
      {/* Lightning effects */}
      <LightningBolts isPlaying={isPlaying} />
      
      {/* Shockwave ring */}
      <ShockwaveRing isPlaying={isPlaying} />
      
      {/* Energy beams */}
      <EnergyBeams isPlaying={isPlaying} />
      
      {/* Floating runes */}
      <FloatingRunes isPlaying={isPlaying} />
      
      {/* Ground effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial 
          color="#1a0a0a" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Glowing cracks in ground */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            rotation={[-Math.PI / 2, 0, angle]}
            position={[0, -0.48, 0]}
          >
            <planeGeometry args={[0.05, 2]} />
            <meshBasicMaterial 
              color="#f97316" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.5}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 4,
              Math.random() * 2,
              (Math.random() - 0.5) * 4
            ]}
          >
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#f97316' : '#fbbf24'}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
