import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HardDrive, Cloud, X, Download } from 'lucide-react';

const STORAGE_PROMPT_KEY = 'nexus_storage_prompt_shown';

interface StoragePromptProps {
  onDismiss: () => void;
}

export function StoragePrompt({ onDismiss }: StoragePromptProps) {
  const handleLocalStorage = () => {
    localStorage.setItem(STORAGE_PROMPT_KEY, 'local');
    onDismiss();
  };

  const handleCloudStorage = () => {
    localStorage.setItem(STORAGE_PROMPT_KEY, 'cloud');
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg p-8 rounded-2xl bg-card border border-primary/20 shadow-2xl"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-4 right-4 text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Manage Your Storage
          </h2>
          <p className="text-muted-foreground">
            Where would you like to save your project files? You can always change this later in settings.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLocalStorage}
            className="p-6 rounded-xl border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all text-left group"
          >
            <Download className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Save to Device</h3>
            <p className="text-sm text-muted-foreground">
              More storage, works offline, full control
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCloudStorage}
            className="p-6 rounded-xl border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all text-left group"
          >
            <Cloud className="w-8 h-8 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Cloud Storage</h3>
            <p className="text-sm text-muted-foreground">
              Access anywhere, auto-sync, backup included
            </p>
          </motion.button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Free tier: 500MB cloud storage | Upgrade for unlimited
        </p>
      </motion.div>
    </motion.div>
  );
}

export function useStoragePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_PROMPT_KEY);
    if (!stored) {
      // Delay showing the prompt
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return {
    showPrompt,
    dismissPrompt: () => setShowPrompt(false),
  };
}
