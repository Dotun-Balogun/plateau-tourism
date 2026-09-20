/**
 * Hand-written to match `supabase/migrations/0001_init.sql`.
 *
 * Once your Supabase project is linked and migrated, replace this file
 * with the real generated types:
 *   npm run db:types
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "tourist" | "editor" | "admin";
export type MediaKind = "image" | "video" | "audio" | "panorama_360";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: AppRole;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      destinations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string | null;
          description: string | null;
          category_id: string | null;
          region: string | null;
          country: string;
          latitude: number | null;
          longitude: number | null;
          cover_image_url: string | null;
          avg_rating: number;
          review_count: number;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["destinations"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["destinations"]["Row"]>;
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          destination_id: string;
          kind: MediaKind;
          storage_path: string;
          caption: string | null;
          position: number;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media_assets"]["Row"]> & {
          destination_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          destination_id: string;
          user_id: string;
          rating: number;
          body: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          destination_id: string;
          user_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          starts_on: string | null;
          ends_on: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["itineraries"]["Row"]> & {
          user_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["itineraries"]["Row"]>;
        Relationships: [];
      };
      itinerary_items: {
        Row: {
          id: string;
          itinerary_id: string;
          destination_id: string;
          day_number: number;
          position: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["itinerary_items"]["Row"]> & {
          itinerary_id: string;
          destination_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["itinerary_items"]["Row"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          user_id: string;
          destination_id: string;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["favorites"]["Row"];
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      media_kind: MediaKind;
    };
    CompositeTypes: Record<string, never>;
  };
}
