import { create } from 'zustand';

export interface CameraPoint {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number; // seconds for transition
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export interface RecordingState {
  isRecording: boolean;
  isPreviewing: boolean;
  currentPointIndex: number;
  recordedFrames: number;
  fps: number;
  resolution: '720p' | '1080p' | '4k';
}

interface CameraState {
  cameraPoints: CameraPoint[];
  recording: RecordingState;
  
  // Camera point actions
  addCameraPoint: (point: Omit<CameraPoint, 'id'>) => void;
  removeCameraPoint: (id: string) => void;
  updateCameraPoint: (id: string, updates: Partial<CameraPoint>) => void;
  reorderCameraPoints: (fromIndex: number, toIndex: number) => void;
  
  // Recording actions
  startRecording: () => void;
  stopRecording: () => void;
  startPreview: () => void;
  stopPreview: () => void;
  setFps: (fps: number) => void;
  setResolution: (resolution: RecordingState['resolution']) => void;
  nextPoint: () => void;
  prevPoint: () => void;
  goToPoint: (index: number) => void;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  cameraPoints: [],
  recording: {
    isRecording: false,
    isPreviewing: false,
    currentPointIndex: 0,
    recordedFrames: 0,
    fps: 30,
    resolution: '1080p',
  },

  addCameraPoint: (point) =>
    set((state) => ({
      cameraPoints: [
        ...state.cameraPoints,
        { ...point, id: crypto.randomUUID() },
      ],
    })),

  removeCameraPoint: (id) =>
    set((state) => ({
      cameraPoints: state.cameraPoints.filter((p) => p.id !== id),
    })),

  updateCameraPoint: (id, updates) =>
    set((state) => ({
      cameraPoints: state.cameraPoints.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  reorderCameraPoints: (fromIndex, toIndex) =>
    set((state) => {
      const points = [...state.cameraPoints];
      const [removed] = points.splice(fromIndex, 1);
      points.splice(toIndex, 0, removed);
      return { cameraPoints: points };
    }),

  startRecording: () =>
    set((state) => ({
      recording: { ...state.recording, isRecording: true, recordedFrames: 0 },
    })),

  stopRecording: () =>
    set((state) => ({
      recording: { ...state.recording, isRecording: false },
    })),

  startPreview: () =>
    set((state) => ({
      recording: { ...state.recording, isPreviewing: true, currentPointIndex: 0 },
    })),

  stopPreview: () =>
    set((state) => ({
      recording: { ...state.recording, isPreviewing: false },
    })),

  setFps: (fps) =>
    set((state) => ({
      recording: { ...state.recording, fps },
    })),

  setResolution: (resolution) =>
    set((state) => ({
      recording: { ...state.recording, resolution },
    })),

  nextPoint: () =>
    set((state) => ({
      recording: {
        ...state.recording,
        currentPointIndex: Math.min(
          state.recording.currentPointIndex + 1,
          state.cameraPoints.length - 1
        ),
      },
    })),

  prevPoint: () =>
    set((state) => ({
      recording: {
        ...state.recording,
        currentPointIndex: Math.max(state.recording.currentPointIndex - 1, 0),
      },
    })),

  goToPoint: (index) =>
    set((state) => ({
      recording: {
        ...state.recording,
        currentPointIndex: Math.max(
          0,
          Math.min(index, state.cameraPoints.length - 1)
        ),
      },
    })),
}));
