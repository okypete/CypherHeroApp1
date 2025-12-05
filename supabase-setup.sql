-- Cypher Hero Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Drop table if exists (only if you want to start fresh - comment out if you have data!)
-- DROP TABLE IF EXISTS lobbies CASCADE;

-- Create lobbies table
CREATE TABLE IF NOT EXISTS lobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id TEXT UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  max_players INTEGER DEFAULT 4,
  max_rounds INTEGER DEFAULT 10,
  max_energy INTEGER DEFAULT 1000,
  current_round INTEGER DEFAULT 1,
  current_player_index INTEGER DEFAULT 0,
  players JSONB DEFAULT '[]'::jsonb,
  game_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns if table exists but columns are missing (safe - won't error if columns exist)
DO $$ 
BEGIN
  -- Add max_players if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'max_players') THEN
    ALTER TABLE lobbies ADD COLUMN max_players INTEGER DEFAULT 4;
  END IF;
  
  -- Add max_rounds if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'max_rounds') THEN
    ALTER TABLE lobbies ADD COLUMN max_rounds INTEGER DEFAULT 10;
  END IF;
  
  -- Add max_energy if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'max_energy') THEN
    ALTER TABLE lobbies ADD COLUMN max_energy INTEGER DEFAULT 1000;
  END IF;
  
  -- Add current_round if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'current_round') THEN
    ALTER TABLE lobbies ADD COLUMN current_round INTEGER DEFAULT 1;
  END IF;
  
  -- Add current_player_index if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'current_player_index') THEN
    ALTER TABLE lobbies ADD COLUMN current_player_index INTEGER DEFAULT 0;
  END IF;
  
  -- Add game_state if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'game_state') THEN
    ALTER TABLE lobbies ADD COLUMN game_state JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  -- Add updated_at if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'updated_at') THEN
    ALTER TABLE lobbies ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Add battle_state if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lobbies' AND column_name = 'battle_state') THEN
    ALTER TABLE lobbies ADD COLUMN battle_state JSONB DEFAULT NULL;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lobbies_lobby_id ON lobbies(lobby_id);
CREATE INDEX IF NOT EXISTS idx_lobbies_status ON lobbies(status);

-- Enable Row Level Security (RLS)
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;  

-- Drop policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;

-- Create policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to automatically clean up old lobbies
CREATE OR REPLACE FUNCTION cleanup_old_lobbies()
RETURNS void AS $$
BEGIN
  DELETE FROM lobbies
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND status = 'finished';
END;
$$ LANGUAGE plpgsql;



