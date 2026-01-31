import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HumanoidCharacterProps {
  isPlaying: boolean;
  variant?: 'default' | 'hero' | 'warrior' | 'athletic' | 'elder';
  gender?: 'male' | 'female';
}

// Realistic human proportions - based on anatomical 7.5 head ratio
const ANATOMY = {
  headHeight: 0.24,
  neckLength: 0.08,
  shoulderWidth: 0.38,
  torsoLength: 0.52,
  hipWidth: 0.28,
  armLength: 0.58,
  legLength: 0.82,
  handLength: 0.09,
  footLength: 0.12,
};

export function HumanoidCharacter({ isPlaying, variant = 'default', gender = 'male' }: HumanoidCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  // Anatomically accurate idle and movement animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const breathRate = isPlaying ? 1.8 : 1.0;
    const walkCycle = isPlaying ? 2.5 : 0;
    
    // Natural weight shift - humans don't stand perfectly still
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    groupRef.current.position.y = Math.sin(time * breathRate) * 0.008;
    
    // Spine breathing and subtle sway
    if (spineRef.current) {
      spineRef.current.rotation.x = Math.sin(time * breathRate) * 0.02;
      spineRef.current.rotation.z = Math.sin(time * 0.4) * 0.01;
    }
    
    // Chest expansion with breath
    if (chestRef.current) {
      chestRef.current.scale.x = 1 + Math.sin(time * breathRate) * 0.015;
      chestRef.current.scale.z = 1 + Math.sin(time * breathRate) * 0.02;
    }
    
    // Natural head movement - looking around subtly
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.12;
      headRef.current.rotation.x = Math.sin(time * 0.35) * 0.04 - 0.02; // slight downward tilt
      headRef.current.rotation.z = Math.sin(time * 0.6) * 0.02;
    }
    
    // Arm swing with natural shoulder rotation
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = Math.sin(time * walkCycle) * 0.35;
      leftArmRef.current.rotation.x = armSwing + Math.sin(time * 0.6) * 0.03;
      rightArmRef.current.rotation.x = -armSwing + Math.sin(time * 0.7) * 0.03;
      
      // Natural arm hang angle
      leftArmRef.current.rotation.z = 0.08 + Math.sin(time * 0.5) * 0.02;
      rightArmRef.current.rotation.z = -0.08 - Math.sin(time * 0.5) * 0.02;
      
      // Slight elbow bend at rest
      leftArmRef.current.rotation.y = Math.sin(time * 0.4) * 0.02;
      rightArmRef.current.rotation.y = -Math.sin(time * 0.4) * 0.02;
    }
    
    // Hand micro-movements
    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.rotation.x = Math.sin(time * 0.8) * 0.05;
      rightHandRef.current.rotation.x = Math.sin(time * 0.9) * 0.05;
    }
    
    // Leg movement when walking
    if (leftLegRef.current && rightLegRef.current && isPlaying) {
      const legSwing = Math.sin(time * walkCycle) * 0.28;
      leftLegRef.current.rotation.x = -legSwing;
      rightLegRef.current.rotation.x = legSwing;
    } else if (leftLegRef.current && rightLegRef.current) {
      // Weight shift stance
      leftLegRef.current.rotation.z = Math.sin(time * 0.3) * 0.015;
      rightLegRef.current.rotation.z = -Math.sin(time * 0.3) * 0.015;
    }
  });

  // Color palette based on variant and gender
  const getSkinTone = () => {
    const tones = {
      default: '#d4a574',
      hero: '#c9a882',
      warrior: '#b8956e',
      athletic: '#c4a07a',
      elder: '#d9c4a5',
    };
    return tones[variant];
  };

  const skinColor = getSkinTone();
  const hairColor = variant === 'elder' ? '#9ca3af' : variant === 'hero' ? '#1f1815' : variant === 'warrior' ? '#5c3d2e' : '#2d1f15';
  const eyeColor = variant === 'hero' ? '#1e3a5f' : variant === 'warrior' ? '#4a3728' : '#3d5c3d';
  
  // Clothing colors by variant
  const clothingPalette = {
    default: { primary: '#374151', secondary: '#1f2937', accent: '#4b5563' },
    hero: { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' },
    warrior: { primary: '#7f1d1d', secondary: '#450a0a', accent: '#b91c1c' },
    athletic: { primary: '#065f46', secondary: '#064e3b', accent: '#10b981' },
    elder: { primary: '#44403c', secondary: '#292524', accent: '#78716c' },
  };
  
  const clothes = clothingPalette[variant];
  
  // Anatomical adjustments for gender
  const shoulderMod = gender === 'female' ? 0.88 : 1;
  const hipMod = gender === 'female' ? 1.12 : 1;
  const chestScale = gender === 'female' ? { x: 0.95, y: 1.05, z: 1.1 } : { x: 1, y: 1, z: 1 };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Pelvis - center of gravity */}
      <group position={[0, 0.85, 0]}>
        <mesh>
          <boxGeometry args={[ANATOMY.hipWidth * hipMod, 0.12, 0.16]} />
          <meshStandardMaterial color={clothes.secondary} roughness={0.7} />
        </mesh>
        
        {/* Spine/Torso Group */}
        <group ref={spineRef} position={[0, 0.06, 0]}>
          {/* Lower back */}
          <mesh position={[0, 0.08, 0]}>
            <capsuleGeometry args={[0.1, 0.12, 8, 16]} />
            <meshStandardMaterial color={clothes.primary} roughness={0.6} />
          </mesh>
          
          {/* Mid torso */}
          <mesh position={[0, 0.22, 0]}>
            <capsuleGeometry args={[0.12, 0.14, 8, 16]} />
            <meshStandardMaterial color={clothes.primary} roughness={0.6} />
          </mesh>
          
          {/* Chest group */}
          <group ref={chestRef} position={[0, 0.4, 0]} scale={[chestScale.x, chestScale.y, chestScale.z]}>
            {/* Ribcage */}
            <mesh>
              <capsuleGeometry args={[0.14 * shoulderMod, 0.18, 12, 24]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
            
            {/* Pectoral definition */}
            <mesh position={[0, -0.02, 0.06]}>
              <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
            
            {/* Collar bones */}
            <mesh position={[-0.08 * shoulderMod, 0.12, 0.04]} rotation={[0, 0, 0.3]}>
              <capsuleGeometry args={[0.015, 0.1, 6, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.08 * shoulderMod, 0.12, 0.04]} rotation={[0, 0, -0.3]}>
              <capsuleGeometry args={[0.015, 0.1, 6, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Shoulder joints */}
            <mesh position={[-ANATOMY.shoulderWidth * shoulderMod / 2, 0.08, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
            <mesh position={[ANATOMY.shoulderWidth * shoulderMod / 2, 0.08, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
          </group>
          
          {/* Neck - muscular cylinder with trapezius */}
          <group position={[0, 0.58, 0]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.055, ANATOMY.neckLength, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            {/* Neck muscles */}
            <mesh position={[-0.025, 0, -0.015]} rotation={[0, 0.2, 0]}>
              <capsuleGeometry args={[0.018, 0.06, 6, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            <mesh position={[0.025, 0, -0.015]} rotation={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.018, 0.06, 6, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
          </group>
          
          {/* Head Group */}
          <group ref={headRef} position={[0, 0.66, 0]}>
            {/* Cranium - realistic oval shape */}
            <mesh position={[0, ANATOMY.headHeight / 2, -0.01]}>
              <sphereGeometry args={[0.11, 32, 32]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Face - lower front portion */}
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.03, 0.04]}>
              <sphereGeometry args={[0.095, 24, 24]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            {/* Forehead */}
            <mesh position={[0, ANATOMY.headHeight / 2 + 0.04, 0.06]}>
              <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Brow ridge */}
            <mesh position={[0, ANATOMY.headHeight / 2 + 0.01, 0.09]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.12, 0.02, 0.03]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Cheekbones */}
            <mesh position={[-0.065, ANATOMY.headHeight / 2 - 0.02, 0.06]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            <mesh position={[0.065, ANATOMY.headHeight / 2 - 0.02, 0.06]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            {/* Nose bridge and tip */}
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.01, 0.11]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.025, 0.045, 0.025]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.04, 0.12]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.55} />
            </mesh>
            {/* Nostrils */}
            <mesh position={[-0.012, ANATOMY.headHeight / 2 - 0.05, 0.11]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>
            <mesh position={[0.012, ANATOMY.headHeight / 2 - 0.05, 0.11]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>
            
            {/* Eye sockets (recessed area) */}
            <group position={[0, ANATOMY.headHeight / 2, 0.08]}>
              {/* Left eye */}
              <group position={[-0.038, 0, 0]}>
                <mesh>
                  <sphereGeometry args={[0.022, 24, 24]} />
                  <meshStandardMaterial color="#fafafa" roughness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.015]}>
                  <sphereGeometry args={[0.014, 16, 16]} />
                  <meshStandardMaterial color={eyeColor} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.02]}>
                  <sphereGeometry args={[0.006, 12, 12]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.05} />
                </mesh>
                {/* Eye highlight */}
                <mesh position={[0.004, 0.004, 0.022]}>
                  <sphereGeometry args={[0.002, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
              
              {/* Right eye */}
              <group position={[0.038, 0, 0]}>
                <mesh>
                  <sphereGeometry args={[0.022, 24, 24]} />
                  <meshStandardMaterial color="#fafafa" roughness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.015]}>
                  <sphereGeometry args={[0.014, 16, 16]} />
                  <meshStandardMaterial color={eyeColor} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.02]}>
                  <sphereGeometry args={[0.006, 12, 12]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.05} />
                </mesh>
                <mesh position={[0.004, 0.004, 0.022]}>
                  <sphereGeometry args={[0.002, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            </group>
            
            {/* Eyelids */}
            <mesh position={[-0.038, ANATOMY.headHeight / 2 + 0.012, 0.09]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.032, 0.008, 0.015]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.038, ANATOMY.headHeight / 2 + 0.012, 0.09]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.032, 0.008, 0.015]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Eyebrows */}
            <mesh position={[-0.04, ANATOMY.headHeight / 2 + 0.028, 0.085]} rotation={[0, 0, 0.08]}>
              <boxGeometry args={[0.04, 0.008, 0.012]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.04, ANATOMY.headHeight / 2 + 0.028, 0.085]} rotation={[0, 0, -0.08]}>
              <boxGeometry args={[0.04, 0.008, 0.012]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            
            {/* Jaw and chin */}
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.09, 0.03]}>
              <boxGeometry args={[0.09, 0.05, 0.08]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.11, 0.05]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            
            {/* Mouth area */}
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.065, 0.095]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.025, 0.02, 8, 16]} />
              <meshStandardMaterial color="#c4a07a" roughness={0.5} />
            </mesh>
            {/* Lips */}
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.062, 0.1]}>
              <boxGeometry args={[0.04, 0.012, 0.01]} />
              <meshStandardMaterial color="#b5838d" roughness={0.4} />
            </mesh>
            <mesh position={[0, ANATOMY.headHeight / 2 - 0.072, 0.098]}>
              <boxGeometry args={[0.035, 0.01, 0.01]} />
              <meshStandardMaterial color="#a07178" roughness={0.4} />
            </mesh>
            
            {/* Ears - anatomically shaped */}
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.1, ANATOMY.headHeight / 2 - 0.01, -0.01]}>
                <mesh rotation={[0, side * 0.2, 0]}>
                  <capsuleGeometry args={[0.02, 0.04, 8, 12]} />
                  <meshStandardMaterial color={skinColor} roughness={0.7} />
                </mesh>
                {/* Ear lobe */}
                <mesh position={[0, -0.025, 0.005]}>
                  <sphereGeometry args={[0.012, 8, 8]} />
                  <meshStandardMaterial color={skinColor} roughness={0.7} />
                </mesh>
              </group>
            ))}
            
            {/* Hair - layered for volume */}
            <mesh position={[0, ANATOMY.headHeight / 2 + 0.05, -0.02]}>
              <sphereGeometry args={[0.115, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0, ANATOMY.headHeight / 2 + 0.06, 0.01]}>
              <sphereGeometry args={[0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
              <meshStandardMaterial color={hairColor} roughness={0.85} />
            </mesh>
            {/* Side hair */}
            <mesh position={[-0.085, ANATOMY.headHeight / 2, -0.02]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.085, ANATOMY.headHeight / 2, -0.02]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
          </group>
          
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-ANATOMY.shoulderWidth * shoulderMod / 2 - 0.02, 0.36, 0]}>
            {/* Deltoid */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
            
            {/* Upper arm - bicep/tricep */}
            <mesh position={[-0.02, -0.1, 0]}>
              <capsuleGeometry args={[0.038, 0.14, 8, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            {/* Elbow */}
            <mesh position={[-0.02, -0.2, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            {/* Forearm */}
            <mesh position={[-0.02, -0.32, 0]}>
              <capsuleGeometry args={[0.028, 0.16, 8, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            {/* Wrist */}
            <mesh position={[-0.02, -0.42, 0]}>
              <boxGeometry args={[0.04, 0.025, 0.03]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
            
            {/* Hand */}
            <group ref={leftHandRef} position={[-0.02, -0.46, 0]}>
              {/* Palm */}
              <mesh>
                <boxGeometry args={[0.055, 0.07, 0.025]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
              </mesh>
              {/* Thumb */}
              <mesh position={[0.035, 0.01, 0.01]} rotation={[0, 0, -0.5]}>
                <capsuleGeometry args={[0.008, 0.035, 4, 8]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
              </mesh>
              {/* Fingers */}
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[-0.018 + i * 0.014, -0.055, 0]}>
                  <capsuleGeometry args={[0.006, i === 2 ? 0.04 : 0.035, 4, 8]} />
                  <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
              ))}
            </group>
          </group>
          
          {/* Right Arm */}
          <group ref={rightArmRef} position={[ANATOMY.shoulderWidth * shoulderMod / 2 + 0.02, 0.36, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={clothes.primary} roughness={0.5} />
            </mesh>
            
            <mesh position={[0.02, -0.1, 0]}>
              <capsuleGeometry args={[0.038, 0.14, 8, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            <mesh position={[0.02, -0.2, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            <mesh position={[0.02, -0.32, 0]}>
              <capsuleGeometry args={[0.028, 0.16, 8, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.65} />
            </mesh>
            
            <mesh position={[0.02, -0.42, 0]}>
              <boxGeometry args={[0.04, 0.025, 0.03]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
            
            <group ref={rightHandRef} position={[0.02, -0.46, 0]}>
              <mesh>
                <boxGeometry args={[0.055, 0.07, 0.025]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
              </mesh>
              <mesh position={[-0.035, 0.01, 0.01]} rotation={[0, 0, 0.5]}>
                <capsuleGeometry args={[0.008, 0.035, 4, 8]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
              </mesh>
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[-0.018 + i * 0.014, -0.055, 0]}>
                  <capsuleGeometry args={[0.006, i === 2 ? 0.04 : 0.035, 4, 8]} />
                  <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
        
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.08 * hipMod, -0.06, 0]}>
          {/* Hip joint */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          {/* Thigh - quad/hamstring */}
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 8, 16]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          {/* Knee */}
          <mesh position={[0, -0.32, 0.015]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          {/* Calf */}
          <mesh position={[0, -0.48, -0.01]}>
            <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          {/* Ankle */}
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color="#1f1f1f" roughness={0.4} />
          </mesh>
          
          {/* Foot - shoe */}
          <group position={[0, -0.66, 0.03]}>
            <mesh>
              <boxGeometry args={[0.065, 0.04, ANATOMY.footLength]} />
              <meshStandardMaterial color="#1f1f1f" roughness={0.5} />
            </mesh>
            {/* Toe cap */}
            <mesh position={[0, -0.005, 0.045]}>
              <sphereGeometry args={[0.032, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1f1f1f" roughness={0.5} />
            </mesh>
            {/* Heel */}
            <mesh position={[0, -0.01, -0.045]}>
              <boxGeometry args={[0.055, 0.025, 0.03]} />
              <meshStandardMaterial color="#292929" roughness={0.4} />
            </mesh>
          </group>
        </group>
        
        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.08 * hipMod, -0.06, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 8, 16]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          <mesh position={[0, -0.32, 0.015]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          <mesh position={[0, -0.48, -0.01]}>
            <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
            <meshStandardMaterial color={clothes.secondary} roughness={0.6} />
          </mesh>
          
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color="#1f1f1f" roughness={0.4} />
          </mesh>
          
          <group position={[0, -0.66, 0.03]}>
            <mesh>
              <boxGeometry args={[0.065, 0.04, ANATOMY.footLength]} />
              <meshStandardMaterial color="#1f1f1f" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.005, 0.045]}>
              <sphereGeometry args={[0.032, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1f1f1f" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.01, -0.045]}>
              <boxGeometry args={[0.055, 0.025, 0.03]} />
              <meshStandardMaterial color="#292929" roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
