import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  User,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';

export function SettingsDropdown() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass border-primary/20">
        <DropdownMenuLabel className="font-display">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        
        <Link to="/subscription">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <CreditCard className="w-4 h-4" />
            Subscription & Billing
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Palette className="w-4 h-4" />
          Color Theme
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <Link to="/legal">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Shield className="w-4 h-4" />
            Privacy & Terms
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <HelpCircle className="w-4 h-4" />
          Help & Support
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
