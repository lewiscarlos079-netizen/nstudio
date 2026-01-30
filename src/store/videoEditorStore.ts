import { create } from 'zustand';

export interface VideoClip {
  id: string;
  name: string;
  duration: number; // in seconds
  startFrame: number;
  endFrame: number;
  thumbnail?: string;
  sourceProjectId?: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'effects';
  clips: VideoClip[];
  muted: boolean;
  locked: boolean;
}

export interface EditState {
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  editMode: 'clip' | 'frame';
  fps: number;
}

interface VideoEditorState {
  tracks: TimelineTrack[];
  editState: EditState;
  projectDuration: number;
  
  // Track actions
  addTrack: (type: TimelineTrack['type'], name?: string) => void;
  removeTrack: (id: string) => void;
  toggleTrackMute: (id: string) => void;
  toggleTrackLock: (id: string) => void;
  
  // Clip actions
  addClip: (trackId: string, clip: Omit<VideoClip, 'id'>) => void;
  removeClip: (trackId: string, clipId: string) => void;
  moveClip: (fromTrackId: string, toTrackId: string, clipId: string, newStartFrame: number) => void;
  trimClip: (trackId: string, clipId: string, startFrame: number, endFrame: number) => void;
  splitClip: (trackId: string, clipId: string, atFrame: number) => void;
  
  // Edit state actions
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  setZoom: (zoom: number) => void;
  selectClip: (clipId: string | null) => void;
  selectTrack: (trackId: string | null) => void;
  setEditMode: (mode: EditState['editMode']) => void;
  goToFrame: (frame: number) => void;
  nextFrame: () => void;
  prevFrame: () => void;
}

export const useVideoEditorStore = create<VideoEditorState>((set, get) => ({
  tracks: [
    {
      id: 'main-video',
      name: 'Video 1',
      type: 'video',
      clips: [],
      muted: false,
      locked: false,
    },
  ],
  editState: {
    currentTime: 0,
    isPlaying: false,
    zoom: 1,
    selectedClipId: null,
    selectedTrackId: null,
    editMode: 'clip',
    fps: 30,
  },
  projectDuration: 0,

  addTrack: (type, name) =>
    set((state) => {
      const trackCount = state.tracks.filter((t) => t.type === type).length + 1;
      return {
        tracks: [
          ...state.tracks,
          {
            id: crypto.randomUUID(),
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${trackCount}`,
            type,
            clips: [],
            muted: false,
            locked: false,
          },
        ],
      };
    }),

  removeTrack: (id) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== id),
    })),

  toggleTrackMute: (id) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === id ? { ...t, muted: !t.muted } : t
      ),
    })),

  toggleTrackLock: (id) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === id ? { ...t, locked: !t.locked } : t
      ),
    })),

  addClip: (trackId, clip) =>
    set((state) => {
      const newClip = { ...clip, id: crypto.randomUUID() };
      const newTracks = state.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
      );
      
      // Update project duration
      const maxEndFrame = Math.max(
        ...newTracks.flatMap((t) => t.clips.map((c) => c.endFrame)),
        0
      );
      
      return {
        tracks: newTracks,
        projectDuration: maxEndFrame / state.editState.fps,
      };
    }),

  removeClip: (trackId, clipId) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId
          ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) }
          : t
      ),
    })),

  moveClip: (fromTrackId, toTrackId, clipId, newStartFrame) =>
    set((state) => {
      let clipToMove: VideoClip | undefined;
      
      const tracksWithoutClip = state.tracks.map((t) => {
        if (t.id === fromTrackId) {
          const clip = t.clips.find((c) => c.id === clipId);
          if (clip) {
            clipToMove = {
              ...clip,
              startFrame: newStartFrame,
              endFrame: newStartFrame + (clip.endFrame - clip.startFrame),
            };
          }
          return { ...t, clips: t.clips.filter((c) => c.id !== clipId) };
        }
        return t;
      });

      if (!clipToMove) return state;

      return {
        tracks: tracksWithoutClip.map((t) =>
          t.id === toTrackId ? { ...t, clips: [...t.clips, clipToMove!] } : t
        ),
      };
    }),

  trimClip: (trackId, clipId, startFrame, endFrame) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId
          ? {
              ...t,
              clips: t.clips.map((c) =>
                c.id === clipId
                  ? {
                      ...c,
                      startFrame,
                      endFrame,
                      duration: (endFrame - startFrame) / state.editState.fps,
                    }
                  : c
              ),
            }
          : t
      ),
    })),

  splitClip: (trackId, clipId, atFrame) =>
    set((state) => ({
      tracks: state.tracks.map((t) => {
        if (t.id !== trackId) return t;
        
        const clipIndex = t.clips.findIndex((c) => c.id === clipId);
        if (clipIndex === -1) return t;
        
        const clip = t.clips[clipIndex];
        if (atFrame <= clip.startFrame || atFrame >= clip.endFrame) return t;
        
        const clip1: VideoClip = {
          ...clip,
          id: crypto.randomUUID(),
          endFrame: atFrame,
          duration: (atFrame - clip.startFrame) / state.editState.fps,
        };
        
        const clip2: VideoClip = {
          ...clip,
          id: crypto.randomUUID(),
          startFrame: atFrame,
          duration: (clip.endFrame - atFrame) / state.editState.fps,
        };
        
        const newClips = [...t.clips];
        newClips.splice(clipIndex, 1, clip1, clip2);
        
        return { ...t, clips: newClips };
      }),
    })),

  setCurrentTime: (time) =>
    set((state) => ({
      editState: { ...state.editState, currentTime: time },
    })),

  play: () =>
    set((state) => ({
      editState: { ...state.editState, isPlaying: true },
    })),

  pause: () =>
    set((state) => ({
      editState: { ...state.editState, isPlaying: false },
    })),

  setZoom: (zoom) =>
    set((state) => ({
      editState: { ...state.editState, zoom: Math.max(0.1, Math.min(10, zoom)) },
    })),

  selectClip: (clipId) =>
    set((state) => ({
      editState: { ...state.editState, selectedClipId: clipId },
    })),

  selectTrack: (trackId) =>
    set((state) => ({
      editState: { ...state.editState, selectedTrackId: trackId },
    })),

  setEditMode: (mode) =>
    set((state) => ({
      editState: { ...state.editState, editMode: mode },
    })),

  goToFrame: (frame) =>
    set((state) => ({
      editState: {
        ...state.editState,
        currentTime: Math.max(0, frame / state.editState.fps),
      },
    })),

  nextFrame: () =>
    set((state) => ({
      editState: {
        ...state.editState,
        currentTime: state.editState.currentTime + 1 / state.editState.fps,
      },
    })),

  prevFrame: () =>
    set((state) => ({
      editState: {
        ...state.editState,
        currentTime: Math.max(0, state.editState.currentTime - 1 / state.editState.fps),
      },
    })),
}));
