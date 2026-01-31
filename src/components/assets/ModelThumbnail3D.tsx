import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { 
  HumanoidModel, 
  DogModel, 
  CatModel, 
  ElephantModel, 
  LionModel, 
  HorseModel, 
  WolfModel,
  DolphinModel,
  WhaleModel,
  BirdModel,
  FishModel,
  TreeModel,
  PalmTreeModel,
  FlowerModel,
  RockModel,
} from '@/components/3d/ProceduralModels';

interface ModelThumbnail3DProps {
  modelId: string;
  className?: string;
}

// Map model IDs to their procedural components
const MODEL_COMPONENTS: Record<string, React.FC<{ style?: 'standard' | 'toon' | 'wireframe' }>> = {
  'humanoid_male': HumanoidModel,
  'humanoid_female': HumanoidModel,
  'dog': DogModel,
  'cat': CatModel,
  'domestic_cat': CatModel,
  'elephant': ElephantModel,
  'lion': LionModel,
  'horse': HorseModel,
  'arabian_horse': HorseModel,
  'wolf': WolfModel,
  'gray_wolf': WolfModel,
  'shark': WhaleModel, // Use whale as fallback
  'great_white_shark': WhaleModel,
  'dolphin': DolphinModel,
  'bottlenose_dolphin': DolphinModel,
  'eagle': BirdModel, // Use bird as fallback
  'bald_eagle': BirdModel,
  'oak_tree': TreeModel,
  'pine_tree': TreeModel,
  'palm_tree': PalmTreeModel,
  'rose': FlowerModel,
  'rose_bush': FlowerModel,
  'lake': RockModel, // Use rock as water placeholder
  'river': RockModel,
  'fountain': RockModel,
  'fish': FishModel,
  'bird': BirdModel,
  'tree': TreeModel,
  'flower': FlowerModel,
  'rock': RockModel,
  'whale': WhaleModel,
};

// Fallback primitive for unknown models
function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#00d4ff" />
    </mesh>
  );
}

function ModelScene({ modelId }: { modelId: string }) {
  const ModelComponent = MODEL_COMPONENTS[modelId] || FallbackModel;
  
  // Calculate appropriate scale based on model type
  const scale = useMemo(() => {
    if (modelId.includes('tree') || modelId.includes('lake') || modelId.includes('river')) {
      return 0.3;
    }
    if (modelId.includes('elephant') || modelId.includes('horse')) {
      return 0.8;
    }
    if (modelId.includes('fountain')) {
      return 0.5;
    }
    return 1;
  }, [modelId]);

  return (
    <group scale={scale}>
      <ModelComponent style="toon" />
    </group>
  );
}

export function ModelThumbnail3D({ modelId, className = '' }: ModelThumbnail3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[1.5, 1, 1.5]} fov={40} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <ModelScene modelId={modelId} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}
