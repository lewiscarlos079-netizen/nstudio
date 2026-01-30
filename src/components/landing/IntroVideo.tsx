import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X, Crown, Code, Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onClose: () => void;
}

interface Scene {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  bgGradient: string;
  duration: number;
}

const scenes: Scene[] = [
  {
    id: 'robots-farming',
    title: 'Robots Farming',
    subtitle: 'Automated agricultural systems in action',
    emoji: '🤖🌾',
    bgGradient: 'from-emerald-950 via-green-900/50 to-emerald-950',
    duration: 4000,
  },
  {
    id: 'skydiving',
    title: 'Extreme Skydiving',
    subtitle: 'Capture breathtaking aerial cinematics',
    emoji: '🪂☁️',
    bgGradient: 'from-sky-950 via-blue-900/50 to-cyan-950',
    duration: 4000,
  },
  {
    id: 'surfing',
    title: 'Ocean Surfing',
    subtitle: 'Ride the waves with dynamic water physics',
    emoji: '🏄‍♂️🌊',
    bgGradient: 'from-teal-950 via-cyan-900/50 to-blue-950',
    duration: 4000,
  },
  {
    id: 'racing',
    title: 'Street Racing',
    subtitle: 'High-speed vehicle simulations',
    emoji: '🏎️💨',
    bgGradient: 'from-slate-950 via-zinc-900/50 to-neutral-950',
    duration: 4000,
  },
  {
    id: 'space',
    title: 'Space Exploration',
    subtitle: 'Journey through the cosmos',
    emoji: '🚀✨',
    bgGradient: 'from-violet-950 via-purple-900/50 to-indigo-950',
    duration: 4000,
  },
];

export function IntroVideo({ onClose }: IntroVideoProps) {
  const [showCTAs, setShowCTAs] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
        {/* Animated Scene Backgrounds */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient}`}
          >
            <div className="absolute inset-0 grid-bg opacity-20" />
            
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * -200],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Slow moving gradient orbs */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, -25, 0],
                y: [0, 25, 0],
              }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-secondary/15 via-transparent to-transparent blur-3xl"
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
              className="relative z-10 text-center px-8"
            >
              {/* Scene Emoji */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-7xl md:text-9xl mb-8"
              >
                {currentScene.emoji}
              </motion.div>

              {/* Scene Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-display text-5xl md:text-7xl font-bold mb-4"
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
              className="relative z-10 text-center px-8 max-w-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-6"
              >
                ✨
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
