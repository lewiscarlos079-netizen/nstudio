import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Plus,
  Grid3X3,
  List,
  Search,
  Filter,
  Scissors,
  FolderOpen,
  Sparkles,
  FileUp,
  Trophy,
  Film,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectStore, Project3D } from '@/store/projectStore';
import { VideoEditor } from '@/components/portfolio/VideoEditor';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectDetailModal } from '@/components/portfolio/ProjectDetailModal';
import { ProjectPreviewModal } from '@/components/portfolio/ProjectPreviewModal';
import { ExportModal } from '@/components/portfolio/ExportModal';
import { PDFUploader } from '@/components/studio/PDFUploader';
import { CaptureTools } from '@/components/studio/CaptureTools';
import { useVideoEditorStore } from '@/store/videoEditorStore';
import { ScenePreview3D } from '@/components/portfolio/ScenePreview3D';
import { IntroTrailer3D } from '@/components/3d/IntroScenes3D';
import { toast } from 'sonner';

const demoProjects: Partial<Project3D>[] = [
  {
    id: '1',
    name: 'Sci-Fi Corridor',
    description: 'Futuristic corridor environment with volumetric lighting',
    type: 'model',
    resolution: '4k',
    status: 'completed',
    thumbnail: '',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Character Animation',
    description: 'Realistic walk cycle with motion capture data',
    type: 'movie-3d',
    resolution: '1080p',
    status: 'completed',
    thumbnail: '',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Product Visualization',
    description: 'Tech gadget render with studio lighting setup',
    type: 'model',
    resolution: '4k',
    status: 'rendering',
    renderProgress: 45,
    thumbnail: '',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Game Level',
    description: 'Platformer prototype with dynamic obstacles',
    type: 'game',
    resolution: '1080p',
    status: 'draft',
    thumbnail: '',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '5',
    name: 'Nature Documentary',
    description: 'Wildlife scene with procedural animals',
    type: 'movie-3d',
    resolution: '4k',
    status: 'completed',
    thumbnail: '',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    name: 'Vehicle Showroom',
    description: 'Sports car presentation with reflections',
    type: 'model',
    resolution: '4k',
    status: 'completed',
    thumbnail: '',
    createdAt: new Date('2024-02-05'),
  },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'projects' | 'editor' | 'trailer'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Partial<Project3D> | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [trailerPlaying, setTrailerPlaying] = useState(true);
  const [currentTrailerScene, setCurrentTrailerScene] = useState<'robots-farming' | 'skydiving' | 'surfing' | 'racing' | 'space'>('robots-farming');
  const { projects, deleteProject } = useProjectStore();
  const { loadProject } = useVideoEditorStore();
  
  const allProjects = projects.length > 0 ? projects : demoProjects;
  
  const filteredProjects = allProjects.filter(project =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const handlePreviewProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    setIsPreviewModalOpen(true);
  };

  const handleEditProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    // Load the project into the video editor
    loadProject({
      id: project.id || '',
      name: project.name || 'Untitled',
      description: project.description,
      type: project.type,
      resolution: project.resolution,
    });
    setActiveTab('editor');
    setIsDetailModalOpen(false);
    toast.success(`Loaded ${project.name} in editor`);
  };

  const handleExportProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    setIsExportModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleDeleteProject = (project: Partial<Project3D>) => {
    if (project.id) {
      deleteProject(project.id);
      toast.success(`Deleted ${project.name}`);
    }
    setIsDetailModalOpen(false);
  };

  const handleOpenInStudio = () => {
    if (selectedProject) {
      // Store project info for studio to load
      toast.success(`Opening ${selectedProject.name} in Studio`);
    }
    navigate('/studio');
    setIsDetailModalOpen(false);
  };

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
              <h1 className="font-display text-3xl font-bold gradient-text flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Portfolio
              </h1>
              <p className="text-muted-foreground mt-1">Your creative projects and exports</p>
            </div>
            <div className="flex items-center gap-2">
              <CaptureTools />
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'projects' | 'editor' | 'trailer')}>
                <TabsList className="bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary/20">
                    <FolderOpen className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="gap-2 data-[state=active]:bg-primary/20">
                    <Scissors className="w-4 h-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="trailer" className="gap-2 data-[state=active]:bg-primary/20">
                    <Film className="w-4 h-4" />
                    Trailer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => navigate('/studio')}>
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
          </div>

          {activeTab === 'projects' ? (
            <>
              {/* Toolbar */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-3 flex-1 w-full sm:w-auto">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-card/60 backdrop-blur-sm border-border/40 focus:border-primary/50"
                    />
                  </div>
                  <Button variant="outline" className="gap-2 bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/50">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
                
                <div className="flex gap-1 p-1 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/40">
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
              </motion.div>

              {/* Projects Grid */}
              {filteredProjects.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' 
                  : 'space-y-3'
                }>
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      viewMode={viewMode}
                      onOpen={handleOpenProject}
                      onEdit={handleEditProject}
                      onExport={handleExportProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <FolderOpen className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first project to get started'}
                  </p>
                  <Button onClick={() => navigate('/studio')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Button>
                </motion.div>
              )}
            </>
          ) : activeTab === 'editor' ? (
            <VideoEditor />
          ) : (
            /* Trailer Tab */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Trailer Viewport */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      Platform Trailer
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTrailerPlaying(!trailerPlaying)}
                      >
                        {trailerPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentTrailerScene('robots-farming')}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-background to-muted/50 relative">
                    <Suspense fallback={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    }>
                      <IntroTrailer3D sceneType={currentTrailerScene} isPlaying={trailerPlaying} />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>

              {/* Scene Selection */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { id: 'robots-farming', label: 'Robot Farming', icon: '🤖' },
                  { id: 'skydiving', label: 'Skydiving', icon: '🪂' },
                  { id: 'surfing', label: 'Surfing', icon: '🏄' },
                  { id: 'racing', label: 'Racing', icon: '🏎️' },
                  { id: 'space', label: 'Space', icon: '🚀' },
                ].map(scene => (
                  <Button
                    key={scene.id}
                    variant={currentTrailerScene === scene.id ? 'default' : 'outline'}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setCurrentTrailerScene(scene.id as typeof currentTrailerScene)}
                  >
                    <span className="text-2xl">{scene.icon}</span>
                    <span className="text-xs">{scene.label}</span>
                  </Button>
                ))}
              </div>

              {/* Demo Scenes Grid */}
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Example Scenes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {demoProjects.slice(0, 6).map((project, index) => (
                    <Card key={project.id} className="overflow-hidden group cursor-pointer" onClick={() => handlePreviewProject(project)}>
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
                        <Suspense fallback={null}>
                          <ScenePreview3D sceneIndex={index} projectType={project.type} isPlaying={false} />
                        </Suspense>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <p className="text-white font-medium">{project.name}</p>
                            <p className="text-white/70 text-sm">{project.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onEdit={() => handleEditProject(selectedProject!)}
        onExport={() => handleExportProject(selectedProject!)}
        onDelete={() => handleDeleteProject(selectedProject!)}
        onOpenInStudio={handleOpenInStudio}
        onPreview={() => handlePreviewProject(selectedProject!)}
      />

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={selectedProject}
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      />

      {/* Export Modal */}
      <ExportModal
        project={selectedProject}
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
      />
    </Layout>
  );
}
