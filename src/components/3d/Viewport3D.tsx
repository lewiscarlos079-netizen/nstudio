import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  OrthographicCamera,
  Environment,
  Grid,
  GizmoHelper,
  GizmoViewport,
  ContactShadows
} from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/sceneStore';
import { SceneObjectMesh } from './SceneObject';
import { SceneTransformGizmos } from './TransformGizmo';
import * as THREE from 'three';

function Scene() {
  const { objects, selectObject, showGrid, setTransformMode, selectedObjectId, removeObject, duplicateObject, toggleObjectLock, toggleObjectVisibility, toggleGrid } = useSceneStore();

  const handleMissedClick = () => {
    selectObject(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'q':
          setTransformMode('select');
          break;
        case 'w':
          setTransformMode('translate');
          break;
        case 'e':
          setTransformMode('rotate');
          break;
        case 'r':
          setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          if (selectedObjectId) removeObject(selectedObjectId);
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (selectedObjectId) duplicateObject(selectedObjectId);
          }
          break;
        case 'l':
          if (selectedObjectId) toggleObjectLock(selectedObjectId);
          break;
        case 'h':
          if (selectedObjectId) toggleObjectVisibility(selectedObjectId);
          break;
        case 'g':
          toggleGrid();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTransformMode, selectedObjectId, removeObject, duplicateObject, toggleObjectLock, toggleObjectVisibility, toggleGrid]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d4ff" />
      
      {/* Render all scene objects */}
      {objects.map((object) => (
        <SceneObjectMesh key={object.id} object={object} />
      ))}

      {/* Transform gizmos for selected objects */}
      <SceneTransformGizmos />

      {/* Clickable ground plane for deselection */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        onClick={handleMissedClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground grid */}
      {showGrid && (
        <Grid 
          infiniteGrid 
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="hsl(38, 95%, 55%)"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="hsl(270, 70%, 55%)"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
      )}

      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Environment preset="night" />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-muted-foreground font-body">Loading 3D Environment...</span>
      </div>
    </div>
  );
}

interface Viewport3DProps {
  className?: string;
}

export function Viewport3D({ className }: Viewport3DProps) {
  const { transformMode, objects, cameraMode } = useSceneStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-card rounded-xl overflow-hidden border border-primary/20 ${className}`}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows dpr={[1, 2]}>
          {cameraMode === '3D' ? (
            <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
          ) : (
            <OrthographicCamera 
              makeDefault 
              position={[0, 10, 0]} 
              zoom={80} 
              rotation={[-Math.PI / 2, 0, 0]}
            />
          )}
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={cameraMode === '3D' ? 2 : undefined}
            maxDistance={cameraMode === '3D' ? 50 : undefined}
            minZoom={cameraMode === '2D' ? 20 : undefined}
            maxZoom={cameraMode === '2D' ? 200 : undefined}
            enableRotate={cameraMode === '3D'}
          />
          <Scene />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport 
              axisColors={['#ff4444', '#44ff44', '#4444ff']} 
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </Suspense>

      {/* Viewport overlay info - pushed forward with z-index and pointer-events */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none">
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 bg-background/80 backdrop-blur-md shadow-lg">
          {cameraMode === '3D' ? 'Perspective View' : 'Top-Down 2D View'}
        </div>
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 capitalize bg-background/80 backdrop-blur-md shadow-lg">
          {transformMode} Mode
        </div>
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 bg-background/80 backdrop-blur-md shadow-lg">
          {objects.length} Objects
        </div>
      </div>

      {/* Viewport controls hint - pushed forward */}
      <div className="absolute bottom-4 left-4 text-xs text-foreground/80 font-mono z-20 pointer-events-none bg-background/70 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg">
        {cameraMode === '3D' 
          ? 'LMB: Rotate View | RMB: Pan | WASD: Move | QE: Up/Down | Scroll: Rotate Y | Shift+Scroll: Rotate X'
          : 'LMB: Pan | Scroll: Zoom | Click objects to select'
        }
      </div>
    </motion.div>
  );
}
