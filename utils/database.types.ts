export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          block_id: string
          created_at: string
          id: string
          submission_id: string
          updated_at: string
          value: string
        }
        Insert: {
          block_id: string
          created_at?: string
          id?: string
          submission_id: string
          updated_at?: string
          value?: string
        }
        Update: {
          block_id?: string
          created_at?: string
          id?: string
          submission_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          created_at: string
          description: string | null
          form_id: string
          id: string
          is_identifier: boolean
          max_char: number | null
          max_date: string | null
          max_scale: number | null
          min_char: number | null
          min_date: string | null
          min_scale: number | null
          name: string
          options: string[] | null
          placeholder: string | null
          position: number
          rating: number | null
          required: boolean
          show_char: boolean | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_id: string
          id?: string
          is_identifier?: boolean
          max_char?: number | null
          max_date?: string | null
          max_scale?: number | null
          min_char?: number | null
          min_date?: string | null
          min_scale?: number | null
          name?: string
          options?: string[] | null
          placeholder?: string | null
          position?: number
          rating?: number | null
          required?: boolean
          show_char?: boolean | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_id?: string
          id?: string
          is_identifier?: boolean
          max_char?: number | null
          max_date?: string | null
          max_scale?: number | null
          min_char?: number | null
          min_date?: string | null
          min_scale?: number | null
          name?: string
          options?: string[] | null
          placeholder?: string | null
          position?: number
          rating?: number | null
          required?: boolean
          show_char?: boolean | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          created_at: string
          id: string
          mood: string | null
          path: string | null
          user_agent: string | null
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood?: string | null
          path?: string | null
          user_agent?: string | null
          user_id: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string | null
          path?: string | null
          user_agent?: string | null
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label_color: string
          name: string
          org_id: string
          owner_id: string
          public_id: string
          status: string
          submit_label: string
          success_description: string
          success_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label_color?: string
          name?: string
          org_id: string
          owner_id?: string
          public_id?: string
          status?: string
          submit_label?: string
          success_description?: string
          success_title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label_color?: string
          name?: string
          org_id?: string
          owner_id?: string
          public_id?: string
          status?: string
          submit_label?: string
          success_description?: string
          success_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_member_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string | null
          id: string
          invited_by: string
          inviter_name: string
          note: string | null
          org_id: string
          org_name: string
          role: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          invited_by: string
          inviter_name: string
          note?: string | null
          org_id: string
          org_name: string
          role?: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          inviter_name?: string
          note?: string | null
          org_id?: string
          org_name?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "team_member_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_at_signup: boolean
          id: string
          name: string
          owner_id: string
          public_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_at_signup?: boolean
          id?: string
          name?: string
          owner_id?: string
          public_id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_at_signup?: boolean
          id?: string
          name?: string
          owner_id?: string
          public_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          first_name: string
          free_trial_due_date: string | null
          full_name: string | null
          id: string
          last_name: string
          role: string
          stripe_customer_id: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string
          first_name?: string
          free_trial_due_date?: string | null
          full_name?: string | null
          id: string
          last_name?: string
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          first_name?: string
          free_trial_due_date?: string | null
          full_name?: string | null
          id?: string
          last_name?: string
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      submission_logs: {
        Row: {
          completion_time: number
          created_at: string
          form_id: string
          id: string
          org_id: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          completion_time?: number
          created_at?: string
          form_id: string
          id?: string
          org_id: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          completion_time?: number
          created_at?: string
          form_id?: string
          id?: string
          org_id?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          completion_time: number
          created_at: string
          form_id: string
          id: string
          identifier: string
          status: string
          updated_at: string
        }
        Insert: {
          completion_time?: number
          created_at?: string
          form_id: string
          id?: string
          identifier?: string
          status?: string
          updated_at?: string
        }
        Update: {
          completion_time?: number
          created_at?: string
          form_id?: string
          id?: string
          identifier?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          billing_interval: string
          created_at: string
          due_date: string
          forms: number
          id: string
          max_members: number
          org_id: string
          plan: string
          profile_id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
          submissions: number
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_interval?: string
          created_at?: string
          due_date?: string
          forms?: number
          id?: string
          max_members?: number
          org_id: string
          plan?: string
          profile_id: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          submissions?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_interval?: string
          created_at?: string
          due_date?: string
          forms?: number
          id?: string
          max_members?: number
          org_id?: string
          plan?: string
          profile_id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          submissions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          last_name: string
          name: string
          org_id: string
          permissions: string[]
          profile_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          last_name?: string
          name?: string
          org_id: string
          permissions: string[]
          profile_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_name?: string
          name?: string
          org_id?: string
          permissions?: string[]
          profile_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_es: string | null
          description_pt: string | null
          id: string
          is_premium: boolean
          is_public: boolean
          name: string
          name_es: string | null
          name_pt: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          name?: string
          name_es?: string | null
          name_pt?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          name?: string
          name_es?: string | null
          name_pt?: string | null
        }
        Relationships: []
      }
      templates_blocks: {
        Row: {
          created_at: string
          description: string | null
          description_es: string | null
          description_pt: string | null
          id: string
          is_identifier: boolean
          max_char: number | null
          max_date: string | null
          max_scale: number | null
          min_char: number | null
          min_date: string | null
          min_scale: number | null
          name: string
          name_es: string | null
          name_pt: string | null
          options: string[] | null
          options_es: string[] | null
          options_pt: string[] | null
          placeholder: string | null
          placeholder_es: string | null
          placeholder_pt: string | null
          position: number
          rating: number | null
          required: boolean
          show_char: boolean | null
          template_id: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_identifier?: boolean
          max_char?: number | null
          max_date?: string | null
          max_scale?: number | null
          min_char?: number | null
          min_date?: string | null
          min_scale?: number | null
          name?: string
          name_es?: string | null
          name_pt?: string | null
          options?: string[] | null
          options_es?: string[] | null
          options_pt?: string[] | null
          placeholder?: string | null
          placeholder_es?: string | null
          placeholder_pt?: string | null
          position?: number
          rating?: number | null
          required?: boolean
          show_char?: boolean | null
          template_id: string
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_identifier?: boolean
          max_char?: number | null
          max_date?: string | null
          max_scale?: number | null
          min_char?: number | null
          min_date?: string | null
          min_scale?: number | null
          name?: string
          name_es?: string | null
          name_pt?: string | null
          options?: string[] | null
          options_es?: string[] | null
          options_pt?: string[] | null
          placeholder?: string | null
          placeholder_es?: string | null
          placeholder_pt?: string | null
          position?: number
          rating?: number | null
          required?: boolean
          show_char?: boolean | null
          template_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_blocks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          app_branding: boolean
          created_at: string
          custom_primary_color: string
          form_id: string
          id: string
          numeric_blocks: boolean
          updated_at: string
          uppercase_block_name: boolean
        }
        Insert: {
          app_branding?: boolean
          created_at?: string
          custom_primary_color?: string
          form_id: string
          id?: string
          numeric_blocks?: boolean
          updated_at?: string
          uppercase_block_name?: boolean
        }
        Update: {
          app_branding?: boolean
          created_at?: string
          custom_primary_color?: string
          form_id?: string
          id?: string
          numeric_blocks?: boolean
          updated_at?: string
          uppercase_block_name?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "themes_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      view_logs: {
        Row: {
          created_at: string
          form_id: string
          id: string
          org_id: string
        }
        Insert: {
          created_at?: string
          form_id?: string
          id?: string
          org_id: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "view_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          purpose: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          purpose?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          purpose?: string
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
