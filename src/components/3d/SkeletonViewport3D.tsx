import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface JointBall {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  connectedTo: string[];
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
  zoom: number;
  brushSize: number;
  brushStrength: number;
  activeTool: string;
}

// 3D Joint sphere component
function JointSphere({ 
  joint, 
  isSelected, 
  onClick 
}: { 
  joint: JointBall; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh
      ref={meshRef}
      position={joint.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <sphereGeometry args={[joint.radius, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? '#00d4ff' : joint.color}
        metalness={0.3}
        roughness={0.4}
        emissive={isSelected ? '#00d4ff' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
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

// Scene content
function SceneContent({
  joints,
  bones,
  clayLayers,
  selectedJoint,
  onSelectJoint,
  brushSize,
  activeTool
}: Omit<SkeletonViewport3DProps, 'zoom' | 'brushStrength'>) {
  const handleMissedClick = () => {
    onSelectJoint(null);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#87CEEB" />
      <Environment preset="city" />
      
      {/* Render connection rods between joints */}
      {joints.map((joint) =>
        joint.connectedTo.map((parentId) => {
          const parent = joints.find(j => j.id === parentId);
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
        <BoneRod key={bone.id} bone={bone} joints={joints} />
      ))}
      
      {/* Render clay layers */}
      {clayLayers.map((layer) => (
        <ClayLayerMesh key={layer.id} layer={layer} bones={bones} joints={joints} />
      ))}
      
      {/* Render joint spheres */}
      {joints.map((joint) => (
        <JointSphere
          key={joint.id}
          joint={joint}
          isSelected={selectedJoint === joint.id}
          onClick={() => onSelectJoint(joint.id)}
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
  const { zoom, ...sceneProps } = props;
  
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
          <SceneContent {...sceneProps} />
        </Canvas>
      </Suspense>
      
      {/* Viewport controls hint */}
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-background/70 px-2 py-1 rounded backdrop-blur-sm">
        LMB: Rotate | RMB: Pan | Scroll: Zoom | Click: Select
      </div>
    </div>
  );
}
