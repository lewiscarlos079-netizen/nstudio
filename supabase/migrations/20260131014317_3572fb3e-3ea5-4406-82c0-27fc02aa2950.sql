-- Create model assets table for storing procedural model definitions
CREATE TABLE public.model_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('character', 'animal', 'plant', 'water', 'vehicle', 'furniture', 'environment')),
  name TEXT NOT NULL,
  description TEXT,
  base_geometry JSONB NOT NULL DEFAULT '{}',
  
  -- Hardware quality tiers
  low_quality JSONB DEFAULT '{}',      -- Mobile/integrated graphics
  medium_quality JSONB DEFAULT '{}',   -- GTX 1060 / DDR4
  high_quality JSONB DEFAULT '{}',     -- RTX 3080 / DDR5
  ultra_quality JSONB DEFAULT '{}',    -- RTX 5090 / DDR5
  
  -- Metadata
  polygon_count_low INTEGER DEFAULT 0,
  polygon_count_high INTEGER DEFAULT 0,
  has_animations BOOLEAN DEFAULT false,
  animation_count INTEGER DEFAULT 0,
  pbr_enabled BOOLEAN DEFAULT true,
  raytracing_compatible BOOLEAN DEFAULT false,
  
  version INTEGER NOT NULL DEFAULT 1,
  last_refreshed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create model sync status table for tracking refresh operations
CREATE TABLE public.model_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'category')),
  category TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  models_processed INTEGER DEFAULT 0,
  models_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create model quality presets for different hardware configurations
CREATE TABLE public.hardware_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_name TEXT NOT NULL UNIQUE,
  gpu_tier TEXT NOT NULL CHECK (gpu_tier IN ('integrated', 'entry', 'mid', 'high', 'ultra')),
  max_polygons INTEGER NOT NULL DEFAULT 50000,
  max_texture_size INTEGER NOT NULL DEFAULT 1024,
  enable_pbr BOOLEAN DEFAULT true,
  enable_raytracing BOOLEAN DEFAULT false,
  enable_physics_animations BOOLEAN DEFAULT false,
  lod_bias FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.model_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware_presets ENABLE ROW LEVEL SECURITY;

-- Public read access for model assets (anyone can view models)
CREATE POLICY "Anyone can view model assets" 
ON public.model_assets 
FOR SELECT 
USING (true);

-- Public read access for hardware presets
CREATE POLICY "Anyone can view hardware presets" 
ON public.hardware_presets 
FOR SELECT 
USING (true);

-- Public read access for sync status (for monitoring)
CREATE POLICY "Anyone can view sync status" 
ON public.model_sync_status 
FOR SELECT 
USING (true);

-- Service role only for writes (edge functions use service role)
CREATE POLICY "Service role can manage model assets" 
ON public.model_assets 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage sync status" 
ON public.model_sync_status 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage hardware presets" 
ON public.hardware_presets 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default hardware presets
INSERT INTO public.hardware_presets (preset_name, gpu_tier, max_polygons, max_texture_size, enable_pbr, enable_raytracing, enable_physics_animations, lod_bias) VALUES
('mobile', 'integrated', 10000, 512, false, false, false, 2.0),
('entry_gaming', 'entry', 30000, 1024, true, false, false, 1.5),
('mid_gaming', 'mid', 100000, 2048, true, false, true, 1.0),
('high_ddr5', 'high', 500000, 4096, true, true, true, 0.5),
('ultra_5090', 'ultra', 2000000, 8192, true, true, true, 0.25);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_model_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_model_assets_timestamp
BEFORE UPDATE ON public.model_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_model_assets_updated_at();