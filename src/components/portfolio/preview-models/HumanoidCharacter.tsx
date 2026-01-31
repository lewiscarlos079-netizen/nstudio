import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HumanoidCharacterProps {
  isPlaying: boolean;
  variant?: 'default' | 'hero' | 'warrior';
}

export function HumanoidCharacter({ isPlaying, variant = 'default' }: HumanoidCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);

  // Breathing and idle animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const breathSpeed = isPlaying ? 1.5 : 0.8;
    const moveSpeed = isPlaying ? 2 : 0;
    
    // Subtle body sway
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.position.y = Math.sin(time * breathSpeed) * 0.02;
    
    // Breathing animation on torso
    if (torsoRef.current) {
      torsoRef.current.scale.x = 1 + Math.sin(time * breathSpeed) * 0.02;
      torsoRef.current.scale.z = 1 + Math.sin(time * breathSpeed) * 0.015;
    }
    
    // Head subtle movement - looking around
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.15;
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
    }
    
    // Arm swing animation
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = Math.sin(time * moveSpeed) * 0.4;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
      
      // Subtle arm sway when idle
      leftArmRef.current.rotation.z = 0.15 + Math.sin(time * 0.8) * 0.05;
      rightArmRef.current.rotation.z = -0.15 - Math.sin(time * 0.8) * 0.05;
    }
    
    // Leg walk animation
    if (leftLegRef.current && rightLegRef.current && isPlaying) {
      const legSwing = Math.sin(time * moveSpeed) * 0.3;
      leftLegRef.current.rotation.x = -legSwing;
      rightLegRef.current.rotation.x = legSwing;
    }
  });

  const skinColor = variant === 'warrior' ? '#c9a882' : '#e8beac';
  const hairColor = variant === 'hero' ? '#2c1810' : variant === 'warrior' ? '#8b4513' : '#3d2314';
  const shirtColor = variant === 'hero' ? '#1e40af' : variant === 'warrior' ? '#7f1d1d' : '#3b82f6';
  const pantsColor = variant === 'warrior' ? '#1c1917' : '#1e3a5f';

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Skull - slightly elongated sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Face - slightly flattened front */}
        <mesh position={[0, -0.02, 0.08]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Jaw */}
        <mesh position={[0, -0.12, 0.05]}>
          <boxGeometry args={[0.14, 0.08, 0.12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Chin */}
        <mesh position={[0, -0.16, 0.08]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.02, 0.2]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.025, 0.06, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.22]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        
        {/* Eye sockets */}
        <mesh position={[-0.07, 0.02, 0.15]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.15]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
        </mesh>
        
        {/* Irises */}
        <mesh position={[-0.07, 0.02, 0.18]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial color="#4a6741" roughness={0.2} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.18]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial color="#4a6741" roughness={0.2} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.07, 0.02, 0.195]}>
          <sphereGeometry args={[0.008, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.195]}>
          <sphereGeometry args={[0.008, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
        </mesh>
        
        {/* Eyebrows */}
        <mesh position={[-0.07, 0.08, 0.16]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.07, 0.08, 0.16]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.1, -0.02]}>
          <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.1, 0.18]}>
          <boxGeometry args={[0.06, 0.008, 0.01]} />
          <meshStandardMaterial color="#8b5a5a" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 1.28, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      
      {/* Torso */}
      <group position={[0, 1, 0]}>
        {/* Chest */}
        <mesh ref={torsoRef} position={[0, 0.08, 0]}>
          <capsuleGeometry args={[0.18, 0.28, 12, 24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
        
        {/* Shoulders */}
        <mesh position={[-0.22, 0.12, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.22, 0.12, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
        
        {/* Abdomen */}
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.14, 0.12, 12, 24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Pelvis */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.26, 0.1, 0.14]} />
        <meshStandardMaterial color={pantsColor} roughness={0.6} />
      </mesh>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.3, 1.12, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Elbow */}
        <mesh position={[-0.02, -0.24, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.02, -0.38, 0]}>
          <capsuleGeometry args={[0.04, 0.18, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.02, -0.52, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.03]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Fingers */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.015 + i * 0.015, -0.58, 0]}>
            <capsuleGeometry args={[0.008, 0.03, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.3, 1.12, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0.02, -0.24, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.02, -0.38, 0]}>
          <capsuleGeometry args={[0.04, 0.18, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.02, -0.52, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.03]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Fingers */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.015 + i * 0.015, -0.58, 0]}>
            <capsuleGeometry args={[0.008, 0.03, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.6, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.34, 0.02]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.52, 0]}>
          <capsuleGeometry args={[0.05, 0.24, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.72, 0.04]}>
          <boxGeometry args={[0.08, 0.04, 0.14]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.6, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.34, 0.02]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.52, 0]}>
          <capsuleGeometry args={[0.05, 0.24, 8, 16]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.72, 0.04]}>
          <boxGeometry args={[0.08, 0.04, 0.14]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
