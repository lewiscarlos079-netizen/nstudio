import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bone,
  Circle,
  Layers,
  Palette,
  Plus,
  Minus,
  RotateCcw,
  Save,
  FolderOpen,
  ChevronDown,
  Brush,
  Eraser,
  Move,
  ZoomIn,
  Spline,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSceneStore } from '@/store/sceneStore';

interface JointBall {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  connectedTo: string[];
}

interface BoneStructure {
  id: string;
  name: string;
  startJoint: string;
  endJoint: string;
  thickness: number;
  segments: number;
}

interface ClayLayer {
  id: string;
  name: string;
  type: 'muscle' | 'skin' | 'tissue' | 'fat';
  attachedToBone: string;
  color: string;
  thickness: number;
  opacity: number;
}

const colorPalette = [
  // Skin tones
  { name: 'Light Skin', color: '#FFDFC4' },
  { name: 'Medium Skin', color: '#D4A574' },
  { name: 'Dark Skin', color: '#8B5A2B' },
  { name: 'Deep Skin', color: '#4A3728' },
  // Muscle tones
  { name: 'Muscle Red', color: '#CD5C5C' },
  { name: 'Deep Muscle', color: '#8B0000' },
  { name: 'Tendon White', color: '#F5F5DC' },
  // Tissue tones
  { name: 'Fat Yellow', color: '#FFE4B5' },
  { name: 'Organ Red', color: '#B22222' },
  { name: 'Vein Blue', color: '#4169E1' },
  // Fantasy colors
  { name: 'Alien Green', color: '#00FA9A' },
  { name: 'Robot Silver', color: '#C0C0C0' },
  { name: 'Demon Black', color: '#1A1A1A' },
  { name: 'Angel Gold', color: '#FFD700' },
  { name: 'Ice Blue', color: '#87CEEB' },
  { name: 'Lava Orange', color: '#FF4500' },
];

const graftingTools = [
  { id: 'smooth', name: 'Smooth', icon: Brush, description: 'Smooth surface irregularities' },
  { id: 'sculpt', name: 'Sculpt', icon: Move, description: 'Push and pull clay' },
  { id: 'pinch', name: 'Pinch', icon: ZoomIn, description: 'Pinch and crease' },
  { id: 'flatten', name: 'Flatten', icon: Layers, description: 'Flatten surfaces' },
  { id: 'inflate', name: 'Inflate', icon: Circle, description: 'Inflate/deflate areas' },
  { id: 'crease', name: 'Crease', icon: Spline, description: 'Create sharp creases' },
];

export function SandboxBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('joints');
  const [activeTool, setActiveTool] = useState('sculpt');
  const [selectedColor, setSelectedColor] = useState('#CD5C5C');
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  
  const [joints, setJoints] = useState<JointBall[]>([
    { id: 'j1', name: 'Pelvis', position: [0, 0, 0], radius: 0.15, color: '#ffffff', connectedTo: [] },
    { id: 'j2', name: 'Spine Base', position: [0, 0.3, 0], radius: 0.12, color: '#ffffff', connectedTo: ['j1'] },
    { id: 'j3', name: 'Spine Mid', position: [0, 0.6, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j2'] },
    { id: 'j4', name: 'Chest', position: [0, 0.9, 0], radius: 0.14, color: '#ffffff', connectedTo: ['j3'] },
    { id: 'j5', name: 'Neck', position: [0, 1.1, 0], radius: 0.08, color: '#ffffff', connectedTo: ['j4'] },
    { id: 'j6', name: 'Head', position: [0, 1.3, 0], radius: 0.2, color: '#ffffff', connectedTo: ['j5'] },
  ]);
  
  const [bones, setBones] = useState<BoneStructure[]>([
    { id: 'b1', name: 'Spine Lower', startJoint: 'j1', endJoint: 'j2', thickness: 0.05, segments: 3 },
    { id: 'b2', name: 'Spine Middle', startJoint: 'j2', endJoint: 'j3', thickness: 0.04, segments: 3 },
    { id: 'b3', name: 'Spine Upper', startJoint: 'j3', endJoint: 'j4', thickness: 0.04, segments: 3 },
    { id: 'b4', name: 'Neck Bone', startJoint: 'j4', endJoint: 'j5', thickness: 0.03, segments: 2 },
  ]);
  
  const [clayLayers, setClayLayers] = useState<ClayLayer[]>([]);

  const addJoint = () => {
    const newJoint: JointBall = {
      id: `j${Date.now()}`,
      name: `Joint ${joints.length + 1}`,
      position: [0, 0, 0],
      radius: 0.1,
      color: '#ffffff',
      connectedTo: [],
    };
    setJoints([...joints, newJoint]);
    toast.success('Joint added');
  };

  const addBone = () => {
    if (joints.length < 2) {
      toast.error('Need at least 2 joints to create a bone');
      return;
    }
    const newBone: BoneStructure = {
      id: `b${Date.now()}`,
      name: `Bone ${bones.length + 1}`,
      startJoint: joints[0].id,
      endJoint: joints[1].id,
      thickness: 0.05,
      segments: 3,
    };
    setBones([...bones, newBone]);
    toast.success('Bone added');
  };

  const addClayLayer = (type: ClayLayer['type']) => {
    if (bones.length === 0) {
      toast.error('Need at least 1 bone to add clay');
      return;
    }
    const newLayer: ClayLayer = {
      id: `c${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      attachedToBone: bones[0].id,
      color: selectedColor,
      thickness: 0.1,
      opacity: 1,
    };
    setClayLayers([...clayLayers, newLayer]);
    toast.success(`${type} layer added`);
  };

  const { addProceduralModel } = useSceneStore();

  const handleSave = () => {
    const data = { joints, bones, clayLayers };
    localStorage.setItem('sandbox-character', JSON.stringify(data));
    toast.success('Character saved to sandbox');
  };

  const handleLoad = () => {
    const data = localStorage.getItem('sandbox-character');
    if (data) {
      const parsed = JSON.parse(data);
      setJoints(parsed.joints || []);
      setBones(parsed.bones || []);
      setClayLayers(parsed.clayLayers || []);
      toast.success('Character loaded');
    } else {
      toast.error('No saved character found');
    }
  };

  const handleReset = () => {
    setJoints([]);
    setBones([]);
    setClayLayers([]);
    toast.success('Character reset');
  };

  // Add character to scene
  const handleAddToScene = () => {
    if (joints.length === 0) {
      toast.error('Add at least one joint to create a character');
      return;
    }
    // Add a humanoid model to scene
    addProceduralModel('humanoid', `Custom_Character_${Date.now()}`);
    toast.success('Character added to scene!', {
      description: 'Your character has been placed in the 3D viewport.'
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bone className="w-4 h-4" />
          Character Sandbox
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[500px] sm:w-[600px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display flex items-center gap-2">
            <Bone className="w-5 h-5 text-primary" />
            Character Sandbox Builder
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Create characters with joint balls, bones, and clay layers
          </SheetDescription>
        </SheetHeader>

        {/* Toolbar */}
        <div className="p-3 border-b border-border/50 flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm" onClick={handleAddToScene} className="gap-1">
            <Upload className="w-4 h-4" />
            Add to Scene
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoad}>
            <FolderOpen className="w-4 h-4 mr-1" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          
          {/* Grafting Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Brush className="w-4 h-4" />
                Tools
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Grafting Tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {graftingTools.map((tool) => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={activeTool === tool.id ? 'bg-primary/20' : ''}
                >
                  <tool.icon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{tool.name}</span>
                    <span className="text-[10px] text-muted-foreground">{tool.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Brush Settings */}
        <div className="p-3 border-b border-border/50 space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Brush Size: {brushSize}%</Label>
              <Slider
                value={[brushSize]}
                onValueChange={([val]) => setBrushSize(val)}
                min={10}
                max={100}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Strength: {brushStrength}%</Label>
              <Slider
                value={[brushStrength]}
                onValueChange={([val]) => setBrushStrength(val)}
                min={10}
                max={100}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-3 mt-3">
            <TabsTrigger value="joints" className="gap-1 text-xs">
              <Circle className="w-3 h-3" />
              Joints ({joints.length})
            </TabsTrigger>
            <TabsTrigger value="bones" className="gap-1 text-xs">
              <Bone className="w-3 h-3" />
              Bones ({bones.length})
            </TabsTrigger>
            <TabsTrigger value="clay" className="gap-1 text-xs">
              <Layers className="w-3 h-3" />
              Clay ({clayLayers.length})
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-1 text-xs">
              <Palette className="w-3 h-3" />
              Palette
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-3">
            {/* Joints Tab */}
            <TabsContent value="joints" className="mt-0 space-y-3">
              <Button onClick={addJoint} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Joint Ball
              </Button>
              
              {joints.map((joint) => (
                <motion.div
                  key={joint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-border/50 bg-card/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{joint.name}</span>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: joint.color }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>X: {joint.position[0].toFixed(2)}</span>
                    <span>Y: {joint.position[1].toFixed(2)}</span>
                    <span>Z: {joint.position[2].toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <Label className="text-xs">Radius: {joint.radius}</Label>
                    <Slider
                      value={[joint.radius * 100]}
                      onValueChange={([val]) => {
                        setJoints(joints.map(j =>
                          j.id === joint.id ? { ...j, radius: val / 100 } : j
                        ));
                      }}
                      min={5}
                      max={50}
                    />
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Bones Tab */}
            <TabsContent value="bones" className="mt-0 space-y-3">
              <Button onClick={addBone} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Bone Structure
              </Button>
              
              {bones.map((bone) => (
                <motion.div
                  key={bone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-border/50 bg-card/50"
                >
                  <span className="font-medium text-sm">{bone.name}</span>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Start: {joints.find(j => j.id === bone.startJoint)?.name}</span>
                    <span>End: {joints.find(j => j.id === bone.endJoint)?.name}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label className="text-xs">Thickness</Label>
                      <Slider
                        value={[bone.thickness * 100]}
                        onValueChange={([val]) => {
                          setBones(bones.map(b =>
                            b.id === bone.id ? { ...b, thickness: val / 100 } : b
                          ));
                        }}
                        min={1}
                        max={20}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Segments: {bone.segments}</Label>
                      <Slider
                        value={[bone.segments]}
                        onValueChange={([val]) => {
                          setBones(bones.map(b =>
                            b.id === bone.id ? { ...b, segments: val } : b
                          ));
                        }}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Clay Tab */}
            <TabsContent value="clay" className="mt-0 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => addClayLayer('muscle')} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Muscle
                </Button>
                <Button onClick={() => addClayLayer('skin')} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Skin
                </Button>
                <Button onClick={() => addClayLayer('tissue')} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tissue
                </Button>
                <Button onClick={() => addClayLayer('fat')} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Fat
                </Button>
              </div>
              
              {clayLayers.map((layer) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-border/50 bg-card/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{layer.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize">{layer.type}</span>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Thickness</Label>
                      <Slider
                        value={[layer.thickness * 100]}
                        onValueChange={([val]) => {
                          setClayLayers(clayLayers.map(c =>
                            c.id === layer.id ? { ...c, thickness: val / 100 } : c
                          ));
                        }}
                        min={1}
                        max={50}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Opacity: {Math.round(layer.opacity * 100)}%</Label>
                      <Slider
                        value={[layer.opacity * 100]}
                        onValueChange={([val]) => {
                          setClayLayers(clayLayers.map(c =>
                            c.id === layer.id ? { ...c, opacity: val / 100 } : c
                          ));
                        }}
                        min={10}
                        max={100}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Color Palette Tab */}
            <TabsContent value="colors" className="mt-0 space-y-3">
              <Label className="text-sm font-medium">Extensive Color Palette</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorPalette.map((item) => (
                  <Button
                    key={item.color}
                    variant="outline"
                    className={`h-auto py-2 flex flex-col gap-1 ${
                      selectedColor === item.color ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedColor(item.color)}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">
                      {item.name}
                    </span>
                  </Button>
                ))}
              </div>
              
              {/* Custom color picker */}
              <div className="mt-4">
                <Label className="text-sm">Custom Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-1 font-mono uppercase"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
