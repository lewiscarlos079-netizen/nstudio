import { useRef } from 'react';
import { Group } from 'three';
import { BodyPartType, BodyPartConfig } from '@/store/sceneStore';

// Color palettes for different asset types
const COLORS = {
  wood: '#8B4513',
  woodLight: '#DEB887',
  metal: '#708090',
  metalDark: '#2F4F4F',
  glass: '#87CEEB',
  fabric: '#DC143C',
  fabricDark: '#8B0000',
  leaf: '#228B22',
  leafDark: '#006400',
  trunk: '#654321',
  skin: '#FFDAB9',
  fur: '#D2691E',
  furDark: '#8B4513',
  water: '#4169E1',
  stone: '#696969',
  brick: '#B22222',
  concrete: '#A9A9A9',
  white: '#FFFFFF',
  black: '#1a1a1a',
  orange: '#FF8C00',
  yellow: '#FFD700',
  blue: '#1E90FF',
  red: '#DC143C',
  green: '#32CD32',
  pink: '#FF69B4',
  purple: '#9932CC',
  gray: '#808080',
};

export interface ModelProps {
  color?: string;
  bodyParts?: Record<BodyPartType, BodyPartConfig>;
}

// Helper to get part config with defaults
function getPartConfig(
  bodyParts: Record<BodyPartType, BodyPartConfig> | undefined, 
  part: BodyPartType
): { scale: [number, number, number]; offset: [number, number, number]; color?: string } {
  const config = bodyParts?.[part];
  return {
    scale: config?.scale || [1, 1, 1],
    offset: config?.offset || [0, 0, 0],
    color: config?.color,
  };
}

// Helper to apply part transforms
function applyPartTransform(
  basePosition: [number, number, number],
  config: { scale: [number, number, number]; offset: [number, number, number] }
): [number, number, number] {
  return [
    basePosition[0] + config.offset[0],
    basePosition[1] + config.offset[1],
    basePosition[2] + config.offset[2],
  ];
}

// ==================== CHARACTERS ====================

export function HumanoidModel({ color = COLORS.skin, bodyParts }: ModelProps) {
  const headConfig = getPartConfig(bodyParts, 'head');
  const torsoConfig = getPartConfig(bodyParts, 'torso');
  const leftArmConfig = getPartConfig(bodyParts, 'leftArm');
  const rightArmConfig = getPartConfig(bodyParts, 'rightArm');
  const leftLegConfig = getPartConfig(bodyParts, 'leftLeg');
  const rightLegConfig = getPartConfig(bodyParts, 'rightLeg');

  return (
    <group>
      {/* Body/Torso */}
      <mesh 
        position={applyPartTransform([0, 0.4, 0], torsoConfig)}
        scale={torsoConfig.scale}
      >
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={torsoConfig.color || COLORS.fabric} />
      </mesh>
      {/* Head */}
      <mesh 
        position={applyPartTransform([0, 0.9, 0], headConfig)}
        scale={headConfig.scale}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={headConfig.color || color} />
      </mesh>
      {/* Left Arm */}
      <mesh 
        position={applyPartTransform([-0.3, 0.45, 0], leftArmConfig)}
        scale={leftArmConfig.scale}
      >
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={leftArmConfig.color || color} />
      </mesh>
      {/* Right Arm */}
      <mesh 
        position={applyPartTransform([0.3, 0.45, 0], rightArmConfig)}
        scale={rightArmConfig.scale}
      >
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={rightArmConfig.color || color} />
      </mesh>
      {/* Left Leg */}
      <mesh 
        position={applyPartTransform([-0.1, -0.15, 0], leftLegConfig)}
        scale={leftLegConfig.scale}
      >
        <boxGeometry args={[0.14, 0.5, 0.14]} />
        <meshStandardMaterial color={leftLegConfig.color || COLORS.fabricDark} />
      </mesh>
      {/* Right Leg */}
      <mesh 
        position={applyPartTransform([0.1, -0.15, 0], rightLegConfig)}
        scale={rightLegConfig.scale}
      >
        <boxGeometry args={[0.14, 0.5, 0.14]} />
        <meshStandardMaterial color={rightLegConfig.color || COLORS.fabricDark} />
      </mesh>
    </group>
  );
}

export function RobotModel({ color = COLORS.metal }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.25]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.78, 0.13]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={COLORS.red} emissive={COLORS.red} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.08, 0.78, 0.13]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={COLORS.red} emissive={COLORS.red} emissiveIntensity={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.35, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.metalDark} metalness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.metalDark} metalness={0.9} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, -0.1, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color={COLORS.metalDark} metalness={0.9} />
      </mesh>
      <mesh position={[0.12, -0.1, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color={COLORS.metalDark} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function DragonModel({ color = COLORS.red }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.6, 0.3]} rotation={[-0.5, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0.45]}>
        <boxGeometry args={[0.25, 0.2, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.4, 0.6, 4]} />
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.4, 0.6, 4]} />
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.1, -0.5]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.6, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ==================== ANIMALS ====================

export function DogModel({ color = COLORS.furDark, bodyParts }: ModelProps) {
  const headConfig = getPartConfig(bodyParts, 'head');
  const torsoConfig = getPartConfig(bodyParts, 'torso');
  const snoutConfig = getPartConfig(bodyParts, 'snout');
  const earsConfig = getPartConfig(bodyParts, 'ears');
  const leftFrontLegConfig = getPartConfig(bodyParts, 'leftFrontLeg');
  const rightFrontLegConfig = getPartConfig(bodyParts, 'rightFrontLeg');
  const leftBackLegConfig = getPartConfig(bodyParts, 'leftBackLeg');
  const rightBackLegConfig = getPartConfig(bodyParts, 'rightBackLeg');
  const tailConfig = getPartConfig(bodyParts, 'tail');

  return (
    <group>
      {/* Body */}
      <mesh 
        position={applyPartTransform([0, 0.25, 0], torsoConfig)} 
        rotation={[0, 0, Math.PI / 2]}
        scale={torsoConfig.scale}
      >
        <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
        <meshStandardMaterial color={torsoConfig.color || color} />
      </mesh>
      {/* Head */}
      <mesh 
        position={applyPartTransform([0.35, 0.35, 0], headConfig)}
        scale={headConfig.scale}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={headConfig.color || color} />
      </mesh>
      {/* Snout */}
      <mesh 
        position={applyPartTransform([0.48, 0.32, 0], snoutConfig)}
        scale={snoutConfig.scale}
      >
        <boxGeometry args={[0.12, 0.08, 0.1]} />
        <meshStandardMaterial color={snoutConfig.color || color} />
      </mesh>
      {/* Ears */}
      <group scale={earsConfig.scale} position={applyPartTransform([0, 0, 0], earsConfig)}>
        <mesh position={[0.3, 0.5, -0.08]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.05, 0.12, 4]} />
          <meshStandardMaterial color={earsConfig.color || color} />
        </mesh>
        <mesh position={[0.3, 0.5, 0.08]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.05, 0.12, 4]} />
          <meshStandardMaterial color={earsConfig.color || color} />
        </mesh>
      </group>
      {/* Front Right Leg */}
      <mesh 
        position={applyPartTransform([0.2, 0.08, 0.1], rightFrontLegConfig)}
        scale={rightFrontLegConfig.scale}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
        <meshStandardMaterial color={rightFrontLegConfig.color || color} />
      </mesh>
      {/* Front Left Leg */}
      <mesh 
        position={applyPartTransform([0.2, 0.08, -0.1], leftFrontLegConfig)}
        scale={leftFrontLegConfig.scale}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
        <meshStandardMaterial color={leftFrontLegConfig.color || color} />
      </mesh>
      {/* Back Right Leg */}
      <mesh 
        position={applyPartTransform([-0.2, 0.08, 0.1], rightBackLegConfig)}
        scale={rightBackLegConfig.scale}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
        <meshStandardMaterial color={rightBackLegConfig.color || color} />
      </mesh>
      {/* Back Left Leg */}
      <mesh 
        position={applyPartTransform([-0.2, 0.08, -0.1], leftBackLegConfig)}
        scale={leftBackLegConfig.scale}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
        <meshStandardMaterial color={leftBackLegConfig.color || color} />
      </mesh>
      {/* Tail */}
      <mesh 
        position={applyPartTransform([-0.35, 0.35, 0], tailConfig)} 
        rotation={[0, 0, 0.8]}
        scale={tailConfig.scale}
      >
        <cylinderGeometry args={[0.03, 0.02, 0.2, 8]} />
        <meshStandardMaterial color={tailConfig.color || color} />
      </mesh>
    </group>
  );
}

export function CatModel({ color = COLORS.orange }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0.28, 0.28, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.25, 0.42, -0.06]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.04, 0.1, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.25, 0.42, 0.06]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.04, 0.1, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.12, 0.06, 0.06]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.12, 0.06, -0.06]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.12, 0.06, 0.06]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.12, 0.06, -0.06]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.02, 0.015, 0.25, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function WolfModel({ color = COLORS.gray }: ModelProps) {
  return (
    <group scale={[1.3, 1.3, 1.3]}>
      <DogModel color={color} />
    </group>
  );
}

export function TigerModel({ color = COLORS.orange }: ModelProps) {
  return (
    <group scale={[1.5, 1.5, 1.5]}>
      <CatModel color={color} />
    </group>
  );
}

export function BirdModel({ color = COLORS.blue }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0.1, 0.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Beak */}
      <mesh position={[0.2, 0.24, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <meshStandardMaterial color={COLORS.yellow} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0.18, 0.12]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.18, -0.12]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.15, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.02, 0.03, 0.03]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 4]} />
        <meshStandardMaterial color={COLORS.yellow} />
      </mesh>
      <mesh position={[0.02, 0.03, -0.03]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 4]} />
        <meshStandardMaterial color={COLORS.yellow} />
      </mesh>
    </group>
  );
}

export function FishModel({ color = COLORS.blue, bodyParts }: ModelProps) {
  const headConfig = getPartConfig(bodyParts, 'head');
  const torsoConfig = getPartConfig(bodyParts, 'torso');
  const tailFinConfig = getPartConfig(bodyParts, 'tailFin');
  const dorsalFinConfig = getPartConfig(bodyParts, 'dorsalFin');

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Body */}
      <mesh 
        position={applyPartTransform([0, 0.15, 0], torsoConfig)} 
        scale={[torsoConfig.scale[0], torsoConfig.scale[1] * 0.6, torsoConfig.scale[2] * 0.4]}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={torsoConfig.color || color} />
      </mesh>
      {/* Tail Fin */}
      <mesh 
        position={applyPartTransform([-0.25, 0.15, 0], tailFinConfig)} 
        rotation={[0, 0, Math.PI / 4]}
        scale={tailFinConfig.scale}
      >
        <coneGeometry args={[0.12, 0.15, 4]} />
        <meshStandardMaterial color={tailFinConfig.color || color} />
      </mesh>
      {/* Dorsal Fin */}
      <mesh 
        position={applyPartTransform([0, 0.28, 0], dorsalFinConfig)} 
        rotation={[0, 0, 0]}
        scale={dorsalFinConfig.scale}
      >
        <boxGeometry args={[0.1, 0.08, 0.02]} />
        <meshStandardMaterial color={dorsalFinConfig.color || color} />
      </mesh>
      {/* Eye */}
      <mesh position={applyPartTransform([0.12, 0.18, 0.06], headConfig)}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={headConfig.color || COLORS.white} />
      </mesh>
    </group>
  );
}

export function DolphinModel({ color = COLORS.gray }: ModelProps) {
  return (
    <group scale={[1.5, 1.5, 1.5]}>
      <FishModel color={color} />
    </group>
  );
}

export function WhaleModel({ color = COLORS.blue }: ModelProps) {
  return (
    <group scale={[3, 3, 3]}>
      <FishModel color={color} />
    </group>
  );
}

export function CrocodileModel({ color = COLORS.leafDark }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0.5, 0.12, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.7, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.06, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.55, 0.08, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.1, 0.4, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.2, 0.02, 0.15]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0.02, -0.15]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.2, 0.02, 0.15]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.2, 0.02, -0.15]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function GorillaModel({ color = COLORS.black }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0.05]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.65, 0.18]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={COLORS.gray} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.35, 0.25, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.35, 0.25, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.25, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.25, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ==================== NATURE ====================

export function TreeModel({ color = COLORS.leaf }: ModelProps) {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.4, 0.5, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.32, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <coneGeometry args={[0.22, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function WillowTreeModel({ color = COLORS.leaf }: ModelProps) {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      {/* Drooping foliage */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Hanging branches */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]} rotation={[0, i * 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.01, 0.5, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export function PalmTreeModel({ color = COLORS.leaf }: ModelProps) {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      {/* Palm fronds */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 1, 0]} rotation={[0.8, (i * Math.PI) / 3, 0]}>
          <boxGeometry args={[0.05, 0.02, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export function BushModel({ color = COLORS.leaf }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.15, 0.2, 0.1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.12, 0.18, -0.08]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function FlowerModel({ color = COLORS.pink }: ModelProps) {
  return (
    <group>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color={COLORS.leaf} />
      </mesh>
      {/* Petals */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 0.32, 0]} rotation={[0.3, (i * Math.PI) / 3, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Center */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={COLORS.yellow} />
      </mesh>
    </group>
  );
}

export function RockModel({ color = COLORS.stone }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} scale={[1, 0.6, 0.8]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ==================== STRUCTURES ====================

export function HouseModel({ color = COLORS.brick }: ModelProps) {
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.6, 0.4, 4]} />
        <meshStandardMaterial color={COLORS.fabricDark} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.2, 0.31]}>
        <boxGeometry args={[0.15, 0.35, 0.02]} />
        <meshStandardMaterial color={COLORS.wood} />
      </mesh>
      {/* Windows */}
      <mesh position={[-0.2, 0.45, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.7} transparent />
      </mesh>
      <mesh position={[0.2, 0.45, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

export function CottageModel({ color = COLORS.woodLight }: ModelProps) {
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Thatched roof */}
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.5, 0.35, 4]} />
        <meshStandardMaterial color={COLORS.fur} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.15, 0.26]}>
        <boxGeometry args={[0.12, 0.25, 0.02]} />
        <meshStandardMaterial color={COLORS.wood} />
      </mesh>
      {/* Window */}
      <mesh position={[0.18, 0.3, 0.26]}>
        <circleGeometry args={[0.06, 8]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

export function WallModel({ color = COLORS.brick }: ModelProps) {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function DoorModel({ color = COLORS.wood }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.4, 0.9, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.12, 0.45, 0.04]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function StairsModel({ color = COLORS.stone }: ModelProps) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 0.1 + 0.05, i * 0.12]}>
          <boxGeometry args={[0.5, 0.1, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export function RoofModel({ color = COLORS.fabricDark }: ModelProps) {
  return (
    <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.7, 0.5, 4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function DockModel({ color = COLORS.wood }: ModelProps) {
  return (
    <group>
      {/* Planks */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Posts */}
      <mesh position={[-0.35, -0.15, 0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      <mesh position={[0.35, -0.15, 0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      <mesh position={[-0.35, -0.15, -0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      <mesh position={[0.35, -0.15, -0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
    </group>
  );
}

export function PoolModel({ color = COLORS.water }: ModelProps) {
  return (
    <group>
      {/* Pool edge */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.8]} />
        <meshStandardMaterial color={COLORS.concrete} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1, 0.15, 0.6]} />
        <meshStandardMaterial color={color} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

// ==================== FURNITURE ====================

export function TableModel({ color = COLORS.wood }: ModelProps) {
  return (
    <group>
      {/* Top */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.35, 0.18, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.35, 0.18, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function TableWithClothModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      <TableModel color={COLORS.wood} />
      {/* Tablecloth */}
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[0.85, 0.02, 0.55]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Draping sides */}
      <mesh position={[0, 0.3, 0.28]}>
        <boxGeometry args={[0.85, 0.25, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.3, -0.28]}>
        <boxGeometry args={[0.85, 0.25, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function ChairModel({ color = COLORS.wood }: ModelProps) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.45, -0.13]}>
        <boxGeometry args={[0.3, 0.4, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, 0.12, 0.12]}>
        <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.12, 0.12, 0.12]}>
        <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.12, 0.12, -0.12]}>
        <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.12, 0.12, -0.12]}>
        <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function CouchModel({ color = COLORS.fabric }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.35, -0.12]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.38, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.38, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.2, 0.3, 0.02]}>
        <boxGeometry args={[0.3, 0.08, 0.28]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0.3, 0.02]}>
        <boxGeometry args={[0.3, 0.08, 0.28]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function BedModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.6, 0.15, 1]} />
        <meshStandardMaterial color={COLORS.wood} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.55, 0.1, 0.95]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.3, -0.38]}>
        <boxGeometry args={[0.4, 0.08, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.35, -0.48]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color={COLORS.wood} />
      </mesh>
    </group>
  );
}

export function BunkBedModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      {/* Bottom bed */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.9]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Top bed */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.9]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Posts */}
      <mesh position={[-0.22, 0.4, 0.42]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      <mesh position={[0.22, 0.4, 0.42]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      <mesh position={[-0.22, 0.4, -0.42]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      <mesh position={[0.22, 0.4, -0.42]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      {/* Ladder */}
      <mesh position={[0.28, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.04]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
    </group>
  );
}

export function CabinetModel({ color = COLORS.wood }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Doors */}
      <mesh position={[-0.12, 0.4, 0.16]}>
        <boxGeometry args={[0.22, 0.7, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.12, 0.4, 0.16]}>
        <boxGeometry args={[0.22, 0.7, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.02, 0.4, 0.18]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
      </mesh>
      <mesh position={[0.02, 0.4, 0.18]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ==================== ELECTRONICS ====================

export function TVModel({ color = COLORS.black }: ModelProps) {
  return (
    <group>
      {/* Screen */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Display */}
      <mesh position={[0, 0.35, 0.025]}>
        <boxGeometry args={[0.72, 0.42, 0.01]} />
        <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={0.3} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function MonitorModel({ color = COLORS.black }: ModelProps) {
  return (
    <group>
      {/* Screen */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Display */}
      <mesh position={[0, 0.3, 0.02]}>
        <boxGeometry args={[0.45, 0.3, 0.01]} />
        <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={0.2} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function ComputerModel({ color = COLORS.black }: ModelProps) {
  return (
    <group>
      {/* Tower */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0, 0.35, 0.21]}>
        <boxGeometry args={[0.15, 0.08, 0.01]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Power light */}
      <mesh position={[0, 0.2, 0.21]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export function LampModel({ color = COLORS.yellow }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.12, 0.15, 16, 1, true]} />
        <meshStandardMaterial color={COLORS.white} side={2} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ==================== KITCHEN ====================

export function RefrigeratorModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.45, 1, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.18, 0.7, 0.21]}>
        <boxGeometry args={[0.02, 0.2, 0.02]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.25, 0.21]}>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
      </mesh>
      {/* Door line */}
      <mesh position={[0, 0.4, 0.21]}>
        <boxGeometry args={[0.4, 0.01, 0.01]} />
        <meshStandardMaterial color={COLORS.gray} />
      </mesh>
    </group>
  );
}

export function StoveModel({ color = COLORS.black }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Burners */}
      {[[-0.12, 0.12], [0.12, 0.12], [-0.12, -0.08], [0.12, -0.08]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.71, z]}>
          <torusGeometry args={[0.06, 0.01, 8, 16]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} />
        </mesh>
      ))}
      {/* Oven door */}
      <mesh position={[0, 0.25, 0.21]}>
        <boxGeometry args={[0.4, 0.35, 0.02]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// ==================== FOOD ====================

export function FruitBowlModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      {/* Bowl */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
      {/* Fruits */}
      <mesh position={[-0.05, 0.12, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={COLORS.red} />
      </mesh>
      <mesh position={[0.05, 0.12, 0.03]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={COLORS.orange} />
      </mesh>
      <mesh position={[0, 0.14, -0.03]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={COLORS.yellow} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={COLORS.green} />
      </mesh>
    </group>
  );
}

export function CerealBoxModel({ color = COLORS.yellow }: ModelProps) {
  return (
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.15, 0.4, 0.06]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function PizzaModel({ color = COLORS.orange }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 8]} />
        <meshStandardMaterial color={COLORS.woodLight} />
      </mesh>
      {/* Sauce */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 16]} />
        <meshStandardMaterial color={COLORS.red} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Toppings */}
      {[[0.05, 0.05], [-0.08, 0.03], [0.02, -0.08], [-0.05, -0.04]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={COLORS.red} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== VEHICLES ====================

export function CarModel({ color = COLORS.red }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0.05, 0.25, 0]}>
        <boxGeometry args={[0.35, 0.12, 0.26]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windows */}
      <mesh position={[0.05, 0.26, 0.131]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.5} transparent />
      </mesh>
      <mesh position={[0.05, 0.26, -0.131]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color={COLORS.glass} opacity={0.5} transparent />
      </mesh>
      {/* Wheels */}
      {[[-0.22, 0.15], [-0.22, -0.15], [0.22, 0.15], [0.22, -0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color={COLORS.black} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[0.35, 0.12, 0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={COLORS.yellow} emissive={COLORS.yellow} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.35, 0.12, -0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={COLORS.yellow} emissive={COLORS.yellow} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export function TruckModel({ color = COLORS.blue }: ModelProps) {
  return (
    <group>
      {/* Cab */}
      <mesh position={[0.25, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Bed */}
      <mesh position={[-0.15, 0.12, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Bed walls */}
      <mesh position={[-0.15, 0.22, 0.16]}>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.15, 0.22, -0.16]}>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wheels */}
      {[[-0.3, 0.18], [-0.3, -0.18], [0.25, 0.18], [0.25, -0.18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial color={COLORS.black} />
        </mesh>
      ))}
    </group>
  );
}

export function FireTruckModel({ color = COLORS.red }: ModelProps) {
  return (
    <group>
      <TruckModel color={color} />
      {/* Ladder */}
      <mesh position={[-0.1, 0.35, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.04, 0.08]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} />
      </mesh>
      {/* Light bar */}
      <mesh position={[0.25, 0.38, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.2]} />
        <meshStandardMaterial color={COLORS.red} emissive={COLORS.red} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ==================== MISCELLANEOUS ====================

export function FireHydrantModel({ color = COLORS.red }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.05, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Outlets */}
      <mesh position={[0.1, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.1, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function ApronModel({ color = COLORS.white }: ModelProps) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Neck strap */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.08, 0.01, 4, 16, Math.PI]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Pocket */}
      <mesh position={[0, 0.2, 0.015]}>
        <boxGeometry args={[0.15, 0.1, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ==================== MODEL REGISTRY ====================

export const ProceduralModelRegistry: Record<string, React.ComponentType<ModelProps>> = {
  // Characters
  'humanoid': HumanoidModel,
  'robot': RobotModel,
  'dragon': DragonModel,
  
  // Animals
  'dog': DogModel,
  'cat': CatModel,
  'wolf': WolfModel,
  'tiger': TigerModel,
  'bird': BirdModel,
  'fish': FishModel,
  'dolphin': DolphinModel,
  'whale': WhaleModel,
  'crocodile': CrocodileModel,
  'gorilla': GorillaModel,
  
  // Nature
  'tree': TreeModel,
  'willow': WillowTreeModel,
  'palm': PalmTreeModel,
  'bush': BushModel,
  'flower': FlowerModel,
  'rock': RockModel,
  
  // Structures
  'house': HouseModel,
  'cottage': CottageModel,
  'wall': WallModel,
  'door': DoorModel,
  'stairs': StairsModel,
  'roof': RoofModel,
  'dock': DockModel,
  'pool': PoolModel,
  
  // Furniture
  'table': TableModel,
  'table-cloth': TableWithClothModel,
  'chair': ChairModel,
  'couch': CouchModel,
  'bed': BedModel,
  'bunk-bed': BunkBedModel,
  'cabinet': CabinetModel,
  
  // Electronics
  'tv': TVModel,
  'monitor': MonitorModel,
  'computer': ComputerModel,
  'lamp': LampModel,
  
  // Kitchen
  'refrigerator': RefrigeratorModel,
  'stove': StoveModel,
  
  // Food
  'fruit-bowl': FruitBowlModel,
  'cereal': CerealBoxModel,
  'pizza': PizzaModel,
  
  // Vehicles
  'car': CarModel,
  'truck': TruckModel,
  'fire-truck': FireTruckModel,
  
  // Misc
  'fire-hydrant': FireHydrantModel,
  'apron': ApronModel,
};

// Helper function to get the appropriate model component
export function getProceduralModel(modelId: string): React.ComponentType<ModelProps> | null {
  return ProceduralModelRegistry[modelId] || null;
}
