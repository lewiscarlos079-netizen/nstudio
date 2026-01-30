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
  Sparkles,
  Fence,
  Shrub,
  DoorOpen,
  Lightbulb,
  Sofa,
  Bed,
  Tv,
  Monitor,
  Refrigerator,
  UtensilsCrossed,
  Coffee,
  Sandwich,
  Pizza,
  Soup,
  Apple,
  Fish,
  Dog,
  Cat,
  Bird,
  TreePine,
  Waves,
  Droplets,
  Armchair,
  Table,
  Lamp,
  Warehouse,
  Flower2,
  Leaf,
  Anchor,
  CircleDot,
  LayoutGrid,
  Box,
  Truck,
  FlameKindling
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjectStore } from '@/store/projectStore';
import { useSceneStore } from '@/store/sceneStore';

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
  
  // ========== STRUCTURES ==========
  // Houses & Cottages
  { id: 'house-medieval', name: 'Medieval House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'wood', 'thatch'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'house-modern', name: 'Modern House', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'contemporary', 'glass'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'cottage', name: 'Cottage', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'cozy', 'rustic', 'country'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cottage-stone', name: 'Stone Cottage', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'stone', 'medieval', 'countryside'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cottage-thatched', name: 'Thatched Cottage', category: 'structures', subcategory: 'houses', icon: Home, tags: ['building', 'thatch', 'village', 'fantasy'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'castle', name: 'Castle', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['fortress', 'medieval', 'stone'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'tower', name: 'Tower', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['tall', 'stone', 'defense'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'shop', name: 'Shop', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['commerce', 'store', 'village'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tavern', name: 'Tavern', category: 'structures', subcategory: 'buildings', icon: Building2, tags: ['inn', 'medieval', 'social'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Walls
  { id: 'wall-brick', name: 'Brick Wall', category: 'structures', subcategory: 'walls', icon: Fence, tags: ['wall', 'brick', 'red'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wall-stone', name: 'Stone Wall', category: 'structures', subcategory: 'walls', icon: Fence, tags: ['wall', 'stone', 'medieval'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wall-concrete', name: 'Concrete Wall', category: 'structures', subcategory: 'walls', icon: Fence, tags: ['wall', 'concrete', 'modern'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wall-wooden', name: 'Wooden Wall', category: 'structures', subcategory: 'walls', icon: Fence, tags: ['wall', 'wood', 'rustic'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wall-drywall', name: 'Drywall Panel', category: 'structures', subcategory: 'walls', icon: Fence, tags: ['wall', 'interior', 'modern'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Doors
  { id: 'door-wooden', name: 'Wooden Door', category: 'structures', subcategory: 'doors', icon: DoorOpen, tags: ['door', 'wood', 'classic'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'door-glass', name: 'Glass Door', category: 'structures', subcategory: 'doors', icon: DoorOpen, tags: ['door', 'glass', 'modern'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'door-metal', name: 'Metal Door', category: 'structures', subcategory: 'doors', icon: DoorOpen, tags: ['door', 'metal', 'security'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'door-double', name: 'Double Door', category: 'structures', subcategory: 'doors', icon: DoorOpen, tags: ['door', 'double', 'entrance'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'door-sliding', name: 'Sliding Door', category: 'structures', subcategory: 'doors', icon: DoorOpen, tags: ['door', 'sliding', 'patio'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // Stairs
  { id: 'stairs-wooden', name: 'Wooden Stairs', category: 'structures', subcategory: 'stairs', icon: LayoutGrid, tags: ['stairs', 'wood', 'indoor'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'stairs-stone', name: 'Stone Stairs', category: 'structures', subcategory: 'stairs', icon: LayoutGrid, tags: ['stairs', 'stone', 'outdoor'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'stairs-spiral', name: 'Spiral Staircase', category: 'structures', subcategory: 'stairs', icon: LayoutGrid, tags: ['stairs', 'spiral', 'elegant'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'stairs-metal', name: 'Metal Stairs', category: 'structures', subcategory: 'stairs', icon: LayoutGrid, tags: ['stairs', 'metal', 'industrial'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Roofs
  { id: 'roof-shingle', name: 'Shingle Roof', category: 'structures', subcategory: 'roofs', icon: Home, tags: ['roof', 'shingle', 'residential'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'roof-tile', name: 'Tile Roof', category: 'structures', subcategory: 'roofs', icon: Home, tags: ['roof', 'tile', 'mediterranean'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'roof-thatch', name: 'Thatch Roof', category: 'structures', subcategory: 'roofs', icon: Home, tags: ['roof', 'thatch', 'cottage'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'roof-flat', name: 'Flat Roof', category: 'structures', subcategory: 'roofs', icon: Home, tags: ['roof', 'flat', 'modern'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'roof-metal', name: 'Metal Roof', category: 'structures', subcategory: 'roofs', icon: Home, tags: ['roof', 'metal', 'industrial'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // Fire Safety
  { id: 'fire-escape', name: 'Fire Escape', category: 'structures', subcategory: 'safety', icon: LayoutGrid, tags: ['fire', 'escape', 'emergency', 'stairs'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'fire-hydrant', name: 'Fire Hydrant', category: 'structures', subcategory: 'safety', icon: FlameKindling, tags: ['fire', 'hydrant', 'water', 'emergency'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Marine Structures
  { id: 'wharf', name: 'Wharf', category: 'structures', subcategory: 'docks', icon: Anchor, tags: ['dock', 'pier', 'harbor', 'water'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dock-wooden', name: 'Wooden Dock', category: 'structures', subcategory: 'docks', icon: Anchor, tags: ['dock', 'wood', 'pier', 'lake'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dock-concrete', name: 'Concrete Dock', category: 'structures', subcategory: 'docks', icon: Anchor, tags: ['dock', 'concrete', 'harbor', 'industrial'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'pier', name: 'Pier', category: 'structures', subcategory: 'docks', icon: Anchor, tags: ['pier', 'boardwalk', 'ocean'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Outdoor
  { id: 'swimming-pool', name: 'Swimming Pool', category: 'structures', subcategory: 'outdoor', icon: Waves, tags: ['pool', 'water', 'backyard', 'recreation'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'pool-inground', name: 'Inground Pool', category: 'structures', subcategory: 'outdoor', icon: Waves, tags: ['pool', 'luxury', 'swim'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'pool-above', name: 'Above Ground Pool', category: 'structures', subcategory: 'outdoor', icon: Waves, tags: ['pool', 'portable', 'backyard'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== FURNITURE ==========
  // Tables
  { id: 'table-dining', name: 'Dining Table', category: 'furniture', subcategory: 'tables', icon: Table, tags: ['table', 'dining', 'wood'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'table-coffee', name: 'Coffee Table', category: 'furniture', subcategory: 'tables', icon: Table, tags: ['table', 'living', 'low'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'table-with-cloth', name: 'Table with Cloth', category: 'furniture', subcategory: 'tables', icon: Table, tags: ['table', 'cloth', 'elegant', 'dining'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'table-desk', name: 'Office Desk', category: 'furniture', subcategory: 'tables', icon: Table, tags: ['desk', 'office', 'work'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'table-side', name: 'Side Table', category: 'furniture', subcategory: 'tables', icon: Table, tags: ['table', 'side', 'accent'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Cabinets
  { id: 'cabinet-kitchen', name: 'Kitchen Cabinet', category: 'furniture', subcategory: 'cabinets', icon: Box, tags: ['cabinet', 'kitchen', 'storage'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cabinet-bathroom', name: 'Bathroom Cabinet', category: 'furniture', subcategory: 'cabinets', icon: Box, tags: ['cabinet', 'bathroom', 'vanity'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cabinet-filing', name: 'Filing Cabinet', category: 'furniture', subcategory: 'cabinets', icon: Box, tags: ['cabinet', 'office', 'files'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cabinet-china', name: 'China Cabinet', category: 'furniture', subcategory: 'cabinets', icon: Box, tags: ['cabinet', 'display', 'dining'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'wardrobe', name: 'Wardrobe', category: 'furniture', subcategory: 'cabinets', icon: Box, tags: ['wardrobe', 'closet', 'bedroom'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Beds
  { id: 'bed-twin', name: 'Twin Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'twin', 'single'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bed-full', name: 'Full Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'full', 'double'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bed-queen', name: 'Queen Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'queen', 'master'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bed-king', name: 'King Size Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'king', 'luxury'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'bed-california-king', name: 'California King Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'california', 'king', 'extra'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'bed-bunk', name: 'Bunk Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'bunk', 'kids', 'double'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bed-loft', name: 'Loft Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'loft', 'elevated'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bed-murphy', name: 'Murphy Bed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'murphy', 'foldable'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'bed-daybed', name: 'Daybed', category: 'furniture', subcategory: 'beds', icon: Bed, tags: ['bed', 'daybed', 'couch'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Seating
  { id: 'couch-sectional', name: 'Sectional Couch', category: 'furniture', subcategory: 'seating', icon: Sofa, tags: ['couch', 'sectional', 'living'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'couch-loveseat', name: 'Loveseat', category: 'furniture', subcategory: 'seating', icon: Sofa, tags: ['couch', 'loveseat', 'small'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'couch-sofa', name: 'Sofa', category: 'furniture', subcategory: 'seating', icon: Sofa, tags: ['couch', 'sofa', 'living'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'couch-futon', name: 'Futon', category: 'furniture', subcategory: 'seating', icon: Sofa, tags: ['couch', 'futon', 'convertible'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'armchair', name: 'Armchair', category: 'furniture', subcategory: 'seating', icon: Armchair, tags: ['chair', 'armchair', 'comfortable'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'recliner', name: 'Recliner', category: 'furniture', subcategory: 'seating', icon: Armchair, tags: ['chair', 'recliner', 'lazy'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // ========== ELECTRONICS ==========
  // Computers
  { id: 'computer-desktop', name: 'Desktop Computer', category: 'electronics', subcategory: 'computers', icon: Monitor, tags: ['computer', 'desktop', 'pc'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'computer-laptop', name: 'Laptop', category: 'electronics', subcategory: 'computers', icon: Monitor, tags: ['computer', 'laptop', 'portable'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'computer-gaming', name: 'Gaming PC', category: 'electronics', subcategory: 'computers', icon: Monitor, tags: ['computer', 'gaming', 'rgb'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // Monitors
  { id: 'monitor-standard', name: 'Monitor', category: 'electronics', subcategory: 'monitors', icon: Monitor, tags: ['monitor', 'screen', 'display'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'monitor-ultrawide', name: 'Ultrawide Monitor', category: 'electronics', subcategory: 'monitors', icon: Monitor, tags: ['monitor', 'ultrawide', 'curved'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'monitor-on', name: 'Monitor (Screen On)', category: 'electronics', subcategory: 'monitors', icon: Monitor, tags: ['monitor', 'screen', 'on', 'active'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'monitor-fp-access', name: 'Monitor (First Person)', category: 'electronics', subcategory: 'monitors', icon: Monitor, tags: ['monitor', 'interactive', 'first-person', 'access'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'monitor-dual', name: 'Dual Monitor Setup', category: 'electronics', subcategory: 'monitors', icon: Monitor, tags: ['monitor', 'dual', 'setup'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // TVs
  { id: 'tv-flatscreen', name: 'Flatscreen TV', category: 'electronics', subcategory: 'tvs', icon: Tv, tags: ['tv', 'flatscreen', 'entertainment'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tv-curved', name: 'Curved TV', category: 'electronics', subcategory: 'tvs', icon: Tv, tags: ['tv', 'curved', 'premium'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'tv-mounted', name: 'Wall Mounted TV', category: 'electronics', subcategory: 'tvs', icon: Tv, tags: ['tv', 'mounted', 'wall'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tv-retro', name: 'Retro CRT TV', category: 'electronics', subcategory: 'tvs', icon: Tv, tags: ['tv', 'retro', 'vintage', 'crt'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Electrical
  { id: 'outlet-standard', name: 'Power Outlet', category: 'electronics', subcategory: 'electrical', icon: CircleDot, tags: ['outlet', 'power', 'electrical'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'outlet-usb', name: 'USB Outlet', category: 'electronics', subcategory: 'electrical', icon: CircleDot, tags: ['outlet', 'usb', 'charging'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'power-strip', name: 'Power Strip', category: 'electronics', subcategory: 'electrical', icon: CircleDot, tags: ['power', 'strip', 'extension'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Lights
  { id: 'light-ceiling', name: 'Ceiling Light', category: 'electronics', subcategory: 'lights', icon: Lightbulb, tags: ['light', 'ceiling', 'fixture'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'light-lamp', name: 'Table Lamp', category: 'electronics', subcategory: 'lights', icon: Lamp, tags: ['light', 'lamp', 'table'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'light-floor', name: 'Floor Lamp', category: 'electronics', subcategory: 'lights', icon: Lamp, tags: ['light', 'floor', 'standing'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'light-chandelier', name: 'Chandelier', category: 'electronics', subcategory: 'lights', icon: Lightbulb, tags: ['light', 'chandelier', 'elegant'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'light-pendant', name: 'Pendant Light', category: 'electronics', subcategory: 'lights', icon: Lightbulb, tags: ['light', 'pendant', 'hanging'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'light-outdoor', name: 'Outdoor Light', category: 'electronics', subcategory: 'lights', icon: Lightbulb, tags: ['light', 'outdoor', 'porch'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== KITCHEN ==========
  // Appliances
  { id: 'refrigerator', name: 'Refrigerator', category: 'kitchen', subcategory: 'appliances', icon: Refrigerator, tags: ['appliance', 'refrigerator', 'fridge'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'refrigerator-double', name: 'Double Door Fridge', category: 'kitchen', subcategory: 'appliances', icon: Refrigerator, tags: ['appliance', 'refrigerator', 'double'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'stove', name: 'Stove', category: 'kitchen', subcategory: 'appliances', icon: Flame, tags: ['appliance', 'stove', 'cooking'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'oven', name: 'Oven', category: 'kitchen', subcategory: 'appliances', icon: Flame, tags: ['appliance', 'oven', 'baking'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'microwave', name: 'Microwave', category: 'kitchen', subcategory: 'appliances', icon: Box, tags: ['appliance', 'microwave', 'heating'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dishwasher', name: 'Dishwasher', category: 'kitchen', subcategory: 'appliances', icon: Box, tags: ['appliance', 'dishwasher', 'cleaning'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'toaster', name: 'Toaster', category: 'kitchen', subcategory: 'appliances', icon: Box, tags: ['appliance', 'toaster', 'breakfast'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'blender', name: 'Blender', category: 'kitchen', subcategory: 'appliances', icon: Box, tags: ['appliance', 'blender', 'smoothie'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'coffee-maker', name: 'Coffee Maker', category: 'kitchen', subcategory: 'appliances', icon: Coffee, tags: ['appliance', 'coffee', 'brewing'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Cutlery
  { id: 'cutlery-set', name: 'Cutlery Set', category: 'kitchen', subcategory: 'cutlery', icon: UtensilsCrossed, tags: ['cutlery', 'utensils', 'silverware'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'knife-set', name: 'Knife Set', category: 'kitchen', subcategory: 'cutlery', icon: UtensilsCrossed, tags: ['knife', 'cutting', 'chef'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'spoon-set', name: 'Spoon Set', category: 'kitchen', subcategory: 'cutlery', icon: UtensilsCrossed, tags: ['spoon', 'eating', 'soup'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'fork-set', name: 'Fork Set', category: 'kitchen', subcategory: 'cutlery', icon: UtensilsCrossed, tags: ['fork', 'eating', 'dining'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'chopsticks', name: 'Chopsticks', category: 'kitchen', subcategory: 'cutlery', icon: UtensilsCrossed, tags: ['chopsticks', 'asian', 'eating'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== FOOD ==========
  // Breakfast
  { id: 'cereal-box', name: 'Cereal Box', category: 'food', subcategory: 'breakfast', icon: Box, tags: ['food', 'cereal', 'box', 'breakfast'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cereal-bowl', name: 'Cereal Bowl', category: 'food', subcategory: 'breakfast', icon: Coffee, tags: ['food', 'cereal', 'bowl', 'milk'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'pancakes', name: 'Pancakes', category: 'food', subcategory: 'breakfast', icon: Coffee, tags: ['food', 'pancakes', 'breakfast', 'syrup'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'eggs-bacon', name: 'Eggs & Bacon', category: 'food', subcategory: 'breakfast', icon: Coffee, tags: ['food', 'eggs', 'bacon', 'breakfast'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'toast', name: 'Toast', category: 'food', subcategory: 'breakfast', icon: Coffee, tags: ['food', 'toast', 'bread', 'butter'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'oatmeal', name: 'Oatmeal Bowl', category: 'food', subcategory: 'breakfast', icon: Coffee, tags: ['food', 'oatmeal', 'healthy'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Lunch
  { id: 'sandwich', name: 'Sandwich', category: 'food', subcategory: 'lunch', icon: Sandwich, tags: ['food', 'sandwich', 'lunch', 'bread'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'salad', name: 'Salad Bowl', category: 'food', subcategory: 'lunch', icon: Leaf, tags: ['food', 'salad', 'healthy', 'vegetables'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'soup-bowl', name: 'Soup Bowl', category: 'food', subcategory: 'lunch', icon: Soup, tags: ['food', 'soup', 'hot', 'bowl'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'burger', name: 'Burger', category: 'food', subcategory: 'lunch', icon: Sandwich, tags: ['food', 'burger', 'fast-food'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wrap', name: 'Wrap', category: 'food', subcategory: 'lunch', icon: Sandwich, tags: ['food', 'wrap', 'tortilla'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Supper/Dinner
  { id: 'pizza', name: 'Pizza', category: 'food', subcategory: 'dinner', icon: Pizza, tags: ['food', 'pizza', 'italian', 'dinner'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'pasta', name: 'Pasta Plate', category: 'food', subcategory: 'dinner', icon: Pizza, tags: ['food', 'pasta', 'italian', 'dinner'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'steak-dinner', name: 'Steak Dinner', category: 'food', subcategory: 'dinner', icon: UtensilsCrossed, tags: ['food', 'steak', 'meat', 'dinner'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'roast-chicken', name: 'Roast Chicken', category: 'food', subcategory: 'dinner', icon: UtensilsCrossed, tags: ['food', 'chicken', 'roast', 'dinner'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'fish-dinner', name: 'Fish Dinner', category: 'food', subcategory: 'dinner', icon: Fish, tags: ['food', 'fish', 'seafood', 'dinner'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'rice-bowl', name: 'Rice Bowl', category: 'food', subcategory: 'dinner', icon: Soup, tags: ['food', 'rice', 'asian', 'dinner'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Fruits & Decor
  { id: 'bowl-fruit', name: 'Bowl of Fruit', category: 'food', subcategory: 'decor', icon: Apple, tags: ['food', 'fruit', 'bowl', 'decor'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'apple', name: 'Apple', category: 'food', subcategory: 'fruits', icon: Apple, tags: ['food', 'apple', 'fruit', 'healthy'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'banana', name: 'Banana', category: 'food', subcategory: 'fruits', icon: Apple, tags: ['food', 'banana', 'fruit', 'yellow'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'orange', name: 'Orange', category: 'food', subcategory: 'fruits', icon: Apple, tags: ['food', 'orange', 'citrus', 'fruit'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== TEXTILES ==========
  { id: 'apron', name: 'Apron', category: 'textiles', subcategory: 'clothing', icon: User, tags: ['apron', 'cooking', 'kitchen'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'apron-pinned', name: 'Apron (Pinned)', category: 'textiles', subcategory: 'clothing', icon: User, tags: ['apron', 'pinned', 'display'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tablecloth', name: 'Tablecloth', category: 'textiles', subcategory: 'linens', icon: Table, tags: ['cloth', 'table', 'linen'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== VEHICLES ==========
  { id: 'car-jaguar', name: 'Jaguar F-Type', category: 'vehicles', subcategory: 'sports', icon: Car, tags: ['car', 'sports', 'british'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-nissan-gt', name: 'Nissan GT-R', category: 'vehicles', subcategory: 'sports', icon: Car, tags: ['car', 'jdm', 'godzilla'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-mazda-rx7', name: 'Mazda RX-7', category: 'vehicles', subcategory: 'jdm', icon: Car, tags: ['car', 'rotary', 'drift'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-ford-f150', name: 'Ford F-150', category: 'vehicles', subcategory: 'trucks', icon: Car, tags: ['truck', 'american', 'pickup'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'car-mercedes-amg', name: 'Mercedes AMG GT', category: 'vehicles', subcategory: 'luxury', icon: Car, tags: ['car', 'german', 'luxury'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'car-camaro-77', name: '1977 Camaro', category: 'vehicles', subcategory: 'classic', icon: Car, tags: ['car', 'classic', 'muscle'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'car-bentley', name: 'Bentley Continental', category: 'vehicles', subcategory: 'luxury', icon: Car, tags: ['car', 'british', 'luxury'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'car-chrysler-300', name: 'Chrysler 300', category: 'vehicles', subcategory: 'sedan', icon: Car, tags: ['car', 'american', 'sedan'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'fire-truck', name: 'Fire Truck', category: 'vehicles', subcategory: 'emergency', icon: Truck, tags: ['truck', 'fire', 'emergency', 'rescue'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // Vehicle Parts
  { id: 'gear-manual-5', name: '5-Speed Manual', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'manual', 'gearbox'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'gear-manual-6', name: '6-Speed Manual', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'manual', 'racing'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'gear-dct', name: 'Dual-Clutch DCT', category: 'parts', subcategory: 'gears', icon: Cog, tags: ['transmission', 'automatic', 'sport'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'engine-v6', name: 'Twin-Turbo V6', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'turbo', 'v6'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'engine-v8', name: 'V8 Muscle Engine', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'muscle', 'v8'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'engine-rotary', name: '13B Rotary', category: 'parts', subcategory: 'engines', icon: Gauge, tags: ['engine', 'rotary', 'wankel'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-straight', name: 'Straight Pipe', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'performance', 'loud'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-quad', name: 'Quad Tip Exhaust', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'sport', 'quad'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-titanium', name: 'Titanium Race', category: 'parts', subcategory: 'exhausts', icon: Wind, tags: ['exhaust', 'racing', 'titanium'], tier: 'enterprise', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-gt', name: 'GT Wing Spoiler', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'racing', 'wing'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-lip', name: 'Lip Spoiler', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'subtle', 'lip'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-active', name: 'Active Aero Wing', category: 'parts', subcategory: 'spoilers', icon: Sparkles, tags: ['spoiler', 'hypercar', 'active'], tier: 'enterprise', imageUrl: '/placeholder.svg' },

  // ========== NATURE ==========
  // Trees
  { id: 'tree-oak', name: 'Oak Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'forest', 'deciduous'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-pine', name: 'Pine Tree', category: 'nature', subcategory: 'trees', icon: Trees, tags: ['vegetation', 'conifer', 'evergreen'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-willow', name: 'Willow Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'willow', 'weeping'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-apricot', name: 'Apricot Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'apricot', 'fruit', 'orchard'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-palm', name: 'Palm Tree', category: 'nature', subcategory: 'trees', icon: TreePine, tags: ['vegetation', 'tropical', 'palm'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-birch', name: 'Birch Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'birch', 'white'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tree-maple', name: 'Maple Tree', category: 'nature', subcategory: 'trees', icon: TreeDeciduous, tags: ['vegetation', 'maple', 'fall'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Bushes
  { id: 'bush-green', name: 'Green Bush', category: 'nature', subcategory: 'bushes', icon: Shrub, tags: ['vegetation', 'bush', 'green'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bush-flowering', name: 'Flowering Bush', category: 'nature', subcategory: 'bushes', icon: Flower2, tags: ['vegetation', 'bush', 'flowers'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bush-hedge', name: 'Hedge Bush', category: 'nature', subcategory: 'bushes', icon: Shrub, tags: ['vegetation', 'hedge', 'trimmed'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bush-berry', name: 'Berry Bush', category: 'nature', subcategory: 'bushes', icon: Shrub, tags: ['vegetation', 'berry', 'fruit'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bush-tropical', name: 'Tropical Bush', category: 'nature', subcategory: 'bushes', icon: Shrub, tags: ['vegetation', 'tropical', 'jungle'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Rocks & Mountains
  { id: 'rock-large', name: 'Large Rock', category: 'nature', subcategory: 'rocks', icon: Mountain, tags: ['stone', 'boulder', 'natural'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'mountain-peak', name: 'Mountain Peak', category: 'nature', subcategory: 'mountains', icon: Mountain, tags: ['terrain', 'height', 'rocky'], tier: 'pro', imageUrl: '/placeholder.svg' },

  // Gardening Equipment
  { id: 'garden-shovel', name: 'Garden Shovel', category: 'nature', subcategory: 'gardening', icon: Flower2, tags: ['tool', 'shovel', 'digging'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'garden-rake', name: 'Garden Rake', category: 'nature', subcategory: 'gardening', icon: Flower2, tags: ['tool', 'rake', 'leaves'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'garden-hose', name: 'Garden Hose', category: 'nature', subcategory: 'gardening', icon: Droplets, tags: ['tool', 'hose', 'watering'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'lawn-mower', name: 'Lawn Mower', category: 'nature', subcategory: 'gardening', icon: Flower2, tags: ['tool', 'mower', 'grass'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'wheelbarrow', name: 'Wheelbarrow', category: 'nature', subcategory: 'gardening', icon: Flower2, tags: ['tool', 'wheelbarrow', 'carrying'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'watering-can', name: 'Watering Can', category: 'nature', subcategory: 'gardening', icon: Droplets, tags: ['tool', 'watering', 'plants'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'flower-pot', name: 'Flower Pot', category: 'nature', subcategory: 'gardening', icon: Flower2, tags: ['pot', 'planter', 'flowers'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== ANIMALS ==========
  // Domestic
  { id: 'dog-labrador', name: 'Labrador Dog', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'dog', 'pet', 'labrador'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dog-german-shepherd', name: 'German Shepherd', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'dog', 'pet', 'shepherd'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dog-husky', name: 'Husky', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'dog', 'pet', 'husky'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cat-tabby', name: 'Tabby Cat', category: 'animals', subcategory: 'domestic', icon: Cat, tags: ['animal', 'cat', 'pet', 'tabby'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cat-persian', name: 'Persian Cat', category: 'animals', subcategory: 'domestic', icon: Cat, tags: ['animal', 'cat', 'pet', 'persian'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cat-siamese', name: 'Siamese Cat', category: 'animals', subcategory: 'domestic', icon: Cat, tags: ['animal', 'cat', 'pet', 'siamese'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Wild
  { id: 'wolf', name: 'Wolf', category: 'animals', subcategory: 'wild', icon: Dog, tags: ['animal', 'wolf', 'predator', 'wild'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'wolf-arctic', name: 'Arctic Wolf', category: 'animals', subcategory: 'wild', icon: Dog, tags: ['animal', 'wolf', 'arctic', 'white'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'tiger', name: 'Tiger', category: 'animals', subcategory: 'wild', icon: Cat, tags: ['animal', 'tiger', 'big-cat', 'stripes'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'lion', name: 'Lion', category: 'animals', subcategory: 'wild', icon: Cat, tags: ['animal', 'lion', 'big-cat', 'mane', 'king'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cougar', name: 'Cougar', category: 'animals', subcategory: 'wild', icon: Cat, tags: ['animal', 'cougar', 'mountain-lion', 'predator'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'snow-leopard', name: 'Snow Leopard', category: 'animals', subcategory: 'wild', icon: Cat, tags: ['animal', 'leopard', 'snow', 'spotted'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'fox', name: 'Fox', category: 'animals', subcategory: 'wild', icon: Dog, tags: ['animal', 'fox', 'red', 'cunning'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Large Mammals
  { id: 'elephant', name: 'Elephant', category: 'animals', subcategory: 'wild', icon: User, tags: ['animal', 'elephant', 'large', 'trunk', 'tusks'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'horse', name: 'Horse', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'horse', 'equine', 'riding'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'horse-white', name: 'White Horse', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'horse', 'white', 'stallion'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'horse-black', name: 'Black Stallion', category: 'animals', subcategory: 'domestic', icon: Dog, tags: ['animal', 'horse', 'black', 'stallion'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Small Mammals
  { id: 'rabbit', name: 'Rabbit', category: 'animals', subcategory: 'domestic', icon: Cat, tags: ['animal', 'rabbit', 'bunny', 'pet'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'rabbit-white', name: 'White Rabbit', category: 'animals', subcategory: 'domestic', icon: Cat, tags: ['animal', 'rabbit', 'bunny', 'white'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Primates
  { id: 'gorilla', name: 'Gorilla', category: 'animals', subcategory: 'primates', icon: User, tags: ['animal', 'gorilla', 'ape', 'primate'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'chimpanzee', name: 'Chimpanzee', category: 'animals', subcategory: 'primates', icon: User, tags: ['animal', 'chimpanzee', 'ape', 'primate'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Birds
  { id: 'peacock', name: 'Peacock', category: 'animals', subcategory: 'birds', icon: Bird, tags: ['animal', 'peacock', 'bird', 'colorful'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'eagle', name: 'Eagle', category: 'animals', subcategory: 'birds', icon: Bird, tags: ['animal', 'eagle', 'bird', 'predator'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'parrot', name: 'Parrot', category: 'animals', subcategory: 'birds', icon: Bird, tags: ['animal', 'parrot', 'bird', 'tropical'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'penguin', name: 'Penguin', category: 'animals', subcategory: 'birds', icon: Bird, tags: ['animal', 'penguin', 'bird', 'arctic', 'flightless'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Aquatic - Freshwater
  { id: 'trout', name: 'Trout', category: 'animals', subcategory: 'freshwater', icon: Fish, tags: ['animal', 'fish', 'trout', 'freshwater'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'catfish', name: 'Catfish', category: 'animals', subcategory: 'freshwater', icon: Fish, tags: ['animal', 'fish', 'catfish', 'freshwater'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'bass', name: 'Bass', category: 'animals', subcategory: 'freshwater', icon: Fish, tags: ['animal', 'fish', 'bass', 'freshwater'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Aquatic - Marine
  { id: 'jellyfish', name: 'Jellyfish', category: 'animals', subcategory: 'sea-life', icon: Waves, tags: ['animal', 'jellyfish', 'ocean', 'invertebrate'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'seahorse', name: 'Seahorse', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'seahorse', 'ocean', 'tropical'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'sea-urchin', name: 'Sea Urchin', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'sea-urchin', 'ocean', 'spiny'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'manta-ray', name: 'Manta Ray', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'manta', 'ray', 'ocean'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'blue-whale', name: 'Blue Whale', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'whale', 'blue', 'ocean', 'mammal'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'orca', name: 'Orca', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'orca', 'killer-whale', 'ocean'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'shrimp', name: 'Shrimp', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'shrimp', 'crustacean', 'ocean'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'dolphin', name: 'Dolphin', category: 'animals', subcategory: 'sea-life', icon: Fish, tags: ['animal', 'dolphin', 'ocean', 'mammal'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'algae', name: 'Algae', category: 'animals', subcategory: 'sea-life', icon: Leaf, tags: ['plant', 'algae', 'ocean', 'seaweed'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Reptiles
  { id: 'crocodile', name: 'Crocodile', category: 'animals', subcategory: 'reptiles', icon: Fish, tags: ['animal', 'crocodile', 'reptile', 'swamp'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'alligator', name: 'Alligator', category: 'animals', subcategory: 'reptiles', icon: Fish, tags: ['animal', 'alligator', 'reptile', 'swamp'], tier: 'free', imageUrl: '/placeholder.svg' },

  // ========== BIOMES ==========
  // Swamp
  { id: 'biome-swamp', name: 'Swamp Biome', category: 'terrain', subcategory: 'biomes', icon: Droplets, tags: ['biome', 'swamp', 'wetland', 'murky'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'swamp-tree', name: 'Swamp Tree', category: 'terrain', subcategory: 'biomes', icon: TreeDeciduous, tags: ['tree', 'swamp', 'moss', 'bayou'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'swamp-water', name: 'Swamp Water', category: 'terrain', subcategory: 'biomes', icon: Droplets, tags: ['water', 'swamp', 'murky', 'still'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'lily-pad', name: 'Lily Pad', category: 'terrain', subcategory: 'biomes', icon: Leaf, tags: ['plant', 'lily', 'water', 'swamp'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Marsh
  { id: 'biome-marsh', name: 'Marsh Biome', category: 'terrain', subcategory: 'biomes', icon: Waves, tags: ['biome', 'marsh', 'wetland', 'grassy'], tier: 'pro', imageUrl: '/placeholder.svg' },
  { id: 'marsh-grass', name: 'Marsh Grass', category: 'terrain', subcategory: 'biomes', icon: Leaf, tags: ['grass', 'marsh', 'tall', 'reeds'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'cattails', name: 'Cattails', category: 'terrain', subcategory: 'biomes', icon: Leaf, tags: ['plant', 'cattail', 'marsh', 'wetland'], tier: 'free', imageUrl: '/placeholder.svg' },

  // Roads & Paths
  { id: 'road-cobble', name: 'Cobblestone Road', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'stone', 'medieval'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'road-dirt', name: 'Dirt Path', category: 'terrain', subcategory: 'roads', icon: MapPin, tags: ['path', 'earth', 'natural'], tier: 'free', imageUrl: '/placeholder.svg' },
  { id: 'road-asphalt', name: 'Asphalt Road', category: 'terrain', subcategory: 'roads', icon: Car, tags: ['modern', 'street', 'urban'], tier: 'pro', imageUrl: '/placeholder.svg' },
];

const categories = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'characters', label: 'Characters', icon: User },
  { id: 'structures', label: 'Structures', icon: Building2 },
  { id: 'furniture', label: 'Furniture', icon: Sofa },
  { id: 'electronics', label: 'Electronics', icon: Monitor },
  { id: 'kitchen', label: 'Kitchen', icon: Refrigerator },
  { id: 'food', label: 'Food', icon: Apple },
  { id: 'textiles', label: 'Textiles', icon: User },
  { id: 'animals', label: 'Animals', icon: Dog },
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
  const { addObject, addProceduralModel } = useSceneStore();

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
    
    // Add to project store (inventory)
    addAsset({
      name: asset.name,
      type: 'model',
      thumbnail: asset.imageUrl || '',
      source: 'local',
    });

    // Map asset IDs to procedural model IDs
    const assetToProceduralModel: Record<string, string> = {
      // Characters
      'male-warrior': 'humanoid',
      'male-mage': 'humanoid',
      'male-knight': 'humanoid',
      'male-peasant': 'humanoid',
      'female-archer': 'humanoid',
      'female-sorceress': 'humanoid',
      'female-queen': 'humanoid',
      'robot-basic': 'robot',
      'cyborg-soldier': 'robot',
      'ogre': 'humanoid',
      'tree-monster': 'tree',
      'dragon-red': 'dragon',
      'dragon-ice': 'dragon',
      
      // Animals - Domestic
      'dog-labrador': 'dog',
      'dog-german-shepherd': 'dog',
      'dog-husky': 'dog',
      'cat-tabby': 'cat',
      'cat-persian': 'cat',
      'cat-siamese': 'cat',
      'horse': 'horse',
      'horse-white': 'horse',
      'horse-black': 'horse',
      'rabbit': 'rabbit',
      'rabbit-white': 'rabbit',
      
      // Animals - Wild
      'wolf': 'wolf',
      'wolf-arctic': 'wolf',
      'tiger': 'tiger',
      'lion': 'lion',
      'cougar': 'tiger',
      'snow-leopard': 'tiger',
      'fox': 'fox',
      'elephant': 'elephant',
      
      // Animals - Primates
      'gorilla': 'gorilla',
      'chimpanzee': 'gorilla',
      
      // Animals - Birds
      'peacock': 'bird',
      'eagle': 'bird',
      'parrot': 'bird',
      'penguin': 'penguin',
      
      // Animals - Fish
      'trout': 'fish',
      'catfish': 'fish',
      'bass': 'fish',
      
      // Animals - Marine
      'jellyfish': 'fish',
      'seahorse': 'fish',
      'sea-urchin': 'fish',
      'manta-ray': 'fish',
      'blue-whale': 'whale',
      'orca': 'whale',
      'shrimp': 'fish',
      'dolphin': 'dolphin',
      'algae': 'bush',
      
      // Animals - Reptiles
      'crocodile': 'crocodile',
      'alligator': 'crocodile',
      
      // Nature - Trees
      'tree-oak': 'tree',
      'tree-pine': 'tree',
      'tree-willow': 'willow',
      'tree-apricot': 'tree',
      'tree-palm': 'palm',
      'tree-birch': 'tree',
      'tree-maple': 'tree',
      
      // Nature - Bushes
      'bush-green': 'bush',
      'bush-flowering': 'flower',
      'bush-hedge': 'bush',
      'bush-berry': 'bush',
      'bush-tropical': 'bush',
      
      // Nature - Rocks
      'rock-large': 'rock',
      'mountain-peak': 'rock',
      
      // Nature - Gardening
      'garden-shovel': 'humanoid',
      'garden-rake': 'humanoid',
      'garden-hose': 'humanoid',
      'lawn-mower': 'car',
      'wheelbarrow': 'car',
      'watering-can': 'humanoid',
      'flower-pot': 'flower',
      
      // Structures - Houses
      'house-medieval': 'house',
      'house-modern': 'house',
      'cottage': 'cottage',
      'cottage-stone': 'cottage',
      'cottage-thatched': 'cottage',
      'castle': 'house',
      'tower': 'house',
      'shop': 'house',
      'tavern': 'house',
      
      // Structures - Walls
      'wall-brick': 'wall',
      'wall-stone': 'wall',
      'wall-concrete': 'wall',
      'wall-wooden': 'wall',
      'wall-drywall': 'wall',
      
      // Structures - Doors
      'door-wooden': 'door',
      'door-glass': 'door',
      'door-metal': 'door',
      'door-double': 'door',
      'door-sliding': 'door',
      
      // Structures - Stairs
      'stairs-wooden': 'stairs',
      'stairs-stone': 'stairs',
      'stairs-spiral': 'stairs',
      'stairs-metal': 'stairs',
      
      // Structures - Roofs
      'roof-shingle': 'roof',
      'roof-tile': 'roof',
      'roof-thatch': 'roof',
      'roof-flat': 'roof',
      'roof-metal': 'roof',
      
      // Structures - Safety
      'fire-escape': 'stairs',
      'fire-hydrant': 'fire-hydrant',
      
      // Structures - Marine
      'wharf': 'dock',
      'dock-wooden': 'dock',
      'dock-concrete': 'dock',
      'pier': 'dock',
      
      // Structures - Outdoor
      'swimming-pool': 'pool',
      'pool-inground': 'pool',
      'pool-above': 'pool',
      
      // Furniture - Tables
      'table-dining': 'table',
      'table-coffee': 'table',
      'table-with-cloth': 'table-cloth',
      'table-desk': 'table',
      'table-side': 'table',
      
      // Furniture - Cabinets
      'cabinet-kitchen': 'cabinet',
      'cabinet-bathroom': 'cabinet',
      'cabinet-filing': 'cabinet',
      'cabinet-china': 'cabinet',
      'wardrobe': 'cabinet',
      
      // Furniture - Beds
      'bed-twin': 'bed',
      'bed-full': 'bed',
      'bed-queen': 'bed',
      'bed-king': 'bed',
      'bed-california-king': 'bed',
      'bed-bunk': 'bunk-bed',
      'bed-loft': 'bunk-bed',
      'bed-murphy': 'bed',
      'bed-daybed': 'bed',
      
      // Furniture - Seating
      'couch-sectional': 'couch',
      'couch-loveseat': 'couch',
      'couch-sofa': 'couch',
      'couch-futon': 'couch',
      'armchair': 'chair',
      'recliner': 'chair',
      
      // Electronics
      'computer-desktop': 'computer',
      'computer-laptop': 'computer',
      'computer-gaming': 'computer',
      'monitor-standard': 'monitor',
      'monitor-ultrawide': 'monitor',
      'monitor-on': 'monitor',
      'monitor-fp-access': 'monitor',
      'monitor-dual': 'monitor',
      'tv-flatscreen': 'tv',
      'tv-curved': 'tv',
      'tv-mounted': 'tv',
      'tv-retro': 'tv',
      'outlet-standard': 'lamp',
      'outlet-usb': 'lamp',
      'power-strip': 'lamp',
      'light-ceiling': 'lamp',
      'light-lamp': 'lamp',
      'light-floor': 'lamp',
      'light-chandelier': 'lamp',
      'light-pendant': 'lamp',
      'light-outdoor': 'lamp',
      
      // Kitchen
      'refrigerator': 'refrigerator',
      'refrigerator-double': 'refrigerator',
      'stove': 'stove',
      'oven': 'stove',
      'microwave': 'cabinet',
      'dishwasher': 'cabinet',
      'toaster': 'cabinet',
      'blender': 'lamp',
      'coffee-maker': 'lamp',
      'cutlery-set': 'humanoid',
      'knife-set': 'humanoid',
      'spoon-set': 'humanoid',
      'fork-set': 'humanoid',
      'chopsticks': 'humanoid',
      
      // Food
      'cereal-box': 'cereal',
      'cereal-bowl': 'fruit-bowl',
      'pancakes': 'pizza',
      'eggs-bacon': 'pizza',
      'toast': 'cereal',
      'oatmeal': 'fruit-bowl',
      'sandwich': 'cereal',
      'salad': 'fruit-bowl',
      'soup-bowl': 'fruit-bowl',
      'burger': 'cereal',
      'wrap': 'cereal',
      'pizza': 'pizza',
      'pasta': 'fruit-bowl',
      'steak-dinner': 'pizza',
      'roast-chicken': 'pizza',
      'fish-dinner': 'fish',
      'rice-bowl': 'fruit-bowl',
      'bowl-fruit': 'fruit-bowl',
      'apple': 'fruit-bowl',
      'banana': 'fruit-bowl',
      'orange': 'fruit-bowl',
      
      // Textiles
      'apron': 'apron',
      'apron-pinned': 'apron',
      'tablecloth': 'table-cloth',
      
      // Vehicles
      'car-jaguar': 'car',
      'car-nissan-gt': 'car',
      'car-mazda-rx7': 'car',
      'car-ford-f150': 'truck',
      'car-mercedes-amg': 'car',
      'car-camaro-77': 'car',
      'car-bentley': 'car',
      'car-chrysler-300': 'car',
      'fire-truck': 'fire-truck',
      
      // Terrain/Biomes
      'biome-swamp': 'bush',
      'swamp-tree': 'willow',
      'swamp-water': 'pool',
      'lily-pad': 'flower',
      'biome-marsh': 'bush',
      'marsh-grass': 'bush',
      'cattails': 'flower',
      'road-cobble': 'dock',
      'road-dirt': 'dock',
      'road-asphalt': 'dock',
    };
    
    // Get the procedural model ID or fallback
    const modelId = assetToProceduralModel[asset.id];
    
    if (modelId) {
      // Use procedural 3D model
      addProceduralModel(modelId, asset.name);
    } else {
      // Fallback to primitive for unmapped assets
      addObject('cube', asset.name);
    }
    
    toast.success(`Added ${asset.name}`, {
      description: 'Asset spawned in scene and added to inventory!',
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
