import { useMemo } from 'react';
import * as THREE from 'three';

export type ModelStyle = 'standard' | 'wireframe';

// Surface types for realistic material properties
export type SurfaceType = 
  | 'skin'      // Human/animal skin - smooth, subsurface scattering look
  | 'fur'       // Animal fur - rough, matte with depth
  | 'hair'      // Human hair - anisotropic sheen
  | 'metal'     // Metallic surfaces - high reflectivity
  | 'stone'     // Stone/rock - rough, matte
  | 'wood'      // Wood - medium rough with grain
  | 'fabric'    // Cloth/fabric - soft matte
  | 'leather'   // Leather - slight sheen, fine grain
  | 'glass'     // Glass/crystal - transparent, reflective
  | 'organic'   // Plants/leaves - matte with slight translucency
  | 'bone'      // Bone/ivory/teeth - smooth, slightly translucent
  | 'rubber'    // Rubber/silicone - matte, flexible look
  | 'plastic'   // Hard plastic - slight sheen
  | 'ceramic'   // Ceramic/porcelain - smooth, reflective
  | 'default';  // Standard PBR material

// Realistic PBR surface properties based on real-world material references
// Values calibrated for photorealistic rendering
const SURFACE_PROPERTIES: Record<SurfaceType, {
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}> = {
  // Human skin: low metalness, medium roughness for realistic subsurface look
  skin: { metalness: 0.0, roughness: 0.45, envMapIntensity: 0.5, clearcoat: 0.1, clearcoatRoughness: 0.4 },
  // Fur: completely matte, absorbs light
  fur: { metalness: 0.0, roughness: 0.92, envMapIntensity: 0.08 },
  // Hair: slight anisotropic sheen
  hair: { metalness: 0.15, roughness: 0.5, envMapIntensity: 0.35 },
  // Metal: high metalness, low roughness for reflections
  metal: { metalness: 0.95, roughness: 0.15, envMapIntensity: 1.2 },
  // Stone: rough, matte, natural material
  stone: { metalness: 0.0, roughness: 0.88, envMapIntensity: 0.15 },
  // Wood: organic, medium roughness with subtle grain
  wood: { metalness: 0.0, roughness: 0.72, envMapIntensity: 0.2 },
  // Fabric: soft, diffuse, matte appearance
  fabric: { metalness: 0.0, roughness: 0.85, envMapIntensity: 0.08 },
  // Leather: slight sheen, medium roughness
  leather: { metalness: 0.02, roughness: 0.5, envMapIntensity: 0.3, clearcoat: 0.15, clearcoatRoughness: 0.5 },
  // Glass: highly reflective, smooth
  glass: { metalness: 0.05, roughness: 0.02, envMapIntensity: 1.5, clearcoat: 1.0, clearcoatRoughness: 0.0 },
  // Organic: plants, leaves - matte with waxy coating
  organic: { metalness: 0.0, roughness: 0.75, envMapIntensity: 0.12 },
  // Bone/teeth: smooth, ivory-like
  bone: { metalness: 0.02, roughness: 0.35, envMapIntensity: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.3 },
  // Rubber: completely matte, absorbs light
  rubber: { metalness: 0.0, roughness: 0.95, envMapIntensity: 0.05 },
  // Plastic: slight sheen, smooth
  plastic: { metalness: 0.0, roughness: 0.35, envMapIntensity: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.2 },
  // Ceramic: smooth, reflective
  ceramic: { metalness: 0.0, roughness: 0.2, envMapIntensity: 0.8, clearcoat: 0.5, clearcoatRoughness: 0.1 },
  // Default: balanced PBR settings
  default: { metalness: 0.1, roughness: 0.55, envMapIntensity: 0.6 },
};


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
