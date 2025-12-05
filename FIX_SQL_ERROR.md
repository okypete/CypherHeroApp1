# 🔧 Fix SQL Error: Policy Already Exists

## ✅ Fixed SQL Script

The SQL script has been updated to handle this error. The new version:

1. **Drops the policy first** (if it exists)
2. **Then creates it** (fresh)

This means you can run the script multiple times without errors!

---

## 🎯 Solution: Use Updated SQL

The `supabase-setup.sql` file has been fixed. Just:

1. **Go to SQL Editor** in Supabase
2. **Click "New Query"**
3. **Copy the ENTIRE updated SQL** from `supabase-setup.sql`
4. **Paste and Run**

It will now work even if you've run it before!

---

## 🔄 Alternative: Run This Code

If you want to fix it manually, run this in SQL Editor:

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;

-- Create new policy
CREATE POLICY "Allow all operations on lobbies" ON lobbies
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## ✅ What Changed

**Before:**
```sql
CREATE POLICY "Allow all operations on lobbies" ON lobbies
```

**After:**
```sql
DROP POLICY IF EXISTS "Allow all operations on lobbies" ON lobbies;
CREATE POLICY "Allow all operations on lobbies" ON lobbies
```

This prevents the "already exists" error!

---

## 🧪 Test It

After running the updated SQL:

1. Check **Table Editor** → `lobbies` table exists
2. Check **Authentication** → **Policies** → Policy exists
3. Try creating a lobby in your app
4. If it works → ✅ Success!

---

The SQL script is now safe to run multiple times! 🎉


