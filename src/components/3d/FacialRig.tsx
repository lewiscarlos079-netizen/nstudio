import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StyledMaterial, SurfaceType } from './Materials';
import { ModelStyle } from '@/store/sceneStore';

// Facial muscle groups based on FACS (Facial Action Coding System)
export type FacialMuscle = 
  | 'frontalis'         // Forehead - raises eyebrows
  | 'corrugator'        // Brow - frown
  | 'orbicularis_oculi' // Around eyes - squint/blink
  | 'levator_labii'     // Upper lip - disgust/sneer
  | 'zygomaticus'       // Cheek - smile
  | 'risorius'          // Corner of mouth - grin
  | 'orbicularis_oris'  // Around mouth - pucker
  | 'depressor_anguli'  // Mouth corner - frown
  | 'mentalis'          // Chin - pout
  | 'masseter'          // Jaw - clench
  | 'temporalis';       // Temple - jaw assist

// Bone structure for facial rig
export type FacialBone =
  | 'skull'
  | 'jaw'
  | 'cheekbone_l' | 'cheekbone_r'
  | 'brow_l' | 'brow_r'
  | 'nose_bridge' | 'nose_tip'
  | 'upper_lip' | 'lower_lip'
  | 'chin';

// Expression presets
export type FacialExpression = 
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'disgusted'
  | 'fearful'
  | 'contempt'
  | 'sleepy'
  | 'speaking';

// Muscle activation values for each expression (0-1)
const EXPRESSION_MUSCLES: Record<FacialExpression, Partial<Record<FacialMuscle, number>>> = {
  neutral: {},
  happy: {
    zygomaticus: 0.8,
    orbicularis_oculi: 0.5,
    risorius: 0.4,
  },
  sad: {
    corrugator: 0.6,
    depressor_anguli: 0.7,
    orbicularis_oris: 0.2,
    mentalis: 0.4,
  },
  angry: {
    corrugator: 0.9,
    orbicularis_oculi: 0.4,
    levator_labii: 0.3,
    masseter: 0.6,
  },
  surprised: {
    frontalis: 0.9,
    orbicularis_oculi: -0.3, // Eyes wide
    orbicularis_oris: 0.5,
  },
  disgusted: {
    levator_labii: 0.8,
    corrugator: 0.4,
    orbicularis_oris: 0.3,
  },
  fearful: {
    frontalis: 0.7,
    corrugator: 0.5,
    orbicularis_oculi: 0.3,
    depressor_anguli: 0.4,
  },
  contempt: {
    risorius: 0.5, // One-sided
    zygomaticus: 0.2,
  },
  sleepy: {
    orbicularis_oculi: 0.7,
    depressor_anguli: 0.2,
    mentalis: 0.1,
  },
  speaking: {
    orbicularis_oris: 0.4,
    masseter: 0.2,
  },
};

// Bone transforms for expressions
interface BoneTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

// Calculate bone transforms from muscle activations
function calculateBoneTransforms(
  muscles: Partial<Record<FacialMuscle, number>>
): Partial<Record<FacialBone, BoneTransform>> {
  const transforms: Partial<Record<FacialBone, BoneTransform>> = {};
  
  // Brow bones
  const browLift = (muscles.frontalis || 0) * 0.015;
  const browFurrow = (muscles.corrugator || 0) * 0.008;
  
  transforms.brow_l = {
    position: [0, browLift - browFurrow * 0.5, browFurrow],
    rotation: [browFurrow * 0.3, 0, browFurrow * 0.2],
    scale: [1, 1, 1],
  };
  transforms.brow_r = {
    position: [0, browLift - browFurrow * 0.5, browFurrow],
    rotation: [browFurrow * 0.3, 0, -browFurrow * 0.2],
    scale: [1, 1, 1],
  };
  
  // Jaw
  const jawOpen = (muscles.orbicularis_oris || 0) * 0.02;
  const jawClench = (muscles.masseter || 0) * 0.003;
  
  transforms.jaw = {
    position: [0, -jawOpen + jawClench, 0],
    rotation: [jawOpen * 0.3, 0, 0],
    scale: [1, 1 - jawClench * 0.1, 1],
  };
  
  // Cheekbones
  const smile = (muscles.zygomaticus || 0) * 0.01;
  const sneer = (muscles.levator_labii || 0) * 0.008;
  
  transforms.cheekbone_l = {
    position: [smile * 0.5, smile + sneer * 0.5, smile * 0.3],
    rotation: [0, 0, smile * 0.1],
    scale: [1 + smile * 0.1, 1, 1],
  };
  transforms.cheekbone_r = {
    position: [-smile * 0.5, smile + sneer * 0.5, smile * 0.3],
    rotation: [0, 0, -smile * 0.1],
    scale: [1 + smile * 0.1, 1, 1],
  };
  
  // Lips
  const pucker = (muscles.orbicularis_oris || 0) * 0.005;
  const cornerDown = (muscles.depressor_anguli || 0) * 0.01;
  const cornerUp = (muscles.risorius || 0) * 0.008;
  
  transforms.upper_lip = {
    position: [0, sneer * 0.5, pucker],
    rotation: [pucker * 0.5, 0, 0],
    scale: [1 - pucker * 0.3, 1, 1 + pucker * 0.5],
  };
  transforms.lower_lip = {
    position: [0, -cornerDown + cornerUp * 0.3, pucker * 0.8],
    rotation: [-pucker * 0.3, 0, 0],
    scale: [1 - pucker * 0.2, 1, 1 + pucker * 0.4],
  };
  
  // Chin
  const pout = (muscles.mentalis || 0) * 0.008;
  
  transforms.chin = {
    position: [0, pout * 0.5, pout],
    rotation: [pout * 0.2, 0, 0],
    scale: [1, 1 + pout * 0.2, 1],
  };
  
  // Nose
  transforms.nose_tip = {
    position: [0, sneer * 0.3, 0],
    rotation: [sneer * 0.1, 0, 0],
    scale: [1, 1, 1],
  };
  
  return transforms;
}

// Hook for facial animation
export function useFacialAnimation(
  expression: FacialExpression = 'neutral',
  options: {
    blinkRate?: number;
    microExpressions?: boolean;
    lipSync?: boolean;
    breathingEffect?: boolean;
  } = {}
) {
  const {
    blinkRate = 4,
    microExpressions = true,
    lipSync = false,
    breathingEffect = true,
  } = options;

  const muscleValuesRef = useRef<Partial<Record<FacialMuscle, number>>>({});
  const targetMusclesRef = useRef<Partial<Record<FacialMuscle, number>>>({});
  const blinkTimerRef = useRef(0);
  const isBlinkingRef = useRef(false);
  
  // Set target muscles when expression changes
  useMemo(() => {
    targetMusclesRef.current = { ...EXPRESSION_MUSCLES[expression] };
  }, [expression]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const current = muscleValuesRef.current;
    const target = targetMusclesRef.current;
    
    // Smooth interpolation to target
    for (const muscle of Object.keys(target) as FacialMuscle[]) {
      const targetVal = target[muscle] || 0;
      const currentVal = current[muscle] || 0;
      current[muscle] = THREE.MathUtils.lerp(currentVal, targetVal, delta * 3);
    }
    
    // Decay muscles not in target
    for (const muscle of Object.keys(current) as FacialMuscle[]) {
      if (!(muscle in target)) {
        current[muscle] = THREE.MathUtils.lerp(current[muscle] || 0, 0, delta * 3);
      }
    }
    
    // Blinking
    blinkTimerRef.current += delta;
    const blinkInterval = 1 / blinkRate + Math.sin(time * 0.1) * 0.5;
    
    if (blinkTimerRef.current > blinkInterval && !isBlinkingRef.current) {
      isBlinkingRef.current = true;
      blinkTimerRef.current = 0;
    }
    
    if (isBlinkingRef.current) {
      current.orbicularis_oculi = (current.orbicularis_oculi || 0) + delta * 8;
      if ((current.orbicularis_oculi || 0) > 0.95) {
        isBlinkingRef.current = false;
      }
    } else if ((current.orbicularis_oculi || 0) > (target.orbicularis_oculi || 0)) {
      current.orbicularis_oculi = THREE.MathUtils.lerp(
        current.orbicularis_oculi || 0,
        target.orbicularis_oculi || 0,
        delta * 6
      );
    }
    
    // Micro-expressions
    if (microExpressions) {
      current.corrugator = (current.corrugator || 0) + Math.sin(time * 0.7) * 0.02;
      current.zygomaticus = (current.zygomaticus || 0) + Math.sin(time * 0.5) * 0.015;
    }
    
    // Breathing effect on nostrils
    if (breathingEffect) {
      current.levator_labii = (current.levator_labii || 0) + Math.sin(time * 0.8) * 0.03;
    }
    
    // Lip sync simulation
    if (lipSync) {
      current.orbicularis_oris = 0.2 + Math.abs(Math.sin(time * 8)) * 0.4;
      current.masseter = 0.1 + Math.abs(Math.sin(time * 6)) * 0.2;
    }
  });

  return muscleValuesRef;
}

// Component for rendering facial features with rigging
interface FacialRigProps {
  expression?: FacialExpression;
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  lipColor?: string;
  style?: ModelStyle;
  scale?: number;
  enableAnimation?: boolean;
  isAnimal?: boolean;
  animalType?: 'mammal' | 'bird' | 'reptile';
}

export function FacialRig({
  expression = 'neutral',
  skinColor = '#D4A574',
  hairColor = '#302520',
  eyeColor = '#5A4030',
  lipColor = '#A06060',
  style = 'standard',
  scale = 1,
  enableAnimation = true,
  isAnimal = false,
  animalType = 'mammal',
}: FacialRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const muscleValues = useFacialAnimation(expression, {
    microExpressions: enableAnimation,
    breathingEffect: enableAnimation,
  });

  // Animated bone transforms
  useFrame(() => {
    if (!groupRef.current || !enableAnimation) return;
    
    const transforms = calculateBoneTransforms(muscleValues.current);
    
    // Apply transforms to child bones by name
    groupRef.current.traverse((child) => {
      if (child.name in transforms) {
        const t = transforms[child.name as FacialBone];
        if (t) {
          child.position.set(...t.position);
          child.rotation.set(...t.rotation);
          child.scale.set(...t.scale);
        }
      }
    });
  });

  const browSquint = muscleValues.current.orbicularis_oculi || 0;
  const smile = muscleValues.current.zygomaticus || 0;

  return (
    <group ref={groupRef} scale={scale}>
      {/* Skull base - main head shape */}
      <mesh name="skull" position={[0, 0, 0]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
      </mesh>

      {/* Forehead with muscle definition */}
      <mesh position={[0, 0.08, 0.06]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
      </mesh>

      {/* Brow ridge bones */}
      <group name="brow_l" position={[-0.04, 0.04, 0.1]}>
        <mesh>
          <capsuleGeometry args={[0.015, 0.04, 8, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>
      <group name="brow_r" position={[0.04, 0.04, 0.1]}>
        <mesh>
          <capsuleGeometry args={[0.015, 0.04, 8, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>

      {/* Cheekbone structure */}
      <group name="cheekbone_l" position={[-0.08, -0.02, 0.06]}>
        <mesh>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
        {/* Cheek muscle bulge when smiling */}
        <mesh position={[-0.01, 0.02, 0.02]} scale={[1, 1 + smile * 0.3, 1]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>
      <group name="cheekbone_r" position={[0.08, -0.02, 0.06]}>
        <mesh>
          <sphereGeometry args={[0.04, 12, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
        <mesh position={[0.01, 0.02, 0.02]} scale={[1, 1 + smile * 0.3, 1]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>

      {/* Nose structure */}
      <group name="nose_bridge" position={[0, 0, 0.12]}>
        <mesh rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.025, 0.05, 0.03]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>
      <group name="nose_tip" position={[0, -0.02, 0.14]}>
        <mesh>
          <sphereGeometry args={[0.018, 12, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.012, -0.005, 0]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <StyledMaterial color="#3a2a2a" style={style} />
        </mesh>
        <mesh position={[0.012, -0.005, 0]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <StyledMaterial color="#3a2a2a" style={style} />
        </mesh>
      </group>

      {/* Eye sockets with orbital bones */}
      <group position={[-0.04, 0.015, 0.07]}>
        {/* Orbital cavity */}
        <mesh>
          <sphereGeometry args={[0.022, 14, 14]} />
          <StyledMaterial color="#FFFEF8" style={style} />
        </mesh>
        {/* Iris */}
        <mesh position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <StyledMaterial color={eyeColor} style={style} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.007, 10, 10]} />
          <StyledMaterial color="#101010" style={style} />
        </mesh>
        {/* Upper lid - affected by orbicularis_oculi */}
        <mesh 
          position={[0, 0.012, 0.008]} 
          rotation={[browSquint * 0.5, 0, 0]}
        >
          <sphereGeometry args={[0.024, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>
      <group position={[0.04, 0.015, 0.07]}>
        <mesh>
          <sphereGeometry args={[0.022, 14, 14]} />
          <StyledMaterial color="#FFFEF8" style={style} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <StyledMaterial color={eyeColor} style={style} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.007, 10, 10]} />
          <StyledMaterial color="#101010" style={style} />
        </mesh>
        <mesh 
          position={[0, 0.012, 0.008]} 
          rotation={[browSquint * 0.5, 0, 0]}
        >
          <sphereGeometry args={[0.024, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>

      {/* Jaw bone - movable */}
      <group name="jaw" position={[0, -0.08, 0.03]}>
        <mesh>
          <boxGeometry args={[0.09, 0.05, 0.08]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
        
        {/* Lower teeth row (visible when jaw opens) */}
        <mesh position={[0, 0.02, 0.035]}>
          <boxGeometry args={[0.04, 0.008, 0.005]} />
          <StyledMaterial color="#E8E0D8" style={style} surface="bone" />
        </mesh>
      </group>

      {/* Lip structure */}
      <group name="upper_lip" position={[0, -0.05, 0.12]}>
        <mesh>
          <capsuleGeometry args={[0.012, 0.04, 8, 12]} />
          <StyledMaterial color={lipColor} style={style} surface="skin" />
        </mesh>
        {/* Cupid's bow */}
        <mesh position={[0, 0.005, 0.005]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <StyledMaterial color={lipColor} style={style} surface="skin" />
        </mesh>
      </group>
      <group name="lower_lip" position={[0, -0.065, 0.11]}>
        <mesh>
          <capsuleGeometry args={[0.014, 0.035, 8, 12]} />
          <StyledMaterial color={lipColor} style={style} surface="skin" />
        </mesh>
      </group>

      {/* Chin bone */}
      <group name="chin" position={[0, -0.1, 0.05]}>
        <mesh>
          <sphereGeometry args={[0.03, 12, 12]} />
          <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
        </mesh>
      </group>

      {/* Ears - attached to skull */}
      <mesh position={[-0.13, 0, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
      </mesh>
      <mesh position={[0.13, 0, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <StyledMaterial color={skinColor} style={style} surface={isAnimal ? 'fur' : 'skin'} />
      </mesh>

      {/* Hair (for humans) */}
      {!isAnimal && (
        <>
          <mesh position={[0, 0.08, -0.01]}>
            <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <StyledMaterial color={hairColor} style={style} surface="hair" />
          </mesh>
          <mesh position={[-0.08, 0.04, -0.03]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <StyledMaterial color={hairColor} style={style} surface="hair" />
          </mesh>
          <mesh position={[0.08, 0.04, -0.03]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <StyledMaterial color={hairColor} style={style} surface="hair" />
          </mesh>
        </>
      )}
    </group>
  );
}

// Animal facial rig variant
interface AnimalFacialRigProps {
  animalType: 'canine' | 'feline' | 'equine' | 'ursine' | 'primate';
  furColor?: string;
  eyeColor?: string;
  noseColor?: string;
  style?: ModelStyle;
  expression?: FacialExpression;
  scale?: number;
}

export function AnimalFacialRig({
  animalType,
  furColor = '#8B6B50',
  eyeColor = '#5A4030',
  noseColor = '#252020',
  style = 'standard',
  expression = 'neutral',
  scale = 1,
}: AnimalFacialRigProps) {
  const muscleValues = useFacialAnimation(expression, {
    microExpressions: true,
    breathingEffect: true,
  });

  // Muzzle length varies by animal type
  const muzzleLengths = {
    canine: 0.12,
    feline: 0.06,
    equine: 0.18,
    ursine: 0.08,
    primate: 0.04,
  };
  
  const muzzleLength = muzzleLengths[animalType];
  const hasVerticalPupils = animalType === 'feline';

  return (
    <group scale={scale}>
      {/* Skull */}
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <StyledMaterial color={furColor} style={style} surface="fur" />
      </mesh>

      {/* Muzzle/snout */}
      <mesh position={[0, -0.03, muzzleLength * 0.6]} rotation={[-0.2, 0, 0]}>
        <capsuleGeometry args={[0.05, muzzleLength, 12, 16]} />
        <StyledMaterial color={furColor} style={style} surface="fur" />
      </mesh>

      {/* Nose leather */}
      <mesh position={[0, -0.02, muzzleLength + 0.05]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <StyledMaterial color={noseColor} style={style} surface="leather" />
      </mesh>

      {/* Eyes */}
      {[-0.05, 0.05].map((x, i) => (
        <group key={i} position={[x, 0.02, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.022, 14, 14]} />
            <StyledMaterial color="#FFFEF8" style={style} />
          </mesh>
          <mesh 
            position={[0, 0, 0.015]}
            scale={hasVerticalPupils ? [0.4, 1, 1] : [1, 1, 1]}
          >
            <sphereGeometry args={[0.012, 12, 12]} />
            <StyledMaterial color={eyeColor} style={style} />
          </mesh>
          <mesh 
            position={[0, 0, 0.018]}
            scale={hasVerticalPupils ? [0.3, 1, 1] : [1, 1, 1]}
          >
            <sphereGeometry args={[0.006, 10, 10]} />
            <StyledMaterial color="#101010" style={style} />
          </mesh>
        </group>
      ))}

      {/* Ears based on animal type */}
      {animalType === 'canine' && (
        <>
          <mesh position={[-0.08, 0.1, -0.02]} rotation={[0.3, 0.2, -0.3]}>
            <coneGeometry args={[0.03, 0.08, 8]} />
            <StyledMaterial color={furColor} style={style} surface="fur" />
          </mesh>
          <mesh position={[0.08, 0.1, -0.02]} rotation={[0.3, -0.2, 0.3]}>
            <coneGeometry args={[0.03, 0.08, 8]} />
            <StyledMaterial color={furColor} style={style} surface="fur" />
          </mesh>
        </>
      )}
      {animalType === 'feline' && (
        <>
          <mesh position={[-0.07, 0.1, -0.01]} rotation={[0.2, 0.15, -0.2]}>
            <coneGeometry args={[0.025, 0.06, 8]} />
            <StyledMaterial color={furColor} style={style} surface="fur" />
          </mesh>
          <mesh position={[0.07, 0.1, -0.01]} rotation={[0.2, -0.15, 0.2]}>
            <coneGeometry args={[0.025, 0.06, 8]} />
            <StyledMaterial color={furColor} style={style} surface="fur" />
          </mesh>
        </>
      )}

      {/* Jaw */}
      <group position={[0, -0.07, muzzleLength * 0.4]}>
        <mesh rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.06, 0.03, muzzleLength * 0.8]} />
          <StyledMaterial color={furColor} style={style} surface="fur" />
        </mesh>
      </group>
    </group>
  );
}
