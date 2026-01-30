import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Search,
  Expand,
  Package,
  Car,
  Cog,
  Gauge,
  Wind,
  Sparkles,
  ShoppingBag,
  Filter,
  Grid,
  List,
  X,
} from 'lucide-react';
import { useProjectStore, Asset } from '@/store/projectStore';
import { toast } from 'sonner';

interface InventoryItem extends Asset {
  category?: string;
  subcategory?: string;
  imageUrl?: string;
}

const vehiclePartsCategories = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'gears', label: 'Gears', icon: Cog },
  { id: 'engines', label: 'Engines', icon: Gauge },
  { id: 'exhausts', label: 'Exhausts', icon: Wind },
  { id: 'spoilers', label: 'Spoilers', icon: Sparkles },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
];

// Preloaded vehicle parts with placeholder images
const vehicleParts: InventoryItem[] = [
  // Gears
  { id: 'gear-manual-5', name: '5-Speed Manual Transmission', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'gears', subcategory: 'transmission', imageUrl: '/placeholder.svg' },
  { id: 'gear-manual-6', name: '6-Speed Manual Gearbox', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'gears', subcategory: 'transmission', imageUrl: '/placeholder.svg' },
  { id: 'gear-auto-8', name: '8-Speed Automatic', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'gears', subcategory: 'transmission', imageUrl: '/placeholder.svg' },
  { id: 'gear-dct', name: 'Dual-Clutch DCT', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'gears', subcategory: 'transmission', imageUrl: '/placeholder.svg' },
  { id: 'gear-sequential', name: 'Sequential Racing', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'gears', subcategory: 'racing', imageUrl: '/placeholder.svg' },
  
  // Engines
  { id: 'engine-v6-twin', name: 'Twin-Turbo V6', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'v6', imageUrl: '/placeholder.svg' },
  { id: 'engine-v8-muscle', name: 'V8 Muscle Engine', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'v8', imageUrl: '/placeholder.svg' },
  { id: 'engine-i4-turbo', name: '2.0L Turbo I4', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'i4', imageUrl: '/placeholder.svg' },
  { id: 'engine-v12', name: 'V12 Supercar Engine', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'v12', imageUrl: '/placeholder.svg' },
  { id: 'engine-rotary', name: '13B Rotary Engine', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'rotary', imageUrl: '/placeholder.svg' },
  { id: 'engine-electric', name: 'Electric Motor Pack', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'engines', subcategory: 'electric', imageUrl: '/placeholder.svg' },
  
  // Exhausts
  { id: 'exhaust-straight', name: 'Straight Pipe Exhaust', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'exhausts', subcategory: 'performance', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-quad', name: 'Quad Tip Exhaust', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'exhausts', subcategory: 'performance', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-dual', name: 'Dual Exit System', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'exhausts', subcategory: 'sport', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-titanium', name: 'Titanium Race Exhaust', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'exhausts', subcategory: 'racing', imageUrl: '/placeholder.svg' },
  { id: 'exhaust-center', name: 'Center Exit Exhaust', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'exhausts', subcategory: 'exotic', imageUrl: '/placeholder.svg' },
  
  // Spoilers
  { id: 'spoiler-gt', name: 'GT Wing Spoiler', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'spoilers', subcategory: 'racing', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-lip', name: 'Lip Spoiler', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'spoilers', subcategory: 'subtle', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-ducktail', name: 'Ducktail Spoiler', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'spoilers', subcategory: 'classic', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-active', name: 'Active Aero Wing', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'spoilers', subcategory: 'hypercar', imageUrl: '/placeholder.svg' },
  { id: 'spoiler-roof', name: 'Roof Spoiler', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'spoilers', subcategory: 'hatchback', imageUrl: '/placeholder.svg' },
  
  // Vehicles
  { id: 'car-jaguar', name: 'Jaguar F-Type', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'sports', imageUrl: '/placeholder.svg' },
  { id: 'car-nissan-gt', name: 'Nissan GT-R', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'sports', imageUrl: '/placeholder.svg' },
  { id: 'car-mazda-rx7', name: 'Mazda RX-7', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'jdm', imageUrl: '/placeholder.svg' },
  { id: 'car-ford-f150', name: 'Ford F-150', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'truck', imageUrl: '/placeholder.svg' },
  { id: 'car-mercedes-amg', name: 'Mercedes AMG GT', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'luxury', imageUrl: '/placeholder.svg' },
  { id: 'car-semitruck', name: 'Semi Truck', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'commercial', imageUrl: '/placeholder.svg' },
  { id: 'car-camaro-77', name: '1977 Camaro', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'classic', imageUrl: '/placeholder.svg' },
  { id: 'car-bentley', name: 'Bentley Continental', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'luxury', imageUrl: '/placeholder.svg' },
  { id: 'car-renault', name: 'Renault Sport RS', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'euro', imageUrl: '/placeholder.svg' },
  { id: 'car-buick', name: 'Buick Grand National', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'classic', imageUrl: '/placeholder.svg' },
  { id: 'car-chrysler-300', name: 'Chrysler 300', type: 'model', thumbnail: '', source: 'local', createdAt: new Date(), category: 'vehicles', subcategory: 'sedan', imageUrl: '/placeholder.svg' },
];

interface ExpandedInventoryProps {
  onAddToScene?: (item: InventoryItem) => void;
}

export function ExpandedInventory({ onAddToScene }: ExpandedInventoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { assets: userAssets, addAsset } = useProjectStore();

  // Combine user assets with preloaded vehicle parts
  const allItems = [...userAssets, ...vehicleParts];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const inventoryItem = item as InventoryItem;
    const matchesCategory = selectedCategory === 'all' || inventoryItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToScene = (item: InventoryItem) => {
    if (onAddToScene) {
      onAddToScene(item);
    }
    toast.success(`Added ${item.name} to scene`);
    setIsExpanded(false);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'gears': return <Cog className="w-4 h-4" />;
      case 'engines': return <Gauge className="w-4 h-4" />;
      case 'exhausts': return <Wind className="w-4 h-4" />;
      case 'spoilers': return <Sparkles className="w-4 h-4" />;
      case 'vehicles': return <Car className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Expand className="w-4 h-4" />
          Expand Inventory
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Asset Inventory
            </DialogTitle>
            <Badge variant="outline" className="text-sm">
              {filteredItems.length} items
            </Badge>
          </div>
          
          {/* Search & Filters */}
          <div className="flex gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="px-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {vehiclePartsCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                className="gap-2 flex-shrink-0"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Items Grid/List */}
        <ScrollArea className="flex-1 px-6 pb-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
              {filteredItems.map((item) => {
                const inventoryItem = item as InventoryItem;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-card rounded-xl border border-border/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => handleAddToScene(inventoryItem)}
                  >
                    <div className="aspect-square bg-muted/50 flex items-center justify-center">
                      {inventoryItem.imageUrl ? (
                        <img
                          src={inventoryItem.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getCategoryIcon(inventoryItem.category)
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {inventoryItem.subcategory || item.type}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="glass">
                        Add to Scene
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 pt-4">
              {filteredItems.map((item) => {
                const inventoryItem = item as InventoryItem;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => handleAddToScene(inventoryItem)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                      {getCategoryIcon(inventoryItem.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {inventoryItem.category} • {inventoryItem.subcategory || item.type}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Add
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No Items Found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or category filter</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
