import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface BossCreatureProps {
  isPlaying: boolean;
}

export function BossCreature({ isPlaying }: BossCreatureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const tentaclesRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = isPlaying ? 1 : 0.3;
    
    if (groupRef.current) {
      // Menacing hover
      groupRef.current.position.y = Math.sin(time * speed) * 0.15;
      groupRef.current.rotation.y = Math.sin(time * 0.3 * speed) * 0.2;
    }
    
    // Arm threatening gestures
    if (leftArmRef.current && rightArmRef.current) {
      const armTime = time * speed * 1.5;
      leftArmRef.current.rotation.z = 0.8 + Math.sin(armTime) * 0.3;
      leftArmRef.current.rotation.x = Math.sin(armTime * 0.7) * 0.2;
      rightArmRef.current.rotation.z = -0.8 - Math.sin(armTime + 1) * 0.3;
      rightArmRef.current.rotation.x = Math.sin(armTime * 0.7 + 1) * 0.2;
    }
    
    // Writhing tentacles
    if (tentaclesRef.current) {
      tentaclesRef.current.children.forEach((tentacle, i) => {
        const offset = i * 0.5;
        tentacle.rotation.x = Math.sin(time * speed * 2 + offset) * 0.4;
        tentacle.rotation.z = Math.cos(time * speed * 1.5 + offset) * 0.3;
      });
    }
    
    // Pulsing eyes
    if (eyesRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.1;
      eyesRef.current.children.forEach((eye) => {
        eye.scale.setScalar(pulse);
      });
    }
    
    // Breathing mouth
    if (mouthRef.current) {
      mouthRef.current.scale.y = 1 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body - Organic mass */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <MeshWobbleMaterial 
          color="#3d1a5c"
          speed={isPlaying ? 2 : 0.5}
          factor={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Body texture details */}
      {[...Array(8)].map((_, i) => {
        const theta = (i / 8) * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        return (
          <mesh 
            key={i}
            position={[
              Math.sin(theta) * Math.sin(phi) * 0.72,
              1 + Math.cos(phi) * 0.5,
              Math.cos(theta) * Math.sin(phi) * 0.72
            ]}
          >
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#5c2a7c" roughness={0.9} />
          </mesh>
        );
      })}
      
      {/* Head/Face region */}
      <mesh position={[0, 1.5, 0.3]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#4a1a6c" roughness={0.7} />
      </mesh>
      
      {/* Forehead ridge */}
      <mesh position={[0, 1.7, 0.4]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.2]} />
        <meshStandardMaterial color="#2d0d3d" roughness={0.9} />
      </mesh>
      
      {/* Eyes */}
      <group ref={eyesRef}>
        {/* Main eyes */}
        <mesh position={[-0.15, 1.55, 0.55]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.15, 1.55, 0.55]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Eye pupils - slitted */}
        <mesh position={[-0.15, 1.55, 0.64]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
          <meshBasicMaterial color="#1a0000" />
        </mesh>
        <mesh position={[0.15, 1.55, 0.64]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
          <meshBasicMaterial color="#1a0000" />
        </mesh>
        
        {/* Third eye */}
        <mesh position={[0, 1.75, 0.5]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#ffff00" 
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
      
      {/* Mouth - gaping maw */}
      <mesh ref={mouthRef} position={[0, 1.35, 0.58]}>
        <torusGeometry args={[0.12, 0.04, 12, 24]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.5} />
      </mesh>
      
      {/* Teeth */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[
              Math.sin(angle) * 0.1,
              1.35 + Math.cos(angle) * 0.06,
              0.6
            ]}
            rotation={[0, 0, angle]}
          >
            <coneGeometry args={[0.02, 0.08, 6]} />
            <meshStandardMaterial color="#d4c4a0" roughness={0.3} />
          </mesh>
        );
      })}
      
      {/* Horns */}
      <group position={[-0.35, 1.75, 0.1]} rotation={[0.2, 0.3, -0.6]}>
        <mesh>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshStandardMaterial color="#1a0d2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshStandardMaterial color="#0d0618" roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.35, 1.75, 0.1]} rotation={[0.2, -0.3, 0.6]}>
        <mesh>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshStandardMaterial color="#1a0d2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshStandardMaterial color="#0d0618" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Left Arm - Massive clawed appendage */}
      <group ref={leftArmRef} position={[-0.65, 1.1, 0]}>
        {/* Shoulder */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#4a1a6c" roughness={0.7} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[-0.15, -0.2, 0]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        {/* Forearm with spikes */}
        <mesh position={[-0.3, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        {/* Arm spikes */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.25 - i * 0.08, -0.3 - i * 0.1, 0.12]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.03, 0.12, 6]} />
            <meshStandardMaterial color="#1a0d2a" roughness={0.8} />
          </mesh>
        ))}
        {/* Clawed hand */}
        <mesh position={[-0.4, -0.65, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        {/* Claws */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.38 - i * 0.02, -0.78, -0.02 + i * 0.03]} rotation={[0.3, 0, 0.2]}>
            <coneGeometry args={[0.015, 0.15, 6]} />
            <meshStandardMaterial color="#1a0a1a" roughness={0.4} />
          </mesh>
        ))}
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.65, 1.1, 0]}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#4a1a6c" roughness={0.7} />
        </mesh>
        <mesh position={[0.15, -0.2, 0]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        <mesh position={[0.3, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.25 + i * 0.08, -0.3 - i * 0.1, 0.12]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.03, 0.12, 6]} />
            <meshStandardMaterial color="#1a0d2a" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0.4, -0.65, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#3d1a5c" roughness={0.7} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0.38 + i * 0.02, -0.78, -0.02 + i * 0.03]} rotation={[0.3, 0, -0.2]}>
            <coneGeometry args={[0.015, 0.15, 6]} />
            <meshStandardMaterial color="#1a0a1a" roughness={0.4} />
          </mesh>
        ))}
      </group>
      
      {/* Tentacle legs */}
      <group ref={tentaclesRef}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={i} position={[Math.sin(angle) * 0.4, 0.3, Math.cos(angle) * 0.4]}>
              {/* Tentacle segments */}
              {[0, 1, 2, 3].map((seg) => (
                <mesh 
                  key={seg}
                  position={[0, -seg * 0.18, 0]}
                  rotation={[Math.sin(i + seg) * 0.3, 0, Math.cos(i) * 0.2]}
                >
                  <capsuleGeometry args={[0.06 - seg * 0.012, 0.15, 8, 16]} />
                  <meshStandardMaterial 
                    color={seg % 2 === 0 ? '#4a1a6c' : '#5c2a7c'} 
                    roughness={0.8} 
                  />
                </mesh>
              ))}
              {/* Suction cups */}
              {[0, 1, 2].map((cup) => (
                <mesh key={cup} position={[0.05, -0.1 - cup * 0.2, 0]}>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshStandardMaterial color="#2d0d3d" roughness={0.6} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
      
      {/* Dark aura particles */}
      {isPlaying && [...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[
              Math.sin(angle) * 1.2,
              0.8 + Math.sin(i) * 0.5,
              Math.cos(angle) * 1.2
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial 
              color="#6b21a8" 
              emissive="#6b21a8" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Arena floor with runes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#1a0d2a" roughness={0.9} />
      </mesh>
      
      {/* Glowing rune circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshStandardMaterial 
          color="#9333ea" 
          emissive="#9333ea" 
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
