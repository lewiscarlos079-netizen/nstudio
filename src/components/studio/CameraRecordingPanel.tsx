import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Camera,
  Video,
  Plus,
  Trash2,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Crosshair,
} from 'lucide-react';
import { useCameraStore, CameraPoint } from '@/store/cameraStore';
import { useThree } from '@react-three/fiber';
import { toast } from 'sonner';

interface CameraRecordingPanelProps {
  onCaptureCameraPosition?: () => { position: [number, number, number]; target: [number, number, number] };
}

export function CameraRecordingPanel({ onCaptureCameraPosition }: CameraRecordingPanelProps) {
  const {
    cameraPoints,
    recording,
    addCameraPoint,
    removeCameraPoint,
    updateCameraPoint,
    reorderCameraPoints,
    startRecording,
    stopRecording,
    startPreview,
    stopPreview,
    setFps,
    setResolution,
    nextPoint,
    prevPoint,
    goToPoint,
  } = useCameraStore();

  const handleAddPoint = () => {
    // Default camera point - in real usage, this would capture current camera position
    const newPoint: Omit<CameraPoint, 'id'> = {
      name: `Point ${cameraPoints.length + 1}`,
      position: [4, 3, 4],
      target: [0, 0, 0],
      fov: 50,
      duration: 2,
      easing: 'easeInOut',
    };
    
    addCameraPoint(newPoint);
    toast.success('Camera point added');
  };

  const handleStartRecording = () => {
    if (cameraPoints.length < 2) {
      toast.error('Add at least 2 camera points to record');
      return;
    }
    startRecording();
    toast.success('Recording started');
  };

  const handleStopRecording = () => {
    stopRecording();
    toast.success('Recording saved to portfolio');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-xl p-4 w-80 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold">Camera Recording</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {cameraPoints.length} points
        </Badge>
      </div>

      <Separator className="bg-border/50" />

      {/* Recording Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">FPS</Label>
            <Select
              value={String(recording.fps)}
              onValueChange={(v) => setFps(Number(v))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 fps</SelectItem>
                <SelectItem value="30">30 fps</SelectItem>
                <SelectItem value="60">60 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Resolution</Label>
            <Select
              value={recording.resolution}
              onValueChange={(v) => setResolution(v as any)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="4k">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={prevPoint}
            disabled={cameraPoints.length === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          {recording.isPreviewing ? (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={stopPreview}
            >
              <Pause className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={startPreview}
              disabled={cameraPoints.length < 2}
            >
              <Play className="w-5 h-5" />
            </Button>
          )}
          
          {recording.isRecording ? (
            <Button
              variant="destructive"
              size="icon"
              className="h-10 w-10"
              onClick={handleStopRecording}
            >
              <Square className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 glow-primary-sm"
              onClick={handleStartRecording}
              disabled={cameraPoints.length < 2}
            >
              <Video className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextPoint}
            disabled={cameraPoints.length === 0}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {recording.isRecording && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs text-destructive font-mono">
              Recording... {recording.recordedFrames} frames
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* Camera Points List */}
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Camera Points</Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={handleAddPoint}
        >
          <Plus className="w-3 h-3" />
          Add Point
        </Button>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2">
          {cameraPoints.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">
              <Crosshair className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No camera points yet</p>
              <p>Add points to create a camera path</p>
            </div>
          ) : (
            cameraPoints.map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded-lg border transition-colors ${
                  recording.currentPointIndex === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => index > 0 && reorderCameraPoints(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() =>
                        index < cameraPoints.length - 1 &&
                        reorderCameraPoints(index, index + 1)
                      }
                      disabled={index === cameraPoints.length - 1}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Input
                      value={point.name}
                      onChange={(e) =>
                        updateCameraPoint(point.id, { name: e.target.value })
                      }
                      className="h-6 text-xs bg-transparent border-none p-0 font-medium"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{point.duration}s</span>
                      <span>•</span>
                      <span>{point.easing}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCameraPoint(point.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="text-xs text-muted-foreground/60 text-center">
        Create camera paths for cinematic recordings
      </div>
    </motion.div>
  );
}
