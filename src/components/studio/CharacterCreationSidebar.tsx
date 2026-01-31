import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  Lock,
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
  Heart,
  Zap,
  Mountain,
  Trees,
  PawPrint,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSceneStore } from '@/store/sceneStore';

// Character Templates - Tropico/SimCity/Jurassic World inspired
const CHARACTER_TEMPLATES = [
  { id: 'citizen', name: 'Citizen', icon: User, tier: 'free', category: 'civilian' },
  { id: 'worker', name: 'Worker', icon: HardHat, tier: 'free', category: 'civilian' },
  { id: 'explorer', name: 'Explorer', icon: Backpack, tier: 'free', category: 'civilian' },
  { id: 'scientist', name: 'Scientist', icon: Sparkles, tier: 'free', category: 'civilian' },
  { id: 'tourist', name: 'Tourist', icon: Camera, tier: 'free', category: 'civilian' },
  { id: 'fisherman', name: 'Fisherman', icon: Fish, tier: 'free', category: 'civilian' },
  { id: 'warrior', name: 'Warrior', icon: Sword, tier: 'pro', category: 'combat' },
  { id: 'guardian', name: 'Guardian', icon: Shield, tier: 'pro', category: 'combat' },
  { id: 'ranger', name: 'Park Ranger', icon: Trees, tier: 'pro', category: 'nature' },
  { id: 'handler', name: 'Animal Handler', icon: PawPrint, tier: 'pro', category: 'nature' },
];

// Body Part Categories
const BODY_PARTS = [
  { id: 'head', name: 'Head', icon: Circle },
  { id: 'face', name: 'Face', icon: Eye },
  { id: 'torso', name: 'Torso', icon: User },
  { id: 'leftArm', name: 'Left Arm', icon: Hand },
  { id: 'rightArm', name: 'Right Arm', icon: Hand },
  { id: 'leftLeg', name: 'Left Leg', icon: Footprints },
  { id: 'rightLeg', name: 'Right Leg', icon: Footprints },
];

// Skin Tone Presets - Scientific accuracy
const SKIN_TONES = [
  { name: 'Type I', color: '#FFE7D1', description: 'Very fair' },
  { name: 'Type II', color: '#F5D0B3', description: 'Fair' },
  { name: 'Type III', color: '#D4A574', description: 'Medium' },
  { name: 'Type IV', color: '#B07C4F', description: 'Olive' },
  { name: 'Type V', color: '#8B5A2B', description: 'Brown' },
  { name: 'Type VI', color: '#4A3728', description: 'Dark brown' },
];

// Clothing Categories
const CLOTHING_ITEMS = [
  { id: 'casual_shirt', name: 'Casual Shirt', slot: 'torso', tier: 'free' },
  { id: 'work_vest', name: 'Work Vest', slot: 'torso', tier: 'free' },
  { id: 'lab_coat', name: 'Lab Coat', slot: 'torso', tier: 'free' },
  { id: 'cargo_pants', name: 'Cargo Pants', slot: 'legs', tier: 'free' },
  { id: 'jeans', name: 'Jeans', slot: 'legs', tier: 'free' },
  { id: 'hiking_boots', name: 'Hiking Boots', slot: 'feet', tier: 'free' },
  { id: 'armor_chest', name: 'Chest Armor', slot: 'torso', tier: 'pro' },
  { id: 'tactical_vest', name: 'Tactical Vest', slot: 'torso', tier: 'pro' },
  { id: 'ranger_uniform', name: 'Ranger Uniform', slot: 'torso', tier: 'pro' },
];

// Equipment Items
const EQUIPMENT_ITEMS = [
  { id: 'pickaxe', name: 'Pickaxe', slot: 'rightHand', tier: 'free' },
  { id: 'shovel', name: 'Shovel', slot: 'rightHand', tier: 'free' },
  { id: 'hammer', name: 'Hammer', slot: 'rightHand', tier: 'free' },
  { id: 'fishing_rod', name: 'Fishing Rod', slot: 'rightHand', tier: 'free' },
  { id: 'binoculars', name: 'Binoculars', slot: 'neck', tier: 'free' },
  { id: 'backpack', name: 'Backpack', slot: 'back', tier: 'free' },
  { id: 'sword', name: 'Sword', slot: 'rightHand', tier: 'pro' },
  { id: 'shield', name: 'Shield', slot: 'leftHand', tier: 'pro' },
  { id: 'tranq_gun', name: 'Tranquilizer', slot: 'rightHand', tier: 'pro' },
  { id: 'radio', name: 'Radio', slot: 'waist', tier: 'pro' },
];

// Range of Motion Presets
const ROM_PRESETS = [
  { id: 'standard', name: 'Standard Human', joints: 22, flexibility: 1.0 },
  { id: 'athletic', name: 'Athletic', joints: 22, flexibility: 1.3 },
  { id: 'flexible', name: 'Gymnast', joints: 22, flexibility: 1.6 },
  { id: 'limited', name: 'Armored', joints: 22, flexibility: 0.7 },
];

interface CharacterState {
  template: string;
  skinTone: string;
  bodyScale: { x: number; y: number; z: number };
  partScales: Record<string, { x: number; y: number; z: number }>;
  clothing: string[];
  equipment: string[];
  romPreset: string;
}

export function CharacterCreationSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const [expandedSections, setExpandedSections] = useState<string[]>(['body']);
  
  const [character, setCharacter] = useState<CharacterState>({
    template: 'citizen',
    skinTone: '#D4A574',
    bodyScale: { x: 1, y: 1, z: 1 },
    partScales: {},
    clothing: ['casual_shirt', 'jeans'],
    equipment: [],
    romPreset: 'standard',
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const selectTemplate = (templateId: string) => {
    const template = CHARACTER_TEMPLATES.find(t => t.id === templateId);
    if (template?.tier === 'pro') {
      toast.info('Pro template selected', { description: 'Upgrade to unlock all features' });
    }
    setCharacter(prev => ({ ...prev, template: templateId }));
  };

  const toggleClothing = (itemId: string) => {
    const item = CLOTHING_ITEMS.find(i => i.id === itemId);
    if (item?.tier === 'pro') {
      toast.info('Pro item', { description: 'Upgrade to unlock' });
      return;
    }
    setCharacter(prev => ({
      ...prev,
      clothing: prev.clothing.includes(itemId)
        ? prev.clothing.filter(id => id !== itemId)
        : [...prev.clothing, itemId]
    }));
  };

  const toggleEquipment = (itemId: string) => {
    const item = EQUIPMENT_ITEMS.find(i => i.id === itemId);
    if (item?.tier === 'pro') {
      toast.info('Pro item', { description: 'Upgrade to unlock' });
      return;
    }
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.includes(itemId)
        ? prev.equipment.filter(id => id !== itemId)
        : [...prev.equipment, itemId]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('character-creation', JSON.stringify(character));
    toast.success('Character saved');
  };

  const handleReset = () => {
    setCharacter({
      template: 'citizen',
      skinTone: '#D4A574',
      bodyScale: { x: 1, y: 1, z: 1 },
      partScales: {},
      clothing: ['casual_shirt', 'jeans'],
      equipment: [],
      romPreset: 'standard',
    });
    toast.success('Character reset');
  };

  const { addProceduralModel } = useSceneStore();

  const handleAddToScene = () => {
    // Add character to scene based on template
    addProceduralModel('humanoid', `${character.template}_${Date.now()}`);
    toast.success('Character added to scene!', {
      description: `${CHARACTER_TEMPLATES.find(t => t.id === character.template)?.name} placed in viewport.`
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 className="w-4 h-4" />
          Character Creator
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[400px] sm:w-[480px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Character Creation
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Build unique characters with full customization
          </SheetDescription>
        </SheetHeader>

        {/* Action Bar */}
        <div className="p-3 border-b border-border/50 flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm" onClick={handleAddToScene} className="gap-1">
            <Upload className="w-4 h-4" />
            Add to Scene
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <div className="flex-1" />
          <Badge variant="outline" className="text-xs">
            {CHARACTER_TEMPLATES.find(t => t.id === character.template)?.name}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-3 mt-3 grid grid-cols-4">
            <TabsTrigger value="templates" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              Type
            </TabsTrigger>
            <TabsTrigger value="body" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Body
            </TabsTrigger>
            <TabsTrigger value="clothing" className="text-xs">
              <Shirt className="w-3 h-3 mr-1" />
              Outfit
            </TabsTrigger>
            <TabsTrigger value="equipment" className="text-xs">
              <Wrench className="w-3 h-3 mr-1" />
              Gear
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-3">
            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-0 space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Character Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CHARACTER_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant={character.template === template.id ? "default" : "outline"}
                      size="sm"
                      className="justify-start gap-2 h-10 relative"
                      onClick={() => selectTemplate(template.id)}
                    >
                      <template.icon className="w-4 h-4" />
                      {template.name}
                      {template.tier === 'pro' && (
                        <Crown className="w-3 h-3 text-yellow-500 absolute right-2" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Range of Motion */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Range of Motion
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROM_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={character.romPreset === preset.id ? "default" : "outline"}
                      size="sm"
                      className="flex-col items-start h-auto py-2"
                      onClick={() => setCharacter(prev => ({ ...prev, romPreset: preset.id }))}
                    >
                      <span className="text-xs font-medium">{preset.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {preset.joints} joints • {Math.round(preset.flexibility * 100)}% flex
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Body Tab */}
            <TabsContent value="body" className="mt-0 space-y-4">
              {/* Skin Tone */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Skin Tone (Fitzpatrick Scale)</Label>
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
              <Collapsible 
                open={expandedSections.includes('bodyScale')} 
                onOpenChange={() => toggleSection('bodyScale')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4" />
                      Overall Body Scale
                    </span>
                    {expandedSections.includes('bodyScale') ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pl-2 pt-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase">{axis === 'x' ? 'Width' : axis === 'y' ? 'Height' : 'Depth'}</Label>
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
                </CollapsibleContent>
              </Collapsible>

              {/* Body Parts */}
              <Collapsible 
                open={expandedSections.includes('parts')} 
                onOpenChange={() => toggleSection('parts')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Hand className="w-4 h-4" />
                      Individual Parts
                    </span>
                    {expandedSections.includes('parts') ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  {BODY_PARTS.map((part) => (
                    <div key={part.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <part.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{part.name}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Edit
                      </Button>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* Clothing Tab */}
            <TabsContent value="clothing" className="mt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Clothing Items</Label>
                  <Badge variant="secondary" className="text-xs">
                    {CLOTHING_ITEMS.filter(i => i.tier === 'free').length} Free
                  </Badge>
                </div>
                <div className="space-y-2">
                  {CLOTHING_ITEMS.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        character.clothing.includes(item.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-card/50 hover:border-primary/30'
                      }`}
                    >
                      <Shirt className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{item.slot}</p>
                      </div>
                      {item.tier === 'pro' ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Button 
                          variant={character.clothing.includes(item.id) ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => toggleClothing(item.id)}
                        >
                          {character.clothing.includes(item.id) ? 'Remove' : 'Add'}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="mt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Equipment & Tools</Label>
                  <Badge variant="secondary" className="text-xs">
                    {EQUIPMENT_ITEMS.filter(i => i.tier === 'free').length} Free
                  </Badge>
                </div>
                <div className="space-y-2">
                  {EQUIPMENT_ITEMS.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        character.equipment.includes(item.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-card/50 hover:border-primary/30'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{item.slot}</p>
                      </div>
                      {item.tier === 'pro' ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Button 
                          variant={character.equipment.includes(item.id) ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => toggleEquipment(item.id)}
                        >
                          {character.equipment.includes(item.id) ? 'Remove' : 'Equip'}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
