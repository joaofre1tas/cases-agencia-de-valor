/**
 * Tipos do banco Supabase.
 *
 * Este arquivo é intencionalmente mínimo por enquanto — conforme a gente
 * for criando as tabelas, podemos regenerá-lo automaticamente com:
 *
 *   npx supabase gen types typescript --project-id drfznngpapftfrktokzc > src/lib/database.types.ts
 *
 * (requer `supabase login` e acesso ao projeto)
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface CaseMetric {
  value: string
  label: string
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'super_admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'admin' | 'super_admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'super_admin'
          created_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      segments: {
        Row: {
          id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      mentor_bell_prints: {
        Row: {
          id: string
          image_url: string
          alt_text: string | null
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          alt_text?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          alt_text?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          id: string
          agency_name: string | null
          slug: string
          segment: string
          published: boolean
          sort_order: number
          title: string
          description: string
          logo_url: string | null
          avatar_url: string | null
          cover_url: string | null
          subtitle: string | null
          badge_label: string | null
          challenge_eyebrow: string | null
          challenge_heading: string | null
          challenge_content: string | null
          solution_eyebrow: string | null
          solution_heading: string | null
          solution_content: string | null
          results_eyebrow: string | null
          results_heading: string | null
          results_content: string | null
          quote_text: string | null
          quote_author_name: string | null
          quote_author_role: string | null
          quote_author_avatar_url: string | null
          quote_cta_label: string | null
          quote_cta_url: string | null
          final_cta_heading: string | null
          final_cta_body: string | null
          final_cta_label: string | null
          final_cta_url: string | null
          metrics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_name?: string | null
          slug: string
          segment: string
          published?: boolean
          sort_order?: number
          title: string
          description: string
          logo_url?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          subtitle?: string | null
          badge_label?: string | null
          challenge_eyebrow?: string | null
          challenge_heading?: string | null
          challenge_content?: string | null
          solution_eyebrow?: string | null
          solution_heading?: string | null
          solution_content?: string | null
          results_eyebrow?: string | null
          results_heading?: string | null
          results_content?: string | null
          quote_text?: string | null
          quote_author_name?: string | null
          quote_author_role?: string | null
          quote_author_avatar_url?: string | null
          quote_cta_label?: string | null
          quote_cta_url?: string | null
          final_cta_heading?: string | null
          final_cta_body?: string | null
          final_cta_label?: string | null
          final_cta_url?: string | null
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_name?: string | null
          slug?: string
          segment?: string
          published?: boolean
          sort_order?: number
          title?: string
          description?: string
          logo_url?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          subtitle?: string | null
          badge_label?: string | null
          challenge_eyebrow?: string | null
          challenge_heading?: string | null
          challenge_content?: string | null
          solution_eyebrow?: string | null
          solution_heading?: string | null
          solution_content?: string | null
          results_eyebrow?: string | null
          results_heading?: string | null
          results_content?: string | null
          quote_text?: string | null
          quote_author_name?: string | null
          quote_author_role?: string | null
          quote_author_avatar_url?: string | null
          quote_cta_label?: string | null
          quote_cta_url?: string | null
          final_cta_heading?: string | null
          final_cta_body?: string | null
          final_cta_label?: string | null
          final_cta_url?: string | null
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonial_videos: {
        Row: {
          id: string
          youtube_video_id: string
          headline: string
          description: string | null
          agency_name: string
          founder_name: string
          founder_avatar_url: string | null
          segment: string
          metrics: Json
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          youtube_video_id: string
          headline: string
          description?: string | null
          agency_name: string
          founder_name: string
          founder_avatar_url?: string | null
          segment: string
          metrics?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          youtube_video_id?: string
          headline?: string
          description?: string | null
          agency_name?: string
          founder_name?: string
          founder_avatar_url?: string | null
          segment?: string
          metrics?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
  }
}
