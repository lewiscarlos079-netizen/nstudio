import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnvironmentSceneProps {
  isPlaying: boolean;
}

// Detailed tree with trunk, branches, and leaves
function DetailedTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      // Gentle wind sway
      const time = state.clock.elapsedTime;
      treeRef.current.rotation.z = Math.sin(time + position[0]) * 0.03;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Trunk with bark texture */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.9, 12]} />
        <meshStandardMaterial color="#5d4037" roughness={0.95} />
      </mesh>
      
      {/* Trunk details - bark ridges */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.5) * 0.08, 0.3 + i * 0.15, Math.cos(i * 1.5) * 0.08]}>
          <boxGeometry args={[0.03, 0.12, 0.02]} />
          <meshStandardMaterial color="#4a3728" roughness={1} />
        </mesh>
      ))}
      
      {/* Main foliage layers */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.45, 0.7, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.35, 0.55, 8]} />
        <meshStandardMaterial color="#388e3c" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.25, 0.45, 8]} />
        <meshStandardMaterial color="#43a047" roughness={0.85} />
      </mesh>
      
      {/* Branch clusters */}
      {[
        { pos: [0.25, 0.8, 0.1], rot: [0.3, 0, 0.5] },
        { pos: [-0.2, 0.9, -0.15], rot: [-0.2, 0, -0.4] },
        { pos: [0.15, 1.1, -0.2], rot: [0.1, 0.5, 0.3] },
      ].map((branch, i) => (
        <mesh key={i} position={branch.pos as [number, number, number]} rotation={branch.rot as [number, number, number]}>
          <cylinderGeometry args={[0.015, 0.025, 0.2, 6]} />
          <meshStandardMaterial color="#5d4037" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Detailed rock with natural shape
function Rock({ position, scale = 1, color = '#6b7280' }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.08, -0.05, 0.05]} rotation={[0.3, 0.5, 0]}>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

// Flower with petals
function Flower({ position, color = '#ec4899' }: { position: [number, number, number]; color?: string }) {
  const flowerRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (flowerRef.current) {
      flowerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2 + position[0] * 5) * 0.1;
    }
  });

  return (
    <group ref={flowerRef} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.16, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Petals */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.sin(angle) * 0.03, 0.17, Math.cos(angle) * 0.03]}
            rotation={[0.3, angle, 0]}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      {/* Center */}
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// Grass patch
function GrassPatch({ position }: { position: [number, number, number] }) {
  const grassRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (grassRef.current) {
      grassRef.current.children.forEach((blade, i) => {
        blade.rotation.z = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.15;
      });
    }
  });

  return (
    <group ref={grassRef} position={position}>
      {[...Array(7)].map((_, i) => (
        <mesh 
          key={i} 
          position={[(Math.random() - 0.5) * 0.15, 0.04, (Math.random() - 0.5) * 0.15]}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <coneGeometry args={[0.008, 0.08 + Math.random() * 0.04, 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#4ade80' : '#22c55e'} />
        </mesh>
      ))}
    </group>
  );
}

// Butterfly
function Butterfly({ position, isPlaying }: { position: [number, number, number]; isPlaying: boolean }) {
  const butterflyRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!butterflyRef.current || !isPlaying) return;
    const time = state.clock.elapsedTime;
    
    // Flight path
    butterflyRef.current.position.x = position[0] + Math.sin(time * 0.8) * 0.5;
    butterflyRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.2;
    butterflyRef.current.position.z = position[2] + Math.cos(time * 0.6) * 0.3;
    butterflyRef.current.rotation.y = Math.sin(time * 0.8) * 0.5 + Math.PI / 2;
    
    // Wing flapping
    if (wingsRef.current) {
      const flapAngle = Math.sin(time * 15) * 0.6;
      wingsRef.current.children[0].rotation.y = flapAngle;
      wingsRef.current.children[1].rotation.y = -flapAngle;
    }
  });

  return (
    <group ref={butterflyRef} position={position}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.01, 0.04, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Wings */}
      <group ref={wingsRef}>
        <mesh position={[-0.025, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 8]} />
          <meshStandardMaterial color="#f472b6" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.025, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 8]} />
          <meshStandardMaterial color="#f472b6" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export function EnvironmentScene({ isPlaying }: EnvironmentSceneProps) {
  return (
    <group>
      {/* Ground with grass texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.95} />
      </mesh>
      
      {/* Rolling hills in background */}
      <mesh position={[0, -0.3, -4]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d6b3d" roughness={0.9} />
      </mesh>
      <mesh position={[-3, -0.4, -3.5]} rotation={[-0.2, 0.3, 0]}>
        <sphereGeometry args={[2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      
      {/* Forest of trees */}
      <DetailedTree position={[-1.8, -0.5, 0.2]} scale={1.2} />
      <DetailedTree position={[1.6, -0.5, 0.8]} scale={1} />
      <DetailedTree position={[0, -0.5, -1.2]} scale={1.4} />
      <DetailedTree position={[-0.8, -0.5, 1.5]} scale={0.9} />
      <DetailedTree position={[2.2, -0.5, -0.8]} scale={1.1} />
      <DetailedTree position={[-2.5, -0.5, -1]} scale={0.8} />
      
      {/* Rocks */}
      <Rock position={[0.5, -0.45, 0.8]} scale={1.2} />
      <Rock position={[-1.2, -0.48, -0.5]} scale={0.8} color="#78716c" />
      <Rock position={[1.8, -0.46, 1.2]} scale={1} />
      
      {/* Flowers */}
      <Flower position={[0.3, -0.5, 0.5]} color="#ec4899" />
      <Flower position={[-0.5, -0.5, 0.8]} color="#f472b6" />
      <Flower position={[1, -0.5, 0.3]} color="#a855f7" />
      <Flower position={[-1, -0.5, 1.2]} color="#ec4899" />
      <Flower position={[0.8, -0.5, -0.3]} color="#8b5cf6" />
      
      {/* Grass patches */}
      {[...Array(15)].map((_, i) => (
        <GrassPatch 
          key={i} 
          position={[
            (Math.random() - 0.5) * 4,
            -0.5,
            (Math.random() - 0.5) * 3
          ]}
        />
      ))}
      
      {/* Butterflies */}
      <Butterfly position={[0.5, 0.5, 0.3]} isPlaying={isPlaying} />
      <Butterfly position={[-0.8, 0.7, 0.5]} isPlaying={isPlaying} />
      
      {/* Sun with rays */}
      <group position={[3, 3.5, -4]}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
        {/* Sun glow */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.4} />
        </mesh>
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <boxGeometry args={[0.1, 0.4, 0.05]} />
              <meshBasicMaterial color="#fde047" transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
      
      {/* Clouds */}
      {[
        [-2, 3, -2],
        [2.5, 2.8, -2.5],
        [0, 3.2, -3],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[0.35, 0, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[-0.3, -0.1, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[0.15, 0.2, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </group>
      ))}
      
      {/* Small pond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -0.48, 1.5]}>
        <circleGeometry args={[0.4, 24]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pond edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -0.49, 1.5]}>
        <ringGeometry args={[0.35, 0.5, 24]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
    </group>
  );
}
