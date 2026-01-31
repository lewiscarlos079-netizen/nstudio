import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Settings2,
  DoorOpen,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSceneStore } from '@/store/sceneStore';

export interface Layer {
  id: string;
  name: string;
  type: 'terrain' | 'model' | 'prop' | 'vegetation' | 'building' | 'water';
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
  // Equipment/gear properties
  equipment?: {
    id: string;
    name: string;
    removable: boolean;
  }[];
  // Accessibility for buildings/props
  isPlayerAccessible?: boolean;
}

const LAYER_ICONS: Record<Layer['type'], React.ElementType> = {
  terrain: Mountain,
  model: User,
  prop: Box,
  vegetation: Trees,
  building: Home,
  water: Droplets,
};

const LAYER_COLORS: Record<Layer['type'], string> = {
  terrain: 'text-amber-500',
  model: 'text-blue-500',
  prop: 'text-purple-500',
  vegetation: 'text-green-500',
  building: 'text-slate-500',
  water: 'text-cyan-500',
};

const DEFAULT_LAYERS: Layer[] = [
  { id: 'l_terrain', name: 'Terrain', type: 'terrain', visible: true, locked: false, opacity: 100, order: 0 },
  { id: 'l_water', name: 'Water', type: 'water', visible: true, locked: false, opacity: 100, order: 1 },
  { id: 'l_vegetation', name: 'Vegetation', type: 'vegetation', visible: true, locked: false, opacity: 100, order: 2, equipment: [] },
  { id: 'l_buildings', name: 'Buildings', type: 'building', visible: true, locked: false, opacity: 100, order: 3, isPlayerAccessible: true, equipment: [
    { id: 'eq_doors', name: 'Doors', removable: true },
    { id: 'eq_windows', name: 'Windows', removable: true },
    { id: 'eq_furniture', name: 'Furniture', removable: true },
    { id: 'eq_signs', name: 'Signs', removable: true },
  ]},
  { id: 'l_props', name: 'Props', type: 'prop', visible: true, locked: false, opacity: 100, order: 4, isPlayerAccessible: false, equipment: [
    { id: 'eq_fences', name: 'Fences', removable: true },
    { id: 'eq_streetlights', name: 'Street Lights', removable: true },
    { id: 'eq_benches', name: 'Benches', removable: true },
  ]},
  { id: 'l_characters', name: 'Characters', type: 'model', visible: true, locked: false, opacity: 100, order: 5, equipment: [
    { id: 'eq_weapons', name: 'Weapons', removable: true },
    { id: 'eq_armor', name: 'Armor', removable: true },
    { id: 'eq_accessories', name: 'Accessories', removable: true },
  ]},
];

export function LayerEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['map', 'assets']);
  const { objects, updateObject, toggleObjectVisibility, toggleObjectLock } = useSceneStore();

  // Sync with scene store
  useEffect(() => {
    // Update layer counts based on actual objects
    const modelCount = objects.filter(o => o.type === 'model' || o.type === 'procedural').length;
    // Could extend this to track per-category counts
  }, [objects]);

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
    // Also toggle visibility of matching objects in scene
    objects.forEach(obj => {
      const layer = layers.find(l => l.id === id);
      if (layer) {
        // Match object type to layer type
        const typeMatch = 
          (layer.type === 'model' && (obj.type === 'model' || obj.type === 'procedural')) ||
          (layer.type === 'building' && obj.name.toLowerCase().includes('building')) ||
          (layer.type === 'prop' && obj.name.toLowerCase().includes('prop'));
        if (typeMatch) {
          toggleObjectVisibility(obj.id);
        }
      }
    });
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

  const togglePlayerAccessible = (id: string) => {
    setLayers(layers.map(l => 
      l.id === id ? { ...l, isPlayerAccessible: !l.isPlayerAccessible } : l
    ));
    toast.success('Accessibility updated');
  };

  const removeEquipment = (layerId: string, equipmentId: string) => {
    setLayers(layers.map(l => {
      if (l.id !== layerId) return l;
      return {
        ...l,
        equipment: l.equipment?.filter(e => e.id !== equipmentId) || []
      };
    }));
    toast.success('Equipment removed');
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
      isPlayerAccessible: type === 'building' || type === 'prop' ? false : undefined,
      equipment: [],
    };
    setLayers([...layers, newLayer]);
    toast.success('Layer added');
  };

  const removeLayer = (id: string) => {
    // Don't remove default layers
    const layer = layers.find(l => l.id === id);
    if (layer && DEFAULT_LAYERS.some(d => d.id === id)) {
      toast.error('Cannot remove default layers');
      return;
    }
    setLayers(layers.filter(l => l.id !== id));
    toast.success('Layer removed');
  };

  const renameLayer = (id: string, name: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, name } : l));
  };

  const mapLayers = layers.filter(l => ['terrain', 'water'].includes(l.type));
  const assetLayers = layers.filter(l => !['terrain', 'water'].includes(l.type));

  const renderLayerItem = (layer: Layer, showDelete = false) => {
    const Icon = LAYER_ICONS[layer.type];
    const colorClass = LAYER_COLORS[layer.type];
    const isSelected = selectedLayer === layer.id;
    
    return (
      <motion.div
        key={layer.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-3 rounded-lg border transition-colors ${
          isSelected 
            ? 'border-primary bg-primary/10' 
            : 'border-border/50 bg-card/50 hover:bg-muted/30'
        }`}
        onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colorClass}`} />
          <span className="text-sm font-medium flex-1 truncate">{layer.name}</span>
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
          {showDelete && (
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
          )}
        </div>
        
        {/* Expanded options */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-border/50 space-y-3 overflow-hidden"
            >
              {/* Layer name editing */}
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  value={layer.name}
                  onChange={(e) => renameLayer(layer.id, e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              
              {/* Opacity control */}
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
              
              {/* Player accessibility for buildings/props */}
              {(layer.type === 'building' || layer.type === 'prop') && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-3 h-3 text-muted-foreground" />
                    <Label className="text-xs">Player Accessible</Label>
                  </div>
                  <Switch
                    checked={layer.isPlayerAccessible ?? false}
                    onCheckedChange={() => togglePlayerAccessible(layer.id)}
                  />
                </div>
              )}
              
              {/* Equipment/gear removal */}
              {layer.equipment && layer.equipment.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Settings2 className="w-3 h-3" />
                    Equipment / Gear
                  </Label>
                  <div className="space-y-1">
                    {layer.equipment.map((eq) => (
                      <div
                        key={eq.id}
                        className="flex items-center justify-between p-1.5 rounded bg-muted/50 border border-border/30"
                      >
                        <span className="text-xs">{eq.name}</span>
                        {eq.removable && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeEquipment(layer.id, eq.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Layers
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[380px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Layer Editor
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Control visibility, accessibility, and equipment for map and asset layers
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
              {mapLayers.map((layer) => renderLayerItem(layer, false))}
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
              {assetLayers.map((layer) => renderLayerItem(layer, !DEFAULT_LAYERS.some(d => d.id === layer.id)))}
              
              {/* Add Layer Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50 mt-3">
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
        <div className="p-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show All Layers</Label>
            <Switch
              checked={layers.every(l => l.visible)}
              onCheckedChange={(checked) => {
                setLayers(layers.map(l => ({ ...l, visible: checked })));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Lock All Layers</Label>
            <Switch
              checked={layers.every(l => l.locked)}
              onCheckedChange={(checked) => {
                setLayers(layers.map(l => ({ ...l, locked: checked })));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">All Buildings Accessible</Label>
            <Switch
              checked={layers.filter(l => l.type === 'building').every(l => l.isPlayerAccessible)}
              onCheckedChange={(checked) => {
                setLayers(layers.map(l => 
                  l.type === 'building' ? { ...l, isPlayerAccessible: checked } : l
                ));
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
