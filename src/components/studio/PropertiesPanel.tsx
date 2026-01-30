import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Box, Palette, Lightbulb } from 'lucide-react';

export function PropertiesPanel() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-4 w-72 flex flex-col gap-4"
    >
      {/* Object Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Box className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Cube_001</h3>
          <p className="text-xs text-muted-foreground">Mesh Object</p>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Transform */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-muted-foreground">TRANSFORM</h4>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X</Label>
            <Input type="number" defaultValue="0" className="h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y</Label>
            <Input type="number" defaultValue="0.5" className="h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Z</Label>
            <Input type="number" defaultValue="0" className="h-8 text-xs" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Scale</Label>
          <div className="flex items-center gap-3">
            <Slider defaultValue={[100]} max={200} step={1} className="flex-1" />
            <span className="text-xs font-mono w-10">100%</span>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Material */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-xs font-mono text-muted-foreground">MATERIAL</h4>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary border border-primary/50 cursor-pointer hover:scale-105 transition-transform" />
            <Input defaultValue="#00d4ff" className="h-8 text-xs font-mono flex-1" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Metalness</Label>
          <div className="flex items-center gap-3">
            <Slider defaultValue={[80]} max={100} step={1} className="flex-1" />
            <span className="text-xs font-mono w-10">0.8</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Roughness</Label>
          <div className="flex items-center gap-3">
            <Slider defaultValue={[20]} max={100} step={1} className="flex-1" />
            <span className="text-xs font-mono w-10">0.2</span>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Lighting */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-xs font-mono text-muted-foreground">EMISSIVE</h4>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Intensity</Label>
          <div className="flex items-center gap-3">
            <Slider defaultValue={[20]} max={100} step={1} className="flex-1" />
            <span className="text-xs font-mono w-10">0.2</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
