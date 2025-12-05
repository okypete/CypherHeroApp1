import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These will be set via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');

// Create Supabase client only if credentials are provided
// Otherwise, create a dummy client that won't crash but will show errors when used
let supabase: SupabaseClient;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a dummy client with placeholder values to prevent crashes
  // This allows the app to run for UI testing without Supabase
  supabase = createClient(
    'https://placeholder.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
  );
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase credentials not found. App will run in UI-only mode. Multiplayer features will not work.');
  }
}

export { supabase };

// Database types
export interface Lobby {
  id: string;
  lobby_id: string;
  host_id: string;
  status: 'waiting' | 'playing' | 'finished';
  created_at: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  energy: number;
  cypher_stones: number;
  position: number;
  is_host: boolean;
  is_active: boolean;
  saved_cards?: Array<{ type: 'chance' | 'trap'; card: any }>;
  user_id?: string;
  in_cypher?: boolean; // Is player currently in Cypher
  cypher_rounds_remaining?: number; // Rounds remaining in Cypher
  cypher_entry_gate?: number; // Gate position player entered from
}

export interface GameState {
  lobby_id: string;
  current_player: string;
  dice_result?: number;
  last_move?: number;
}



