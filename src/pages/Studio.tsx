import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Viewport3D } from '@/components/3d/Viewport3D';
import { ToolPanel } from '@/components/studio/ToolPanel';
import { PropertiesPanel } from '@/components/studio/PropertiesPanel';
import { PreloadedAssets } from '@/components/studio/PreloadedAssets';
import { AIChatPanel } from '@/components/studio/AIChatPanel';
import { CameraRecordingPanel } from '@/components/studio/CameraRecordingPanel';
import { MotionCapturePanel } from '@/components/studio/MotionCapturePanel';
import { ExpandedInventory } from '@/components/studio/ExpandedInventory';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Box, 
  Layers, 
  Image, 
  Settings2, 
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Save,
  Download,
  Camera,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export default function Studio() {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState('model');

  // Auto-save indicator
  const [lastSaved, setLastSaved] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    toast.success('Project saved', {
      description: 'Your project has been saved successfully.',
    });
    setLastSaved(new Date());
  };

  const handleExport = () => {
    toast.info('Export feature', {
      description: 'Export to glTF/GLB coming soon!',
    });
  };

  const timeSinceLastSave = () => {
    const diff = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-b border-primary/10 px-4 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 lg:hidden"
                onClick={() => setShowLeftPanel(!showLeftPanel)}
              >
                {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </Button>
              <div>
                <span className="font-display text-sm">Untitled Project</span>
                <span className="text-xs text-muted-foreground/50 font-mono ml-2">• Saved {timeSinceLastSave()}</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-muted/50 h-9">
              <TabsTrigger value="model" className="gap-2 text-xs h-7">
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Model</span>
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2 text-xs h-7">
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="camera" className="gap-2 text-xs h-7">
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Record</span>
              </TabsTrigger>
              <TabsTrigger value="mocap" className="gap-2 text-xs h-7">
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MoCap</span>
              </TabsTrigger>
              <TabsTrigger value="texture" className="gap-2 text-xs h-7">
                <Image className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Texture</span>
              </TabsTrigger>
              <TabsTrigger value="render" className="gap-2 text-xs h-7">
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Render</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 h-8" onClick={handleSave}>
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-8" onClick={handleExport}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 xl:hidden"
              onClick={() => setShowRightPanel(!showRightPanel)}
            >
              {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">
          {/* Left Panel - Tools */}
          <AnimatePresence>
            {showLeftPanel && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="hidden lg:block"
              >
                <ToolPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center - Content based on tab */}
          <div className="flex-1 min-w-0 flex gap-4">
            {activeTab === 'assets' && (
              <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                <PreloadedAssets />
                <ExpandedInventory />
              </div>
            )}
            {activeTab === 'camera' && (
              <div className="w-80 flex-shrink-0">
                <CameraRecordingPanel />
              </div>
            )}
            {activeTab === 'mocap' && (
              <div className="w-80 flex-shrink-0">
                <MotionCapturePanel />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Viewport3D className="w-full h-full" />
            </div>
          </div>

          {/* Right Panel - Properties */}
          <AnimatePresence>
            {showRightPanel && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="hidden xl:block"
              >
                <PropertiesPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat Button */}
        <motion.div
          className="fixed bottom-4 right-4 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: showAIChat ? 0 : 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg glow-primary"
            onClick={() => setShowAIChat(true)}
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* AI Chat Panel */}
        <AIChatPanel isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
      </div>
    </Layout>
  );
}
