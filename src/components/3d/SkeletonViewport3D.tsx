import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface JointBall {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  connectedTo: string[];
  // Physics properties
  mass?: number;
  isFixed?: boolean; // Fixed joints don't move (like root/pelvis)
  stiffness?: number; // How rigid the joint connection is
  damping?: number; // Energy loss in movement
}

interface BoneStructure {
  id: string;
  name: string;
  startJoint: string;
  endJoint: string;
  thickness: number;
  segments: number;
}

interface ClayLayer {
  id: string;
  name: string;
  type: 'muscle' | 'skin' | 'tissue' | 'fat';
  attachedToBone: string;
  color: string;
  thickness: number;
  opacity: number;
}

interface SkeletonViewport3DProps {
  joints: JointBall[];
  bones: BoneStructure[];
  clayLayers: ClayLayer[];
  selectedJoint: string | null;
  onSelectJoint: (id: string | null) => void;
  onUpdateJointPosition?: (id: string, position: [number, number, number]) => void;
  zoom: number;
  brushSize: number;
  brushStrength: number;
  activeTool: string;
  physicsEnabled?: boolean;
}

// Physics state for each joint
interface JointPhysicsState {
  velocity: [number, number, number];
  acceleration: [number, number, number];
  restPosition: [number, number, number];
}

// Vector math helpers for physics
const vec3 = {
  add: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (v: [number, number, number], s: number): [number, number, number] => 
    [v[0] * s, v[1] * s, v[2] * s],
  length: (v: [number, number, number]): number => 
    Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),
  normalize: (v: [number, number, number]): [number, number, number] => {
    const len = vec3.length(v);
    return len > 0 ? vec3.scale(v, 1 / len) : [0, 0, 0];
  },
  lerp: (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
    [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
};

// 3D Joint sphere component with physics
function JointSphere({ 
  joint, 
  isSelected, 
  onClick,
  isDragging,
  onDragStart,
  onDrag,
  onDragEnd,
  physicsEnabled,
  allJoints
}: { 
  joint: JointBall; 
  isSelected: boolean; 
  onClick: () => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDrag: (id: string, position: [number, number, number]) => void;
  onDragEnd: (id: string) => void;
  physicsEnabled: boolean;
  allJoints: JointBall[];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate weight indicator based on connected joints below this one
  const calculateWeight = useCallback(() => {
    const mass = joint.mass ?? 1;
    // Count joints connected below (supporting weight)
    const connectedBelow = allJoints.filter(j => 
      joint.connectedTo.includes(j.id) && j.position[1] < joint.position[1]
    );
    return mass + connectedBelow.length * 0.5;
  }, [joint, allJoints]);
  
  const weight = calculateWeight();
  const isFixed = joint.isFixed ?? false;
  
  // Visual indicator for fixed vs opposable joints
  const jointColor = isFixed 
    ? '#ff6b6b' // Fixed joints are red-tinted
    : isSelected 
      ? '#00d4ff' 
      : hovered 
        ? '#66e0ff'
        : joint.color;
  
  return (
    <group position={joint.position}>
      {/* Main joint sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerDown={(e) => {
          if (!isFixed && physicsEnabled) {
            e.stopPropagation();
            onDragStart(joint.id);
          }
        }}
        onPointerUp={() => {
          if (isDragging) {
            onDragEnd(joint.id);
          }
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[joint.radius, 24, 24]} />
        <meshStandardMaterial
          color={jointColor}
          metalness={0.4}
          roughness={0.3}
          emissive={isSelected ? '#00d4ff' : hovered ? '#00d4ff' : '#000000'}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Weight indicator ring */}
      {physicsEnabled && !isFixed && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[joint.radius * 1.3, 0.01, 8, 32]} />
          <meshBasicMaterial 
            color={weight > 2 ? '#ff9500' : '#00ff88'} 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      )}
      
      {/* Fixed joint indicator */}
      {isFixed && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[joint.radius * 1.2, joint.radius * 1.4, 6]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Opposable joint axes indicator */}
      {!isFixed && isSelected && (
        <>
          {/* X axis */}
          <mesh position={[joint.radius * 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, joint.radius * 1.5, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          {/* Y axis */}
          <mesh position={[0, joint.radius * 2, 0]}>
            <cylinderGeometry args={[0.008, 0.008, joint.radius * 1.5, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          {/* Z axis */}
          <mesh position={[0, 0, joint.radius * 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, joint.radius * 1.5, 8]} />
            <meshBasicMaterial color="#0088ff" />
          </mesh>
        </>
      )}
    </group>
  );
}

// 3D Bone rod component
function BoneRod({
  bone,
  joints
}: {
  bone: BoneStructure;
  joints: JointBall[];
}) {
  const startJoint = joints.find(j => j.id === bone.startJoint);
  const endJoint = joints.find(j => j.id === bone.endJoint);
  
  if (!startJoint || !endJoint) return null;
  
  const start = new THREE.Vector3(...startJoint.position);
  const end = new THREE.Vector3(...endJoint.position);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  // Calculate rotation to align cylinder with bone direction
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  
  return (
    <mesh
      position={[midpoint.x, midpoint.y, midpoint.z]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[bone.thickness, bone.thickness, length, 8]} />
      <meshStandardMaterial
        color="#8a8a8a"
        metalness={0.2}
        roughness={0.6}
      />
    </mesh>
  );
}

// Connection rod between joints
function ConnectionRod({
  startJoint,
  endJoint
}: {
  startJoint: JointBall;
  endJoint: JointBall;
}) {
  const start = new THREE.Vector3(...startJoint.position);
  const end = new THREE.Vector3(...endJoint.position);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  
  return (
    <mesh
      position={[midpoint.x, midpoint.y, midpoint.z]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[0.015, 0.015, length, 6]} />
      <meshStandardMaterial
        color="#606060"
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

// Clay layer visualization
function ClayLayerMesh({
  layer,
  bones,
  joints
}: {
  layer: ClayLayer;
  bones: BoneStructure[];
  joints: JointBall[];
}) {
  const bone = bones.find(b => b.id === layer.attachedToBone);
  if (!bone) return null;
  
  const startJoint = joints.find(j => j.id === bone.startJoint);
  const endJoint = joints.find(j => j.id === bone.endJoint);
  if (!startJoint || !endJoint) return null;
  
  const start = new THREE.Vector3(...startJoint.position);
  const end = new THREE.Vector3(...endJoint.position);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  
  return (
    <mesh
      position={[midpoint.x, midpoint.y, midpoint.z]}
      quaternion={quaternion}
    >
      <capsuleGeometry args={[layer.thickness, length * 0.8, 4, 12]} />
      <meshStandardMaterial
        color={layer.color}
        metalness={0.05}
        roughness={0.8}
        transparent
        opacity={layer.opacity}
      />
    </mesh>
  );
}

// Brush cursor visualization
function BrushCursor({ size, visible }: { size: number; visible: boolean }) {
  if (!visible) return null;
  
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[size * 0.01, 16, 16]} />
      <meshBasicMaterial color="#00ff00" transparent opacity={0.3} wireframe />
    </mesh>
  );
}

// Physics simulation hook
function useJointPhysics(
  joints: JointBall[],
  enabled: boolean,
  onUpdatePosition?: (id: string, position: [number, number, number]) => void
) {
  const physicsState = useRef<Map<string, JointPhysicsState>>(new Map());
  const [simulatedPositions, setSimulatedPositions] = useState<Map<string, [number, number, number]>>(new Map());
  const draggingJoint = useRef<string | null>(null);
  const dragTarget = useRef<[number, number, number] | null>(null);
  
  // Initialize physics state
  useEffect(() => {
    joints.forEach(joint => {
      if (!physicsState.current.has(joint.id)) {
        physicsState.current.set(joint.id, {
          velocity: [0, 0, 0],
          acceleration: [0, 0, 0],
          restPosition: [...joint.position] as [number, number, number],
        });
      }
    });
  }, [joints]);
  
  // Physics step
  useFrame((_, delta) => {
    if (!enabled) return;
    
    const dt = Math.min(delta, 0.033); // Cap at ~30fps for stability
    const gravity: [number, number, number] = [0, -9.81, 0];
    const newPositions = new Map<string, [number, number, number]>();
    
    joints.forEach(joint => {
      const state = physicsState.current.get(joint.id);
      if (!state) return;
      
      const isFixed = joint.isFixed ?? false;
      const mass = joint.mass ?? 1;
      const stiffness = joint.stiffness ?? 50;
      const damping = joint.damping ?? 0.9;
      
      // Fixed joints don't move
      if (isFixed) {
        newPositions.set(joint.id, joint.position);
        return;
      }
      
      let currentPos = simulatedPositions.get(joint.id) ?? joint.position;
      
      // Handle dragging
      if (draggingJoint.current === joint.id && dragTarget.current) {
        currentPos = vec3.lerp(currentPos, dragTarget.current, 0.3);
        state.velocity = [0, 0, 0];
        newPositions.set(joint.id, currentPos);
        return;
      }
      
      // Calculate forces
      let force: [number, number, number] = [0, 0, 0];
      
      // Gravity (scaled by mass)
      force = vec3.add(force, vec3.scale(gravity, mass * 0.1));
      
      // Spring force to rest position (holds weight)
      const toRest = vec3.sub(state.restPosition, currentPos);
      const springForce = vec3.scale(toRest, stiffness);
      force = vec3.add(force, springForce);
      
      // Constraint forces from connected joints
      joint.connectedTo.forEach(connectedId => {
        const connectedJoint = joints.find(j => j.id === connectedId);
        if (!connectedJoint) return;
        
        const connectedPos = simulatedPositions.get(connectedId) ?? connectedJoint.position;
        const connectedRestPos = physicsState.current.get(connectedId)?.restPosition ?? connectedJoint.position;
        
        // Calculate rest distance
        const restDiff = vec3.sub(state.restPosition, connectedRestPos);
        const restDist = vec3.length(restDiff);
        
        // Current distance
        const currentDiff = vec3.sub(currentPos, connectedPos);
        const currentDist = vec3.length(currentDiff);
        
        // Apply constraint force to maintain distance
        if (currentDist > 0 && restDist > 0) {
          const stretch = currentDist - restDist;
          const constraintDir = vec3.normalize(currentDiff);
          const constraintForce = vec3.scale(constraintDir, -stretch * stiffness * 0.5);
          force = vec3.add(force, constraintForce);
        }
      });
      
      // Apply acceleration (F = ma)
      const accel = vec3.scale(force, 1 / mass);
      
      // Integrate velocity
      state.velocity = vec3.add(state.velocity, vec3.scale(accel, dt));
      
      // Apply damping
      state.velocity = vec3.scale(state.velocity, damping);
      
      // Integrate position
      const newPos = vec3.add(currentPos, vec3.scale(state.velocity, dt));
      
      // Ground collision
      if (newPos[1] < -1.4) {
        newPos[1] = -1.4;
        state.velocity[1] = -state.velocity[1] * 0.3;
      }
      
      newPositions.set(joint.id, newPos);
    });
    
    setSimulatedPositions(newPositions);
  });
  
  const startDrag = useCallback((id: string) => {
    draggingJoint.current = id;
  }, []);
  
  const updateDrag = useCallback((id: string, position: [number, number, number]) => {
    if (draggingJoint.current === id) {
      dragTarget.current = position;
    }
  }, []);
  
  const endDrag = useCallback((id: string) => {
    if (draggingJoint.current === id) {
      // Update rest position to current position
      const state = physicsState.current.get(id);
      const currentPos = simulatedPositions.get(id);
      if (state && currentPos) {
        state.restPosition = [...currentPos] as [number, number, number];
        onUpdatePosition?.(id, currentPos);
      }
      draggingJoint.current = null;
      dragTarget.current = null;
    }
  }, [simulatedPositions, onUpdatePosition]);
  
  const getPosition = useCallback((id: string, defaultPos: [number, number, number]): [number, number, number] => {
    return simulatedPositions.get(id) ?? defaultPos;
  }, [simulatedPositions]);
  
  return {
    getPosition,
    startDrag,
    updateDrag,
    endDrag,
    isDragging: (id: string) => draggingJoint.current === id,
  };
}

// Scene content
function SceneContent({
  joints,
  bones,
  clayLayers,
  selectedJoint,
  onSelectJoint,
  onUpdateJointPosition,
  brushSize,
  activeTool,
  physicsEnabled = false
}: Omit<SkeletonViewport3DProps, 'zoom' | 'brushStrength'>) {
  const physics = useJointPhysics(joints, physicsEnabled, onUpdateJointPosition);
  
  const handleMissedClick = () => {
    onSelectJoint(null);
  };
  
  // Get physics-adjusted joints
  const physicsJoints = joints.map(joint => ({
    ...joint,
    position: physicsEnabled ? physics.getPosition(joint.id, joint.position) : joint.position,
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#87CEEB" />
      <Environment preset="city" />
      
      {/* Render connection rods between joints */}
      {physicsJoints.map((joint) =>
        joint.connectedTo.map((parentId) => {
          const parent = physicsJoints.find(j => j.id === parentId);
          if (!parent) return null;
          return (
            <ConnectionRod
              key={`${joint.id}-${parentId}`}
              startJoint={parent}
              endJoint={joint}
            />
          );
        })
      )}
      
      {/* Render bone structures */}
      {bones.map((bone) => (
        <BoneRod key={bone.id} bone={bone} joints={physicsJoints} />
      ))}
      
      {/* Render clay layers */}
      {clayLayers.map((layer) => (
        <ClayLayerMesh key={layer.id} layer={layer} bones={bones} joints={physicsJoints} />
      ))}
      
      {/* Render joint spheres */}
      {physicsJoints.map((joint) => (
        <JointSphere
          key={joint.id}
          joint={joint}
          isSelected={selectedJoint === joint.id}
          onClick={() => onSelectJoint(joint.id)}
          isDragging={physics.isDragging(joint.id)}
          onDragStart={physics.startDrag}
          onDrag={physics.updateDrag}
          onDragEnd={physics.endDrag}
          physicsEnabled={physicsEnabled}
          allJoints={physicsJoints}
        />
      ))}
      
      {/* Ground plane for deselection */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
        onClick={handleMissedClick}
        visible={false}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Grid */}
      <Grid
        infiniteGrid
        cellSize={0.25}
        cellThickness={0.5}
        cellColor="hsl(220, 10%, 35%)"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="hsl(220, 15%, 45%)"
        fadeDistance={15}
        fadeStrength={1}
        followCamera={false}
        position={[0, -1.5, 0]}
      />
      
      <ContactShadows
        position={[0, -1.49, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
      />
      
      {/* Brush cursor */}
      {['sculpt', 'smooth', 'pinch', 'inflate'].includes(activeTool) && (
        <BrushCursor size={brushSize} visible={true} />
      )}
    </>
  );
}

// Camera controller for zoom
function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const distance = 5 - (zoom / 100) * 3;
    camera.position.setLength(Math.max(1.5, distance));
  }, [zoom, camera]);
  
  return null;
}

export function SkeletonViewport3D(props: SkeletonViewport3DProps) {
  const { zoom, physicsEnabled = false, ...sceneProps } = props;
  
  return (
    <div className="w-full h-full relative bg-gradient-to-b from-muted/30 to-muted/50 rounded-lg overflow-hidden">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Loading 3D...</span>
          </div>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[2, 1.5, 2]} fov={50} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={10}
            enablePan
            enableZoom
            target={[0, 0.3, 0]}
          />
          <CameraController zoom={zoom} />
          <SceneContent {...sceneProps} physicsEnabled={physicsEnabled} />
        </Canvas>
      </Suspense>
      
      {/* Physics indicator */}
      {physicsEnabled && (
        <div className="absolute top-2 left-2 text-[10px] text-green-400 bg-background/70 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Physics Active
        </div>
      )}
      
      {/* Viewport controls hint */}
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-background/70 px-2 py-1 rounded backdrop-blur-sm">
        LMB: Rotate | RMB: Pan | Scroll: Zoom | Click: Select {physicsEnabled && '| Drag: Move Joint'}
      </div>
    </div>
  );
}
