import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
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
import {
  NathanDrakeModel,
  ElenaFisherModel,
  VictorSullivanModel,
  ChloeFrazerModel,
  AncientTempleModel,
  TreasureChestModel,
  StoneArtifactModel,
  JungleRuinsModel,
} from '@/components/3d/UnchartedModels';
import { ModelStyle } from '@/store/sceneStore';

interface ModelThumbnail3DProps {
  modelId: string;
  className?: string;
}

// Style cycle order for the 20-second refresh
const STYLE_CYCLE: ModelStyle[] = ['toon', 'standard', 'wireframe'];

// Map model IDs to their procedural components
const MODEL_COMPONENTS: Record<string, React.FC<{ style?: ModelStyle }>> = {
  // Standard characters
  'humanoid_male': HumanoidModel,
  'humanoid_female': HumanoidModel,
  
  // Uncharted characters
  'nathan_drake': NathanDrakeModel,
  'elena_fisher': ElenaFisherModel,
  'victor_sullivan': VictorSullivanModel,
  'chloe_frazer': ChloeFrazerModel,
  
  // Animals
  'dog': DogModel,
  'cat': CatModel,
  'domestic_cat': CatModel,
  'elephant': ElephantModel,
  'lion': LionModel,
  'horse': HorseModel,
  'arabian_horse': HorseModel,
  'wolf': WolfModel,
  'gray_wolf': WolfModel,
  'shark': WhaleModel,
  'great_white_shark': WhaleModel,
  'dolphin': DolphinModel,
  'bottlenose_dolphin': DolphinModel,
  'eagle': BirdModel,
  'bald_eagle': BirdModel,
  'fish': FishModel,
  'bird': BirdModel,
  'whale': WhaleModel,
  
  // Nature
  'oak_tree': TreeModel,
  'pine_tree': TreeModel,
  'palm_tree': PalmTreeModel,
  'tree': TreeModel,
  'rose': FlowerModel,
  'rose_bush': FlowerModel,
  'flower': FlowerModel,
  'rock': RockModel,
  'lake': RockModel,
  'river': RockModel,
  'fountain': RockModel,
  
  // Uncharted environments
  'ancient_temple': AncientTempleModel,
  'treasure_chest': TreasureChestModel,
  'stone_artifact': StoneArtifactModel,
  'jungle_ruins': JungleRuinsModel,
};

// Fallback primitive for unknown models
function FallbackModel({ style = 'toon' }: { style?: ModelStyle }) {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color="#00d4ff" 
        wireframe={style === 'wireframe'}
      />
    </mesh>
  );
}

function ModelScene({ modelId, style }: { modelId: string; style: ModelStyle }) {
  const ModelComponent = MODEL_COMPONENTS[modelId] || FallbackModel;
  
  // Calculate appropriate scale based on model type
  const scale = useMemo(() => {
    // Environment models - larger structures
    if (modelId.includes('temple') || modelId.includes('ruins')) {
      return 0.5;
    }
    if (modelId.includes('tree') || modelId.includes('lake') || modelId.includes('river')) {
      return 0.3;
    }
    // Larger animals
    if (modelId.includes('elephant') || modelId.includes('horse')) {
      return 0.8;
    }
    // Props and artifacts
    if (modelId.includes('chest') || modelId.includes('artifact')) {
      return 1.5;
    }
    if (modelId.includes('fountain')) {
      return 0.5;
    }
    return 1;
  }, [modelId]);

  return (
    <group scale={scale}>
      <ModelComponent style={style} />
    </group>
  );
}

export function ModelThumbnail3D({ modelId, className = '' }: ModelThumbnail3DProps) {
  // Only render canvas when in view to prevent WebGL context exhaustion
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Cycle through styles every 20 seconds
  const [styleIndex, setStyleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    if (!inView) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setStyleIndex((prev) => (prev + 1) % STYLE_CYCLE.length);
        setIsTransitioning(false);
      }, 300);
    }, 20000);
    
    return () => clearInterval(interval);
  }, [inView]);
  
  const currentStyle = STYLE_CYCLE[styleIndex];

  return (
    <div 
      ref={ref}
      className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'} ${className}`}
    >
      {inView ? (
        <Canvas
          gl={{ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={2}
          frameloop="always"
          performance={{ min: 0.8, max: 1 }}
        >
          <PerspectiveCamera makeDefault position={[1.5, 1, 1.5]} fov={40} />
          
          <ambientLight intensity={currentStyle === 'wireframe' ? 0.8 : 0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={currentStyle === 'standard' ? 1.0 : 0.8} 
          />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          
          <Suspense fallback={null}>
            <ModelScene modelId={modelId} style={currentStyle} />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      ) : (
        <div className="w-full h-full bg-muted/50 animate-pulse rounded" />
      )}
      
      {/* Style indicator badge */}
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-medium bg-background/80 backdrop-blur-sm rounded border border-primary/20 capitalize">
        {currentStyle}
      </div>
    </div>
  );
}
