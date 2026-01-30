import { Layout } from '@/components/layout/Layout';
import { Viewport3D } from '@/components/3d/Viewport3D';
import { ToolPanel } from '@/components/studio/ToolPanel';
import { PropertiesPanel } from '@/components/studio/PropertiesPanel';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Layers, Image, Settings2 } from 'lucide-react';

export default function Studio() {
  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-b border-primary/10 px-4 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-muted-foreground">Untitled Project</span>
            <span className="text-xs text-muted-foreground/50 font-mono">• Last saved 2 min ago</span>
          </div>
          <Tabs defaultValue="model" className="w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="model" className="gap-2 text-xs">
                <Box className="w-3.5 h-3.5" />
                Model
              </TabsTrigger>
              <TabsTrigger value="scene" className="gap-2 text-xs">
                <Layers className="w-3.5 h-3.5" />
                Scene
              </TabsTrigger>
              <TabsTrigger value="texture" className="gap-2 text-xs">
                <Image className="w-3.5 h-3.5" />
                Texture
              </TabsTrigger>
              <TabsTrigger value="render" className="gap-2 text-xs">
                <Settings2 className="w-3.5 h-3.5" />
                Render
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">
          {/* Left Panel - Tools */}
          <div className="hidden lg:block">
            <ToolPanel />
          </div>

          {/* Center - 3D Viewport */}
          <div className="flex-1 min-w-0">
            <Viewport3D className="w-full h-full" />
          </div>

          {/* Right Panel - Properties */}
          <div className="hidden xl:block">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
}
