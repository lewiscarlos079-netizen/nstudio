import { useRef, useMemo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';

interface TrailerEffectsProps {
  motionBlur?: boolean;
  hdr?: boolean;
  bloomIntensity?: number;
  vignetteIntensity?: number;
}

// Custom motion blur effect using velocity-based blur
function MotionBlurEffect({ enabled, intensity = 0.5 }: { enabled: boolean; intensity?: number }) {
  const { camera, scene } = useThree();
  const previousCameraMatrix = useRef(new THREE.Matrix4());
  const velocityRef = useRef(0);
  
  useFrame(() => {
    if (!enabled) return;
    
    // Calculate camera velocity
    const currentMatrix = camera.matrixWorld.clone();
    const diff = currentMatrix.elements.reduce((acc, val, i) => 
      acc + Math.abs(val - previousCameraMatrix.current.elements[i]), 0
    );
    
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, diff * intensity, 0.1);
    previousCameraMatrix.current.copy(currentMatrix);
  });
  
  return null;
}

// HDR tone mapping simulation
function HDREffect({ enabled, exposure = 1.5 }: { enabled: boolean; exposure?: number }) {
  const { gl } = useThree();
  
  if (enabled) {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
  } else {
    gl.toneMapping = THREE.NoToneMapping;
    gl.toneMappingExposure = 1;
  }
  
  return null;
}

export function TrailerEffects({
  motionBlur = true,
  hdr = true,
  bloomIntensity = 1.5,
  vignetteIntensity = 0.4,
}: TrailerEffectsProps) {
  return (
    <>
      <MotionBlurEffect enabled={motionBlur} intensity={0.3} />
      <HDREffect enabled={hdr} exposure={1.8} />
      
      <EffectComposer>
        {/* Bloom for glowing elements */}
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
        
        {/* Chromatic aberration for cinematic look */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.002, 0.002)}
          radialModulation={false}
          modulationOffset={0}
        />
        
        {/* Vignette for focus */}
        <Vignette
          darkness={vignetteIntensity}
          offset={0.3}
        />
      </EffectComposer>
    </>
  );
}

// Seamless scene transition helper
export function useSceneTransition(duration: number = 1.5) {
  const progressRef = useRef(0);
  const isTransitioning = useRef(false);
  const startTime = useRef(0);
  
  const startTransition = () => {
    isTransitioning.current = true;
    startTime.current = performance.now();
    progressRef.current = 0;
  };
  
  useFrame(() => {
    if (!isTransitioning.current) return;
    
    const elapsed = (performance.now() - startTime.current) / 1000;
    progressRef.current = Math.min(elapsed / duration, 1);
    
    if (progressRef.current >= 1) {
      isTransitioning.current = false;
    }
  });
  
  return {
    progress: progressRef.current,
    isTransitioning: isTransitioning.current,
    startTransition,
  };
}

// Smooth camera path interpolation for seamless transitions
export function useSmoothCameraPath(
  points: THREE.Vector3[],
  duration: number,
  isPlaying: boolean
) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  
  // Create smooth curve through all points
  useMemo(() => {
    if (points.length >= 2) {
      curveRef.current = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
    }
  }, [points]);
  
  useFrame((_, delta) => {
    if (!isPlaying || !curveRef.current) return;
    
    timeRef.current += delta / duration;
    if (timeRef.current > 1) timeRef.current = 0;
    
    // Get position on curve
    const position = curveRef.current.getPoint(timeRef.current);
    
    // Get look-ahead point for smooth orientation
    const lookAheadT = (timeRef.current + 0.05) % 1;
    const lookAt = curveRef.current.getPoint(lookAheadT);
    
    // Smoothly interpolate camera
    camera.position.lerp(position, 0.05);
    
    const targetQuaternion = new THREE.Quaternion();
    const lookMatrix = new THREE.Matrix4().lookAt(camera.position, lookAt, new THREE.Vector3(0, 1, 0));
    targetQuaternion.setFromRotationMatrix(lookMatrix);
    camera.quaternion.slerp(targetQuaternion, 0.03);
  });
  
  return {
    reset: () => { timeRef.current = 0; },
    progress: timeRef.current,
  };
}

// Film grain overlay
export function FilmGrain({ intensity = 0.03 }: { intensity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = clock.elapsedTime;
      }
    }
  });
  
  const grainShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      intensity: { value: intensity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        float grain = random(vUv + time * 0.01) * intensity;
        gl_FragColor = vec4(vec3(grain), grain);
      }
    `,
    transparent: true,
  }), [intensity]);
  
  return (
    <mesh ref={meshRef} position={[0, 0, -0.1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial {...grainShader} depthWrite={false} />
    </mesh>
  );
}
