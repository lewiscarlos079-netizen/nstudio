import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StyledMaterial, SurfaceType } from './Materials';
import { ModelStyle } from '@/store/sceneStore';

// Cloth physics constants
const DAMPING = 0.03;
const DRAG = 1 - DAMPING;
const GRAVITY = new THREE.Vector3(0, -0.0008, 0);
const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

interface ClothParticle {
  position: THREE.Vector3;
  previous: THREE.Vector3;
  original: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  invMass: number;
  pinned: boolean;
}

interface ClothConstraint {
  p1: ClothParticle;
  p2: ClothParticle;
  distance: number;
  stiffness: number;
}

// Create a cloth particle
function createParticle(x: number, y: number, z: number, mass: number = 1, pinned: boolean = false): ClothParticle {
  const pos = new THREE.Vector3(x, y, z);
  return {
    position: pos.clone(),
    previous: pos.clone(),
    original: pos.clone(),
    acceleration: new THREE.Vector3(),
    mass,
    invMass: pinned ? 0 : 1 / mass,
    pinned,
  };
}

// Cloth simulation hook
export function useClothSimulation(
  width: number,
  height: number,
  segments: number = 10,
  options: {
    stiffness?: number;
    wind?: boolean;
    windStrength?: number;
    pinTop?: boolean;
    pinCorners?: boolean;
  } = {}
) {
  const {
    stiffness = 0.9,
    wind = true,
    windStrength = 0.0003,
    pinTop = true,
    pinCorners = false,
  } = options;

  const particlesRef = useRef<ClothParticle[][]>([]);
  const constraintsRef = useRef<ClothConstraint[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Initialize cloth particles
  useMemo(() => {
    const particles: ClothParticle[][] = [];
    const constraints: ClothConstraint[] = [];
    
    const xSpacing = width / segments;
    const ySpacing = height / segments;
    
    // Create particles
    for (let y = 0; y <= segments; y++) {
      const row: ClothParticle[] = [];
      for (let x = 0; x <= segments; x++) {
        const px = (x - segments / 2) * xSpacing;
        const py = height - y * ySpacing;
        const pz = 0;
        
        // Determine if particle should be pinned
        let pinned = false;
        if (pinTop && y === 0) pinned = true;
        if (pinCorners && y === 0 && (x === 0 || x === segments)) pinned = true;
        
        row.push(createParticle(px, py, pz, 1, pinned));
      }
      particles.push(row);
    }
    
    // Create constraints (structural, shear, bend)
    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        // Structural - horizontal
        if (x < segments) {
          constraints.push({
            p1: particles[y][x],
            p2: particles[y][x + 1],
            distance: xSpacing,
            stiffness,
          });
        }
        // Structural - vertical
        if (y < segments) {
          constraints.push({
            p1: particles[y][x],
            p2: particles[y + 1][x],
            distance: ySpacing,
            stiffness,
          });
        }
        // Shear - diagonal
        if (x < segments && y < segments) {
          const diagDist = Math.sqrt(xSpacing * xSpacing + ySpacing * ySpacing);
          constraints.push({
            p1: particles[y][x],
            p2: particles[y + 1][x + 1],
            distance: diagDist,
            stiffness: stiffness * 0.7,
          });
          constraints.push({
            p1: particles[y][x + 1],
            p2: particles[y + 1][x],
            distance: diagDist,
            stiffness: stiffness * 0.7,
          });
        }
        // Bend - skip one
        if (x < segments - 1) {
          constraints.push({
            p1: particles[y][x],
            p2: particles[y][x + 2],
            distance: xSpacing * 2,
            stiffness: stiffness * 0.3,
          });
        }
        if (y < segments - 1) {
          constraints.push({
            p1: particles[y][x],
            p2: particles[y + 2][x],
            distance: ySpacing * 2,
            stiffness: stiffness * 0.3,
          });
        }
      }
    }
    
    particlesRef.current = particles;
    constraintsRef.current = constraints;
  }, [width, height, segments, stiffness, pinTop, pinCorners]);

  // Simulation update
  useFrame((state) => {
    const particles = particlesRef.current;
    const constraints = constraintsRef.current;
    const time = state.clock.elapsedTime;
    
    if (particles.length === 0) return;
    
    // Apply forces
    for (const row of particles) {
      for (const p of row) {
        if (p.pinned) continue;
        
        // Gravity
        p.acceleration.add(GRAVITY);
        
        // Wind force - sinusoidal variation
        if (wind) {
          const windForce = new THREE.Vector3(
            Math.sin(time * 0.5 + p.original.x * 5) * windStrength,
            Math.cos(time * 0.7 + p.original.y * 3) * windStrength * 0.3,
            Math.sin(time * 0.8 + p.original.x * 4) * windStrength * 1.5
          );
          p.acceleration.add(windForce);
        }
      }
    }
    
    // Verlet integration
    for (const row of particles) {
      for (const p of row) {
        if (p.pinned) continue;
        
        const velocity = p.position.clone().sub(p.previous).multiplyScalar(DRAG);
        p.previous.copy(p.position);
        p.position.add(velocity);
        p.position.add(p.acceleration.multiplyScalar(TIMESTEP_SQ));
        p.acceleration.set(0, 0, 0);
      }
    }
    
    // Satisfy constraints
    for (let iteration = 0; iteration < 3; iteration++) {
      for (const c of constraints) {
        const diff = c.p2.position.clone().sub(c.p1.position);
        const currentDist = diff.length();
        const correction = diff.multiplyScalar(1 - c.distance / currentDist);
        const correctionHalf = correction.multiplyScalar(0.5 * c.stiffness);
        
        c.p1.position.add(correctionHalf.clone().multiplyScalar(c.p1.invMass));
        c.p2.position.sub(correctionHalf.clone().multiplyScalar(c.p2.invMass));
      }
    }
    
    // Update geometry
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position as THREE.BufferAttribute;
      let idx = 0;
      for (const row of particles) {
        for (const p of row) {
          positions.setXYZ(idx, p.position.x, p.position.y, p.position.z);
          idx++;
        }
      }
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  });

  return { particlesRef, geometryRef, segments };
}

// Cloth mesh component for capes, dresses, flags
interface ClothMeshProps {
  width?: number;
  height?: number;
  segments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  style?: ModelStyle;
  surface?: SurfaceType;
  wind?: boolean;
  windStrength?: number;
  pinTop?: boolean;
}

export function ClothMesh({
  width = 0.3,
  height = 0.4,
  segments = 12,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#4A3535',
  style = 'standard',
  surface = 'fabric',
  wind = true,
  windStrength = 0.0003,
  pinTop = true,
}: ClothMeshProps) {
  const { geometryRef, segments: segs } = useClothSimulation(width, height, segments, {
    wind,
    windStrength,
    pinTop,
  });

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    // Center the cloth and position it
    const positions = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setY(i, y + height / 2);
    }
    return geo;
  }, [width, height, segments]);

  useEffect(() => {
    if (geometryRef) {
      geometryRef.current = geometry;
    }
  }, [geometry, geometryRef]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <StyledMaterial 
          color={color} 
          style={style} 
          surface={surface}
        />
      </mesh>
      {/* Back face */}
      <mesh geometry={geometry} scale={[1, 1, -1]}>
        <StyledMaterial 
          color={color} 
          style={style} 
          surface={surface}
        />
      </mesh>
    </group>
  );
}

// Pre-built cloth elements
interface CapeProps {
  position?: [number, number, number];
  color?: string;
  style?: ModelStyle;
  length?: 'short' | 'medium' | 'long';
}

export function Cape({ 
  position = [0, 0, 0], 
  color = '#4A3535', 
  style = 'standard',
  length = 'medium',
}: CapeProps) {
  const heights = { short: 0.25, medium: 0.4, long: 0.6 };
  
  return (
    <group position={position}>
      <ClothMesh
        width={0.35}
        height={heights[length]}
        position={[0, 0, -0.08]}
        color={color}
        style={style}
        surface="fabric"
        windStrength={0.0004}
      />
      {/* Cape collar */}
      <mesh position={[0, 0.02, -0.06]}>
        <boxGeometry args={[0.15, 0.04, 0.04]} />
        <StyledMaterial color={color} style={style} surface="fabric" />
      </mesh>
    </group>
  );
}

interface FlowingDressProps {
  position?: [number, number, number];
  color?: string;
  style?: ModelStyle;
}

export function FlowingDress({ 
  position = [0, 0, 0], 
  color = '#8B3A3A', 
  style = 'standard',
}: FlowingDressProps) {
  return (
    <group position={position}>
      {/* Bodice - rigid */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 12]} />
        <StyledMaterial color={color} style={style} surface="fabric" />
      </mesh>
      
      {/* Waist band */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <StyledMaterial color={color} style={style} surface="fabric" />
      </mesh>
      
      {/* Flowing skirt panels */}
      <ClothMesh
        width={0.3}
        height={0.35}
        position={[0, 0.06, 0.08]}
        color={color}
        style={style}
        windStrength={0.0005}
      />
      <ClothMesh
        width={0.3}
        height={0.35}
        position={[0, 0.06, -0.08]}
        rotation={[0, Math.PI, 0]}
        color={color}
        style={style}
        windStrength={0.0004}
      />
      <ClothMesh
        width={0.2}
        height={0.32}
        position={[0.1, 0.06, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color={color}
        style={style}
        windStrength={0.0003}
      />
      <ClothMesh
        width={0.2}
        height={0.32}
        position={[-0.1, 0.06, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={color}
        style={style}
        windStrength={0.0003}
      />
    </group>
  );
}

interface BannerFlagProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  style?: ModelStyle;
}

export function BannerFlag({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  color = '#8B3030', 
  style = 'standard',
}: BannerFlagProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Flag pole */}
      <mesh position={[-0.01, 0.3, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.7, 8]} />
        <StyledMaterial color="#6B4423" style={style} surface="wood" />
      </mesh>
      {/* Pole top ornament */}
      <mesh position={[-0.01, 0.65, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <StyledMaterial color="#A8ADB3" style={style} surface="metal" />
      </mesh>
      
      {/* Flag cloth */}
      <ClothMesh
        width={0.35}
        height={0.25}
        position={[0.17, 0.52, 0]}
        color={color}
        style={style}
        windStrength={0.0006}
      />
    </group>
  );
}

// Animated hair strands for characters
interface FlowingHairProps {
  position?: [number, number, number];
  color?: string;
  style?: ModelStyle;
  length?: 'short' | 'medium' | 'long';
}

export function FlowingHair({ 
  position = [0, 0, 0], 
  color = '#302520', 
  style = 'standard',
  length = 'medium',
}: FlowingHairProps) {
  const heights = { short: 0.1, medium: 0.2, long: 0.35 };
  const hairHeight = heights[length];
  
  return (
    <group position={position}>
      {/* Multiple cloth strands for hair */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <ClothMesh
          key={i}
          width={0.04}
          height={hairHeight}
          segments={8}
          position={[x, 0, -0.08]}
          color={color}
          style={style}
          surface="hair"
          windStrength={0.0002 + i * 0.00005}
        />
      ))}
      {/* Back hair mass */}
      <ClothMesh
        width={0.12}
        height={hairHeight * 0.9}
        segments={10}
        position={[0, 0, -0.1]}
        color={color}
        style={style}
        surface="hair"
        windStrength={0.00025}
      />
    </group>
  );
}
