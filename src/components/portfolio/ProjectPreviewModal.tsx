import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Film,
  FolderOpen,
  Layers,
  Camera,
  Sun,
  Zap,
  Music,
  SkipBack,
  SkipForward,
  Box,
} from 'lucide-react';
import { Project3D } from '@/store/projectStore';
import { Slider } from '@/components/ui/slider';
import { ScenePreview3D } from './ScenePreview3D';

interface ProjectPreviewModalProps {
  project: Partial<Project3D> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample scene data for different project types
const getSceneData = (type?: string) => {
  switch (type) {
    case 'movie-3d':
      return {
        scenes: [
          { name: 'Opening Shot', duration: 5, color: 'from-blue-500/40 to-cyan-500/40', icon: Camera },
          { name: 'Character Intro', duration: 8, color: 'from-purple-500/40 to-pink-500/40', icon: Layers },
          { name: 'Action Sequence', duration: 10, color: 'from-orange-500/40 to-red-500/40', icon: Zap },
          { name: 'Closing Scene', duration: 7, color: 'from-green-500/40 to-teal-500/40', icon: Sun },
        ],
        audioTracks: [
          { name: 'Background Score', waveform: [0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.5, 0.7, 0.4] },
          { name: 'Sound Effects', waveform: [0.1, 0.9, 0.2, 0.8, 0.1, 0.7, 0.3, 0.9, 0.2, 0.6, 0.1, 0.8, 0.4, 0.9, 0.2] },
        ],
      };
    case 'game':
      return {
        scenes: [
          { name: 'Level Start', duration: 3, color: 'from-emerald-500/40 to-green-500/40', icon: Play },
          { name: 'Gameplay Loop', duration: 15, color: 'from-violet-500/40 to-purple-500/40', icon: Layers },
          { name: 'Boss Fight', duration: 8, color: 'from-red-500/40 to-orange-500/40', icon: Zap },
          { name: 'Victory Screen', duration: 4, color: 'from-yellow-500/40 to-amber-500/40', icon: Sun },
        ],
        audioTracks: [
          { name: 'Game Music', waveform: [0.6, 0.8, 0.5, 0.9, 0.7, 0.8, 0.6, 0.9, 0.5, 0.8, 0.7, 0.6, 0.9, 0.5, 0.8] },
          { name: 'SFX Layer', waveform: [0.2, 0.8, 0.1, 0.9, 0.3, 0.7, 0.2, 0.8, 0.1, 0.9, 0.4, 0.6, 0.2, 0.8, 0.3] },
        ],
      };
    default:
      return {
        scenes: [
          { name: 'Model Showcase', duration: 10, color: 'from-slate-500/40 to-zinc-500/40', icon: Camera },
          { name: 'Detail View', duration: 8, color: 'from-blue-500/40 to-indigo-500/40', icon: Layers },
          { name: 'Environment', duration: 12, color: 'from-amber-500/40 to-orange-500/40', icon: Sun },
        ],
        audioTracks: [
          { name: 'Ambient Sound', waveform: [0.2, 0.3, 0.4, 0.3, 0.5, 0.4, 0.3, 0.4, 0.5, 0.3, 0.4, 0.3, 0.5, 0.4, 0.3] },
        ],
      };
  }
};

export function ProjectPreviewModal({
  project,
  open,
  onOpenChange,
}: ProjectPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const sceneData = getSceneData(project?.type);
  const duration = sceneData.scenes.reduce((acc, s) => acc + s.duration, 0);

  // Calculate which scene is active based on current time
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < sceneData.scenes.length; i++) {
      accumulated += sceneData.scenes[i].duration;
      if (currentTime < accumulated) {
        setActiveSceneIndex(i);
        break;
      }
    }
  }, [currentTime, sceneData.scenes]);

  // Audio synthesis for demo
  useEffect(() => {
    if (isPlaying && !isMuted && volume > 0) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
      
      if (!oscillatorRef.current && audioContextRef.current && gainNodeRef.current) {
        oscillatorRef.current = audioContextRef.current.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(220 + (activeSceneIndex * 55), audioContextRef.current.currentTime);
        oscillatorRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.gain.setValueAtTime((volume / 100) * 0.1, audioContextRef.current.currentTime);
        oscillatorRef.current.start();
      }
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
  }, [isPlaying, isMuted, volume, activeSceneIndex]);

  // Update gain when volume changes
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime((volume / 100) * 0.1, audioContextRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const skipToScene = (index: number) => {
    let time = 0;
    for (let i = 0; i < index; i++) {
      time += sceneData.scenes[i].duration;
    }
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = () => {
    switch (project?.type) {
      case 'movie-3d':
      case 'movie-2d':
        return <Film className="w-6 h-6 text-primary" />;
      case 'game':
        return <Layers className="w-6 h-6 text-primary" />;
      default:
        return <FolderOpen className="w-6 h-6 text-primary" />;
    }
  };

  const ActiveSceneIcon = sceneData.scenes[activeSceneIndex]?.icon || Camera;

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-card/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-3 font-display text-lg">
            {getTypeIcon()}
            {project.name} - Preview
            <Badge variant="outline" className="ml-auto bg-background/50">
              {project.resolution?.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Main Preview Area with 3D Scene */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-slate-900 to-slate-800">
            {/* 3D Scene Canvas */}
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Box className="w-10 h-10 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Loading 3D scene...</span>
                </div>
              </div>
            }>
              <div className="absolute inset-0">
                <ScenePreview3D
                  sceneIndex={activeSceneIndex}
                  projectType={project.type}
                  isPlaying={isPlaying}
                />
              </div>
            </Suspense>
            
            {/* Scene name overlay */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSceneIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                <span className="text-white/90 font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                  <ActiveSceneIcon className="w-4 h-4" />
                  {sceneData.scenes[activeSceneIndex]?.name}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Playback indicator */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 left-4"
              >
                <Badge className="bg-destructive/90 gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Playing
                </Badge>
              </motion.div>
            )}

            {/* Audio indicator */}
            {isPlaying && !isMuted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1"
              >
                <Music className="w-4 h-4 text-white/70" />
                <div className="flex items-end gap-0.5 h-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white/70 rounded-full"
                      animate={{
                        height: isPlaying ? [4, 12 + Math.random() * 4, 6, 14, 4] : 4,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Click to play overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-full bg-primary/90 shadow-lg shadow-primary/30"
                >
                  <Play className="w-10 h-10 text-primary-foreground" />
                </motion.div>
              </button>
            )}
          </div>

          {/* Scene Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 h-12 rounded-lg overflow-hidden bg-muted/30 p-1">
              {sceneData.scenes.map((scene, index) => {
                const SceneIcon = scene.icon;
                const widthPercent = (scene.duration / duration) * 100;
                return (
                  <motion.button
                    key={index}
                    onClick={() => skipToScene(index)}
                    className={`relative h-full rounded-md flex items-center justify-center gap-2 px-2 transition-all ${
                      index === activeSceneIndex 
                        ? 'bg-primary/30 ring-2 ring-primary/50' 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SceneIcon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate hidden sm:block">{scene.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Audio Waveform Visualization */}
            <div className="space-y-1">
              {sceneData.audioTracks.map((track, trackIndex) => (
                <div key={trackIndex} className="flex items-center gap-2 h-6">
                  <span className="text-xs text-muted-foreground w-24 truncate">{track.name}</span>
                  <div className="flex-1 flex items-center gap-0.5 h-full bg-muted/20 rounded px-1">
                    {track.waveform.map((level, i) => {
                      const progress = currentTime / duration;
                      const barProgress = i / track.waveform.length;
                      const isActive = barProgress <= progress;
                      return (
                        <motion.div
                          key={i}
                          className={`flex-1 rounded-full transition-colors ${
                            isActive ? 'bg-primary/70' : 'bg-muted-foreground/30'
                          }`}
                          style={{ height: `${level * 100}%` }}
                          animate={isPlaying && isActive ? {
                            scaleY: [1, 1.2, 1],
                          } : {}}
                          transition={{ duration: 0.2 }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={(currentTime / duration) * 100} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>Scene {activeSceneIndex + 1} of {sceneData.scenes.length}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipToScene(Math.max(0, activeSceneIndex - 1))}
                className="h-9 w-9"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="h-9 w-9"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handlePlayPause}
                className="h-11 w-11 shadow-lg shadow-primary/20"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipToScene(Math.min(sceneData.scenes.length - 1, activeSceneIndex + 1))}
                className="h-9 w-9"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-8 w-8"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    setIsMuted(v[0] === 0);
                  }}
                  className="w-24"
                />
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
