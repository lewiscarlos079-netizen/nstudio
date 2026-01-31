import { useRef, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BrushSettings {
  size: number;
  strength: number;
  falloff: number;
  mirror: boolean;
}

export interface SculptOperation {
  type: 'sculpt' | 'smooth' | 'pinch' | 'inflate' | 'flatten' | 'grab';
  position: THREE.Vector3;
  normal: THREE.Vector3;
  brushSettings: BrushSettings;
}

// Brush cursor that follows mouse position on mesh surfaces
export function BrushCursor3D({ 
  size, 
  visible, 
  position,
  normal 
}: { 
  size: number; 
  visible: boolean;
  position?: THREE.Vector3;
  normal?: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && position && normal) {
      meshRef.current.position.copy(position);
      meshRef.current.lookAt(position.clone().add(normal));
    }
  });
  
  if (!visible || !position) return null;
  
  return (
    <group>
      {/* Brush circle indicator */}
      <mesh ref={meshRef} position={position}>
        <ringGeometry args={[size * 0.9, size, 32]} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Center dot */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.05, 8, 8]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      
      {/* Strength indicator ring */}
      <mesh position={position}>
        <torusGeometry args={[size * 0.5, 0.005, 8, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Calculate falloff based on distance from center
export function calculateFalloff(
  distance: number, 
  radius: number, 
  falloffType: 'linear' | 'smooth' | 'sharp' = 'smooth'
): number {
  const normalizedDist = Math.min(distance / radius, 1);
  
  switch (falloffType) {
    case 'linear':
      return 1 - normalizedDist;
    case 'sharp':
      return Math.pow(1 - normalizedDist, 3);
    case 'smooth':
    default:
      // Smooth Hermite interpolation
      return 1 - (3 * normalizedDist * normalizedDist - 2 * normalizedDist * normalizedDist * normalizedDist);
  }
}

// Sculpt operation: Push/Pull vertices along normals
export function applySculptOperation(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  normal: THREE.Vector3,
  settings: BrushSettings,
  direction: number = 1 // 1 for push out, -1 for push in
) {
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');
  
  if (!positions || !normals) return;
  
  const vertex = new THREE.Vector3();
  const vertexNormal = new THREE.Vector3();
  
  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    vertexNormal.fromBufferAttribute(normals, i);
    
    const distance = vertex.distanceTo(center);
    
    if (distance < settings.size) {
      const falloff = calculateFalloff(distance, settings.size);
      const displacement = settings.strength * 0.01 * falloff * direction;
      
      vertex.addScaledVector(vertexNormal, displacement);
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      
      // Apply mirror if enabled
      if (settings.mirror) {
        // Find mirrored vertex (assuming X-axis symmetry)
        for (let j = 0; j < positions.count; j++) {
          const mirrorVertex = new THREE.Vector3().fromBufferAttribute(positions, j);
          if (Math.abs(mirrorVertex.x + vertex.x) < 0.01 && 
              Math.abs(mirrorVertex.y - vertex.y) < 0.01 &&
              Math.abs(mirrorVertex.z - vertex.z) < 0.01) {
            const mirrorNormal = new THREE.Vector3().fromBufferAttribute(normals, j);
            mirrorVertex.addScaledVector(mirrorNormal, displacement);
            positions.setXYZ(j, mirrorVertex.x, mirrorVertex.y, mirrorVertex.z);
            break;
          }
        }
      }
    }
  }
  
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Smooth operation: Average vertices with neighbors
export function applySmoothOperation(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  settings: BrushSettings
) {
  const positions = geometry.getAttribute('position');
  if (!positions) return;
  
  const vertex = new THREE.Vector3();
  const newPositions: THREE.Vector3[] = [];
  
  // First pass: calculate new positions
  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    const distance = vertex.distanceTo(center);
    
    if (distance < settings.size) {
      const falloff = calculateFalloff(distance, settings.size);
      
      // Find nearby vertices and average
      const neighbors: THREE.Vector3[] = [];
      const neighbor = new THREE.Vector3();
      
      for (let j = 0; j < positions.count; j++) {
        if (i !== j) {
          neighbor.fromBufferAttribute(positions, j);
          if (vertex.distanceTo(neighbor) < settings.size * 0.3) {
            neighbors.push(neighbor.clone());
          }
        }
      }
      
      if (neighbors.length > 0) {
        const avg = new THREE.Vector3();
        neighbors.forEach(n => avg.add(n));
        avg.divideScalar(neighbors.length);
        
        const smoothed = vertex.clone().lerp(avg, settings.strength * 0.1 * falloff);
        newPositions[i] = smoothed;
      } else {
        newPositions[i] = vertex.clone();
      }
    } else {
      newPositions[i] = vertex.clone();
    }
  }
  
  // Second pass: apply new positions
  for (let i = 0; i < newPositions.length; i++) {
    if (newPositions[i]) {
      positions.setXYZ(i, newPositions[i].x, newPositions[i].y, newPositions[i].z);
    }
  }
  
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Pinch operation: Pull vertices towards brush center
export function applyPinchOperation(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  settings: BrushSettings
) {
  const positions = geometry.getAttribute('position');
  if (!positions) return;
  
  const vertex = new THREE.Vector3();
  
  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    const distance = vertex.distanceTo(center);
    
    if (distance < settings.size && distance > 0) {
      const falloff = calculateFalloff(distance, settings.size);
      const direction = new THREE.Vector3().subVectors(center, vertex).normalize();
      const displacement = settings.strength * 0.005 * falloff;
      
      vertex.addScaledVector(direction, displacement);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }
  
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Inflate operation: Push vertices along their own normals
export function applyInflateOperation(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  settings: BrushSettings
) {
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');
  
  if (!positions || !normals) return;
  
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();
  
  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    normal.fromBufferAttribute(normals, i);
    
    const distance = vertex.distanceTo(center);
    
    if (distance < settings.size) {
      const falloff = calculateFalloff(distance, settings.size);
      const displacement = settings.strength * 0.01 * falloff;
      
      vertex.addScaledVector(normal, displacement);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }
  
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Flatten operation: Flatten surface towards a plane
export function applyFlattenOperation(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  planeNormal: THREE.Vector3,
  settings: BrushSettings
) {
  const positions = geometry.getAttribute('position');
  if (!positions) return;
  
  const vertex = new THREE.Vector3();
  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, center);
  
  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    const distance = vertex.distanceTo(center);
    
    if (distance < settings.size) {
      const falloff = calculateFalloff(distance, settings.size);
      const distanceToPlane = plane.distanceToPoint(vertex);
      const displacement = -distanceToPlane * settings.strength * 0.1 * falloff;
      
      vertex.addScaledVector(planeNormal, displacement);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }
  
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Hook for managing sculpting state
export function useSculpting(
  enabled: boolean,
  activeTool: string,
  brushSettings: BrushSettings
) {
  const { camera, scene, raycaster } = useThree();
  const [brushPosition, setBrushPosition] = useState<THREE.Vector3 | null>(null);
  const [brushNormal, setBrushNormal] = useState<THREE.Vector3 | null>(null);
  const isPainting = useRef(false);
  
  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!enabled) return;
    
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      setBrushPosition(hit.point.clone());
      setBrushNormal(hit.face?.normal?.clone() ?? new THREE.Vector3(0, 1, 0));
      
      if (isPainting.current && hit.object instanceof THREE.Mesh) {
        const geometry = hit.object.geometry;
        
        switch (activeTool) {
          case 'sculpt':
            applySculptOperation(geometry, hit.point, hit.face?.normal ?? new THREE.Vector3(0, 1, 0), brushSettings);
            break;
          case 'smooth':
            applySmoothOperation(geometry, hit.point, brushSettings);
            break;
          case 'pinch':
            applyPinchOperation(geometry, hit.point, brushSettings);
            break;
          case 'inflate':
            applyInflateOperation(geometry, hit.point, brushSettings);
            break;
          case 'flatten':
            applyFlattenOperation(geometry, hit.point, hit.face?.normal ?? new THREE.Vector3(0, 1, 0), brushSettings);
            break;
        }
      }
    } else {
      setBrushPosition(null);
      setBrushNormal(null);
    }
  }, [enabled, activeTool, brushSettings, camera, scene, raycaster]);
  
  const handlePointerDown = useCallback(() => {
    if (enabled) {
      isPainting.current = true;
    }
  }, [enabled]);
  
  const handlePointerUp = useCallback(() => {
    isPainting.current = false;
  }, []);
  
  return {
    brushPosition,
    brushNormal,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    isPainting: isPainting.current,
  };
}


