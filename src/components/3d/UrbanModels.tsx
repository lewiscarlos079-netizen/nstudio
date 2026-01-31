import { StyledMaterial, SurfaceType } from './Materials';
import { ModelStyle } from '@/store/sceneStore';

interface ModelProps {
  color?: string;
  style?: ModelStyle;
  surface?: SurfaceType;
}

// Urban color palette
const URBAN_COLORS = {
  // Building materials
  concrete: '#909090',
  concreteDark: '#606060',
  concreteLight: '#B0B0B0',
  glass: '#7AA8C0',
  glassDark: '#4A7890',
  brick: '#8B5A45',
  brickDark: '#6B4035',
  steel: '#A0A5A8',
  steelDark: '#707578',
  
  // Road materials
  asphalt: '#404040',
  asphaltDark: '#303030',
  sidewalk: '#A0A0A0',
  curb: '#808080',
  roadLine: '#E8E8E8',
  roadLineYellow: '#C8A040',
  crosswalk: '#F0F0F0',
  
  // Street furniture
  lampPost: '#404040',
  lampLight: '#F0E8D0',
  lampGlass: '#E8E0C8',
  signRed: '#C03030',
  signGreen: '#30A040',
  signYellow: '#C8A030',
  
  // Building accents
  awning: '#8B3A3A',
  awningGreen: '#3A6B40',
  door: '#4A3A30',
  window: '#C8D8E8',
  trim: '#E8E4E0',
  
  // Restaurant/commercial
  neonRed: '#FF4040',
  neonBlue: '#4080FF',
  canopy: '#A05040',
  
  // Zoo
  fenceWood: '#6B5040',
  fenceMetal: '#505050',
  waterFeature: '#5080A0',
};

// ==================== BUILDINGS ====================

export function OfficeBuildingModel({ color = URBAN_COLORS.concrete, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 1.0, 0.5]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[-0.35, 0.05, 0.45, 0.85].map((y, i) => (
        <group key={i}>
          {[-0.2, 0, 0.2].map((x, j) => (
            <mesh key={j} position={[x, y, 0.251]}>
              <boxGeometry args={[0.12, 0.18, 0.01]} />
              <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.12, 0.251]}>
        <boxGeometry args={[0.15, 0.24, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glassDark} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.64, 0.04, 0.54]} />
        <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
      </mesh>
    </group>
  );
}

export function ApartmentBuildingModel({ color = URBAN_COLORS.brick, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.8, 0.45]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[-0.2, 0.15, 0.5, 0.85].map((y, row) => (
        <group key={row}>
          {[-0.25, -0.08, 0.08, 0.25].map((x, col) => (
            <mesh key={col} position={[x, y - 0.2, 0.226]}>
              <boxGeometry args={[0.1, 0.12, 0.01]} />
              <StyledMaterial color={URBAN_COLORS.window} style={style} surface="glass" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.1, 0.226]}>
        <boxGeometry args={[0.12, 0.2, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.door} style={style} surface="wood" />
      </mesh>
      <mesh position={[-0.38, 0.4, 0.2]}>
        <boxGeometry args={[0.06, 0.6, 0.08]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function SkyscraperModel({ color = URBAN_COLORS.glass, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.4, 1.8, 0.35]} />
        <StyledMaterial color={URBAN_COLORS.steel} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.9, 0.176]}>
        <boxGeometry args={[0.38, 1.76, 0.01]} />
        <StyledMaterial color={color} style={style} surface="glass" />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0.1 + i * 0.15, 0.18]}>
          <boxGeometry args={[0.4, 0.01, 0.01]} />
          <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
        </mesh>
      ))}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 0.2, 8]} />
        <StyledMaterial color={URBAN_COLORS.steel} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.45]} />
        <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
      </mesh>
    </group>
  );
}

export function GlassSkyscraperModel({ color = URBAN_COLORS.glassDark, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.35, 1.6, 0.3]} />
        <StyledMaterial color={color} style={style} surface="glass" />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`h${i}`} position={[0, 0.1 + i * 0.16, 0.151]}>
          <boxGeometry args={[0.36, 0.008, 0.005]} />
          <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
        </mesh>
      ))}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={`v${i}`} position={[x, 0.8, 0.151]}>
          <boxGeometry args={[0.008, 1.6, 0.005]} />
          <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
        </mesh>
      ))}
      <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
      </mesh>
    </group>
  );
}

// ==================== RESTAURANTS ====================

export function RestaurantModel({ color = URBAN_COLORS.brick, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.45]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0.12, 0.25, 0.226]}>
        <boxGeometry args={[0.25, 0.3, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[-0.18, 0.18, 0.226]}>
        <boxGeometry args={[0.12, 0.36, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.door} style={style} surface="wood" />
      </mesh>
      <mesh position={[0, 0.48, 0.3]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.55, 0.02, 0.15]} />
        <StyledMaterial color={URBAN_COLORS.awning} style={style} surface="fabric" />
      </mesh>
      <mesh position={[0, 0.55, 0.23]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.trim} style={style} surface="plastic" />
      </mesh>
      <mesh position={[-0.35, 0.06, 0.35]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[-0.35, 0.13, 0.35]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
        <StyledMaterial color={URBAN_COLORS.steel} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function DinerModel({ color = URBAN_COLORS.steel, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.7, 0.35, 0.35]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <capsuleGeometry args={[0.17, 0.5, 4, 8]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.22, 0.176]}>
        <boxGeometry args={[0.6, 0.15, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.32, 0.176]}>
        <boxGeometry args={[0.68, 0.04, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.neonRed} style={style} surface="plastic" />
      </mesh>
      <mesh position={[-0.28, 0.15, 0.176]}>
        <boxGeometry args={[0.1, 0.3, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glassDark} style={style} surface="glass" />
      </mesh>
    </group>
  );
}

export function CafeModel({ color = URBAN_COLORS.trim, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.45, 0.44, 0.35]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0.08, 0.22, 0.176]}>
        <boxGeometry args={[0.2, 0.28, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[-0.14, 0.16, 0.176]}>
        <boxGeometry args={[0.1, 0.32, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.door} style={style} surface="wood" />
      </mesh>
      <mesh position={[0, 0.42, 0.25]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.42, 0.015, 0.12]} />
        <StyledMaterial color={URBAN_COLORS.awningGreen} style={style} surface="fabric" />
      </mesh>
      <mesh position={[0.15, 0.5, 0.18]}>
        <cylinderGeometry args={[0.03, 0.025, 0.04, 8]} />
        <StyledMaterial color={URBAN_COLORS.trim} style={style} surface="ceramic" />
      </mesh>
    </group>
  );
}

// ==================== ZOO ====================

export function ZooEntranceModel({ color = URBAN_COLORS.concrete, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.3, 0.35, 0]}>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0.3, 0.35, 0]}>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.75, 0.12, 0.18]} />
        <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
      </mesh>
      <mesh position={[-0.2, 0.88, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={URBAN_COLORS.fenceMetal} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.2, 0.88, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <StyledMaterial color={URBAN_COLORS.fenceMetal} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.82, 0.1]}>
        <boxGeometry args={[0.4, 0.08, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.awningGreen} style={style} surface="plastic" />
      </mesh>
      <mesh position={[-0.12, 0.28, 0]}>
        <boxGeometry args={[0.2, 0.56, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.fenceMetal} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.12, 0.28, 0]}>
        <boxGeometry args={[0.2, 0.56, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.fenceMetal} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function ZooEnclosureModel({ color = URBAN_COLORS.fenceWood, style = 'standard' }: ModelProps) {
  return (
    <group>
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <StyledMaterial color={color} style={style} surface="wood" />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.85, 0.03, 0.02]} />
        <StyledMaterial color={color} style={style} surface="wood" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.85, 0.03, 0.02]} />
        <StyledMaterial color={color} style={style} surface="wood" />
      </mesh>
      <mesh position={[0, 0.01, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.35]} />
        <StyledMaterial color="#5A7040" style={style} surface="organic" />
      </mesh>
    </group>
  );
}

export function AviaryModel({ color = URBAN_COLORS.fenceMetal, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.38, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.4, 0.03, 8, 24]} />
        <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
      </mesh>
      <mesh position={[0, 0.12, 0.38]}>
        <boxGeometry args={[0.15, 0.24, 0.05]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

// ==================== ROADS & SIDEWALKS ====================

export function HighwayModel({ color = URBAN_COLORS.asphalt, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.8]} />
        <StyledMaterial color={URBAN_COLORS.roadLineYellow} style={style} surface="plastic" />
      </mesh>
      <mesh position={[-0.25, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.8]} />
        <StyledMaterial color={URBAN_COLORS.roadLine} style={style} surface="plastic" />
      </mesh>
      <mesh position={[0.25, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.8]} />
        <StyledMaterial color={URBAN_COLORS.roadLine} style={style} surface="plastic" />
      </mesh>
      <mesh position={[-0.58, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.8]} />
        <StyledMaterial color={URBAN_COLORS.roadLine} style={style} surface="plastic" />
      </mesh>
      <mesh position={[0.58, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.8]} />
        <StyledMaterial color={URBAN_COLORS.roadLine} style={style} surface="plastic" />
      </mesh>
    </group>
  );
}

export function IntersectionModel({ color = URBAN_COLORS.asphalt, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 1.0]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].map((x, i) => (
        <mesh key={`n${i}`} position={[x, 0.015, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 0.15]} />
          <StyledMaterial color={URBAN_COLORS.crosswalk} style={style} surface="plastic" />
        </mesh>
      ))}
      {[-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].map((x, i) => (
        <mesh key={`s${i}`} position={[x, 0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 0.15]} />
          <StyledMaterial color={URBAN_COLORS.crosswalk} style={style} surface="plastic" />
        </mesh>
      ))}
      <mesh position={[0, 0.015, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.crosswalk} style={style} surface="plastic" />
      </mesh>
      <mesh position={[0, 0.015, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.crosswalk} style={style} surface="plastic" />
      </mesh>
    </group>
  );
}

export function CrosswalkModel({ color = URBAN_COLORS.asphalt, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[-0.22, -0.15, -0.08, 0, 0.08, 0.15, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 0.35]} />
          <StyledMaterial color={URBAN_COLORS.crosswalk} style={style} surface="plastic" />
        </mesh>
      ))}
    </group>
  );
}

export function SidewalkModel({ color = URBAN_COLORS.sidewalk, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.25]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.005, 0.25]} />
          <StyledMaterial color={URBAN_COLORS.concreteDark} style={style} surface="stone" />
        </mesh>
      ))}
    </group>
  );
}

export function CurbModel({ color = URBAN_COLORS.curb, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.8, 0.08, 0.1]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
    </group>
  );
}

// ==================== STREET FURNITURE ====================

export function StreetLampModel({ color = URBAN_COLORS.lampPost, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.08, 0.68, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.15, 0.68, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <StyledMaterial color={URBAN_COLORS.steel} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.15, 0.64, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.05]} />
        <StyledMaterial color={URBAN_COLORS.lampLight} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function VintageLampPostModel({ color = URBAN_COLORS.lampPost, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.8, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.04, 0.01, 8, 16]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.035, 0.008, 8, 16]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.1]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      {[[0.051, 0], [-0.051, 0], [0, 0.051], [0, -0.051]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.85, z]}>
          <planeGeometry args={[0.08, 0.1]} />
          <StyledMaterial color={URBAN_COLORS.lampGlass} style={style} surface="glass" />
        </mesh>
      ))}
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.06, 0.08, 4]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.12]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function ModernStreetLightModel({ color = URBAN_COLORS.steel, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.9, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.12, 0.88, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.22, 0.82, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.22, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.12, 0.01, 0.06]} />
        <StyledMaterial color={URBAN_COLORS.lampLight} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.03, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function TrafficLightModel({ color = URBAN_COLORS.lampPost, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.7, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.15, 0.68, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.28, 0.68, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.06]} />
        <StyledMaterial color={URBAN_COLORS.lampPost} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.32, 0.74, 0]}>
        <circleGeometry args={[0.025, 12]} />
        <StyledMaterial color={URBAN_COLORS.signRed} style={style} surface="glass" />
      </mesh>
      <mesh position={[0.32, 0.68, 0]}>
        <circleGeometry args={[0.025, 12]} />
        <StyledMaterial color={URBAN_COLORS.signYellow} style={style} surface="glass" />
      </mesh>
      <mesh position={[0.32, 0.62, 0]}>
        <circleGeometry args={[0.025, 12]} />
        <StyledMaterial color={URBAN_COLORS.signGreen} style={style} surface="glass" />
      </mesh>
    </group>
  );
}

export function StopSignModel({ color = URBAN_COLORS.signRed, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <StyledMaterial color={URBAN_COLORS.steel} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.75, 0.02]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.75, 0.03]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 8]} />
        <StyledMaterial color={URBAN_COLORS.trim} style={style} surface="plastic" />
      </mesh>
    </group>
  );
}

export function ParkBenchModel({ color = '#5A4030', style = 'standard' }: ModelProps) {
  return (
    <group>
      {[-0.08, -0.03, 0.02, 0.07].map((z, i) => (
        <mesh key={i} position={[0, 0.22, z]}>
          <boxGeometry args={[0.5, 0.02, 0.04]} />
          <StyledMaterial color={color} style={style} surface="wood" />
        </mesh>
      ))}
      {[-0.04, 0.02, 0.08].map((z, i) => (
        <mesh key={i} position={[0, 0.38, z - 0.12]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.04]} />
          <StyledMaterial color={color} style={style} surface="wood" />
        </mesh>
      ))}
      <mesh position={[-0.2, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.2]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.2, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.2]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function TrashCanModel({ color = URBAN_COLORS.fenceMetal, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.35, 12]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.03, 12]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.39, 0.03]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.05]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function MailboxModel({ color = '#3A5070', style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.6, 0.06]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.12]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.68, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.06, 0.03, 4, 8]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.64, 0.061]}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.lampPost} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function BusStopModel({ color = URBAN_COLORS.steel, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.25, 0.35, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.04]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.25, 0.35, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.04]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.72, 0.05]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.25]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.4, -0.08]}>
        <boxGeometry args={[0.5, 0.6, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.18, -0.02]}>
        <boxGeometry args={[0.4, 0.03, 0.1]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[-0.25, 0.8, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <StyledMaterial color={URBAN_COLORS.signGreen} style={style} surface="plastic" />
      </mesh>
    </group>
  );
}

export function PhoneBoothModel({ color = URBAN_COLORS.signRed, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.4, 0.126]}>
        <boxGeometry args={[0.18, 0.5, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0.126, 0.4, 0]}>
        <boxGeometry args={[0.01, 0.5, 0.18]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[-0.126, 0.4, 0]}>
        <boxGeometry args={[0.01, 0.5, 0.18]} />
        <StyledMaterial color={URBAN_COLORS.glass} style={style} surface="glass" />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.28]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <StyledMaterial color={color} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

// ==================== OTHER BUILDINGS ====================

export function GasStationModel({ color = URBAN_COLORS.concrete, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.25, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.35]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      <mesh position={[0.15, 0.45, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <StyledMaterial color={URBAN_COLORS.trim} style={style} surface="metal" />
      </mesh>
      <mesh position={[0, 0.22, 0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.3, 0.22, 0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
        <StyledMaterial color={URBAN_COLORS.steelDark} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.08, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.24, 0.08]} />
        <StyledMaterial color={URBAN_COLORS.signRed} style={style} surface="metal" />
      </mesh>
      <mesh position={[0.25, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.24, 0.08]} />
        <StyledMaterial color={URBAN_COLORS.signGreen} style={style} surface="metal" />
      </mesh>
    </group>
  );
}

export function ParkingGarageModel({ color = URBAN_COLORS.concreteDark, style = 'standard' }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.5]} />
        <StyledMaterial color={color} style={style} surface="stone" />
      </mesh>
      {[0.15, 0.4, 0.65].map((y, i) => (
        <mesh key={i} position={[0, y, 0.251]}>
          <boxGeometry args={[0.6, 0.12, 0.01]} />
          <StyledMaterial color={URBAN_COLORS.asphaltDark} style={style} surface="stone" />
        </mesh>
      ))}
      <mesh position={[-0.2, 0.1, 0.251]}>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.asphalt} style={style} surface="stone" />
      </mesh>
      <mesh position={[0.2, 0.1, 0.251]}>
        <boxGeometry args={[0.15, 0.15, 0.01]} />
        <StyledMaterial color={URBAN_COLORS.signGreen} style={style} surface="plastic" />
      </mesh>
    </group>
  );
}

// Registry export for all urban models
export const UrbanModelRegistry: Record<string, React.ComponentType<ModelProps>> = {
  'building-office': OfficeBuildingModel,
  'building-apartment': ApartmentBuildingModel,
  'skyscraper': SkyscraperModel,
  'skyscraper-glass': GlassSkyscraperModel,
  'restaurant': RestaurantModel,
  'restaurant-diner': DinerModel,
  'restaurant-cafe': CafeModel,
  'zoo': ZooEntranceModel,
  'zoo-enclosure': ZooEnclosureModel,
  'zoo-aviary': AviaryModel,
  'road-highway': HighwayModel,
  'road-intersection': IntersectionModel,
  'road-crosswalk': CrosswalkModel,
  'sidewalk': SidewalkModel,
  'sidewalk-curb': CurbModel,
  'street-lamp': StreetLampModel,
  'street-lamp-vintage': VintageLampPostModel,
  'street-lamp-modern': ModernStreetLightModel,
  'traffic-light': TrafficLightModel,
  'stop-sign': StopSignModel,
  'bench': ParkBenchModel,
  'trash-can': TrashCanModel,
  'mailbox': MailboxModel,
  'bus-stop': BusStopModel,
  'phone-booth': PhoneBoothModel,
  'gas-station': GasStationModel,
  'parking-garage': ParkingGarageModel,
};
