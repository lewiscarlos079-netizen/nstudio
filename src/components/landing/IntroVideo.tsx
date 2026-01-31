import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X, Crown, Code, Volume2, VolumeX, Camera, RotateCcw, Settings2 } from 'lucide-react';
import { IntroTrailer3D, IntroSceneType } from '@/components/3d/IntroScenes3D';
import { CaptureTools } from '@/components/studio/CaptureTools';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface IntroVideoProps {
  onClose: () => void;
}

interface Scene {
  id: IntroSceneType;
  title: string;
  subtitle: string;
  bgGradient: string;
  duration: number;
}

interface TrailerSettings {
  motionBlur: boolean;
  hdr: boolean;
  bloomIntensity: number;
  seamlessTransitions: boolean;
}

const scenes: Scene[] = [
  {
    id: 'robots-farming',
    title: 'Automated Worlds',
    subtitle: 'Create intelligent systems and AI-driven experiences',
    bgGradient: 'from-emerald-950 via-green-900/50 to-emerald-950',
    duration: 3500,
  },
  {
    id: 'skydiving',
    title: 'Extreme Action',
    subtitle: 'Capture breathtaking aerial cinematics with cloth physics',
    bgGradient: 'from-sky-950 via-blue-900/50 to-cyan-950',
    duration: 3500,
  },
  {
    id: 'surfing',
    title: 'Dynamic Water',
    subtitle: 'Flowing streams, waterfalls, and ocean wave systems',
    bgGradient: 'from-teal-950 via-cyan-900/50 to-blue-950',
    duration: 3500,
  },
  {
    id: 'racing',
    title: 'High Performance',
    subtitle: 'GPU-accelerated rendering for 4K UHD at 144Hz',
    bgGradient: 'from-slate-950 via-zinc-900/50 to-neutral-950',
    duration: 3500,
  },
  {
    id: 'space',
    title: 'Limitless Creativity',
    subtitle: 'Build entire universes with procedural generation',
    bgGradient: 'from-violet-950 via-purple-900/50 to-indigo-950',
    duration: 4000,
  },
];

export function IntroVideo({ onClose }: IntroVideoProps) {
  const [showCTAs, setShowCTAs] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const [trailerSettings, setTrailerSettings] = useState<TrailerSettings>({
    motionBlur: true,
    hdr: true,
    bloomIntensity: 1.5,
    seamlessTransitions: true,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Seamless scene transitions with cross-fade
  const [nextSceneIndex, setNextSceneIndex] = useState<number | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const currentScene = scenes[currentSceneIndex];

  // Slower scene transitions
  useEffect(() => {
    const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(newProgress, 100));

      if (newProgress >= 100) {
        setShowCTAs(true);
        clearInterval(progressInterval);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (showCTAs) return;

    const sceneTimer = setTimeout(() => {
      if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      }
    }, currentScene.duration);

    return () => clearTimeout(sceneTimer);
  }, [currentSceneIndex, showCTAs, currentScene.duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
    >
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* 3D Scene Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Gradient overlay for depth */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} opacity-40 z-10 pointer-events-none`} />
            
            {/* 3D Rendered Scene */}
            <div className="absolute inset-0">
              <Suspense fallback={
                <div className={`w-full h-full bg-gradient-to-br ${currentScene.bgGradient}`} />
              }>
                <IntroTrailer3D 
                  sceneType={currentScene.id} 
                  isPlaying={!showCTAs}
                />
              </Suspense>
            </div>

            {/* Subtle vignette effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 z-10 pointer-events-none" />
            
            {/* Film grain overlay for cinematic feel */}
            <div 
              className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Scene Content */}
        <AnimatePresence mode="wait">
          {!showCTAs ? (
            <motion.div
              key={`scene-${currentScene.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 text-center px-8"
            >
              {/* Scene Title - now overlaid on 3D scene */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl"
              >
                <span className="bg-gradient-to-r from-violet-300 via-primary to-secondary bg-clip-text text-transparent">
                  {currentScene.title}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto"
              >
                {currentScene.subtitle}
              </motion.p>

              {/* Scene Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center gap-2 mt-10"
              >
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSceneIndex 
                        ? 'w-8 bg-primary' 
                        : index < currentSceneIndex 
                          ? 'bg-primary/50' 
                          : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="ctas"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20 text-center px-8 max-w-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-6 drop-shadow-lg"
              >
                🎬
              </motion.div>
              
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                  Ready to Create?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join thousands of creators building amazing 3D experiences
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Club Subscription CTA */}
                <Link to="/subscription" onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 cursor-pointer group"
                  >
                    <Crown className="w-14 h-14 text-amber-400 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold mb-2 text-amber-300">
                      Join the Club
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Earn bonus points, vote on new features, exclusive assets & models
                    </p>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black gap-2 w-full">
                      <Crown className="w-4 h-4" />
                      Get Premium Access
                    </Button>
                  </motion.div>
                </Link>

                {/* Developer Tier CTA */}
                <Link to="/studio" onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 cursor-pointer group"
                  >
                    <Code className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold mb-2 text-emerald-300">
                      Developer Program
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create & sell assets, access SDK, monetize your work
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-black gap-2 w-full">
                      <Code className="w-4 h-4" />
                      Start Creating
                    </Button>
                  </motion.div>
                </Link>
              </div>

              <Button variant="ghost" onClick={onClose} className="text-muted-foreground text-lg">
                Skip for now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
              className="h-full bg-gradient-to-r from-violet-500 via-amber-400 to-emerald-500"
            />
          </div>
          <p className="text-xs text-muted-foreground/50 text-center mt-3">
            {!showCTAs && `${currentSceneIndex + 1} / ${scenes.length} • ${currentScene.title}`}
          </p>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {/* Capture Tools */}
          <CaptureTools />
          
          {/* Trailer Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings2 className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4">
                <div className="font-medium">Trailer Settings</div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Motion Blur</Label>
                  <Switch
                    checked={trailerSettings.motionBlur}
                    onCheckedChange={(v) => setTrailerSettings(s => ({ ...s, motionBlur: v }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">HDR Mode</Label>
                  <Switch
                    checked={trailerSettings.hdr}
                    onCheckedChange={(v) => setTrailerSettings(s => ({ ...s, hdr: v }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Seamless Transitions</Label>
                  <Switch
                    checked={trailerSettings.seamlessTransitions}
                    onCheckedChange={(v) => setTrailerSettings(s => ({ ...s, seamlessTransitions: v }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Bloom</Label>
                    <span className="text-xs text-muted-foreground">{trailerSettings.bloomIntensity.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[trailerSettings.bloomIntensity]}
                    onValueChange={([v]) => setTrailerSettings(s => ({ ...s, bloomIntensity: v }))}
                    min={0}
                    max={3}
                    step={0.1}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted(!muted)}
            className="text-muted-foreground hover:text-foreground"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
