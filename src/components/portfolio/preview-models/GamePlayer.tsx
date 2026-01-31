import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface GamePlayerProps {
  isPlaying: boolean;
}

export function GamePlayer({ isPlaying }: GamePlayerProps) {
  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const feetRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (playerRef.current && isPlaying) {
      // Running movement
      playerRef.current.position.x = Math.sin(time * 2) * 1.8;
      playerRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.3 + 0.4;
      playerRef.current.rotation.y = Math.sin(time * 2) > 0 ? 0.3 : -0.3;
    }
    
    // Body squash and stretch
    if (bodyRef.current && isPlaying) {
      const jumpPhase = Math.abs(Math.sin(time * 6));
      bodyRef.current.scale.y = 1 + jumpPhase * 0.2;
      bodyRef.current.scale.x = 1 - jumpPhase * 0.1;
    }
    
    // Feet animation
    if (feetRef.current && isPlaying) {
      feetRef.current.children.forEach((foot, i) => {
        const offset = i === 0 ? 0 : Math.PI;
        foot.rotation.x = Math.sin(time * 8 + offset) * 0.6;
        foot.position.y = Math.abs(Math.sin(time * 8 + offset)) * 0.05;
      });
    }
    
    // Arm swing
    if (armsRef.current && isPlaying) {
      armsRef.current.children.forEach((arm, i) => {
        const offset = i === 0 ? 0 : Math.PI;
        arm.rotation.x = Math.sin(time * 8 + offset) * 0.5;
      });
    }
  });

  return (
    <group>
      {/* Player Character */}
      <group ref={playerRef} position={[0, 0.4, 0]}>
        {/* Main body - cute rounded shape */}
        <mesh ref={bodyRef}>
          <capsuleGeometry args={[0.18, 0.15, 16, 24]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
        
        {/* Face */}
        <mesh position={[0, 0.05, 0.15]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.05, 0.08, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0.05, 0.08, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.05, 0.08, 0.25]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.05, 0.08, 0.25]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Eye shine */}
        <mesh position={[-0.04, 0.1, 0.26]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.06, 0.1, 0.26]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Cheeks */}
        <mesh position={[-0.1, 0.02, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.6} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.1, 0.02, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.6} transparent opacity={0.6} />
        </mesh>
        
        {/* Smile */}
        <mesh position={[0, -0.02, 0.22]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.04, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        
        {/* Arms */}
        <group ref={armsRef}>
          <mesh position={[-0.2, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.1, 8, 12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.1, 8, 12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </mesh>
        </group>
        
        {/* Feet */}
        <group ref={feetRef}>
          <mesh position={[-0.08, -0.2, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.5} />
          </mesh>
          <mesh position={[0.08, -0.2, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.5} />
          </mesh>
        </group>
        
        {/* Motion trail when playing */}
        {isPlaying && [...Array(3)].map((_, i) => (
          <mesh key={i} position={[0, 0, -0.1 - i * 0.1]}>
            <sphereGeometry args={[0.12 - i * 0.03, 8, 8]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              transparent 
              opacity={0.3 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Floating Platforms */}
      {[
        { pos: [-2.2, -0.3, 0], color: '#22c55e' },
        { pos: [-0.8, 0.1, 0.5], color: '#16a34a' },
        { pos: [0.8, -0.1, 0], color: '#22c55e' },
        { pos: [2.2, 0.2, 0.3], color: '#16a34a' },
      ].map((platform, i) => (
        <Float key={i} speed={2} floatIntensity={0.2}>
          <group position={platform.pos as [number, number, number]}>
            {/* Platform top */}
            <mesh>
              <boxGeometry args={[1, 0.15, 0.8]} />
              <meshStandardMaterial color={platform.color} roughness={0.7} />
            </mesh>
            {/* Platform grass */}
            {[...Array(5)].map((_, j) => (
              <mesh key={j} position={[-0.3 + j * 0.15, 0.1, Math.random() * 0.4 - 0.2]}>
                <coneGeometry args={[0.02, 0.08, 4]} />
                <meshStandardMaterial color="#4ade80" />
              </mesh>
            ))}
            {/* Platform underside */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[0.8, 0.15, 0.6]} />
              <meshStandardMaterial color="#854d0e" roughness={0.9} />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Collectible Stars */}
      {[
        [1.2, 1, 0],
        [-1, 0.9, 0.3],
        [2, 1.3, -0.2],
        [-0.3, 1.2, 0.5],
      ].map((pos, i) => (
        <Float key={i} speed={3} floatIntensity={0.5} rotationIntensity={2}>
          <group position={pos as [number, number, number]}>
            {/* Star shape using multiple triangles */}
            <mesh rotation={[0, 0, Math.PI / 10]}>
              <octahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial 
                color="#f59e0b" 
                emissive="#f59e0b" 
                emissiveIntensity={0.6}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Glow effect */}
            <mesh>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial 
                color="#fbbf24" 
                transparent 
                opacity={0.3}
              />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Coins trail */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.3}>
          <mesh 
            position={[-1.8 + i * 0.7, 0.2 + Math.sin(i * 0.8) * 0.15, 0.6]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial 
              color="#fcd34d" 
              metalness={0.9} 
              roughness={0.1}
              emissive="#fbbf24"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Enemy - Spiky ball */}
      <Float speed={1.5} floatIntensity={0.4}>
        <group position={[1.5, 0.5, -0.5]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.5} />
          </mesh>
          {/* Spikes */}
          {[...Array(12)].map((_, i) => {
            const theta = (i / 6) * Math.PI;
            const phi = (i % 6) / 6 * Math.PI * 2;
            return (
              <mesh 
                key={i}
                position={[
                  Math.sin(theta) * Math.cos(phi) * 0.15,
                  Math.cos(theta) * 0.15,
                  Math.sin(theta) * Math.sin(phi) * 0.15
                ]}
                rotation={[theta, phi, 0]}
              >
                <coneGeometry args={[0.03, 0.1, 6]} />
                <meshStandardMaterial color="#991b1b" />
              </mesh>
            );
          })}
          {/* Angry eyes */}
          <mesh position={[-0.05, 0.05, 0.12]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.05, 0.05, 0.12]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.05, 0.05, 0.14]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.05, 0.05, 0.14]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      </Float>
      
      {/* Background clouds */}
      {[[-3, 2, -2], [3, 2.5, -2.5], [0, 3, -3]].map((pos, i) => (
        <Float key={i} speed={0.5} floatIntensity={0.2}>
          <group position={pos as [number, number, number]}>
            {[0, 0.3, -0.2].map((offset, j) => (
              <mesh key={j} position={[offset, 0, 0]}>
                <sphereGeometry args={[0.4 - j * 0.1, 16, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.9} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
}
