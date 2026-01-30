import { useRef, useState, useEffect } from 'react';
import { Mesh, Vector3 } from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useSceneStore, SceneObject } from '@/store/sceneStore';

interface SceneObjectProps {
  object: SceneObject;
}

export function SceneObjectMesh({ object }: SceneObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const { selectedObjectId, selectObject, updateObject, transformMode } = useSceneStore();
  const isSelected = selectedObjectId === object.id;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vector3 | null>(null);
  const { camera, raycaster, pointer, gl } = useThree();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!object.locked) {
      selectObject(object.id);
    }
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (object.locked || transformMode === 'select') return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart(new Vector3(e.point.x, e.point.y, e.point.z));
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragStart(null);
    gl.domElement.style.cursor = 'auto';
  };

  useEffect(() => {
    if (!isDragging || !dragStart || object.locked) return;

    const handleMove = (e: PointerEvent) => {
      raycaster.setFromCamera(pointer, camera);
      
      // Create a plane at the object's Y position for omnidirectional movement
      const planeY = object.position[1];
      const direction = raycaster.ray.direction;
      const origin = raycaster.ray.origin;
      
      // Calculate intersection with horizontal plane
      const t = (planeY - origin.y) / direction.y;
      if (t > 0) {
        const newX = origin.x + direction.x * t;
        const newZ = origin.z + direction.z * t;
        
        updateObject(object.id, {
          position: [newX, planeY, newZ],
        });
      }
    };

    const handleUp = () => {
      setIsDragging(false);
      setDragStart(null);
      gl.domElement.style.cursor = 'auto';
    };

    gl.domElement.addEventListener('pointermove', handleMove);
    gl.domElement.addEventListener('pointerup', handleUp);
    
    return () => {
      gl.domElement.removeEventListener('pointermove', handleMove);
      gl.domElement.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging, dragStart, object, camera, raycaster, pointer, gl, updateObject]);

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
      onPointerUp={handlePointerUp}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial
        color={object.color}
        emissive={object.color}
        emissiveIntensity={object.emissiveIntensity}
        metalness={object.metalness}
        roughness={object.roughness}
        transparent={object.locked}
        opacity={object.locked ? 0.7 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial color="#ffff00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}
