import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project3D {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  type: 'model' | 'game' | 'movie-2d' | 'movie-3d';
  resolution: '1080p' | '4k';
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'rendering' | 'completed';
  renderProgress?: number;
  modelData?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'material' | 'animation';
  thumbnail: string;
  source: 'local' | 'google' | 'reddit' | 'unity' | 'sketchfab';
  createdAt: Date;
}

interface ProjectState {
  projects: Project3D[];
  assets: Asset[];
  currentProject: Project3D | null;
  addProject: (project: Omit<Project3D, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project3D>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project3D | null) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  deleteAsset: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      assets: [],
      currentProject: null,
      
      addProject: (project) => set((state) => ({
        projects: [
          ...state.projects,
          {
            ...project,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),
      
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addAsset: (asset) => set((state) => ({
        assets: [
          ...state.assets,
          {
            ...asset,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          },
        ],
      })),
      
      deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
      })),
    }),
    {
      name: 'nexus-studio-projects',
    }
  )
);
