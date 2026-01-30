import { useRef, useState, useEffect } from 'react';
import { Mesh, Vector3, Plane, Group } from 'three';
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
import { useSceneStore, SceneObject } from '@/store/sceneStore';
import { getProceduralModel } from './ProceduralModels';

interface SceneObjectProps {
  object: SceneObject;
}

// Track which keys are currently pressed
const keysPressed = new Set<string>();

export function SceneObjectMesh({ object }: SceneObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const { selectedObjectId, selectObject, updateObject, transformMode, mouseSensitivity } = useSceneStore();
  const isSelected = selectedObjectId === object.id;
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Vector3>(new Vector3());
  const [shiftHeld, setShiftHeld] = useState(false);
  const [initialY, setInitialY] = useState(0);
  const [initialMouseY, setInitialMouseY] = useState(0);
  const { camera, gl, raycaster, pointer } = useThree();
  
  // Movement speed based on sensitivity (reduced base speed)
  const baseSpeed = 0.01;
  const moveSpeed = baseSpeed * (mouseSensitivity / 50);
  
  // Planes for different movement directions
  const horizontalPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const intersection = useRef(new Vector3());

  // Track keyboard state for WASD movement - only when canvas is focused
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only capture WASD/QE if the event target is the canvas
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
        // Check if we're in an input or if canvas is focused
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        keysPressed.add(key);
      }
      if (e.key === 'Shift') setShiftHeld(true);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
      if (e.key === 'Shift') setShiftHeld(false);
    };

    // Clear keys when canvas loses focus
    const handleBlur = () => {
      keysPressed.clear();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('blur', handleBlur);
    };
  }, [gl.domElement]);

  // Scroll wheel for X/Y rotation control
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleWheel = (e: WheelEvent) => {
      if (!isSelected || object.locked) return;
      
      e.preventDefault();
      
      const rotationSpeed = 0.02 * (mouseSensitivity / 50);
      const deltaY = e.deltaY * rotationSpeed;
      
      // Shift + scroll = rotate on X axis, normal scroll = rotate on Y axis
      if (e.shiftKey) {
        // Rotate on X axis
        updateObject(object.id, {
          rotation: [
            object.rotation[0] + deltaY,
            object.rotation[1],
            object.rotation[2],
          ],
        });
      } else {
        // Rotate on Y axis
        updateObject(object.id, {
          rotation: [
            object.rotation[0],
            object.rotation[1] + deltaY,
            object.rotation[2],
          ],
        });
      }
    };
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isSelected, object.id, object.rotation, object.locked, updateObject, mouseSensitivity, gl.domElement]);

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

  // Use frame loop for smooth continuous updates
  useFrame(() => {
    // WASD Movement - works anytime object is selected (smooth movement)
    if (isSelected && !object.locked && !isDragging) {
      let deltaX = 0;
      let deltaZ = 0;
      let deltaY = 0;
      
      // WASD for horizontal movement
      if (keysPressed.has('w')) deltaZ -= moveSpeed;
      if (keysPressed.has('s')) deltaZ += moveSpeed;
      if (keysPressed.has('a')) deltaX -= moveSpeed;
      if (keysPressed.has('d')) deltaX += moveSpeed;
      
      // Q/E for vertical movement
      if (keysPressed.has('q')) deltaY -= moveSpeed;
      if (keysPressed.has('e')) deltaY += moveSpeed;
      
      if (deltaX !== 0 || deltaZ !== 0 || deltaY !== 0) {
        const newY = Math.max(0.1, object.position[1] + deltaY);
        updateObject(object.id, {
          position: [
            object.position[0] + deltaX,
            newY,
            object.position[2] + deltaZ,
          ],
        });
      }
    }
    
    // Mouse drag movement with reduced sensitivity
    if (!isDragging || object.locked) return;
    
    const dragSensitivity = mouseSensitivity / 100;
    
    if (shiftHeld) {
      // Vertical movement (Y axis) - based on mouse Y delta
      const deltaY = (initialMouseY - mouseYRef.current) * 0.005 * dragSensitivity;
      const newY = Math.max(0.1, initialY + deltaY);
      
      if (Math.abs(newY - object.position[1]) > 0.001) {
        updateObject(object.id, {
          position: [object.position[0], newY, object.position[2]],
        });
      }
    } else {
      // Horizontal movement (X/Z plane) with mouse
      raycaster.setFromCamera(pointer, camera);
      
      if (raycaster.ray.intersectPlane(horizontalPlane.current, intersection.current)) {
        const newX = intersection.current.x + dragOffset.x;
        const newZ = intersection.current.z + dragOffset.z;
        
        // Apply sensitivity to movement
        const currentX = object.position[0];
        const currentZ = object.position[2];
        const targetX = currentX + (newX - currentX) * dragSensitivity;
        const targetZ = currentZ + (newZ - currentZ) * dragSensitivity;
        
        if (
          Math.abs(targetX - currentX) > 0.001 ||
          Math.abs(targetZ - currentZ) > 0.001
        ) {
          updateObject(object.id, {
            position: [targetX, object.position[1], targetZ],
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

  const isUsingWASD = keysPressed.has('w') || keysPressed.has('a') || keysPressed.has('s') || keysPressed.has('d') || keysPressed.has('q') || keysPressed.has('e');

  // Render procedural model if type is 'procedural'
  if (object.type === 'procedural' && object.modelId) {
    const ProceduralModel = getProceduralModel(object.modelId);
    
    if (ProceduralModel) {
      return (
        <group
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
        >
          <ProceduralModel color={object.color} bodyParts={object.bodyParts} />
          {isSelected && (
            <mesh>
              <sphereGeometry args={[0.6, 8, 8]} />
              <meshBasicMaterial 
                color={isUsingWASD ? "#ff00ff" : (isDragging ? (shiftHeld ? "#00ffff" : "#00ff00") : "#ffff00")} 
                wireframe 
                transparent
                opacity={0.3}
              />
            </mesh>
          )}
        </group>
      );
    }
  }

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
        emissiveIntensity={isDragging || isUsingWASD ? object.emissiveIntensity + 0.3 : object.emissiveIntensity}
        metalness={object.metalness}
        roughness={object.roughness}
        transparent={object.locked}
        opacity={object.locked ? 0.7 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial 
            color={isUsingWASD ? "#ff00ff" : (isDragging ? (shiftHeld ? "#00ffff" : "#00ff00") : "#ffff00")} 
            linewidth={2} 
          />
        </lineSegments>
      )}
    </mesh>
  );
}
