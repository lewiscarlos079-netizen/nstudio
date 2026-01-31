import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ZoomOut,
  Spline,
  Upload,
  ArrowLeft,
  Trash2,
  Minus,
  RotateCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/store/sceneStore';
import { SkeletonViewport3D } from '@/components/3d/SkeletonViewport3D';

interface JointBall {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
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
  { id: 'smooth', name: 'Smooth', icon: Brush, description: 'Smooth surface irregularities', cursor: 'crosshair' },
  { id: 'sculpt', name: 'Sculpt', icon: Move, description: 'Push and pull clay', cursor: 'move' },
  { id: 'pinch', name: 'Pinch', icon: ZoomIn, description: 'Pinch and crease', cursor: 'grab' },
  { id: 'flatten', name: 'Flatten', icon: Layers, description: 'Flatten surfaces', cursor: 'pointer' },
  { id: 'inflate', name: 'Inflate', icon: Circle, description: 'Inflate/deflate areas', cursor: 'cell' },
  { id: 'crease', name: 'Crease', icon: Spline, description: 'Create sharp creases', cursor: 'crosshair' },
];

// Default humanoid skeleton with rotations
const DEFAULT_JOINTS: JointBall[] = [
  { id: 'j_pelvis', name: 'Pelvis', position: [0, 0, 0], rotation: [0, 0, 0], radius: 0.08, color: '#ffffff', connectedTo: [] },
  { id: 'j_spine1', name: 'Spine Base', position: [0, 0.15, 0], rotation: [0, 0, 0], radius: 0.06, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_spine2', name: 'Spine Mid', position: [0, 0.3, 0], rotation: [0, 0, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_spine1'] },
  { id: 'j_spine3', name: 'Spine Upper', position: [0, 0.45, 0], rotation: [0, 0, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_spine2'] },
  { id: 'j_chest', name: 'Chest', position: [0, 0.6, 0], rotation: [0, 0, 0], radius: 0.07, color: '#ffffff', connectedTo: ['j_spine3'] },
  { id: 'j_neck', name: 'Neck', position: [0, 0.72, 0], rotation: [0, 0, 0], radius: 0.04, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_head', name: 'Head', position: [0, 0.88, 0], rotation: [0, 0, 0], radius: 0.1, color: '#ffffff', connectedTo: ['j_neck'] },
  { id: 'j_l_shoulder', name: 'L. Shoulder', position: [-0.18, 0.6, 0], rotation: [0, 0, 0], radius: 0.045, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_l_elbow', name: 'L. Elbow', position: [-0.32, 0.42, 0], rotation: [0, 0, 0], radius: 0.035, color: '#ffffff', connectedTo: ['j_l_shoulder'] },
  { id: 'j_l_wrist', name: 'L. Wrist', position: [-0.42, 0.28, 0], rotation: [0, 0, 0], radius: 0.025, color: '#ffffff', connectedTo: ['j_l_elbow'] },
  { id: 'j_l_hand', name: 'L. Hand', position: [-0.48, 0.2, 0], rotation: [0, 0, 0], radius: 0.03, color: '#ffffff', connectedTo: ['j_l_wrist'] },
  { id: 'j_r_shoulder', name: 'R. Shoulder', position: [0.18, 0.6, 0], rotation: [0, 0, 0], radius: 0.045, color: '#ffffff', connectedTo: ['j_chest'] },
  { id: 'j_r_elbow', name: 'R. Elbow', position: [0.32, 0.42, 0], rotation: [0, 0, 0], radius: 0.035, color: '#ffffff', connectedTo: ['j_r_shoulder'] },
  { id: 'j_r_wrist', name: 'R. Wrist', position: [0.42, 0.28, 0], rotation: [0, 0, 0], radius: 0.025, color: '#ffffff', connectedTo: ['j_r_elbow'] },
  { id: 'j_r_hand', name: 'R. Hand', position: [0.48, 0.2, 0], rotation: [0, 0, 0], radius: 0.03, color: '#ffffff', connectedTo: ['j_r_wrist'] },
  { id: 'j_l_hip', name: 'L. Hip', position: [-0.1, -0.08, 0], rotation: [0, 0, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_l_knee', name: 'L. Knee', position: [-0.1, -0.38, 0], rotation: [0, 0, 0], radius: 0.04, color: '#ffffff', connectedTo: ['j_l_hip'] },
  { id: 'j_l_ankle', name: 'L. Ankle', position: [-0.1, -0.68, 0], rotation: [0, 0, 0], radius: 0.03, color: '#ffffff', connectedTo: ['j_l_knee'] },
  { id: 'j_l_foot', name: 'L. Foot', position: [-0.1, -0.75, 0.08], rotation: [0, 0, 0], radius: 0.035, color: '#ffffff', connectedTo: ['j_l_ankle'] },
  { id: 'j_r_hip', name: 'R. Hip', position: [0.1, -0.08, 0], rotation: [0, 0, 0], radius: 0.05, color: '#ffffff', connectedTo: ['j_pelvis'] },
  { id: 'j_r_knee', name: 'R. Knee', position: [0.1, -0.38, 0], rotation: [0, 0, 0], radius: 0.04, color: '#ffffff', connectedTo: ['j_r_hip'] },
  { id: 'j_r_ankle', name: 'R. Ankle', position: [0.1, -0.68, 0], rotation: [0, 0, 0], radius: 0.03, color: '#ffffff', connectedTo: ['j_r_knee'] },
  { id: 'j_r_foot', name: 'R. Foot', position: [0.1, -0.75, 0.08], rotation: [0, 0, 0], radius: 0.035, color: '#ffffff', connectedTo: ['j_r_ankle'] },
];

export default function CharacterSandbox() {
  const navigate = useNavigate();
  const { addProceduralModel } = useSceneStore();
  
  const [activeTab, setActiveTab] = useState('joints');
  const [activeTool, setActiveTool] = useState('sculpt');
  const [selectedColor, setSelectedColor] = useState('#CD5C5C');
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  const [brushFalloff, setBrushFalloff] = useState(50);
  const [mirrorMode, setMirrorMode] = useState(true);
  const [characterName, setCharacterName] = useState('Custom Character');
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
  const [zoom, setZoom] = useState(50);
  
  const [joints, setJoints] = useState<JointBall[]>(DEFAULT_JOINTS);
  const [bones, setBones] = useState<BoneStructure[]>([]);
  const [clayLayers, setClayLayers] = useState<ClayLayer[]>([]);

  // Joint manipulation
  const updateJointPosition = (id: string, axis: 'x' | 'y' | 'z', delta: number) => {
    setJoints(joints.map(j => {
      if (j.id !== id) return j;
      const newPos: [number, number, number] = [...j.position];
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      newPos[axisIndex] += delta;
      return { ...j, position: newPos };
    }));
  };

  const updateJointRotation = (id: string, axis: 'x' | 'y' | 'z', delta: number) => {
    setJoints(joints.map(j => {
      if (j.id !== id) return j;
      const newRot: [number, number, number] = [...j.rotation];
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      newRot[axisIndex] += delta;
      return { ...j, rotation: newRot };
    }));
  };

  const updateJointRadius = (id: string, radius: number) => {
    setJoints(joints.map(j => j.id === id ? { ...j, radius } : j));
  };

  const addJoint = () => {
    const newJoint: JointBall = {
      id: `j_${Date.now()}`,
      name: `Joint ${joints.length + 1}`,
      position: [0, joints.length * 0.15, 0],
      rotation: [0, 0, 0],
      radius: 0.05,
      color: selectedColor,
      connectedTo: joints.length > 0 ? [joints[joints.length - 1].id] : [],
    };
    setJoints([...joints, newJoint]);
    setSelectedJoint(newJoint.id);
    toast.success('Joint added');
  };

  const removeJoint = (id: string) => {
    setJoints(joints.filter(j => j.id !== id));
    setBones(bones.filter(b => b.startJoint !== id && b.endJoint !== id));
    if (selectedJoint === id) setSelectedJoint(null);
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
      thickness: 0.03,
      segments: 3,
    };
    setBones([...bones, newBone]);
    toast.success('Bone structure added');
  };

  const updateBone = (id: string, updates: Partial<BoneStructure>) => {
    setBones(bones.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBone = (id: string) => {
    setBones(bones.filter(b => b.id !== id));
    toast.success('Bone removed');
  };

  const addClayLayer = (type: ClayLayer['type']) => {
    const newLayer: ClayLayer = {
      id: `c_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      attachedToBone: bones.length > 0 ? bones[0].id : '',
      color: selectedColor,
      thickness: 0.06,
      opacity: 1,
    };
    setClayLayers([...clayLayers, newLayer]);
    toast.success(`${type} layer added`);
  };

  const updateClayLayer = (id: string, updates: Partial<ClayLayer>) => {
    setClayLayers(clayLayers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeClayLayer = (id: string) => {
    setClayLayers(clayLayers.filter(l => l.id !== id));
    toast.success('Layer removed');
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
    const inventory = JSON.parse(localStorage.getItem('character-inventory') || '[]');
    if (inventory.length > 0) {
      const latest = inventory[inventory.length - 1];
      setJoints(latest.joints || DEFAULT_JOINTS);
      setBones(latest.bones || []);
      setClayLayers(latest.clayLayers || []);
      setCharacterName(latest.name || 'Loaded Character');
      toast.success('Character loaded from inventory');
    } else {
      toast.error('No saved characters found');
    }
  };

  const handleReset = () => {
    setJoints(DEFAULT_JOINTS);
    setBones([]);
    setClayLayers([]);
    setCharacterName('Custom Character');
    setSelectedJoint(null);
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

  const selectedJointData = selectedJoint ? joints.find(j => j.id === selectedJoint) : null;

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
                  Build from scratch with 3D joints, bones, and clay layers
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
                      <span className="text-xs text-muted-foreground ml-2">
                        {tool.description}
                      </span>
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
              className="space-y-4"
            >
              {/* Brush Settings */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brush className="w-4 h-4" />
                    Brush Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Size</Label>
                      <span className="text-xs text-muted-foreground">{brushSize}%</span>
                    </div>
                    <Slider
                      value={[brushSize]}
                      onValueChange={([val]) => setBrushSize(val)}
                      min={5}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Strength</Label>
                      <span className="text-xs text-muted-foreground">{brushStrength}%</span>
                    </div>
                    <Slider
                      value={[brushStrength]}
                      onValueChange={([val]) => setBrushStrength(val)}
                      min={5}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Falloff</Label>
                      <span className="text-xs text-muted-foreground">{brushFalloff}%</span>
                    </div>
                    <Slider
                      value={[brushFalloff]}
                      onValueChange={([val]) => setBrushFalloff(val)}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Label className="text-xs">Mirror (X-Axis)</Label>
                    <Switch checked={mirrorMode} onCheckedChange={setMirrorMode} />
                  </div>
                </CardContent>
              </Card>

              {/* Zoom Control */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    Viewport Zoom
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoom(Math.max(10, zoom - 10))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[zoom]}
                      onValueChange={([val]) => setZoom(val)}
                      min={10}
                      max={100}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoom(Math.min(100, zoom + 10))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    {zoom}%
                  </div>
                </CardContent>
              </Card>

              {/* Color Palette */}
              <Card>
                <CardHeader className="pb-2">
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
                            ? 'border-primary scale-110 shadow-lg' 
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

            {/* 3D Preview Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="w-5 h-5" />
                      3D Skeleton Preview
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
                <CardContent className="flex-1 p-2">
                  <SkeletonViewport3D
                    joints={joints}
                    bones={bones}
                    clayLayers={clayLayers}
                    selectedJoint={selectedJoint}
                    onSelectJoint={setSelectedJoint}
                    zoom={zoom}
                    brushSize={brushSize}
                    brushStrength={brushStrength}
                    activeTool={activeTool}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel - Components */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-[600px] flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
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
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-2">
                    <ScrollArea className="h-full pr-2">
                      <TabsContent value="joints" className="mt-0 space-y-2">
                        <Button onClick={addJoint} size="sm" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Joint
                        </Button>
                        
                        {/* Selected Joint Editor */}
                        {selectedJointData && (
                          <Card className="border-primary bg-primary/5">
                            <CardHeader className="py-2 px-3">
                              <CardTitle className="text-xs">{selectedJointData.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-3 space-y-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Radius</Label>
                                <Slider
                                  value={[selectedJointData.radius * 100]}
                                  onValueChange={([val]) => updateJointRadius(selectedJointData.id, val / 100)}
                                  min={1}
                                  max={20}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-[10px]">
                                <div className="text-center">
                                  <Label className="text-muted-foreground">X</Label>
                                  <div className="flex gap-0.5">
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'x', -0.02)}>
                                      <Minus className="w-2 h-2" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'x', 0.02)}>
                                      <Plus className="w-2 h-2" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <Label className="text-muted-foreground">Y</Label>
                                  <div className="flex gap-0.5">
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'y', -0.02)}>
                                      <Minus className="w-2 h-2" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'y', 0.02)}>
                                      <Plus className="w-2 h-2" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <Label className="text-muted-foreground">Z</Label>
                                  <div className="flex gap-0.5">
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'z', -0.02)}>
                                      <Minus className="w-2 h-2" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointPosition(selectedJointData.id, 'z', 0.02)}>
                                      <Plus className="w-2 h-2" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-[10px]">
                                <div className="text-center">
                                  <Label className="text-muted-foreground">Rot X</Label>
                                  <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointRotation(selectedJointData.id, 'x', 15)}>
                                    <RotateCw className="w-2 h-2" />
                                  </Button>
                                </div>
                                <div className="text-center">
                                  <Label className="text-muted-foreground">Rot Y</Label>
                                  <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointRotation(selectedJointData.id, 'y', 15)}>
                                    <RotateCw className="w-2 h-2" />
                                  </Button>
                                </div>
                                <div className="text-center">
                                  <Label className="text-muted-foreground">Rot Z</Label>
                                  <Button size="icon" variant="outline" className="h-5 w-5" onClick={() => updateJointRotation(selectedJointData.id, 'z', 15)}>
                                    <RotateCw className="w-2 h-2" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        
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
                              r: {joint.radius.toFixed(2)} | pos: [{joint.position.map(p => p.toFixed(2)).join(', ')}]
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="bones" className="mt-0 space-y-2">
                        <Button onClick={addBone} size="sm" className="w-full" disabled={joints.length < 2}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bone
                        </Button>
                        {joints.length < 2 && (
                          <p className="text-xs text-muted-foreground text-center">
                            Need at least 2 joints
                          </p>
                        )}
                        {bones.map((bone) => (
                          <div
                            key={bone.id}
                            className="p-2 rounded-lg border border-border/50 bg-card/50 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{bone.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeBone(bone.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <Select
                                value={bone.startJoint}
                                onValueChange={(val) => updateBone(bone.id, { startJoint: val })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Start" />
                                </SelectTrigger>
                                <SelectContent>
                                  {joints.map((j) => (
                                    <SelectItem key={j.id} value={j.id} className="text-xs">
                                      {j.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={bone.endJoint}
                                onValueChange={(val) => updateBone(bone.id, { endJoint: val })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="End" />
                                </SelectTrigger>
                                <SelectContent>
                                  {joints.map((j) => (
                                    <SelectItem key={j.id} value={j.id} className="text-xs">
                                      {j.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Thickness: {bone.thickness.toFixed(2)}</Label>
                              <Slider
                                value={[bone.thickness * 100]}
                                onValueChange={([val]) => updateBone(bone.id, { thickness: val / 100 })}
                                min={1}
                                max={15}
                              />
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
                            className="p-2 rounded-lg border border-border/50 bg-card/50 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: layer.color }}
                                />
                                <span className="text-xs font-medium">{layer.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeClayLayer(layer.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            {bones.length > 0 && (
                              <Select
                                value={layer.attachedToBone}
                                onValueChange={(val) => updateClayLayer(layer.id, { attachedToBone: val })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Attach to bone" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bones.map((b) => (
                                    <SelectItem key={b.id} value={b.id} className="text-xs">
                                      {b.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <div className="space-y-1">
                              <Label className="text-[10px]">Thickness: {layer.thickness.toFixed(2)}</Label>
                              <Slider
                                value={[layer.thickness * 100]}
                                onValueChange={([val]) => updateClayLayer(layer.id, { thickness: val / 100 })}
                                min={1}
                                max={20}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Opacity: {(layer.opacity * 100).toFixed(0)}%</Label>
                              <Slider
                                value={[layer.opacity * 100]}
                                onValueChange={([val]) => updateClayLayer(layer.id, { opacity: val / 100 })}
                                min={10}
                                max={100}
                              />
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </ScrollArea>
                  </CardContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
