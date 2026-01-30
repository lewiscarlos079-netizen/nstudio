import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Download, 
  Eye, 
  MoreHorizontal,
  Plus,
  Grid3X3,
  List,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useProjectStore, Project3D } from '@/store/projectStore';

const demoProjects: Partial<Project3D>[] = [
  {
    id: '1',
    name: 'Sci-Fi Corridor',
    description: 'Futuristic corridor environment',
    type: 'model',
    resolution: '4k',
    status: 'completed',
    thumbnail: '',
  },
  {
    id: '2',
    name: 'Character Animation',
    description: 'Walk cycle demo',
    type: 'movie-3d',
    resolution: '1080p',
    status: 'completed',
    thumbnail: '',
  },
  {
    id: '3',
    name: 'Product Visualization',
    description: 'Tech gadget render',
    type: 'model',
    resolution: '4k',
    status: 'rendering',
    renderProgress: 45,
    thumbnail: '',
  },
  {
    id: '4',
    name: 'Game Level',
    description: 'Platformer prototype',
    type: 'game',
    resolution: '1080p',
    status: 'draft',
    thumbnail: '',
  },
];

export default function Portfolio() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { projects } = useProjectStore();
  
  const displayProjects = projects.length > 0 ? projects : demoProjects;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">Portfolio</h1>
              <p className="text-muted-foreground mt-1">Your saved projects and exports</p>
            </div>
            <Button variant="cyber" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 bg-card border-primary/20"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
            
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'space-y-3'
          }>
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group bg-card border-primary/10 hover:border-primary/30 transition-all overflow-hidden">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                        <div className="absolute inset-0 grid-bg opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FolderOpen className="w-12 h-12 text-primary/30" />
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="glass" className="gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button size="sm" variant="cyber" className="gap-1">
                            <Download className="w-3 h-3" />
                            Export
                          </Button>
                        </div>

                        {/* Status Badge */}
                        {project.status === 'rendering' && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/90 text-primary-foreground animate-pulse">
                              Rendering {project.renderProgress}%
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium truncate">{project.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Open</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline" className="text-xs capitalize">
                            {project.type?.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.resolution?.toUpperCase()}
                          </Badge>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <FolderOpen className="w-6 h-6 text-primary/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {project.type?.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.resolution?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
