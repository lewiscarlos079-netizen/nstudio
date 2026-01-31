// 3D Systems Barrel Export - Desktop-first, Unity-inspired rendering
// Export all advanced 3D systems for easy imports

// Cloth physics simulation system
export { 
  useClothSimulation,
  ClothMesh,
  Cape,
  FlowingDress,
  BannerFlag,
  FlowingHair,
} from './ClothSimulation';

// Facial muscle and bone rigging system
export {
  useFacialAnimation,
  FacialRig,
  AnimalFacialRig,
  type FacialMuscle,
  type FacialBone,
  type FacialExpression,
} from './FacialRig';

// Asset refresh and detail management system
export {
  useAssetRefreshLoop,
  useDynamicGeometry,
  useLODManager,
  useTextureStreaming,
  useMeshDetailEnhancer,
  useRealtimeNormalMap,
  useAssetDetailSystem,
  type QualityLevel,
} from './AssetRefreshSystem';

// 3D Intro trailer scenes
export {
  IntroTrailer3D,
  type IntroSceneType,
} from './IntroScenes3D';

// Materials system
export {
  useToonMaterial,
  StyledMaterial,
  OutlineMesh,
  type ModelStyle,
  type SurfaceType,
} from './Materials';

// Water systems - flowing streams, waterfalls, ponds, oceans
export {
  FlowingStream,
  Waterfall,
  Pond,
  OceanWaves,
  WaterModelRegistry,
} from './WaterSystems';

// Scientific animal models with ROM
export {
  ScientificElephant,
  ScientificLion,
  ScientificRaccoon,
  ScientificAnimalRegistry,
  ROM_PRESETS,
  useAnimalROM,
  SCIENTIFIC_COLORS,
} from './ScientificAnimals';
