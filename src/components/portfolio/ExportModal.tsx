import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Film,
  Image,
  FileJson,
  Check,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { Project3D } from '@/store/projectStore';
import { toast } from 'sonner';

interface ExportModalProps {
  project: Partial<Project3D> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = 'mp4' | 'webm' | 'png-sequence' | 'json';

const formatOptions: { value: ExportFormat; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'mp4', label: 'MP4 Video', description: 'Best for sharing and playback', icon: <Film className="w-5 h-5" /> },
  { value: 'webm', label: 'WebM Video', description: 'Web-optimized format', icon: <Film className="w-5 h-5" /> },
  { value: 'png-sequence', label: 'PNG Sequence', description: 'Individual frames for editing', icon: <Image className="w-5 h-5" /> },
  { value: 'json', label: 'Project Data', description: 'Scene data for backup/import', icon: <FileJson className="w-5 h-5" /> },
];

type Resolution = '1080p' | '4k' | '720p';

const resolutionOptions: { value: Resolution; label: string; width: number; height: number }[] = [
  { value: '1080p', label: '1080p (Full HD)', width: 1920, height: 1080 },
  { value: '4k', label: '4K (Ultra HD)', width: 3840, height: 2160 },
  { value: '720p', label: '720p (HD)', width: 1280, height: 720 },
];

export function ExportModal({ project, open, onOpenChange }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [resolution, setResolution] = useState<Resolution>((project?.resolution as Resolution) || '1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsComplete(false);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setIsExporting(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const handleDownload = () => {
    // Create a mock download
    const filename = `${project?.name?.replace(/\s+/g, '_')}_${resolution}.${format === 'png-sequence' ? 'zip' : format}`;
    
    // Create mock data based on format
    let content: string;
    let mimeType: string;
    
    if (format === 'json') {
      content = JSON.stringify({
        name: project?.name,
        description: project?.description,
        type: project?.type,
        resolution,
        exportedAt: new Date().toISOString(),
        scenes: [],
        assets: [],
      }, null, 2);
      mimeType = 'application/json';
    } else {
      // For video/image formats, we'd normally have actual data
      // Here we create a placeholder
      content = `Export placeholder for ${project?.name}`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = format === 'json' ? filename : `${filename.split('.')[0]}_placeholder.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${project?.name}`, {
      description: `Format: ${format.toUpperCase()}, Resolution: ${resolution}`
    });
    
    onOpenChange(false);
    setIsComplete(false);
    setExportProgress(0);
  };

  const handleClose = () => {
    if (!isExporting) {
      onOpenChange(false);
      setIsComplete(false);
      setExportProgress(0);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display">
            <Download className="w-5 h-5 text-primary" />
            Export Project
          </DialogTitle>
        </DialogHeader>

        {!isExporting && !isComplete ? (
          <div className="space-y-6 py-4">
            {/* Project info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/20">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.description}</p>
              </div>
            </div>

            {/* Format selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Format</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                <div className="grid gap-2">
                  {formatOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        format === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={option.value} className="sr-only" />
                      <div className={`p-2 rounded-lg ${format === option.value ? 'bg-primary/20' : 'bg-muted'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      {format === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Resolution selection */}
            {format !== 'json' && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Resolution</Label>
                <RadioGroup value={resolution} onValueChange={(v) => setResolution(v as Resolution)}>
                  <div className="flex gap-2">
                    {resolutionOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex-1 p-3 rounded-lg border cursor-pointer transition-all text-center ${
                          resolution === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.width}×{option.height}</p>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-6">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-medium mb-1">Export Complete!</h3>
                <p className="text-sm text-muted-foreground">Your project is ready to download</p>
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Exporting...</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we prepare your file</p>
                </div>
                <div className="space-y-2">
                  <Progress value={Math.min(exportProgress, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(Math.min(exportProgress, 100))}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {isComplete ? (
            <Button onClick={handleDownload} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download File
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Start Export
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
