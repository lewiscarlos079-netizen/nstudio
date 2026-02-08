import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Model definitions with hardware-adaptive quality tiers
const MODEL_DEFINITIONS = {
  // Character Models
  characters: [
    {
      model_id: 'humanoid_male',
      name: 'Humanoid Male',
      description: 'Adult male human character with realistic proportions',
      base_geometry: {
        type: 'humanoid',
        height: 1.8,
        proportions: 'athletic',
        skeleton: { bones: 65, ik_chains: 4 }
      },
      animations: ['idle', 'walk', 'run', 'jump', 'crouch', 'wave', 'sit']
    },
    {
      model_id: 'humanoid_female', 
      name: 'Humanoid Female',
      description: 'Adult female human character with realistic proportions',
      base_geometry: {
        type: 'humanoid',
        height: 1.65,
        proportions: 'athletic',
        skeleton: { bones: 65, ik_chains: 4 }
      },
      animations: ['idle', 'walk', 'run', 'jump', 'crouch', 'wave', 'sit']
    },
    {
      model_id: 'humanoid_child',
      name: 'Humanoid Child',
      description: 'Child character with appropriate proportions',
      base_geometry: {
        type: 'humanoid',
        height: 1.1,
        proportions: 'child',
        skeleton: { bones: 55, ik_chains: 4 }
      },
      animations: ['idle', 'walk', 'run', 'jump', 'play']
    }
  ],
  
  // Animal Models
  animals: [
    {
      model_id: 'dog_golden_retriever',
      name: 'Golden Retriever',
      description: 'Friendly golden retriever with detailed fur geometry',
      base_geometry: {
        type: 'quadruped',
        body_length: 0.9,
        height: 0.6,
        skeleton: { bones: 45, tail_segments: 8, ear_bones: 4 }
      },
      animations: ['idle', 'walk', 'run', 'sit', 'lie_down', 'bark', 'wag_tail', 'pant']
    },
    {
      model_id: 'cat_domestic',
      name: 'Domestic Cat',
      description: 'Domestic cat with flexible spine and tail',
      base_geometry: {
        type: 'quadruped',
        body_length: 0.45,
        height: 0.25,
        skeleton: { bones: 42, tail_segments: 12, whisker_count: 12 }
      },
      animations: ['idle', 'walk', 'run', 'pounce', 'stretch', 'groom', 'sleep']
    },
    {
      model_id: 'horse_arabian',
      name: 'Arabian Horse',
      description: 'Elegant Arabian horse with flowing mane',
      base_geometry: {
        type: 'quadruped',
        body_length: 2.4,
        height: 1.6,
        skeleton: { bones: 55, mane_strands: 200, tail_strands: 150 }
      },
      animations: ['idle', 'walk', 'trot', 'gallop', 'rear', 'graze']
    },
    {
      model_id: 'elephant_african',
      name: 'African Elephant',
      description: 'Massive African elephant with detailed skin wrinkles',
      base_geometry: {
        type: 'quadruped',
        body_length: 4.0,
        height: 3.5,
        skeleton: { bones: 48, trunk_segments: 25, ear_bones: 6 }
      },
      animations: ['idle', 'walk', 'trumpet', 'spray_water', 'dust_bath']
    },
    {
      model_id: 'lion_african',
      name: 'African Lion',
      description: 'Male African lion with full mane',
      base_geometry: {
        type: 'quadruped',
        body_length: 1.8,
        height: 1.1,
        skeleton: { bones: 52, mane_clusters: 80 }
      },
      animations: ['idle', 'walk', 'run', 'stalk', 'pounce', 'roar', 'rest']
    },
    {
      model_id: 'wolf_gray',
      name: 'Gray Wolf',
      description: 'Gray wolf with thick winter coat',
      base_geometry: {
        type: 'quadruped',
        body_length: 1.3,
        height: 0.8,
        skeleton: { bones: 48, fur_layers: 3 }
      },
      animations: ['idle', 'walk', 'run', 'howl', 'stalk', 'pack_behavior']
    },
    {
      model_id: 'shark_great_white',
      name: 'Great White Shark',
      description: 'Great white shark with realistic swimming motion',
      base_geometry: {
        type: 'fish',
        body_length: 5.0,
        skeleton: { spine_segments: 35, fin_bones: 12 }
      },
      animations: ['swim_idle', 'swim_fast', 'turn', 'bite', 'breach']
    },
    {
      model_id: 'dolphin_bottlenose',
      name: 'Bottlenose Dolphin',
      description: 'Playful bottlenose dolphin',
      base_geometry: {
        type: 'marine_mammal',
        body_length: 2.5,
        skeleton: { spine_segments: 30, flipper_bones: 8 }
      },
      animations: ['swim', 'jump', 'spin', 'click', 'play']
    },
    {
      model_id: 'eagle_bald',
      name: 'Bald Eagle',
      description: 'Bald eagle with detailed feather geometry',
      base_geometry: {
        type: 'bird',
        wingspan: 2.2,
        skeleton: { bones: 38, primary_feathers: 22, secondary_feathers: 18 }
      },
      animations: ['perch', 'fly_glide', 'fly_flap', 'dive', 'land', 'screech']
    }
  ],
  
  // Plant Models
  plants: [
    {
      model_id: 'tree_oak',
      name: 'Oak Tree',
      description: 'Mature oak tree with detailed bark and foliage',
      base_geometry: {
        type: 'tree',
        trunk_height: 8.0,
        canopy_radius: 6.0,
        branch_levels: 5,
        leaf_clusters: 2000
      },
      animations: ['wind_sway', 'leaf_flutter', 'seasonal_change']
    },
    {
      model_id: 'tree_pine',
      name: 'Pine Tree',
      description: 'Tall pine tree with needle foliage',
      base_geometry: {
        type: 'conifer',
        height: 15.0,
        base_radius: 3.0,
        branch_whorls: 12,
        needle_clusters: 5000
      },
      animations: ['wind_sway', 'snow_accumulation']
    },
    {
      model_id: 'tree_palm',
      name: 'Palm Tree',
      description: 'Tropical palm with swaying fronds',
      base_geometry: {
        type: 'palm',
        trunk_height: 10.0,
        frond_count: 16,
        coconut_count: 8
      },
      animations: ['wind_sway', 'frond_flutter']
    },
    {
      model_id: 'bush_flowering',
      name: 'Flowering Bush',
      description: 'Ornamental bush with flowers',
      base_geometry: {
        type: 'bush',
        radius: 0.8,
        height: 1.2,
        flower_count: 50
      },
      animations: ['wind_rustle', 'bloom_cycle']
    },
    {
      model_id: 'grass_patch',
      name: 'Grass Patch',
      description: 'Dense grass patch with individual blades',
      base_geometry: {
        type: 'grass',
        patch_size: 1.0,
        blade_count: 10000,
        blade_height_variance: 0.3
      },
      animations: ['wind_wave']
    },
    {
      model_id: 'flower_rose',
      name: 'Rose Bush',
      description: 'Rose plant with detailed petal geometry',
      base_geometry: {
        type: 'flower_bush',
        height: 0.8,
        bloom_count: 12,
        petal_layers: 5
      },
      animations: ['bloom', 'wilt', 'wind_sway']
    },
    {
      model_id: 'fern_boston',
      name: 'Boston Fern',
      description: 'Lush Boston fern with cascading fronds',
      base_geometry: {
        type: 'fern',
        spread: 0.6,
        frond_count: 35,
        leaflet_count: 80
      },
      animations: ['gentle_sway']
    }
  ],
  
  // Water Models
  water: [
    {
      model_id: 'water_ocean',
      name: 'Ocean Surface',
      description: 'Realistic ocean with wave simulation',
      base_geometry: {
        type: 'water_plane',
        size: 1000,
        wave_layers: 8,
        foam_threshold: 0.7
      },
      animations: ['wave_motion', 'tide_change', 'storm_surge']
    },
    {
      model_id: 'water_lake',
      name: 'Lake Water',
      description: 'Calm lake surface with gentle ripples',
      base_geometry: {
        type: 'water_plane',
        size: 100,
        wave_layers: 3,
        clarity: 0.8
      },
      animations: ['ripple', 'fish_disturbance']
    },
    {
      model_id: 'water_river',
      name: 'Flowing River',
      description: 'River with current and flow dynamics',
      base_geometry: {
        type: 'water_flow',
        width: 10,
        flow_speed: 2.0,
        turbulence: 0.3
      },
      animations: ['flow', 'rapids', 'eddy']
    },
    {
      model_id: 'water_waterfall',
      name: 'Waterfall',
      description: 'Cascading waterfall with mist',
      base_geometry: {
        type: 'waterfall',
        height: 15,
        width: 8,
        particle_density: 5000
      },
      animations: ['cascade', 'mist_spray', 'splash_pool']
    },
    {
      model_id: 'water_pond',
      name: 'Garden Pond',
      description: 'Small decorative pond with lily pads',
      base_geometry: {
        type: 'pond',
        diameter: 3,
        depth: 0.8,
        lily_pad_count: 8
      },
      animations: ['gentle_ripple', 'koi_movement']
    },
    {
      model_id: 'water_rain',
      name: 'Rain System',
      description: 'Volumetric rain particle system',
      base_geometry: {
        type: 'precipitation',
        coverage_area: 100,
        drop_density: 2000,
        drop_speed: 8
      },
      animations: ['light_rain', 'heavy_rain', 'storm']
    },
    {
      model_id: 'water_fountain',
      name: 'Water Fountain',
      description: 'Decorative water fountain',
      base_geometry: {
        type: 'fountain',
        tiers: 3,
        jet_count: 8,
        pool_diameter: 4
      },
      animations: ['spray_cycle', 'dance_pattern']
    }
  ]
};

// Generate quality-specific geometry based on hardware tier
function generateQualityVariant(baseGeometry: Record<string, unknown>, tier: 'low' | 'medium' | 'high' | 'ultra', animations: string[]) {
  const multipliers = {
    low: { polygons: 0.1, textures: 512, subdivisions: 0, animations: 2 },
    medium: { polygons: 0.3, textures: 1024, subdivisions: 1, animations: 4 },
    high: { polygons: 0.7, textures: 4096, subdivisions: 2, animations: animations.length },
    ultra: { polygons: 1.0, textures: 8192, subdivisions: 3, animations: animations.length }
  };
  
  const mult = multipliers[tier];
  
  return {
    ...baseGeometry,
    quality_tier: tier,
    polygon_multiplier: mult.polygons,
    max_texture_size: mult.textures,
    subdivision_level: mult.subdivisions,
    enabled_animations: animations.slice(0, mult.animations),
    pbr_enabled: tier !== 'low',
    raytracing_compatible: tier === 'ultra',
    physics_enabled: tier === 'high' || tier === 'ultra',
    lod_levels: tier === 'low' ? 2 : tier === 'medium' ? 3 : 4,
    shadow_quality: tier === 'low' ? 'none' : tier === 'medium' ? 'soft' : 'raytraced',
    fur_simulation: tier === 'ultra',
    cloth_simulation: tier === 'high' || tier === 'ultra',
    water_caustics: tier === 'ultra',
    subsurface_scattering: tier === 'high' || tier === 'ultra'
  };
}

// Calculate polygon counts for different quality levels
function calculatePolygonCounts(geometry: Record<string, unknown>): { low: number; high: number } {
  const type = (geometry.type as string) || 'unknown';
  const baseCounts: Record<string, { low: number; high: number }> = {
    humanoid: { low: 5000, high: 150000 },
    quadruped: { low: 4000, high: 120000 },
    fish: { low: 2000, high: 80000 },
    marine_mammal: { low: 3000, high: 100000 },
    bird: { low: 3500, high: 95000 },
    tree: { low: 1000, high: 500000 },
    conifer: { low: 800, high: 400000 },
    palm: { low: 500, high: 50000 },
    bush: { low: 300, high: 30000 },
    grass: { low: 100, high: 200000 },
    flower_bush: { low: 200, high: 25000 },
    fern: { low: 150, high: 20000 },
    water_plane: { low: 400, high: 1000000 },
    water_flow: { low: 300, high: 500000 },
    waterfall: { low: 500, high: 800000 },
    pond: { low: 200, high: 100000 },
    precipitation: { low: 100, high: 50000 },
    fountain: { low: 300, high: 150000 }
  };
  
  return baseCounts[type] || { low: 1000, high: 50000 };
}

// deno-lint-ignore no-explicit-any
async function refreshModels(supabase: any, category?: string) {
  console.log(`Starting model refresh for category: ${category || 'all'}`);
  
  // Create sync status record
  const { data: syncRecord, error: syncError } = await supabase
    .from('model_sync_status')
    .insert({
      sync_type: category ? 'category' : 'full',
      category: category || null,
      status: 'running'
    })
    .select()
    .single();
  
  if (syncError) {
    console.error('Failed to create sync record:', syncError);
    throw syncError;
  }
  
  let modelsProcessed = 0;
  let modelsUpdated = 0;
  
  try {
    const categories = category 
      ? { [category]: MODEL_DEFINITIONS[category as keyof typeof MODEL_DEFINITIONS] }
      : MODEL_DEFINITIONS;
    
    for (const [cat, models] of Object.entries(categories)) {
      if (!models) continue;
      
      for (const model of models) {
        modelsProcessed++;
        
        const polygonCounts = calculatePolygonCounts(model.base_geometry as Record<string, unknown>);
        
        const modelData = {
          model_id: model.model_id,
          category: cat === 'characters' ? 'character' : 
                   cat === 'animals' ? 'animal' : 
                   cat === 'plants' ? 'plant' : 'water',
          name: model.name,
          description: model.description,
          base_geometry: model.base_geometry,
          low_quality: generateQualityVariant(model.base_geometry as Record<string, unknown>, 'low', model.animations),
          medium_quality: generateQualityVariant(model.base_geometry as Record<string, unknown>, 'medium', model.animations),
          high_quality: generateQualityVariant(model.base_geometry as Record<string, unknown>, 'high', model.animations),
          ultra_quality: generateQualityVariant(model.base_geometry as Record<string, unknown>, 'ultra', model.animations),
          polygon_count_low: polygonCounts.low,
          polygon_count_high: polygonCounts.high,
          has_animations: model.animations.length > 0,
          animation_count: model.animations.length,
          pbr_enabled: true,
          raytracing_compatible: true,
          last_refreshed_at: new Date().toISOString()
        };
        
        // Upsert model data
        const { error: upsertError } = await supabase
          .from('model_assets')
          .upsert(modelData, { onConflict: 'model_id' });
        
        if (upsertError) {
          console.error(`Failed to upsert model ${model.model_id}:`, upsertError);
        } else {
          modelsUpdated++;
          console.log(`Updated model: ${model.model_id}`);
        }
      }
    }
    
    // Update sync status to completed
    await supabase
      .from('model_sync_status')
      .update({
        status: 'completed',
        models_processed: modelsProcessed,
        models_updated: modelsUpdated,
        completed_at: new Date().toISOString()
      })
      .eq('id', syncRecord.id);
    
    console.log(`Refresh completed: ${modelsProcessed} processed, ${modelsUpdated} updated`);
    
    return { modelsProcessed, modelsUpdated };
    
  } catch (error) {
    // Update sync status to failed
    await supabase
      .from('model_sync_status')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      })
      .eq('id', syncRecord.id);
    
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user for model-refresh:', userId);

    // Use service role client for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'refresh';
    const category = url.searchParams.get('category');
    const hardwareTier = url.searchParams.get('tier') || 'high';
    
    console.log(`Model refresh request: action=${action}, category=${category}, tier=${hardwareTier}`);
    
    switch (action) {
      case 'refresh': {
        // Trigger model refresh (can run in background)
        const result = await refreshModels(supabase, category || undefined);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Model refresh completed',
          ...result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'list': {
        // List models with optional category filter
        let query = supabase.from('model_assets').select('*');
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) throw error;
        
        return new Response(JSON.stringify({
          success: true,
          models: data,
          count: data.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'get': {
        // Get specific model with hardware-appropriate quality
        const modelId = url.searchParams.get('model_id');
        
        if (!modelId) {
          return new Response(JSON.stringify({ error: 'model_id required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const { data, error } = await supabase
          .from('model_assets')
          .select('*')
          .eq('model_id', modelId)
          .single();
        
        if (error) throw error;
        
        // Select appropriate quality tier based on hardware
        const qualityKey = `${hardwareTier}_quality`;
        const geometry = data[qualityKey] || data.high_quality;
        
        return new Response(JSON.stringify({
          success: true,
          model: {
            ...data,
            selected_geometry: geometry,
            hardware_tier: hardwareTier
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'presets': {
        // Get hardware presets
        const { data, error } = await supabase
          .from('hardware_presets')
          .select('*')
          .order('max_polygons');
        
        if (error) throw error;
        
        return new Response(JSON.stringify({
          success: true,
          presets: data
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'status': {
        // Get sync status
        const { data, error } = await supabase
          .from('model_sync_status')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        return new Response(JSON.stringify({
          success: true,
          sync_history: data
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
  } catch (error) {
    console.error('Model refresh error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});