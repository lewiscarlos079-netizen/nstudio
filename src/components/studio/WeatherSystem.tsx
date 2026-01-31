import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Tornado,
  Waves,
  Moon,
  Sunrise,
  CloudFog,
} from 'lucide-react';
import { toast } from 'sonner';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'tornado';
export type TimeOfDayType = 'dawn' | 'day' | 'sunset' | 'night';

interface WeatherState {
  weather: WeatherType;
  timeOfDay: TimeOfDayType;
  intensity: number;
  windSpeed: number;
  cloudCoverage: number;
  precipitation: number;
  lightningEnabled: boolean;
  dynamicCycle: boolean;
}

const WEATHER_OPTIONS: { id: WeatherType; name: string; icon: React.ComponentType<any>; description: string }[] = [
  { id: 'clear', name: 'Clear', icon: Sun, description: 'Sunny skies' },
  { id: 'cloudy', name: 'Cloudy', icon: Cloud, description: 'Overcast skies' },
  { id: 'rain', name: 'Rain', icon: CloudRain, description: 'Light to heavy rain' },
  { id: 'snow', name: 'Snow', icon: CloudSnow, description: 'Snowfall' },
  { id: 'storm', name: 'Storm', icon: CloudLightning, description: 'Thunder & lightning' },
  { id: 'fog', name: 'Fog', icon: CloudFog, description: 'Thick fog' },
  { id: 'wind', name: 'Windy', icon: Wind, description: 'Strong winds' },
  { id: 'tornado', name: 'Tornado', icon: Tornado, description: 'Extreme weather' },
];

const TIME_OPTIONS: { id: TimeOfDayType; name: string; icon: React.ComponentType<any>; color: string }[] = [
  { id: 'dawn', name: 'Dawn', icon: Sunrise, color: '#FF9966' },
  { id: 'day', name: 'Day', icon: Sun, color: '#87CEEB' },
  { id: 'sunset', name: 'Sunset', icon: Sun, color: '#FF6B35' },
  { id: 'night', name: 'Night', icon: Moon, color: '#1A1A2E' },
];

interface WeatherSystemProps {
  onWeatherChange?: (state: WeatherState) => void;
}

export function WeatherSystem({ onWeatherChange }: WeatherSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<WeatherState>({
    weather: 'clear',
    timeOfDay: 'day',
    intensity: 50,
    windSpeed: 20,
    cloudCoverage: 30,
    precipitation: 0,
    lightningEnabled: false,
    dynamicCycle: true,
  });

  const updateState = <K extends keyof WeatherState>(key: K, value: WeatherState[K]) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    onWeatherChange?.(newState);
    
    // Dispatch custom event for viewport
    window.dispatchEvent(new CustomEvent('weatherChange', { 
      detail: { 
        weather: key === 'weather' ? value : newState.weather, 
        intensity: key === 'intensity' ? value : newState.intensity / 100,
        windSpeed: key === 'windSpeed' ? value : newState.windSpeed / 100,
      } 
    }));
    
    if (key === 'weather') {
      toast.success(`Weather set to ${value}`);
    }
  };

  const selectWeather = (weatherId: WeatherType) => {
    updateState('weather', weatherId);
    
    // Auto-adjust related settings
    switch (weatherId) {
      case 'rain':
        updateState('precipitation', 60);
        updateState('cloudCoverage', 80);
        break;
      case 'storm':
        updateState('precipitation', 80);
        updateState('cloudCoverage', 100);
        updateState('lightningEnabled', true);
        updateState('windSpeed', 70);
        break;
      case 'snow':
        updateState('precipitation', 50);
        updateState('cloudCoverage', 90);
        break;
      case 'clear':
        updateState('precipitation', 0);
        updateState('cloudCoverage', 10);
        break;
      case 'tornado':
        updateState('windSpeed', 100);
        updateState('cloudCoverage', 100);
        break;
    }
  };

  const currentWeather = WEATHER_OPTIONS.find(w => w.id === state.weather);
  const currentTime = TIME_OPTIONS.find(t => t.id === state.timeOfDay);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currentWeather && <currentWeather.icon className="w-4 h-4" />}
          Sky
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            Sky & Weather
          </h3>
          <p className="text-xs text-muted-foreground">Configure environment atmosphere</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Time of Day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Time of Day</Label>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Dynamic Cycle</Label>
                <Switch 
                  checked={state.dynamicCycle}
                  onCheckedChange={(val) => updateState('dynamicCycle', val)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIME_OPTIONS.map((time) => (
                <Button
                  key={time.id}
                  variant={state.timeOfDay === time.id ? "default" : "outline"}
                  size="sm"
                  className="flex-col gap-1 h-auto py-2"
                  style={state.timeOfDay === time.id ? { backgroundColor: time.color } : {}}
                  onClick={() => updateState('timeOfDay', time.id)}
                >
                  <time.icon className="w-4 h-4" />
                  <span className="text-[10px]">{time.name}</span>
                </Button>
              ))}
            </div>
            {state.dynamicCycle && (
              <p className="text-[10px] text-muted-foreground">
                ⚠️ Disable for short film productions
              </p>
            )}
          </div>

          {/* Weather Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Weather Pattern</Label>
            <div className="grid grid-cols-4 gap-2">
              {WEATHER_OPTIONS.map((weather) => (
                <motion.button
                  key={weather.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                    state.weather === weather.id
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border/50 hover:border-primary/30'
                  }`}
                  onClick={() => selectWeather(weather.id)}
                >
                  <weather.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{weather.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Intensity Controls */}
          <div className="space-y-4">
            {/* Cloud Coverage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Cloud Coverage</Label>
                <span className="text-xs text-muted-foreground">{state.cloudCoverage}%</span>
              </div>
              <Slider
                value={[state.cloudCoverage]}
                onValueChange={([val]) => updateState('cloudCoverage', val)}
                min={0}
                max={100}
              />
            </div>

            {/* Wind Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  Wind Speed
                </Label>
                <span className="text-xs text-muted-foreground">{state.windSpeed} km/h</span>
              </div>
              <Slider
                value={[state.windSpeed]}
                onValueChange={([val]) => updateState('windSpeed', val)}
                min={0}
                max={100}
              />
            </div>

            {/* Precipitation */}
            {['rain', 'snow', 'storm'].includes(state.weather) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1">
                    <Waves className="w-3 h-3" />
                    Precipitation
                  </Label>
                  <span className="text-xs text-muted-foreground">{state.precipitation}%</span>
                </div>
                <Slider
                  value={[state.precipitation]}
                  onValueChange={([val]) => updateState('precipitation', val)}
                  min={0}
                  max={100}
                />
              </div>
            )}

            {/* Lightning Toggle */}
            {state.weather === 'storm' && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <CloudLightning className="w-4 h-4 text-yellow-500" />
                  <div>
                    <Label className="text-sm">Lightning Effects</Label>
                    <p className="text-[10px] text-muted-foreground">Enable thunder & lightning</p>
                  </div>
                </div>
                <Switch 
                  checked={state.lightningEnabled}
                  onCheckedChange={(val) => updateState('lightningEnabled', val)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div 
          className="h-16 mx-4 mb-4 rounded-lg relative overflow-hidden"
          style={{ 
            background: `linear-gradient(180deg, ${currentTime?.color || '#87CEEB'}, ${
              state.weather === 'storm' ? '#2D3436' :
              state.weather === 'fog' ? '#95A5A6' :
              state.weather === 'snow' ? '#ECF0F1' :
              '#87CEEB'
            })`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {currentWeather && <currentWeather.icon className="w-8 h-8 text-white/70" />}
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/80">
            <span>{currentTime?.name}</span>
            <span>{currentWeather?.description}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
