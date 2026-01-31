import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductShowcaseProps {
  isPlaying: boolean;
}

export function ProductShowcase({ isPlaying }: ProductShowcaseProps) {
  const productRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const keysRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = isPlaying ? 0.5 : 0.1;
    
    if (productRef.current) {
      productRef.current.rotation.y = time * speed;
    }
    
    // Screen glow animation
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
    
    // Keyboard key animations
    if (keysRef.current && isPlaying) {
      keysRef.current.children.forEach((key, i) => {
        key.position.y = Math.sin(time * 10 + i * 0.3) > 0.8 ? -0.003 : 0;
      });
    }
    
    // Rotating accent lights
    if (lightsRef.current) {
      lightsRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group>
      {/* Rotating product group */}
      <group ref={productRef} position={[0, 0.3, 0]}>
        {/* Laptop base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Keyboard area */}
        <mesh position={[0, 0.03, 0.1]}>
          <boxGeometry args={[1.1, 0.02, 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Individual keys */}
        <group ref={keysRef} position={[0, 0.045, 0.1]}>
          {[...Array(4)].map((_, row) => (
            [...Array(10)].map((_, col) => (
              <mesh 
                key={`${row}-${col}`}
                position={[-0.45 + col * 0.1, 0, -0.15 + row * 0.1]}
              >
                <boxGeometry args={[0.08, 0.015, 0.08]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
              </mesh>
            ))
          ))}
        </group>
        
        {/* Trackpad */}
        <mesh position={[0, 0.035, 0.35]}>
          <boxGeometry args={[0.4, 0.01, 0.25]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.2} />
        </mesh>
        
        {/* Screen hinge */}
        <mesh position={[0, 0.08, -0.38]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[1.15, 0.06, 0.03]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Screen back */}
        <group position={[0, 0.45, -0.42]} rotation={[-0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.15, 0.75, 0.03]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </mesh>
          
          {/* Screen bezel */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.1, 0.7, 0.01]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          
          {/* Screen display */}
          <mesh ref={screenRef} position={[0, 0, 0.025]}>
            <boxGeometry args={[1, 0.6, 0.005]} />
            <meshStandardMaterial 
              color="#3b82f6" 
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Screen content - code lines */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[-0.3 + (i % 3) * 0.15, 0.2 - i * 0.06, 0.028]}>
              <boxGeometry args={[0.15 + Math.random() * 0.2, 0.02, 0.001]} />
              <meshBasicMaterial color={i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a78bfa' : '#fbbf24'} />
            </mesh>
          ))}
          
          {/* Webcam */}
          <mesh position={[0, 0.33, 0.02]}>
            <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
        
        {/* Side ports */}
        <mesh position={[-0.58, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.06]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.58, 0.02, 0.15]}>
          <boxGeometry args={[0.03, 0.02, 0.04]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        {/* LED indicator */}
        <mesh position={[0.5, 0.04, 0.38]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
      
      {/* Pedestal */}
      <group position={[0, -0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.9, 1.1, 0.15, 32]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Pedestal ring */}
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[0.85, 0.02, 8, 32]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            emissive="#60a5fa"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      {/* Rotating accent lights */}
      <group ref={lightsRef} position={[0, 0, 0]}>
        {[...Array(3)].map((_, i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[1.5, 0.5, 0]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial 
                  color={i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4'}
                  emissive={i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4'}
                  emissiveIntensity={0.8}
                />
              </mesh>
              {/* Light trail */}
              <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.03, 0.3, 8]} />
                <meshStandardMaterial 
                  color={i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4'}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Floor reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Floating specs/features */}
      {[
        { pos: [-1.5, 0.8, 0.5], label: 'specs' },
        { pos: [1.5, 1, -0.3], label: 'specs' },
        { pos: [-1.2, 0.4, -0.8], label: 'specs' },
      ].map((item, i) => (
        <group key={i} position={item.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={[0.4, 0.2, 0.02]} />
            <meshStandardMaterial 
              color="#0f172a" 
              transparent 
              opacity={0.8}
            />
          </mesh>
          {/* Spec lines */}
          {[0, 1, 2].map((j) => (
            <mesh key={j} position={[-0.1 + j * 0.05, 0.05 - j * 0.05, 0.015]}>
              <boxGeometry args={[0.15 - j * 0.03, 0.015, 0.001]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
