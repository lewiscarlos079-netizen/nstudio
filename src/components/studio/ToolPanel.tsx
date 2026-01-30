import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Box, 
  Circle, 
  Triangle, 
  Cylinder, 
  Trash2, 
  Copy, 
  Move, 
  RotateCcw, 
  Maximize2, 
  MousePointer2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Grid3X3,
  Hexagon,
  Square
} from 'lucide-react';
import { useSceneStore, PrimitiveType } from '@/store/sceneStore';
import { toast } from 'sonner';

const primitives: { type: PrimitiveType; icon: React.ComponentType<any>; label: string }[] = [
  { type: 'cube', icon: Box, label: 'Cube' },
  { type: 'sphere', icon: Circle, label: 'Sphere' },
  { type: 'cylinder', icon: Cylinder, label: 'Cylinder' },
  { type: 'cone', icon: Triangle, label: 'Cone' },
  { type: 'plane', icon: Square, label: 'Plane' },
  { type: 'torus', icon: Hexagon, label: 'Torus' },
];

const transformTools = [
  { mode: 'select' as const, icon: MousePointer2, label: 'Select (Q)', shortcut: 'Q' },
  { mode: 'translate' as const, icon: Move, label: 'Move (W)', shortcut: 'W' },
  { mode: 'rotate' as const, icon: RotateCcw, label: 'Rotate (E)', shortcut: 'E' },
  { mode: 'scale' as const, icon: Maximize2, label: 'Scale (R)', shortcut: 'R' },
];

export function ToolPanel() {
  const { 
    addObject, 
    selectedObjectId, 
    objects, 
    removeObject, 
    duplicateObject,
    transformMode,
    setTransformMode,
    toggleObjectLock,
    toggleObjectVisibility,
    showGrid,
    toggleGrid
  } = useSceneStore();

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const handleAddPrimitive = (type: PrimitiveType, label: string) => {
    addObject(type);
    toast.success(`${label} added to scene`);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-xl p-3 w-20 flex flex-col items-center gap-2 relative z-30"
      >
        {/* Transform Tools */}
        <div className="w-full">
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider text-center mb-1">
            Tools
          </p>
          <div className="flex flex-col gap-1">
            {transformTools.map((tool) => (
              <Tooltip key={tool.mode}>
                <TooltipTrigger asChild>
                  <Button
                    variant={transformMode === tool.mode ? "default" : "ghost"}
                    size="icon"
                    className={`w-10 h-10 mx-auto ${transformMode === tool.mode ? 'glow-primary-sm' : ''}`}
                    onClick={() => setTransformMode(tool.mode)}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50 w-12" />

        {/* Primitives */}
        <div className="w-full">
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider text-center mb-1">
            Shapes
          </p>
          <div className="flex flex-col gap-1">
            {primitives.map((primitive) => (
              <Tooltip key={primitive.type}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 mx-auto hover:glow-primary-sm"
                    onClick={() => handleAddPrimitive(primitive.type, primitive.label)}
                  >
                    <primitive.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Add {primitive.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50 w-12" />

        {/* Object Actions */}
        <div className="w-full">
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider text-center mb-1">
            Actions
          </p>
          <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 mx-auto"
                disabled={!selectedObjectId}
                onClick={() => selectedObjectId && duplicateObject(selectedObjectId)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Duplicate (Ctrl+D)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 mx-auto"
                disabled={!selectedObjectId}
                onClick={() => selectedObjectId && toggleObjectLock(selectedObjectId)}
              >
                {selectedObject?.locked ? (
                  <Lock className="w-4 h-4 text-warning" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{selectedObject?.locked ? 'Unlock Object' : 'Lock Object (L)'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 mx-auto"
                disabled={!selectedObjectId}
                onClick={() => selectedObjectId && toggleObjectVisibility(selectedObjectId)}
              >
                {selectedObject?.visible === false ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Visibility (H)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 mx-auto hover:bg-destructive/20 hover:text-destructive"
                disabled={!selectedObjectId}
                onClick={() => selectedObjectId && removeObject(selectedObjectId)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete (Del)</p>
            </TooltipContent>
          </Tooltip>
          </div>
        </div>

        <Separator className="bg-border/50 w-12" />

        {/* View Options */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="icon"
              className="w-10 h-10 mx-auto"
              onClick={toggleGrid}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle Grid (G)</p>
          </TooltipContent>
        </Tooltip>

        {/* Object Count */}
        <div className="text-xs text-muted-foreground/60 font-mono mt-2">
          {objects.length}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
