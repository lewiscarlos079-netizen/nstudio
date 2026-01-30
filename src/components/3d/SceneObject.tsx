import { useRef, useState, useEffect } from 'react';
import { Mesh, Vector3, Plane } from 'three';
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
  const [shiftHeld, setShiftHeld] = useState(false);
  const [initialY, setInitialY] = useState(0);
  const [initialMouseY, setInitialMouseY] = useState(0);
  const { camera, gl, raycaster, pointer } = useThree();
  
  // Planes for different movement directions
  const horizontalPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const verticalPlane = useRef(new Plane(new Vector3(0, 0, 1), 0));
  const intersection = useRef(new Vector3());

  // Track shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftHeld(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
    
    // Set the horizontal drag plane at the object's current Y position
    horizontalPlane.current.constant = -object.position[1];
    
    // Store initial Y for vertical movement
    setInitialY(object.position[1]);
    setInitialMouseY(e.clientY);
    
    // Calculate offset from click point to object center
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(horizontalPlane.current, intersection.current)) {
      setDragOffset(new Vector3(
        object.position[0] - intersection.current.x,
        0,
        object.position[2] - intersection.current.z
      ));
    }
    
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  // Track mouse position for vertical movement
  const mouseYRef = useRef(0);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use frame loop for smooth continuous updates while dragging
  useFrame(() => {
    if (!isDragging || object.locked) return;
    
    if (shiftHeld) {
      // Vertical movement (Y axis) - based on mouse Y delta
      const deltaY = (initialMouseY - mouseYRef.current) * 0.01;
      const newY = Math.max(0.1, initialY + deltaY); // Prevent going below ground
      
      if (Math.abs(newY - object.position[1]) > 0.001) {
        updateObject(object.id, {
          position: [object.position[0], newY, object.position[2]],
        });
      }
    } else {
      // Horizontal movement (X/Z plane)
      raycaster.setFromCamera(pointer, camera);
      
      if (raycaster.ray.intersectPlane(horizontalPlane.current, intersection.current)) {
        const newX = intersection.current.x + dragOffset.x;
        const newZ = intersection.current.z + dragOffset.z;
        
        if (
          Math.abs(newX - object.position[0]) > 0.001 ||
          Math.abs(newZ - object.position[2]) > 0.001
        ) {
          updateObject(object.id, {
            position: [newX, object.position[1], newZ],
          });
        }
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

    gl.domElement.addEventListener('pointerup', handlePointerUp);
    gl.domElement.addEventListener('pointerleave', handlePointerUp);
    
    return () => {
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
      gl.domElement.removeEventListener('pointerleave', handlePointerUp);
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
          <lineBasicMaterial 
            color={isDragging ? (shiftHeld ? "#00ffff" : "#00ff00") : "#ffff00"} 
            linewidth={2} 
          />
        </lineSegments>
      )}
    </mesh>
  );
}
