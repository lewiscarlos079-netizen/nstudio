import { StyledMaterial } from './ToonMaterials';
import { ModelStyle } from '@/store/sceneStore';

interface ModelProps {
  style?: ModelStyle;
}

// Uncharted color palette
const COLORS = {
  // Nathan Drake
  drakeSkin: '#E8B89D',
  drakeHair: '#4A3728',
  drakeHenley: '#7B8B6F', // Olive/khaki henley
  drakePants: '#4A4A4A', // Dark jeans
  drakeBelt: '#5C4033',
  drakeBoots: '#3D2B1F',
  
  // Elena Fisher
  elenaSkin: '#F5D0B9',
  elenaHair: '#D4A84B', // Blonde
  elenaShirt: '#E8E4DC', // Light cream
  elenaPants: '#6B5B4F', // Khaki brown
  
  // Victor Sullivan (Sully)
  sullySkin: '#DDA68B',
  sullyHair: '#A0A0A0', // Gray
  sullyShirt: '#C9583C', // Hawaiian red/coral
  sullyShirtPattern: '#E8D4A8',
  sullyPants: '#D4C4A8', // Tan khakis
  
  // Chloe Frazer
  chloeSkin: '#C9956C',
  chloeHair: '#1A1A1A', // Black
  chloeTop: '#2B2B2B', // Dark tactical
  chloePants: '#3D3D3D',
  
  // Environment
  stone: '#8B8378',
  stoneDark: '#5C564F',
  stoneLight: '#A9A296',
  moss: '#4A5D23',
  gold: '#FFD700',
  goldDark: '#B8860B',
  wood: '#8B4513',
  woodDark: '#5D3A1A',
  vine: '#355E3B',
  
  // Common
  eyeWhite: '#FFFFFF',
  eyeBrown: '#654321',
  eyeBlue: '#4169E1',
  eyeGreen: '#2E8B57',
  pupil: '#000000',
  leather: '#3D2B1F',
  metal: '#708090',
};

// Nathan Drake - Adventure explorer with proper joint mapping
export function NathanDrakeModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* HEAD */}
      <group position={[0, 0.95, 0]}>
        <mesh>
          <sphereGeometry args={[0.13, 24, 24]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        
        {/* Stubble/jaw definition */}
        <mesh position={[0, -0.06, 0.04]}>
          <boxGeometry args={[0.1, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        
        {/* Hair - messy short style */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.14, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <StyledMaterial color={COLORS.drakeHair} style={style} />
        </mesh>
        <mesh position={[0, 0.02, 0.08]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.06]} />
          <StyledMaterial color={COLORS.drakeHair} style={style} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        <mesh position={[0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.01, 0.12]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
      </group>
      
      {/* NECK JOINT - connects head to torso */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <StyledMaterial color={COLORS.drakeSkin} style={style} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.08, 12]} />
        <StyledMaterial color={COLORS.drakeSkin} style={style} />
      </mesh>
      
      {/* TORSO - Henley shirt */}
      <group position={[0, 0.58, 0]}>
        <mesh>
          <capsuleGeometry args={[0.11, 0.16, 10, 20]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} />
        </mesh>
        
        {/* Henley collar/buttons */}
        <mesh position={[0, 0.1, 0.09]}>
          <boxGeometry args={[0.03, 0.08, 0.02]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        
        {/* SHOULDER JOINTS */}
        <mesh position={[-0.14, 0.06, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} />
        </mesh>
        <mesh position={[0.14, 0.06, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} />
        </mesh>
      </group>
      
      {/* SPINE CONNECTION - torso to pelvis */}
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <StyledMaterial color={COLORS.drakeHenley} style={style} />
      </mesh>
      
      {/* Belt with holster */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <StyledMaterial color={COLORS.drakeBelt} style={style} />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.03]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      
      {/* LEFT ARM with joints */}
      <group position={[-0.18, 0.64, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[-0.02, -0.16, 0]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.02, -0.24, 0]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[-0.02, -0.32, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.02, -0.38, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.02]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT ARM with joints */}
      <group position={[0.18, 0.64, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[0.02, -0.16, 0]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.02, -0.24, 0]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[0.02, -0.32, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.02, -0.38, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.02]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} />
        </mesh>
      </group>
      
      {/* HIP JOINTS */}
      <mesh position={[-0.055, 0.34, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <StyledMaterial color={COLORS.drakePants} style={style} />
      </mesh>
      <mesh position={[0.055, 0.34, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <StyledMaterial color={COLORS.drakePants} style={style} />
      </mesh>
      
      {/* LEFT LEG with joints */}
      <group position={[-0.055, 0.34, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.045, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.18, 0.01]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <StyledMaterial color={COLORS.drakeBoots} style={style} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.4, 0.02]}>
          <boxGeometry args={[0.06, 0.06, 0.1]} />
          <StyledMaterial color={COLORS.drakeBoots} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT LEG with joints */}
      <group position={[0.055, 0.34, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.045, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.18, 0.01]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.drakePants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <StyledMaterial color={COLORS.drakeBoots} style={style} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.4, 0.02]}>
          <boxGeometry args={[0.06, 0.06, 0.1]} />
          <StyledMaterial color={COLORS.drakeBoots} style={style} />
        </mesh>
      </group>
    </group>
  );
}

// Elena Fisher - Journalist explorer with proper joint mapping
export function ElenaFisherModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* HEAD */}
      <group position={[0, 0.92, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 24, 24]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        
        {/* Blonde hair - ponytail style */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.13, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <StyledMaterial color={COLORS.elenaHair} style={style} />
        </mesh>
        <mesh position={[-0.08, 0.02, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={COLORS.elenaHair} style={style} />
        </mesh>
        <mesh position={[0.08, 0.02, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={COLORS.elenaHair} style={style} />
        </mesh>
        <mesh position={[0, 0, -0.12]} rotation={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.03, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.elenaHair} style={style} />
        </mesh>
        
        {/* Eyes - blue */}
        <mesh position={[-0.035, 0.02, 0.095]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0.035, 0.02, 0.095]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[-0.035, 0.02, 0.108]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBlue} style={style} />
        </mesh>
        <mesh position={[0.035, 0.02, 0.108]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBlue} style={style} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.01, 0.11]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
      </group>
      
      {/* NECK JOINT */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <StyledMaterial color={COLORS.elenaSkin} style={style} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.06, 12]} />
        <StyledMaterial color={COLORS.elenaSkin} style={style} />
      </mesh>
      
      {/* TORSO */}
      <group position={[0, 0.58, 0]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.14, 10, 20]} />
          <StyledMaterial color={COLORS.elenaShirt} style={style} />
        </mesh>
        {/* SHOULDER JOINTS */}
        <mesh position={[-0.11, 0.05, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={COLORS.elenaShirt} style={style} />
        </mesh>
        <mesh position={[0.11, 0.05, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={COLORS.elenaShirt} style={style} />
        </mesh>
      </group>
      
      {/* SPINE CONNECTION */}
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <StyledMaterial color={COLORS.elenaShirt} style={style} />
      </mesh>
      
      {/* Belt */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.03, 16]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      
      {/* LEFT ARM with joints */}
      <group position={[-0.14, 0.63, 0]}>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaShirt} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[-0.01, -0.15, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        <mesh position={[-0.01, -0.22, 0]}>
          <capsuleGeometry args={[0.022, 0.08, 8, 12]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[-0.01, -0.28, 0]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.01, -0.33, 0]}>
          <boxGeometry args={[0.035, 0.04, 0.018]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT ARM with joints */}
      <group position={[0.14, 0.63, 0]}>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaShirt} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[0.01, -0.15, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        <mesh position={[0.01, -0.22, 0]}>
          <capsuleGeometry args={[0.022, 0.08, 8, 12]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[0.01, -0.28, 0]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.01, -0.33, 0]}>
          <boxGeometry args={[0.035, 0.04, 0.018]} />
          <StyledMaterial color={COLORS.elenaSkin} style={style} />
        </mesh>
      </group>
      
      {/* HIP JOINTS */}
      <mesh position={[-0.045, 0.36, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <StyledMaterial color={COLORS.elenaPants} style={style} />
      </mesh>
      <mesh position={[0.045, 0.36, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <StyledMaterial color={COLORS.elenaPants} style={style} />
      </mesh>
      
      {/* LEFT LEG with joints */}
      <group position={[-0.045, 0.36, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.37, 0.015]}>
          <boxGeometry args={[0.05, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT LEG with joints */}
      <group position={[0.045, 0.36, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.elenaPants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.37, 0.015]}>
          <boxGeometry args={[0.05, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
      </group>
    </group>
  );
}

// Victor Sullivan (Sully) - Veteran mentor with proper joint mapping
export function VictorSullivanModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* HEAD */}
      <group position={[0, 0.95, 0]}>
        <mesh>
          <sphereGeometry args={[0.14, 24, 24]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        
        {/* Mustache */}
        <mesh position={[0, -0.03, 0.12]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <StyledMaterial color={COLORS.sullyHair} style={style} />
        </mesh>
        
        {/* Gray hair - receding */}
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <StyledMaterial color={COLORS.sullyHair} style={style} />
        </mesh>
        <mesh position={[-0.1, 0.02, -0.02]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <StyledMaterial color={COLORS.sullyHair} style={style} />
        </mesh>
        <mesh position={[0.1, 0.02, -0.02]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <StyledMaterial color={COLORS.sullyHair} style={style} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.045, 0.02, 0.1]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0.045, 0.02, 0.1]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[-0.045, 0.02, 0.115]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        <mesh position={[0.045, 0.02, 0.115]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <StyledMaterial color={COLORS.eyeBrown} style={style} />
        </mesh>
        
        {/* Nose - larger */}
        <mesh position={[0, -0.01, 0.13]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        
        {/* Cigar */}
        <mesh position={[0.06, -0.06, 0.12]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.008, 0.006, 0.06, 8]} />
          <StyledMaterial color="#8B4513" style={style} />
        </mesh>
      </group>
      
      {/* NECK JOINT */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <StyledMaterial color={COLORS.sullySkin} style={style} />
      </mesh>
      <mesh position={[0, 0.77, 0]}>
        <cylinderGeometry args={[0.05, 0.055, 0.08, 12]} />
        <StyledMaterial color={COLORS.sullySkin} style={style} />
      </mesh>
      
      {/* TORSO */}
      <group position={[0, 0.55, 0]}>
        <mesh>
          <capsuleGeometry args={[0.13, 0.18, 10, 20]} />
          <StyledMaterial color={COLORS.sullyShirt} style={style} />
        </mesh>
        {/* Shirt pattern accents */}
        <mesh position={[-0.06, 0.02, 0.1]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <StyledMaterial color={COLORS.sullyShirtPattern} style={style} />
        </mesh>
        <mesh position={[0.06, 0.05, 0.1]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <StyledMaterial color={COLORS.sullyShirtPattern} style={style} />
        </mesh>
        <mesh position={[0, -0.05, 0.11]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <StyledMaterial color={COLORS.sullyShirtPattern} style={style} />
        </mesh>
        
        {/* SHOULDER JOINTS */}
        <mesh position={[-0.16, 0.06, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <StyledMaterial color={COLORS.sullyShirt} style={style} />
        </mesh>
        <mesh position={[0.16, 0.06, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <StyledMaterial color={COLORS.sullyShirt} style={style} />
        </mesh>
      </group>
      
      {/* SPINE CONNECTION */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <StyledMaterial color={COLORS.sullyShirt} style={style} />
      </mesh>
      
      {/* Belt */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      
      {/* LEFT ARM with joints */}
      <group position={[-0.2, 0.61, 0]}>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.sullyShirt} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[-0.02, -0.18, 0]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        <mesh position={[-0.02, -0.28, 0]}>
          <capsuleGeometry args={[0.035, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[-0.02, -0.36, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.02, -0.42, 0]}>
          <boxGeometry args={[0.045, 0.05, 0.025]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT ARM with joints */}
      <group position={[0.2, 0.61, 0]}>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 12]} />
          <StyledMaterial color={COLORS.sullyShirt} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[0.02, -0.18, 0]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        <mesh position={[0.02, -0.28, 0]}>
          <capsuleGeometry args={[0.035, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[0.02, -0.36, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.02, -0.42, 0]}>
          <boxGeometry args={[0.045, 0.05, 0.025]} />
          <StyledMaterial color={COLORS.sullySkin} style={style} />
        </mesh>
      </group>
      
      {/* HIP JOINTS */}
      <mesh position={[-0.06, 0.32, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <StyledMaterial color={COLORS.sullyPants} style={style} />
      </mesh>
      <mesh position={[0.06, 0.32, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <StyledMaterial color={COLORS.sullyPants} style={style} />
      </mesh>
      
      {/* LEFT LEG with joints */}
      <group position={[-0.06, 0.32, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.05, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.04, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.38, 0.02]}>
          <boxGeometry args={[0.06, 0.06, 0.1]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT LEG with joints */}
      <group position={[0.06, 0.32, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.05, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.04, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.sullyPants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.38, 0.02]}>
          <boxGeometry args={[0.06, 0.06, 0.1]} />
          <StyledMaterial color={COLORS.leather} style={style} />
        </mesh>
      </group>
    </group>
  );
}

// Chloe Frazer - Tactical treasure hunter with proper joint mapping
export function ChloeFrazerModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* HEAD */}
      <group position={[0, 0.92, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 24, 24]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        
        {/* Black hair - wavy/messy */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.135, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <StyledMaterial color={COLORS.chloeHair} style={style} />
        </mesh>
        <mesh position={[-0.09, 0, -0.02]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={COLORS.chloeHair} style={style} />
        </mesh>
        <mesh position={[0.09, 0, -0.02]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <StyledMaterial color={COLORS.chloeHair} style={style} />
        </mesh>
        <mesh position={[-0.1, -0.08, -0.04]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.03, 0.1, 6, 8]} />
          <StyledMaterial color={COLORS.chloeHair} style={style} />
        </mesh>
        <mesh position={[0.1, -0.08, -0.04]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.03, 0.1, 6, 8]} />
          <StyledMaterial color={COLORS.chloeHair} style={style} />
        </mesh>
        
        {/* Eyes - green */}
        <mesh position={[-0.035, 0.02, 0.095]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[0.035, 0.02, 0.095]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <StyledMaterial color={COLORS.eyeWhite} style={style} />
        </mesh>
        <mesh position={[-0.035, 0.02, 0.108]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <StyledMaterial color={COLORS.eyeGreen} style={style} />
        </mesh>
        <mesh position={[0.035, 0.02, 0.108]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <StyledMaterial color={COLORS.eyeGreen} style={style} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.01, 0.11]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
      </group>
      
      {/* NECK JOINT */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <StyledMaterial color={COLORS.chloeSkin} style={style} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.06, 12]} />
        <StyledMaterial color={COLORS.chloeSkin} style={style} />
      </mesh>
      
      {/* TORSO */}
      <group position={[0, 0.58, 0]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.14, 10, 20]} />
          <StyledMaterial color={COLORS.chloeTop} style={style} />
        </mesh>
        {/* SHOULDER JOINTS */}
        <mesh position={[-0.11, 0.05, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={COLORS.chloeTop} style={style} />
        </mesh>
        <mesh position={[0.11, 0.05, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={COLORS.chloeTop} style={style} />
        </mesh>
      </group>
      
      {/* SPINE CONNECTION */}
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <StyledMaterial color={COLORS.chloeTop} style={style} />
      </mesh>
      
      {/* Tactical belt with pouches */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.088, 0.088, 0.035, 16]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      <mesh position={[-0.08, 0.42, 0.04]}>
        <boxGeometry args={[0.03, 0.04, 0.025]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      <mesh position={[0.08, 0.42, 0.04]}>
        <boxGeometry args={[0.03, 0.04, 0.025]} />
        <StyledMaterial color={COLORS.leather} style={style} />
      </mesh>
      
      {/* LEFT ARM with joints */}
      <group position={[-0.14, 0.63, 0]}>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloeTop} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[-0.01, -0.15, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        <mesh position={[-0.01, -0.22, 0]}>
          <capsuleGeometry args={[0.022, 0.08, 8, 12]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[-0.01, -0.28, 0]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.01, -0.33, 0]}>
          <boxGeometry args={[0.035, 0.04, 0.018]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
      </group>
      
      {/* RIGHT ARM with joints */}
      <group position={[0.14, 0.63, 0]}>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.028, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloeTop} style={style} />
        </mesh>
        {/* ELBOW JOINT */}
        <mesh position={[0.01, -0.15, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        <mesh position={[0.01, -0.22, 0]}>
          <capsuleGeometry args={[0.022, 0.08, 8, 12]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        {/* WRIST JOINT */}
        <mesh position={[0.01, -0.28, 0]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.01, -0.33, 0]}>
          <boxGeometry args={[0.035, 0.04, 0.018]} />
          <StyledMaterial color={COLORS.chloeSkin} style={style} />
        </mesh>
      </group>
      
      {/* HIP JOINTS */}
      <mesh position={[-0.045, 0.36, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <StyledMaterial color={COLORS.chloePants} style={style} />
      </mesh>
      <mesh position={[0.045, 0.36, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <StyledMaterial color={COLORS.chloePants} style={style} />
      </mesh>
      
      {/* LEFT LEG with joints */}
      <group position={[-0.045, 0.36, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color="#1a1a1a" style={style} />
        </mesh>
        {/* Tactical boot */}
        <mesh position={[0, -0.38, 0.015]}>
          <boxGeometry args={[0.05, 0.06, 0.085]} />
          <StyledMaterial color="#1a1a1a" style={style} />
        </mesh>
      </group>
      
      {/* RIGHT LEG with joints */}
      <group position={[0.045, 0.36, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.038, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        {/* KNEE JOINT */}
        <mesh position={[0, -0.17, 0.01]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 12]} />
          <StyledMaterial color={COLORS.chloePants} style={style} />
        </mesh>
        {/* ANKLE JOINT */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color="#1a1a1a" style={style} />
        </mesh>
        {/* Tactical boot */}
        <mesh position={[0, -0.38, 0.015]}>
          <boxGeometry args={[0.05, 0.06, 0.085]} />
          <StyledMaterial color="#1a1a1a" style={style} />
        </mesh>
      </group>
    </group>
  );
}

// Ancient Temple Ruins
export function AncientTempleModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      
      {/* Steps */}
      <mesh position={[0, 0.15, 0.45]}>
        <boxGeometry args={[0.8, 0.1, 0.3]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      <mesh position={[0, 0.25, 0.35]}>
        <boxGeometry args={[0.7, 0.1, 0.2]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      
      {/* Main structure */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.8]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      
      {/* Pillars */}
      {[[-0.35, 0.55, 0.35], [0.35, 0.55, 0.35], [-0.35, 0.55, -0.3], [0.35, 0.55, -0.3]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.6, 12]} />
            <StyledMaterial color={COLORS.stoneLight} style={style} />
          </mesh>
          {/* Pillar cap */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.15, 0.08, 0.15]} />
            <StyledMaterial color={COLORS.stone} style={style} />
          </mesh>
        </group>
      ))}
      
      {/* Roof/lintel */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1, 0.12, 0.9]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      
      {/* Decorative carvings */}
      <mesh position={[0, 0.5, 0.41]}>
        <boxGeometry args={[0.4, 0.2, 0.02]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
      
      {/* Moss/vegetation */}
      <mesh position={[-0.4, 0.7, 0.35]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={COLORS.moss} style={style} />
      </mesh>
      <mesh position={[0.3, 0.85, -0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <StyledMaterial color={COLORS.moss} style={style} />
      </mesh>
    </group>
  );
}

// Treasure Chest
export function TreasureChestModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Chest base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.25]} />
        <StyledMaterial color={COLORS.wood} style={style} />
      </mesh>
      
      {/* Chest lid (slightly open) */}
      <group position={[0, 0.2, -0.1]} rotation={[-0.3, 0, 0]}>
        <mesh position={[0, 0.06, 0.05]}>
          <boxGeometry args={[0.4, 0.08, 0.25]} />
          <StyledMaterial color={COLORS.wood} style={style} />
        </mesh>
        {/* Rounded top */}
        <mesh position={[0, 0.1, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.125, 0.125, 0.4, 12, 1, false, 0, Math.PI]} />
          <StyledMaterial color={COLORS.woodDark} style={style} />
        </mesh>
      </group>
      
      {/* Gold trim/bands */}
      <mesh position={[0, 0.1, 0.13]}>
        <boxGeometry args={[0.42, 0.04, 0.01]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
      <mesh position={[0, 0.1, -0.13]}>
        <boxGeometry args={[0.42, 0.04, 0.01]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
      
      {/* Lock */}
      <mesh position={[0, 0.18, 0.13]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <StyledMaterial color={COLORS.goldDark} style={style} />
      </mesh>
      
      {/* Gold coins peeking out */}
      <mesh position={[-0.08, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
      <mesh position={[0.05, 0.23, 0.03]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
    </group>
  );
}

// Stone Artifact
export function StoneArtifactModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.06, 8]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      
      {/* Main artifact body */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 6]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      
      {/* Top ornament */}
      <mesh position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.08]} />
        <StyledMaterial color={COLORS.gold} style={style} />
      </mesh>
      
      {/* Carved symbols/details */}
      <mesh position={[0.11, 0.18, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.04]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      <mesh position={[-0.11, 0.18, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.04]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
    </group>
  );
}

// Jungle Ruins
export function JungleRuinsModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Ruined walls */}
      <mesh position={[-0.4, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.8]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      <mesh position={[0.4, 0.15, 0.2]}>
        <boxGeometry args={[0.12, 0.3, 0.5]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      
      {/* Broken pillar */}
      <mesh position={[0.1, 0.15, -0.3]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 10]} />
        <StyledMaterial color={COLORS.stoneLight} style={style} />
      </mesh>
      
      {/* Fallen stones */}
      <mesh position={[0.2, 0.05, 0.3]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.15]} />
        <StyledMaterial color={COLORS.stone} style={style} />
      </mesh>
      <mesh position={[-0.15, 0.04, 0.35]}>
        <boxGeometry args={[0.12, 0.08, 0.1]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} />
      </mesh>
      
      {/* Vines */}
      <mesh position={[-0.42, 0.35, 0.2]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.02, 0.3, 4, 8]} />
        <StyledMaterial color={COLORS.vine} style={style} />
      </mesh>
      <mesh position={[-0.38, 0.4, -0.15]} rotation={[0.2, 0, -0.15]}>
        <capsuleGeometry args={[0.015, 0.25, 4, 8]} />
        <StyledMaterial color={COLORS.vine} style={style} />
      </mesh>
      
      {/* Moss patches */}
      <mesh position={[-0.35, 0.45, 0.1]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <StyledMaterial color={COLORS.moss} style={style} />
      </mesh>
      <mesh position={[0.38, 0.25, 0.15]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <StyledMaterial color={COLORS.moss} style={style} />
      </mesh>
      <mesh position={[0.1, 0.28, -0.28]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <StyledMaterial color={COLORS.moss} style={style} />
      </mesh>
    </group>
  );
}
