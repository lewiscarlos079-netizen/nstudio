import { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectStore, Project3D } from '@/store/projectStore';
import { VideoEditor } from '@/components/portfolio/VideoEditor';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectDetailModal } from '@/components/portfolio/ProjectDetailModal';
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
  const [activeTab, setActiveTab] = useState<'projects' | 'editor'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Partial<Project3D> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, deleteProject } = useProjectStore();
  
  const allProjects = projects.length > 0 ? projects : demoProjects;
  
  const filteredProjects = allProjects.filter(project =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Partial<Project3D>) => {
    setSelectedProject(project);
    setActiveTab('editor');
    toast.success(`Opened ${project.name} in editor`);
  };

  const handleExportProject = (project: Partial<Project3D>) => {
    toast.success(`Exporting ${project.name}...`, {
      description: 'Your project will be ready for download shortly.'
    });
  };

  const handleDeleteProject = (project: Partial<Project3D>) => {
    if (project.id) {
      deleteProject(project.id);
      toast.success(`Deleted ${project.name}`);
    }
    setIsModalOpen(false);
  };

  const handleOpenInStudio = () => {
    navigate('/studio');
    setIsModalOpen(false);
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
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'projects' | 'editor')}>
                <TabsList className="bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary/20">
                    <FolderOpen className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="gap-2 data-[state=active]:bg-primary/20">
                    <Scissors className="w-4 h-4" />
                    Editor
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
          ) : (
            <VideoEditor />
          )}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEdit={() => handleEditProject(selectedProject!)}
        onExport={() => handleExportProject(selectedProject!)}
        onDelete={() => handleDeleteProject(selectedProject!)}
        onOpenInStudio={handleOpenInStudio}
      />
    </Layout>
  );
}
