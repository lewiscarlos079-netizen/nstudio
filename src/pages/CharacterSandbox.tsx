import { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  RotateCcw,
  Save,
  FolderOpen,
  ChevronDown,
  Brush,
  Move,
  ZoomIn,
  Spline,
  Upload,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  { name: 'Light Skin', color: '#FFDFC4' },
  { name: 'Medium Skin', color: '#D4A574' },
  { name: 'Dark Skin', color: '#8B5A2B' },
  { name: 'Deep Skin', color: '#4A3728' },
  { name: 'Muscle Red', color: '#CD5C5C' },
  { name: 'Deep Muscle', color: '#8B0000' },
  { name: 'Tendon White', color: '#F5F5DC' },
  { name: 'Fat Yellow', color: '#FFE4B5' },
  { name: 'Organ Red', color: '#B22222' },
  { name: 'Vein Blue', color: '#4169E1' },
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

// Default humanoid skeleton
const DEFAULT_JOINTS: JointBall[] = [
  { id: 'j_pelvis', name: 'Pelvis', position: [0, 0, 0], radius: 0.15, color: '#ffffff', connectedTo: [] },
  { id: 'j_spine1', name: 'Spine Base', position: [0, 0.25, 0], radius: 0.12, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_spine2', name: 'Spine Mid', position: [0, 0.5, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j_spine1'] },
  { id: 'j_spine3', name: 'Spine Upper', position: [0, 0.75, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j_spine2'] },
  { id: 'j_chest', name: 'Chest', position: [0, 1.0, 0], radius: 0.14, color: '#ffffff', connectedTo: ['j_spine3'] },
  { id: 'j_neck', name: 'Neck', position: [0, 1.2, 0], radius: 0.08, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_head', name: 'Head', position: [0, 1.4, 0], radius: 0.2, color: '#ffffff', connectedTo: ['j_neck'] },
  { id: 'j_l_shoulder', name: 'L. Shoulder', position: [-0.25, 1.0, 0], radius: 0.08, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_l_elbow', name: 'L. Elbow', position: [-0.45, 0.7, 0], radius: 0.06, color: '#ffffff', connectedTo: ['j_l_shoulder'] },
  { id: 'j_l_wrist', name: 'L. Wrist', position: [-0.6, 0.45, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_l_elbow'] },
  { id: 'j_r_shoulder', name: 'R. Shoulder', position: [0.25, 1.0, 0], radius: 0.08, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_r_elbow', name: 'R. Elbow', position: [0.45, 0.7, 0], radius: 0.06, color: '#ffffff', connectedTo: ['j_r_shoulder'] },
  { id: 'j_r_wrist', name: 'R. Wrist', position: [0.6, 0.45, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_r_elbow'] },
  { id: 'j_l_hip', name: 'L. Hip', position: [-0.12, -0.1, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_l_knee', name: 'L. Knee', position: [-0.12, -0.5, 0], radius: 0.07, color: '#ffffff', connectedTo: ['j_l_hip'] },
  { id: 'j_l_ankle', name: 'L. Ankle', position: [-0.12, -0.9, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_l_knee'] },
  { id: 'j_r_hip', name: 'R. Hip', position: [0.12, -0.1, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_r_knee', name: 'R. Knee', position: [0.12, -0.5, 0], radius: 0.07, color: '#ffffff', connectedTo: ['j_r_hip'] },
  { id: 'j_r_ankle', name: 'R. Ankle', position: [0.12, -0.9, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_r_knee'] },
];

export default function CharacterSandbox() {
  const navigate = useNavigate();
  const { addProceduralModel } = useSceneStore();
  
  const [activeTab, setActiveTab] = useState('joints');
  const [activeTool, setActiveTool] = useState('sculpt');
  const [selectedColor, setSelectedColor] = useState('#CD5C5C');
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  const [characterName, setCharacterName] = useState('Custom Character');
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
  
  const [joints, setJoints] = useState<JointBall[]>(DEFAULT_JOINTS);
  const [bones, setBones] = useState<BoneStructure[]>([]);
  const [clayLayers, setClayLayers] = useState<ClayLayer[]>([]);

  const addJoint = () => {
    const newJoint: JointBall = {
      id: `j_${Date.now()}`,
      name: `Joint ${joints.length + 1}`,
      position: [0, joints.length * 0.2, 0],
      radius: 0.1,
      color: selectedColor,
      connectedTo: joints.length > 0 ? [joints[joints.length - 1].id] : [],
    };
    setJoints([...joints, newJoint]);
    toast.success('Joint added');
  };

  const removeJoint = (id: string) => {
    setJoints(joints.filter(j => j.id !== id));
    setBones(bones.filter(b => b.startJoint !== id && b.endJoint !== id));
    toast.success('Joint removed');
  };

  const addBone = () => {
    if (joints.length < 2) {
      toast.error('Need at least 2 joints to create a bone');
      return;
    }
    const newBone: BoneStructure = {
      id: `b_${Date.now()}`,
      name: `Bone ${bones.length + 1}`,
      startJoint: joints[0].id,
      endJoint: joints[1].id,
      thickness: 0.05,
      segments: 3,
    };
    setBones([...bones, newBone]);
    toast.success('Bone structure added');
  };

  const addClayLayer = (type: ClayLayer['type']) => {
    const newLayer: ClayLayer = {
      id: `c_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      attachedToBone: bones.length > 0 ? bones[0].id : '',
      color: selectedColor,
      thickness: 0.1,
      opacity: 1,
    };
    setClayLayers([...clayLayers, newLayer]);
    toast.success(`${type} layer added`);
  };

  const handleSaveToInventory = () => {
    const data = { 
      name: characterName,
      joints, 
      bones, 
      clayLayers,
      id: `sandbox_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const savedCharacters = JSON.parse(localStorage.getItem('character-inventory') || '[]');
    savedCharacters.push(data);
    localStorage.setItem('character-inventory', JSON.stringify(savedCharacters));
    toast.success('Character saved to inventory!');
  };

  const handleLoad = () => {
    const data = localStorage.getItem('sandbox-character');
    if (data) {
      const parsed = JSON.parse(data);
      setJoints(parsed.joints || DEFAULT_JOINTS);
      setBones(parsed.bones || []);
      setClayLayers(parsed.clayLayers || []);
      setCharacterName(parsed.name || 'Loaded Character');
      toast.success('Character loaded');
    } else {
      toast.error('No saved character found');
    }
  };

  const handleReset = () => {
    setJoints(DEFAULT_JOINTS);
    setBones([]);
    setClayLayers([]);
    setCharacterName('Custom Character');
    toast.success('Reset to default skeleton');
  };

  const handleAddToScene = () => {
    if (joints.length === 0) {
      toast.error('Add at least one joint to create a character');
      return;
    }
    addProceduralModel('humanoid', characterName);
    handleSaveToInventory();
    toast.success('Character added to scene!');
    navigate('/studio');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-b border-border/50 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl flex items-center gap-2">
                  <Bone className="w-6 h-6 text-primary" />
                  Character Sandbox
                </h1>
                <p className="text-sm text-muted-foreground">
                  Build from scratch with joints, bones, and clay layers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Brush className="w-4 h-4 mr-2" />
                    {graftingTools.find(t => t.id === activeTool)?.name}
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sculpting Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {graftingTools.map((tool) => (
                    <DropdownMenuItem
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={activeTool === tool.id ? 'bg-primary/20' : ''}
                    >
                      <tool.icon className="w-4 h-4 mr-2" />
                      {tool.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={handleLoad}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Load
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveToInventory}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handleAddToScene}>
                <Upload className="w-4 h-4 mr-2" />
                Add to Scene
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tool Settings */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Brush Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Size: {brushSize}%</Label>
                    <Slider
                      value={[brushSize]}
                      onValueChange={([val]) => setBrushSize(val)}
                      min={10}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Strength: {brushStrength}%</Label>
                    <Slider
                      value={[brushStrength]}
                      onValueChange={([val]) => setBrushStrength(val)}
                      min={10}
                      max={100}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Palette
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {colorPalette.map((item) => (
                      <button
                        key={item.color}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          selectedColor === item.color 
                            ? 'border-primary scale-110' 
                            : 'border-transparent hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: item.color }}
                        onClick={() => setSelectedColor(item.color)}
                        title={item.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-[500px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="w-5 h-5" />
                      Skeleton Preview
                    </CardTitle>
                    <Input
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="w-48 text-sm"
                      placeholder="Character Name"
                    />
                  </div>
                  <CardDescription>
                    {joints.length} joints • {bones.length} bones • {clayLayers.length} layers
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg h-[380px] relative overflow-hidden">
                  {/* Visual skeleton representation */}
                  <svg viewBox="-1 -1.5 2 3" className="w-full h-full max-w-[300px]">
                    {/* Draw bones as lines */}
                    {joints.map((joint) => 
                      joint.connectedTo.map((parentId) => {
                        const parent = joints.find(j => j.id === parentId);
                        if (!parent) return null;
                        return (
                          <line
                            key={`${joint.id}-${parentId}`}
                            x1={parent.position[0]}
                            y1={-parent.position[1]}
                            x2={joint.position[0]}
                            y2={-joint.position[1]}
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="0.03"
                          />
                        );
                      })
                    )}
                    {/* Draw joints as circles */}
                    {joints.map((joint) => (
                      <circle
                        key={joint.id}
                        cx={joint.position[0]}
                        cy={-joint.position[1]}
                        r={joint.radius}
                        fill={selectedJoint === joint.id ? 'hsl(var(--primary))' : joint.color}
                        stroke={selectedJoint === joint.id ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                        strokeWidth="0.02"
                        className="cursor-pointer transition-colors"
                        onClick={() => setSelectedJoint(joint.id)}
                      />
                    ))}
                  </svg>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel - Components */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-[500px] flex flex-col">
                <CardHeader className="pb-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="joints" className="text-xs">
                        <Circle className="w-3 h-3 mr-1" />
                        Joints
                      </TabsTrigger>
                      <TabsTrigger value="bones" className="text-xs">
                        <Bone className="w-3 h-3 mr-1" />
                        Bones
                      </TabsTrigger>
                      <TabsTrigger value="clay" className="text-xs">
                        <Layers className="w-3 h-3 mr-1" />
                        Clay
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-2">
                    <TabsContent value="joints" className="mt-0 space-y-2">
                      <Button onClick={addJoint} size="sm" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Joint
                      </Button>
                      {joints.map((joint) => (
                        <div
                          key={joint.id}
                          className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                            selectedJoint === joint.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border/50 bg-card/50 hover:bg-muted/30'
                          }`}
                          onClick={() => setSelectedJoint(joint.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{joint.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeJoint(joint.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            r: {joint.radius.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="bones" className="mt-0 space-y-2">
                      <Button onClick={addBone} size="sm" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bone
                      </Button>
                      {bones.map((bone) => (
                        <div
                          key={bone.id}
                          className="p-2 rounded-lg border border-border/50 bg-card/50"
                        >
                          <span className="text-xs font-medium">{bone.name}</span>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {joints.find(j => j.id === bone.startJoint)?.name} → {joints.find(j => j.id === bone.endJoint)?.name}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="clay" className="mt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        {['muscle', 'skin', 'tissue', 'fat'].map((type) => (
                          <Button
                            key={type}
                            onClick={() => addClayLayer(type as ClayLayer['type'])}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {type}
                          </Button>
                        ))}
                      </div>
                      {clayLayers.map((layer) => (
                        <div
                          key={layer.id}
                          className="p-2 rounded-lg border border-border/50 bg-card/50"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="text-xs font-medium">{layer.name}</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
