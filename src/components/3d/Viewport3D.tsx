import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  Grid,
  GizmoHelper,
  GizmoViewport,
  ContactShadows
} from '@react-three/drei';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d4ff" />
      
      {/* Demo object - a glowing cube */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ground grid */}
      <Grid 
        infiniteGrid 
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00d4ff"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#7c3aed"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
      />

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
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-card rounded-xl overflow-hidden border border-primary/20 ${className}`}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={20}
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

      {/* Viewport overlay info */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground">
          Perspective View
        </div>
      </div>

      {/* Viewport controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/60 font-mono">
        LMB: Rotate | RMB: Pan | Scroll: Zoom
      </div>
    </motion.div>
  );
}
