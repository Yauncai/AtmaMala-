import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      souls: {
        Row: {
          id: string;
          name: string;
          bio: string;
          avatar: string;
          element: string | null;
          alignment: string | null;
          rarity: string | null;
          archetype: string | null;
          karma_points: number;
          trust_score: number;
          owner_id: string | null;
          wallet_address: string;
          token_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio: string;
          avatar: string;
          element?: string | null;
          alignment?: string | null;
          rarity?: string | null;
          archetype?: string | null;
          karma_points?: number;
          trust_score?: number;
          owner_id?: string | null;
          wallet_address: string;
          token_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string;
          avatar?: string;
          element?: string | null;
          alignment?: string | null;
          rarity?: string | null;
          archetype?: string | null;
          karma_points?: number;
          trust_score?: number;
          owner_id?: string | null;
          wallet_address?: string;
          token_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string | null;
          created_at: string;
          last_active: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          created_at?: string;
          last_active?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string | null;
          created_at?: string;
          last_active?: string;
        };
      };
      trust_relationships: {
        Row: {
          id: string;
          from_soul_id: string;
          to_soul_id: string;
          from_user_id: string;
          to_user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_soul_id: string;
          to_soul_id: string;
          from_user_id: string;
          to_user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_soul_id?: string;
          to_soul_id?: string;
          from_user_id?: string;
          to_user_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
