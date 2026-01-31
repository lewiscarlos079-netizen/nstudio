import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Layers, 
  Film, 
  FolderOpen, 
  Sparkles, 
  ArrowRight,
  Cpu,
  Globe,
  Zap,
  Download,
  Play
} from 'lucide-react';
import { IntroVideo } from '@/components/landing/IntroVideo';
import { StoragePrompt, useStoragePrompt } from '@/components/landing/StoragePrompt';
import { CommunitySpotlight } from '@/components/landing/CommunitySpotlight';

const INTRO_SHOWN_KEY = 'nexus_intro_shown';

const features = [
  {
    icon: Box,
    title: '3D Modeling Studio',
    description: 'Create and edit 3D models with professional-grade tools and real-time preview.',
    href: '/studio',
    preview: true,
  },
  {
    icon: Layers,
    title: 'Asset Library',
    description: 'Manage your assets and import from Unity Store, Google, and Reddit.',
    href: '/assets',
    preview: true,
  },
  {
    icon: Film,
    title: 'Render Engine',
    description: 'Export your projects in 1080p or 4K UHD with GPU-accelerated rendering.',
    href: '/render',
    preview: true,
  },
  {
    icon: FolderOpen,
    title: 'Portfolio',
    description: 'Save, organize, and download your creations for use on any hardware.',
    href: '/portfolio',
    preview: true,
  },
];

const stats = [
  { label: 'Active Projects', value: '4' },
  { label: 'Render Jobs', value: '2' },
  { label: 'Assets', value: '12' },
];

export default function Index() {
  const [showIntro, setShowIntro] = useState(false);
  const { showPrompt: showStoragePrompt, dismissPrompt } = useStoragePrompt();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_SHOWN_KEY);
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleCloseIntro = () => {
    localStorage.setItem(INTRO_SHOWN_KEY, 'true');
    setShowIntro(false);
  };

  return (
    <>
      {/* Intro Video Modal */}
      <AnimatePresence>
        {showIntro && <IntroVideo onClose={handleCloseIntro} />}
      </AnimatePresence>

      {/* Storage Prompt Modal */}
      <AnimatePresence>
        {showStoragePrompt && !showIntro && <StoragePrompt onDismiss={dismissPrompt} />}
      </AnimatePresence>

      <Layout>
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-secondary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered 3D Design Platform</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">NEXUS</span>
              <br />
              <span className="text-foreground">STUDIO</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Design, render, and export professional 3D models with AI-assisted tools. 
              Create stunning visuals for games, films, and visualizations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/studio">
                <Button variant="cyber" size="xl" className="gap-2 group">
                  <Sparkles className="w-5 h-5" />
                  Launch Studio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="xl" className="gap-2">
                  <FolderOpen className="w-5 h-5" />
                  View Portfolio
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8 mt-12"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <Link to={feature.href}>
                  <div className="group h-full p-6 rounded-xl glass border border-primary/10 hover:border-primary/30 transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      {feature.preview && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            // Show preview/demo trailer
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Capabilities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-8">Platform Capabilities</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-sm">GPU Accelerated</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">Real-time Preview</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm">Cloud Rendering</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-sm">Export to Hardware</span>
              </div>
            </div>
          </motion.div>

          {/* External Resources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Powered by industry-leading technology</p>
            <div className="flex items-center justify-center gap-6">
              <a 
                href="https://unity.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-display text-lg">Unity</span>
              </a>
              <span className="text-muted-foreground/30">|</span>
              <a 
                href="https://threejs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-display text-lg">Three.js</span>
              </a>
              <span className="text-muted-foreground/30">|</span>
              <a 
                href="https://www.blender.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-display text-lg">Blender</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Community Spotlight - Featured Creations */}
      <CommunitySpotlight position="bottom" showVoting={true} maxItems={5} />
    </Layout>
    </>
  );
}
