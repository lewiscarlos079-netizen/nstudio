import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { 
  Palette, 
  Maximize2, 
  RotateCcw, 
  Save, 
  Shirt,
  User,
  Footprints,
  Hand,
  Circle
} from 'lucide-react';
import { ModelAsset } from '@/hooks/useModelAssets';
import { 
  HumanoidModel,
  DogModel, 
  CatModel, 
  ElephantModel, 
  LionModel, 
  HorseModel, 
  WolfModel,
  DolphinModel,
  WhaleModel,
  BirdModel,
  RaccoonModel,
} from '@/components/3d/ProceduralModels';
import { toast } from 'sonner';

interface ModelEditModalProps {
  model: ModelAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Body part configurations per model category
const BODY_PARTS_CONFIG: Record<string, { part: string; label: string; icon: React.ComponentType<any> }[]> = {
  character: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'face', label: 'Face', icon: User },
    { part: 'torso', label: 'Torso', icon: User },
    { part: 'leftArm', label: 'Left Arm', icon: Hand },
    { part: 'rightArm', label: 'Right Arm', icon: Hand },
    { part: 'leftLeg', label: 'Left Leg', icon: Footprints },
    { part: 'rightLeg', label: 'Right Leg', icon: Footprints },
  ],
  animal: [
    { part: 'head', label: 'Head', icon: Circle },
    { part: 'ears', label: 'Ears', icon: Circle },
    { part: 'torso', label: 'Body', icon: User },
    { part: 'leftFrontLeg', label: 'Front Left', icon: Footprints },
    { part: 'rightFrontLeg', label: 'Front Right', icon: Footprints },
    { part: 'leftBackLeg', label: 'Back Left', icon: Footprints },
    { part: 'rightBackLeg', label: 'Back Right', icon: Footprints },
    { part: 'tail', label: 'Tail', icon: Footprints },
  ],
};

// Color presets for quick selection
const COLOR_PRESETS = {
  skin: ['#F5DEB3', '#DEB887', '#D2B48C', '#8B7355', '#6B4423', '#3D2314'],
  clothing: ['#1E3A5F', '#8B0000', '#006400', '#4B0082', '#2F2F2F', '#F5F5DC'],
  fur: ['#D2691E', '#8B4513', '#A0522D', '#696969', '#F5F5DC', '#2F2F2F'],
  accent: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'],
};

// Map model IDs to components for preview
const MODEL_PREVIEW: Record<string, React.FC<any>> = {
  humanoid_male: HumanoidModel,
  humanoid_female: HumanoidModel,
  dog_golden_retriever: DogModel,
  cat_domestic: CatModel,
  elephant_african: ElephantModel,
  lion_african: LionModel,
  horse_arabian: HorseModel,
  wolf_gray: WolfModel,
  dolphin_bottlenose: DolphinModel,
  shark_great_white: WhaleModel,
  raccoon: RaccoonModel,
  eagle_bald: BirdModel,
};

function FallbackPreview() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#00d4ff" />
    </mesh>
  );
}

export function ModelEditModal({ model, open, onOpenChange }: ModelEditModalProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState<Record<string, {
    scale: [number, number, number];
    color: string;
  }>>({});
  
  // Global model settings
  const [globalScale, setGlobalScale] = useState(1);
  const [shirtColor, setShirtColor] = useState('#1E3A5F');
  const [pantsColor, setPantsColor] = useState('#2F2F2F');
  const [skinColor, setSkinColor] = useState('#DEB887');
  const [furColor, setFurColor] = useState('#D2691E');

  const bodyParts = useMemo(() => {
    if (!model) return [];
    if (model.category === 'character') return BODY_PARTS_CONFIG.character;
    if (model.category === 'animal') return BODY_PARTS_CONFIG.animal;
    return BODY_PARTS_CONFIG.character;
  }, [model]);

  const currentPartConfig = selectedPart ? customizations[selectedPart] : null;

  const handleScaleChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedPart) return;
    setCustomizations(prev => ({
      ...prev,
      [selectedPart]: {
        ...prev[selectedPart],
        scale: [
          axis === 0 ? value : (prev[selectedPart]?.scale?.[0] ?? 1),
          axis === 1 ? value : (prev[selectedPart]?.scale?.[1] ?? 1),
          axis === 2 ? value : (prev[selectedPart]?.scale?.[2] ?? 1),
        ] as [number, number, number],
        color: prev[selectedPart]?.color ?? '',
      }
    }));
  };

  const handlePartColorChange = (color: string) => {
    if (!selectedPart) return;
    setCustomizations(prev => ({
      ...prev,
      [selectedPart]: {
        ...prev[selectedPart],
        scale: prev[selectedPart]?.scale ?? [1, 1, 1],
        color,
      }
    }));
  };

  const handleReset = () => {
    setCustomizations({});
    setGlobalScale(1);
    setShirtColor('#1E3A5F');
    setPantsColor('#2F2F2F');
    setSkinColor('#DEB887');
    setFurColor('#D2691E');
    setSelectedPart(null);
  };

  const handleSave = () => {
    toast.success(`Customizations saved for ${model?.name}`);
    onOpenChange(false);
  };

  const PreviewComponent = model ? MODEL_PREVIEW[model.model_id] || FallbackPreview : FallbackPreview;
  const isCharacter = model?.category === 'character';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-xl">
                Edit Model: {model?.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customize appearance, colors, and proportions
              </p>
            </div>
            <Badge variant="outline" className="capitalize">{model?.category}</Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* 3D Preview Panel */}
          <div className="w-1/2 bg-gradient-to-b from-muted/30 to-muted/60 relative">
            <Canvas
              gl={{ antialias: true, alpha: true }}
              dpr={2}
              frameloop="always"
            >
              <PerspectiveCamera makeDefault position={[2, 1.5, 2]} fov={40} />
              <ambientLight intensity={0.5} color="#ffeedd" />
              <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5e6" />
              <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#aaccff" />
              <hemisphereLight args={['#87ceeb', '#8b4513', 0.3]} />
              
              <Suspense fallback={null}>
                <group scale={globalScale}>
                  <PreviewComponent style="standard" />
                </group>
              </Suspense>
              
              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                minDistance={1}
                maxDistance={5}
              />
            </Canvas>
            
            {/* Preview controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <Badge variant="secondary" className="text-xs">
                Drag to rotate • Scroll to zoom
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="glass" onClick={() => setGlobalScale(1)}>
                  Reset View
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="w-1/2 flex flex-col border-l border-border">
            <Tabs defaultValue="appearance" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger 
                  value="appearance" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="parts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Body Parts
                </TabsTrigger>
                <TabsTrigger 
                  value="clothing"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  disabled={!isCharacter}
                >
                  <Shirt className="w-4 h-4 mr-2" />
                  Clothing
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                {/* Appearance Tab */}
                <TabsContent value="appearance" className="p-4 space-y-6 mt-0">
                  {/* Global Scale */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">Overall Scale</Label>
                      <span className="ml-auto text-sm font-mono text-muted-foreground">
                        {globalScale.toFixed(2)}x
                      </span>
                    </div>
                    <Slider
                      value={[globalScale]}
                      onValueChange={([v]) => setGlobalScale(v)}
                      min={0.5}
                      max={2}
                      step={0.05}
                    />
                  </div>

                  <Separator />

                  {/* Primary Color */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {isCharacter ? 'Skin Tone' : 'Primary Color'}
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {(isCharacter ? COLOR_PRESETS.skin : COLOR_PRESETS.fur).map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            (isCharacter ? skinColor : furColor) === color 
                              ? 'border-primary scale-110' 
                              : 'border-transparent hover:border-muted-foreground'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => isCharacter ? setSkinColor(color) : setFurColor(color)}
                        />
                      ))}
                      <Input
                        type="color"
                        value={isCharacter ? skinColor : furColor}
                        onChange={(e) => isCharacter ? setSkinColor(e.target.value) : setFurColor(e.target.value)}
                        className="w-8 h-8 p-0.5 cursor-pointer rounded-full"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Accent Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_PRESETS.accent.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-muted-foreground transition-all"
                          style={{ backgroundColor: color }}
                          onClick={() => toast.info(`Accent color: ${color}`)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Body Parts Tab */}
                <TabsContent value="parts" className="p-4 space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {bodyParts.map(({ part, label, icon: Icon }) => (
                      <Button
                        key={part}
                        variant={selectedPart === part ? "default" : "outline"}
                        size="sm"
                        className="justify-start gap-2 h-9"
                        onClick={() => setSelectedPart(selectedPart === part ? null : part)}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedPart && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <Separator />
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Scale: {bodyParts.find(p => p.part === selectedPart)?.label}
                          </Label>
                          {['X', 'Y', 'Z'].map((axis, i) => (
                            <div key={axis} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{axis}</span>
                                <span className="font-mono">
                                  {(currentPartConfig?.scale?.[i] ?? 1).toFixed(2)}
                                </span>
                              </div>
                              <Slider
                                value={[currentPartConfig?.scale?.[i] ?? 1]}
                                onValueChange={([v]) => handleScaleChange(i as 0 | 1 | 2, v)}
                                min={0.5}
                                max={2}
                                step={0.05}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Part Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={currentPartConfig?.color || '#ffffff'}
                              onChange={(e) => handlePartColorChange(e.target.value)}
                              className="w-12 h-9 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={currentPartConfig?.color || ''}
                              placeholder="Default"
                              onChange={(e) => handlePartColorChange(e.target.value)}
                              className="flex-1 h-9 text-sm font-mono"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Clothing Tab (Characters only) */}
                <TabsContent value="clothing" className="p-4 space-y-6 mt-0">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Shirt Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_PRESETS.clothing.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            shirtColor === color 
                              ? 'border-primary scale-110' 
                              : 'border-transparent hover:border-muted-foreground'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setShirtColor(color)}
                        />
                      ))}
                      <Input
                        type="color"
                        value={shirtColor}
                        onChange={(e) => setShirtColor(e.target.value)}
                        className="w-8 h-8 p-0.5 cursor-pointer rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Pants Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_PRESETS.clothing.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            pantsColor === color 
                              ? 'border-primary scale-110' 
                              : 'border-transparent hover:border-muted-foreground'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setPantsColor(color)}
                        />
                      ))}
                      <Input
                        type="color"
                        value={pantsColor}
                        onChange={(e) => setPantsColor(e.target.value)}
                        className="w-8 h-8 p-0.5 cursor-pointer rounded-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border flex justify-between">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="cyber" onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
