import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Project3D } from '@/store/projectStore';
import { Slider } from '@/components/ui/slider';

interface ProjectPreviewModalProps {
  project: Partial<Project3D> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectPreviewModal({
  project,
  open,
  onOpenChange,
}: ProjectPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const duration = 30; // Mock 30 second duration

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
  }, [isPlaying, currentTime]);

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = () => {
    switch (project?.type) {
      case 'movie-3d':
      case 'movie-2d':
        return <Film className="w-8 h-8 text-primary" />;
      case 'game':
        return <Layers className="w-8 h-8 text-primary" />;
      default:
        return <FolderOpen className="w-8 h-8 text-primary" />;
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-3 font-display text-lg">
            {getTypeIcon()}
            {project.name} - Preview
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Preview Area */}
          <div className="relative aspect-video rounded-xl bg-gradient-to-br from-background via-muted to-background overflow-hidden border border-border/50">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${30 + currentTime}% ${40 + Math.sin(currentTime) * 10}%, hsl(var(--primary) / 0.3), transparent 50%)`,
                }}
              />
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="preview-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                    <circle cx="5" cy="5" r="1" fill="currentColor" className="text-primary/20" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#preview-pattern)" />
              </svg>
            </div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: isPlaying ? [1, 1.05, 1] : 1,
                  opacity: isPlaying ? 0.6 : 1
                }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm"
              >
                {getTypeIcon()}
              </motion.div>
            </div>

            {/* Playback indicator */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 left-4"
              >
                <Badge className="bg-destructive/90 animate-pulse gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Playing
                </Badge>
              </motion.div>
            )}

            {/* Resolution badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                {project.resolution?.toUpperCase()}
              </Badge>
            </div>

            {/* Click to play overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
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

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={(currentTime / duration) * 100} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
