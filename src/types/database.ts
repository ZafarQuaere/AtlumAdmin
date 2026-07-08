export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string;
          category: string | null;
          created_at: string | null;
          description: string;
          id: string;
          metadata: Json | null;
          user_id: string | null;
        };
        Insert: {
          action_type: string;
          category?: string | null;
          created_at?: string | null;
          description: string;
          id?: string;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Update: {
          action_type?: string;
          category?: string | null;
          created_at?: string | null;
          description?: string;
          id?: string;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          settings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          department: string | null;
          email: string;
          full_name: string | null;
          id: string;
          organization_id: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          department?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          organization_id?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          department?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          organization_id?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          organization_id: string | null;
          permissions: Json | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          organization_id?: string | null;
          permissions?: Json | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          organization_id?: string | null;
          permissions?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: "admin" | "manager" | "employee";
    };
    CompositeTypes: Record<string, never>;
  };
};
