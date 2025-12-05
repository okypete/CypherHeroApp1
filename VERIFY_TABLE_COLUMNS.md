# ✅ How to See Your Table Columns

If you got "Success" but can't see 6 columns, let's check!

---

## 🔍 Step 1: Find the Table

1. Go to **"Table Editor"** (left sidebar in Supabase)
2. Look for a table called **"lobbies"**
3. Do you see it? 
   - ✅ Yes → Go to Step 2
   - ❌ No → The table wasn't created, go to "Create Table" section below

---

## 🔍 Step 2: View the Columns

1. **Click on the "lobbies" table** (click the table name)
2. You should see columns listed

**Where to look:**
- The columns might be in a **table/grid view**
- Or in a **list on the left side**
- Or in a **"Columns" tab**

**What you should see:**
- `id` (uuid)
- `lobby_id` (text)
- `host_id` (text)
- `status` (text)
- `players` (jsonb)
- `created_at` (timestamptz)

---

## ❌ If You Don't See 6 Columns

### Option A: Table Exists But Wrong Columns

**Check what columns you have:**
1. Click on "lobbies" table
2. Count how many columns you see
3. List them here

**If you have fewer than 6:**
- You need to add the missing columns
- See "Add Missing Columns" section below

### Option B: Table Doesn't Exist

**Create the table:**
1. Go to Table Editor
2. Click "New Table"
3. Name: `lobbies`
4. Add all 6 columns (see guide below)

---

## ➕ Add Missing Columns

If your table exists but has fewer than 6 columns:

1. **Click on "lobbies" table** in Table Editor
2. Look for:
   - **"Add Column"** button, OR
   - **"New Column"** button, OR
   - **"Columns"** tab → **"Add Column"**

3. **Add each missing column:**

   **If missing `id`:**
   - Name: `id`
   - Type: `uuid`
   - ✅ Primary Key
   - Default: `gen_random_uuid()`

   **If missing `lobby_id`:**
   - Name: `lobby_id`
   - Type: `text`
   - ✅ Unique
   - ❌ Not Null

   **If missing `host_id`:**
   - Name: `host_id`
   - Type: `text`
   - ❌ Not Null

   **If missing `status`:**
   - Name: `status`
   - Type: `text`
   - Default: `waiting`
   - ❌ Not Null

   **If missing `players`:**
   - Name: `players`
   - Type: `jsonb`
   - Default: `[]`

   **If missing `created_at`:**
   - Name: `created_at`
   - Type: `timestamptz`
   - Default: `now()`

4. **Save** after adding each column

---

## 🧪 Quick Test: Check Table Structure with SQL

Run this in SQL Editor to see what columns exist:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'lobbies'
ORDER BY ordinal_position;
```

This will show you:
- All column names
- Their types
- If they're nullable
- Default values

**Copy the results and check:**
- Do you see all 6 column names?
- Are the types correct?

---

## 📸 What Does Your Table Look Like?

**Tell me:**
1. How many columns do you see?
2. What are their names?
3. Can you take a screenshot? (if possible)

This will help me tell you exactly what's missing!

---

## ✅ Expected Result

When you click on "lobbies" table, you should see:

```
Columns:
1. id              (uuid, Primary Key)
2. lobby_id        (text, Unique)
3. host_id         (text)
4. status          (text, Default: 'waiting')
5. players         (jsonb, Default: '[]')
6. created_at      (timestamptz, Default: now())
```

**If you see this → ✅ Perfect! Your table is correct!**

---

## 🎯 Next Step

Once you have all 6 columns:

1. ✅ Table has 6 columns
2. ✅ RLS is enabled (you got "Success")
3. ✅ Policy is created

**Test your app:**
1. Make sure `.env.local` has your Supabase keys
2. Restart your app
3. Try creating a lobby
4. If it works → Everything is set up! 🎉

---

## 🆘 Still Can't See Columns?

**Try this:**
1. Refresh the Supabase page (F5)
2. Go to Table Editor again
3. Click on "lobbies" table
4. Look for a "Columns" or "Schema" tab
5. Or try clicking the table name twice

**Different Supabase versions show columns differently:**
- Some show them in a sidebar
- Some show them in a grid
- Some show them in a tab

**If nothing works:**
- Use the SQL query above to check columns
- Or tell me what you see and I'll help!


