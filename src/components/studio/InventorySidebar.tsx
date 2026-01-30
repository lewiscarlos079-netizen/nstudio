import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  Package,
  Layers,
  Plus,
  ChevronRight,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowRightFromLine,
} from 'lucide-react';
import { useProjectStore, Asset } from '@/store/projectStore';
import { useSceneStore, PrimitiveType } from '@/store/sceneStore';
import { toast } from 'sonner';

export function InventorySidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const { assets } = useProjectStore();
  const { objects, addObject, selectObject, selectedObjectId, toggleObjectVisibility, toggleObjectLock, removeObject } = useSceneStore();

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpawnAsset = (asset: Asset) => {
    // Map asset to a primitive type or model
    const primitiveMap: Record<string, PrimitiveType> = {
      'model': 'cube',
      'texture': 'plane',
      'material': 'sphere',
      'animation': 'cylinder',
    };
    
    const type = primitiveMap[asset.type] || 'cube';
    addObject(type, asset.name);
    toast.success(`Spawned ${asset.name} in scene`);
  };

  const handleSelectSceneObject = (id: string) => {
    selectObject(id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowRightFromLine className="w-4 h-4" />
          <span className="hidden sm:inline">Full Inventory</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Scene Inventory
          </SheetTitle>
          
          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets & objects..."
              className="pl-10"
            />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {/* Scene Objects Section */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" />
                Scene Objects
              </h3>
              <Badge variant="outline" className="text-xs">
                {objects.length}
              </Badge>
            </div>

            {objects.length > 0 ? (
              <div className="space-y-2">
                {objects.map((obj) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                      selectedObjectId === obj.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => handleSelectSceneObject(obj.id)}
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: obj.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{obj.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{obj.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleObjectVisibility(obj.id);
                        }}
                      >
                        {obj.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleObjectLock(obj.id);
                        }}
                      >
                        {obj.locked ? (
                          <Lock className="w-3 h-3 text-warning" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeObject(obj.id);
                          toast.success(`Removed ${obj.name}`);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No objects in scene</p>
              </div>
            )}
          </div>

          {/* Assets Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Your Assets
              </h3>
              <Badge variant="outline" className="text-xs">
                {filteredAssets.length}
              </Badge>
            </div>

            {filteredAssets.length > 0 ? (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition-all group"
                    onClick={() => handleSpawnAsset(asset)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {asset.type} • {asset.source}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">
                  {searchQuery ? 'No matching assets' : 'No assets yet'}
                </p>
                <p className="text-[10px] mt-1">Add from the Asset Library</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Click an asset to spawn it in the scene
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
