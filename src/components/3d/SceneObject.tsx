import { useRef, useState, useEffect, useCallback } from 'react';
import { Mesh, Vector3, Plane, Raycaster, Vector2 } from 'three';
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
import { useSceneStore, SceneObject } from '@/store/sceneStore';

interface SceneObjectProps {
  object: SceneObject;
}

export function SceneObjectMesh({ object }: SceneObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const { selectedObjectId, selectObject, updateObject, transformMode } = useSceneStore();
  const isSelected = selectedObjectId === object.id;
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Vector3>(new Vector3());
  const { camera, gl, raycaster, pointer } = useThree();
  
  // Create a plane for dragging at the object's height
  const dragPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const intersection = useRef(new Vector3());

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isDragging) {
      e.stopPropagation();
      if (!object.locked) {
        selectObject(object.id);
      }
    }
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (object.locked || transformMode === 'select') return;
    e.stopPropagation();
    
    // Set the drag plane at the object's current Y position
    dragPlane.current.constant = -object.position[1];
    
    // Calculate offset from click point to object center
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(dragPlane.current, intersection.current)) {
      setDragOffset(new Vector3(
        object.position[0] - intersection.current.x,
        0,
        object.position[2] - intersection.current.z
      ));
    }
    
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    
    // Capture pointer for smooth tracking
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  // Use frame loop for smooth continuous updates while dragging
  useFrame(() => {
    if (!isDragging || object.locked) return;
    
    raycaster.setFromCamera(pointer, camera);
    
    if (raycaster.ray.intersectPlane(dragPlane.current, intersection.current)) {
      const newX = intersection.current.x + dragOffset.x;
      const newZ = intersection.current.z + dragOffset.z;
      
      // Only update if position actually changed (prevents unnecessary rerenders)
      if (
        Math.abs(newX - object.position[0]) > 0.001 ||
        Math.abs(newZ - object.position[2]) > 0.001
      ) {
        updateObject(object.id, {
          position: [newX, object.position[1], newZ],
        });
      }
    }
  });

  // Global pointer up handler
  useEffect(() => {
    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        gl.domElement.style.cursor = 'auto';
      }
    };

    const handlePointerLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        gl.domElement.style.cursor = 'auto';
      }
    };

    gl.domElement.addEventListener('pointerup', handlePointerUp);
    gl.domElement.addEventListener('pointerleave', handlePointerLeave);
    
    return () => {
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
      gl.domElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isDragging, gl.domElement]);

  if (!object.visible) return null;

  const getGeometry = () => {
    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />;
      case 'plane':
        return <planeGeometry args={[2, 2]} />;
      case 'torus':
        return <torusGeometry args={[0.4, 0.15, 16, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerOver={() => {
        if (!object.locked && transformMode !== 'select') {
          gl.domElement.style.cursor = 'grab';
        }
      }}
      onPointerOut={() => {
        if (!isDragging) {
          gl.domElement.style.cursor = 'auto';
        }
      }}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial
        color={object.color}
        emissive={object.color}
        emissiveIntensity={isDragging ? object.emissiveIntensity + 0.3 : object.emissiveIntensity}
        metalness={object.metalness}
        roughness={object.roughness}
        transparent={object.locked}
        opacity={object.locked ? 0.7 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial color={isDragging ? "#00ff00" : "#ffff00"} linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}
