import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Package,
  Cog,
  Gauge,
  Wind,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjectStore } from '@/store/projectStore';

interface PreloadedAsset {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  icon: React.ComponentType<any>;
  tags: string[];
  tier: 'free' | 'pro' | 'enterprise';
  imageUrl?: string;
}

const preloadedAssets: PreloadedAsset[] = [
  // Characters - Males
  { id: 'male-warrior', name: 'Warrior', category: 'characters', subcategory: 'males', icon: Sword, tags: ['human', 'fighter', 'armor'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'male-mage', name: 'Mage', category: 'characters', subcategory: 'males', icon: Flame, tags: ['human', 'magic', 'robes'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'male-knight', name: 'Knight', category: 'characters', subcategory: 'males', icon: Crown, tags: ['human', 'medieval', 'armor'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'male-peasant', name: 'Peasant', category: 'characters', subcategory: 'males', icon: User, tags: ['human', 'villager', 'simple'], tier: 'free', imageUrl: '/placeholder.svg' },
  
  // Characters - Females
  { id: 'female-archer', name: 'Archer', category: 'characters', subcategory: 'females', icon: User, tags: ['human', 'ranger', 'bow'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'female-sorceress', name: 'Sorceress', category: 'characters', subcategory: 'females', icon: Flame, tags: ['human', 'magic', 'spell'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'female-queen', name: 'Queen', category: 'characters', subcategory: 'females', icon: Crown, tags: ['human', 'royal', 'crown'], tier: 'pro', imageUrl: '/placeholder.svg' },
  
  // Characters - Creatures
  { id: 'robot-basic', name: 'Basic Robot', category: 'characters', subcategory: 'robots', icon: RobotIcon, tags: ['mechanical', 'android', 'metal'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cyborg-soldier', name: 'Cyborg Soldier', category: 'characters', subcategory: 'cyborgs', icon: RobotIcon, tags: ['hybrid', 'combat', 'armor'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'ogre', name: 'Ogre', category: 'characters', subcategory: 'monsters', icon: Skull, tags: ['monster', 'large', 'brute'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-monster', name: 'Tree Monster', category: 'characters', subcategory: 'monsters', icon: TreeDeciduous, tags: ['nature', 'guardian', 'wood'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'dragon-red', name: 'Red Dragon', category: 'characters', subcategory: 'dragons', icon: Flame, tags: ['dragon', 'fire', 'flying'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'dragon-ice', name: 'Ice Dragon', category: 'characters', subcategory: 'dragons', icon: Flame, tags: ['dragon', 'ice', 'flying'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  
  // Buildings
  { id: 'house-medieval', name: 'Medieval House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'wood', 'thatch'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'house-modern', name: 'Modern House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'contemporary', 'glass'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'castle', name: 'Castle', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['fortress', 'medieval', 'stone'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'tower', name: 'Tower', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['tall', 'stone', 'defense'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'shop', name: 'Shop', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['commerce', 'store', 'village'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tavern', name: 'Tavern', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['inn', 'medieval', 'social'], tier: 'free', imageUrl: '/placeholder.svg' },
  
  // Vehicle Parts - Gears
  { id: 'gear-manual-5', name: '5-Speed Manual', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'manual', 'gearbox'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'gear-manual-6', name: '6-Speed Manual', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'manual', 'racing'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'gear-dct', name: 'Dual-Clutch DCT', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'automatic', 'sport'], tier: 'pro', imageUrl: '/placeholder.svg' },
  
  // Vehicle Parts - Engines
  { id: 'engine-v6', name: 'Twin-Turbo V6', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'turbo', 'v6'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'engine-v8', name: 'V8 Muscle Engine', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'muscle', 'v8'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'engine-rotary', name: '13B Rotary', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'rotary', 'wankel'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  
  // Vehicle Parts - Exhausts
  { id: 'exhaust-straight', name: 'Straight Pipe', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'performance', 'loud'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-quad', name: 'Quad Tip Exhaust', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'sport', 'quad'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-titanium', name: 'Titanium Race', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'racing', 'titanium'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  
  // Vehicle Parts - Spoilers
  { id: 'spoiler-gt', name: 'GT Wing Spoiler', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'racing', 'wing'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-lip', name: 'Lip Spoiler', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'subtle', 'lip'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-active', name: 'Active Aero Wing', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'hypercar', 'active'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  
  // Vehicles
  { id: 'car-jaguar', name: 'Jaguar F-Type', category: 'vehicles', subcategory: 'sports', icon: Car, tags: ['car', 'sports', 'british'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-nissan-gt', name: 'Nissan GT-R', category: 'vehicles', subcategory: 'sports', icon: Car, tags: ['car', 'jdm', 'godzilla'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-mazda-rx7', name: 'Mazda RX-7', category: 'vehicles', subcategory: 'jdm', icon: Car, tags: ['car', 'rotary', 'drift'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-ford-f150', name: 'Ford F-150', category: 'vehicles', subcategory: 'trucks', icon: Car, tags: ['truck', 'american', 'pickup'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'car-mercedes-amg', name: 'Mercedes AMG GT', category: 'vehicles', subcategory: 'luxury', icon: Car, tags: ['car', 'german', 'luxury'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'car-camaro-77', name: '1977 Camaro', category: 'vehicles', subcategory: 'classic', icon: Car, tags: ['car', 'classic', 'muscle'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-bentley', name: 'Bentley Continental', category: 'vehicles', subcategory: 'luxury', icon: Car, tags: ['car', 'british', 'luxury'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'car-chrysler-300', name: 'Chrysler 300', category: 'vehicles', subcategory: 'sedan', icon: Car, tags: ['car', 'american', 'sedan'], tier: 'free', imageUrl: '/placeholder.svg' },
  
  // Roads & Paths
  { id: 'road-cobble', name: 'Cobblestone Road', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'stone', 'medieval'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'road-dirt', name: 'Dirt Path', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'earth', 'natural'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'road-asphalt', name: 'Asphalt Road', category: 'terrain', subcategory: 'roads', icon: Car, tags: ['modern', 'street', 'urban'], tier: 'pro', imageUrl: '/placeholder.svg' },
  
  // Nature
  { id: 'tree-oak', name: 'Oak Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'forest', 'deciduous'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-pine', name: 'Pine Tree', category: 'nature', subcategory: 'trees', icon: Trees, tags: ['vegetation', 'conifer', 'evergreen'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'rock-large', name: 'Large Rock', category: 'nature', subcategory: 'rocks', icon: Mountain, tags: ['stone', 'boulder', 'natural'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'mountain-peak', name: 'Mountain Peak', category: 'nature', subcategory: 'mountains', icon: Mountain, tags: ['terrain', 'height', 'rocky'], tier: 'pro', imageUrl: '/placeholder.svg' },
];

const categories = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'characters', label: 'Characters', icon: User },
  { id: 'structures', label: 'Structures', icon: Building2 },
  { id: 'parts', label: 'Parts', icon: Cog },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'nature', label: 'Nature', icon: Trees },
  { id: 'terrain', label: 'Terrain', icon: MapPin },
];

export function PreloadedAssets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all');
  const { addAsset } = useProjectStore();

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
    
    // Add to project store
    addAsset({
      name: asset.name,
      type: 'model',
      thumbnail: asset.imageUrl || '',
      source: 'local',
    });
    
    toast.success(`Added ${asset.name}`, {
      description: 'Asset added to your inventory and scene.',
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
