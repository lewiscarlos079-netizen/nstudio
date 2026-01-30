import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Box, 
  Layers, 
  Film, 
  FolderOpen, 
  Settings, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Studio', href: '/studio', icon: Box },
  { label: 'Assets', href: '/assets', icon: Layers },
  { label: 'Render', href: '/render', icon: Film },
  { label: 'Portfolio', href: '/portfolio', icon: FolderOpen },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <Box className="w-6 h-6 text-primary relative z-10" />
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">
              NEXUS STUDIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/studio" className="hidden sm:block">
              <Button variant="cyber" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create New
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-primary/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/studio" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="cyber" className="w-full gap-2 mt-2">
                  <Sparkles className="w-4 h-4" />
                  Create New Project
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
