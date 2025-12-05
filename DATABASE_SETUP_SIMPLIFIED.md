# 🎯 SIMPLIFIED Database Setup (Easiest Method)

This is the **simplest** way to set up your database. No confusing tabs!

---

## ✅ Step 1: Create the Table

1. Go to Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. Click **"New Table"** button
4. Table name: `lobbies`
5. Click **"Continue"** or **"Next"**

---

## ✅ Step 2: Add Columns

Add these 6 columns (one at a time):

### Column 1: `id`
- Name: `id`
- Type: **uuid**
- ✅ Check "Is Primary Key"
- Default: `gen_random_uuid()`
- Click **"Add"** or **"Save"**

### Column 2: `lobby_id`
- Name: `lobby_id`
- Type: **text**
- ✅ Check "Is Unique"
- ❌ Uncheck "Is Nullable"
- Click **"Add"**

### Column 3: `host_id`
- Name: `host_id`
- Type: **text**
- ❌ Uncheck "Is Nullable"
- Click **"Add"**

### Column 4: `status`
- Name: `status`
- Type: **text**
- Default: `waiting`
- ❌ Uncheck "Is Nullable"
- Click **"Add"**

### Column 5: `players`
- Name: `players`
- Type: **jsonb**
- Default: `[]`
- Click **"Add"**

### Column 6: `created_at`
- Name: `created_at`
- Type: **timestamptz**
- Default: `now()`
- Click **"Add"**

### Save the Table
- Click **"Save"** or **"Create Table"**
- Done! ✅

---

## ✅ Step 3: Enable Security (Use SQL - It's Easier!)

Instead of looking for tabs that might not exist, use SQL:

1. Go to **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this code (this version handles errors better):

```sql
-- Enable Row Level Security (safe - won't error if already enabled)
DO $$ 
BEGIN
  ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **"Run"** button
5. You should see: ✅ "Success" or "Success. No rows returned"

**If you still get an error**, try this simpler version:

```sql
-- Simple version - run these one at a time if needed
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## ✅ Step 4: Verify It Worked

1. Go to **"Table Editor"**
2. You should see **"lobbies"** table
3. Click on it
4. You should see all 6 columns

**That's it!** Your database is ready! 🎉

---

## 🧪 Test It

1. Make sure your `.env.local` has Supabase keys
2. Restart your app
3. Go to http://localhost:3000
4. Enter your name
5. Click "Start a New Game"
6. If you see a lobby ID → ✅ It works!

---

## ❌ Troubleshooting

**Problem:** "Table already exists"
- That's OK! It means you already created it
- Skip to Step 3 (Enable Security)

**Problem:** "Can't find SQL Editor"
- Look for `</>` icon in sidebar
- Or look for "Database" → "SQL Editor"

**Problem:** "Error when running SQL" or "RLS code failed"
- See `FIX_RLS_ERROR.md` for detailed solutions
- Try the "Safe Code" version below
- Or run the SQL one line at a time

**Problem:** "Policy already exists"
- Use this code instead:
  ```sql
  DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;
  ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Allow all operations on lobbies" ON lobbies
    FOR ALL USING (true) WITH CHECK (true);
  ```

---

## 📝 Quick Checklist

- [ ] Created `lobbies` table
- [ ] Added all 6 columns
- [ ] Ran the security SQL code
- [ ] Verified table exists in Table Editor
- [ ] Tested creating a lobby in the app

**If all checked → You're done!** 🎉

