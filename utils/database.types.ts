export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          max_scale: number | null
          min_char: number | null
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
          max_scale?: number | null
          min_char?: number | null
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
          max_scale?: number | null
          min_char?: number | null
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
          name: string
          owner_id: string
          public_url: string
          status: string
          submit_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          public_url?: string
          status?: string
          submit_text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          public_url?: string
          status?: string
          submit_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forms_analytics: {
        Row: {
          avg_completion_rate: number | null
          avg_completion_time: number | null
          created_at: string
          form_id: string
          id: string
          profile_id: string
          total_submissions: number
          total_views: number
          updated_at: string
        }
        Insert: {
          avg_completion_rate?: number | null
          avg_completion_time?: number | null
          created_at?: string
          form_id: string
          id?: string
          profile_id: string
          total_submissions?: number
          total_views?: number
          updated_at?: string
        }
        Update: {
          avg_completion_rate?: number | null
          avg_completion_time?: number | null
          created_at?: string
          form_id?: string
          id?: string
          profile_id?: string
          total_submissions?: number
          total_views?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_analytics_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_date: string
          payment_method: string | null
          status: string
          subscription_id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          payment_method?: string | null
          status?: string
          subscription_id: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          payment_method?: string | null
          status?: string
          subscription_id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          personal: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          personal?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          personal?: boolean | null
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
          first_name: string
          full_name: string | null
          id: string
          last_name: string
          role: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string
          full_name?: string | null
          id: string
          last_name?: string
          role?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string
          full_name?: string | null
          id?: string
          last_name?: string
          role?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles_analytics: {
        Row: {
          avg_completion_rate: number | null
          created_at: string
          id: string
          profile_id: string
          total_forms_created: number
          total_forms_responses: number
          total_forms_views: number
          updated_at: string
        }
        Insert: {
          avg_completion_rate?: number | null
          created_at?: string
          id?: string
          profile_id: string
          total_forms_created?: number
          total_forms_responses?: number
          total_forms_views?: number
          updated_at?: string
        }
        Update: {
          avg_completion_rate?: number | null
          created_at?: string
          id?: string
          profile_id?: string
          total_forms_created?: number
          total_forms_responses?: number
          total_forms_views?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          completion_time: number | null
          created_at: string
          form_id: string
          id: string
          identifier: string
          status: string
          updated_at: string
        }
        Insert: {
          completion_time?: number | null
          created_at?: string
          form_id: string
          id?: string
          identifier?: string
          status?: string
          updated_at?: string
        }
        Update: {
          completion_time?: number | null
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
          billing_interval: string
          created_at: string
          id: string
          next_billing_date: string | null
          plan: string
          profile_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          id?: string
          next_billing_date?: string | null
          plan?: string
          profile_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          id?: string
          next_billing_date?: string | null
          plan?: string
          profile_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string
          form_id: string
          id: string
          nebulaform_branding: boolean
          numeric_blocks: boolean
          primary_color: string
          updated_at: string
          uppercase_block_name: boolean
          width: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          nebulaform_branding?: boolean
          numeric_blocks?: boolean
          primary_color?: string
          updated_at?: string
          uppercase_block_name?: boolean
          width?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          nebulaform_branding?: boolean
          numeric_blocks?: boolean
          primary_color?: string
          updated_at?: string
          uppercase_block_name?: boolean
          width?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
