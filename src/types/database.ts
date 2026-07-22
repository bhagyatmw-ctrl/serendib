import type { BudgetLevel, PlaceCategory, PublishStatus, TripStatus } from "./domain";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Row<T> = { Row: T; Insert: Partial<T>; Update: Partial<T>; Relationships: [] };

export interface Database {
  public: {
    Tables: {
      profiles: Row<{ id: string; display_name: string | null; avatar_url: string | null; role: "traveler" | "editor" | "admin"; home_country: string | null; created_at: string; updated_at: string }>;
      destinations: Row<{ id: string; slug: string; name: string; summary: string; description: string | null; province: string; district: string | null; latitude: number; longitude: number; entry_fee_lkr: number | null; best_months: number[]; status: PublishStatus; featured: boolean; created_at: string; updated_at: string }>;
      places: Row<{ id: string; destination_id: string | null; category: PlaceCategory; slug: string; name: string; summary: string; description: string | null; address: string | null; latitude: number | null; longitude: number | null; price_level: number | null; contact: Json; attributes: Json; verified: boolean; status: PublishStatus; created_at: string; updated_at: string }>;
      trips: Row<{ id: string; user_id: string; title: string; start_date: string | null; end_date: string | null; party_size: number; budget_level: BudgetLevel; budget_lkr: number | null; interests: string[]; status: TripStatus; created_at: string; updated_at: string }>;
      itinerary_days: Row<{ id: string; trip_id: string; day_number: number; date: string | null; title: string | null; notes: string | null; created_at: string }>;
      itinerary_items: Row<{ id: string; itinerary_day_id: string; destination_id: string | null; place_id: string | null; title: string; starts_at: string | null; ends_at: string | null; estimated_cost_lkr: number; transport_mode: string | null; notes: string | null; sort_order: number; created_at: string }>;
      reviews: Row<{ id: string; user_id: string; destination_id: string | null; place_id: string | null; rating: number; title: string | null; body: string; status: PublishStatus; created_at: string; updated_at: string }>;
      articles: Row<{ id: string; author_id: string; slug: string; title: string; excerpt: string; body: string; cover_image_url: string | null; status: PublishStatus; published_at: string | null; created_at: string; updated_at: string }>;
      favorites: Row<{ user_id: string; destination_id: string | null; place_id: string | null; created_at: string }>;
      media_assets: Row<{ id: string; owner_id: string | null; destination_id: string | null; place_id: string | null; article_id: string | null; kind: "image" | "video"; storage_path: string; alt_text: string | null; caption: string | null; credit: string | null; sort_order: number; created_at: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "traveler" | "editor" | "admin";
      budget_level: BudgetLevel;
      media_kind: "image" | "video";
      place_category: PlaceCategory;
      publish_status: PublishStatus;
      trip_status: TripStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
