import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnvironmentSceneProps {
  isPlaying: boolean;
}

// Detailed tree with trunk, branches, and leaves - enhanced realism
function DetailedTree({ position, scale = 1, variant = 'pine' }: { position: [number, number, number]; scale?: number; variant?: 'pine' | 'oak' | 'birch' }) {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.elapsedTime;
      treeRef.current.rotation.z = Math.sin(time * 0.7 + position[0]) * 0.025;
    }
  });

  const trunkColors = { pine: '#4a3728', oak: '#5d4037', birch: '#d4c8be' };
  const leafColors = { pine: ['#2e7d32', '#388e3c', '#43a047'], oak: ['#558b2f', '#689f38', '#7cb342'], birch: ['#8bc34a', '#9ccc65', '#aed581'] };

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Trunk with realistic taper */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 1.1, 16]} />
        <meshStandardMaterial color={trunkColors[variant]} roughness={0.95} />
      </mesh>
      
      {/* Trunk texture details */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.05) * 0.09, 0.15 + i * 0.14, Math.cos(i * 1.05) * 0.09]}>
          <boxGeometry args={[0.025, 0.1, 0.015]} />
          <meshStandardMaterial color={variant === 'birch' ? '#8b8b8b' : '#3d2817'} roughness={1} />
        </mesh>
      ))}
      
      {/* Root flare */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`root-${i}`} position={[Math.sin(i * Math.PI / 2) * 0.1, -0.02, Math.cos(i * Math.PI / 2) * 0.1]} rotation={[0.3, i * Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 0.15, 6]} />
          <meshStandardMaterial color={trunkColors[variant]} roughness={0.95} />
        </mesh>
      ))}
      
      {/* Foliage layers - more organic shapes */}
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.5, 0.75, 12]} />
        <meshStandardMaterial color={leafColors[variant][0]} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.38, 0.6, 12]} />
        <meshStandardMaterial color={leafColors[variant][1]} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.26, 0.5, 10]} />
        <meshStandardMaterial color={leafColors[variant][2]} roughness={0.85} />
      </mesh>
      
      {/* Branch clusters for fullness */}
      {[
        { pos: [0.28, 0.85, 0.1], rot: [0.4, 0, 0.6] },
        { pos: [-0.24, 0.95, -0.12], rot: [-0.3, 0, -0.5] },
        { pos: [0.18, 1.15, -0.18], rot: [0.2, 0.6, 0.35] },
        { pos: [-0.15, 1.3, 0.15], rot: [-0.15, -0.4, -0.3] },
      ].map((branch, i) => (
        <group key={i}>
          <mesh position={branch.pos as [number, number, number]} rotation={branch.rot as [number, number, number]}>
            <cylinderGeometry args={[0.012, 0.02, 0.18, 6]} />
            <meshStandardMaterial color={trunkColors[variant]} roughness={0.9} />
          </mesh>
          <mesh position={[branch.pos[0] * 1.3, branch.pos[1] + 0.08, branch.pos[2] * 1.3]}>
            <sphereGeometry args={[0.08 + Math.random() * 0.04, 8, 8]} />
            <meshStandardMaterial color={leafColors[variant][i % 3]} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Enhanced rock formation with moss and weathering
function Rock({ position, scale = 1, color = '#6b7280', hasMoss = false }: { position: [number, number, number]; scale?: number; color?: string; hasMoss?: boolean }) {
  return (
    <group position={position} scale={scale}>
      {/* Main rock body */}
      <mesh>
        <dodecahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial color={color} roughness={0.92} flatShading />
      </mesh>
      {/* Secondary rock */}
      <mesh position={[0.1, -0.04, 0.06]} rotation={[0.4, 0.6, 0.2]}>
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
      {/* Tertiary rock */}
      <mesh position={[-0.06, -0.03, 0.08]} rotation={[0.2, -0.3, 0.1]}>
        <dodecahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
      {/* Moss patches */}
      {hasMoss && (
        <>
          <mesh position={[0.02, 0.1, 0.08]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#4ade80" roughness={0.9} />
          </mesh>
          <mesh position={[-0.05, 0.08, 0.05]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

// Flower with petals - enhanced detail
function Flower({ position, color = '#ec4899', size = 1 }: { position: [number, number, number]; color?: string; size?: number }) {
  const flowerRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (flowerRef.current) {
      flowerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 5) * 0.08;
      flowerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2 + position[2] * 3) * 0.03;
    }
  });

  return (
    <group ref={flowerRef} position={position} scale={size}>
      {/* Stem with slight curve */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.006, 0.01, 0.16, 8]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Leaf on stem */}
      <mesh position={[0.02, 0.06, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.015, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Petals - arranged naturally */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.2;
        const petalSize = 0.022 + Math.random() * 0.008;
        return (
          <mesh 
            key={i} 
            position={[Math.sin(angle) * 0.028, 0.17, Math.cos(angle) * 0.028]}
            rotation={[0.35 + Math.random() * 0.1, angle, 0]}
          >
            <sphereGeometry args={[petalSize, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      {/* Center stamen */}
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.015, 10, 10]} />
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
  const streamRef = useRef<THREE.Group>(null);
  const waterSurfaceRef = useRef<THREE.Mesh>(null);
  
  // Animate water flow
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (waterSurfaceRef.current) {
      const geo = waterSurfaceRef.current.geometry as THREE.PlaneGeometry;
      const positions = geo.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(y * 3 + time * 2) * 0.015 + Math.sin(x * 2 + time * 1.5) * 0.01;
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ground with varied grass texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#3d6b3d" roughness={0.95} />
      </mesh>
      
      {/* Secondary grass layer for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.498, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      
      {/* Rolling hills in background */}
      <mesh position={[0, -0.2, -5]} rotation={[-0.15, 0, 0]}>
        <sphereGeometry args={[3.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d6b3d" roughness={0.9} />
      </mesh>
      <mesh position={[-3.5, -0.35, -4]} rotation={[-0.2, 0.2, 0]}>
        <sphereGeometry args={[2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      <mesh position={[3.5, -0.3, -4.5]} rotation={[-0.15, -0.15, 0]}>
        <sphereGeometry args={[2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d6b3d" roughness={0.9} />
      </mesh>
      
      {/* ===== FLOWING STREAM ===== */}
      <group ref={streamRef} position={[-2, -0.48, 0]} rotation={[0, 0.3, 0]}>
        {/* Stream bed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[0.8, 6]} />
          <meshStandardMaterial color="#4a3728" roughness={0.95} />
        </mesh>
        
        {/* Stream banks */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.15, 6, 0.08]} />
            <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
          </mesh>
        ))}
        
        {/* Animated water surface */}
        <mesh ref={waterSurfaceRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.7, 6, 16, 32]} />
          <meshStandardMaterial 
            color="#0d9488"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
        
        {/* Stream foam */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.5, 0.02, (i - 4) * 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.03, 8]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.6} />
          </mesh>
        ))}
        
        {/* Stream rocks */}
        {[
          { pos: [0.15, -0.02, -1.5], scale: 0.5 },
          { pos: [-0.2, -0.02, 0.8], scale: 0.4 },
          { pos: [0.1, -0.02, 2], scale: 0.45 },
        ].map((rock, i) => (
          <mesh key={i} position={rock.pos as [number, number, number]} scale={rock.scale}>
            <dodecahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color="#6b7280" roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
      
      {/* Forest of varied trees */}
      <DetailedTree position={[-1.8, -0.5, 0.5]} scale={1.1} variant="pine" />
      <DetailedTree position={[1.8, -0.5, 0.6]} scale={0.95} variant="oak" />
      <DetailedTree position={[0.2, -0.5, -1.5]} scale={1.3} variant="pine" />
      <DetailedTree position={[-0.9, -0.5, 1.8]} scale={0.85} variant="birch" />
      <DetailedTree position={[2.4, -0.5, -1]} scale={1.05} variant="pine" />
      <DetailedTree position={[-2.8, -0.5, -0.8]} scale={0.75} variant="oak" />
      <DetailedTree position={[0.8, -0.5, 2.2]} scale={0.9} variant="birch" />
      <DetailedTree position={[-1.2, -0.5, -2]} scale={1.15} variant="pine" />
      
      {/* Rock formations - filling gaps */}
      <Rock position={[0.6, -0.42, 0.9]} scale={1.3} hasMoss />
      <Rock position={[-1.4, -0.45, -0.7]} scale={0.9} color="#78716c" hasMoss />
      <Rock position={[2, -0.44, 1.4]} scale={1.1} />
      <Rock position={[-0.3, -0.46, 2.5]} scale={0.8} color="#6b7280" hasMoss />
      <Rock position={[1.2, -0.45, -0.8]} scale={0.7} />
      <Rock position={[-2.2, -0.44, 1.5]} scale={1} hasMoss />
      
      {/* Flower meadow */}
      <Flower position={[0.4, -0.5, 0.6]} color="#ec4899" size={1.1} />
      <Flower position={[-0.6, -0.5, 0.9]} color="#f472b6" />
      <Flower position={[1.1, -0.5, 0.4]} color="#a855f7" size={0.9} />
      <Flower position={[-1.1, -0.5, 1.4]} color="#ec4899" size={1.2} />
      <Flower position={[0.9, -0.5, -0.4]} color="#8b5cf6" />
      <Flower position={[1.6, -0.5, 0.8]} color="#f472b6" size={0.85} />
      <Flower position={[-0.2, -0.5, 1.8]} color="#a855f7" size={1.1} />
      <Flower position={[0.5, -0.5, 2.3]} color="#ec4899" />
      
      {/* Dense grass patches throughout */}
      {[...Array(25)].map((_, i) => (
        <GrassPatch 
          key={i} 
          position={[
            (Math.random() - 0.5) * 5,
            -0.5,
            (Math.random() - 0.5) * 4
          ]}
        />
      ))}
      
      {/* Ferns and ground cover */}
      {[...Array(12)].map((_, i) => (
        <group key={`fern-${i}`} position={[(Math.random() - 0.5) * 4, -0.48, (Math.random() - 0.5) * 3]}>
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh key={j} position={[0, 0.04, 0]} rotation={[0.3, j * Math.PI * 0.4, 0]}>
              <coneGeometry args={[0.015, 0.12, 4]} />
              <meshStandardMaterial color={j % 2 === 0 ? '#16a34a' : '#15803d'} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Butterflies */}
      <Butterfly position={[0.6, 0.6, 0.4]} isPlaying={isPlaying} />
      <Butterfly position={[-0.9, 0.8, 0.6]} isPlaying={isPlaying} />
      <Butterfly position={[1.2, 0.5, 1.2]} isPlaying={isPlaying} />
      
      {/* Sun with enhanced glow */}
      <group position={[3.5, 4, -5]}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshBasicMaterial color="#fef9c3" transparent opacity={0.15} />
        </mesh>
        {[...Array(10)].map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <boxGeometry args={[0.08, 0.45, 0.04]} />
              <meshBasicMaterial color="#fde047" transparent opacity={0.5} />
            </mesh>
          );
        })}
      </group>
      
      {/* Clouds with more volume */}
      {[
        [-2.5, 3.2, -2.5],
        [3, 3, -3],
        [0.5, 3.5, -3.5],
        [-4, 2.8, -2],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[0.4, 0.05, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[-0.35, -0.08, 0.05]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[0.18, 0.22, -0.05]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh position={[-0.15, 0.18, 0.1]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#fafafa" roughness={1} />
          </mesh>
        </group>
      ))}
      
      {/* Enhanced pond with lily pads */}
      <group position={[2, -0.48, 2]}>
        {/* Pond bed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial color="#3d2817" roughness={0.95} />
        </mesh>
        {/* Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.7} roughness={0.15} transparent opacity={0.75} />
        </mesh>
        {/* Bank */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
        </mesh>
        {/* Lily pads */}
        {[
          { x: 0.2, z: 0.15, rot: 0.5 },
          { x: -0.18, z: -0.12, rot: 2.1 },
          { x: 0.08, z: -0.22, rot: 4.2 },
        ].map((pad, i) => (
          <mesh key={i} position={[pad.x, 0.02, pad.z]} rotation={[-Math.PI / 2, 0, pad.rot]}>
            <circleGeometry args={[0.08, 12, 0, Math.PI * 1.75]} />
            <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      
      {/* Mushrooms in shaded areas */}
      {[
        { pos: [-1.6, -0.48, 0.8], color: '#dc2626' },
        { pos: [1.5, -0.48, 1.8], color: '#f5f5f4' },
        { pos: [-0.5, -0.48, -1.2], color: '#a16207' },
      ].map((mush, i) => (
        <group key={i} position={mush.pos as [number, number, number]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.012, 0.015, 0.04, 8]} />
            <meshStandardMaterial color="#f5f5f4" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.03, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={mush.color} roughness={0.6} />
          </mesh>
        </group>
      ))}
      
      {/* Fallen log for natural debris */}
      <group position={[1.8, -0.45, -0.3]} rotation={[0, 0.8, 0.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 12]} />
          <meshStandardMaterial color="#5d4037" roughness={0.95} />
        </mesh>
        {/* Moss on log */}
        <mesh position={[0.1, 0.06, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#4ade80" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
