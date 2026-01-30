import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Move, 
  RotateCcw, 
  Maximize2, 
  Box, 
  Circle,
  Cylinder,
  Triangle,
  Grid3X3,
  Wand2,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useSceneStore, PrimitiveType } from '@/store/sceneStore';
import { toast } from 'sonner';

const transformTools = [
  { icon: MousePointer, label: 'Select', shortcut: 'Q' },
  { icon: Move, label: 'Move', shortcut: 'W' },
  { icon: RotateCcw, label: 'Rotate', shortcut: 'E' },
  { icon: Maximize2, label: 'Scale', shortcut: 'R' },
];

const primitives: { icon: typeof Box; label: string; type: PrimitiveType }[] = [
  { icon: Box, label: 'Cube', type: 'cube' },
  { icon: Circle, label: 'Sphere', type: 'sphere' },
  { icon: Cylinder, label: 'Cylinder', type: 'cylinder' },
  { icon: Triangle, label: 'Cone', type: 'cone' },
];

export function ToolPanel() {
  const { addObject, clearScene, objects, selectedObjectId, removeObject } = useSceneStore();

  const handleAddPrimitive = (type: PrimitiveType, label: string) => {
    addObject(type);
    toast.success(`${label} added to scene`);
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId) {
      removeObject(selectedObjectId);
      toast.success('Object deleted');
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-3 flex flex-col gap-4"
    >
      {/* Transform Tools */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-mono mb-2 px-2">TRANSFORM</span>
        {transformTools.map((tool) => (
          <Button
            key={tool.label}
            variant="ghost"
            size="sm"
            className="justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <tool.icon className="w-4 h-4" />
            <span className="text-sm">{tool.label}</span>
            <span className="ml-auto text-xs opacity-50">{tool.shortcut}</span>
          </Button>
        ))}
      </div>

      <Separator className="bg-border/50" />

      {/* Primitives */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-mono mb-2 px-2">PRIMITIVES</span>
        <div className="grid grid-cols-2 gap-1">
          {primitives.map((prim) => (
            <Button
              key={prim.label}
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-3 text-muted-foreground hover:text-foreground hover:bg-primary/20"
              onClick={() => handleAddPrimitive(prim.type, prim.label)}
            >
              <prim.icon className="w-5 h-5" />
              <span className="text-xs">{prim.label}</span>
            </Button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground/60 text-center mt-1">
          {objects.length} object{objects.length !== 1 ? 's' : ''} in scene
        </div>
      </div>

      {/* Selection Actions */}
      {selectedObjectId && (
        <>
          <Separator className="bg-border/50" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-mono mb-2 px-2">SELECTION</span>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </>
      )}

      <Separator className="bg-border/50" />

      {/* AI Tools */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-mono mb-2 px-2">AI TOOLS</span>
        <Button variant="cyber" size="sm" className="gap-2">
          <Wand2 className="w-4 h-4" />
          AI Generate
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Grid3X3 className="w-4 h-4" />
          Grid Mapping
        </Button>
      </div>

      <Separator className="bg-border/50" />

      {/* Quick Actions */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-mono mb-2 px-2">ACTIONS</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Save className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2 mt-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </motion.div>
  );
}
