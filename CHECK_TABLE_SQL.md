# 🔍 Check Your Table with SQL

If you can't see columns in Table Editor, use SQL to check!

---

## Quick Check: See All Columns

**Run this in SQL Editor:**

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'lobbies'
ORDER BY ordinal_position;
```

**This will show you:**
- Column names
- Data types
- If nullable
- Default values

---

## What You Should See

If your table is correct, you'll see 6 rows:

```
column_name  | data_type    | is_nullable | column_default
-------------|--------------|-------------|------------------
id           | uuid         | NO          | gen_random_uuid()
lobby_id     | text         | NO          | null
host_id      | text         | NO          | null
status       | text         | NO          | 'waiting'::text
players      | jsonb        | YES         | '[]'::jsonb
created_at   | timestamp... | YES         | now()
```

---

## If You See Fewer Than 6 Rows

**You're missing columns!**

**To add missing columns, run this SQL:**

```sql
-- Add id column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add lobby_id column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS lobby_id TEXT NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_lobbies_lobby_id_unique ON lobbies(lobby_id);

-- Add host_id column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS host_id TEXT NOT NULL;

-- Add status column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'waiting';

-- Add players column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS players JSONB DEFAULT '[]'::jsonb;

-- Add created_at column (if missing)
ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

**Note:** If `id` already exists but isn't primary key, you might need to drop and recreate it.

---

## Check If Table Exists

**Run this:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'lobbies';
```

**If you see a row** → Table exists ✅
**If you see nothing** → Table doesn't exist ❌ (need to create it)

---

## Full Table Check

**See everything about your table:**

```sql
SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  CASE WHEN pk.column_name IS NOT NULL THEN 'YES' ELSE 'NO' END as is_primary_key
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN (
  SELECT ku.table_name, ku.column_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage ku 
    ON tc.constraint_name = ku.constraint_name
  WHERE tc.constraint_type = 'PRIMARY KEY'
) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
WHERE t.table_schema = 'public' AND t.table_name = 'lobbies'
ORDER BY c.ordinal_position;
```

This shows complete table structure!

---

## 🎯 Quick Fix: Recreate Table (If Needed)

If your table is messed up, you can recreate it:

**⚠️ WARNING: This deletes all data!**

```sql
-- Drop table if exists
DROP TABLE IF EXISTS lobbies CASCADE;

-- Create table fresh
CREATE TABLE lobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id TEXT UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  players JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**Only use this if your table is really broken!**

---

Run the first SQL query and tell me what you see! 🔍


