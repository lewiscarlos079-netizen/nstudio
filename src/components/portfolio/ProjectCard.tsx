import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Download, 
  Eye, 
  MoreHorizontal,
  Scissors,
  Play,
  Clock,
  Layers
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project3D } from '@/store/projectStore';

interface ProjectCardProps {
  project: Partial<Project3D>;
  index: number;
  viewMode: 'grid' | 'list';
  onOpen: (project: Partial<Project3D>) => void;
  onEdit: (project: Partial<Project3D>) => void;
  onExport: (project: Partial<Project3D>) => void;
  onDelete: (project: Partial<Project3D>) => void;
}

export function ProjectCard({ 
  project, 
  index, 
  viewMode, 
  onOpen, 
  onEdit,
  onExport,
  onDelete 
}: ProjectCardProps) {
  const getTypeIcon = () => {
    switch (project.type) {
      case 'movie-3d':
      case 'movie-2d':
        return <Play className="w-5 h-5" />;
      case 'game':
        return <Layers className="w-5 h-5" />;
      default:
        return <FolderOpen className="w-5 h-5" />;
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

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card 
          className="group bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 cursor-pointer overflow-hidden"
          onClick={() => onOpen(project)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-sm text-muted-foreground truncate mt-0.5">{project.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className={`text-xs capitalize ${getStatusColor()}`}>
                  {project.status}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize bg-secondary/10 text-secondary border-secondary/30">
                  {project.type?.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-muted/50">
                  {project.resolution?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpen(project); }}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                <Scissors className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); onExport(project); }}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        className="group bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={() => onOpen(project)}
      >
        <div className="aspect-video bg-gradient-to-br from-muted/80 via-card to-muted/40 relative overflow-hidden">
          {/* Organic pattern background */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id={`organic-${project.id}`} patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="10" cy="10" r="1" fill="currentColor" className="text-primary/40" />
                  <circle cx="5" cy="5" r="0.5" fill="currentColor" className="text-secondary/30" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill={`url(#organic-${project.id})`} />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              {getTypeIcon()}
            </motion.div>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-2">
            <Button size="sm" variant="secondary" className="gap-1 shadow-lg" onClick={(e) => { e.stopPropagation(); onOpen(project); }}>
              <Eye className="w-3 h-3" />
              Open
            </Button>
            <Button size="sm" variant="default" className="gap-1 shadow-lg" onClick={(e) => { e.stopPropagation(); onExport(project); }}>
              <Download className="w-3 h-3" />
              Export
            </Button>
          </div>

          {/* Status badge */}
          {project.status === 'rendering' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-warning/90 text-warning-foreground animate-pulse gap-1">
                <Clock className="w-3 h-3" />
                {project.renderProgress}%
              </Badge>
            </div>
          )}
          
          {project.status === 'completed' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-success/90 text-success-foreground">
                Complete
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {project.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={() => onOpen(project)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Scissors className="w-4 h-4 mr-2" />
                  Edit Video
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport(project)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(project)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className="text-xs capitalize bg-secondary/10 text-secondary border-secondary/30">
              {project.type?.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs bg-muted/50">
              {project.resolution?.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
