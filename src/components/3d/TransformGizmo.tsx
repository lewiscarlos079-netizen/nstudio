import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, ArrowHelper, Group } from 'three';
import { useSceneStore } from '@/store/sceneStore';

interface AxisArrowProps {
  direction: [number, number, number];
  color: string;
  position: [number, number, number];
  label: string;
}

function AxisArrow({ direction, color, position }: AxisArrowProps) {
  const arrowRef = useRef<any>(null);
  
  return (
    <group position={position}>
      {/* Arrow shaft */}
      <mesh rotation={[
        direction[1] !== 0 ? (direction[1] > 0 ? 0 : Math.PI) : (direction[2] !== 0 ? Math.PI/2 : 0),
        direction[0] !== 0 ? (direction[0] > 0 ? Math.PI/2 : -Math.PI/2) : 0,
        direction[2] !== 0 ? (direction[2] > 0 ? -Math.PI/2 : Math.PI/2) : 0
      ]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Arrow head */}
      <mesh position={[
        direction[0] * 0.5,
        direction[1] * 0.5,
        direction[2] * 0.5
      ]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

interface TransformGizmoProps {
  position: [number, number, number];
  visible: boolean;
}

export function TransformGizmo({ position, visible }: TransformGizmoProps) {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();
  
  // Scale gizmo based on camera distance for consistent size
  useFrame(() => {
    if (groupRef.current) {
      const distance = camera.position.distanceTo(new Vector3(...position));
      const scale = Math.max(0.5, distance * 0.1);
      groupRef.current.scale.setScalar(scale);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* X Axis - Red */}
      <group>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.06, 0.15, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
      </group>
      
      {/* Y Axis - Green */}
      <group>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshBasicMaterial color="#44ff44" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.06, 0.15, 8]} />
          <meshBasicMaterial color="#44ff44" />
        </mesh>
      </group>
      
      {/* Z Axis - Blue */}
      <group>
        <mesh position={[0, 0, 0.45]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshBasicMaterial color="#4444ff" />
        </mesh>
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI/2, 0, 0]}>
          <coneGeometry args={[0.06, 0.15, 8]} />
          <meshBasicMaterial color="#4444ff" />
        </mesh>
      </group>
      
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function SceneTransformGizmos() {
  const { objects, selectedObjectId } = useSceneStore();
  
  return (
    <>
      {objects.map((obj) => (
        <TransformGizmo
          key={`gizmo-${obj.id}`}
          position={obj.position}
          visible={obj.visible && selectedObjectId === obj.id}
        />
      ))}
    </>
  );
}
