import { useRef } from 'react';
import { Group } from 'three';
import { BodyPartType, BodyPartConfig, ModelStyle } from '@/store/sceneStore';
import { StyledMaterial } from './ToonMaterials';

// Realistic color palettes for different asset types
const COLORS = {
  // Wood & Materials
  wood: '#8B4513',           // Saddle brown
  woodLight: '#DEB887',      // Burlywood
  woodDark: '#5D3A1A',       // Dark wood
  metal: '#708090',          // Slate gray
  metalDark: '#2F4F4F',      // Dark slate gray
  metalShiny: '#C0C0C0',     // Silver
  glass: '#87CEEB',          // Sky blue
  chrome: '#E8E8E8',         // Chrome
  rubber: '#1a1a1a',         // Tire black
  
  // Fabrics
  fabric: '#DC143C',         // Crimson
  fabricDark: '#8B0000',     // Dark red
  fabricBlue: '#4169E1',     // Royal blue
  
  // Nature
  leaf: '#228B22',           // Forest green
  leafLight: '#90EE90',      // Light green
  leafDark: '#006400',       // Dark green
  leafAutumn: '#D2691E',     // Chocolate (autumn leaves)
  trunk: '#654321',          // Dark brown
  trunkBirch: '#F5F5DC',     // Beige (birch bark)
  grass: '#7CFC00',          // Lawn green
  
  // Animal colors - Dogs
  dogGolden: '#DAA520',      // Goldenrod (Golden Retriever)
  dogCream: '#F5DEB3',       // Wheat (cream colored)
  dogBrown: '#8B4513',       // Saddle brown (Chocolate Lab)
  dogBlack: '#1a1a1a',       // Black (Black Lab)
  dogWhite: '#F5F5F5',       // White smoke (White dogs)
  dogTan: '#D2B48C',         // Tan (Beagle)
  dogNose: '#2a2a2a',        // Dog nose black
  
  // Animal colors - Cats
  catOrange: '#FF8C00',      // Dark orange (Tabby)
  catGray: '#808080',        // Gray (Russian Blue)
  catBlack: '#1a1a1a',       // Black cat
  catWhite: '#FFFAF0',       // Floral white
  catSiamese: '#F5DEB3',     // Wheat (Siamese body)
  catPink: '#FFB6C1',        // Light pink (nose/ears)
  
  // Animal colors - Wild animals
  wolfGray: '#696969',       // Dim gray
  wolfWhite: '#DCDCDC',      // Gainsboro (Arctic wolf)
  tigerOrange: '#FF6600',    // Bright orange
  tigerStripe: '#1a1a1a',    // Black stripes
  lionTan: '#C19A6B',        // Camel
  lionMane: '#8B4513',       // Dark mane
  bearBrown: '#8B4513',      // Saddle brown
  bearPolar: '#F0F0F0',      // White smoke
  foxOrange: '#FF6B35',      // Fox orange
  foxWhite: '#FFFAF0',       // Fox chest
  
  // Animal colors - Birds
  birdBlue: '#4169E1',       // Royal blue (Bluebird)
  birdRed: '#DC143C',        // Crimson (Cardinal)
  birdYellow: '#FFD700',     // Gold (Canary)
  birdGreen: '#32CD32',      // Lime green (Parrot)
  birdBrown: '#8B4513',      // Brown (Sparrow)
  birdBlack: '#1a1a1a',      // Black (Crow)
  beakOrange: '#FF8C00',     // Orange beak
  beakYellow: '#FFD700',     // Yellow beak
  
  // Animal colors - Sea creatures
  fishOrange: '#FF7F00',     // Orange (Goldfish/Clownfish)
  fishBlue: '#1E90FF',       // Dodger blue (Tropical)
  fishSilver: '#C0C0C0',     // Silver (Salmon)
  fishYellow: '#FFD700',     // Gold (Angelfish)
  fishPink: '#FA8072',       // Salmon pink
  dolphinGray: '#708090',    // Slate gray
  dolphinLight: '#B0C4DE',   // Light steel blue (belly)
  whaleBlue: '#2F4F4F',      // Dark slate gray
  sharkGray: '#808080',      // Gray
  sharkWhite: '#E8E8E8',     // Shark belly
  
  // Animal colors - Reptiles
  crocodileGreen: '#2E8B57', // Sea green
  snakeGreen: '#228B22',     // Forest green
  turtleGreen: '#556B2F',    // Dark olive green
  turtleShell: '#8B4513',    // Shell brown
  
  // Fantasy creatures
  dragonGreen: '#228B22',    // Forest green
  dragonRed: '#B22222',      // Firebrick
  dragonBlue: '#4169E1',     // Royal blue
  dragonGold: '#FFD700',     // Gold
  dragonBlack: '#2F2F2F',    // Dark gray
  dragonScale: '#2E8B57',    // Scale highlight
  
  // Primate colors
  gorillaBlack: '#1a1a1a',   // Black
  gorillaGray: '#696969',    // Dim gray (silverback)
  chimpBrown: '#8B4513',     // Saddle brown
  
  // Horse colors
  horseBrown: '#8B4513',     // Bay brown
  horseBlack: '#1a1a1a',     // Black horse
  horseWhite: '#F5F5F5',     // White horse
  horseChestnut: '#954535',  // Chestnut
  horseMane: '#2a2a2a',      // Mane color
  
  // Elephant
  elephantGray: '#808080',   // Gray
  elephantDark: '#696969',   // Darker accents
  
  // Penguin
  penguinBlack: '#1a1a1a',   // Back
  penguinWhite: '#FFFFFF',   // Front
  penguinYellow: '#FFD700',  // Beak accent
  penguinOrange: '#FF8C00',  // Feet
  
  // Rabbit
  rabbitBrown: '#D2B48C',    // Tan rabbit
  rabbitWhite: '#FFFAF0',    // White rabbit
  rabbitPink: '#FFB6C1',     // Inner ears
  
  // Human
  skin: '#FFDAB9',           // Peach puff
  skinLight: '#FFE4C4',      // Bisque
  skinDark: '#D2691E',       // Chocolate
  hair: '#4A3C2A',           // Dark brown
  hairBlonde: '#F0E68C',     // Khaki
  hairBlack: '#1a1a1a',      // Black
  hairRed: '#8B0000',        // Dark red
  
  // General colors
  fur: '#D2691E',
  furDark: '#8B4513',
  water: '#4169E1',
  waterLight: '#87CEEB',
  waterDeep: '#000080',
  stone: '#696969',
  stoneDark: '#404040',
  stoneLight: '#A9A9A9',
  brick: '#B22222',
  concrete: '#A9A9A9',
  
  // Eye colors
  eyeBrown: '#654321',
  eyeBlue: '#4169E1',
  eyeGreen: '#228B22',
  eyeYellow: '#FFD700',
  eyeBlack: '#1a1a1a',
  pupil: '#000000',
  eyeWhite: '#FFFFFF',
  
  // Basic colors
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
  
  // Vehicle colors (most popular car colors)
  carWhite: '#FFFFFF',       // White (most popular)
  carBlack: '#1a1a1a',       // Black
  carSilver: '#C0C0C0',      // Silver
  carGray: '#808080',        // Gray
  carRed: '#CC0000',         // Red
  carBlue: '#0047AB',        // Cobalt blue
  carNavy: '#000080',        // Navy
  carYellow: '#FFD700',      // Yellow (sports cars)
  
  // Tail lights
  tailLight: '#8B0000',      // Dark red
  brakeLight: '#FF0000',     // Bright red
};

export interface ModelProps {
  color?: string;
  bodyParts?: Record<BodyPartType, BodyPartConfig>;
  style?: ModelStyle;
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

export function HumanoidModel({ color = COLORS.skin, bodyParts, style = 'standard' }: ModelProps) {
  const headConfig = getPartConfig(bodyParts, 'head');
  const torsoConfig = getPartConfig(bodyParts, 'torso');
  const leftArmConfig = getPartConfig(bodyParts, 'leftArm');
  const rightArmConfig = getPartConfig(bodyParts, 'rightArm');
  const leftLegConfig = getPartConfig(bodyParts, 'leftLeg');
  const rightLegConfig = getPartConfig(bodyParts, 'rightLeg');

  const skinColor = headConfig.color || color;
  const shirtColor = torsoConfig.color || COLORS.fabric;
  const pantsColor = COLORS.fabricDark;
  const hairColor = COLORS.hair;

  return (
    <group>
      {/* HEAD GROUP */}
      <group position={applyPartTransform([0, 0.95, 0], headConfig)} scale={headConfig.scale}>
        {/* Skull - main head shape */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Face - slightly forward */}
        <mesh position={[0, -0.01, 0.05]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Jaw */}
        <mesh position={[0, -0.08, 0.03]}>
          <boxGeometry args={[0.09, 0.05, 0.08]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Chin */}
        <mesh position={[0, -0.1, 0.05]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Nose bridge */}
        <mesh position={[0, 0, 0.12]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.025, 0.05, 0.03]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Nose tip */}
        <mesh position={[0, -0.02, 0.14]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Eye sockets */}
        <mesh position={[-0.045, 0.02, 0.1]}>
          <sphereGeometry args={[0.025, 14, 14]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0.045, 0.02, 0.1]}>
          <sphereGeometry args={[0.025, 14, 14]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        
        {/* Irises */}
        <mesh position={[-0.045, 0.02, 0.12]}>
          <sphereGeometry args={[0.013, 10, 10]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        <mesh position={[0.045, 0.02, 0.12]}>
          <sphereGeometry args={[0.013, 10, 10]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.045, 0.02, 0.13]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <StyledMaterial color={COLORS.pupil} style={style} />
        </mesh>
        <mesh position={[0.045, 0.02, 0.13]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <StyledMaterial color={COLORS.pupil} style={style} />
        </mesh>
        
        {/* Eyebrows */}
        <mesh position={[-0.045, 0.055, 0.1]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.04, 0.008, 0.015]} />
          <StyledMaterial color={hairColor} style={style} />
        </mesh>
        <mesh position={[0.045, 0.055, 0.1]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.04, 0.008, 0.015]} />
          <StyledMaterial color={hairColor} style={style} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.13, 0, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        <mesh position={[0.13, 0, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        
        {/* Hair top */}
        <mesh position={[0, 0.08, -0.01]}>
          <sphereGeometry args={[0.15, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <StyledMaterial color={hairColor} style={style} />
        </mesh>
        
        {/* Hair sides */}
        <mesh position={[-0.08, 0.04, -0.03]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <StyledMaterial color={hairColor} style={style} />
        </mesh>
        <mesh position={[0.08, 0.04, -0.03]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <StyledMaterial color={hairColor} style={style} />
        </mesh>
        
        {/* Mouth line */}
        <mesh position={[0, -0.06, 0.12]}>
          <boxGeometry args={[0.035, 0.005, 0.008]} />
          <StyledMaterial color="#8b5a5a" style={style} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
        <StyledMaterial color={skinColor} style={style} />
      </mesh>
      
      {/* TORSO */}
      <group position={applyPartTransform([0, 0.55, 0], torsoConfig)} scale={torsoConfig.scale}>
        {/* Chest */}
        <mesh position={[0, 0.05, 0]}>
          <capsuleGeometry args={[0.12, 0.18, 10, 20]} />
          <StyledMaterial color={shirtColor} style={style} />
        </mesh>
        
        {/* Shoulders */}
        <mesh position={[-0.15, 0.08, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <StyledMaterial color={shirtColor} style={style} />
        </mesh>
        <mesh position={[0.15, 0.08, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <StyledMaterial color={shirtColor} style={style} />
        </mesh>
        
        {/* Abdomen */}
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.1, 0.1, 10, 20]} />
          <StyledMaterial color={shirtColor} style={style} />
        </mesh>
      </group>
      
      {/* Pelvis/Hips */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        <StyledMaterial color={pantsColor} style={style} />
      </mesh>
      
      {/* LEFT ARM */}
      <group position={applyPartTransform([-0.2, 0.62, 0], leftArmConfig)} scale={leftArmConfig.scale}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.035, 0.14, 8, 16]} />
          <StyledMaterial color={leftArmConfig.color || skinColor} style={style} />
        </mesh>
        {/* Elbow */}
        <mesh position={[-0.02, -0.16, 0]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.02, -0.26, 0]}>
          <capsuleGeometry args={[0.028, 0.12, 8, 16]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Wrist */}
        <mesh position={[-0.02, -0.34, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Hand palm */}
        <mesh position={[-0.02, -0.38, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.02]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Fingers */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.032 + i * 0.012, -0.42, 0]}>
            <capsuleGeometry args={[0.005, 0.02, 4, 8]} />
            <StyledMaterial color={skinColor} style={style} />
          </mesh>
        ))}
        {/* Thumb */}
        <mesh position={[-0.04, -0.37, 0.015]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.006, 0.02, 4, 8]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT ARM */}
      <group position={applyPartTransform([0.2, 0.62, 0], rightArmConfig)} scale={rightArmConfig.scale}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.035, 0.14, 8, 16]} />
          <StyledMaterial color={rightArmConfig.color || skinColor} style={style} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0.02, -0.16, 0]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.02, -0.26, 0]}>
          <capsuleGeometry args={[0.028, 0.12, 8, 16]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Wrist */}
        <mesh position={[0.02, -0.34, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Hand palm */}
        <mesh position={[0.02, -0.38, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.02]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
        {/* Fingers */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0.008 + i * 0.012, -0.42, 0]}>
            <capsuleGeometry args={[0.005, 0.02, 4, 8]} />
            <StyledMaterial color={skinColor} style={style} />
          </mesh>
        ))}
        {/* Thumb */}
        <mesh position={[0.04, -0.37, 0.015]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.006, 0.02, 4, 8]} />
          <StyledMaterial color={skinColor} style={style} />
        </mesh>
      </group>
      
      {/* LEFT LEG */}
      <group position={applyPartTransform([-0.065, 0.32, 0], leftLegConfig)} scale={leftLegConfig.scale}>
        {/* Thigh */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.048, 0.14, 8, 16]} />
          <StyledMaterial color={leftLegConfig.color || pantsColor} style={style} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.2, 0.015]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={pantsColor} style={style} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.035, 0.16, 8, 16]} />
          <StyledMaterial color={pantsColor} style={style} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.025]}>
          <boxGeometry args={[0.055, 0.03, 0.09]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        {/* Toe cap */}
        <mesh position={[0, -0.45, 0.07]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT LEG */}
      <group position={applyPartTransform([0.065, 0.32, 0], rightLegConfig)} scale={rightLegConfig.scale}>
        {/* Thigh */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.048, 0.14, 8, 16]} />
          <StyledMaterial color={rightLegConfig.color || pantsColor} style={style} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.2, 0.015]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={pantsColor} style={style} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.035, 0.16, 8, 16]} />
          <StyledMaterial color={pantsColor} style={style} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.025]}>
          <boxGeometry args={[0.055, 0.03, 0.09]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        {/* Toe cap */}
        <mesh position={[0, -0.45, 0.07]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
      </group>
    </group>
  );
}

export function RobotModel({ color = COLORS.metal, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Chest plate */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.45, 0.45, 0.25]} />
        <StyledMaterial color={color} style={style} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Core reactor */}
      <mesh position={[0, 0.42, 0.13]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <StyledMaterial color={COLORS.blue} style={style} emissive={COLORS.blue} emissiveIntensity={0.8} />
      </mesh>
      {/* Waist */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.12, 8]} />
        <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.22]} />
        <StyledMaterial color={color} style={style} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.74, 0.11]}>
        <boxGeometry args={[0.22, 0.08, 0.02]} />
        <StyledMaterial color={COLORS.red} style={style} emissive={COLORS.red} emissiveIntensity={0.6} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={1} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.red} style={style} emissive={COLORS.red} emissiveIntensity={0.8} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.28, 0.52, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={color} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.28, 0.52, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={color} style={style} metalness={0.9} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.32, 0.32, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
        <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.32, 0.32, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
        <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.32, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={1} />
      </mesh>
      <mesh position={[0.32, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={1} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, -0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.35, 8]} />
        <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.1, -0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.35, 8]} />
        <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.1, -0.28, 0.02]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <StyledMaterial color={color} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.1, -0.28, 0.02]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <StyledMaterial color={color} style={style} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function DragonModel({ color = COLORS.dragonGreen, style = 'standard' }: ModelProps) {
  const wingColor = COLORS.dragonGold;
  const bellyColor = COLORS.leafLight;
  const scaleColor = COLORS.dragonScale;
  
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]} scale={[1, 0.8, 1.2]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Underbelly plates */}
      <mesh position={[0, 0.22, 0.18]} rotation={[0.2, 0, 0]} scale={[0.7, 0.5, 0.8]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Neck (multiple segments) */}
      <mesh position={[0, 0.52, 0.25]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.25, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0, 0.7, 0.35]} rotation={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0.45]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.15, 0.28]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.82, 0.62]}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[-0.03, 0.84, 0.68]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.03, 0.84, 0.68]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.07, 0.9, 0.55]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} emissive={COLORS.eyeYellow} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.07, 0.9, 0.55]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} emissive={COLORS.eyeYellow} emissiveIntensity={0.3} />
      </mesh>
      {/* Pupils (slit) */}
      <mesh position={[-0.07, 0.9, 0.58]} scale={[0.3, 1, 1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.07, 0.9, 0.58]} scale={[0.3, 1, 1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.08, 0.98, 0.4]} rotation={[0.6, 0.2, -0.4]}>
        <coneGeometry args={[0.025, 0.18, 6]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      <mesh position={[0.08, 0.98, 0.4]} rotation={[0.6, -0.2, 0.4]}>
        <coneGeometry args={[0.025, 0.18, 6]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      {/* Brow ridges */}
      <mesh position={[-0.06, 0.93, 0.52]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <StyledMaterial color={scaleColor} style={style} />
      </mesh>
      <mesh position={[0.06, 0.93, 0.52]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <StyledMaterial color={scaleColor} style={style} />
      </mesh>
      {/* Wings - left */}
      <group position={[-0.3, 0.45, 0.05]} rotation={[0, 0, -0.6]}>
        {/* Wing arm */}
        <mesh position={[-0.15, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.4, 6]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Wing membrane */}
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.35, 0.5, 4]} />
          <StyledMaterial color={wingColor} style={style} opacity={0.85} transparent />
        </mesh>
      </group>
      {/* Wings - right */}
      <group position={[0.3, 0.45, 0.05]} rotation={[0, 0, 0.6]}>
        <mesh position={[0.15, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.4, 6]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.35, 0.5, 4]} />
          <StyledMaterial color={wingColor} style={style} opacity={0.85} transparent />
        </mesh>
      </group>
      {/* Front legs */}
      <mesh position={[-0.18, 0.08, 0.15]} rotation={[0.3, 0, 0.2]}>
        <capsuleGeometry args={[0.05, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.18, 0.08, 0.15]} rotation={[0.3, 0, -0.2]}>
        <capsuleGeometry args={[0.05, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Back legs */}
      <mesh position={[-0.2, 0.1, -0.2]} rotation={[-0.2, 0, 0.2]}>
        <capsuleGeometry args={[0.06, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.1, -0.2]} rotation={[-0.2, 0, -0.2]}>
        <capsuleGeometry args={[0.06, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail segments */}
      <mesh position={[0, 0.18, -0.4]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0, 0.08, -0.65]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail spike */}
      <mesh position={[0, 0.02, -0.82]} rotation={[0.6, 0, 0]}>
        <coneGeometry args={[0.05, 0.15, 4]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      {/* Spinal ridges */}
      {[-0.1, 0.1, 0.25].map((z, i) => (
        <mesh key={i} position={[0, 0.48 - i * 0.08, z]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.03, 0.08, 4]} />
          <StyledMaterial color={scaleColor} style={style} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== ANIMALS ====================

export function DogModel({ color = COLORS.dogGolden, bodyParts, style = 'standard' }: ModelProps) {
  const noseColor = COLORS.dogNose;
  const eyeColor = COLORS.eyeBrown;
  const tongueColor = COLORS.pink;
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
      {/* BODY - Main torso */}
      <group position={applyPartTransform([0, 0.32, 0], torsoConfig)} scale={torsoConfig.scale}>
        {/* Ribcage */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.16, 0.35, 12, 20]} />
          <StyledMaterial color={torsoConfig.color || color} style={style} />
        </mesh>
        {/* Chest - larger front */}
        <mesh position={[0.22, 0.02, 0]}>
          <sphereGeometry args={[0.15, 14, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Belly curve */}
        <mesh position={[-0.05, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.8, 1, 0.9]}>
          <capsuleGeometry args={[0.12, 0.2, 10, 16]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Hip area */}
        <mesh position={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      </group>
      
      {/* HEAD */}
      <group position={applyPartTransform([0.42, 0.45, 0], headConfig)} scale={headConfig.scale}>
        {/* Skull - main head */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 18, 18]} />
          <StyledMaterial color={headConfig.color || color} style={style} />
        </mesh>
        {/* Forehead bump */}
        <mesh position={[0.02, 0.06, 0]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Cheeks */}
        <mesh position={[-0.02, -0.02, 0.08]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[-0.02, -0.02, -0.08]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      </group>
      
      {/* SNOUT / MUZZLE */}
      <group position={applyPartTransform([0.52, 0.42, 0], snoutConfig)} scale={snoutConfig.scale}>
        {/* Upper muzzle */}
        <mesh position={[0, 0.015, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.12, 0.065, 0.085]} />
          <StyledMaterial color={snoutConfig.color || color} style={style} />
        </mesh>
        {/* Muzzle sides */}
        <mesh position={[0.02, 0, 0.035]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0.02, 0, -0.035]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Lower jaw */}
        <mesh position={[-0.01, -0.03, 0]}>
          <boxGeometry args={[0.09, 0.03, 0.06]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Nose */}
        <mesh position={[0.065, 0.02, 0]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <StyledMaterial color={noseColor} style={style} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[0.075, 0.015, 0.008]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        <mesh position={[0.075, 0.015, -0.008]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <StyledMaterial color={COLORS.black} style={style} />
        </mesh>
        {/* Mouth line */}
        <mesh position={[0.04, -0.015, 0]}>
          <boxGeometry args={[0.05, 0.004, 0.04]} />
          <StyledMaterial color={noseColor} style={style} />
        </mesh>
        {/* Tongue */}
        <mesh position={[0.04, -0.035, 0]} rotation={[0.4, 0, 0]}>
          <capsuleGeometry args={[0.012, 0.025, 6, 10]} />
          <StyledMaterial color={tongueColor} style={style} />
        </mesh>
      </group>
      
      {/* EYES */}
      <group position={[0.47, 0.5, 0]}>
        {/* Eye whites */}
        <mesh position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0, 0, -0.055]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        {/* Irises */}
        <mesh position={[0.015, 0, 0.055]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <StyledMaterial color={eyeColor} style={style} />
        </mesh>
        <mesh position={[0.015, 0, -0.055]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <StyledMaterial color={eyeColor} style={style} />
        </mesh>
        {/* Pupils */}
        <mesh position={[0.022, 0, 0.055]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <StyledMaterial color={COLORS.pupil} style={style} />
        </mesh>
        <mesh position={[0.022, 0, -0.055]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <StyledMaterial color={COLORS.pupil} style={style} />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.024, 0.005, 0.058]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <StyledMaterial color={COLORS.white} style={style} />
        </mesh>
        <mesh position={[0.024, 0.005, -0.058]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <StyledMaterial color={COLORS.white} style={style} />
        </mesh>
      </group>
      
      {/* EARS - Floppy style */}
      <group scale={earsConfig.scale} position={applyPartTransform([0, 0, 0], earsConfig)}>
        {/* Right ear */}
        <group position={[0.36, 0.52, 0.1]}>
          <mesh rotation={[0.3, -0.3, 0.6]}>
            <capsuleGeometry args={[0.035, 0.1, 8, 14]} />
            <StyledMaterial color={earsConfig.color || color} style={style} />
          </mesh>
          {/* Ear tip */}
          <mesh position={[-0.04, -0.06, 0]} rotation={[0.4, -0.2, 0.8]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        </group>
        {/* Left ear */}
        <group position={[0.36, 0.52, -0.1]}>
          <mesh rotation={[0.3, 0.3, 0.6]}>
            <capsuleGeometry args={[0.035, 0.1, 8, 14]} />
            <StyledMaterial color={earsConfig.color || color} style={style} />
          </mesh>
          <mesh position={[-0.04, -0.06, 0]} rotation={[0.4, 0.2, 0.8]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        </group>
      </group>
      
      {/* FRONT LEGS */}
      {/* Right front leg */}
      <group position={applyPartTransform([0.2, 0.18, 0.09], rightFrontLegConfig)} scale={rightFrontLegConfig.scale}>
        {/* Shoulder */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <StyledMaterial color={rightFrontLegConfig.color || color} style={style} />
        </mesh>
        {/* Upper leg */}
        <mesh position={[0, -0.04, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.1, 0.01]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Paw */}
        <mesh position={[0.01, -0.26, 0.01]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Toes */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.04, -0.27, -0.015 + i * 0.015]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        ))}
      </group>
      
      {/* Left front leg */}
      <group position={applyPartTransform([0.2, 0.18, -0.09], leftFrontLegConfig)} scale={leftFrontLegConfig.scale}>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <StyledMaterial color={leftFrontLegConfig.color || color} style={style} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0, -0.1, -0.01]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0.01, -0.26, -0.01]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.04, -0.27, 0.015 - i * 0.015]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        ))}
      </group>
      
      {/* BACK LEGS */}
      {/* Right back leg */}
      <group position={applyPartTransform([-0.18, 0.2, 0.1], rightBackLegConfig)} scale={rightBackLegConfig.scale}>
        {/* Hip */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <StyledMaterial color={rightBackLegConfig.color || color} style={style} />
        </mesh>
        {/* Thigh */}
        <mesh position={[-0.02, -0.02, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.048, 0.12, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Knee */}
        <mesh position={[-0.04, -0.12, 0.02]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Hock */}
        <mesh position={[0.02, -0.26, 0]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Paw */}
        <mesh position={[0.02, -0.3, 0.015]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Toes */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.05, -0.31, -0.015 + i * 0.015]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        ))}
      </group>
      
      {/* Left back leg */}
      <group position={applyPartTransform([-0.18, 0.2, -0.1], leftBackLegConfig)} scale={leftBackLegConfig.scale}>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <StyledMaterial color={leftBackLegConfig.color || color} style={style} />
        </mesh>
        <mesh position={[-0.02, -0.02, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.048, 0.12, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[-0.04, -0.12, -0.02]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 14]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0.02, -0.26, 0]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        <mesh position={[0.02, -0.3, -0.015]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.05, -0.31, 0.015 - i * 0.015]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        ))}
      </group>
      
      {/* TAIL - Curved upward, happy dog */}
      <group position={applyPartTransform([-0.32, 0.38, 0], tailConfig)} scale={tailConfig.scale}>
        {/* Tail base */}
        <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0.6]}>
          <capsuleGeometry args={[0.032, 0.1, 8, 12]} />
          <StyledMaterial color={tailConfig.color || color} style={style} />
        </mesh>
        {/* Tail mid */}
        <mesh position={[-0.06, 0.12, 0]} rotation={[0, 0, 1.0]}>
          <capsuleGeometry args={[0.026, 0.08, 8, 12]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Tail tip */}
        <mesh position={[-0.1, 0.18, 0]} rotation={[0, 0, 1.3]}>
          <capsuleGeometry args={[0.02, 0.06, 8, 12]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
        {/* Tail fluff tip */}
        <mesh position={[-0.12, 0.22, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      </group>
    </group>
  );
}

export function CatModel({ color = COLORS.catOrange, style = 'standard' }: ModelProps) {
  const noseColor = COLORS.catPink;
  const eyeColor = COLORS.eyeGreen;
  const innerEarColor = COLORS.catPink;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.09, 0.25, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Chest */}
      <mesh position={[0.15, 0.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.26, 0.28, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0.34, 0.26, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.375, 0.27, 0]}>
        <boxGeometry args={[0.015, 0.012, 0.015]} />
        <StyledMaterial color={noseColor} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.32, 0.32, 0.045]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={eyeColor} style={style} emissive={eyeColor} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0.32, 0.32, -0.045]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={eyeColor} style={style} emissive={eyeColor} emissiveIntensity={0.1} />
      </mesh>
      {/* Pupils (vertical slit) */}
      <mesh position={[0.335, 0.32, 0.045]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.335, 0.32, -0.045]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Ears - outer */}
      <mesh position={[0.22, 0.4, -0.05]} rotation={[0.2, 0.3, 0.15]}>
        <coneGeometry args={[0.035, 0.08, 3]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.22, 0.4, 0.05]} rotation={[0.2, -0.3, 0.15]}>
        <coneGeometry args={[0.035, 0.08, 3]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Ears - inner */}
      <mesh position={[0.23, 0.39, -0.05]} rotation={[0.2, 0.3, 0.15]}>
        <coneGeometry args={[0.02, 0.05, 3]} />
        <StyledMaterial color={innerEarColor} style={style} />
      </mesh>
      <mesh position={[0.23, 0.39, 0.05]} rotation={[0.2, -0.3, 0.15]}>
        <coneGeometry args={[0.02, 0.05, 3]} />
        <StyledMaterial color={innerEarColor} style={style} />
      </mesh>
      {/* Whiskers (simplified as small cylinders) */}
      {[-0.02, 0, 0.02].map((y, i) => (
        <group key={i}>
          <mesh position={[0.35, 0.25 + y, 0.05]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.002, 0.001, 0.06, 4]} />
            <StyledMaterial color={COLORS.white} style={style} />
          </mesh>
          <mesh position={[0.35, 0.25 + y, -0.05]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.002, 0.001, 0.06, 4]} />
            <StyledMaterial color={COLORS.white} style={style} />
          </mesh>
        </group>
      ))}
      {/* Legs */}
      <mesh position={[0.1, 0.06, 0.05]}>
        <capsuleGeometry args={[0.022, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.1, 0.06, -0.05]}>
        <capsuleGeometry args={[0.022, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.1, 0.06, 0.05]}>
        <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.1, 0.06, -0.05]}>
        <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Paws */}
      {[[0.1, 0.05], [0.1, -0.05], [-0.1, 0.05], [-0.1, -0.05]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.01, z]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[-0.28, 0.28, 0]} rotation={[0, 0, 1.3]}>
        <capsuleGeometry args={[0.018, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.38, 0.4, 0]} rotation={[0, 0, 1.8]}>
        <capsuleGeometry args={[0.015, 0.1, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function WolfModel({ color = COLORS.wolfGray, style = 'standard' }: ModelProps) {
  const bellyColor = COLORS.wolfWhite;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.16, 0.4, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.8, 0.9, 0.7]}>
        <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Chest */}
      <mesh position={[0.25, 0.35, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.42, 0.48, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Snout (longer than dog) */}
      <mesh position={[0.56, 0.46, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.12, 0.07, 0.07]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.62, 0.47, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes (more intense) */}
      <mesh position={[0.48, 0.52, 0.05]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} emissive={COLORS.eyeYellow} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.48, 0.52, -0.05]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} emissive={COLORS.eyeYellow} emissiveIntensity={0.2} />
      </mesh>
      {/* Pointed ears */}
      <mesh position={[0.38, 0.62, -0.06]} rotation={[0.1, 0.2, 0.2]}>
        <coneGeometry args={[0.04, 0.1, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.38, 0.62, 0.06]} rotation={[0.1, -0.2, 0.2]}>
        <coneGeometry args={[0.04, 0.1, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.2, 0.12, 0.1]}>
        <capsuleGeometry args={[0.04, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.12, -0.1]}>
        <capsuleGeometry args={[0.04, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.12, 0.1]}>
        <capsuleGeometry args={[0.045, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.12, -0.1]}>
        <capsuleGeometry args={[0.045, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Bushy tail */}
      <mesh position={[-0.42, 0.38, 0]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.05, 0.2, 8, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function TigerModel({ color = COLORS.tigerOrange, style = 'standard' }: ModelProps) {
  const stripeColor = COLORS.tigerStripe;
  const bellyColor = COLORS.white;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.2, 0]} scale={[1, 0.7, 0.8]}>
        <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Stripes on body */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]} rotation={[0, 0, 0.3 + i * 0.1]}>
          <boxGeometry args={[0.02, 0.12, 0.25]} />
          <StyledMaterial color={stripeColor} style={style} />
        </mesh>
      ))}
      {/* Head */}
      <mesh position={[0.32, 0.35, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* White face markings */}
      <mesh position={[0.4, 0.32, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.44, 0.32, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.08]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.48, 0.34, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.pink} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.38, 0.4, 0.06]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      <mesh position={[0.38, 0.4, -0.06]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.25, 0.48, -0.08]} rotation={[0, 0.3, 0.2]}>
        <coneGeometry args={[0.04, 0.06, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.25, 0.48, 0.08]} rotation={[0, -0.3, 0.2]}>
        <coneGeometry args={[0.04, 0.06, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.18, 0.1, 0.1]}>
        <capsuleGeometry args={[0.045, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.18, 0.1, -0.1]}>
        <capsuleGeometry args={[0.045, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.18, 0.1, 0.1]}>
        <capsuleGeometry args={[0.05, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.18, 0.1, -0.1]}>
        <capsuleGeometry args={[0.05, 0.15, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail with stripes */}
      <mesh position={[-0.4, 0.32, 0]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.03, 0.25, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function BirdModel({ color = COLORS.birdBlue, style = 'standard' }: ModelProps) {
  const beakColor = COLORS.beakYellow;
  const bellyColor = COLORS.white;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} scale={[1, 0.85, 0.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Belly */}
      <mesh position={[0.02, 0.12, 0.03]} scale={[0.8, 0.7, 0.6]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.1, 0.24, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Beak - upper */}
      <mesh position={[0.18, 0.24, 0]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.015, 0.06, 4]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      {/* Beak - lower */}
      <mesh position={[0.17, 0.22, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.01, 0.04, 4]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.14, 0.27, 0.035]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      <mesh position={[0.14, 0.27, -0.035]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.15, 0.27, 0.035]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.15, 0.27, -0.035]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Wings - folded */}
      <mesh position={[-0.02, 0.17, 0.08]} rotation={[0.4, 0, 0.2]} scale={[1.2, 1, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.02, 0.17, -0.08]} rotation={[-0.4, 0, 0.2]} scale={[1.2, 1, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail feathers */}
      <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.015, 0.06]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.02, 0.04, 0.025]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      <mesh position={[0.02, 0.04, -0.025]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      {/* Feet */}
      <mesh position={[0.02, 0.01, 0.025]}>
        <boxGeometry args={[0.03, 0.005, 0.02]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      <mesh position={[0.02, 0.01, -0.025]}>
        <boxGeometry args={[0.03, 0.005, 0.02]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
    </group>
  );
}

export function FishModel({ color = COLORS.fishOrange, bodyParts, style = 'standard' }: ModelProps) {
  const finColor = color;
  const bellyColor = COLORS.fishSilver;
  const headConfig = getPartConfig(bodyParts, 'head');
  const torsoConfig = getPartConfig(bodyParts, 'torso');
  const tailFinConfig = getPartConfig(bodyParts, 'tailFin');
  const dorsalFinConfig = getPartConfig(bodyParts, 'dorsalFin');

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Body */}
      <mesh 
        position={applyPartTransform([0, 0.15, 0], torsoConfig)} 
        scale={[torsoConfig.scale[0] * 1.2, torsoConfig.scale[1] * 0.5, torsoConfig.scale[2] * 0.35]}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <StyledMaterial color={torsoConfig.color || color} style={style} />
      </mesh>
      {/* Belly gradient */}
      <mesh position={[0, 0.1, 0]} scale={[1, 0.4, 0.3]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={applyPartTransform([0.15, 0.15, 0], headConfig)} scale={[0.8, 0.6, 0.5]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.18, 0.18, 0.045]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      <mesh position={[0.18, 0.18, -0.045]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.19, 0.18, 0.045]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.19, 0.18, -0.045]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0.22, 0.14, 0]} scale={[0.5, 0.3, 0.4]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <StyledMaterial color={COLORS.pink} style={style} />
      </mesh>
      {/* Tail Fin */}
      <group position={applyPartTransform([-0.22, 0.15, 0], tailFinConfig)} scale={tailFinConfig.scale}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.1, 0.12, 4]} />
          <StyledMaterial color={tailFinConfig.color || finColor} style={style} />
        </mesh>
      </group>
      {/* Dorsal Fin */}
      <mesh 
        position={applyPartTransform([0, 0.26, 0], dorsalFinConfig)} 
        rotation={[0, 0, 0]}
        scale={dorsalFinConfig.scale}
      >
        <coneGeometry args={[0.06, 0.08, 3]} />
        <StyledMaterial color={dorsalFinConfig.color || finColor} style={style} />
      </mesh>
      {/* Pectoral fins */}
      <mesh position={[0.05, 0.1, 0.06]} rotation={[0.5, 0.3, 0]}>
        <coneGeometry args={[0.03, 0.06, 3]} />
        <StyledMaterial color={finColor} style={style} />
      </mesh>
      <mesh position={[0.05, 0.1, -0.06]} rotation={[-0.5, -0.3, 0]}>
        <coneGeometry args={[0.03, 0.06, 3]} />
        <StyledMaterial color={finColor} style={style} />
      </mesh>
      {/* Scales pattern (simplified) */}
      {[0.08, 0, -0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.18, 0]} scale={[0.3, 0.15, 0.4]}>
          <torusGeometry args={[0.08, 0.01, 4, 8, Math.PI]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function DolphinModel({ color = COLORS.dolphinGray, style = 'standard' }: ModelProps) {
  const bellyColor = COLORS.dolphinLight;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1.5, 0.7]}>
        <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.8, 1.4, 0.6]}>
        <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Head/Rostrum */}
      <mesh position={[0.35, 0.22, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Melon (forehead) */}
      <mesh position={[0.25, 0.28, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.28, 0.25, 0.06]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBlack} style={style} />
      </mesh>
      <mesh position={[0.28, 0.25, -0.06]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBlack} style={style} />
      </mesh>
      {/* Dorsal fin */}
      <mesh position={[0, 0.38, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.06, 0.15, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Pectoral fins */}
      <mesh position={[0.1, 0.08, 0.1]} rotation={[0.5, 0.3, -0.5]}>
        <coneGeometry args={[0.04, 0.12, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.1, 0.08, -0.1]} rotation={[-0.5, -0.3, -0.5]}>
        <coneGeometry args={[0.04, 0.12, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail fluke */}
      <mesh position={[-0.35, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.08, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function WhaleModel({ color = COLORS.whaleBlue, style = 'standard' }: ModelProps) {
  const bellyColor = COLORS.dolphinLight;
  
  return (
    <group>
      {/* Body - massive */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.2, 2, 1]}>
        <capsuleGeometry args={[0.25, 0.6, 12, 20]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1.8, 0.9]}>
        <capsuleGeometry args={[0.2, 0.5, 12, 20]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.55, 0.45, 0]} scale={[1.3, 1, 1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Mouth line */}
      <mesh position={[0.65, 0.38, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes (small relative to body) */}
      <mesh position={[0.5, 0.5, 0.18]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBlack} style={style} />
      </mesh>
      <mesh position={[0.5, 0.5, -0.18]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBlack} style={style} />
      </mesh>
      {/* Dorsal fin */}
      <mesh position={[-0.2, 0.68, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.06, 0.12, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Pectoral fins */}
      <mesh position={[0.2, 0.15, 0.25]} rotation={[0.3, 0.2, -0.8]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.15, -0.25]} rotation={[-0.3, -0.2, -0.8]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail fluke */}
      <mesh position={[-0.6, 0.4, 0]} rotation={[Math.PI / 2, 0, 0.2]}>
        <coneGeometry args={[0.2, 0.12, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function CrocodileModel({ color = COLORS.crocodileGreen, style = 'standard' }: ModelProps) {
  const bellyColor = COLORS.leafLight;
  const eyeColor = COLORS.eyeYellow;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.22]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Underbelly */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.65, 0.04, 0.18]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Scales/ridges on back */}
      {[-0.25, -0.1, 0.05, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.18, 0]}>
          <coneGeometry args={[0.03, 0.04, 4]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
      {/* Head */}
      <mesh position={[0.45, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.18]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Snout (long) */}
      <mesh position={[0.65, 0.08, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.1]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[0.74, 0.11, 0.02]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.74, 0.11, -0.02]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes (raised) */}
      <mesh position={[0.42, 0.16, 0.07]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={eyeColor} style={style} />
      </mesh>
      <mesh position={[0.42, 0.16, -0.07]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={eyeColor} style={style} />
      </mesh>
      {/* Pupils (slit) */}
      <mesh position={[0.44, 0.16, 0.07]} scale={[1, 1, 0.3]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.44, 0.16, -0.07]} scale={[1, 1, 0.3]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Teeth hint */}
      <mesh position={[0.55, 0.06, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.5, 0.08, 0]} rotation={[0, 0, 0.05]}>
        <coneGeometry args={[0.08, 0.35, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.72, 0.06, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.05, 0.2, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.2, 0.02, 0.14]} rotation={[0, 0.3, 0.6]}>
        <boxGeometry args={[0.06, 0.08, 0.05]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.02, -0.14]} rotation={[0, -0.3, 0.6]}>
        <boxGeometry args={[0.06, 0.08, 0.05]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.02, 0.14]} rotation={[0, 0.3, 0.6]}>
        <boxGeometry args={[0.06, 0.08, 0.05]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.02, -0.14]} rotation={[0, -0.3, 0.6]}>
        <boxGeometry args={[0.06, 0.08, 0.05]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function GorillaModel({ color = COLORS.gorillaBlack, style = 'standard' }: ModelProps) {
  const faceColor = COLORS.gorillaGray;
  const chestColor = COLORS.gorillaGray;
  
  return (
    <group>
      {/* Body - massive */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Silverback patch */}
      <mesh position={[0, 0.42, -0.12]} scale={[0.9, 0.7, 0.5]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <StyledMaterial color={chestColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.72, 0.05]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Sagittal crest */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.68, 0.16]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <StyledMaterial color={faceColor} style={style} />
      </mesh>
      {/* Brow ridge */}
      <mesh position={[0, 0.76, 0.14]}>
        <boxGeometry args={[0.14, 0.03, 0.06]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.04, 0.73, 0.2]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      <mesh position={[0.04, 0.73, 0.2]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.66, 0.22]}>
        <boxGeometry args={[0.05, 0.03, 0.02]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 0.62, 0.2]}>
        <boxGeometry args={[0.06, 0.015, 0.02]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Arms - long */}
      <mesh position={[-0.32, 0.28, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.32, 0.28, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Hands (fists) */}
      <mesh position={[-0.48, 0.08, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.48, 0.08, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, 0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.12, 0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

// ==================== NEW ANIMALS ====================

export function HorseModel({ color = COLORS.horseBrown, style = 'standard' }: ModelProps) {
  const maneColor = COLORS.horseMane;
  const hoofColor = COLORS.black;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.18, 0.45, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Chest */}
      <mesh position={[0.28, 0.48, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.38, 0.7, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Mane */}
      <mesh position={[0.35, 0.78, -0.02]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.04, 0.3, 0.08]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.52, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.22, 0.12, 0.1]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0.62, 0.86, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[0.66, 0.84, 0.02]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.66, 0.84, -0.02]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.54, 0.94, 0.045]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      <mesh position={[0.54, 0.94, -0.045]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.48, 1.0, -0.03]} rotation={[0.2, 0.2, 0.3]}>
        <coneGeometry args={[0.025, 0.08, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.48, 1.0, 0.03]} rotation={[0.2, -0.2, 0.3]}>
        <coneGeometry args={[0.025, 0.08, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Front legs */}
      <mesh position={[0.22, 0.2, 0.1]}>
        <capsuleGeometry args={[0.04, 0.35, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.22, 0.2, -0.1]}>
        <capsuleGeometry args={[0.04, 0.35, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Back legs */}
      <mesh position={[-0.22, 0.2, 0.1]}>
        <capsuleGeometry args={[0.045, 0.35, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.22, 0.2, -0.1]}>
        <capsuleGeometry args={[0.045, 0.35, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Hooves */}
      {[[0.22, 0.1], [0.22, -0.1], [-0.22, 0.1], [-0.22, -0.1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]}>
          <cylinderGeometry args={[0.04, 0.045, 0.04, 8]} />
          <StyledMaterial color={hoofColor} style={style} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[-0.38, 0.5, 0]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.02, 0.15, 6, 12]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
      <mesh position={[-0.45, 0.38, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.025, 0.2, 6, 12]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
    </group>
  );
}

export function ElephantModel({ color = COLORS.elephantGray, style = 'standard' }: ModelProps) {
  const darkColor = COLORS.elephantDark;
  
  return (
    <group>
      {/* Body - massive */}
      <mesh position={[0, 0.5, 0]} scale={[1.3, 1, 1]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.4, 0.65, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0.55, 0.5, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.06, 0.04, 0.3, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.65, 0.32, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.04, 0.03, 0.2, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.72, 0.18, 0]} rotation={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.03, 0.025, 0.15, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Trunk tip */}
      <mesh position={[0.75, 0.08, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={darkColor} style={style} />
      </mesh>
      {/* Tusks */}
      <mesh position={[0.52, 0.45, 0.08]} rotation={[0, 0.3, 0.5]}>
        <cylinderGeometry args={[0.015, 0.008, 0.15, 6]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      <mesh position={[0.52, 0.45, -0.08]} rotation={[0, -0.3, 0.5]}>
        <cylinderGeometry args={[0.015, 0.008, 0.15, 6]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      {/* Ears - large */}
      <mesh position={[0.3, 0.7, 0.22]} rotation={[0, 0.5, 0]} scale={[0.15, 0.25, 0.02]}>
        <sphereGeometry args={[1, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.3, 0.7, -0.22]} rotation={[0, -0.5, 0]} scale={[0.15, 0.25, 0.02]}>
        <sphereGeometry args={[1, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Eyes (small) */}
      <mesh position={[0.48, 0.72, 0.12]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      <mesh position={[0.48, 0.72, -0.12]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      {/* Legs - thick */}
      <mesh position={[0.2, 0.18, 0.15]}>
        <cylinderGeometry args={[0.08, 0.09, 0.4, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.18, -0.15]}>
        <cylinderGeometry args={[0.08, 0.09, 0.4, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.18, 0.15]}>
        <cylinderGeometry args={[0.08, 0.09, 0.4, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.2, 0.18, -0.15]}>
        <cylinderGeometry args={[0.08, 0.09, 0.4, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.42, 0.45, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.015, 0.01, 0.2, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function PenguinModel({ color = COLORS.penguinBlack, style = 'standard' }: ModelProps) {
  const bellyColor = COLORS.penguinWhite;
  const beakColor = COLORS.penguinYellow;
  const feetColor = COLORS.penguinOrange;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} scale={[1, 1.3, 0.8]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* White belly */}
      <mesh position={[0, 0.2, 0.04]} scale={[0.7, 1.1, 0.5]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* White face patch */}
      <mesh position={[0, 0.4, 0.05]} scale={[0.8, 0.6, 0.5]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <StyledMaterial color={bellyColor} style={style} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.38, 0.1]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.02, 0.05, 4]} />
        <StyledMaterial color={beakColor} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.03, 0.44, 0.06]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      <mesh position={[0.03, 0.44, 0.06]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <StyledMaterial color={COLORS.eyeWhite} style={style} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.03, 0.44, 0.07]}>
        <sphereGeometry args={[0.006, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.03, 0.44, 0.07]}>
        <sphereGeometry args={[0.006, 6, 6]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Wings/Flippers */}
      <mesh position={[-0.12, 0.2, 0]} rotation={[0, 0, 0.3]} scale={[0.15, 0.5, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.12, 0.2, 0]} rotation={[0, 0, -0.3]} scale={[0.15, 0.5, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.04, 0.02, 0.04]}>
        <boxGeometry args={[0.04, 0.02, 0.06]} />
        <StyledMaterial color={feetColor} style={style} />
      </mesh>
      <mesh position={[0.04, 0.02, 0.04]}>
        <boxGeometry args={[0.04, 0.02, 0.06]} />
        <StyledMaterial color={feetColor} style={style} />
      </mesh>
    </group>
  );
}

export function RabbitModel({ color = COLORS.rabbitBrown, style = 'standard' }: ModelProps) {
  const innerEarColor = COLORS.rabbitPink;
  const noseColor = COLORS.pink;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.12, 0]} scale={[0.8, 1, 1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.1, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Cheeks */}
      <mesh position={[0.14, 0.18, 0.04]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.14, 0.18, -0.04]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.18, 0.2, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <StyledMaterial color={noseColor} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.14, 0.24, 0.04]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      <mesh position={[0.14, 0.24, -0.04]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <StyledMaterial color={COLORS.eyeBrown} style={style} />
      </mesh>
      {/* Long ears */}
      <mesh position={[0.06, 0.35, -0.02]} rotation={[0.1, 0.1, 0.1]}>
        <capsuleGeometry args={[0.02, 0.12, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.06, 0.35, 0.02]} rotation={[0.1, -0.1, 0.1]}>
        <capsuleGeometry args={[0.02, 0.12, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Inner ears */}
      <mesh position={[0.07, 0.35, -0.02]} rotation={[0.1, 0.1, 0.1]}>
        <capsuleGeometry args={[0.01, 0.08, 6, 12]} />
        <StyledMaterial color={innerEarColor} style={style} />
      </mesh>
      <mesh position={[0.07, 0.35, 0.02]} rotation={[0.1, -0.1, 0.1]}>
        <capsuleGeometry args={[0.01, 0.08, 6, 12]} />
        <StyledMaterial color={innerEarColor} style={style} />
      </mesh>
      {/* Front legs */}
      <mesh position={[0.06, 0.04, 0.04]}>
        <capsuleGeometry args={[0.018, 0.06, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.06, 0.04, -0.04]}>
        <capsuleGeometry args={[0.018, 0.06, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Back legs (larger) */}
      <mesh position={[-0.06, 0.06, 0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.06, 0.06, -0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Fluffy tail */}
      <mesh position={[-0.12, 0.12, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
    </group>
  );
}

export function FoxModel({ color = COLORS.foxOrange, style = 'standard' }: ModelProps) {
  const chestColor = COLORS.foxWhite;
  const tailTip = COLORS.white;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.25, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Chest */}
      <mesh position={[0.15, 0.18, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <StyledMaterial color={chestColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.25, 0.28, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.35, 0.26, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.035, 0.1, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.4, 0.27, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.28, 0.32, 0.045]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      <mesh position={[0.28, 0.32, -0.045]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      {/* Large pointed ears */}
      <mesh position={[0.2, 0.4, -0.04]} rotation={[0.1, 0.2, 0.15]}>
        <coneGeometry args={[0.035, 0.1, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.2, 0.4, 0.04]} rotation={[0.1, -0.2, 0.15]}>
        <coneGeometry args={[0.035, 0.1, 4]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.1, 0.06, 0.06]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 12]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.1, 0.06, -0.06]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 12]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[-0.1, 0.06, 0.06]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 12]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[-0.1, 0.06, -0.06]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 12]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Bushy tail */}
      <mesh position={[-0.3, 0.22, 0]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.04, 0.15, 8, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.4, 0.28, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <StyledMaterial color={tailTip} style={style} />
      </mesh>
    </group>
  );
}

export function LionModel({ color = COLORS.lionTan, style = 'standard' }: ModelProps) {
  const maneColor = COLORS.lionMane;
  
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.16, 0.4, 8, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Mane */}
      <mesh position={[0.25, 0.45, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
      {/* Head */}
      <mesh position={[0.3, 0.45, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0.42, 0.42, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      {/* Nose */}
      <mesh position={[0.46, 0.44, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.36, 0.5, 0.06]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      <mesh position={[0.36, 0.5, -0.06]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.eyeYellow} style={style} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.22, 0.58, -0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
      <mesh position={[0.22, 0.58, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.18, 0.12, 0.1]}>
        <capsuleGeometry args={[0.045, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.18, 0.12, -0.1]}>
        <capsuleGeometry args={[0.045, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.18, 0.12, 0.1]}>
        <capsuleGeometry args={[0.05, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.18, 0.12, -0.1]}>
        <capsuleGeometry args={[0.05, 0.18, 6, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Tail with tuft */}
      <mesh position={[-0.4, 0.35, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.02, 0.015, 0.25, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.5, 0.42, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={maneColor} style={style} />
      </mesh>
    </group>
  );
}

// ==================== NATURE ====================

export function TreeModel({ color = COLORS.leaf, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.6, 8]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      {/* Trunk texture */}
      <mesh position={[0.06, 0.25, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.02, 0.15, 0.08]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 0.65, 0]}>
        <coneGeometry args={[0.38, 0.45, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.3, 0.38, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.2, 0.28, 8]} />
        <StyledMaterial color={COLORS.leafLight} style={style} />
      </mesh>
    </group>
  );
}

export function WillowTreeModel({ color = COLORS.leaf, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.7, 8]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Hanging branches */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.2;
        const z = Math.sin(rad) * 0.2;
        return (
          <mesh key={i} position={[x, 0.5, z]} rotation={[0.2, rad, 0]}>
            <cylinderGeometry args={[0.015, 0.008, 0.5, 4]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        );
      })}
    </group>
  );
}

export function PalmTreeModel({ color = COLORS.leaf, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Trunk with segments */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      {/* Trunk rings */}
      {[0.15, 0.35, 0.55, 0.75].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.055 + (0.9 - y) * 0.03, 0.008, 4, 8]} />
          <StyledMaterial color={COLORS.woodDark} style={style} />
        </mesh>
      ))}
      {/* Crown base */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      {/* Palm fronds */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh key={i} position={[0, 0.95, 0]} rotation={[0.9, rad, 0]}>
            <boxGeometry args={[0.04, 0.015, 0.45]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        );
      })}
      {/* Coconuts */}
      <mesh position={[0.05, 0.88, 0.03]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      <mesh position={[-0.04, 0.87, -0.02]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
    </group>
  );
}

export function BushModel({ color = COLORS.leaf, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.12, 0.18, 0.08]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <StyledMaterial color={COLORS.leafLight} style={style} />
      </mesh>
      <mesh position={[-0.1, 0.15, -0.06]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Some berries */}
      <mesh position={[0.15, 0.25, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <StyledMaterial color={COLORS.red} style={style} />
      </mesh>
      <mesh position={[-0.08, 0.22, 0.1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <StyledMaterial color={COLORS.red} style={style} />
      </mesh>
    </group>
  );
}

export function FlowerModel({ color = COLORS.pink, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Stem */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.24, 6]} />
        <StyledMaterial color={COLORS.leaf} style={style} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <StyledMaterial color={COLORS.leaf} style={style} />
      </mesh>
      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.035;
        const z = Math.sin(rad) * 0.035;
        return (
          <mesh key={i} position={[x, 0.26, z]} rotation={[0.4, rad, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <StyledMaterial color={color} style={style} />
          </mesh>
        );
      })}
      {/* Center */}
      <mesh position={[0, 0.27, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} />
      </mesh>
    </group>
  );
}

export function RockModel({ color = COLORS.stone, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} scale={[1, 0.6, 0.85]} rotation={[0.1, 0.3, 0.05]}>
        <dodecahedronGeometry args={[0.18, 0]} />
        <StyledMaterial color={color} style={style} roughness={0.95} />
      </mesh>
      {/* Smaller rock detail */}
      <mesh position={[0.12, 0.05, 0.08]} scale={[1, 0.7, 0.9]} rotation={[0.2, 0.5, 0]}>
        <dodecahedronGeometry args={[0.08, 0]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} roughness={0.95} />
      </mesh>
    </group>
  );
}

// ==================== STRUCTURES ====================

export function HouseModel({ color = COLORS.brick, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.75, 0.64, 0.55]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.78, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.55, 0.35, 4]} />
        <StyledMaterial color={COLORS.fabricDark} style={style} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.2, 0.85, -0.1]}>
        <boxGeometry args={[0.1, 0.25, 0.1]} />
        <StyledMaterial color={COLORS.brick} style={style} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.18, 0.28]}>
        <boxGeometry args={[0.14, 0.32, 0.02]} />
        <StyledMaterial color={COLORS.wood} style={style} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.05, 0.18, 0.3]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.8} />
      </mesh>
      {/* Windows */}
      <mesh position={[-0.2, 0.42, 0.28]}>
        <boxGeometry args={[0.12, 0.14, 0.02]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.6} transparent />
      </mesh>
      <mesh position={[0.2, 0.42, 0.28]}>
        <boxGeometry args={[0.12, 0.14, 0.02]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.6} transparent />
      </mesh>
      {/* Window frames */}
      <mesh position={[-0.2, 0.42, 0.29]}>
        <boxGeometry args={[0.13, 0.01, 0.01]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      <mesh position={[0.2, 0.42, 0.29]}>
        <boxGeometry args={[0.13, 0.01, 0.01]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
    </group>
  );
}

export function CottageModel({ color = COLORS.woodLight, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.55, 0.44, 0.45]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Thatched roof */}
      <mesh position={[0, 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.48, 0.32, 4]} />
        <StyledMaterial color={COLORS.fur} style={style} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.12, 0.24]}>
        <boxGeometry args={[0.1, 0.22, 0.02]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      {/* Round window */}
      <mesh position={[0.16, 0.28, 0.24]}>
        <circleGeometry args={[0.05, 12]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.6} transparent />
      </mesh>
      {/* Flowers by door */}
      <mesh position={[-0.2, 0.08, 0.25]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <StyledMaterial color={COLORS.pink} style={style} />
      </mesh>
    </group>
  );
}

export function WallModel({ color = COLORS.brick, style = 'standard' }: ModelProps) {
  return (
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.9, 0.9, 0.08]} />
      <StyledMaterial color={color} style={style} />
    </mesh>
  );
}

export function DoorModel({ color = COLORS.wood, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.38, 0.84, 0.04]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Panels */}
      <mesh position={[0, 0.58, 0.025]}>
        <boxGeometry args={[0.28, 0.25, 0.01]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      <mesh position={[0, 0.25, 0.025]}>
        <boxGeometry args={[0.28, 0.25, 0.01]} />
        <StyledMaterial color={COLORS.woodDark} style={style} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.12, 0.42, 0.035]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function StairsModel({ color = COLORS.stone, style = 'standard' }: ModelProps) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 0.09 + 0.045, i * 0.11]}>
          <boxGeometry args={[0.45, 0.09, 0.11]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function RoofModel({ color = COLORS.fabricDark, style = 'standard' }: ModelProps) {
  return (
    <mesh position={[0, 0.28, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.65, 0.45, 4]} />
      <StyledMaterial color={color} style={style} />
    </mesh>
  );
}

export function DockModel({ color = COLORS.wood, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Planks */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.85, 0.04, 0.38]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Support beams */}
      <mesh position={[-0.32, -0.12, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      <mesh position={[0.32, -0.12, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      <mesh position={[-0.32, -0.12, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
      <mesh position={[0.32, -0.12, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
        <StyledMaterial color={COLORS.trunk} style={style} />
      </mesh>
    </group>
  );
}

// ==================== ROADS & PATHS ====================

export function DirtPathModel({ color = '#8B7355', style = 'standard' }: ModelProps) {
  // Natural dirt path - flat on ground with rough edges
  return (
    <group>
      {/* Main path surface - flat on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Dirt texture variation - darker patches */}
      <mesh position={[-0.3, 0.012, 0.1]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <circleGeometry args={[0.12, 8]} />
        <StyledMaterial color="#6B5344" style={style} />
      </mesh>
      <mesh position={[0.25, 0.012, -0.08]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <circleGeometry args={[0.08, 6]} />
        <StyledMaterial color="#7A6350" style={style} />
      </mesh>
      <mesh position={[0.5, 0.012, 0.15]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <circleGeometry args={[0.1, 7]} />
        <StyledMaterial color="#5C4535" style={style} />
      </mesh>
      {/* Small pebbles along path */}
      {[[-0.4, 0.2], [0.1, -0.22], [0.55, 0.18], [-0.2, -0.2], [0.35, 0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.015, z]} scale={[1, 0.4, 1]}>
          <sphereGeometry args={[0.025 + Math.random() * 0.015, 6, 6]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} />
        </mesh>
      ))}
      {/* Grass tufts at edges */}
      {[[-0.6, 0.25], [0.65, -0.2], [-0.5, -0.28], [0.7, 0.22]].map(([x, z], i) => (
        <mesh key={`grass-${i}`} position={[x, 0.02, z]}>
          <coneGeometry args={[0.02, 0.05, 4]} />
          <StyledMaterial color={COLORS.grass} style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function CobblestoneRoadModel({ color = '#696969', style = 'standard' }: ModelProps) {
  // Medieval cobblestone road - flat with stone pattern
  const stoneColors = ['#606060', '#707070', '#585858', '#686868', '#555555'];
  
  return (
    <group>
      {/* Base layer */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.7]} />
        <StyledMaterial color="#4a4a4a" style={style} />
      </mesh>
      {/* Cobblestones - arranged in rows */}
      {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((x, col) => 
        [-0.25, 0, 0.25].map((z, row) => {
          const offsetX = row % 2 === 0 ? 0 : 0.1;
          const stoneColor = stoneColors[(col + row) % stoneColors.length];
          return (
            <mesh 
              key={`stone-${col}-${row}`} 
              position={[x + offsetX, 0.02, z]} 
              rotation={[-Math.PI / 2, 0, Math.random() * 0.3]}
              scale={[0.9 + Math.random() * 0.2, 0.9 + Math.random() * 0.2, 1]}
            >
              <circleGeometry args={[0.08, 6]} />
              <StyledMaterial color={stoneColor} style={style} />
            </mesh>
          );
        })
      )}
      {/* Edge stones - border */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={`edge-${i}`} position={[x, 0.025, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.05, 0.08, 0.7]} />
          <StyledMaterial color="#505050" style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function AsphaltRoadModel({ color = '#2F2F2F', style = 'standard' }: ModelProps) {
  // Modern asphalt road with lane markings
  return (
    <group>
      {/* Main road surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Center lane marking (dashed) */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <mesh key={`dash-${i}`} position={[x, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.04]} />
          <StyledMaterial color="#F0E68C" style={style} />
        </mesh>
      ))}
      {/* Edge lines */}
      <mesh position={[0, 0.015, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.03]} />
        <StyledMaterial color="#FFFFFF" style={style} />
      </mesh>
      <mesh position={[0, 0.015, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.03]} />
        <StyledMaterial color="#FFFFFF" style={style} />
      </mesh>
      {/* Road texture - subtle cracks/patches */}
      <mesh position={[0.3, 0.012, 0.15]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <planeGeometry args={[0.15, 0.08]} />
        <StyledMaterial color="#383838" style={style} />
      </mesh>
      <mesh position={[-0.5, 0.012, -0.1]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[0.12, 0.06]} />
        <StyledMaterial color="#353535" style={style} />
      </mesh>
    </group>
  );
}

export function PoolModel({ color = COLORS.water, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Pool edge */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.1, 0.16, 0.75]} />
        <StyledMaterial color={COLORS.concrete} style={style} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.95, 0.12, 0.55]} />
        <StyledMaterial color={color} style={style} opacity={0.75} transparent />
      </mesh>
    </group>
  );
}

// ==================== FURNITURE ====================

export function TableModel({ color = COLORS.wood, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Top */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.75, 0.04, 0.45]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      {[[-0.32, 0.18], [0.32, 0.18], [-0.32, -0.18], [0.32, -0.18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.17, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function TableWithClothModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      <TableModel color={COLORS.wood} style={style} />
      {/* Tablecloth */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.8, 0.015, 0.5]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Draping sides */}
      <mesh position={[0, 0.28, 0.26]}>
        <boxGeometry args={[0.8, 0.22, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0, 0.28, -0.26]}>
        <boxGeometry args={[0.8, 0.22, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function ChairModel({ color = COLORS.wood, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[0.28, 0.035, 0.28]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.42, -0.12]}>
        <boxGeometry args={[0.28, 0.36, 0.035]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Legs */}
      {[[-0.11, 0.11], [0.11, 0.11], [-0.11, -0.11], [0.11, -0.11]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]}>
          <cylinderGeometry args={[0.018, 0.018, 0.22, 6]} />
          <StyledMaterial color={color} style={style} />
        </mesh>
      ))}
    </group>
  );
}

export function CouchModel({ color = COLORS.fabric, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.75, 0.22, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.32, -0.11]}>
        <boxGeometry args={[0.75, 0.18, 0.08]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.35, 0.22, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.35, 0.22, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.18, 0.28, 0.01]}>
        <boxGeometry args={[0.28, 0.06, 0.26]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.18, 0.28, 0.01]}>
        <boxGeometry args={[0.28, 0.06, 0.26]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function BedModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.55, 0.12, 0.92]} />
        <StyledMaterial color={COLORS.wood} style={style} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.52, 0.08, 0.88]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.28, -0.35]}>
        <boxGeometry args={[0.38, 0.06, 0.12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.32, -0.44]}>
        <boxGeometry args={[0.55, 0.36, 0.04]} />
        <StyledMaterial color={COLORS.wood} style={style} />
      </mesh>
    </group>
  );
}

export function BunkBedModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Bottom bed */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.85]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Top bed */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.85]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Posts */}
      {[[-0.2, 0.4], [0.2, 0.4], [-0.2, -0.4], [0.2, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.38, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.75, 6]} />
          <StyledMaterial color={COLORS.metal} style={style} metalness={0.8} />
        </mesh>
      ))}
      {/* Ladder */}
      <mesh position={[0.26, 0.38, 0]}>
        <boxGeometry args={[0.03, 0.75, 0.03]} />
        <StyledMaterial color={COLORS.metal} style={style} metalness={0.8} />
      </mesh>
      {/* Ladder rungs */}
      {[0.2, 0.35, 0.5].map((y, i) => (
        <mesh key={i} position={[0.26, y, 0]}>
          <boxGeometry args={[0.08, 0.02, 0.03]} />
          <StyledMaterial color={COLORS.metal} style={style} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function CabinetModel({ color = COLORS.wood, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.48, 0.75, 0.28]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Doors */}
      <mesh position={[-0.11, 0.38, 0.15]}>
        <boxGeometry args={[0.2, 0.65, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.11, 0.38, 0.15]}>
        <boxGeometry args={[0.2, 0.65, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.02, 0.38, 0.16]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.02, 0.38, 0.16]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ==================== ELECTRONICS ====================

export function TVModel({ color = COLORS.black, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.75, 0.45, 0.035]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.32, 0.02]}>
        <boxGeometry args={[0.68, 0.38, 0.008]} />
        <StyledMaterial color={COLORS.blue} style={style} emissive={COLORS.blue} emissiveIntensity={0.25} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function MonitorModel({ color = COLORS.black, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.48, 0.32, 0.025]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.28, 0.015]}>
        <boxGeometry args={[0.42, 0.26, 0.006]} />
        <StyledMaterial color={COLORS.blue} style={style} emissive={COLORS.blue} emissiveIntensity={0.18} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.18, 0.025, 0.1]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function ComputerModel({ color = COLORS.black, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Tower */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.18, 0.45, 0.38]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0, 0.32, 0.2]}>
        <boxGeometry args={[0.12, 0.06, 0.008]} />
        <StyledMaterial color={COLORS.metal} style={style} />
      </mesh>
      {/* Power light */}
      <mesh position={[0, 0.18, 0.2]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <StyledMaterial color={COLORS.green} style={style} emissive={COLORS.green} emissiveIntensity={0.9} />
      </mesh>
      {/* USB ports */}
      <mesh position={[-0.03, 0.25, 0.2]}>
        <boxGeometry args={[0.02, 0.008, 0.008]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      <mesh position={[0.03, 0.25, 0.2]}>
        <boxGeometry args={[0.02, 0.008, 0.008]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
    </group>
  );
}

export function LampModel({ color = COLORS.yellow, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.07, 0.085, 0.035, 12]} />
        <StyledMaterial color={COLORS.metal} style={style} metalness={0.8} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
        <StyledMaterial color={COLORS.metal} style={style} metalness={0.8} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.1, 0.12, 12, 1, true]} />
        <StyledMaterial color={COLORS.white} style={style} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={color} style={style} emissive={color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// ==================== KITCHEN ====================

export function RefrigeratorModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.42, 0.95, 0.38]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Freezer door line */}
      <mesh position={[0, 0.72, 0.2]}>
        <boxGeometry args={[0.38, 0.008, 0.008]} />
        <StyledMaterial color={COLORS.gray} style={style} />
      </mesh>
      {/* Handles */}
      <mesh position={[0.16, 0.85, 0.2]}>
        <boxGeometry args={[0.015, 0.15, 0.015]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
      <mesh position={[0.16, 0.45, 0.2]}>
        <boxGeometry args={[0.015, 0.18, 0.015]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function StoveModel({ color = COLORS.black, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.48, 0.65, 0.38]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Burners */}
      {[[-0.1, 0.1], [0.1, 0.1], [-0.1, -0.06], [0.1, -0.06]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.66, z]}>
          <torusGeometry args={[0.05, 0.008, 6, 12]} />
          <StyledMaterial color={COLORS.metalDark} style={style} metalness={0.9} />
        </mesh>
      ))}
      {/* Oven door */}
      <mesh position={[0, 0.22, 0.2]}>
        <boxGeometry args={[0.38, 0.32, 0.015]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.25} transparent />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.4, 0.22]}>
        <boxGeometry args={[0.25, 0.02, 0.02]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ==================== FOOD ====================

export function FruitBowlModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Bowl */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Fruits */}
      <mesh position={[-0.04, 0.1, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={COLORS.red} style={style} />
      </mesh>
      <mesh position={[0.04, 0.1, 0.025]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <StyledMaterial color={COLORS.orange} style={style} />
      </mesh>
      <mesh position={[0, 0.12, -0.025]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <StyledMaterial color={COLORS.green} style={style} />
      </mesh>
    </group>
  );
}

export function CerealBoxModel({ color = COLORS.yellow, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.05]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.2, 0.026]}>
        <boxGeometry args={[0.08, 0.15, 0.002]} />
        <StyledMaterial color={COLORS.red} style={style} />
      </mesh>
    </group>
  );
}

export function PizzaModel({ color = COLORS.orange, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Crust */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 12]} />
        <StyledMaterial color={COLORS.woodLight} style={style} />
      </mesh>
      {/* Sauce */}
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 12]} />
        <StyledMaterial color={COLORS.red} style={style} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 12]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Pepperoni */}
      {[[0.05, 0.05], [-0.06, 0.02], [0.02, -0.06], [-0.04, -0.03], [0.06, -0.02]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.035, z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.008, 8]} />
          <StyledMaterial color={COLORS.fabricDark} style={style} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== VEHICLES ====================

export function CarModel({ color = COLORS.carRed, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Lower body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.65, 0.12, 0.28]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Upper cabin */}
      <mesh position={[0.02, 0.22, 0]}>
        <boxGeometry args={[0.32, 0.1, 0.24]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Front windshield */}
      <mesh position={[0.17, 0.22, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.08, 0.1, 0.22]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.45} transparent />
      </mesh>
      {/* Rear windshield */}
      <mesh position={[-0.13, 0.22, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.1, 0.22]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.45} transparent />
      </mesh>
      {/* Side windows */}
      <mesh position={[0.02, 0.23, 0.122]}>
        <boxGeometry args={[0.22, 0.06, 0.008]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.45} transparent />
      </mesh>
      <mesh position={[0.02, 0.23, -0.122]}>
        <boxGeometry args={[0.22, 0.06, 0.008]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.45} transparent />
      </mesh>
      {/* Wheels */}
      {[[-0.2, 0.13], [-0.2, -0.13], [0.2, 0.13], [0.2, -0.13]].map(([x, z], i) => (
        <group key={i}>
          {/* Tire */}
          <mesh position={[x, 0.045, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.035, 16]} />
            <StyledMaterial color={COLORS.rubber} style={style} />
          </mesh>
          {/* Rim */}
          <mesh position={[x, 0.045, z > 0 ? z + 0.018 : z - 0.018]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.008, 8]} />
            <StyledMaterial color={COLORS.chrome} style={style} metalness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      <mesh position={[0.32, 0.1, 0.08]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} emissive={COLORS.yellow} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.32, 0.1, -0.08]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} emissive={COLORS.yellow} emissiveIntensity={0.25} />
      </mesh>
      {/* Tail lights */}
      <mesh position={[-0.32, 0.1, 0.08]}>
        <boxGeometry args={[0.015, 0.04, 0.035]} />
        <StyledMaterial color={COLORS.tailLight} style={style} emissive={COLORS.tailLight} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.32, 0.1, -0.08]}>
        <boxGeometry args={[0.015, 0.04, 0.035]} />
        <StyledMaterial color={COLORS.tailLight} style={style} emissive={COLORS.tailLight} emissiveIntensity={0.15} />
      </mesh>
      {/* Grille */}
      <mesh position={[0.328, 0.08, 0]}>
        <boxGeometry args={[0.008, 0.05, 0.12]} />
        <StyledMaterial color={COLORS.black} style={style} />
      </mesh>
      {/* Side mirrors */}
      <mesh position={[0.12, 0.2, 0.15]}>
        <boxGeometry args={[0.02, 0.015, 0.025]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[0.12, 0.2, -0.15]}>
        <boxGeometry args={[0.02, 0.015, 0.025]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function TruckModel({ color = COLORS.carBlue, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Cab */}
      <mesh position={[0.22, 0.18, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Cab windshield */}
      <mesh position={[0.36, 0.22, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.02, 0.18, 0.28]} />
        <StyledMaterial color={COLORS.glass} style={style} opacity={0.45} transparent />
      </mesh>
      {/* Bed */}
      <mesh position={[-0.12, 0.1, 0]}>
        <boxGeometry args={[0.45, 0.12, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Bed walls */}
      <mesh position={[-0.12, 0.2, 0.15]}>
        <boxGeometry args={[0.45, 0.06, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.12, 0.2, -0.15]}>
        <boxGeometry args={[0.45, 0.06, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.34, 0.2, 0]}>
        <boxGeometry args={[0.015, 0.06, 0.32]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Wheels */}
      {[[-0.28, 0.16], [-0.28, -0.16], [0.22, 0.16], [0.22, -0.16]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.045, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <StyledMaterial color={COLORS.rubber} style={style} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[0.36, 0.1, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} emissive={COLORS.yellow} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.36, 0.1, -0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <StyledMaterial color={COLORS.yellow} style={style} emissive={COLORS.yellow} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

export function FireTruckModel({ color = COLORS.red, style = 'standard' }: ModelProps) {
  return (
    <group>
      <TruckModel color={color} style={style} />
      {/* Ladder */}
      <mesh position={[-0.08, 0.32, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.45, 0.03, 0.06]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.85} />
      </mesh>
      {/* Light bar */}
      <mesh position={[0.22, 0.35, 0]}>
        <boxGeometry args={[0.12, 0.035, 0.18]} />
        <StyledMaterial color={COLORS.red} style={style} emissive={COLORS.red} emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}

// ==================== MISCELLANEOUS ====================

export function FireHydrantModel({ color = COLORS.red, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.085, 0.36, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.04, 8]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
        <StyledMaterial color={COLORS.metalShiny} style={style} metalness={0.9} />
      </mesh>
      {/* Outlets */}
      <mesh position={[0.085, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.05, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      <mesh position={[-0.085, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.05, 6]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
    </group>
  );
}

export function ApronModel({ color = COLORS.white, style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.28, 0.45, 0.015]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Neck strap */}
      <mesh position={[0, 0.55, 0]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.07, 0.008, 4, 12, Math.PI]} />
        <StyledMaterial color={color} style={style} />
      </mesh>
      {/* Pocket */}
      <mesh position={[0, 0.18, 0.01]}>
        <boxGeometry args={[0.12, 0.08, 0.008]} />
        <StyledMaterial color={color} style={style} />
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
  'lion': LionModel,
  'bird': BirdModel,
  'fish': FishModel,
  'dolphin': DolphinModel,
  'whale': WhaleModel,
  'crocodile': CrocodileModel,
  'gorilla': GorillaModel,
  'horse': HorseModel,
  'elephant': ElephantModel,
  'penguin': PenguinModel,
  'rabbit': RabbitModel,
  'fox': FoxModel,
  
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
  
  // Roads & Paths
  'road-dirt': DirtPathModel,
  'road-cobble': CobblestoneRoadModel,
  'road-asphalt': AsphaltRoadModel,
  
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
