import { create } from 'zustand';

export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'cone';

export interface SceneObject {
  id: string;
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
}

interface SceneState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  addObject: (type: PrimitiveType) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  clearScene: () => void;
}

const getRandomPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 4,
    0.5 + Math.random() * 2,
    (Math.random() - 0.5) * 4,
  ];
};

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  selectedObjectId: null,

  addObject: (type) =>
    set((state) => ({
      objects: [
        ...state.objects,
        {
          id: crypto.randomUUID(),
          type,
          position: getRandomPosition(),
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#00d4ff',
          metalness: 0.8,
          roughness: 0.2,
          emissiveIntensity: 0.2,
        },
      ],
    })),

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
}));
