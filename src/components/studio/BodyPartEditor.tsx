import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore, BodyPartType } from '@/store/sceneStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Hand, 
  Footprints, 
  Circle,
  Maximize2,
  Move,
  X,
  Palette
} from 'lucide-react';

// Define body parts available for each model type
const MODEL_BODY_PARTS: Record<string, { part: BodyPartType; label: string; icon: React.ComponentType<any> }[]> = {
  humanoid: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'face', label: 'Face', icon: User },
    { part: 'torso', label: 'Torso', icon: User },
    { part: 'leftArm', label: 'Left Arm', icon: Hand },
    { part: 'rightArm', label: 'Right Arm', icon: Hand },
    { part: 'leftLeg', label: 'Left Leg', icon: Footprints },
    { part: 'rightLeg', label: 'Right Leg', icon: Footprints },
  ],
  robot: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'face', label: 'Eyes', icon: User },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftArm', label: 'Left Arm', icon: Hand },
    { part: 'rightArm', label: 'Right Arm', icon: Hand },
    { part: 'leftLeg', label: 'Left Leg', icon: Footprints },
    { part: 'rightLeg', label: 'Right Leg', icon: Footprints },
  ],
  dragon: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'neck', label: 'Neck', icon: User },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftWing', label: 'Left Wing', icon: Hand },
    { part: 'rightWing', label: 'Right Wing', icon: Hand },
    { part: 'tail', label: 'Tail', icon: Footprints },
  ],
  dog: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'snout', label: 'Snout', icon: User },
    { part: 'ears', label: 'Ears', icon: Circle },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftFrontLeg', label: 'Front Left Leg', icon: Footprints },
    { part: 'rightFrontLeg', label: 'Front Right Leg', icon: Footprints },
    { part: 'leftBackLeg', label: 'Back Left Leg', icon: Footprints },
    { part: 'rightBackLeg', label: 'Back Right Leg', icon: Footprints },
    { part: 'tail', label: 'Tail', icon: Footprints },
  ],
  cat: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'ears', label: 'Ears', icon: Circle },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftFrontLeg', label: 'Front Left Leg', icon: Footprints },
    { part: 'rightFrontLeg', label: 'Front Right Leg', icon: Footprints },
    { part: 'leftBackLeg', label: 'Back Left Leg', icon: Footprints },
    { part: 'rightBackLeg', label: 'Back Right Leg', icon: Footprints },
    { part: 'tail', label: 'Tail', icon: Footprints },
  ],
  bird: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'snout', label: 'Beak', icon: User },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftWing', label: 'Left Wing', icon: Hand },
    { part: 'rightWing', label: 'Right Wing', icon: Hand },
    { part: 'tail', label: 'Tail', icon: Footprints },
    { part: 'leftLeg', label: 'Left Leg', icon: Footprints },
    { part: 'rightLeg', label: 'Right Leg', icon: Footprints },
  ],
  fish: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'dorsalFin', label: 'Dorsal Fin', icon: Hand },
    { part: 'tailFin', label: 'Tail Fin', icon: Footprints },
    { part: 'leftFin', label: 'Left Fin', icon: Hand },
    { part: 'rightFin', label: 'Right Fin', icon: Hand },
  ],
  crocodile: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'snout', label: 'Snout', icon: User },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftFrontLeg', label: 'Front Left Leg', icon: Footprints },
    { part: 'rightFrontLeg', label: 'Front Right Leg', icon: Footprints },
    { part: 'leftBackLeg', label: 'Back Left Leg', icon: Footprints },
    { part: 'rightBackLeg', label: 'Back Right Leg', icon: Footprints },
    { part: 'tail', label: 'Tail', icon: Footprints },
  ],
  gorilla: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'face', label: 'Face', icon: User },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftArm', label: 'Left Arm', icon: Hand },
    { part: 'rightArm', label: 'Right Arm', icon: Hand },
    { part: 'leftLeg', label: 'Left Leg', icon: Footprints },
    { part: 'rightLeg', label: 'Right Leg', icon: Footprints },
  ],
};

// Default body parts for unknown models
const DEFAULT_BODY_PARTS = [
  { part: 'head' as BodyPartType, label: 'Head', icon: Circle },
  { part: 'torso' as BodyPartType, label: 'Body', icon: User },
  { part: 'leftArm' as BodyPartType, label: 'Left Appendage', icon: Hand },
  { part: 'rightArm' as BodyPartType, label: 'Right Appendage', icon: Hand },
];

export function BodyPartEditor() {
  const { 
    designMode, 
    toggleDesignMode, 
    selectedObjectId, 
    objects, 
    selectedBodyPart, 
    selectBodyPart,
    updateBodyPart 
  } = useSceneStore();

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  
  if (!designMode || !selectedObject || selectedObject.type !== 'procedural') {
    return null;
  }

  const modelId = selectedObject.modelId || '';
  const bodyParts = MODEL_BODY_PARTS[modelId] || DEFAULT_BODY_PARTS;
  
  const currentPartConfig = selectedBodyPart && selectedObject.bodyParts?.[selectedBodyPart];
  const scale = currentPartConfig?.scale || [1, 1, 1];
  const offset = currentPartConfig?.offset || [0, 0, 0];
  const color = currentPartConfig?.color || '';

  const handleScaleChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedBodyPart || !selectedObjectId) return;
    const newScale: [number, number, number] = [...scale] as [number, number, number];
    newScale[axis] = value;
    updateBodyPart(selectedObjectId, selectedBodyPart, { scale: newScale });
  };

  const handleOffsetChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedBodyPart || !selectedObjectId) return;
    const newOffset: [number, number, number] = [...offset] as [number, number, number];
    newOffset[axis] = value;
    updateBodyPart(selectedObjectId, selectedBodyPart, { offset: newOffset });
  };

  const handleColorChange = (newColor: string) => {
    if (!selectedBodyPart || !selectedObjectId) return;
    updateBodyPart(selectedObjectId, selectedBodyPart, { color: newColor });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="glass rounded-xl w-72 flex flex-col max-h-[calc(100vh-12rem)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-3 border-b border-border/50 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm">Design Mode</h3>
            <p className="text-xs text-muted-foreground">{selectedObject.name}</p>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={toggleDesignMode}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Body Parts List */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Select Body Part
              </Label>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {bodyParts.map(({ part, label, icon: Icon }) => (
                  <Button
                    key={part}
                    variant={selectedBodyPart === part ? "default" : "outline"}
                    size="sm"
                    className={`justify-start gap-2 h-8 text-xs ${selectedBodyPart === part ? 'glow-primary-sm' : ''}`}
                    onClick={() => selectBodyPart(selectedBodyPart === part ? null : part)}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedBodyPart && (
              <>
                <Separator />

                {/* Scale Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Scale
                    </Label>
                  </div>
                  
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">{axis}</span>
                        <span className="text-xs font-mono">{scale[i].toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[scale[i]]}
                        onValueChange={([v]) => handleScaleChange(i as 0 | 1 | 2, v)}
                        min={0.1}
                        max={3}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Offset Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Offset
                    </Label>
                  </div>
                  
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">{axis}</span>
                        <span className="text-xs font-mono">{offset[i].toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[offset[i]]}
                        onValueChange={([v]) => handleOffsetChange(i as 0 | 1 | 2, v)}
                        min={-1}
                        max={1}
                        step={0.02}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Color Override */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Color Override
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={color || '#ffffff'}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color}
                      placeholder="Use default"
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex-1 h-8 text-xs font-mono"
                    />
                    {color && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => handleColorChange('')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}