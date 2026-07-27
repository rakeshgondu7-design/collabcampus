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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          created_at: string
          id: string
          marked_by: string | null
          session_date: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          marked_by?: string | null
          session_date: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          marked_by?: string | null
          session_date?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          organizer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          organizer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          organizer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      idea_likes: {
        Row: {
          created_at: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_likes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_likes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_public"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          anonymous: boolean
          author_id: string
          category: string
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          anonymous?: boolean
          author_id: string
          category?: string
          created_at?: string
          description: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          anonymous?: boolean
          author_id?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lost_items: {
        Row: {
          contact: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          reporter_id: string
          resolved: boolean
          title: string
          type: Database["public"]["Enums"]["lost_found_type"]
          updated_at: string
          verified: boolean
        }
        Insert: {
          contact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          reporter_id: string
          resolved?: boolean
          title: string
          type: Database["public"]["Enums"]["lost_found_type"]
          updated_at?: string
          verified?: boolean
        }
        Update: {
          contact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          reporter_id?: string
          resolved?: boolean
          title?: string
          type?: Database["public"]["Enums"]["lost_found_type"]
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      notices: {
        Row: {
          author_id: string
          body: string
          category: string
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["notice_priority"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          category?: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["notice_priority"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          category?: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["notice_priority"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          text: string
          type: string
          unread: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          text: string
          type?: string
          unread?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          text?: string
          type?: string
          unread?: boolean
          user_id?: string
        }
        Relationships: []
      }
      placement_applications: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          placement_id: string
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          placement_id: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          placement_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_applications_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          apply_deadline: string | null
          company_id: string
          created_at: string
          ctc: string | null
          eligibility: string | null
          id: string
          location: string | null
          posted_by: string | null
          role: string
          updated_at: string
        }
        Insert: {
          apply_deadline?: string | null
          company_id: string
          created_at?: string
          ctc?: string | null
          eligibility?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          apply_deadline?: string | null
          company_id?: string
          created_at?: string
          ctc?: string | null
          eligibility?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string
          github: string | null
          id: string
          linkedin: string | null
          name: string
          phone: string | null
          portfolio: string | null
          resume_url: string | null
          updated_at: string
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email: string
          github?: string | null
          id: string
          linkedin?: string | null
          name?: string
          phone?: string | null
          portfolio?: string | null
          resume_url?: string | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string
          github?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          phone?: string | null
          portfolio?: string | null
          resume_url?: string | null
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          downloads: number
          file_path: string | null
          file_url: string | null
          id: string
          subject: string
          title: string
          type: string
          updated_at: string
          uploader_id: string
        }
        Insert: {
          created_at?: string
          downloads?: number
          file_path?: string | null
          file_url?: string | null
          id?: string
          subject: string
          title: string
          type?: string
          updated_at?: string
          uploader_id: string
        }
        Update: {
          created_at?: string
          downloads?: number
          file_path?: string | null
          file_url?: string | null
          id?: string
          subject?: string
          title?: string
          type?: string
          updated_at?: string
          uploader_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          department: string | null
          faculty_id: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          department?: string | null
          faculty_id?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          department?: string | null
          faculty_id?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      team_applications: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          message: string | null
          project_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          message?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "team_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_projects: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          id: string
          owner_id: string
          skills: string[]
          slots_needed: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          owner_id: string
          skills?: string[]
          slots_needed?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          owner_id?: string
          skills?: string[]
          slots_needed?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      ideas_public: {
        Row: {
          anonymous: boolean | null
          author_id: string | null
          author_name: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          liked_by_me: boolean | null
          likes_count: number | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "Student"
        | "Faculty"
        | "Placement Officer"
        | "Club Coordinator"
        | "Admin"
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      attendance_status: "present" | "absent" | "late"
      lost_found_type: "lost" | "found"
      notice_priority: "low" | "normal" | "high" | "urgent"
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
    Enums: {
      app_role: [
        "Student",
        "Faculty",
        "Placement Officer",
        "Club Coordinator",
        "Admin",
      ],
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      attendance_status: ["present", "absent", "late"],
      lost_found_type: ["lost", "found"],
      notice_priority: ["low", "normal", "high", "urgent"],
    },
  },
} as const
