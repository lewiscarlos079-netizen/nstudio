import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  User,
  Palette,
  Shirt,
  Wrench,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
  Sparkles,
  Crown,
  Wand2,
  Eye,
  Hand,
  Footprints,
  Circle,
  Sword,
  Shield,
  Axe,
  HardHat,
  Backpack,
  Camera,
  Fish,
  Zap,
  Upload,
  ArrowLeft,
  Droplets,
  Bone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/store/sceneStore';

// Role-based character templates with unique appearances
const CHARACTER_ROLES = [
  { 
    id: 'knight', 
    name: 'Knight', 
    icon: Shield, 
    tier: 'free',
    defaultPose: 'guard',
    defaultClothing: ['plate_armor', 'steel_boots', 'steel_gauntlets'],
    defaultEquipment: ['longsword', 'kite_shield'],
    skinTone: '#D4A574',
    idleAnimation: 'patrol',
    description: 'Heavy armored warrior with sword and shield'
  },
  { 
    id: 'archer', 
    name: 'Archer', 
    icon: Zap, 
    tier: 'free',
    defaultPose: 'aim',
    defaultClothing: ['leather_armor', 'leather_boots', 'hood'],
    defaultEquipment: ['longbow', 'quiver'],
    skinTone: '#F5D0B3',
    idleAnimation: 'scout',
    description: 'Agile ranged fighter with bow and arrows'
  },
  { 
    id: 'mage', 
    name: 'Mage', 
    icon: Sparkles, 
    tier: 'free',
    defaultPose: 'cast',
    defaultClothing: ['mystic_robe', 'cloth_boots', 'wizard_hat'],
    defaultEquipment: ['staff', 'spellbook'],
    skinTone: '#FFE7D1',
    idleAnimation: 'meditate',
    description: 'Mystical spellcaster with robes and staff'
  },
  { 
    id: 'warrior', 
    name: 'Warrior', 
    icon: Sword, 
    tier: 'free',
    defaultPose: 'battle',
    defaultClothing: ['chainmail', 'iron_boots', 'bracers'],
    defaultEquipment: ['battleaxe'],
    skinTone: '#B07C4F',
    idleAnimation: 'train',
    description: 'Fierce melee fighter with heavy weapons'
  },
  { 
    id: 'rogue', 
    name: 'Rogue', 
    icon: Eye, 
    tier: 'pro',
    defaultPose: 'stealth',
    defaultClothing: ['dark_cloak', 'soft_boots', 'mask'],
    defaultEquipment: ['daggers', 'lockpicks'],
    skinTone: '#8B5A2B',
    idleAnimation: 'lurk',
    description: 'Stealthy assassin with dual daggers'
  },
  { 
    id: 'healer', 
    name: 'Healer', 
    icon: Droplets, 
    tier: 'pro',
    defaultPose: 'pray',
    defaultClothing: ['priest_robe', 'sandals', 'holy_symbol'],
    defaultEquipment: ['healing_staff', 'potion_bag'],
    skinTone: '#FFDFC4',
    idleAnimation: 'bless',
    description: 'Divine healer with restoration magic'
  },
];

// Skeleton system for character editing
const SKELETON_BONES = [
  { id: 'spine_pelvis', name: 'Pelvis', parent: null, position: [0, 0, 0] },
  { id: 'spine_lower', name: 'Lower Spine', parent: 'spine_pelvis', position: [0, 0.15, 0] },
  { id: 'spine_mid', name: 'Mid Spine', parent: 'spine_lower', position: [0, 0.15, 0] },
  { id: 'spine_upper', name: 'Upper Spine', parent: 'spine_mid', position: [0, 0.15, 0] },
  { id: 'spine_chest', name: 'Chest', parent: 'spine_upper', position: [0, 0.15, 0] },
  { id: 'neck', name: 'Neck', parent: 'spine_chest', position: [0, 0.1, 0] },
  { id: 'head', name: 'Head', parent: 'neck', position: [0, 0.15, 0] },
  { id: 'left_shoulder', name: 'L. Shoulder', parent: 'spine_chest', position: [-0.2, 0, 0] },
  { id: 'left_upper_arm', name: 'L. Upper Arm', parent: 'left_shoulder', position: [-0.15, 0, 0] },
  { id: 'left_forearm', name: 'L. Forearm', parent: 'left_upper_arm', position: [-0.15, 0, 0] },
  { id: 'left_hand', name: 'L. Hand', parent: 'left_forearm', position: [-0.1, 0, 0] },
  { id: 'right_shoulder', name: 'R. Shoulder', parent: 'spine_chest', position: [0.2, 0, 0] },
  { id: 'right_upper_arm', name: 'R. Upper Arm', parent: 'right_shoulder', position: [0.15, 0, 0] },
  { id: 'right_forearm', name: 'R. Forearm', parent: 'right_upper_arm', position: [0.15, 0, 0] },
  { id: 'right_hand', name: 'R. Hand', parent: 'right_forearm', position: [0.1, 0, 0] },
  { id: 'left_hip', name: 'L. Hip', parent: 'spine_pelvis', position: [-0.1, -0.05, 0] },
  { id: 'left_thigh', name: 'L. Thigh', parent: 'left_hip', position: [0, -0.2, 0] },
  { id: 'left_shin', name: 'L. Shin', parent: 'left_thigh', position: [0, -0.2, 0] },
  { id: 'left_foot', name: 'L. Foot', parent: 'left_shin', position: [0, -0.1, 0.05] },
  { id: 'right_hip', name: 'R. Hip', parent: 'spine_pelvis', position: [0.1, -0.05, 0] },
  { id: 'right_thigh', name: 'R. Thigh', parent: 'right_hip', position: [0, -0.2, 0] },
  { id: 'right_shin', name: 'R. Shin', parent: 'right_thigh', position: [0, -0.2, 0] },
  { id: 'right_foot', name: 'R. Foot', parent: 'right_shin', position: [0, -0.1, 0.05] },
];

// Skin tones
const SKIN_TONES = [
  { name: 'Type I', color: '#FFE7D1', description: 'Very fair' },
  { name: 'Type II', color: '#F5D0B3', description: 'Fair' },
  { name: 'Type III', color: '#D4A574', description: 'Medium' },
  { name: 'Type IV', color: '#B07C4F', description: 'Olive' },
  { name: 'Type V', color: '#8B5A2B', description: 'Brown' },
  { name: 'Type VI', color: '#4A3728', description: 'Dark brown' },
];

interface CharacterState {
  role: string;
  name: string;
  skinTone: string;
  bodyScale: { x: number; y: number; z: number };
  boneAdjustments: Record<string, { rotation: [number, number, number] }>;
  bloodEffects: boolean;
  clothing: string[];
  equipment: string[];
}

export default function CharacterCreator() {
  const navigate = useNavigate();
  const { addProceduralModel } = useSceneStore();
  const [activeTab, setActiveTab] = useState('role');
  const [expandedSections, setExpandedSections] = useState<string[]>(['skeleton']);
  const [selectedBone, setSelectedBone] = useState<string | null>(null);
  
  const [character, setCharacter] = useState<CharacterState>({
    role: 'knight',
    name: 'New Character',
    skinTone: '#D4A574',
    bodyScale: { x: 1, y: 1, z: 1 },
    boneAdjustments: {},
    bloodEffects: false,
    clothing: [],
    equipment: [],
  });

  const selectedRole = CHARACTER_ROLES.find(r => r.id === character.role);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const selectRole = (roleId: string) => {
    const role = CHARACTER_ROLES.find(r => r.id === roleId);
    if (role?.tier === 'pro') {
      toast.info('Pro role selected', { description: 'Upgrade to unlock all features' });
    }
    if (role) {
      setCharacter(prev => ({ 
        ...prev, 
        role: roleId,
        skinTone: role.skinTone,
        clothing: role.defaultClothing,
        equipment: role.defaultEquipment,
      }));
    }
  };

  const handleSaveToInventory = () => {
    const savedCharacters = JSON.parse(localStorage.getItem('character-inventory') || '[]');
    savedCharacters.push({
      ...character,
      id: `char_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('character-inventory', JSON.stringify(savedCharacters));
    toast.success('Character saved to inventory!', {
      description: 'Access it from Studio inventory.'
    });
  };

  const handleAddToScene = () => {
    addProceduralModel('humanoid', character.name || `${selectedRole?.name}_${Date.now()}`);
    handleSaveToInventory();
    toast.success('Character added to scene!', {
      description: `${selectedRole?.name} placed in viewport.`
    });
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
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-primary" />
                  Character Creator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Build unique characters with role-based appearances and skeletal editing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveToInventory}>
                <Save className="w-4 h-4 mr-2" />
                Save to Inventory
              </Button>
              <Button onClick={handleAddToScene}>
                <Upload className="w-4 h-4 mr-2" />
                Add to Scene
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Character Preview */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    {selectedRole?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg mx-4 mb-4">
                  <div className="text-center space-y-4">
                    <div 
                      className="w-32 h-48 mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-border"
                      style={{ backgroundColor: character.skinTone + '40' }}
                    >
                      <selectedRole.icon className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <div>
                      <Input
                        value={character.name}
                        onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                        className="text-center font-medium"
                        placeholder="Character Name"
                      />
                    </div>
                    <Badge variant="secondary">{selectedRole?.name}</Badge>
                    <p className="text-xs text-muted-foreground">
                      Idle: {selectedRole?.idleAnimation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Middle Panel - Role Selection & Body */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="role" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        Role
                      </TabsTrigger>
                      <TabsTrigger value="body" className="text-xs">
                        <Palette className="w-3 h-3 mr-1" />
                        Body
                      </TabsTrigger>
                      <TabsTrigger value="gear" className="text-xs">
                        <Wrench className="w-3 h-3 mr-1" />
                        Gear
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <TabsContent value="role" className="mt-0 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {CHARACTER_ROLES.map((role) => (
                          <Button
                            key={role.id}
                            variant={character.role === role.id ? "default" : "outline"}
                            size="sm"
                            className="justify-start gap-2 h-auto py-3 relative flex-col items-start"
                            onClick={() => selectRole(role.id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <role.icon className="w-4 h-4" />
                              <span>{role.name}</span>
                              {role.tier === 'pro' && (
                                <Crown className="w-3 h-3 text-yellow-500 ml-auto" />
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground text-left">
                              {role.description}
                            </span>
                          </Button>
                        ))}
                      </div>

                      <Separator />

                      {/* Blood Effects Toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-red-500" />
                          <Label className="text-sm">Blood Effects</Label>
                        </div>
                        <Switch
                          checked={character.bloodEffects}
                          onCheckedChange={(checked) => 
                            setCharacter(prev => ({ ...prev, bloodEffects: checked }))
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="body" className="mt-0 space-y-4">
                      {/* Skin Tone */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Skin Tone</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {SKIN_TONES.map((tone) => (
                            <button
                              key={tone.color}
                              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                character.skinTone === tone.color 
                                  ? 'border-primary scale-110 shadow-lg' 
                                  : 'border-transparent hover:border-muted-foreground'
                              }`}
                              style={{ backgroundColor: tone.color }}
                              onClick={() => setCharacter(prev => ({ ...prev, skinTone: tone.color }))}
                              title={`${tone.name}: ${tone.description}`}
                            />
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Body Scale */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Body Scale</Label>
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs uppercase">
                                {axis === 'x' ? 'Width' : axis === 'y' ? 'Height' : 'Depth'}
                              </Label>
                              <span className="text-xs text-muted-foreground">
                                {(character.bodyScale[axis as keyof typeof character.bodyScale] * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Slider
                              value={[character.bodyScale[axis as keyof typeof character.bodyScale] * 100]}
                              onValueChange={([val]) => setCharacter(prev => ({
                                ...prev,
                                bodyScale: { ...prev.bodyScale, [axis]: val / 100 }
                              }))}
                              min={50}
                              max={150}
                              step={1}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="gear" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Equipped Items</Label>
                        <div className="space-y-2">
                          {selectedRole?.defaultClothing.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                              <Shirt className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm capitalize">{item.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                          {selectedRole?.defaultEquipment.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                              <Wrench className="w-4 h-4 text-primary" />
                              <span className="text-sm capitalize">{item.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel - Skeleton Editor */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bone className="w-5 h-5" />
                    Skeleton Editor
                  </CardTitle>
                  <CardDescription>
                    Adjust bones using rods and spheres
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <Collapsible 
                      open={expandedSections.includes('skeleton')} 
                      onOpenChange={() => toggleSection('skeleton')}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-2">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Circle className="w-4 h-4" />
                            Bone Hierarchy ({SKELETON_BONES.length} bones)
                          </span>
                          {expandedSections.includes('skeleton') ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pt-2">
                        {SKELETON_BONES.map((bone) => (
                          <motion.div
                            key={bone.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedBone === bone.id 
                                ? 'bg-primary/20 border border-primary/50' 
                                : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                            style={{ marginLeft: bone.parent ? '16px' : '0' }}
                            onClick={() => setSelectedBone(bone.id)}
                          >
                            <div className="w-3 h-3 rounded-full bg-foreground/50" />
                            <span className="text-xs flex-1">{bone.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {bone.position.map(p => p.toFixed(2)).join(', ')}
                            </span>
                          </motion.div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {selectedBone && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-lg bg-muted/30 space-y-4"
                      >
                        <Label className="text-sm font-medium">
                          Editing: {SKELETON_BONES.find(b => b.id === selectedBone)?.name}
                        </Label>
                        
                        {['X Rotation', 'Y Rotation', 'Z Rotation'].map((label, i) => (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">{label}</Label>
                              <span className="text-xs text-muted-foreground">0°</span>
                            </div>
                            <Slider
                              defaultValue={[0]}
                              min={-180}
                              max={180}
                              step={1}
                            />
                          </div>
                        ))}
                      </motion.div>
                    )}
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
