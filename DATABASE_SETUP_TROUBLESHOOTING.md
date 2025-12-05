# 🔧 Database Setup Troubleshooting Guide

## Common Problems & Solutions

### ❌ Problem 1: "Can't find SQL Editor"

**Solution:**
1. Make sure you're logged into Supabase
2. Click on your project (if you see a list of projects)
3. Look at the LEFT sidebar
4. Find the icon that looks like: `</>` or says "SQL Editor"
5. It's usually in the middle of the sidebar
6. Click it!

**Alternative:**
- Look for "Database" in the sidebar
- Click it, then look for "SQL Editor" inside

---

### ❌ Problem 2: "SQL Editor is empty/blank"

**Solution:**
1. In SQL Editor, look for a button that says:
   - "New query" OR
   - "+ New" OR
   - "Create new query"
2. Click it to create a new query tab
3. Now you can paste your SQL

---

### ❌ Problem 3: "Error when running SQL"

**Common Errors:**

#### Error: "relation already exists"
**Meaning:** Table already exists
**Solution:** 
- This is OK! The table is already created
- Skip to Step 5 (verify table exists)
- Or delete the table first:
  1. Go to Table Editor
  2. Find "lobbies" table
  3. Click the 3 dots menu
  4. Click "Delete table"
  5. Then run SQL again

#### Error: "permission denied"
**Solution:**
1. Make sure you're the project owner
2. Check if you're in the correct project
3. Try refreshing the page

#### Error: "syntax error"
**Solution:**
1. Make sure you copied the ENTIRE SQL file
2. Don't copy just part of it
3. Try copying again from `supabase-setup.sql`

---

### ❌ Problem 4: "Can't find the SQL file"

**Solution:**
1. The file is located at:
   ```
   cypher-hero-app/supabase-setup.sql
   ```
2. Open it with:
   - Notepad
   - VS Code
   - Any text editor
3. Select ALL (Ctrl+A)
4. Copy (Ctrl+C)
5. Paste into Supabase SQL Editor

**If file doesn't exist:**
- Create a new file called `supabase-setup.sql`
- Copy the SQL code from below (see "SQL Code" section)

---

### ❌ Problem 5: "Don't see 'lobbies' table after running SQL"

**Solution:**
1. Go to "Table Editor" in left sidebar
2. Click the refresh button (🔄)
3. Look for "lobbies" table
4. If still not there:
   - Check if SQL ran successfully
   - Look for error messages
   - Try running SQL again

---

### ❌ Problem 6: "SQL Editor looks different"

**Different Supabase versions have different UIs:**

**Version A:**
- Has tabs at the top
- Click "+ New" to create new query

**Version B:**
- Has a big text area
- Just paste and click "Run"

**Version C:**
- Has query templates
- Click "New query" button

**All versions work the same way:**
1. Paste SQL code
2. Click Run/Execute
3. Wait for success message

---

## 📋 Step-by-Step Visual Guide

### Step 1: Open SQL Editor
```
Supabase Dashboard
  ├── Left Sidebar
  │   ├── Table Editor
  │   ├── SQL Editor  ← CLICK THIS
  │   ├── Authentication
  │   └── Settings
```

### Step 2: Create New Query
```
SQL Editor Page
  ┌─────────────────────────┐
  │ [+ New Query]  ← CLICK  │
  └─────────────────────────┘
```

### Step 3: Paste SQL Code
```
Query Tab
  ┌─────────────────────────────┐
  │ [Paste SQL code here]        │
  │                              │
  │                              │
  └─────────────────────────────┘
  [Run] button at bottom
```

### Step 4: Run Query
```
After clicking Run:
  ✅ Success. No rows returned
  OR
  ❌ Error message (see solutions above)
```

---

## 📝 SQL Code (Copy This)

If you can't find the file, copy this code:

```sql
-- Cypher Hero Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create lobbies table
CREATE TABLE IF NOT EXISTS lobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id TEXT UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  players JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lobbies_lobby_id ON lobbies(lobby_id);
CREATE INDEX IF NOT EXISTS idx_lobbies_status ON lobbies(status);

-- Enable Row Level Security (RLS)
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

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
```

---

## ✅ Verification Steps

After running SQL, verify it worked:

1. **Check Table Editor**
   - Go to "Table Editor" in sidebar
   - You should see "lobbies" table
   - Click on it to see columns

2. **Check Table Structure**
   The table should have these columns:
   - `id` (uuid)
   - `lobby_id` (text)
   - `host_id` (text)
   - `status` (text)
   - `players` (jsonb)
   - `created_at` (timestamp)

3. **Test Creating a Lobby**
   - Go to your app
   - Try creating a lobby
   - If it works, database is set up correctly!

---

## 🆘 Still Having Issues?

### Option 1: Use Table Editor (Easier Method)

Instead of SQL, you can create the table manually:

1. Go to **Table Editor**
2. Click **"New Table"**
3. Name: `lobbies`
4. Add columns:
   - `id` - uuid - Primary Key - Default: `gen_random_uuid()`
   - `lobby_id` - text - Unique
   - `host_id` - text
   - `status` - text - Default: `'waiting'`
   - `players` - jsonb - Default: `'[]'`
   - `created_at` - timestamp - Default: `now()`
5. Click **"Save"**

Then go to **Authentication** → **Policies** → Enable RLS for `lobbies`

### Option 2: Contact Support

If nothing works:
1. Take a screenshot of the error
2. Check Supabase status: https://status.supabase.com
3. Check Supabase docs: https://supabase.com/docs

---

## 📞 Quick Checklist

Before asking for help, check:
- [ ] Are you logged into Supabase?
- [ ] Are you in the correct project?
- [ ] Did you copy the ENTIRE SQL code?
- [ ] Did you click "Run" button?
- [ ] Did you see a success message?
- [ ] Did you check Table Editor for "lobbies" table?

---

Good luck! 🍀


