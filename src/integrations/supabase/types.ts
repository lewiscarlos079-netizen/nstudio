export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      hardware_presets: {
        Row: {
          created_at: string
          enable_pbr: boolean | null
          enable_physics_animations: boolean | null
          enable_raytracing: boolean | null
          gpu_tier: string
          id: string
          lod_bias: number | null
          max_polygons: number
          max_texture_size: number
          preset_name: string
        }
        Insert: {
          created_at?: string
          enable_pbr?: boolean | null
          enable_physics_animations?: boolean | null
          enable_raytracing?: boolean | null
          gpu_tier: string
          id?: string
          lod_bias?: number | null
          max_polygons?: number
          max_texture_size?: number
          preset_name: string
        }
        Update: {
          created_at?: string
          enable_pbr?: boolean | null
          enable_physics_animations?: boolean | null
          enable_raytracing?: boolean | null
          gpu_tier?: string
          id?: string
          lod_bias?: number | null
          max_polygons?: number
          max_texture_size?: number
          preset_name?: string
        }
        Relationships: []
      }
      model_assets: {
        Row: {
          animation_count: number | null
          base_geometry: Json
          category: string
          created_at: string
          description: string | null
          has_animations: boolean | null
          high_quality: Json | null
          id: string
          last_refreshed_at: string | null
          low_quality: Json | null
          medium_quality: Json | null
          model_id: string
          name: string
          pbr_enabled: boolean | null
          polygon_count_high: number | null
          polygon_count_low: number | null
          raytracing_compatible: boolean | null
          ultra_quality: Json | null
          updated_at: string
          version: number
        }
        Insert: {
          animation_count?: number | null
          base_geometry?: Json
          category: string
          created_at?: string
          description?: string | null
          has_animations?: boolean | null
          high_quality?: Json | null
          id?: string
          last_refreshed_at?: string | null
          low_quality?: Json | null
          medium_quality?: Json | null
          model_id: string
          name: string
          pbr_enabled?: boolean | null
          polygon_count_high?: number | null
          polygon_count_low?: number | null
          raytracing_compatible?: boolean | null
          ultra_quality?: Json | null
          updated_at?: string
          version?: number
        }
        Update: {
          animation_count?: number | null
          base_geometry?: Json
          category?: string
          created_at?: string
          description?: string | null
          has_animations?: boolean | null
          high_quality?: Json | null
          id?: string
          last_refreshed_at?: string | null
          low_quality?: Json | null
          medium_quality?: Json | null
          model_id?: string
          name?: string
          pbr_enabled?: boolean | null
          polygon_count_high?: number | null
          polygon_count_low?: number | null
          raytracing_compatible?: boolean | null
          ultra_quality?: Json | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      model_sync_status: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          models_processed: number | null
          models_updated: number | null
          started_at: string | null
          status: string
          sync_type: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          models_processed?: number | null
          models_updated?: number | null
          started_at?: string | null
          status: string
          sync_type: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          models_processed?: number | null
          models_updated?: number | null
          started_at?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
