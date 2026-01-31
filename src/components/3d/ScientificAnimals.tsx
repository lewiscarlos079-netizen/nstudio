import { useRef, useMemo } from 'react';
import { Group, Vector3, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { ModelStyle } from '@/store/sceneStore';
import { StyledMaterial } from './Materials';

// Scientific Range of Motion (ROM) presets for anatomically accurate animals
export interface ROMPreset {
  name: string;
  species: string;
  joints: {
    [jointName: string]: {
      minAngle: [number, number, number];
      maxAngle: [number, number, number];
      naturalRest: [number, number, number];
      speed: number;
    };
  };
  gait: 'bipedal' | 'quadrupedal' | 'serpentine' | 'aquatic' | 'avian';
  locomotionCycle: number; // seconds per cycle
}

// Scientific color palettes based on real pigmentation
const SCIENTIFIC_COLORS = {
  // Realistic mammal colors
  elephantGray: '#808080',
  elephantWrinkle: '#606060',
  lionTawny: '#C19A6B',
  lionMane: '#8B6914',
  tigerOrange: '#E25822',
  tigerStripe: '#1C1C1C',
  bearBrown: '#614E1A',
  bearBlack: '#1C1C1C',
  wolfGray: '#707070',
  foxRed: '#B7410E',
  
  // Primate colors
  gorillaBlack: '#1A1A1A',
  gorillaSilverback: '#C0C0C0',
  chimpBrown: '#4A3728',
  
  // Ungulate colors  
  horseBay: '#6B3E26',
  horseBlack: '#1A1A1A',
  horsePalomino: '#E8C87E',
  zebraWhite: '#F5F5F5',
  zebraBlack: '#1A1A1A',
  giraffeOrange: '#C68642',
  giraffeSpot: '#4A3728',
  
  // Marine mammals
  dolphinGray: '#708090',
  dolphinBelly: '#B0C4DE',
  orcaBlack: '#1A1A1A',
  orcaWhite: '#FFFFFF',
  
  // Birds
  eagleFeather: '#4A3728',
  eagleHead: '#FFFFFF',
  eagleBeak: '#FFD700',
  parrotGreen: '#228B22',
  parrotRed: '#DC143C',
  parrotBlue: '#1E90FF',
  
  // Reptiles
  crocodileGreen: '#556B2F',
  snakePython: '#D2B48C',
  snakeEmerald: '#50C878',
  
  // Eyes and features
  eyeAmber: '#FFBF00',
  eyeBrown: '#654321',
  eyeBlue: '#4169E1',
  pupilBlack: '#0A0A0A',
  noseBlack: '#1A1A1A',
  clawIvory: '#FFFFF0',
};

// ROM presets for different species
export const ROM_PRESETS: Record<string, ROMPreset> = {
  elephant: {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    joints: {
      trunk: { minAngle: [-45, -180, -30], maxAngle: [90, 180, 30], naturalRest: [15, 0, 0], speed: 0.8 },
      frontLeftLeg: { minAngle: [-20, 0, -5], maxAngle: [40, 0, 5], naturalRest: [0, 0, 0], speed: 0.4 },
      frontRightLeg: { minAngle: [-20, 0, -5], maxAngle: [40, 0, 5], naturalRest: [0, 0, 0], speed: 0.4 },
      backLeftLeg: { minAngle: [-30, 0, -5], maxAngle: [30, 0, 5], naturalRest: [0, 0, 0], speed: 0.4 },
      backRightLeg: { minAngle: [-30, 0, -5], maxAngle: [30, 0, 5], naturalRest: [0, 0, 0], speed: 0.4 },
      ears: { minAngle: [-15, -30, 0], maxAngle: [15, 30, 0], naturalRest: [0, 10, 0], speed: 0.6 },
      tail: { minAngle: [-10, -20, 0], maxAngle: [30, 20, 0], naturalRest: [15, 0, 0], speed: 0.5 },
    },
    gait: 'quadrupedal',
    locomotionCycle: 2.5,
  },
  lion: {
    name: 'African Lion',
    species: 'Panthera leo',
    joints: {
      head: { minAngle: [-30, -60, -15], maxAngle: [45, 60, 15], naturalRest: [0, 0, 0], speed: 1.2 },
      jaw: { minAngle: [0, 0, 0], maxAngle: [35, 0, 0], naturalRest: [0, 0, 0], speed: 2.0 },
      frontLeftLeg: { minAngle: [-45, 0, -10], maxAngle: [60, 0, 10], naturalRest: [0, 0, 0], speed: 1.5 },
      frontRightLeg: { minAngle: [-45, 0, -10], maxAngle: [60, 0, 10], naturalRest: [0, 0, 0], speed: 1.5 },
      backLeftLeg: { minAngle: [-50, 0, -10], maxAngle: [50, 0, 10], naturalRest: [0, 0, 0], speed: 1.5 },
      backRightLeg: { minAngle: [-50, 0, -10], maxAngle: [50, 0, 10], naturalRest: [0, 0, 0], speed: 1.5 },
      tail: { minAngle: [-20, -45, 0], maxAngle: [45, 45, 0], naturalRest: [10, 0, 0], speed: 0.8 },
    },
    gait: 'quadrupedal',
    locomotionCycle: 1.2,
  },
  horse: {
    name: 'Domestic Horse',
    species: 'Equus caballus',
    joints: {
      head: { minAngle: [-25, -45, -10], maxAngle: [30, 45, 10], naturalRest: [-10, 0, 0], speed: 1.0 },
      neck: { minAngle: [-20, -30, -5], maxAngle: [25, 30, 5], naturalRest: [0, 0, 0], speed: 0.8 },
      frontLeftLeg: { minAngle: [-40, 0, -8], maxAngle: [80, 0, 8], naturalRest: [0, 0, 0], speed: 2.0 },
      frontRightLeg: { minAngle: [-40, 0, -8], maxAngle: [80, 0, 8], naturalRest: [0, 0, 0], speed: 2.0 },
      backLeftLeg: { minAngle: [-60, 0, -8], maxAngle: [60, 0, 8], naturalRest: [0, 0, 0], speed: 2.0 },
      backRightLeg: { minAngle: [-60, 0, -8], maxAngle: [60, 0, 8], naturalRest: [0, 0, 0], speed: 2.0 },
      tail: { minAngle: [-15, -30, 0], maxAngle: [45, 30, 0], naturalRest: [20, 0, 0], speed: 0.6 },
    },
    gait: 'quadrupedal',
    locomotionCycle: 0.8,
  },
  eagle: {
    name: 'Bald Eagle',
    species: 'Haliaeetus leucocephalus',
    joints: {
      head: { minAngle: [-45, -120, -30], maxAngle: [45, 120, 30], naturalRest: [0, 0, 0], speed: 2.0 },
      leftWing: { minAngle: [0, -10, -90], maxAngle: [0, 150, 30], naturalRest: [0, 80, 0], speed: 3.0 },
      rightWing: { minAngle: [0, -150, -30], maxAngle: [0, 10, 90], naturalRest: [0, -80, 0], speed: 3.0 },
      leftLeg: { minAngle: [-20, 0, -10], maxAngle: [90, 0, 10], naturalRest: [30, 0, 0], speed: 1.5 },
      rightLeg: { minAngle: [-20, 0, -10], maxAngle: [90, 0, 10], naturalRest: [30, 0, 0], speed: 1.5 },
      tail: { minAngle: [-10, -20, 0], maxAngle: [30, 20, 0], naturalRest: [5, 0, 0], speed: 1.0 },
    },
    gait: 'avian',
    locomotionCycle: 0.5,
  },
  dolphin: {
    name: 'Bottlenose Dolphin',
    species: 'Tursiops truncatus',
    joints: {
      head: { minAngle: [-15, -20, -10], maxAngle: [15, 20, 10], naturalRest: [0, 0, 0], speed: 1.5 },
      flukes: { minAngle: [-40, 0, 0], maxAngle: [40, 0, 0], naturalRest: [0, 0, 0], speed: 4.0 },
      leftPectoral: { minAngle: [-45, -30, 0], maxAngle: [45, 30, 0], naturalRest: [0, 0, 0], speed: 1.0 },
      rightPectoral: { minAngle: [-45, -30, 0], maxAngle: [45, 30, 0], naturalRest: [0, 0, 0], speed: 1.0 },
      dorsalFin: { minAngle: [0, -5, 0], maxAngle: [0, 5, 0], naturalRest: [0, 0, 0], speed: 0.5 },
    },
    gait: 'aquatic',
    locomotionCycle: 0.6,
  },
  raccoon: {
    name: 'Common Raccoon',
    species: 'Procyon lotor',
    joints: {
      head: { minAngle: [-40, -80, -20], maxAngle: [40, 80, 20], naturalRest: [0, 0, 0], speed: 2.5 },
      frontLeftPaw: { minAngle: [-30, -45, -20], maxAngle: [60, 45, 20], naturalRest: [0, 0, 0], speed: 2.0 },
      frontRightPaw: { minAngle: [-30, -45, -20], maxAngle: [60, 45, 20], naturalRest: [0, 0, 0], speed: 2.0 },
      backLeftLeg: { minAngle: [-40, 0, -10], maxAngle: [50, 0, 10], naturalRest: [0, 0, 0], speed: 1.8 },
      backRightLeg: { minAngle: [-40, 0, -10], maxAngle: [50, 0, 10], naturalRest: [0, 0, 0], speed: 1.8 },
      tail: { minAngle: [-30, -45, 0], maxAngle: [60, 45, 0], naturalRest: [30, 0, 0], speed: 1.2 },
    },
    gait: 'quadrupedal',
    locomotionCycle: 0.9,
  },
};

// Hook for animating with ROM constraints
export function useAnimalROM(romPreset: ROMPreset, isAnimating: boolean = true) {
  const jointRefs = useRef<Record<string, Group | null>>({});
  const phase = useRef(0);

  useFrame((state, delta) => {
    if (!isAnimating) return;
    
    phase.current += delta / romPreset.locomotionCycle;
    const t = phase.current;
    
    Object.entries(romPreset.joints).forEach(([jointName, joint]) => {
      const ref = jointRefs.current[jointName];
      if (!ref) return;
      
      // Calculate sinusoidal movement within ROM constraints
      const amplitude = [
        (joint.maxAngle[0] - joint.minAngle[0]) / 2,
        (joint.maxAngle[1] - joint.minAngle[1]) / 2,
        (joint.maxAngle[2] - joint.minAngle[2]) / 2,
      ];
      
      const center = [
        (joint.maxAngle[0] + joint.minAngle[0]) / 2,
        (joint.maxAngle[1] + joint.minAngle[1]) / 2,
        (joint.maxAngle[2] + joint.minAngle[2]) / 2,
      ];
      
      // Phase offset based on joint for realistic locomotion
      const phaseOffset = jointName.includes('Left') ? 0 : Math.PI;
      const backOffset = jointName.includes('back') || jointName.includes('Back') ? Math.PI / 2 : 0;
      
      ref.rotation.x = ((center[0] + amplitude[0] * Math.sin(t * joint.speed * Math.PI * 2 + phaseOffset + backOffset)) * Math.PI) / 180;
      ref.rotation.y = ((center[1] + amplitude[1] * Math.sin(t * joint.speed * Math.PI * 2 * 0.5)) * Math.PI) / 180;
      ref.rotation.z = ((center[2] + amplitude[2] * Math.sin(t * joint.speed * Math.PI * 2 * 0.3)) * Math.PI) / 180;
    });
  });

  return {
    setJointRef: (name: string, ref: Group | null) => {
      jointRefs.current[name] = ref;
    },
    jointRefs: jointRefs.current,
  };
}

interface ScientificAnimalProps {
  style?: ModelStyle;
  isAnimating?: boolean;
}

// Scientific Elephant - Anatomically Accurate
export function ScientificElephant({ style = 'standard', isAnimating = true }: ScientificAnimalProps) {
  const rom = useAnimalROM(ROM_PRESETS.elephant, isAnimating);
  const breathRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (breathRef.current && isAnimating) {
      // Slow breathing for large mammal
      breathRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
    }
  });

  return (
    <group ref={breathRef}>
      {/* Body - Barrel shaped with realistic proportions */}
      <mesh position={[0, 0.55, 0]} scale={[1.4, 1.1, 1]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
      </mesh>
      
      {/* Neck - thick connection */}
      <mesh position={[0.38, 0.65, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.18, 0.22, 0.2, 16]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
      </mesh>
      
      {/* Head - domed forehead, accurate proportions */}
      <mesh position={[0.5, 0.72, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
      </mesh>
      
      {/* Forehead dome - characteristic feature */}
      <mesh position={[0.58, 0.82, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
      </mesh>
      
      {/* Trunk - articulated with joints */}
      <group ref={(ref) => rom.setJointRef('trunk', ref)} position={[0.62, 0.62, 0]}>
        {/* Trunk segments */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0.04 * i, -0.08 * i, 0]} rotation={[0.1 * i, 0, 0.05 * i]}>
            <cylinderGeometry args={[0.07 - i * 0.01, 0.08 - i * 0.01, 0.1, 12]} />
            <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
          </mesh>
        ))}
        {/* Trunk tip with nostrils */}
        <mesh position={[0.2, -0.42, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
      
      {/* Tusks - ivory */}
      <mesh position={[0.58, 0.56, 0.12]} rotation={[0.1, 0.3, 0.5]}>
        <cylinderGeometry args={[0.025, 0.012, 0.25, 8]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.clawIvory} style={style} surface="bone" />
      </mesh>
      <mesh position={[0.58, 0.56, -0.12]} rotation={[-0.1, -0.3, 0.5]}>
        <cylinderGeometry args={[0.025, 0.012, 0.25, 8]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.clawIvory} style={style} surface="bone" />
      </mesh>
      
      {/* Ears - large African elephant style */}
      <group ref={(ref) => rom.setJointRef('ears', ref)}>
        <mesh position={[0.3, 0.78, 0.28]} rotation={[0, 0.7, 0.15]} scale={[0.22, 0.32, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
        <mesh position={[0.3, 0.78, -0.28]} rotation={[0, -0.7, 0.15]} scale={[0.22, 0.32, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
      </group>
      
      {/* Eyes - small relative to head */}
      <mesh position={[0.54, 0.78, 0.2]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.eyeAmber} style={style} />
      </mesh>
      <mesh position={[0.54, 0.78, -0.2]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.eyeAmber} style={style} />
      </mesh>
      
      {/* Legs - columnar with proper joint structure */}
      <group ref={(ref) => rom.setJointRef('frontLeftLeg', ref)} position={[0.25, 0.2, 0.18]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
        {/* Foot pad */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('frontRightLeg', ref)} position={[0.25, 0.2, -0.18]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('backLeftLeg', ref)} position={[-0.25, 0.2, 0.18]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('backRightLeg', ref)} position={[-0.25, 0.2, -0.18]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} surface="skin" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
      
      {/* Tail */}
      <group ref={(ref) => rom.setJointRef('tail', ref)} position={[-0.42, 0.48, 0]}>
        <mesh rotation={[0, 0, 0.6]}>
          <capsuleGeometry args={[0.02, 0.2, 6, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantGray} style={style} />
        </mesh>
        {/* Tail tuft */}
        <mesh position={[-0.12, -0.08, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.elephantWrinkle} style={style} />
        </mesh>
      </group>
    </group>
  );
}

// Scientific Lion - Male with Mane
export function ScientificLion({ style = 'standard', isAnimating = true }: ScientificAnimalProps) {
  const rom = useAnimalROM(ROM_PRESETS.lion, isAnimating);
  const breathRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (breathRef.current && isAnimating) {
      breathRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    }
  });

  return (
    <group ref={breathRef}>
      {/* Body - muscular feline */}
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.14, 0.4, 12, 20]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
      </mesh>
      
      {/* Chest - powerful musculature */}
      <mesh position={[0.22, 0.3, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0.32, 0.38, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 12]} />
        <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
      </mesh>
      
      {/* Mane - multiple layers for realism */}
      <group>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <mesh 
            key={i} 
            position={[
              0.38 + Math.cos((angle * Math.PI) / 180) * 0.08,
              0.48 + Math.sin((angle * Math.PI) / 180) * 0.06,
              Math.sin((angle * Math.PI) / 180) * 0.1
            ]}
            rotation={[0, 0, (angle * Math.PI) / 180]}
          >
            <sphereGeometry args={[0.08 + Math.random() * 0.03, 10, 10]} />
            <StyledMaterial color={SCIENTIFIC_COLORS.lionMane} style={style} surface="fur" />
          </mesh>
        ))}
      </group>
      
      {/* Head */}
      <group ref={(ref) => rom.setJointRef('head', ref)} position={[0.42, 0.48, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        
        {/* Muzzle */}
        <mesh position={[0.1, -0.02, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.08]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.15, -0.01, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.noseBlack} style={style} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.08, 0.04, 0.05]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.eyeAmber} style={style} />
        </mesh>
        <mesh position={[0.08, 0.04, -0.05]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.eyeAmber} style={style} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[0, 0.1, 0.08]} rotation={[0, 0.3, 0.3]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, 0.1, -0.08]} rotation={[0, -0.3, 0.3]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
      </group>
      
      {/* Front legs */}
      <group ref={(ref) => rom.setJointRef('frontLeftLeg', ref)} position={[0.18, 0.12, 0.08]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.2, 8, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('frontRightLeg', ref)} position={[0.18, 0.12, -0.08]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.2, 8, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
      </group>
      
      {/* Back legs - more muscular */}
      <group ref={(ref) => rom.setJointRef('backLeftLeg', ref)} position={[-0.2, 0.12, 0.08]}>
        <mesh>
          <capsuleGeometry args={[0.05, 0.2, 8, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('backRightLeg', ref)} position={[-0.2, 0.12, -0.08]}>
        <mesh>
          <capsuleGeometry args={[0.05, 0.2, 8, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
      </group>
      
      {/* Tail with tuft */}
      <group ref={(ref) => rom.setJointRef('tail', ref)} position={[-0.35, 0.25, 0]}>
        <mesh rotation={[0, 0, 0.8]}>
          <capsuleGeometry args={[0.015, 0.25, 6, 12]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionTawny} style={style} surface="fur" />
        </mesh>
        <mesh position={[-0.18, -0.08, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.lionMane} style={style} surface="fur" />
        </mesh>
      </group>
    </group>
  );
}

// Scientific Raccoon - Detailed with mask and rings
export function ScientificRaccoon({ style = 'standard', isAnimating = true }: ScientificAnimalProps) {
  const rom = useAnimalROM(ROM_PRESETS.raccoon, isAnimating);
  
  const grayFur = '#505050';
  const maskBlack = '#1A1A1A';
  const lightFur = '#A0A0A0';
  const tailRing = '#2A2A2A';

  return (
    <group>
      {/* Body - stocky */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.08, 0.18, 10, 16]} />
        <StyledMaterial color={grayFur} style={style} surface="fur" />
      </mesh>
      
      {/* Head */}
      <group ref={(ref) => rom.setJointRef('head', ref)} position={[0.15, 0.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 14, 14]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
        
        {/* Pointed snout */}
        <mesh position={[0.06, -0.01, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.04, 0.08, 8]} />
          <StyledMaterial color={lightFur} style={style} surface="fur" />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.1, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <StyledMaterial color={maskBlack} style={style} />
        </mesh>
        
        {/* Eye mask - characteristic */}
        <mesh position={[0.04, 0.02, 0]} scale={[0.8, 0.4, 1.2]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={maskBlack} style={style} surface="fur" />
        </mesh>
        
        {/* Eyes within mask */}
        <mesh position={[0.05, 0.025, 0.03]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.eyeBrown} style={style} />
        </mesh>
        <mesh position={[0.05, 0.025, -0.03]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <StyledMaterial color={SCIENTIFIC_COLORS.eyeBrown} style={style} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[0, 0.08, 0.04]} rotation={[0, 0.2, 0.3]}>
          <coneGeometry args={[0.025, 0.04, 6]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, 0.08, -0.04]} rotation={[0, -0.2, 0.3]}>
          <coneGeometry args={[0.025, 0.04, 6]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
      </group>
      
      {/* Front paws - dexterous */}
      <group ref={(ref) => rom.setJointRef('frontLeftPaw', ref)} position={[0.08, 0.06, 0.05]}>
        <mesh>
          <capsuleGeometry args={[0.02, 0.1, 6, 10]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={maskBlack} style={style} />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('frontRightPaw', ref)} position={[0.08, 0.06, -0.05]}>
        <mesh>
          <capsuleGeometry args={[0.02, 0.1, 6, 10]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={maskBlack} style={style} />
        </mesh>
      </group>
      
      {/* Back legs */}
      <group ref={(ref) => rom.setJointRef('backLeftLeg', ref)} position={[-0.1, 0.06, 0.05]}>
        <mesh>
          <capsuleGeometry args={[0.025, 0.1, 6, 10]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
      </group>
      
      <group ref={(ref) => rom.setJointRef('backRightLeg', ref)} position={[-0.1, 0.06, -0.05]}>
        <mesh>
          <capsuleGeometry args={[0.025, 0.1, 6, 10]} />
          <StyledMaterial color={grayFur} style={style} surface="fur" />
        </mesh>
      </group>
      
      {/* Ringed tail */}
      <group ref={(ref) => rom.setJointRef('tail', ref)} position={[-0.18, 0.18, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[-0.03 * i, 0.02 * i, 0]} rotation={[0, 0, 0.3 + i * 0.1]}>
            <cylinderGeometry args={[0.025 - i * 0.002, 0.028 - i * 0.002, 0.04, 10]} />
            <StyledMaterial color={i % 2 === 0 ? grayFur : tailRing} style={style} surface="fur" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Export registry for scientific animals
export const ScientificAnimalRegistry = {
  'scientific-elephant': ScientificElephant,
  'scientific-lion': ScientificLion,
  'scientific-raccoon': ScientificRaccoon,
};

export { SCIENTIFIC_COLORS };
