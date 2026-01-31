import { create } from 'zustand';

export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'torus';

export type ModelStyle = 'standard' | 'toon' | 'wireframe';

export type BodyPartType = 
  | 'head' | 'face' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg' 
  | 'tail' | 'leftWing' | 'rightWing' | 'dorsalFin' | 'tailFin' | 'leftFin' | 'rightFin'
  | 'ears' | 'snout' | 'neck' | 'leftFrontLeg' | 'rightFrontLeg' | 'leftBackLeg' | 'rightBackLeg';

export interface BodyPartConfig {
  scale: [number, number, number];
  offset: [number, number, number];
  color?: string;
}

export interface SceneObject {
  id: string;
  name: string;
  type: PrimitiveType | 'model' | 'procedural';
  modelId?: string; // For procedural models, references the model type
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
  locked: boolean;
  visible: boolean;
  // Body part customization for procedural models
  bodyParts?: Record<BodyPartType, BodyPartConfig>;
}

export type CameraMode = '2D' | '3D';

export type TimeOfDay = 'day' | 'night' | 'sunset';

interface TransformMode {
  mode: 'translate' | 'rotate' | 'scale' | 'select';
}

interface SceneState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  selectedBodyPart: BodyPartType | null;
  designMode: boolean;
  designModePopout: boolean; // Whether to show Design Mode as a popup panel
  cameraMode: CameraMode;
  timeOfDay: TimeOfDay;
  modelStyle: ModelStyle;
  transformMode: TransformMode['mode'];
  gridSize: number;
  showGrid: boolean;
  mouseSensitivity: number;
  
  // Actions
  addObject: (type: PrimitiveType, name?: string) => void;
  addProceduralModel: (modelId: string, name?: string) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  clearScene: () => void;
  setTransformMode: (mode: TransformMode['mode']) => void;
  toggleObjectLock: (id: string) => void;
  toggleObjectVisibility: (id: string) => void;
  duplicateObject: (id: string) => void;
  setGridSize: (size: number) => void;
  toggleGrid: () => void;
  setMouseSensitivity: (sensitivity: number) => void;
  // New actions
  setCameraMode: (mode: CameraMode) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  cycleTimeOfDay: () => void;
  setModelStyle: (style: ModelStyle) => void;
  toggleDesignMode: () => void;
  toggleDesignModePopout: () => void;
  selectBodyPart: (part: BodyPartType | null) => void;
  updateBodyPart: (objectId: string, part: BodyPartType, config: Partial<BodyPartConfig>) => void;
}

const getRandomPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 4,
    0.5 + Math.random() * 1.5,
    (Math.random() - 0.5) * 4,
  ];
};

// Larger spawn position for procedural models so they're more visible
const getProceduralModelPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 3,
    0,  // Ground level - models have their own height offset
    (Math.random() - 0.5) * 3,
  ];
};

let objectCounter = 1;

export const useSceneStore = create<SceneState>((set, get) => ({
  objects: [],
  selectedObjectId: null,
  selectedBodyPart: null,
  designMode: false,
  designModePopout: true, // Enable popout by default
  cameraMode: '3D',
  timeOfDay: 'day',
  modelStyle: 'toon',
  transformMode: 'translate',
  gridSize: 1,
  showGrid: true,
  mouseSensitivity: 30,

  addObject: (type, name) =>
    set((state) => {
      const newObject: SceneObject = {
        id: crypto.randomUUID(),
        name: name || `${type.charAt(0).toUpperCase() + type.slice(1)}_${objectCounter++}`,
        type,
        position: getRandomPosition(),
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#00d4ff',
        metalness: 0.8,
        roughness: 0.2,
        emissiveIntensity: 0.2,
        locked: false,
        visible: true,
      };
      return {
        objects: [...state.objects, newObject],
        selectedObjectId: newObject.id,
      };
    }),

  addProceduralModel: (modelId, name) =>
    set((state) => {
      // Use larger scale for better visibility of detailed models
      const defaultScale: [number, number, number] = [6, 6, 6];
      
      const newObject: SceneObject = {
        id: crypto.randomUUID(),
        name: name || `${modelId}_${objectCounter++}`,
        type: 'procedural',
        modelId,
        position: getProceduralModelPosition(),
        rotation: [0, 0, 0],
        scale: defaultScale,
        color: '#00d4ff',
        metalness: 0.5,
        roughness: 0.5,
        emissiveIntensity: 0.1,
        locked: false,
        visible: true,
      };
      return {
        objects: [...state.objects, newObject],
        selectedObjectId: newObject.id,
      };
    }),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),

  selectObject: (id) => set({ selectedObjectId: id }),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  clearScene: () => set({ objects: [], selectedObjectId: null }),

  setTransformMode: (mode) => set({ transformMode: mode }),

  toggleObjectLock: (id) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, locked: !obj.locked } : obj
      ),
    })),

  toggleObjectVisibility: (id) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      ),
    })),

  duplicateObject: (id) =>
    set((state) => {
      const original = state.objects.find((obj) => obj.id === id);
      if (!original) return state;
      
      const duplicate: SceneObject = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name}_copy`,
        position: [
          original.position[0] + 1,
          original.position[1],
          original.position[2] + 1,
        ],
        locked: false,
      };
      return {
        objects: [...state.objects, duplicate],
        selectedObjectId: duplicate.id,
      };
    }),

  setGridSize: (size) => set({ gridSize: size }),
  
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  
  setMouseSensitivity: (sensitivity) => set({ mouseSensitivity: sensitivity }),
  
  setCameraMode: (mode) => set({ cameraMode: mode }),
  
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  
  cycleTimeOfDay: () => set((state) => {
    const cycle: TimeOfDay[] = ['day', 'sunset', 'night'];
    const currentIndex = cycle.indexOf(state.timeOfDay);
    return { timeOfDay: cycle[(currentIndex + 1) % cycle.length] };
  }),
  
  setModelStyle: (style) => set({ modelStyle: style }),
  
  toggleDesignMode: () => set((state) => ({ 
    designMode: !state.designMode,
    selectedBodyPart: state.designMode ? null : state.selectedBodyPart 
  })),
  
  toggleDesignModePopout: () => set((state) => ({ 
    designModePopout: !state.designModePopout 
  })),
  
  selectBodyPart: (part) => set({ selectedBodyPart: part }),
  
  updateBodyPart: (objectId, part, config) =>
    set((state) => ({
      objects: state.objects.map((obj) => {
        if (obj.id !== objectId) return obj;
        const currentParts = obj.bodyParts || {} as Record<BodyPartType, BodyPartConfig>;
        const currentConfig = currentParts[part] || { 
          scale: [1, 1, 1] as [number, number, number], 
          offset: [0, 0, 0] as [number, number, number] 
        };
        return {
          ...obj,
          bodyParts: {
            ...currentParts,
            [part]: { ...currentConfig, ...config }
          }
        };
      }),
    })),
}));
