import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Upload, 
  Box, 
  Image, 
  Palette, 
  Play,
  MoreHorizontal,
  ExternalLink,
  Download,
  RefreshCw,
  Pencil,
  FileCode,
  User,
  Mail,
  Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SketchfabBrowser } from '@/components/assets/SketchfabBrowser';
import { FileUploader } from '@/components/assets/FileUploader';
import { ModelThumbnail3D } from '@/components/assets/ModelThumbnail3D';
import { ModelEditModal } from '@/components/assets/ModelEditModal';
import { BlenderExportModal } from '@/components/assets/BlenderExportModal';
import { useProjectStore } from '@/store/projectStore';
import { useModelAssets, useRefreshModels, detectHardwareTier, ModelAsset } from '@/hooks/useModelAssets';
import { toast } from 'sonner';

const assetSources = [
  { id: 'local', label: 'Local' },
  { id: 'models', label: '3D Models' },
  { id: 'upload', label: 'Upload' },
  { id: 'sketchfab', label: 'Sketchfab' },
  { id: 'unity', label: 'Unity Store' },
];

const typeIcons = {
  model: Box,
  material: Palette,
  texture: Image,
  animation: Play,
};

export default function Assets() {
  const assets = useProjectStore((s) => s.assets);
  const localAssets = assets.filter((a) => a.source === 'local');
  
  // Fetch 3D models from database
  const { data: modelAssets, isLoading: modelsLoading } = useModelAssets();
  const refreshModels = useRefreshModels();
  const hardwareTier = detectHardwareTier();
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelAsset | null>(null);
  
  // Blender export modal state
  const [blenderExportOpen, setBlenderExportOpen] = useState(false);
  const [exportModel, setExportModel] = useState<ModelAsset | null>(null);

  const handleEditModel = (model: ModelAsset) => {
    setSelectedModel(model);
    setEditModalOpen(true);
  };
  
  const handleBlenderExport = (model: ModelAsset) => {
    setExportModel(model);
    setBlenderExportOpen(true);
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
              <h1 className="font-display text-3xl font-bold gradient-text">Asset Library</h1>
              <p className="text-muted-foreground mt-1">
                Manage models, textures, materials and animations
                <Badge variant="outline" className="ml-2 text-xs">
                  Hardware: {hardwareTier.toUpperCase()}
                </Badge>
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  const url = window.prompt('Enter model URL (Sketchfab, GitHub, etc.):');
                  if (url) {
                    // Extract name from URL
                    const urlName = url.split('/').pop()?.split('?')[0] || 'Imported Model';
                    useProjectStore.getState().addAsset({
                      name: urlName.replace(/[-_]/g, ' '),
                      type: 'model',
                      source: url.includes('sketchfab') ? 'sketchfab' : 'local',
                      thumbnail: '',
                      developer: {
                        name: 'External Import',
                        website: url,
                      }
                    });
                    toast.success(`Imported: ${urlName}`);
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Import from URL
              </Button>
              <Button 
                variant="cyber" 
                className="gap-2"
                onClick={() => {
                  // Switch to upload tab
                  const uploadTab = document.querySelector('[value="upload"]') as HTMLButtonElement;
                  uploadTab?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Upload Asset
              </Button>
            </div>
          </div>

          {/* Source Tabs */}
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="bg-card border border-primary/20 p-1">
              {assetSources.map((source) => (
                <TabsTrigger 
                  key={source.id} 
                  value={source.id}
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {source.label}
                  {source.id === 'local' && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {localAssets.length}
                    </Badge>
                  )}
                  {source.id === 'models' && modelAssets && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {modelAssets.length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 3D Models Tab */}
            <TabsContent value="models" className="mt-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search 3D models..." 
                    className="pl-10 bg-card border-primary/20"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => refreshModels.mutate(undefined)}
                  disabled={refreshModels.isPending}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshModels.isPending ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Models Grid */}
              {modelsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <Card key={i} className="bg-card border-primary/10 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-muted/50" />
                      <CardContent className="p-3">
                        <div className="h-4 bg-muted/50 rounded mb-2" />
                        <div className="h-3 bg-muted/30 rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {modelAssets?.map((model, index) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="group bg-card border-primary/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
                        <div className="aspect-square bg-gradient-to-b from-muted/30 to-muted/60 relative">
                          {/* 3D Model Preview */}
                          <ModelThumbnail3D modelId={model.model_id} />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="glass" 
                                className="h-8 gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditModel(model);
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="glass" 
                                className="h-8 gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBlenderExport(model);
                                }}
                              >
                                <FileCode className="w-3 h-3" />
                                Blender
                              </Button>
                              <Button size="sm" variant="glass" className="h-8">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium text-sm truncate">{model.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs capitalize">
                              {model.category}
                            </Badge>
                            {model.has_animations && (
                              <Badge variant="secondary" className="text-xs">
                                {model.animation_count} anim
                              </Badge>
                            )}
                            {model.pbr_enabled && (
                              <Badge variant="secondary" className="text-xs">
                                PBR
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(model.polygon_count_low || 0).toLocaleString()} - {(model.polygon_count_high || 0).toLocaleString()} polys
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {(!modelAssets || modelAssets.length === 0) && (
                    <div className="col-span-full text-center py-16">
                      <Box className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-display text-xl font-semibold mb-2">No 3D Models</h3>
                      <p className="text-muted-foreground mb-4">Click Refresh to load models from the library</p>
                      <Button 
                        variant="cyber" 
                        onClick={() => refreshModels.mutate(undefined)}
                        disabled={refreshModels.isPending}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshModels.isPending ? 'animate-spin' : ''}`} />
                        Load Models
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="local" className="mt-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search assets..." 
                    className="pl-10 bg-card border-primary/20"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {localAssets.map((asset, index) => {
                  const Icon = typeIcons[asset.type as keyof typeof typeIcons] || Box;
                  return (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group bg-card border-primary/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
                        <div className="aspect-square bg-muted/50 flex items-center justify-center relative">
                          <Icon className="w-12 h-12 text-muted-foreground/50" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="glass" className="h-8">
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="glass" className="h-8">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium text-sm truncate">{asset.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {asset.type}
                            </Badge>
                            {asset.fileFormat && (
                              <Badge variant="secondary" className="text-xs uppercase">
                                {asset.fileFormat}
                              </Badge>
                            )}
                          </div>
                          {asset.developer && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground cursor-help">
                                    <User className="w-3 h-3" />
                                    <span className="truncate">{asset.developer.name}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-medium">{asset.developer.name}</p>
                                    {asset.developer.email && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <Mail className="w-3 h-3" />
                                        {asset.developer.email}
                                      </div>
                                    )}
                                    {asset.developer.website && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <Globe className="w-3 h-3" />
                                        {asset.developer.website}
                                      </div>
                                    )}
                                    {asset.developer.license && (
                                      <p className="text-xs text-muted-foreground">
                                        License: {asset.developer.license}
                                      </p>
                                    )}
                                    {asset.developer.attribution && (
                                      <p className="text-xs italic">
                                        {asset.developer.attribution}
                                      </p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {localAssets.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <Box className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No Local Assets</h3>
                    <p className="text-muted-foreground">Upload files or import from Sketchfab to get started</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <FileUploader />
            </TabsContent>

            <TabsContent value="sketchfab" className="mt-6">
              <SketchfabBrowser />
            </TabsContent>

            <TabsContent value="unity" className="mt-6">
              <div className="text-center py-16">
                <Box className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Unity Asset Store</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Browse and import assets directly from the Unity Asset Store
                </p>
                <Button variant="cyber" asChild>
                  <a href="https://assetstore.unity.com/" target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Unity Store
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Edit Modal */}
      <ModelEditModal 
        model={selectedModel}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      
      {/* Blender Export Modal */}
      <BlenderExportModal
        model={exportModel}
        open={blenderExportOpen}
        onOpenChange={setBlenderExportOpen}
      />
    </Layout>
  );
}
