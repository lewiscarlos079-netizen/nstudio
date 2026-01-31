import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mountain, 
  TreePine, 
  Waves, 
  Home, 
  Building2,
  Map,
  Grid3X3,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Droplets,
  Cloud,
  Sun,
  Wind,
  Zap
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

// Tropico/SimCity/Jurassic World Evolution inspired terrain system
export interface TerrainCell {
  id: string;
  x: number;
  z: number;
  elevation: number;
  type: TerrainType;
  biome: BiomeType;
  moisture: number;
  vegetation: number;
  infrastructure: string | null;
}

export type TerrainType = 
  | 'grass' | 'dirt' | 'sand' | 'rock' | 'water' 
  | 'concrete' | 'asphalt' | 'cobblestone' | 'gravel';

export type BiomeType = 
  | 'tropical' | 'temperate' | 'desert' | 'tundra' 
  | 'jungle' | 'savanna' | 'wetland' | 'urban';

interface TerrainPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  biome: BiomeType;
  baseElevation: number;
  variations: number;
  vegetation: number;
  waterLevel: number;
  inspiration: string;
}

const TERRAIN_PRESETS: TerrainPreset[] = [
  {
    id: 'tropical-island',
    name: 'Tropical Island',
    description: 'Lush Caribbean paradise with beaches and palm trees',
    icon: Sun,
    biome: 'tropical',
    baseElevation: 0.2,
    variations: 0.4,
    vegetation: 0.8,
    waterLevel: 0.1,
    inspiration: 'Tropico',
  },
  {
    id: 'metropolis',
    name: 'Modern Metropolis',
    description: 'Dense urban cityscape with skyscrapers',
    icon: Building2,
    biome: 'urban',
    baseElevation: 0.1,
    variations: 0.1,
    vegetation: 0.2,
    waterLevel: 0,
    inspiration: 'SimCity',
  },
  {
    id: 'prehistoric-valley',
    name: 'Prehistoric Valley',
    description: 'Lush jungle with rivers and volcanic terrain',
    icon: Mountain,
    biome: 'jungle',
    baseElevation: 0.3,
    variations: 0.6,
    vegetation: 0.9,
    waterLevel: 0.15,
    inspiration: 'Jurassic World Evolution',
  },
  {
    id: 'coastal-town',
    name: 'Coastal Town',
    description: 'Seaside village with harbor and beaches',
    icon: Waves,
    biome: 'temperate',
    baseElevation: 0.15,
    variations: 0.25,
    vegetation: 0.5,
    waterLevel: 0.2,
    inspiration: 'Tropico',
  },
  {
    id: 'mountain-resort',
    name: 'Mountain Resort',
    description: 'Alpine terrain with peaks and valleys',
    icon: Mountain,
    biome: 'temperate',
    baseElevation: 0.5,
    variations: 0.8,
    vegetation: 0.4,
    waterLevel: 0.05,
    inspiration: 'SimCity',
  },
  {
    id: 'safari-park',
    name: 'Safari Park',
    description: 'African savanna with watering holes',
    icon: Sun,
    biome: 'savanna',
    baseElevation: 0.2,
    variations: 0.2,
    vegetation: 0.3,
    waterLevel: 0.1,
    inspiration: 'Jurassic World Evolution',
  },
  {
    id: 'wetlands',
    name: 'Wetlands Reserve',
    description: 'Marshy terrain with ponds and streams',
    icon: Droplets,
    biome: 'wetland',
    baseElevation: 0.05,
    variations: 0.15,
    vegetation: 0.7,
    waterLevel: 0.35,
    inspiration: 'Jurassic World Evolution',
  },
  {
    id: 'desert-oasis',
    name: 'Desert Oasis',
    description: 'Arid terrain with hidden water sources',
    icon: Sun,
    biome: 'desert',
    baseElevation: 0.25,
    variations: 0.3,
    vegetation: 0.1,
    waterLevel: 0.02,
    inspiration: 'Tropico',
  },
];

interface TerrainBuilderProps {
  onTerrainGenerate?: (terrain: TerrainCell[]) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function TerrainBuilder({ 
  onTerrainGenerate, 
  isExpanded = false,
  onToggleExpand 
}: TerrainBuilderProps) {
  const [selectedPreset, setSelectedPreset] = useState<TerrainPreset | null>(null);
  const [gridSize, setGridSize] = useState([32]);
  const [elevation, setElevation] = useState([0.3]);
  const [variation, setVariation] = useState([0.4]);
  const [vegetationDensity, setVegetationDensity] = useState([0.5]);
  const [waterLevel, setWaterLevel] = useState([0.1]);
  const [levelExpansion, setLevelExpansion] = useState([1]);
  const [depthExpansion, setDepthExpansion] = useState([1]);
  const [sectionsOpen, setSectionsOpen] = useState({
    presets: true,
    terrain: false,
    vegetation: false,
    expansion: false,
  });

  const generateTerrain = useCallback(() => {
    const cells: TerrainCell[] = [];
    const size = gridSize[0];
    const preset = selectedPreset;
    
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        // Perlin-like noise simulation
        const noiseX = Math.sin(x * 0.1) * Math.cos(z * 0.15);
        const noiseZ = Math.cos(x * 0.12) * Math.sin(z * 0.1);
        const combinedNoise = (noiseX + noiseZ + 2) / 4;
        
        const baseElev = preset?.baseElevation ?? elevation[0];
        const var_ = preset?.variations ?? variation[0];
        const cellElevation = baseElev + combinedNoise * var_ * depthExpansion[0];
        
        // Determine terrain type based on elevation and moisture
        let type: TerrainType = 'grass';
        if (cellElevation < waterLevel[0]) type = 'water';
        else if (cellElevation < 0.2) type = 'sand';
        else if (cellElevation > 0.7) type = 'rock';
        else if (Math.random() < 0.1) type = 'dirt';
        
        cells.push({
          id: `cell-${x}-${z}`,
          x: (x - size / 2) * levelExpansion[0],
          z: (z - size / 2) * levelExpansion[0],
          elevation: cellElevation,
          type,
          biome: preset?.biome ?? 'temperate',
          moisture: combinedNoise,
          vegetation: Math.random() < (preset?.vegetation ?? vegetationDensity[0]) ? 1 : 0,
          infrastructure: null,
        });
      }
    }
    
    onTerrainGenerate?.(cells);
    toast.success(`Generated ${cells.length} terrain cells`);
  }, [gridSize, elevation, variation, vegetationDensity, waterLevel, levelExpansion, depthExpansion, selectedPreset, onTerrainGenerate]);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const applyPreset = (preset: TerrainPreset) => {
    setSelectedPreset(preset);
    setElevation([preset.baseElevation]);
    setVariation([preset.variations]);
    setVegetationDensity([preset.vegetation]);
    setWaterLevel([preset.waterLevel]);
    toast.success(`Applied ${preset.name} preset`);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-primary/20">
      {/* Header */}
      <div className="p-3 border-b border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold">Terrain Builder</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleExpand}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Presets Section */}
          <Collapsible open={sectionsOpen.presets} onOpenChange={() => toggleSection('presets')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Grid3X3 className="w-4 h-4" />
                  Terrain Presets
                </span>
                {sectionsOpen.presets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {TERRAIN_PRESETS.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyPreset(preset)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedPreset?.id === preset.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <preset.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium truncate">{preset.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {preset.description}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[9px]">
                      {preset.inspiration}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Terrain Settings */}
          <Collapsible open={sectionsOpen.terrain} onOpenChange={() => toggleSection('terrain')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Mountain className="w-4 h-4" />
                  Terrain Settings
                </span>
                {sectionsOpen.terrain ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Grid Size</span>
                  <span>{gridSize[0]}x{gridSize[0]}</span>
                </div>
                <Slider
                  value={gridSize}
                  onValueChange={setGridSize}
                  min={8}
                  max={128}
                  step={8}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Base Elevation</span>
                  <span>{(elevation[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={elevation}
                  onValueChange={setElevation}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Variation</span>
                  <span>{(variation[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={variation}
                  onValueChange={setVariation}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Water Level</span>
                  <span>{(waterLevel[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={waterLevel}
                  onValueChange={setWaterLevel}
                  min={0}
                  max={0.5}
                  step={0.01}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Vegetation Settings */}
          <Collapsible open={sectionsOpen.vegetation} onOpenChange={() => toggleSection('vegetation')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <TreePine className="w-4 h-4" />
                  Vegetation
                </span>
                {sectionsOpen.vegetation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Density</span>
                  <span>{(vegetationDensity[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={vegetationDensity}
                  onValueChange={setVegetationDensity}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Expansion Settings */}
          <Collapsible open={sectionsOpen.expansion} onOpenChange={() => toggleSection('expansion')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="w-4 h-4" />
                  Level Expansion
                </span>
                {sectionsOpen.expansion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Horizontal Scale</span>
                  <span>{levelExpansion[0].toFixed(1)}x</span>
                </div>
                <Slider
                  value={levelExpansion}
                  onValueChange={setLevelExpansion}
                  min={0.5}
                  max={4}
                  step={0.25}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Depth Scale</span>
                  <span>{depthExpansion[0].toFixed(1)}x</span>
                </div>
                <Slider
                  value={depthExpansion}
                  onValueChange={setDepthExpansion}
                  min={0.5}
                  max={4}
                  step={0.25}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
      
      {/* Generate Button */}
      <div className="p-3 border-t border-primary/20 space-y-2">
        <Button 
          variant="cyber" 
          className="w-full gap-2"
          onClick={generateTerrain}
        >
          <Zap className="w-4 h-4" />
          Generate Terrain
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-1" size="sm">
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <Button variant="outline" className="flex-1 gap-1" size="sm">
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}

export { TERRAIN_PRESETS };
