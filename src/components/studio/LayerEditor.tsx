import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Mountain,
  User,
  Box,
  Trees,
  Home,
  Droplets,
} from 'lucide-react';
import { toast } from 'sonner';

interface Layer {
  id: string;
  name: string;
  type: 'terrain' | 'model' | 'prop' | 'vegetation' | 'building' | 'water';
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
}

const LAYER_ICONS: Record<Layer['type'], React.ElementType> = {
  terrain: Mountain,
  model: User,
  prop: Box,
  vegetation: Trees,
  building: Home,
  water: Droplets,
};

const DEFAULT_LAYERS: Layer[] = [
  { id: 'l_terrain', name: 'Terrain', type: 'terrain', visible: true, locked: false, opacity: 100, order: 0 },
  { id: 'l_water', name: 'Water', type: 'water', visible: true, locked: false, opacity: 100, order: 1 },
  { id: 'l_vegetation', name: 'Vegetation', type: 'vegetation', visible: true, locked: false, opacity: 100, order: 2 },
  { id: 'l_buildings', name: 'Buildings', type: 'building', visible: true, locked: false, opacity: 100, order: 3 },
  { id: 'l_props', name: 'Props', type: 'prop', visible: true, locked: false, opacity: 100, order: 4 },
  { id: 'l_characters', name: 'Characters', type: 'model', visible: true, locked: false, opacity: 100, order: 5 },
];

export function LayerEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['map', 'assets']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => 
      l.id === id ? { ...l, visible: !l.visible } : l
    ));
  };

  const toggleLayerLock = (id: string) => {
    setLayers(layers.map(l => 
      l.id === id ? { ...l, locked: !l.locked } : l
    ));
  };

  const updateLayerOpacity = (id: string, opacity: number) => {
    setLayers(layers.map(l => 
      l.id === id ? { ...l, opacity } : l
    ));
  };

  const addLayer = (type: Layer['type']) => {
    const newLayer: Layer = {
      id: `l_${Date.now()}`,
      name: `New ${type} Layer`,
      type,
      visible: true,
      locked: false,
      opacity: 100,
      order: layers.length,
    };
    setLayers([...layers, newLayer]);
    toast.success('Layer added');
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    toast.success('Layer removed');
  };

  const mapLayers = layers.filter(l => ['terrain', 'water'].includes(l.type));
  const assetLayers = layers.filter(l => !['terrain', 'water'].includes(l.type));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Layers
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[350px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Layer Editor
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Control visibility and properties of map and asset layers
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          {/* Map Layers */}
          <Collapsible 
            open={expandedSections.includes('map')} 
            onOpenChange={() => toggleSection('map')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 mb-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Mountain className="w-4 h-4" />
                  Map Layers ({mapLayers.length})
                </span>
                {expandedSections.includes('map') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {mapLayers.map((layer) => {
                const Icon = LAYER_ICONS[layer.type];
                return (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedLayer === layer.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 bg-card/50'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium flex-1">{layer.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                      >
                        {layer.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                      >
                        {layer.locked ? (
                          <Lock className="w-3 h-3 text-yellow-500" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    
                    {selectedLayer === layer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-border/50 space-y-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Opacity</Label>
                            <span className="text-xs text-muted-foreground">{layer.opacity}%</span>
                          </div>
                          <Slider
                            value={[layer.opacity]}
                            onValueChange={([val]) => updateLayerOpacity(layer.id, val)}
                            min={0}
                            max={100}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Asset Layers */}
          <Collapsible 
            open={expandedSections.includes('assets')} 
            onOpenChange={() => toggleSection('assets')}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 mb-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Box className="w-4 h-4" />
                  Asset Layers ({assetLayers.length})
                </span>
                {expandedSections.includes('assets') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {assetLayers.map((layer) => {
                const Icon = LAYER_ICONS[layer.type];
                return (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedLayer === layer.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 bg-card/50'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium flex-1">{layer.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {layer.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                      >
                        {layer.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                      >
                        {layer.locked ? (
                          <Lock className="w-3 h-3 text-yellow-500" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLayer(layer.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {selectedLayer === layer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-border/50 space-y-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Opacity</Label>
                            <span className="text-xs text-muted-foreground">{layer.opacity}%</span>
                          </div>
                          <Slider
                            value={[layer.opacity]}
                            onValueChange={([val]) => updateLayerOpacity(layer.id, val)}
                            min={0}
                            max={100}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Add Layer Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => addLayer('vegetation')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Vegetation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => addLayer('prop')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Props
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => addLayer('building')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Buildings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => addLayer('model')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Characters
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show All</Label>
            <Switch
              checked={layers.every(l => l.visible)}
              onCheckedChange={(checked) => {
                setLayers(layers.map(l => ({ ...l, visible: checked })));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Lock All</Label>
            <Switch
              checked={layers.every(l => l.locked)}
              onCheckedChange={(checked) => {
                setLayers(layers.map(l => ({ ...l, locked: checked })));
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
