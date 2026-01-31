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
import { Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/sceneStore';
import { SceneObjectMesh } from './SceneObject';
import { SceneTransformGizmos } from './TransformGizmo';
import { WeatherParticles, WeatherType } from './WeatherParticles';
import * as THREE from 'three';

// Lighting presets for different times of day
function SceneLighting({ timeOfDay }: { timeOfDay: 'day' | 'night' | 'sunset' }) {
  const lightConfigs = {
    day: {
      ambient: 0.5,
      directionalIntensity: 1.2,
      directionalColor: '#ffffff',
      pointColor: '#87CEEB',
      pointIntensity: 0.3,
      environment: 'city' as const,
    },
    sunset: {
      ambient: 0.35,
      directionalIntensity: 0.9,
      directionalColor: '#FF6B35',
      pointColor: '#FF8C00',
      pointIntensity: 0.5,
      environment: 'sunset' as const,
    },
    night: {
      ambient: 0.15,
      directionalIntensity: 0.3,
      directionalColor: '#4169E1',
      pointColor: '#00d4ff',
      pointIntensity: 0.7,
      environment: 'night' as const,
    },
  };

  const config = lightConfigs[timeOfDay];

  return (
    <>
      <ambientLight intensity={config.ambient} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={config.directionalIntensity} 
        color={config.directionalColor}
        castShadow 
      />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={config.pointIntensity} 
        color={config.pointColor} 
      />
      <Environment preset={config.environment} />
    </>
  );
}

// Weather state for viewport
interface SceneProps {
  weather?: WeatherType;
  weatherIntensity?: number;
}

function Scene({ weather = 'clear', weatherIntensity = 0.5 }: SceneProps) {
  const { objects, selectObject, showGrid, setTransformMode, selectedObjectId, removeObject, duplicateObject, toggleObjectLock, toggleObjectVisibility, toggleGrid, timeOfDay } = useSceneStore();

  const handleMissedClick = () => {
    selectObject(null);
  };

  // Keyboard shortcuts - Fixed Q/E for vertical movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      const selectedObject = selectedObjectId ? objects.find(o => o.id === selectedObjectId) : null;

      switch (key) {
        // Q and E are now for vertical movement (up/down)
        case 'q':
          if (selectedObject && !selectedObject.locked) {
            const newPos: [number, number, number] = [
              selectedObject.position[0],
              selectedObject.position[1] - 0.5, // Move down
              selectedObject.position[2]
            ];
            // Direct update via store if available
            useSceneStore.getState().updateObject(selectedObject.id, { position: newPos });
          }
          break;
        case 'e':
          if (selectedObject && !selectedObject.locked) {
            const newPos: [number, number, number] = [
              selectedObject.position[0],
              selectedObject.position[1] + 0.5, // Move up
              selectedObject.position[2]
            ];
            useSceneStore.getState().updateObject(selectedObject.id, { position: newPos });
          }
          break;
        case 't':
          setTransformMode('translate');
          break;
        case 'r':
          setTransformMode('rotate');
          break;
        case 's':
          if (!e.ctrlKey && !e.metaKey) {
            setTransformMode('scale');
          }
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
  }, [setTransformMode, selectedObjectId, removeObject, duplicateObject, toggleObjectLock, toggleObjectVisibility, toggleGrid, objects]);

  return (
    <>
      {/* Dynamic lighting based on time of day */}
      <SceneLighting timeOfDay={timeOfDay} />
      
      {/* Weather particles */}
      {weather !== 'clear' && (
        <WeatherParticles weather={weather} intensity={weatherIntensity} />
      )}
      
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
          cellColor="hsl(220, 10%, 40%)"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="hsl(220, 15%, 50%)"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
      )}

      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={timeOfDay === 'night' ? 0.2 : 0.4}
        scale={10}
        blur={2}
        far={4}
      />
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
  const { transformMode, objects, cameraMode, timeOfDay } = useSceneStore();
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [weatherIntensity, setWeatherIntensity] = useState(0.5);

  // Listen for weather changes from WeatherSystem
  useEffect(() => {
    const handleWeatherChange = (e: CustomEvent) => {
      setWeather(e.detail.weather || 'clear');
      setWeatherIntensity(e.detail.intensity || 0.5);
    };
    window.addEventListener('weatherChange' as any, handleWeatherChange);
    return () => window.removeEventListener('weatherChange' as any, handleWeatherChange);
  }, []);

  const timeLabels = {
    day: '☀️ Day',
    sunset: '🌅 Sunset',
    night: '🌙 Night'
  };

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
          <Scene weather={weather} weatherIntensity={weatherIntensity} />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport 
              axisColors={['#ff4444', '#44ff44', '#4444ff']} 
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </Suspense>

      {/* Viewport overlay info - pushed forward with z-index and pointer-events */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none flex-wrap">
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 bg-background/80 backdrop-blur-md shadow-lg">
          {cameraMode === '3D' ? 'Perspective View' : 'Top-Down 2D View'}
        </div>
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 capitalize bg-background/80 backdrop-blur-md shadow-lg">
          {transformMode} Mode
        </div>
        <div className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 bg-background/80 backdrop-blur-md shadow-lg">
          {objects.length} Objects
        </div>
        <div className={`glass px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/90 bg-background/80 backdrop-blur-md shadow-lg ${timeOfDay === 'night' ? 'border border-blue-500/30' : timeOfDay === 'sunset' ? 'border border-orange-500/30' : ''}`}>
          {timeLabels[timeOfDay]}
        </div>
      </div>

      {/* Viewport controls hint - pushed forward */}
      <div className="absolute bottom-4 left-4 text-xs text-foreground/80 font-mono z-20 pointer-events-none bg-background/70 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg">
        {cameraMode === '3D' 
          ? 'LMB: Rotate | RMB: Pan | Q: Down | E: Up | T: Move | R: Rotate | S: Scale | Scroll: Zoom'
          : 'LMB: Pan | Scroll: Zoom | Click to select | Q/E: Vertical movement'
        }
      </div>
    </motion.div>
  );
}
