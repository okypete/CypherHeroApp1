# 🔧 Fix RLS (Row Level Security) Error

If the SQL code failed, try these solutions:

---

## ❌ Error: "Policy already exists"

**Solution:** Use this code instead (it removes old policy first):

```sql
-- Remove old policy if it exists
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;

-- Enable RLS
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

-- Create new policy
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## ❌ Error: "Table doesn't exist"

**Solution:** Make sure you created the table first!

1. Go to **Table Editor**
2. Check if `lobbies` table exists
3. If not, go back to Step 1 and create it
4. Then try the SQL again

---

## ❌ Error: "Permission denied"

**Solution:** Make sure you're the project owner:

1. Check you're logged into the correct Supabase account
2. Make sure you're in the correct project
3. Try refreshing the page
4. Run the SQL again

---

## ❌ Error: "Syntax error" or "Unexpected token"

**Solution:** Try this simpler version (run one line at a time):

**Line 1:**
```sql
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
```
Click Run. If successful, continue.

**Line 2:**
```sql
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;
```
Click Run.

**Line 3:**
```sql
CREATE POLICY "Allow all operations on lobbies" ON lobbies FOR ALL USING (true) WITH CHECK (true);
```
Click Run.

---

## ✅ Alternative: Skip RLS (For Testing Only)

**⚠️ Warning:** This is only for development/testing. Not recommended for production.

If RLS keeps failing, you can temporarily disable it:

```sql
ALTER TABLE lobbies DISABLE ROW LEVEL SECURITY;
```

**Note:** Your app might work without RLS for testing, but it's less secure.

---

## 🎯 Recommended: Use This Safe Code

This code handles all common errors:

```sql
-- Step 1: Enable RLS (safe - won't error if already enabled)
DO $$ 
BEGIN
  ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Step 2: Remove old policy if exists
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;

-- Step 3: Create new policy
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

Copy this entire block and paste into SQL Editor, then click Run.

---

## 🧪 Test If It Worked

1. Go to **Authentication** → **Policies**
2. Look for `lobbies` table
3. You should see a policy called "Allow all operations on lobbies"
4. If you see it → ✅ It worked!

**OR**

1. Go to your app
2. Try creating a lobby
3. If it works → ✅ RLS is set up correctly!

---

## 📸 What Error Did You Get?

If none of these work, tell me:
1. **Exact error message** (copy/paste it)
2. **Which line failed** (if you know)
3. **What you see** in the SQL Editor

I can help you fix the specific error!


