import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X, Crown, Code, Play, Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onClose: () => void;
}

export function IntroVideo({ onClose }: IntroVideoProps) {
  const [showCTAs, setShowCTAs] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate video progress (replace with actual video when available)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setShowCTAs(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
    >
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Animated Background (placeholder for actual video) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950">
          <div className="absolute inset-0 grid-bg opacity-30" />
          
          {/* Animated orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-violet-500/30 via-transparent to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-500/20 via-transparent to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-3xl"
          />
        </div>

        {/* Video Content Showcase */}
        <AnimatePresence mode="wait">
          {!showCTAs ? (
            <motion.div
              key="showcase"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative z-10 text-center px-8"
            >
              <motion.h1
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-display text-6xl md:text-8xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-violet-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                  NEXUS STUDIO
                </span>
              </motion.h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5 }}
                className="max-w-md mx-auto mb-8"
              >
                <div className="text-lg text-muted-foreground mb-4">
                  {progress < 25 && "Professional 3D Design Tools"}
                  {progress >= 25 && progress < 50 && "AI-Powered Asset Creation"}
                  {progress >= 50 && progress < 75 && "Cinematic Camera Recording"}
                  {progress >= 75 && "Export to Any Platform"}
                </div>
              </motion.div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {['3D Modeling', 'Asset Library', 'Render Engine', 'Portfolio'].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > (i + 1) * 20 ? 1 : 0.3,
                      y: progress > (i + 1) * 20 ? 0 : 20
                    }}
                    className="px-4 py-3 rounded-lg bg-card/50 border border-primary/20"
                  >
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ctas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center px-8 max-w-3xl"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Ready to Create?
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of creators building amazing 3D experiences
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Club Subscription CTA */}
                <Link to="/subscription" onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 cursor-pointer group"
                  >
                    <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2 text-amber-300">
                      Join the Club
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Earn bonus points, vote on new features, exclusive assets
                    </p>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black gap-2">
                      <Crown className="w-4 h-4" />
                      Get Premium
                    </Button>
                  </motion.div>
                </Link>

                {/* Developer Tier CTA */}
                <Link to="/studio" onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 cursor-pointer group"
                  >
                    <Code className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2 text-emerald-300">
                      Developer Program
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create & sell assets, access SDK, monetize your work
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-black gap-2">
                      <Code className="w-4 h-4" />
                      Start Creating
                    </Button>
                  </motion.div>
                </Link>
              </div>

              <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
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
              className="h-full bg-gradient-to-r from-violet-500 via-amber-400 to-emerald-500"
            />
          </div>
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
