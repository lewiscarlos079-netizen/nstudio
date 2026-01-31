import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Scissors,
  Play,
  Trash2,
  Calendar,
  Film,
  Monitor,
  FolderOpen,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Project3D } from '@/store/projectStore';
import { format } from 'date-fns';

interface ProjectDetailModalProps {
  project: Partial<Project3D> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onExport: () => void;
  onDelete: () => void;
  onOpenInStudio: () => void;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onEdit,
  onExport,
  onDelete,
  onOpenInStudio
}: ProjectDetailModalProps) {
  if (!project) return null;

  const getTypeIcon = () => {
    switch (project.type) {
      case 'movie-3d':
      case 'movie-2d':
        return <Film className="w-6 h-6 text-primary" />;
      case 'game':
        return <Layers className="w-6 h-6 text-primary" />;
      default:
        return <FolderOpen className="w-6 h-6 text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30';
      case 'rendering':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl">
            {getTypeIcon()}
            {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview area */}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-muted via-card to-muted/60 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="detail-pattern" patternUnits="userSpaceOnUse" width="15" height="15">
                    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" className="text-primary/30" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#detail-pattern)" />
              </svg>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm"
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  {getTypeIcon()}
                </div>
              </motion.div>
            </div>

            {/* Play button overlay for movies */}
            {(project.type === 'movie-2d' || project.type === 'movie-3d') && (
              <Button
                size="lg"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 shadow-xl"
                onClick={onOpenInStudio}
              >
                <Play className="w-5 h-5" />
                Play Preview
              </Button>
            )}
          </div>

          {/* Project info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
              <p className="text-sm text-foreground">{project.description || 'No description'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <Badge className={getStatusColor()}>
                {project.status}
                {project.status === 'rendering' && ` (${project.renderProgress}%)`}
              </Badge>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Monitor className="w-4 h-4" />
              <span>{project.resolution?.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Film className="w-4 h-4" />
              <span className="capitalize">{project.type?.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {project.createdAt 
                  ? format(new Date(project.createdAt), 'MMM d, yyyy')
                  : 'Unknown'}
              </span>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button className="flex-1 gap-2" onClick={onOpenInStudio}>
              <ExternalLink className="w-4 h-4" />
              Open in Studio
            </Button>
            <Button variant="secondary" className="flex-1 gap-2" onClick={onEdit}>
              <Scissors className="w-4 h-4" />
              Edit Video
            </Button>
            <Button variant="outline" className="gap-2" onClick={onExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
