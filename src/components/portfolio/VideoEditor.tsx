import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Trash2,
  Copy,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Plus,
  ZoomIn,
  ZoomOut,
  Layers,
  Film,
  Wand2,
} from 'lucide-react';
import { useVideoEditorStore, TimelineTrack, VideoClip } from '@/store/videoEditorStore';
import { cn } from '@/lib/utils';

export function VideoEditor() {
  const {
    tracks,
    editState,
    projectDuration,
    loadedProject,
    addTrack,
    removeTrack,
    toggleTrackMute,
    toggleTrackLock,
    removeClip,
    splitClip,
    setCurrentTime,
    play,
    pause,
    setZoom,
    selectClip,
    selectTrack,
    setEditMode,
    goToFrame,
    nextFrame,
    prevFrame,
    clearProject,
  } = useVideoEditorStore();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * editState.fps);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const currentFrame = Math.floor(editState.currentTime * editState.fps);
  const totalFrames = Math.floor(projectDuration * editState.fps);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-card rounded-xl border border-primary/20 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-display text-sm font-semibold">
              {loadedProject ? loadedProject.name : 'Video Editor'}
            </h3>
            {loadedProject && (
              <Badge variant="outline" className="text-xs bg-primary/10">
                {loadedProject.resolution?.toUpperCase()}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs ml-2">
              {editState.editMode === 'frame' ? 'Frame Mode' : 'Clip Mode'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={editState.editMode === 'clip' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setEditMode('clip')}
            >
              <Layers className="w-3 h-3" />
              Clip
            </Button>
            <Button
              variant={editState.editMode === 'frame' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setEditMode('frame')}
            >
              <Film className="w-3 h-3" />
              Frame
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(editState.zoom * 1.2)}>
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(editState.zoom / 1.2)}>
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 min-h-[200px]">
          <div className="aspect-video bg-background rounded-lg border border-border/50 w-full max-w-2xl flex items-center justify-center relative overflow-hidden">
            {loadedProject ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{loadedProject.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Frame {currentFrame} / {totalFrames || 0}</p>
              </div>
            ) : (
              <div className="text-center">
                <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No project loaded</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Select a project from the portfolio</p>
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 py-3 border-t border-b border-border/50">
          <div className="flex items-center gap-1">
            {editState.editMode === 'frame' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevFrame}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous Frame</TooltipContent>
                </Tooltip>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToFrame(0)}>
              <SkipBack className="w-4 h-4" />
            </Button>
            
            {editState.isPlaying ? (
              <Button variant="default" size="icon" className="h-10 w-10 glow-primary-sm" onClick={pause}>
                <Pause className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="default" size="icon" className="h-10 w-10 glow-primary-sm" onClick={play}>
                <Play className="w-5 h-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToFrame(totalFrames)}>
              <SkipForward className="w-4 h-4" />
            </Button>
            
            {editState.editMode === 'frame' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextFrame}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next Frame</TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="font-mono text-sm text-muted-foreground">
            {formatTime(editState.currentTime)} / {formatTime(projectDuration || 0)}
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!editState.selectedClipId}
                >
                  <Scissors className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Split Clip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!editState.selectedClipId}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-destructive"
                  disabled={!editState.selectedClipId}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col h-48">
          {/* Time Ruler */}
          <div className="h-6 bg-muted/50 border-b border-border/50 flex items-center px-32">
            <div className="flex-1 relative">
              {/* Time markers would go here */}
              <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-muted-foreground font-mono">
                <span>00:00:00</span>
                <span>00:05:00</span>
                <span>00:10:00</span>
                <span>00:15:00</span>
              </div>
            </div>
          </div>

          {/* Tracks */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {tracks.map((track) => (
                <div key={track.id} className="flex border-b border-border/30">
                  {/* Track Header */}
                  <div className="w-32 flex-shrink-0 p-2 bg-muted/30 border-r border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium truncate">{track.name}</span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => toggleTrackMute(track.id)}
                        >
                          {track.muted ? (
                            <VolumeX className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => toggleTrackLock(track.id)}
                        >
                          {track.locked ? (
                            <Lock className="w-3 h-3 text-warning" />
                          ) : (
                            <Unlock className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Track Content */}
                  <div className="flex-1 h-12 bg-muted/10 relative">
                    {track.clips.map((clip) => (
                      <div
                        key={clip.id}
                        className={cn(
                          'absolute top-1 bottom-1 rounded bg-primary/30 border border-primary/50 cursor-pointer transition-colors',
                          editState.selectedClipId === clip.id && 'bg-primary/50 border-primary'
                        )}
                        style={{
                          left: `${(clip.startFrame / (totalFrames || 1)) * 100}%`,
                          width: `${((clip.endFrame - clip.startFrame) / (totalFrames || 1)) * 100}%`,
                          minWidth: '20px',
                        }}
                        onClick={() => selectClip(clip.id)}
                      >
                        <span className="text-xs font-medium px-1 truncate block">
                          {clip.name}
                        </span>
                      </div>
                    ))}

                    {/* Playhead */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                      style={{
                        left: `${(editState.currentTime / (projectDuration || 1)) * 100}%`,
                      }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-destructive rotate-45" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Add Track Button */}
          <div className="h-8 flex items-center px-2 border-t border-border/50">
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => addTrack('video')}>
              <Plus className="w-3 h-3" />
              Add Track
            </Button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
