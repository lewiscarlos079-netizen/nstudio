import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Video, 
  Square, 
  Download,
  Settings2,
  Image,
  Film,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface CaptureToolsProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onCapture?: (dataUrl: string, type: 'screenshot' | 'frame') => void;
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
}

export function CaptureTools({ 
  canvasRef, 
  onCapture,
  onRecordingStart,
  onRecordingStop 
}: CaptureToolsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [settings, setSettings] = useState({
    format: 'png' as 'png' | 'jpg' | 'webp',
    quality: 95,
    includeUI: false,
    resolution: '1080p' as '720p' | '1080p' | '4k',
    fps: 30,
    motionBlur: false,
    hdr: false,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const captureScreenshot = useCallback(() => {
    // Try to find the canvas in the DOM if not provided
    const canvas = canvasRef?.current ?? document.querySelector('canvas');
    
    if (!canvas) {
      toast.error('No canvas found to capture');
      return;
    }
    
    try {
      const mimeType = `image/${settings.format}`;
      const quality = settings.quality / 100;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `capture_${Date.now()}.${settings.format}`;
      link.href = dataUrl;
      link.click();
      
      onCapture?.(dataUrl, 'screenshot');
      toast.success('Screenshot captured!', {
        description: `Saved as ${settings.format.toUpperCase()} (${settings.quality}% quality)`
      });
    } catch (error) {
      toast.error('Failed to capture screenshot');
      console.error(error);
    }
  }, [canvasRef, settings, onCapture]);
  
  const startRecording = useCallback(async () => {
    const canvas = canvasRef?.current ?? document.querySelector('canvas');
    
    if (!canvas) {
      toast.error('No canvas found to record');
      return;
    }
    
    try {
      const stream = canvas.captureStream(settings.fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: settings.resolution === '4k' ? 20000000 : 
                           settings.resolution === '1080p' ? 8000000 : 4000000,
      });
      
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `recording_${Date.now()}.webm`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        onRecordingStop?.(blob);
        toast.success('Recording saved!', {
          description: `${recordingTime}s video at ${settings.fps}fps`
        });
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
      
      toast.success('Recording started!');
    } catch (error) {
      toast.error('Failed to start recording');
      console.error(error);
    }
  }, [canvasRef, settings, onRecordingStart, onRecordingStop, recordingTime]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Screenshot Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={captureScreenshot}
        className="gap-2"
        disabled={isRecording}
      >
        <Camera className="w-4 h-4" />
        Screenshot
      </Button>
      
      {/* Record Button */}
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        className="gap-2"
      >
        {isRecording ? (
          <>
            <Square className="w-3 h-3 fill-current" />
            Stop ({formatTime(recordingTime)})
          </>
        ) : (
          <>
            <Video className="w-4 h-4" />
            Record
          </>
        )}
      </Button>
      
      {/* Recording indicator */}
      {isRecording && (
        <Badge variant="destructive" className="animate-pulse gap-1">
          <span className="w-2 h-2 bg-white rounded-full" />
          REC
        </Badge>
      )}
      
      {/* Settings Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings2 className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div className="font-medium flex items-center gap-2">
              <Film className="w-4 h-4" />
              Capture Settings
            </div>
            
            <Separator />
            
            {/* Screenshot Settings */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">SCREENSHOT</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Format</Label>
                <div className="flex gap-1">
                  {(['png', 'jpg', 'webp'] as const).map(fmt => (
                    <Button
                      key={fmt}
                      variant={settings.format === fmt ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSettings(s => ({ ...s, format: fmt }))}
                    >
                      {fmt.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Quality</Label>
                  <span className="text-xs text-muted-foreground">{settings.quality}%</span>
                </div>
                <Slider
                  value={[settings.quality]}
                  onValueChange={([v]) => setSettings(s => ({ ...s, quality: v }))}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Recording Settings */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">RECORDING</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Resolution</Label>
                <div className="flex gap-1">
                  {(['720p', '1080p', '4k'] as const).map(res => (
                    <Button
                      key={res}
                      variant={settings.resolution === res ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSettings(s => ({ ...s, resolution: res }))}
                    >
                      {res}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">FPS</Label>
                  <span className="text-xs text-muted-foreground">{settings.fps}</span>
                </div>
                <Slider
                  value={[settings.fps]}
                  onValueChange={([v]) => setSettings(s => ({ ...s, fps: v }))}
                  min={15}
                  max={60}
                  step={5}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Effects */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">EFFECTS</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Motion Blur</Label>
                <Switch
                  checked={settings.motionBlur}
                  onCheckedChange={(v) => setSettings(s => ({ ...s, motionBlur: v }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">HDR</Label>
                <Switch
                  checked={settings.hdr}
                  onCheckedChange={(v) => setSettings(s => ({ ...s, hdr: v }))}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
