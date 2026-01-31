import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModelAsset {
  id: string;
  model_id: string;
  category: 'character' | 'animal' | 'plant' | 'water' | 'vehicle' | 'furniture' | 'environment';
  name: string;
  description: string | null;
  base_geometry: Record<string, unknown>;
  low_quality: Record<string, unknown>;
  medium_quality: Record<string, unknown>;
  high_quality: Record<string, unknown>;
  ultra_quality: Record<string, unknown>;
  polygon_count_low: number;
  polygon_count_high: number;
  has_animations: boolean;
  animation_count: number;
  pbr_enabled: boolean;
  raytracing_compatible: boolean;
  version: number;
  last_refreshed_at: string;
  created_at: string;
  updated_at: string;
}

export interface HardwarePreset {
  id: string;
  preset_name: string;
  gpu_tier: 'integrated' | 'entry' | 'mid' | 'high' | 'ultra';
  max_polygons: number;
  max_texture_size: number;
  enable_pbr: boolean;
  enable_raytracing: boolean;
  enable_physics_animations: boolean;
  lod_bias: number;
  created_at: string;
}

export interface SyncStatus {
  id: string;
  sync_type: 'full' | 'incremental' | 'category';
  category: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  models_processed: number;
  models_updated: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

// Detect hardware tier based on device capabilities
export function detectHardwareTier(): 'low' | 'medium' | 'high' | 'ultra' {
  // Check for WebGL capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const rendererLower = renderer.toLowerCase();
    
    // Ultra tier: RTX 40 series, RTX 50 series, AMD 7000 series
    if (
      rendererLower.includes('rtx 40') || 
      rendererLower.includes('rtx 50') ||
      rendererLower.includes('radeon rx 7') ||
      rendererLower.includes('arc a7')
    ) {
      return 'ultra';
    }
    
    // High tier: RTX 30 series, AMD 6000 series
    if (
      rendererLower.includes('rtx 30') ||
      rendererLower.includes('rtx 20') ||
      rendererLower.includes('radeon rx 6')
    ) {
      return 'high';
    }
    
    // Medium tier: GTX 10/16 series, AMD 5000 series
    if (
      rendererLower.includes('gtx 10') ||
      rendererLower.includes('gtx 16') ||
      rendererLower.includes('radeon rx 5')
    ) {
      return 'medium';
    }
  }
  
  // Check memory as a fallback
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (deviceMemory && deviceMemory >= 16) return 'high';
  if (deviceMemory && deviceMemory >= 8) return 'medium';
  
  return 'low';
}

// Fetch all model assets
export function useModelAssets(category?: string) {
  return useQuery({
    queryKey: ['model-assets', category],
    queryFn: async () => {
      let query = supabase
        .from('model_assets')
        .select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as ModelAsset[];
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });
}

// Fetch a single model with hardware-appropriate quality
export function useModelAsset(modelId: string | null) {
  const hardwareTier = detectHardwareTier();
  
  return useQuery({
    queryKey: ['model-asset', modelId, hardwareTier],
    queryFn: async () => {
      if (!modelId) return null;
      
      const { data, error } = await supabase
        .from('model_assets')
        .select('*')
        .eq('model_id', modelId)
        .single();
      
      if (error) throw error;
      
      const model = data as ModelAsset;
      
      // Select appropriate quality tier
      const qualityKey = `${hardwareTier}_quality` as keyof ModelAsset;
      const selectedGeometry = model[qualityKey] || model.high_quality;
      
      return {
        ...model,
        selected_geometry: selectedGeometry,
        hardware_tier: hardwareTier
      };
    },
    enabled: !!modelId,
  });
}

// Fetch hardware presets
export function useHardwarePresets() {
  return useQuery({
    queryKey: ['hardware-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hardware_presets')
        .select('*')
        .order('max_polygons');
      
      if (error) throw error;
      return data as HardwarePreset[];
    },
    staleTime: 30 * 60 * 1000, // Presets rarely change
  });
}

// Fetch sync status history
export function useSyncStatus() {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_sync_status')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as SyncStatus[];
    },
    refetchInterval: 5000, // Poll every 5 seconds to see updates
  });
}

// Trigger model refresh
export function useRefreshModels() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category?: string) => {
      const { data, error } = await supabase.functions.invoke('model-refresh', {
        body: { action: 'refresh', category }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Model library refresh started');
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['model-assets'] });
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    },
    onError: (error) => {
      toast.error(`Refresh failed: ${error.message}`);
    }
  });
}

// Get models by category with hardware optimization
export function useOptimizedModels(category: 'character' | 'animal' | 'plant' | 'water') {
  const hardwareTier = detectHardwareTier();
  
  return useQuery({
    queryKey: ['optimized-models', category, hardwareTier],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_assets')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      
      // Return models with selected quality tier
      return (data as ModelAsset[]).map(model => {
        const qualityKey = `${hardwareTier}_quality` as keyof ModelAsset;
        return {
          ...model,
          geometry: model[qualityKey] || model.high_quality,
          hardwareTier
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}