import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RotateCw,
  Move,
  Maximize2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  X,
  Palette,
  Layers,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { useSceneStore, SceneObject } from '@/store/sceneStore';
import { toast } from 'sonner';

interface ModelPopoutEditorProps {
  object: SceneObject | null;
  position: { x: number; y: number };
  onClose: () => void;
}

export function ModelPopoutEditor({ object, position, onClose }: ModelPopoutEditorProps) {
  const { updateObject, removeObject, duplicateObject, toggleObjectLock, toggleObjectVisibility } = useSceneStore();
  
  const [localPosition, setLocalPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [localRotation, setLocalRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [localScale, setLocalScale] = useState<[number, number, number]>([1, 1, 1]);
  const [localColor, setLocalColor] = useState('#00d4ff');

  useEffect(() => {
    if (object) {
      setLocalPosition(object.position);
      setLocalRotation(object.rotation);
      setLocalScale(object.scale);
      setLocalColor(object.color);
    }
  }, [object]);

  if (!object) return null;

  const handlePositionChange = (axis: number, value: number) => {
    const newPosition = [...localPosition] as [number, number, number];
    newPosition[axis] = value;
    setLocalPosition(newPosition);
    updateObject(object.id, { position: newPosition });
  };

  const handleRotationChange = (axis: number, value: number) => {
    const newRotation = [...localRotation] as [number, number, number];
    newRotation[axis] = (value * Math.PI) / 180; // Convert degrees to radians
    setLocalRotation(newRotation);
    updateObject(object.id, { rotation: newRotation });
  };

  const handleScaleChange = (axis: number, value: number) => {
    const newScale = [...localScale] as [number, number, number];
    newScale[axis] = value;
    setLocalScale(newScale);
    updateObject(object.id, { scale: newScale });
  };

  const handleUniformScale = (value: number) => {
    const newScale: [number, number, number] = [value, value, value];
    setLocalScale(newScale);
    updateObject(object.id, { scale: newScale });
  };

  const handleColorChange = (color: string) => {
    setLocalColor(color);
    updateObject(object.id, { color });
  };

  const handleDuplicate = () => {
    duplicateObject(object.id);
    toast.success('Object duplicated');
  };

  const handleDelete = () => {
    removeObject(object.id);
    toast.success('Object deleted');
    onClose();
  };

  const rotationDegrees = localRotation.map(r => Math.round((r * 180) / Math.PI));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.min(position.y, window.innerHeight - 500),
          zIndex: 100,
        }}
        className="w-80 bg-card/95 backdrop-blur-xl rounded-xl border border-primary/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-3 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-semibold truncate max-w-[180px]">
              {object.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleObjectVisibility(object.id)}>
              {object.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleObjectLock(object.id)}>
              {object.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/30 bg-transparent p-0">
            <TabsTrigger value="transform" className="rounded-none text-xs data-[state=active]:bg-primary/10">
              <Move className="w-3 h-3 mr-1" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="material" className="rounded-none text-xs data-[state=active]:bg-primary/10">
              <Palette className="w-3 h-3 mr-1" />
              Material
            </TabsTrigger>
            <TabsTrigger value="equipment" className="rounded-none text-xs data-[state=active]:bg-primary/10">
              <Wrench className="w-3 h-3 mr-1" />
              Equip
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-72">
            {/* Transform Tab */}
            <TabsContent value="transform" className="p-3 space-y-4 mt-0">
              {/* Position */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Position
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{axis}</Label>
                      <Input
                        type="number"
                        value={localPosition[i].toFixed(2)}
                        onChange={(e) => handlePositionChange(i, parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs"
                        step={0.1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  Rotation (degrees)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{axis}</Label>
                      <Input
                        type="number"
                        value={rotationDegrees[i]}
                        onChange={(e) => handleRotationChange(i, parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs"
                        step={15}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Scale
                  </Label>
                </div>
                
                {/* Uniform Scale */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-muted-foreground">Uniform</Label>
                    <span className="text-[10px] text-muted-foreground">{localScale[0].toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[localScale[0]]}
                    onValueChange={([val]) => handleUniformScale(val)}
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                </div>

                {/* Individual Axes */}
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{axis}</Label>
                      <Input
                        type="number"
                        value={localScale[i].toFixed(2)}
                        onChange={(e) => handleScaleChange(i, parseFloat(e.target.value) || 1)}
                        className="h-7 text-xs"
                        step={0.1}
                        min={0.1}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Material Tab */}
            <TabsContent value="material" className="p-3 space-y-4 mt-0">
              {/* Color */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={localColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-8 p-0.5 cursor-pointer"
                  />
                  <Input
                    value={localColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Material Properties */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Metalness</Label>
                    <span className="text-[10px] text-muted-foreground">{Math.round(object.metalness * 100)}%</span>
                  </div>
                  <Slider
                    value={[object.metalness * 100]}
                    onValueChange={([val]) => updateObject(object.id, { metalness: val / 100 })}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Roughness</Label>
                    <span className="text-[10px] text-muted-foreground">{Math.round(object.roughness * 100)}%</span>
                  </div>
                  <Slider
                    value={[object.roughness * 100]}
                    onValueChange={([val]) => updateObject(object.id, { roughness: val / 100 })}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Emissive</Label>
                    <span className="text-[10px] text-muted-foreground">{Math.round(object.emissiveIntensity * 100)}%</span>
                  </div>
                  <Slider
                    value={[object.emissiveIntensity * 100]}
                    onValueChange={([val]) => updateObject(object.id, { emissiveIntensity: val / 100 })}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="p-3 space-y-4 mt-0">
              <div className="text-center py-4">
                <Wrench className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  Equipment options available for character models
                </p>
              </div>
              
              {object.type === 'procedural' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Available Slots</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Right Hand', 'Left Hand', 'Head', 'Back'].map((slot) => (
                      <Button key={slot} variant="outline" size="sm" className="text-xs h-8">
                        {slot}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-2 border-t border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleDuplicate}>
              <Copy className="w-3 h-3" />
              Duplicate
            </Button>
          </div>
          <Button variant="destructive" size="sm" className="h-7 text-xs gap-1" onClick={handleDelete}>
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
