import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { FacialRig, AnimalFacialRig } from './FacialRig';
import { ClothMesh, Cape, BannerFlag } from './ClothSimulation';
import { StyledMaterial } from './Materials';

// Intro scene types for the trailer
type IntroSceneType = 
  | 'robots-farming'
  | 'skydiving'
  | 'surfing'
  | 'racing'
  | 'space';

interface IntroScene3DProps {
  sceneType: IntroSceneType;
  isPlaying: boolean;
}

// Robot Farming Scene
function RobotsFarmingScene({ isPlaying }: { isPlaying: boolean }) {
  const robotRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!isPlaying) return;

    if (robotRef.current) {
      robotRef.current.position.x = Math.sin(time * 0.5) * 0.5;
      robotRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(time * 2) * 0.3 - 0.5;
    }
  });

  return (
    <group>
      {/* Ground/Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20, 32, 32]} />
        <StyledMaterial color="#4A7040" style="standard" surface="organic" />
      </mesh>

      {/* Crop rows */}
      {[-2, -1, 0, 1, 2].map((z) => (
        <group key={z} position={[0, -0.9, z * 1.5]}>
          {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
            <mesh key={x} position={[x * 0.6, 0.15, 0]}>
              <coneGeometry args={[0.08, 0.3, 6]} />
              <StyledMaterial color="#3A6B35" style="standard" surface="organic" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Robot */}
      <group ref={robotRef} position={[0, 0, 0]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.3]} />
          <StyledMaterial color="#A8ADB3" style="standard" surface="metal" />
        </mesh>
        
        {/* Head with facial features */}
        <group position={[0, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.3, 0.25]} />
            <StyledMaterial color="#5A6066" style="standard" surface="metal" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.08, 0.02, 0.13]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <StyledMaterial color="#3b82f6" style="standard" emissive="#3b82f6" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.08, 0.02, 0.13]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <StyledMaterial color="#3b82f6" style="standard" emissive="#3b82f6" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Arms */}
        <group ref={armRef} position={[0.35, 0.1, 0]}>
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <StyledMaterial color="#5A6066" style="standard" surface="metal" />
          </mesh>
          {/* Tool/hand */}
          <mesh position={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.03, 0.15, 8]} />
            <StyledMaterial color="#C87040" style="standard" surface="metal" />
          </mesh>
        </group>

        {/* Legs/Wheels */}
        <mesh position={[-0.15, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>
        <mesh position={[0.15, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>
      </group>

      {/* Sun/sky lighting */}
      <pointLight position={[5, 8, 5]} intensity={2} color="#fff5e6" />
      <ambientLight intensity={0.4} color="#87ceeb" />
    </group>
  );
}

// Skydiving Scene
function SkydivingScene({ isPlaying }: { isPlaying: boolean }) {
  const diverRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!isPlaying) return;

    if (diverRef.current) {
      diverRef.current.rotation.x = Math.sin(time * 0.8) * 0.15;
      diverRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      diverRef.current.position.y = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <group>
      {/* Clouds below */}
      {[...Array(15)].map((_, i) => (
        <Float key={i} speed={0.5} floatIntensity={0.3}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 10,
              -3 - Math.random() * 5,
              (Math.random() - 0.5) * 10
            ]}
          >
            <sphereGeometry args={[0.5 + Math.random() * 1, 8, 8]} />
            <StyledMaterial color="#ffffff" style="standard" opacity={0.8} transparent />
          </mesh>
        </Float>
      ))}

      {/* Skydiver */}
      <group ref={diverRef} position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
        {/* Body with suit */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.15, 0.4, 10, 16]} />
          <StyledMaterial color="#8B3030" style="standard" surface="fabric" />
        </mesh>

        {/* Head with facial rig */}
        <group position={[0, 0.45, 0.05]}>
          <FacialRig 
            expression="surprised"
            skinColor="#D4A574"
            style="standard"
            scale={0.8}
          />
          {/* Goggles */}
          <mesh position={[0, 0.02, 0.12]}>
            <boxGeometry args={[0.12, 0.04, 0.02]} />
            <StyledMaterial color="#1a1a1a" style="standard" surface="plastic" />
          </mesh>
        </group>

        {/* Arms spread */}
        <mesh position={[-0.35, 0.05, 0]} rotation={[0, 0, 0.8]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 12]} />
          <StyledMaterial color="#8B3030" style="standard" surface="fabric" />
        </mesh>
        <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, -0.8]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 12]} />
          <StyledMaterial color="#8B3030" style="standard" surface="fabric" />
        </mesh>

        {/* Legs spread */}
        <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
          <StyledMaterial color="#252D3A" style="standard" surface="fabric" />
        </mesh>
        <mesh position={[0.15, -0.4, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
          <StyledMaterial color="#252D3A" style="standard" surface="fabric" />
        </mesh>

        {/* Parachute pack */}
        <mesh position={[0, 0.1, -0.2]}>
          <boxGeometry args={[0.2, 0.3, 0.1]} />
          <StyledMaterial color="#1a1a1a" style="standard" surface="fabric" />
        </mesh>
      </group>

      {/* Sky gradient effect */}
      <mesh position={[0, 10, -15]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color="#87ceeb" />
      </mesh>
    </group>
  );
}

// Surfing Scene
function SurfingScene({ isPlaying }: { isPlaying: boolean }) {
  const surferRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!isPlaying) return;

    if (surferRef.current) {
      surferRef.current.position.y = Math.sin(time * 1.5) * 0.15;
      surferRef.current.rotation.z = Math.sin(time * 2) * 0.1;
      surferRef.current.rotation.x = Math.sin(time * 1.2) * 0.05;
    }

    if (waveRef.current) {
      const geo = waveRef.current.geometry as THREE.PlaneGeometry;
      const positions = geo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        positions.setY(i, Math.sin(x * 0.5 + time) * 0.3 + Math.sin(z * 0.3 + time * 0.8) * 0.2);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ocean water */}
      <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[15, 15, 32, 32]} />
        <StyledMaterial color="#4A6080" style="standard" surface="glass" opacity={0.9} transparent />
      </mesh>

      {/* Surfer */}
      <group ref={surferRef} position={[0, 0.3, 0]}>
        {/* Surfboard */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.03, 1.5]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="plastic" />
        </mesh>

        {/* Surfer body */}
        <mesh position={[0, 0.35, 0.1]}>
          <capsuleGeometry args={[0.12, 0.35, 10, 16]} />
          <StyledMaterial color="#D4A574" style="standard" surface="skin" />
        </mesh>

        {/* Head */}
        <group position={[0, 0.75, 0.1]}>
          <FacialRig 
            expression="happy"
            skinColor="#C49060"
            style="standard"
            scale={0.7}
          />
        </group>

        {/* Arms in balance position */}
        <mesh position={[-0.3, 0.4, 0.1]} rotation={[0, 0, 0.8]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 12]} />
          <StyledMaterial color="#C49060" style="standard" surface="skin" />
        </mesh>
        <mesh position={[0.3, 0.4, 0.1]} rotation={[0, 0, -0.8]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 12]} />
          <StyledMaterial color="#C49060" style="standard" surface="skin" />
        </mesh>

        {/* Bent legs */}
        <mesh position={[-0.1, 0.1, 0.15]} rotation={[0.5, 0, 0.1]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 12]} />
          <StyledMaterial color="#3A5070" style="standard" surface="fabric" />
        </mesh>
        <mesh position={[0.1, 0.1, -0.1]} rotation={[-0.3, 0, -0.1]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 12]} />
          <StyledMaterial color="#3A5070" style="standard" surface="fabric" />
        </mesh>
      </group>

      {/* Spray effects */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.5}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 2,
              -0.3 + Math.random() * 0.5,
              (Math.random() - 0.5) * 2
            ]}
          >
            <sphereGeometry args={[0.03 + Math.random() * 0.05, 6, 6]} />
            <StyledMaterial color="#ffffff" style="standard" opacity={0.6} transparent />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Racing Scene
function RacingScene({ isPlaying }: { isPlaying: boolean }) {
  const carRef = useRef<THREE.Group>(null);
  const wheelFLRef = useRef<THREE.Mesh>(null);
  const wheelFRRef = useRef<THREE.Mesh>(null);
  const wheelBLRef = useRef<THREE.Mesh>(null);
  const wheelBRRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!isPlaying) return;

    const speed = 15;
    [wheelFLRef, wheelFRRef, wheelBLRef, wheelBRRef].forEach(ref => {
      if (ref.current) {
        ref.current.rotation.x = time * speed;
      }
    });

    if (carRef.current) {
      carRef.current.position.x = Math.sin(time * 0.3) * 0.3;
      carRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
    }
  });

  return (
    <group>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[3, 20]} />
        <StyledMaterial color="#303030" style="standard" surface="stone" />
      </mesh>
      {/* Road lines */}
      {[-5, -2.5, 0, 2.5, 5].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, z]}>
          <planeGeometry args={[0.1, 1.5]} />
          <StyledMaterial color="#ffffff" style="standard" />
        </mesh>
      ))}

      {/* Race car */}
      <group ref={carRef} position={[0, 0, 0]}>
        {/* Body */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.7, 0.2, 1.4]} />
          <StyledMaterial color="#8B3030" style="standard" surface="metal" />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 0.32, -0.1]}>
          <boxGeometry args={[0.5, 0.15, 0.5]} />
          <StyledMaterial color="#202020" style="standard" surface="glass" />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.22, 0.45]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.65, 0.1, 0.5]} />
          <StyledMaterial color="#8B3030" style="standard" surface="metal" />
        </mesh>

        {/* Driver with facial rig (visible through window) */}
        <group position={[0, 0.3, -0.1]} scale={0.4}>
          <FacialRig 
            expression="happy"
            skinColor="#D4A574"
            style="standard"
          />
          {/* Helmet */}
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <StyledMaterial color="#ffffff" style="standard" surface="plastic" />
          </mesh>
        </group>

        {/* Wheels */}
        <mesh ref={wheelFLRef} position={[-0.4, -0.1, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>
        <mesh ref={wheelFRRef} position={[0.4, -0.1, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>
        <mesh ref={wheelBLRef} position={[-0.4, -0.1, -0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>
        <mesh ref={wheelBRRef} position={[0.4, -0.1, -0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <StyledMaterial color="#252525" style="standard" surface="rubber" />
        </mesh>

        {/* Spoiler */}
        <mesh position={[0, 0.35, -0.65]}>
          <boxGeometry args={[0.7, 0.02, 0.15]} />
          <StyledMaterial color="#8B3030" style="standard" surface="metal" />
        </mesh>
        <mesh position={[-0.25, 0.28, -0.65]}>
          <boxGeometry args={[0.03, 0.12, 0.08]} />
          <StyledMaterial color="#303030" style="standard" surface="metal" />
        </mesh>
        <mesh position={[0.25, 0.28, -0.65]}>
          <boxGeometry args={[0.03, 0.12, 0.08]} />
          <StyledMaterial color="#303030" style="standard" surface="metal" />
        </mesh>
      </group>

      {/* Speed lines */}
      {[...Array(10)].map((_, i) => (
        <mesh 
          key={i} 
          position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5, -3 - i * 0.5]}
        >
          <boxGeometry args={[0.02, 0.02, 0.5 + Math.random() * 0.5]} />
          <StyledMaterial color="#ffffff" style="standard" opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  );
}

// Space Exploration Scene
function SpaceScene({ isPlaying }: { isPlaying: boolean }) {
  const shipRef = useRef<THREE.Group>(null);
  const astronautRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!isPlaying) return;

    if (shipRef.current) {
      shipRef.current.rotation.y = time * 0.1;
      shipRef.current.position.y = Math.sin(time * 0.2) * 0.1;
    }

    if (astronautRef.current) {
      astronautRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      astronautRef.current.position.x = Math.sin(time * 0.4) * 0.3;
    }
  });

  return (
    <group>
      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

      {/* Space station */}
      <group ref={shipRef} position={[-2, 0, -3]}>
        {/* Main module */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
          <StyledMaterial color="#A8ADB3" style="standard" surface="metal" />
        </mesh>
        {/* Solar panels */}
        <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2, 0.02, 0.5]} />
          <StyledMaterial color="#3A5070" style="standard" surface="metal" />
        </mesh>
        {/* Docking port */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.2, 12]} />
          <StyledMaterial color="#5A6066" style="standard" surface="metal" />
        </mesh>
      </group>

      {/* Astronaut with facial rig */}
      <group ref={astronautRef} position={[0.5, 0, 0]}>
        {/* Suit body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.4, 10, 16]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="fabric" />
        </mesh>

        {/* Helmet */}
        <group position={[0, 0.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 20, 20]} />
            <StyledMaterial color="#E8E5E0" style="standard" surface="plastic" />
          </mesh>
          {/* Visor */}
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.15, 16, 16, 0, Math.PI, 0, Math.PI]} />
            <StyledMaterial color="#3A5070" style="standard" surface="glass" opacity={0.6} transparent />
          </mesh>
          {/* Face inside helmet */}
          <group position={[0, 0, 0.02]} scale={0.6}>
            <FacialRig 
              expression="surprised"
              skinColor="#D4A574"
              style="standard"
            />
          </group>
        </group>

        {/* Arms */}
        <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="fabric" />
        </mesh>
        <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="fabric" />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.12, -0.5, 0]}>
          <capsuleGeometry args={[0.09, 0.35, 8, 12]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="fabric" />
        </mesh>
        <mesh position={[0.12, -0.5, 0]}>
          <capsuleGeometry args={[0.09, 0.35, 8, 12]} />
          <StyledMaterial color="#E8E5E0" style="standard" surface="fabric" />
        </mesh>

        {/* Jetpack */}
        <mesh position={[0, 0.1, -0.25]}>
          <boxGeometry args={[0.25, 0.35, 0.15]} />
          <StyledMaterial color="#5A6066" style="standard" surface="metal" />
        </mesh>
        {/* Thrusters */}
        <mesh position={[-0.08, -0.1, -0.3]}>
          <cylinderGeometry args={[0.03, 0.04, 0.08, 8]} />
          <StyledMaterial color="#C87040" style="standard" emissive="#C87040" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.08, -0.1, -0.3]}>
          <cylinderGeometry args={[0.03, 0.04, 0.08, 8]} />
          <StyledMaterial color="#C87040" style="standard" emissive="#C87040" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Planet in background */}
      <mesh position={[3, -2, -8]}>
        <sphereGeometry args={[3, 32, 32]} />
        <StyledMaterial color="#4A6080" style="standard" surface="stone" />
      </mesh>
      {/* Planet atmosphere */}
      <mesh position={[3, -2, -8]}>
        <sphereGeometry args={[3.1, 32, 32]} />
        <StyledMaterial color="#87ceeb" style="standard" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// Main scene selector
function SceneContent({ sceneType, isPlaying }: IntroScene3DProps) {
  switch (sceneType) {
    case 'robots-farming':
      return <RobotsFarmingScene isPlaying={isPlaying} />;
    case 'skydiving':
      return <SkydivingScene isPlaying={isPlaying} />;
    case 'surfing':
      return <SurfingScene isPlaying={isPlaying} />;
    case 'racing':
      return <RacingScene isPlaying={isPlaying} />;
    case 'space':
      return <SpaceScene isPlaying={isPlaying} />;
    default:
      return <RobotsFarmingScene isPlaying={isPlaying} />;
  }
}

// Exported component for the intro trailer
interface IntroTrailer3DProps {
  sceneType: IntroSceneType;
  isPlaying?: boolean;
}

export function IntroTrailer3D({ sceneType, isPlaying = true }: IntroTrailer3DProps) {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#a78bfa" />
      
      <Suspense fallback={null}>
        <SceneContent sceneType={sceneType} isPlaying={isPlaying} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

export type { IntroSceneType };
