import { StyledMaterial, SurfaceType } from './Materials';
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
          <StyledMaterial color={COLORS.drakeSkin} style={style} surface="skin" />
        </mesh>
        
        {/* Stubble/jaw definition */}
        <mesh position={[0, -0.06, 0.04]}>
          <boxGeometry args={[0.1, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} surface="skin" />
        </mesh>
        
        {/* Hair - messy short style */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.14, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <StyledMaterial color={COLORS.drakeHair} style={style} surface="hair" />
        </mesh>
        <mesh position={[0, 0.02, 0.08]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.06]} />
          <StyledMaterial color={COLORS.drakeHair} style={style} surface="hair" />
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
          <StyledMaterial color={COLORS.drakeHenley} style={style} surface="fabric" />
        </mesh>
        
        {/* Henley collar/buttons */}
        <mesh position={[0, 0.1, 0.09]}>
          <boxGeometry args={[0.03, 0.08, 0.02]} />
          <StyledMaterial color={COLORS.drakeSkin} style={style} surface="skin" />
        </mesh>
        
        {/* SHOULDER JOINTS */}
        <mesh position={[-0.14, 0.06, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} surface="fabric" />
        </mesh>
        <mesh position={[0.14, 0.06, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <StyledMaterial color={COLORS.drakeHenley} style={style} surface="fabric" />
        </mesh>
      </group>
      
      {/* SPINE CONNECTION - torso to pelvis */}
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <StyledMaterial color={COLORS.drakeHenley} style={style} surface="fabric" />
      </mesh>
      
      {/* Belt with holster */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <StyledMaterial color={COLORS.drakeBelt} style={style} surface="leather" />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.03]} />
        <StyledMaterial color={COLORS.leather} style={style} surface="leather" />
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

// Ancient Temple Ruins - Detailed with inscriptions, varied pillars, weathering
export function AncientTempleModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* Foundation - weathered stone blocks */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.4, 0.06, 1.4]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.25, 0.04, 1.25]} />
        <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
      </mesh>
      
      {/* Main platform with carved edges */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[1.15, 0.08, 1.15]} />
        <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
      </mesh>
      
      {/* Decorative border carvings on platform */}
      {[-0.52, 0.52].map((x, i) => (
        <mesh key={`border-${i}`} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.03, 0.1, 1.1]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
      ))}
      
      {/* Grand staircase with worn steps */}
      {[0, 1, 2, 3].map((step) => (
        <mesh key={`step-${step}`} position={[0, 0.12 + step * 0.06, 0.5 + step * 0.08]}>
          <boxGeometry args={[0.7 + step * 0.05, 0.06, 0.12]} />
          <StyledMaterial color={step % 2 === 0 ? COLORS.stone : COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
      ))}
      
      {/* Main inner chamber */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.85, 0.4, 0.75]} />
        <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
      </mesh>
      
      {/* PILLARS - Various states of decay */}
      {/* Front left - intact Doric style */}
      <group position={[-0.42, 0, 0.42]}>
        {/* Base */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Fluted column */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.065, 0.08, 0.62, 12]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Capital - Doric echinus */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.09, 0.065, 0.06, 12]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        {/* Abacus */}
        <mesh position={[0, 0.93, 0]}>
          <boxGeometry args={[0.18, 0.04, 0.18]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* Front right - partially broken */}
      <group position={[0.42, 0, 0.42]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Broken column - shorter */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.065, 0.08, 0.36, 12]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Jagged break at top */}
        <mesh position={[0.02, 0.62, 0.01]} rotation={[0.2, 0.3, 0.1]}>
          <coneGeometry args={[0.04, 0.06, 5]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        {/* Fallen piece nearby */}
        <mesh position={[0.15, 0.12, 0.1]} rotation={[0.4, 0.2, 1.2]}>
          <cylinderGeometry args={[0.05, 0.06, 0.2, 8]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* Back left - Ionic style with scrolls */}
      <group position={[-0.42, 0, -0.35]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.14]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.055, 0.07, 0.68, 14]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Ionic volutes (scrolls) */}
        <mesh position={[-0.07, 0.94, 0]}>
          <torusGeometry args={[0.03, 0.012, 8, 12]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        <mesh position={[0.07, 0.94, 0]}>
          <torusGeometry args={[0.03, 0.012, 8, 12]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.08]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* Back right - Arched remnant */}
      <group position={[0.42, 0, -0.35]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.14]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.48, 10]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Partial arch extending toward center */}
        <mesh position={[-0.12, 0.75, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.2, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* ARCHITRAVE AND ENTABLATURE - partially intact */}
      <mesh position={[-0.42, 1.0, 0.04]}>
        <boxGeometry args={[0.2, 0.08, 0.85]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
      </mesh>
      
      {/* Decorative frieze with carved reliefs */}
      <mesh position={[0, 0.52, 0.38]}>
        <boxGeometry args={[0.5, 0.12, 0.02]} />
        <StyledMaterial color={COLORS.gold} style={style} surface="metal" />
      </mesh>
      
      {/* INSCRIPTIONS - Ancient text carved into stone */}
      {/* Main inscription panel */}
      <group position={[0, 0.35, 0.376]}>
        {/* Inscription background */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.35, 0.08, 0.01]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Carved text lines (simplified as horizontal grooves) */}
        {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
          <mesh key={`text-${i}`} position={[x, 0, 0.006]}>
            <boxGeometry args={[0.06, 0.015, 0.002]} />
            <StyledMaterial color={COLORS.gold} style={style} surface="metal" />
          </mesh>
        ))}
      </group>
      
      {/* Side inscription with hieroglyph-like symbols */}
      <group position={[-0.426, 0.4, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.01]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Symbol carvings */}
        {[[-0.08, 0.04], [0, 0.04], [0.08, 0.04], [-0.04, -0.04], [0.04, -0.04]].map(([y, z], i) => (
          <mesh key={`sym-${i}`} position={[0.006, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.018, 6]} />
            <StyledMaterial color={COLORS.goldDark} style={style} surface="metal" />
          </mesh>
        ))}
      </group>
      
      {/* Roof remnants */}
      <mesh position={[-0.2, 1.08, 0.1]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.5, 0.06, 0.6]} />
        <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
      </mesh>
      
      {/* Fallen architectural pieces */}
      <mesh position={[0.5, 0.08, 0.6]} rotation={[0.3, 0.5, 0.1]}>
        <boxGeometry args={[0.15, 0.08, 0.12]} />
        <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
      </mesh>
      <mesh position={[-0.55, 0.06, 0.3]} rotation={[0.1, 0.8, 0.2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.18, 8]} />
        <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
      </mesh>
      
      {/* Vegetation reclaiming the structure */}
      {/* Moss patches */}
      {[[-0.4, 0.75, 0.42], [0.35, 0.3, 0.4], [-0.3, 1.02, 0.1], [0.4, 0.65, -0.33]].map(([x, y, z], i) => (
        <mesh key={`moss-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.04 + i * 0.01, 8, 8]} />
          <StyledMaterial color={COLORS.moss} style={style} surface="organic" />
        </mesh>
      ))}
      
      {/* Hanging vines */}
      {[[-0.42, 0.8, 0.43], [-0.44, 0.65, -0.35]].map(([x, y, z], i) => (
        <mesh key={`vine-${i}`} position={[x, y, z]} rotation={[0, 0, 0.1 + i * 0.05]}>
          <capsuleGeometry args={[0.012, 0.25, 4, 8]} />
          <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
        </mesh>
      ))}
      
      {/* Small ferns at base */}
      {[[0.5, 0.12, -0.4], [-0.5, 0.12, 0.5]].map(([x, y, z], i) => (
        <group key={`fern-${i}`} position={[x, y, z]}>
          {[0, 0.6, 1.2, 1.8, 2.4].map((rot, j) => (
            <mesh key={j} position={[0, 0, 0]} rotation={[0.4, rot, 0]}>
              <coneGeometry args={[0.015, 0.06, 3]} />
              <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
            </mesh>
          ))}
        </group>
      ))}
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

// Jungle Ruins - Detailed overgrown ancient structure
export function JungleRuinsModel({ style = 'standard' }: ModelProps) {
  return (
    <group>
      {/* RUINED WALLS with carved details */}
      {/* Main wall section with window opening */}
      <group position={[-0.4, 0, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.85]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        {/* Window/door opening */}
        <mesh position={[0.04, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.25, 0.2]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Carved border around opening */}
        <mesh position={[0.065, 0.35, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.28]} />
          <StyledMaterial color={COLORS.goldDark} style={style} surface="metal" />
        </mesh>
        {/* Wall inscriptions */}
        <mesh position={[0.065, 0.4, 0.25]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.01]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Carved symbols */}
        {[[0.42, -0.3], [0.42, -0.22], [0.35, -0.26]].map(([y, z], i) => (
          <mesh key={`sym-l-${i}`} position={[0.065, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.015, 5 + i]} />
            <StyledMaterial color={COLORS.gold} style={style} surface="metal" />
          </mesh>
        ))}
      </group>
      
      {/* Secondary crumbling wall */}
      <group position={[0.4, 0, 0.2]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.1, 0.36, 0.55]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Weathered top edge */}
        <mesh position={[0, 0.38, 0.1]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.11, 0.04, 0.2]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        {/* Relief carving */}
        <mesh position={[-0.052, 0.15, 0]}>
          <boxGeometry args={[0.01, 0.18, 0.25]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* PILLARS - Various states */}
      {/* Intact short pillar */}
      <group position={[0.1, 0, -0.35]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.14]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.07, 0.32, 10]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Decorative ring */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.06, 0.012, 8, 16]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.12]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* Fallen pillar */}
      <group position={[-0.1, 0, 0.35]}>
        <mesh position={[0, 0.04, 0]} rotation={[0, 0.4, 1.45]}>
          <cylinderGeometry args={[0.05, 0.06, 0.35, 10]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Broken base still standing */}
        <mesh position={[-0.2, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 10]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* ARCHED REMNANT */}
      <group position={[0, 0, -0.15]}>
        {/* Left support */}
        <mesh position={[-0.18, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.24, 0.08]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
        {/* Right support (broken) */}
        <mesh position={[0.18, 0.08, 0]}>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <StyledMaterial color={COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
        {/* Partial arch */}
        <mesh position={[-0.08, 0.28, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.18, 0.05, 0.08]} />
          <StyledMaterial color={COLORS.stoneLight} style={style} surface="stone" />
        </mesh>
        {/* Keystone fallen */}
        <mesh position={[0.05, 0.04, 0.12]} rotation={[0.3, 0.2, 0.5]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <StyledMaterial color={COLORS.stone} style={style} surface="stone" />
        </mesh>
      </group>
      
      {/* SCATTERED DEBRIS */}
      {[
        [0.22, 0.04, 0.32, 0.2, 0.5, 0.1],
        [-0.18, 0.035, 0.4, 0.1, 0.3, 0.2],
        [0.3, 0.03, -0.2, 0.4, 0.1, 0.3],
        [-0.25, 0.025, -0.35, 0.2, 0.6, 0.15],
      ].map(([x, y, z, rx, ry, rz], i) => (
        <mesh key={`debris-${i}`} position={[x, y, z]} rotation={[rx, ry, rz]}>
          <boxGeometry args={[0.1 + i * 0.02, 0.05 + i * 0.01, 0.08 + i * 0.015]} />
          <StyledMaterial color={i % 2 === 0 ? COLORS.stone : COLORS.stoneDark} style={style} surface="stone" />
        </mesh>
      ))}
      
      {/* VEGETATION - Bringing life */}
      {/* Thick vines climbing walls */}
      <group position={[-0.46, 0, 0.2]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.08]}>
          <capsuleGeometry args={[0.018, 0.35, 6, 10]} />
          <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
        </mesh>
        <mesh position={[0.02, 0.35, 0.05]} rotation={[0.3, 0, -0.2]}>
          <capsuleGeometry args={[0.012, 0.15, 4, 8]} />
          <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
        </mesh>
        {/* Leaves */}
        {[[0.03, 0.25, 0.02], [-0.01, 0.38, 0.04], [0.02, 0.15, -0.02]].map(([x, y, z], i) => (
          <mesh key={`leaf-${i}`} position={[x, y, z]} rotation={[0.5, i * 0.8, 0.2]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <StyledMaterial color="#2d5a1e" style={style} surface="organic" />
          </mesh>
        ))}
      </group>
      
      {/* More vine tendrils */}
      <mesh position={[-0.38, 0.42, -0.18]} rotation={[0.25, 0, -0.12]}>
        <capsuleGeometry args={[0.012, 0.22, 4, 8]} />
        <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
      </mesh>
      <mesh position={[0.42, 0.28, 0.35]} rotation={[0.1, 0, 0.15]}>
        <capsuleGeometry args={[0.015, 0.2, 4, 8]} />
        <StyledMaterial color={COLORS.vine} style={style} surface="organic" />
      </mesh>
      
      {/* Moss clusters - giving ancient feel */}
      {[
        [-0.38, 0.48, 0.15],
        [0.38, 0.32, 0.25],
        [0.08, 0.42, -0.35],
        [-0.25, 0.12, 0.38],
        [0.15, 0.08, 0.4],
      ].map(([x, y, z], i) => (
        <mesh key={`moss-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.03 + i * 0.008, 8, 8]} />
          <StyledMaterial color={COLORS.moss} style={style} surface="organic" />
        </mesh>
      ))}
      
      {/* Ground foliage - ferns and small plants */}
      {[[0.35, 0.02, -0.4], [-0.3, 0.02, 0.45], [0.25, 0.02, 0.5]].map(([x, y, z], i) => (
        <group key={`fern-${i}`} position={[x, y, z]}>
          {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((rot, j) => (
            <mesh key={j} position={[0, 0.02, 0]} rotation={[0.5, rot, 0]}>
              <coneGeometry args={[0.012, 0.055, 3]} />
              <StyledMaterial color={j % 2 === 0 ? COLORS.vine : "#3a7a2a"} style={style} surface="organic" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Roots breaking through stone */}
      <mesh position={[-0.35, 0.02, -0.1]} rotation={[0.8, 0.2, 0.3]}>
        <capsuleGeometry args={[0.02, 0.12, 4, 8]} />
        <StyledMaterial color={COLORS.wood} style={style} surface="wood" />
      </mesh>
      <mesh position={[0.32, 0.015, 0.0]} rotation={[0.6, -0.3, 0.4]}>
        <capsuleGeometry args={[0.015, 0.1, 4, 8]} />
        <StyledMaterial color={COLORS.woodDark} style={style} surface="wood" />
      </mesh>
    </group>
  );
}
