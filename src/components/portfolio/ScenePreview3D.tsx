import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ScenePreview3DProps {
  sceneIndex: number;
  projectType?: string;
  isPlaying: boolean;
}

// Character model for movie scenes
function CharacterModel({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isPlaying) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#f4c29a" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.65, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2d1810" />
      </mesh>
      <mesh position={[0.08, 1.65, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2d1810" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.35, 1.1, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.06, 0.4, 8, 16]} />
        <meshStandardMaterial color="#f4c29a" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.06, 0.4, 8, 16]} />
        <meshStandardMaterial color="#f4c29a" roughness={0.6} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Environment scene with terrain
function EnvironmentScene({ isPlaying }: { isPlaying: boolean }) {
  const treesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treesRef.current && isPlaying) {
      treesRef.current.children.forEach((tree, i) => {
        tree.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.05;
      });
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      
      {/* Trees */}
      <group ref={treesRef}>
        {[[-1.5, 0], [1.5, 0.5], [0, -1.5], [-0.5, 1.2], [2, -1]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
              <meshStandardMaterial color="#5d4037" roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 0.9, 0]}>
              <coneGeometry args={[0.4, 0.8, 8]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <coneGeometry args={[0.3, 0.6, 8]} />
              <meshStandardMaterial color="#388e3c" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Sun */}
      <mesh position={[3, 3, -3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffd54f" />
      </mesh>
    </group>
  );
}

// Action scene with effects
function ActionScene({ isPlaying }: { isPlaying: boolean }) {
  const effectsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (effectsRef.current && isPlaying) {
      effectsRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group>
      {/* Central energy sphere */}
      <Float speed={isPlaying ? 4 : 0} rotationIntensity={isPlaying ? 2 : 0}>
        <mesh>
          <icosahedronGeometry args={[0.5, 2]} />
          <MeshDistortMaterial
            color="#f97316"
            speed={isPlaying ? 5 : 0}
            distort={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      
      {/* Orbiting particles */}
      <group ref={effectsRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.2, Math.sin(angle) * 0.5, Math.sin(angle) * 1.2]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#ef4444' : '#f97316'}
                emissive={i % 2 === 0 ? '#ef4444' : '#f97316'}
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Lightning bolts */}
      {isPlaying && [...Array(3)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 2) * 0.8, 0.5, Math.sin(i * 2) * 0.8]}>
          <boxGeometry args={[0.02, 0.8, 0.02]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

// Product showcase
function ProductShowcase({ isPlaying }: { isPlaying: boolean }) {
  const productRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (productRef.current) {
      productRef.current.rotation.y = state.clock.elapsedTime * (isPlaying ? 0.5 : 0.1);
    }
  });

  return (
    <group>
      {/* Product */}
      <mesh ref={productRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.71, 0.1]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      
      {/* Pedestal */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.1, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Game level scene
function GameLevelScene({ isPlaying }: { isPlaying: boolean }) {
  const platformsRef = useRef<THREE.Group>(null);
  const playerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (playerRef.current && isPlaying) {
      playerRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 1.5;
      playerRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.5 + 0.5;
    }
    if (platformsRef.current && isPlaying) {
      platformsRef.current.children.forEach((platform, i) => {
        platform.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.2 - 0.3;
      });
    }
  });

  return (
    <group>
      {/* Platforms */}
      <group ref={platformsRef}>
        {[[-2, 0], [-0.5, 0.5], [1, 0], [2.5, 0.3]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.3, z]}>
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#22c55e' : '#16a34a'} />
          </mesh>
        ))}
      </group>
      
      {/* Player character */}
      <mesh ref={playerRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Collectibles */}
      {[[1, 1], [-1, 0.8], [2, 1.2]].map(([x, y], i) => (
        <Float key={i} speed={3} floatIntensity={0.5}>
          <mesh position={[x, y, 0]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
      
      {/* Coins */}
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.3}>
          <mesh position={[-1.5 + i * 0.8, 0.3 + Math.sin(i) * 0.2, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Boss fight scene
function BossFightScene({ isPlaying }: { isPlaying: boolean }) {
  const bossRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bossRef.current && isPlaying) {
      bossRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      bossRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Boss */}
      <group ref={bossRef}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshWobbleMaterial 
            color="#7c3aed" 
            speed={isPlaying ? 2 : 0} 
            factor={0.3}
            metalness={0.5}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.2, 1.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.2, 1.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Horns */}
        <mesh position={[-0.4, 1.5, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial color="#1e1b4b" />
        </mesh>
        <mesh position={[0.4, 1.5, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial color="#1e1b4b" />
        </mesh>
      </group>
      
      {/* Arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      
      {/* Fire effects */}
      {isPlaying && [...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <Float key={i} speed={5} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}>
              <coneGeometry args={[0.1, 0.4, 8]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#ef4444' : '#f97316'} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// Scene selector based on project type and scene index
function SceneContent({ sceneIndex, projectType, isPlaying }: ScenePreview3DProps) {
  const scenes = useMemo(() => {
    switch (projectType) {
      case 'movie-3d':
        return [
          <EnvironmentScene key={0} isPlaying={isPlaying} />,
          <CharacterModel key={1} isPlaying={isPlaying} />,
          <ActionScene key={2} isPlaying={isPlaying} />,
          <EnvironmentScene key={3} isPlaying={isPlaying} />,
        ];
      case 'game':
        return [
          <GameLevelScene key={0} isPlaying={isPlaying} />,
          <GameLevelScene key={1} isPlaying={isPlaying} />,
          <BossFightScene key={2} isPlaying={isPlaying} />,
          <ProductShowcase key={3} isPlaying={isPlaying} />,
        ];
      default:
        return [
          <ProductShowcase key={0} isPlaying={isPlaying} />,
          <CharacterModel key={1} isPlaying={isPlaying} />,
          <EnvironmentScene key={2} isPlaying={isPlaying} />,
        ];
    }
  }, [projectType, isPlaying]);

  return scenes[sceneIndex % scenes.length] || <ProductShowcase isPlaying={isPlaying} />;
}

export function ScenePreview3D({ sceneIndex, projectType, isPlaying }: ScenePreview3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#a78bfa" />
      
      <SceneContent sceneIndex={sceneIndex} projectType={projectType} isPlaying={isPlaying} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={isPlaying}
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
