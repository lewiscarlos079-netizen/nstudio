import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Check,
  Loader2,
  Box,
  Code,
  FileCode,
  Palette,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { ModelAsset } from '@/hooks/useModelAssets';

interface BlenderExportModalProps {
  model: ModelAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = 'python' | 'gltf' | 'obj';

const formatOptions: { value: ExportFormat; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'python', label: 'Blender Python (.py)', description: 'Native Blender script to recreate model', icon: <Code className="w-5 h-5" /> },
  { value: 'gltf', label: 'glTF/GLB', description: 'Standard 3D format, Blender compatible', icon: <Box className="w-5 h-5" /> },
  { value: 'obj', label: 'Wavefront OBJ', description: 'Legacy format with wide support', icon: <FileCode className="w-5 h-5" /> },
];

// Generate Blender Python script for procedural models
function generateBlenderScript(model: ModelAsset, options: ExportOptions): string {
  const timestamp = new Date().toISOString();
  
  return `# Blender Python Script
# Model: ${model.name}
# Category: ${model.category}
# Generated: ${timestamp}
# 
# To use: Open Blender > Scripting tab > New > Paste this script > Run
# Requires Blender 3.0+

import bpy
import math
from mathutils import Vector

# Clear existing mesh objects (optional)
${options.clearScene ? `bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()` : '# Scene not cleared'}

# Create new collection for the model
collection_name = "${model.name.replace(/[^a-zA-Z0-9]/g, '_')}"
new_collection = bpy.data.collections.new(collection_name)
bpy.context.scene.collection.children.link(new_collection)

# Helper function to create mesh primitives
def create_primitive(primitive_type, name, location=(0,0,0), scale=(1,1,1), rotation=(0,0,0)):
    """Create a primitive mesh object"""
    if primitive_type == 'sphere':
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=location)
    elif primitive_type == 'cube':
        bpy.ops.mesh.primitive_cube_add(size=2, location=location)
    elif primitive_type == 'cylinder':
        bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=2, location=location)
    elif primitive_type == 'cone':
        bpy.ops.mesh.primitive_cone_add(radius1=1, radius2=0, depth=2, location=location)
    elif primitive_type == 'capsule':
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=location)
        # Capsule approximation using stretched sphere
    elif primitive_type == 'torus':
        bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.25, location=location)
    else:
        bpy.ops.mesh.primitive_cube_add(size=2, location=location)
    
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    obj.rotation_euler = rotation
    
    # Move to collection
    bpy.context.scene.collection.objects.unlink(obj)
    new_collection.objects.link(obj)
    
    return obj

def create_material(name, color, metallic=0.0, roughness=0.5):
    """Create a PBR material"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get('Principled BSDF')
    
    if principled:
        # Convert hex to RGB
        if isinstance(color, str) and color.startswith('#'):
            r = int(color[1:3], 16) / 255
            g = int(color[3:5], 16) / 255
            b = int(color[5:7], 16) / 255
            principled.inputs['Base Color'].default_value = (r, g, b, 1)
        else:
            principled.inputs['Base Color'].default_value = (*color, 1)
        
        principled.inputs['Metallic'].default_value = metallic
        principled.inputs['Roughness'].default_value = roughness
    
    return mat

def apply_material(obj, material):
    """Apply material to object"""
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)

# ============================================
# MODEL GEOMETRY: ${model.name}
# ============================================

${generateModelGeometry(model, options)}

# ============================================
# POST-PROCESSING
# ============================================

${options.applySubdiv ? `# Apply subdivision surface modifier
for obj in new_collection.objects:
    if obj.type == 'MESH':
        mod = obj.modifiers.new(name='Subdivision', type='SUBSURF')
        mod.levels = 2
        mod.render_levels = 3` : '# Subdivision not applied'}

${options.smoothShading ? `# Apply smooth shading
for obj in new_collection.objects:
    if obj.type == 'MESH':
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.shade_smooth()` : '# Smooth shading not applied'}

# Select all model objects
for obj in new_collection.objects:
    obj.select_set(True)

# Frame the model in view
bpy.ops.view3d.view_selected()

print(f"Successfully created model: ${model.name}")
print(f"Objects created: {len(new_collection.objects)}")
`;
}

function generateModelGeometry(model: ModelAsset, options: ExportOptions): string {
  const category = model.category.toLowerCase();
  const name = model.name.toLowerCase();
  
  // Generate geometry based on model category/type
  if (category === 'character' || name.includes('humanoid') || name.includes('human')) {
    return generateHumanoidGeometry(model, options);
  } else if (category === 'animal' || name.includes('dog') || name.includes('cat') || name.includes('animal')) {
    return generateAnimalGeometry(model, options);
  } else if (category === 'vehicle') {
    return generateVehicleGeometry(model, options);
  } else if (category === 'nature' || category === 'environment') {
    return generateNatureGeometry(model, options);
  } else {
    return generateGenericGeometry(model, options);
  }
}

function generateHumanoidGeometry(model: ModelAsset, options: ExportOptions): string {
  return `
# Create materials
skin_mat = create_material("Skin", "#DEB887", metallic=0.0, roughness=0.7)
shirt_mat = create_material("Shirt", "#1E3A5F", metallic=0.0, roughness=0.8)
pants_mat = create_material("Pants", "#2F2F2F", metallic=0.0, roughness=0.85)
hair_mat = create_material("Hair", "#3D2314", metallic=0.0, roughness=0.9)

# Head
head = create_primitive('sphere', 'Head', location=(0, 0, 1.6), scale=(0.12, 0.14, 0.15))
apply_material(head, skin_mat)

# Eyes
left_eye = create_primitive('sphere', 'Eye_L', location=(-0.04, 0.1, 1.65), scale=(0.025, 0.025, 0.025))
right_eye = create_primitive('sphere', 'Eye_R', location=(0.04, 0.1, 1.65), scale=(0.025, 0.025, 0.025))
eye_mat = create_material("Eye_White", "#FFFFFF")
apply_material(left_eye, eye_mat)
apply_material(right_eye, eye_mat)

# Pupils
left_pupil = create_primitive('sphere', 'Pupil_L', location=(-0.04, 0.12, 1.65), scale=(0.012, 0.012, 0.012))
right_pupil = create_primitive('sphere', 'Pupil_R', location=(0.04, 0.12, 1.65), scale=(0.012, 0.012, 0.012))
pupil_mat = create_material("Pupil", "#1a1a2e")
apply_material(left_pupil, pupil_mat)
apply_material(right_pupil, pupil_mat)

# Nose
nose = create_primitive('sphere', 'Nose', location=(0, 0.12, 1.58), scale=(0.02, 0.025, 0.03))
apply_material(nose, skin_mat)

# Neck
neck = create_primitive('cylinder', 'Neck', location=(0, 0, 1.38), scale=(0.05, 0.05, 0.06))
apply_material(neck, skin_mat)

# Torso (Shirt)
torso = create_primitive('cylinder', 'Torso', location=(0, 0, 1.1), scale=(0.15, 0.1, 0.2))
apply_material(torso, shirt_mat)

# Shoulders
left_shoulder = create_primitive('sphere', 'Shoulder_L', location=(-0.2, 0, 1.25), scale=(0.055, 0.055, 0.055))
right_shoulder = create_primitive('sphere', 'Shoulder_R', location=(0.2, 0, 1.25), scale=(0.055, 0.055, 0.055))
apply_material(left_shoulder, shirt_mat)
apply_material(right_shoulder, shirt_mat)

# Upper Arms
left_upper_arm = create_primitive('cylinder', 'UpperArm_L', location=(-0.25, 0, 1.1), scale=(0.04, 0.04, 0.12))
right_upper_arm = create_primitive('cylinder', 'UpperArm_R', location=(0.25, 0, 1.1), scale=(0.04, 0.04, 0.12))
apply_material(left_upper_arm, shirt_mat)
apply_material(right_upper_arm, shirt_mat)

# Lower Arms (Skin)
left_lower_arm = create_primitive('cylinder', 'LowerArm_L', location=(-0.25, 0, 0.85), scale=(0.035, 0.035, 0.1))
right_lower_arm = create_primitive('cylinder', 'LowerArm_R', location=(0.25, 0, 0.85), scale=(0.035, 0.035, 0.1))
apply_material(left_lower_arm, skin_mat)
apply_material(right_lower_arm, skin_mat)

# Hands
left_hand = create_primitive('sphere', 'Hand_L', location=(-0.25, 0, 0.7), scale=(0.035, 0.025, 0.045))
right_hand = create_primitive('sphere', 'Hand_R', location=(0.25, 0, 0.7), scale=(0.035, 0.025, 0.045))
apply_material(left_hand, skin_mat)
apply_material(right_hand, skin_mat)

# Hips/Pelvis
hips = create_primitive('cylinder', 'Hips', location=(0, 0, 0.8), scale=(0.13, 0.08, 0.08))
apply_material(hips, pants_mat)

# Upper Legs
left_upper_leg = create_primitive('cylinder', 'UpperLeg_L', location=(-0.08, 0, 0.55), scale=(0.055, 0.055, 0.18))
right_upper_leg = create_primitive('cylinder', 'UpperLeg_R', location=(0.08, 0, 0.55), scale=(0.055, 0.055, 0.18))
apply_material(left_upper_leg, pants_mat)
apply_material(right_upper_leg, pants_mat)

# Lower Legs
left_lower_leg = create_primitive('cylinder', 'LowerLeg_L', location=(-0.08, 0, 0.25), scale=(0.045, 0.045, 0.15))
right_lower_leg = create_primitive('cylinder', 'LowerLeg_R', location=(0.08, 0, 0.25), scale=(0.045, 0.045, 0.15))
apply_material(left_lower_leg, pants_mat)
apply_material(right_lower_leg, pants_mat)

# Feet
left_foot = create_primitive('cube', 'Foot_L', location=(-0.08, 0.04, 0.05), scale=(0.04, 0.08, 0.03))
right_foot = create_primitive('cube', 'Foot_R', location=(0.08, 0.04, 0.05), scale=(0.04, 0.08, 0.03))
shoe_mat = create_material("Shoes", "#2F2F2F", metallic=0.1, roughness=0.7)
apply_material(left_foot, shoe_mat)
apply_material(right_foot, shoe_mat)
`;
}

function generateAnimalGeometry(model: ModelAsset, options: ExportOptions): string {
  const name = model.name.toLowerCase();
  const furColor = name.includes('cat') ? '#808080' : '#D2691E';
  
  return `
# Create materials  
fur_mat = create_material("Fur", "${furColor}", metallic=0.0, roughness=0.9)
nose_mat = create_material("Nose", "#2F2F2F", metallic=0.2, roughness=0.5)
eye_mat = create_material("Eye", "#3D2314")

# Body
body = create_primitive('sphere', 'Body', location=(0, 0, 0.4), scale=(0.2, 0.35, 0.18))
apply_material(body, fur_mat)

# Head
head = create_primitive('sphere', 'Head', location=(0, 0.4, 0.5), scale=(0.12, 0.14, 0.12))
apply_material(head, fur_mat)

# Snout/Muzzle
snout = create_primitive('sphere', 'Snout', location=(0, 0.52, 0.45), scale=(0.06, 0.08, 0.05))
apply_material(snout, fur_mat)

# Nose
nose = create_primitive('sphere', 'Nose', location=(0, 0.58, 0.47), scale=(0.025, 0.02, 0.02))
apply_material(nose, nose_mat)

# Eyes
left_eye = create_primitive('sphere', 'Eye_L', location=(-0.05, 0.5, 0.55), scale=(0.02, 0.02, 0.02))
right_eye = create_primitive('sphere', 'Eye_R', location=(0.05, 0.5, 0.55), scale=(0.02, 0.02, 0.02))
apply_material(left_eye, eye_mat)
apply_material(right_eye, eye_mat)

# Ears
left_ear = create_primitive('cone', 'Ear_L', location=(-0.08, 0.35, 0.65), scale=(0.04, 0.04, 0.06), rotation=(0.3, 0, -0.2))
right_ear = create_primitive('cone', 'Ear_R', location=(0.08, 0.35, 0.65), scale=(0.04, 0.04, 0.06), rotation=(0.3, 0, 0.2))
apply_material(left_ear, fur_mat)
apply_material(right_ear, fur_mat)

# Legs
front_left_leg = create_primitive('cylinder', 'FrontLeg_L', location=(-0.1, 0.2, 0.15), scale=(0.035, 0.035, 0.15))
front_right_leg = create_primitive('cylinder', 'FrontLeg_R', location=(0.1, 0.2, 0.15), scale=(0.035, 0.035, 0.15))
back_left_leg = create_primitive('cylinder', 'BackLeg_L', location=(-0.1, -0.2, 0.15), scale=(0.04, 0.04, 0.15))
back_right_leg = create_primitive('cylinder', 'BackLeg_R', location=(0.1, -0.2, 0.15), scale=(0.04, 0.04, 0.15))
apply_material(front_left_leg, fur_mat)
apply_material(front_right_leg, fur_mat)
apply_material(back_left_leg, fur_mat)
apply_material(back_right_leg, fur_mat)

# Paws
for i, pos in enumerate([(-0.1, 0.2, 0), (0.1, 0.2, 0), (-0.1, -0.2, 0), (0.1, -0.2, 0)]):
    paw = create_primitive('sphere', f'Paw_{i}', location=pos, scale=(0.04, 0.05, 0.02))
    apply_material(paw, fur_mat)

# Tail
tail = create_primitive('cylinder', 'Tail', location=(0, -0.4, 0.45), scale=(0.025, 0.025, 0.15), rotation=(1.2, 0, 0))
apply_material(tail, fur_mat)
`;
}

function generateVehicleGeometry(model: ModelAsset, options: ExportOptions): string {
  return `
# Create materials
body_mat = create_material("CarBody", "#2E5090", metallic=0.8, roughness=0.2)
window_mat = create_material("Window", "#87CEEB", metallic=0.0, roughness=0.1)
wheel_mat = create_material("Wheel", "#1a1a1a", metallic=0.1, roughness=0.8)
chrome_mat = create_material("Chrome", "#C0C0C0", metallic=1.0, roughness=0.1)

# Main body
body = create_primitive('cube', 'Body', location=(0, 0, 0.5), scale=(0.8, 0.4, 0.25))
apply_material(body, body_mat)

# Cabin/Roof
cabin = create_primitive('cube', 'Cabin', location=(0, 0.1, 0.8), scale=(0.5, 0.3, 0.2))
apply_material(cabin, body_mat)

# Windshield
windshield = create_primitive('cube', 'Windshield', location=(0, 0.35, 0.75), scale=(0.45, 0.02, 0.15), rotation=(0.3, 0, 0))
apply_material(windshield, window_mat)

# Wheels
wheel_positions = [(-0.5, -0.35, 0.15), (0.5, -0.35, 0.15), (-0.5, 0.35, 0.15), (0.5, 0.35, 0.15)]
for i, pos in enumerate(wheel_positions):
    wheel = create_primitive('cylinder', f'Wheel_{i}', location=pos, scale=(0.15, 0.15, 0.08), rotation=(1.5708, 0, 0))
    apply_material(wheel, wheel_mat)
    # Rim
    rim = create_primitive('cylinder', f'Rim_{i}', location=(pos[0], pos[1] + 0.05, pos[2]), scale=(0.08, 0.08, 0.02), rotation=(1.5708, 0, 0))
    apply_material(rim, chrome_mat)

# Headlights
left_light = create_primitive('sphere', 'Headlight_L', location=(-0.3, 0.42, 0.45), scale=(0.06, 0.03, 0.04))
right_light = create_primitive('sphere', 'Headlight_R', location=(0.3, 0.42, 0.45), scale=(0.06, 0.03, 0.04))
light_mat = create_material("Headlight", "#FFFFEE", metallic=0.0, roughness=0.1)
apply_material(left_light, light_mat)
apply_material(right_light, light_mat)
`;
}

function generateNatureGeometry(model: ModelAsset, options: ExportOptions): string {
  return `
# Create materials
bark_mat = create_material("Bark", "#8B4513", metallic=0.0, roughness=0.95)
leaves_mat = create_material("Leaves", "#228B22", metallic=0.0, roughness=0.8)
rock_mat = create_material("Rock", "#696969", metallic=0.0, roughness=0.9)

# Tree trunk
trunk = create_primitive('cylinder', 'Trunk', location=(0, 0, 1), scale=(0.15, 0.15, 1))
apply_material(trunk, bark_mat)

# Foliage layers
foliage1 = create_primitive('sphere', 'Foliage_1', location=(0, 0, 2.5), scale=(0.8, 0.8, 0.6))
foliage2 = create_primitive('sphere', 'Foliage_2', location=(0.3, 0.2, 2.8), scale=(0.5, 0.5, 0.4))
foliage3 = create_primitive('sphere', 'Foliage_3', location=(-0.2, -0.3, 2.7), scale=(0.4, 0.4, 0.35))
apply_material(foliage1, leaves_mat)
apply_material(foliage2, leaves_mat)
apply_material(foliage3, leaves_mat)

# Ground rocks
for i in range(3):
    import random
    x = (i - 1) * 0.5
    rock = create_primitive('sphere', f'Rock_{i}', location=(x, 0.3, 0.1), scale=(0.15, 0.12, 0.1))
    apply_material(rock, rock_mat)
`;
}

function generateGenericGeometry(model: ModelAsset, options: ExportOptions): string {
  return `
# Create generic model placeholder
mat = create_material("Material", "#4A90D9", metallic=0.3, roughness=0.5)

# Base shape
base = create_primitive('cube', 'Base', location=(0, 0, 0.5), scale=(0.5, 0.5, 0.5))
apply_material(base, mat)

# Detail sphere
detail = create_primitive('sphere', 'Detail', location=(0, 0, 1.2), scale=(0.3, 0.3, 0.3))
apply_material(detail, mat)

print("Generic model created - customize as needed")
`;
}

interface ExportOptions {
  clearScene: boolean;
  applySubdiv: boolean;
  smoothShading: boolean;
  includeMaterials: boolean;
}

export function BlenderExportModal({ model, open, onOpenChange }: BlenderExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('python');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const [options, setOptions] = useState<ExportOptions>({
    clearScene: false,
    applySubdiv: true,
    smoothShading: true,
    includeMaterials: true,
  });

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsComplete(false);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setIsExporting(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const handleDownload = () => {
    if (!model) return;
    
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'python') {
      content = generateBlenderScript(model, options);
      filename = `${model.name.replace(/\s+/g, '_')}_blender.py`;
      mimeType = 'text/x-python';
    } else if (format === 'gltf') {
      // Generate a placeholder glTF JSON
      content = JSON.stringify({
        asset: { version: '2.0', generator: 'NStudio Blender Export' },
        scene: 0,
        scenes: [{ name: model.name, nodes: [0] }],
        nodes: [{ name: model.name, mesh: 0 }],
        meshes: [{ name: model.name, primitives: [] }],
      }, null, 2);
      filename = `${model.name.replace(/\s+/g, '_')}.gltf`;
      mimeType = 'model/gltf+json';
    } else {
      // OBJ placeholder
      content = `# Wavefront OBJ - ${model.name}\n# Generated by NStudio\n\no ${model.name}\nv 0 0 0\nv 1 0 0\nv 1 1 0\nv 0 1 0\nf 1 2 3 4\n`;
      filename = `${model.name.replace(/\s+/g, '_')}.obj`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${filename}`, {
      description: format === 'python' 
        ? 'Open in Blender > Scripting tab > Run Script'
        : `Import into Blender via File > Import`
    });
    
    onOpenChange(false);
    setIsComplete(false);
    setExportProgress(0);
  };

  const handleClose = () => {
    if (!isExporting) {
      onOpenChange(false);
      setIsComplete(false);
      setExportProgress(0);
    }
  };

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display">
            <Box className="w-5 h-5 text-primary" />
            Export to Blender
          </DialogTitle>
        </DialogHeader>

        {!isExporting && !isComplete ? (
          <div className="space-y-6 py-4">
            {/* Model info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/20">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{model.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{model.category}</p>
              </div>
            </div>

            {/* Format selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Format</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                <div className="grid gap-2">
                  {formatOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        format === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={option.value} className="sr-only" />
                      <div className={`p-2 rounded-lg ${format === option.value ? 'bg-primary/20' : 'bg-muted'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      {format === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Python script options */}
            {format === 'python' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Script Options
                  </Label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={options.clearScene}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, clearScene: !!checked }))}
                      />
                      <span className="text-sm">Clear scene before creating model</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={options.applySubdiv}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, applySubdiv: !!checked }))}
                      />
                      <span className="text-sm">Apply subdivision surface modifier</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={options.smoothShading}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, smoothShading: !!checked }))}
                      />
                      <span className="text-sm">Apply smooth shading</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={options.includeMaterials}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, includeMaterials: !!checked }))}
                      />
                      <span className="text-sm">Include PBR materials</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-6">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Export Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  {format === 'python' 
                    ? 'Run the Python script in Blender\'s Scripting tab'
                    : 'Import the file via File > Import in Blender'}
                </p>
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                <div>
                  <h3 className="text-lg font-medium mb-1">Generating...</h3>
                  <p className="text-sm text-muted-foreground">Creating Blender-compatible export</p>
                </div>
                <div className="space-y-2">
                  <Progress value={Math.min(exportProgress, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(Math.min(exportProgress, 100))}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {isComplete ? (
            <Button onClick={handleDownload} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download File
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
