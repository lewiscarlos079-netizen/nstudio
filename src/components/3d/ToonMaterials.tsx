import { useMemo } from 'react';
import * as THREE from 'three';

export type ModelStyle = 'standard' | 'toon' | 'wireframe';

// Surface types for realistic material properties
export type SurfaceType = 
  | 'skin'      // Human/animal skin - smooth, subsurface
  | 'fur'       // Animal fur - rough, matte
  | 'hair'      // Human hair - slight sheen
  | 'metal'     // Metallic surfaces - reflective
  | 'stone'     // Stone/rock - rough, matte
  | 'wood'      // Wood - medium rough
  | 'fabric'    // Cloth/fabric - soft matte
  | 'leather'   // Leather - slight sheen
  | 'glass'     // Glass/crystal - transparent, reflective
  | 'organic'   // Plants/leaves - matte
  | 'bone'      // Bone/ivory/teeth - smooth
  | 'default';  // Standard material

// Surface-specific material properties
const SURFACE_PROPERTIES: Record<SurfaceType, {
  metalness: number;
  roughness: number;
  envMapIntensity: number;
}> = {
  skin: { metalness: 0.0, roughness: 0.5, envMapIntensity: 0.4 },
  fur: { metalness: 0.0, roughness: 0.95, envMapIntensity: 0.1 },
  hair: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.3 },
  metal: { metalness: 0.9, roughness: 0.2, envMapIntensity: 1.0 },
  stone: { metalness: 0.0, roughness: 0.85, envMapIntensity: 0.2 },
  wood: { metalness: 0.0, roughness: 0.7, envMapIntensity: 0.15 },
  fabric: { metalness: 0.0, roughness: 0.9, envMapIntensity: 0.05 },
  leather: { metalness: 0.05, roughness: 0.55, envMapIntensity: 0.25 },
  glass: { metalness: 0.1, roughness: 0.05, envMapIntensity: 1.2 },
  organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.1 },
  bone: { metalness: 0.05, roughness: 0.4, envMapIntensity: 0.3 },
  default: { metalness: 0.15, roughness: 0.65, envMapIntensity: 0.5 },
};

// Create a gradient texture for toon shading color bands
function createToonGradient(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  
  // 4-step gradient for cartoon cel shading
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = '#666666';
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = '#999999';
  ctx.fillRect(2, 0, 1, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3, 0, 1, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  
  return texture;
}

// Singleton gradient texture
let gradientMap: THREE.Texture | null = null;
function getGradientMap(): THREE.Texture {
  if (!gradientMap) {
    gradientMap = createToonGradient();
  }
  return gradientMap;
}

interface ToonMaterialProps {
  color: string;
  style: ModelStyle;
  surface?: SurfaceType;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
}

export function useToonMaterial({
  color,
  style,
  surface = 'default',
  emissive,
  emissiveIntensity = 0,
  metalness,
  roughness,
  opacity = 1,
  transparent = false,
}: ToonMaterialProps) {
  return useMemo(() => {
    const surfaceProps = SURFACE_PROPERTIES[surface];
    const finalMetalness = metalness ?? surfaceProps.metalness;
    const finalRoughness = roughness ?? surfaceProps.roughness;

    if (style === 'toon') {
      return (
        <meshToonMaterial
          color={color}
          gradientMap={getGradientMap()}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          opacity={opacity}
          transparent={transparent || opacity < 1}
        />
      );
    }
    
    if (style === 'wireframe') {
      return (
        <meshBasicMaterial
          color={color}
          wireframe
          opacity={0.8}
          transparent
        />
      );
    }
    
    // Standard material with surface-specific properties
    return (
      <meshStandardMaterial
        color={color}
        metalness={finalMetalness}
        roughness={finalRoughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity * 0.5}
        opacity={opacity}
        transparent={transparent || opacity < 1}
        envMapIntensity={surfaceProps.envMapIntensity}
      />
    );
  }, [color, style, surface, emissive, emissiveIntensity, metalness, roughness, opacity, transparent]);
}

// Simple component wrapper for materials
interface StyledMaterialProps {
  color: string;
  style: ModelStyle;
  surface?: SurfaceType;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
}

export function StyledMaterial(props: StyledMaterialProps) {
  const { 
    color, 
    style, 
    surface = 'default',
    emissive, 
    emissiveIntensity = 0, 
    metalness, 
    roughness, 
    opacity = 1, 
    transparent = false 
  } = props;

  const surfaceProps = SURFACE_PROPERTIES[surface];
  const finalMetalness = metalness ?? surfaceProps.metalness;
  const finalRoughness = roughness ?? surfaceProps.roughness;
  
  if (style === 'toon') {
    return (
      <meshToonMaterial
        color={color}
        gradientMap={getGradientMap()}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        transparent={transparent || opacity < 1}
      />
    );
  }
  
  if (style === 'wireframe') {
    return (
      <meshBasicMaterial
        color={color}
        wireframe
        opacity={0.8}
        transparent
      />
    );
  }
  
  // Standard material with surface-specific properties for realistic rendering
  return (
    <meshStandardMaterial
      color={color}
      metalness={finalMetalness}
      roughness={finalRoughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity * 0.5}
      opacity={opacity}
      transparent={transparent || opacity < 1}
      envMapIntensity={surfaceProps.envMapIntensity}
    />
  );
}

// Outline effect component for toon shading
interface OutlineMeshProps {
  children: React.ReactNode;
  enabled: boolean;
  color?: string;
  thickness?: number;
}

export function OutlineMesh({ children, enabled, color = '#000000', thickness = 0.03 }: OutlineMeshProps) {
  if (!enabled) return <>{children}</>;
  
  return (
    <group>
      {children}
    </group>
  );
}
