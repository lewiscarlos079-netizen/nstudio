import { create } from 'zustand';

export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'torus';

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
}

interface TransformMode {
  mode: 'translate' | 'rotate' | 'scale' | 'select';
}

interface SceneState {
  objects: SceneObject[];
  selectedObjectId: string | null;
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
}

const getRandomPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 4,
    0.5 + Math.random() * 2,
    (Math.random() - 0.5) * 4,
  ];
};

let objectCounter = 1;

export const useSceneStore = create<SceneState>((set, get) => ({
  objects: [],
  selectedObjectId: null,
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
      const newObject: SceneObject = {
        id: crypto.randomUUID(),
        name: name || `${modelId}_${objectCounter++}`,
        type: 'procedural',
        modelId,
        position: getRandomPosition(),
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
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
}));
