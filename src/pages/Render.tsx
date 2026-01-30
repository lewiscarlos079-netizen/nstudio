import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Film, 
  Play, 
  Pause, 
  Settings2,
  Monitor,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const renderQueue = [
  { 
    id: '1', 
    name: 'Hero Scene Animation', 
    type: 'movie-3d',
    resolution: '4k',
    status: 'rendering',
    progress: 67,
    eta: '12 min',
  },
  { 
    id: '2', 
    name: 'Product Showcase', 
    type: 'movie-3d',
    resolution: '1080p',
    status: 'queued',
    progress: 0,
    eta: '~25 min',
  },
  { 
    id: '3', 
    name: 'Character Model', 
    type: 'model',
    resolution: '4k',
    status: 'completed',
    progress: 100,
    eta: null,
  },
];

const statusStyles = {
  rendering: { color: 'text-primary', bg: 'bg-primary/10', icon: Play },
  queued: { color: 'text-warning', bg: 'bg-warning/10', icon: Clock },
  completed: { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle2 },
  failed: { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertCircle },
};

export default function Render() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">Render Queue</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your rendering projects</p>
            </div>
            <Button variant="cyber" className="gap-2">
              <Plus className="w-4 h-4" />
              New Render Job
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Render Queue */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Film className="w-5 h-5 text-primary" />
                    Active Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderQueue.map((job, index) => {
                    const statusInfo = statusStyles[job.status as keyof typeof statusStyles];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-muted/30 border border-primary/10 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{job.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {job.type.replace('-', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {job.resolution.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${statusInfo.bg}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                            <span className={`text-xs font-medium capitalize ${statusInfo.color}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>

                        {job.status === 'rendering' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-mono">{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Estimated time remaining: {job.eta}
                            </p>
                          </div>
                        )}

                        {job.status === 'queued' && (
                          <p className="text-sm text-muted-foreground">
                            Waiting in queue • Est. {job.eta}
                          </p>
                        )}

                        {job.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Preview
                            </Button>
                            <Button size="sm" variant="cyber">
                              Download
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Render Settings */}
            <div className="space-y-4">
              <Card className="bg-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Quick Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Output Resolution</Label>
                    <Select defaultValue="4k">
                      <SelectTrigger className="bg-muted/30 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1080p">1080p Full HD (1920×1080)</SelectItem>
                        <SelectItem value="4k">4K UHD (3840×2160)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Project Type</Label>
                    <Select defaultValue="movie-3d">
                      <SelectTrigger className="bg-muted/30 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="model">3D Model</SelectItem>
                        <SelectItem value="movie-2d">2D Movie</SelectItem>
                        <SelectItem value="movie-3d">3D Movie</SelectItem>
                        <SelectItem value="game">Game Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Output Format</Label>
                    <Select defaultValue="mp4">
                      <SelectTrigger className="bg-muted/30 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="png">PNG Sequence</SelectItem>
                        <SelectItem value="fbx">FBX (Model)</SelectItem>
                        <SelectItem value="gltf">glTF (Model)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Monitor className="w-5 h-5 text-primary" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CPU Usage</span>
                    <span className="font-mono">67%</span>
                  </div>
                  <Progress value={67} className="h-1.5" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GPU Usage</span>
                    <span className="font-mono">84%</span>
                  </div>
                  <Progress value={84} className="h-1.5" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-mono">12.4 GB / 16 GB</span>
                  </div>
                  <Progress value={77} className="h-1.5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
