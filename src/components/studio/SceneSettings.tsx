import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Settings2,
  Monitor,
  Sparkles,
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Zap,
  Download,
  Apple,
  Globe,
  Cpu,
  Eye,
  Move3d,
  Volume2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSceneStore } from '@/store/sceneStore';

interface LocalSettingsState {
  hdrEnabled: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  weather: 'clear' | 'rain' | 'snow' | 'fog' | 'storm';
  fogEnabled: boolean;
  renderDistance: number;
  autoTerrain: boolean;
  terrainFocus: 'trees' | 'buildings' | 'entities' | 'mixed';
  entityBehavior: 'neutral' | 'aggressive';
}

const defaultSettings: LocalSettingsState = {
  hdrEnabled: true,
  quality: 'high',
  weather: 'clear',
  fogEnabled: false,
  renderDistance: 100,
  autoTerrain: false,
  terrainFocus: 'mixed',
  entityBehavior: 'neutral',
};

export function SceneSettings() {
  const { mouseSensitivity, setMouseSensitivity } = useSceneStore();
  const [settings, setSettings] = useState<LocalSettingsState>(defaultSettings);

  const updateSetting = <K extends keyof LocalSettingsState>(
    key: K,
    value: LocalSettingsState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${key} updated`);
  };

  const handleSensitivityChange = (value: number) => {
    setMouseSensitivity(value);
  };

  const handleDownload = (platform: string) => {
    toast.info(`Download for ${platform}`, {
      description: 'Desktop application download starting...',
    });
  };

  const weatherIcons = {
    clear: <Sun className="w-4 h-4" />,
    rain: <CloudRain className="w-4 h-4" />,
    snow: <Snowflake className="w-4 h-4" />,
    fog: <Cloud className="w-4 h-4" />,
    storm: <Zap className="w-4 h-4" />,
  };

  const qualityLabels = {
    low: 'Performance',
    medium: 'Balanced',
    high: 'Quality',
    ultra: 'Ultra HDR',
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings2 className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Scene Settings
          </SheetTitle>
          <SheetDescription>
            Customize your 3D experience and download options
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Controls Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Move3d className="w-4 h-4 text-primary" />
              Controls
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Mouse Sensitivity</Label>
                <span className="text-xs text-muted-foreground">{mouseSensitivity}%</span>
              </div>
              <Slider
                value={[mouseSensitivity]}
                onValueChange={([val]) => handleSensitivityChange(val)}
                min={10}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Lower values = slower, more precise movement
              </p>
            </div>
          </div>

          {/* Display Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Display & Quality
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>HDR Rendering</Label>
                <p className="text-xs text-muted-foreground">
                  Enable high dynamic range (optional)
                </p>
              </div>
              <Switch
                checked={settings.hdrEnabled}
                onCheckedChange={(val) => updateSetting('hdrEnabled', val)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Quality Preset</Label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'ultra'] as const).map((q) => (
                  <Button
                    key={q}
                    variant={settings.quality === q ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => updateSetting('quality', q)}
                  >
                    {qualityLabels[q]}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose Performance for older devices, Ultra for best visuals
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Render Distance</Label>
                <span className="text-xs text-muted-foreground">{settings.renderDistance}m</span>
              </div>
              <Slider
                value={[settings.renderDistance]}
                onValueChange={([val]) => updateSetting('renderDistance', val)}
                min={25}
                max={500}
                step={25}
              />
            </div>
          </div>

          {/* Weather Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Cloud className="w-4 h-4 text-primary" />
              Personal Weather
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fog Effect</Label>
                <p className="text-xs text-muted-foreground">
                  Atmospheric fog rendering
                </p>
              </div>
              <Switch
                checked={settings.fogEnabled}
                onCheckedChange={(val) => updateSetting('fogEnabled', val)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Weather Pattern</Label>
              <div className="grid grid-cols-5 gap-2">
                {(['clear', 'rain', 'snow', 'fog', 'storm'] as const).map((w) => (
                  <Button
                    key={w}
                    variant={settings.weather === w ? 'default' : 'outline'}
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-2"
                    onClick={() => updateSetting('weather', w)}
                  >
                    {weatherIcons[w]}
                    <span className="text-[10px] capitalize">{w}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Terrain Generation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Terrain Generation
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Generate Terrain</Label>
                <p className="text-xs text-muted-foreground">
                  Extend terrain as you explore
                </p>
              </div>
              <Switch
                checked={settings.autoTerrain}
                onCheckedChange={(val) => updateSetting('autoTerrain', val)}
              />
            </div>

            {settings.autoTerrain && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pl-4 border-l-2 border-primary/30"
              >
                <div className="space-y-2">
                  <Label className="text-sm">Generation Focus</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['trees', 'buildings', 'entities', 'mixed'] as const).map((f) => (
                      <Button
                        key={f}
                        variant={settings.terrainFocus === f ? 'default' : 'outline'}
                        size="sm"
                        className="capitalize text-xs"
                        onClick={() => updateSetting('terrainFocus', f)}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Entity Behavior</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={settings.entityBehavior === 'neutral' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateSetting('entityBehavior', 'neutral')}
                    >
                      Neutral
                    </Button>
                    <Button
                      variant={settings.entityBehavior === 'aggressive' ? 'destructive' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateSetting('entityBehavior', 'aggressive')}
                    >
                      Aggressive
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Download Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Download Desktop App
            </h3>
            <p className="text-xs text-muted-foreground">
              Free for PCs meeting requirements. Full offline support included.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => handleDownload('Windows')}
              >
                <Cpu className="w-6 h-6" />
                <span className="text-xs">Windows</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => handleDownload('macOS')}
              >
                <Apple className="w-6 h-6" />
                <span className="text-xs">macOS</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => handleDownload('Linux')}
              >
                <Globe className="w-6 h-6" />
                <span className="text-xs">Linux</span>
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <h4 className="text-xs font-medium mb-2">Minimum Requirements</h4>
              <ul className="text-[10px] text-muted-foreground space-y-1">
                <li>• 8GB RAM, dedicated GPU (GTX 1060 / RX 580)</li>
                <li>• 4GB free storage</li>
                <li>• Windows 10+, macOS 12+, Ubuntu 20.04+</li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
