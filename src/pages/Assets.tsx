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
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SketchfabBrowser } from '@/components/assets/SketchfabBrowser';
import { FileUploader } from '@/components/assets/FileUploader';
import { useProjectStore } from '@/store/projectStore';

const assetSources = [
  { id: 'local', label: 'Local' },
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
              <p className="text-muted-foreground mt-1">Manage models, textures, materials and animations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Import from URL
              </Button>
              <Button variant="cyber" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Asset
              </Button>
            </div>
          </div>

          {/* Source Tabs */}
          <Tabs defaultValue="local" className="w-full">
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
                </TabsTrigger>
              ))}
            </TabsList>

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
                          </div>
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
    </Layout>
  );
}
