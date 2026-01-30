import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  Home, 
  Trees, 
  Mountain, 
  Sword, 
  Bot as RobotIcon,
  Crown,
  Skull,
  Flame,
  Building2,
  TreeDeciduous,
  MapPin,
  Car,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface PreloadedAsset {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  icon: React.ComponentType<any>;
  tags: string[];
  tier: 'free' | 'pro' | 'enterprise';
}

const preloadedAssets: PreloadedAsset[] = [
  // Characters - Males
  { id: 'male-warrior', name: 'Warrior', category: 'characters', subcategory: 'males', icon: Sword, tags: ['human', 'fighter', 'armor'], tier: 'free' },
  { id: 'male-mage', name: 'Mage', category: 'characters', subcategory: 'males', icon: Flame, tags: ['human', 'magic', 'robes'], tier: 'free' },
  { id: 'male-knight', name: 'Knight', category: 'characters', subcategory: 'males', icon: Crown, tags: ['human', 'medieval', 'armor'], tier: 'pro' },
  { id: 'male-peasant', name: 'Peasant', category: 'characters', subcategory: 'males', icon: User, tags: ['human', 'villager', 'simple'], tier: 'free' },
  
  // Characters - Females
  { id: 'female-archer', name: 'Archer', category: 'characters', subcategory: 'females', icon: User, tags: ['human', 'ranger', 'bow'], tier: 'free' },
  { id: 'female-sorceress', name: 'Sorceress', category: 'characters', subcategory: 'females', icon: Flame, tags: ['human', 'magic', 'spell'], tier: 'free' },
  { id: 'female-queen', name: 'Queen', category: 'characters', subcategory: 'females', icon: Crown, tags: ['human', 'royal', 'crown'], tier: 'pro' },
  
  // Characters - Creatures
  { id: 'robot-basic', name: 'Basic Robot', category: 'characters', subcategory: 'robots', icon: RobotIcon, tags: ['mechanical', 'android', 'metal'], tier: 'free' },
  { id: 'cyborg-soldier', name: 'Cyborg Soldier', category: 'characters', subcategory: 'cyborgs', icon: RobotIcon, tags: ['hybrid', 'combat', 'armor'], tier: 'pro' },
  { id: 'ogre', name: 'Ogre', category: 'characters', subcategory: 'monsters', icon: Skull, tags: ['monster', 'large', 'brute'], tier: 'free' },
  { id: 'tree-monster', name: 'Tree Monster', category: 'characters', subcategory: 'monsters', icon: TreeDeciduous, tags: ['nature', 'guardian', 'wood'], tier: 'pro' },
  { id: 'dragon-red', name: 'Red Dragon', category: 'characters', subcategory: 'dragons', icon: Flame, tags: ['dragon', 'fire', 'flying'], tier: 'enterprise' },
  { id: 'dragon-ice', name: 'Ice Dragon', category: 'characters', subcategory: 'dragons', icon: Flame, tags: ['dragon', 'ice', 'flying'], tier: 'enterprise' },
  
  // Buildings
  { id: 'house-medieval', name: 'Medieval House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'wood', 'thatch'], tier: 'free' },
  { id: 'house-modern', name: 'Modern House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'contemporary', 'glass'], tier: 'pro' },
  { id: 'castle', name: 'Castle', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['fortress', 'medieval', 'stone'], tier: 'pro' },
  { id: 'tower', name: 'Tower', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['tall', 'stone', 'defense'], tier: 'free' },
  { id: 'shop', name: 'Shop', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['commerce', 'store', 'village'], tier: 'free' },
  { id: 'tavern', name: 'Tavern', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['inn', 'medieval', 'social'], tier: 'free' },
  
  // Roads & Paths
  { id: 'road-cobble', name: 'Cobblestone Road', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'stone', 'medieval'], tier: 'free' },
  { id: 'road-dirt', name: 'Dirt Path', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'earth', 'natural'], tier: 'free' },
  { id: 'road-asphalt', name: 'Asphalt Road', category: 'terrain', subcategory: 'roads', icon: Car, tags: ['modern', 'street', 'urban'], tier: 'pro' },
  
  // Nature
  { id: 'tree-oak', name: 'Oak Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'forest', 'deciduous'], tier: 'free' },
  { id: 'tree-pine', name: 'Pine Tree', category: 'nature', subcategory: 'trees', icon: Trees, tags: ['vegetation', 'conifer', 'evergreen'], tier: 'free' },
  { id: 'bush-berry', name: 'Berry Bush', category: 'nature', subcategory: 'bushes', icon: Trees, tags: ['vegetation', 'small', 'berries'], tier: 'free' },
  { id: 'bush-flowering', name: 'Flowering Bush', category: 'nature', subcategory: 'bushes', icon: Trees, tags: ['vegetation', 'flowers', 'decorative'], tier: 'free' },
  { id: 'rock-large', name: 'Large Rock', category: 'nature', subcategory: 'rocks', icon: Mountain, tags: ['stone', 'boulder', 'natural'], tier: 'free' },
  { id: 'rock-formation', name: 'Rock Formation', category: 'nature', subcategory: 'rocks', icon: Mountain, tags: ['stone', 'cluster', 'terrain'], tier: 'free' },
  { id: 'cave-entrance', name: 'Cave Entrance', category: 'nature', subcategory: 'caves', icon: Mountain, tags: ['underground', 'dark', 'mystery'], tier: 'pro' },
  { id: 'mountain-peak', name: 'Mountain Peak', category: 'nature', subcategory: 'mountains', icon: Mountain, tags: ['terrain', 'height', 'rocky'], tier: 'pro' },
];

const categories = [
  { id: 'all', label: 'All Assets', icon: Package },
  { id: 'characters', label: 'Characters', icon: User },
  { id: 'structures', label: 'Structures', icon: Building2 },
  { id: 'nature', label: 'Nature', icon: Trees },
  { id: 'terrain', label: 'Terrain', icon: MapPin },
];

export function PreloadedAssets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all');

  const filteredAssets = preloadedAssets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || asset.tier === selectedTier;
    
    return matchesSearch && matchesCategory && matchesTier;
  });

  const handleAddAsset = (asset: PreloadedAsset) => {
    if (asset.tier === 'enterprise') {
      toast.info('Enterprise tier required', {
        description: 'This asset requires an Enterprise subscription.',
      });
      return;
    }
    if (asset.tier === 'pro') {
      toast.info('Pro tier feature', {
        description: 'This asset will be available in the Pro tier.',
      });
      return;
    }
    
    toast.success(`Added ${asset.name}`, {
      description: 'Asset added to your scene. (Model loading coming soon)',
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-success/20 text-success border-success/30';
      case 'pro': return 'bg-primary/20 text-primary border-primary/30';
      case 'enterprise': return 'bg-warning/20 text-warning border-warning/30';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Asset Library</h3>
          <p className="text-xs text-muted-foreground">Preloaded 3D models ready to use</p>
        </div>
        <div className="flex gap-1">
          {['all', 'free', 'pro'].map((tier) => (
            <Button
              key={tier}
              variant={selectedTier === tier ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setSelectedTier(tier as any)}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets..."
          className="pl-9 h-9"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-8 px-3 flex-shrink-0"
            onClick={() => setSelectedCategory(cat.id)}
          >
            <cat.icon className="w-3 h-3 mr-1.5" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Assets Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors group"
              onClick={() => handleAddAsset(asset)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <asset.icon className="w-4 h-4 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-1.5 py-0 ${getTierColor(asset.tier)}`}
                >
                  {asset.tier}
                </Badge>
              </div>
              <h4 className="text-xs font-medium truncate">{asset.name}</h4>
              <p className="text-[10px] text-muted-foreground capitalize">{asset.subcategory}</p>
            </motion.div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No assets found</p>
            <p className="text-xs text-muted-foreground/50">Try adjusting your search or filters</p>
          </div>
        )}
      </ScrollArea>

      {/* Storage Tier Info */}
      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Storage Usage</span>
          <span className="text-xs text-muted-foreground">12.4 MB / 100 MB</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary w-[12%] rounded-full" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Upgrade to Pro for 1GB storage
        </p>
      </div>
    </motion.div>
  );
}
