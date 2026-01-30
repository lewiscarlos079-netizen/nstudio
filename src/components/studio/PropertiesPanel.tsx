import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Box, Palette, Lightbulb, Lock, Unlock, Eye, EyeOff, Layers } from 'lucide-react';
import { useSceneStore } from '@/store/sceneStore';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PropertiesPanel() {
  const { objects, selectedObjectId, selectObject, updateObject, toggleObjectLock, toggleObjectVisibility } = useSceneStore();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const handlePositionChange = (axis: 0 | 1 | 2, value: string) => {
    if (!selectedObject || selectedObject.locked) return;
    const numValue = parseFloat(value) || 0;
    const newPosition: [number, number, number] = [...selectedObject.position];
    newPosition[axis] = numValue;
    updateObject(selectedObject.id, { position: newPosition });
  };

  const handleScaleChange = (value: number[]) => {
    if (!selectedObject || selectedObject.locked) return;
    const scale = value[0] / 100;
    updateObject(selectedObject.id, { scale: [scale, scale, scale] });
  };

  const handleColorChange = (color: string) => {
    if (!selectedObject || selectedObject.locked) return;
    updateObject(selectedObject.id, { color });
  };

  const handleMetalnessChange = (value: number[]) => {
    if (!selectedObject || selectedObject.locked) return;
    updateObject(selectedObject.id, { metalness: value[0] / 100 });
  };

  const handleRoughnessChange = (value: number[]) => {
    if (!selectedObject || selectedObject.locked) return;
    updateObject(selectedObject.id, { roughness: value[0] / 100 });
  };

  const handleEmissiveChange = (value: number[]) => {
    if (!selectedObject || selectedObject.locked) return;
    updateObject(selectedObject.id, { emissiveIntensity: value[0] / 100 });
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl w-72 flex flex-col max-h-[calc(100vh-8rem)]"
    >
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {/* Scene Hierarchy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-mono text-muted-foreground">SCENE OBJECTS</h4>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {objects.length === 0 ? (
                <p className="text-xs text-muted-foreground/50 italic">No objects in scene</p>
              ) : (
                objects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedObjectId === obj.id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => selectObject(obj.id)}
                  >
                    <Box className="w-3 h-3 text-primary" />
                    <span className="text-xs flex-1 truncate">{obj.name}</span>
                    {obj.locked && <Lock className="w-3 h-3 text-warning" />}
                    {!obj.visible && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {selectedObject ? (
            <>
              {/* Object Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-semibold">{selectedObject.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedObject.type} Object</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => toggleObjectLock(selectedObject.id)}
                  >
                    {selectedObject.locked ? (
                      <Lock className="w-3.5 h-3.5 text-warning" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => toggleObjectVisibility(selectedObject.id)}
                  >
                    {selectedObject.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {selectedObject.locked && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-2">
                  <p className="text-xs text-warning">Object is locked. Unlock to edit.</p>
                </div>
              )}

              <Separator className="bg-border/50" />

              {/* Transform */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-muted-foreground">TRANSFORM</h4>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input 
                      type="number" 
                      value={selectedObject.position[0].toFixed(2)} 
                      onChange={(e) => handlePositionChange(0, e.target.value)}
                      className="h-8 text-xs" 
                      disabled={selectedObject.locked}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input 
                      type="number" 
                      value={selectedObject.position[1].toFixed(2)} 
                      onChange={(e) => handlePositionChange(1, e.target.value)}
                      className="h-8 text-xs" 
                      disabled={selectedObject.locked}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Z</Label>
                    <Input 
                      type="number" 
                      value={selectedObject.position[2].toFixed(2)} 
                      onChange={(e) => handlePositionChange(2, e.target.value)}
                      className="h-8 text-xs" 
                      disabled={selectedObject.locked}
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Scale</Label>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[selectedObject.scale[0] * 100]} 
                      onValueChange={handleScaleChange}
                      max={300} 
                      min={10}
                      step={1} 
                      className="flex-1"
                      disabled={selectedObject.locked}
                    />
                    <span className="text-xs font-mono w-12">{(selectedObject.scale[0] * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Material */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-xs font-mono text-muted-foreground">MATERIAL</h4>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={selectedObject.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-primary/50 cursor-pointer"
                      disabled={selectedObject.locked}
                    />
                    <Input 
                      value={selectedObject.color} 
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-8 text-xs font-mono flex-1" 
                      disabled={selectedObject.locked}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Metalness</Label>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[selectedObject.metalness * 100]} 
                      onValueChange={handleMetalnessChange}
                      max={100} 
                      step={1} 
                      className="flex-1"
                      disabled={selectedObject.locked}
                    />
                    <span className="text-xs font-mono w-10">{selectedObject.metalness.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Roughness</Label>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[selectedObject.roughness * 100]} 
                      onValueChange={handleRoughnessChange}
                      max={100} 
                      step={1} 
                      className="flex-1"
                      disabled={selectedObject.locked}
                    />
                    <span className="text-xs font-mono w-10">{selectedObject.roughness.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Lighting */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-xs font-mono text-muted-foreground">EMISSIVE</h4>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Intensity</Label>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[selectedObject.emissiveIntensity * 100]} 
                      onValueChange={handleEmissiveChange}
                      max={100} 
                      step={1} 
                      className="flex-1"
                      disabled={selectedObject.locked}
                    />
                    <span className="text-xs font-mono w-10">{selectedObject.emissiveIntensity.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Box className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No object selected</p>
              <p className="text-xs text-muted-foreground/50">Click an object in the scene or add one from the toolbar</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
