import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic water color palette
const WATER_COLORS = {
  deepBlue: '#0369a1',
  shallowBlue: '#0ea5e9',
  foam: '#e0f2fe',
  riverGreen: '#0d9488',
  pondTeal: '#14b8a6',
  waterfall: '#7dd3fc',
};

interface FlowingStreamProps {
  position?: [number, number, number];
  width?: number;
  length?: number;
  depth?: number;
  flowSpeed?: number;
}

// Animated flowing stream/river with wave simulation
export function FlowingStream({ 
  position = [0, 0, 0], 
  width = 1.5, 
  length = 8,
  depth = 0.15,
  flowSpeed = 1.5 
}: FlowingStreamProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const foamRef = useRef<THREE.Group>(null);
  
  // Create river bed geometry
  const riverBedGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width + 0.4, length, 32, 64);
    const positions = geo.attributes.position.array as Float32Array;
    
    // Create natural river bed undulation
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 3) * 0.03 + Math.sin(y * 0.5) * 0.02 - depth * 0.5;
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, length, depth]);

  // Animate water surface waves
  useFrame((state) => {
    if (waterRef.current) {
      const geo = waterRef.current.geometry as THREE.PlaneGeometry;
      const positions = geo.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime * flowSpeed;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Flowing wave pattern
        positions[i + 2] = 
          Math.sin(y * 2 + time * 2) * 0.02 + 
          Math.sin(x * 3 + time * 1.5) * 0.015 +
          Math.sin((x + y) * 1.5 + time * 3) * 0.01;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }
    
    // Animate foam particles flowing downstream
    if (foamRef.current) {
      foamRef.current.children.forEach((foam, i) => {
        foam.position.y += 0.02 * flowSpeed;
        if (foam.position.y > length / 2) {
          foam.position.y = -length / 2;
          foam.position.x = (Math.random() - 0.5) * width * 0.6;
        }
      });
    }
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* River bed with rocks */}
      <mesh geometry={riverBedGeometry} position={[0, 0, -depth]}>
        <meshStandardMaterial color="#5d4e37" roughness={0.95} />
      </mesh>
      
      {/* River banks */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 + 0.15), 0, 0.02]}>
          <boxGeometry args={[0.3, length, 0.08]} />
          <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
        </mesh>
      ))}
      
      {/* Water surface with animation */}
      <mesh ref={waterRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[width, length, 24, 48]} />
        <meshStandardMaterial 
          color={WATER_COLORS.riverGreen}
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Foam particles */}
      <group ref={foamRef}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * width * 0.6,
              (Math.random() - 0.5) * length,
              0.03
            ]}
          >
            <circleGeometry args={[0.03 + Math.random() * 0.02, 8]} />
            <meshStandardMaterial color={WATER_COLORS.foam} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      
      {/* Submerged rocks */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * width * 0.7,
            (Math.random() - 0.5) * length * 0.8,
            -depth * 0.3
          ]}
          rotation={[0, 0, Math.random() * Math.PI]}
        >
          <dodecahedronGeometry args={[0.06 + Math.random() * 0.04, 0]} />
          <meshStandardMaterial color="#6b7280" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

interface WaterfallProps {
  position?: [number, number, number];
  height?: number;
  width?: number;
}

// Animated waterfall with cascade and mist
export function Waterfall({ 
  position = [0, 0, 0], 
  height = 2,
  width = 1.2 
}: WaterfallProps) {
  const cascadeRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Group>(null);
  const splashRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate cascade water strips
    if (cascadeRef.current) {
      cascadeRef.current.children.forEach((strip, i) => {
        const offset = (time * 3 + i * 0.2) % 1;
        strip.position.y = height / 2 - offset * height;
        (strip as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: WATER_COLORS.waterfall,
          transparent: true,
          opacity: 0.6 + Math.sin(time * 5 + i) * 0.2,
        });
      });
    }
    
    // Animate mist particles
    if (mistRef.current) {
      mistRef.current.children.forEach((mist, i) => {
        mist.position.y = Math.sin(time + i) * 0.3 + 0.5;
        mist.position.x = Math.sin(time * 0.5 + i * 0.7) * 0.3;
        const scale = 0.8 + Math.sin(time * 2 + i) * 0.2;
        mist.scale.setScalar(scale);
      });
    }
    
    // Animate splash at base
    if (splashRef.current) {
      splashRef.current.children.forEach((splash, i) => {
        const angle = (time * 2 + i * 0.5) % (Math.PI * 2);
        splash.position.x = Math.cos(angle) * 0.4;
        splash.position.z = Math.sin(angle) * 0.2;
        splash.position.y = Math.abs(Math.sin(time * 4 + i)) * 0.2;
      });
    }
  });

  return (
    <group position={position}>
      {/* Cliff face */}
      <mesh position={[0, height / 2, -0.3]}>
        <boxGeometry args={[width + 0.8, height + 0.4, 0.5]} />
        <meshStandardMaterial color="#78716c" roughness={0.95} />
      </mesh>
      
      {/* Cliff top with ledge */}
      <mesh position={[0, height + 0.1, 0.1]}>
        <boxGeometry args={[width + 0.4, 0.15, 0.6]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} />
      </mesh>
      
      {/* Source pool at top */}
      <mesh position={[0, height + 0.05, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[width / 2, 24]} />
        <meshStandardMaterial 
          color={WATER_COLORS.deepBlue} 
          transparent 
          opacity={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Water cascade strips */}
      <group ref={cascadeRef}>
        {[...Array(20)].map((_, i) => (
          <mesh 
            key={i} 
            position={[(Math.random() - 0.5) * width * 0.7, 0, 0.05]}
          >
            <boxGeometry args={[0.08 + Math.random() * 0.06, 0.3, 0.02]} />
            <meshStandardMaterial 
              color={WATER_COLORS.waterfall}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Splash pool at base */}
      <mesh position={[0, -0.02, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[width * 0.7, 32]} />
        <meshStandardMaterial 
          color={WATER_COLORS.pondTeal}
          transparent
          opacity={0.75}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>
      
      {/* Pool rim */}
      <mesh position={[0, -0.02, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[width * 0.65, width * 0.8, 32]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      
      {/* Mist particles */}
      <group ref={mistRef} position={[0, 0.3, 0.4]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * width, 0, 0]}>
            <sphereGeometry args={[0.12 + Math.random() * 0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.15}
            />
          </mesh>
        ))}
      </group>
      
      {/* Splash particles */}
      <group ref={splashRef} position={[0, 0, 0.3]}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial 
              color={WATER_COLORS.foam}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Rocks around waterfall */}
      {[
        { pos: [-width / 2 - 0.2, 0, 0.2], scale: 1.2 },
        { pos: [width / 2 + 0.15, 0.1, 0.15], scale: 0.9 },
        { pos: [-0.3, -0.1, 0.6], scale: 0.7 },
        { pos: [0.25, -0.05, 0.55], scale: 0.6 },
      ].map((rock, i) => (
        <mesh key={i} position={rock.pos as [number, number, number]} scale={rock.scale}>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#6b7280" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  );
}

interface PondProps {
  position?: [number, number, number];
  radius?: number;
}

// Calm pond with ripples and lily pads
export function Pond({ position = [0, 0, 0], radius = 1.5 }: PondProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const rippleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle surface ripples
    if (waterRef.current) {
      const geo = waterRef.current.geometry as THREE.CircleGeometry;
      const positions = geo.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const dist = Math.sqrt(x * x + y * y);
        positions[i + 2] = Math.sin(dist * 4 - time * 2) * 0.015 + Math.sin(time + x * 2) * 0.008;
      }
      geo.attributes.position.needsUpdate = true;
    }
    
    // Expanding ripples
    if (rippleRef.current) {
      rippleRef.current.children.forEach((ripple, i) => {
        const scale = ((time * 0.5 + i * 0.3) % 1) * radius * 0.8;
        ripple.scale.set(scale, scale, 1);
        (ripple as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: WATER_COLORS.foam,
          transparent: true,
          opacity: 0.3 * (1 - scale / (radius * 0.8)),
          side: THREE.DoubleSide,
        });
      });
    }
  });

  return (
    <group position={position}>
      {/* Pond bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <circleGeometry args={[radius + 0.1, 32]} />
        <meshStandardMaterial color="#4a3728" roughness={0.95} />
      </mesh>
      
      {/* Water surface */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial 
          color={WATER_COLORS.pondTeal}
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.25}
        />
      </mesh>
      
      {/* Bank/edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.2, 48]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
      </mesh>
      
      {/* Ripple rings */}
      <group ref={rippleRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[0.1, 0.12, 32]} />
            <meshStandardMaterial color={WATER_COLORS.foam} transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
      
      {/* Lily pads */}
      {[
        { pos: [radius * 0.4, 0.03, radius * 0.3], rot: 0.2, size: 0.18 },
        { pos: [-radius * 0.35, 0.03, -radius * 0.25], rot: 1.5, size: 0.15 },
        { pos: [radius * 0.2, 0.03, -radius * 0.4], rot: 2.8, size: 0.2 },
        { pos: [-radius * 0.5, 0.03, radius * 0.15], rot: 4.2, size: 0.12 },
      ].map((pad, i) => (
        <group key={i} position={pad.pos as [number, number, number]} rotation={[-Math.PI / 2, 0, pad.rot]}>
          {/* Lily pad */}
          <mesh>
            <circleGeometry args={[pad.size, 16, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Flower on some pads */}
          {i % 2 === 0 && (
            <group position={[0, 0.02, 0]}>
              {[...Array(6)].map((_, j) => (
                <mesh 
                  key={j} 
                  position={[Math.cos(j * Math.PI / 3) * 0.04, Math.sin(j * Math.PI / 3) * 0.04, 0.02]}
                  rotation={[0, 0, j * Math.PI / 3]}
                >
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshStandardMaterial color={i === 0 ? '#fbbf24' : '#ec4899'} />
                </mesh>
              ))}
              <mesh position={[0, 0, 0.03]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
            </group>
          )}
        </group>
      ))}
      
      {/* Fish silhouettes */}
      {[0, 1].map((i) => (
        <mesh 
          key={i} 
          position={[(i === 0 ? 0.3 : -0.4) * radius, -0.08, (i === 0 ? -0.2 : 0.3) * radius]}
          rotation={[0, i * Math.PI * 0.7, 0]}
        >
          <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

interface OceanWavesProps {
  position?: [number, number, number];
  size?: number;
}

// Ocean/sea with realistic wave motion
export function OceanWaves({ position = [0, 0, 0], size = 10 }: OceanWavesProps) {
  const oceanRef = useRef<THREE.Mesh>(null);
  const foamLineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Ocean wave animation
    if (oceanRef.current) {
      const geo = oceanRef.current.geometry as THREE.PlaneGeometry;
      const positions = geo.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Complex wave pattern
        positions[i + 2] = 
          Math.sin(x * 0.5 + time) * 0.15 +
          Math.sin(y * 0.3 + time * 0.7) * 0.1 +
          Math.sin((x + y) * 0.4 + time * 1.3) * 0.08;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }
    
    // Shore foam line
    if (foamLineRef.current) {
      foamLineRef.current.position.z = Math.sin(time * 0.5) * 0.5;
      foamLineRef.current.children.forEach((foam, i) => {
        foam.position.x = ((i - 10) * 0.8) + Math.sin(time + i * 0.5) * 0.2;
      });
    }
  });

  return (
    <group position={position}>
      {/* Ocean floor/sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, size / 4]}>
        <planeGeometry args={[size * 1.5, size * 0.5]} />
        <meshStandardMaterial color="#d4a574" roughness={0.95} />
      </mesh>
      
      {/* Ocean water */}
      <mesh ref={oceanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -size / 4]}>
        <planeGeometry args={[size * 1.5, size, 48, 48]} />
        <meshStandardMaterial 
          color={WATER_COLORS.deepBlue}
          transparent
          opacity={0.85}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>
      
      {/* Shore foam line */}
      <group ref={foamLineRef} position={[0, 0.02, size / 4 - 0.5]}>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[(i - 10) * 0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15 + Math.random() * 0.1, 8]} />
            <meshStandardMaterial color={WATER_COLORS.foam} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      
      {/* Distant waves/horizon */}
      <mesh position={[0, 0.3, -size / 2 - 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size * 2, 3]} />
        <meshStandardMaterial 
          color="#0284c7"
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Export water registry for ProceduralModels integration
export const WaterModelRegistry: Record<string, React.FC<any>> = {
  'flowing_stream': FlowingStream,
  'waterfall': Waterfall,
  'pond': Pond,
  'ocean_waves': OceanWaves,
};
