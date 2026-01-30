import { useMemo } from 'react';
import * as THREE from 'three';

export type ModelStyle = 'standard' | 'toon' | 'wireframe';

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
  emissive,
  emissiveIntensity = 0,
  metalness = 0.5,
  roughness = 0.5,
  opacity = 1,
  transparent = false,
}: ToonMaterialProps) {
  return useMemo(() => {
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
    
    // Standard material (default)
    return (
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        transparent={transparent || opacity < 1}
      />
    );
  }, [color, style, emissive, emissiveIntensity, metalness, roughness, opacity, transparent]);
}

// Simple component wrapper for materials
interface StyledMaterialProps {
  color: string;
  style: ModelStyle;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
}

export function StyledMaterial(props: StyledMaterialProps) {
  const { color, style, emissive, emissiveIntensity = 0, metalness = 0.5, roughness = 0.5, opacity = 1, transparent = false } = props;
  
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
  
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      opacity={opacity}
      transparent={transparent || opacity < 1}
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
