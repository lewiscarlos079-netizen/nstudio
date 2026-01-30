import { useRef } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore, SceneObject } from '@/store/sceneStore';

interface SceneObjectProps {
  object: SceneObject;
}

export function SceneObjectMesh({ object }: SceneObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const { selectedObjectId, selectObject } = useSceneStore();
  const isSelected = selectedObjectId === object.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectObject(object.id);
  };

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
