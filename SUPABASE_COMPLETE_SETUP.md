# 🚀 Complete Supabase Configuration Guide

## Step-by-Step Setup

### Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - **GitHub** (recommended) OR
   - **Email** and password
4. Verify your email if needed

---

### Step 2: Create New Project

1. Click **"New Project"** button
2. Fill in:
   - **Name**: `cypher-hero` (or any name)
   - **Database Password**: 
     - Create a strong password
     - ⚠️ **SAVE THIS PASSWORD!** You'll need it
   - **Region**: Choose closest to you
   - **Pricing Plan**: **Free** (for development)
3. Click **"Create new project"**
4. Wait 1-2 minutes for setup

---

### Step 3: Get Your API Keys

1. In Supabase dashboard, click **⚙️ Settings** (bottom left)
2. Click **"API"** in the menu
3. Copy these two values:

   **a) Project URL**
   ```
   https://your-project-id.supabase.co
   ```
   - Click the 📋 copy button
   - Save it somewhere

   **b) anon public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - It's a long string
   - Click the 📋 copy button
   - Save it somewhere

---

### Step 4: Set Up Database

1. Click **"SQL Editor"** in left sidebar (looks like `</>`)
2. Click **"New Query"** button
3. Open file: `cypher-hero-app/supabase-setup.sql`
4. **Copy ALL the SQL code** from that file
5. **Paste** into SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. Wait for: ✅ **"Success. No rows returned"**

---

### Step 5: Verify Database

1. Click **"Table Editor"** in left sidebar
2. You should see **"lobbies"** table
3. Click on it to see columns:
   - `id`
   - `lobby_id`
   - `host_id`
   - `status`
   - `max_players`
   - `max_rounds`
   - `max_energy`
   - `current_round`
   - `current_player_index`
   - `players`
   - `game_state`
   - `created_at`
   - `updated_at`

---

### Step 6: Configure Your App

1. Go to your project folder: `cypher-hero-app/`
2. Open or create file: `.env.local`
3. Add these lines (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIwMDAwMCwiZXhwIjoxOTYwNzgwMDAwfQ.example
```

4. **Save the file**

---

### Step 7: Restart Your App

1. **Stop** your current server (Ctrl+C)
2. **Start** again:
   ```bash
   npm run dev
   ```
   OR double-click `START_HERE.bat`

3. Go to: **http://localhost:3000**

---

### Step 8: Test It!

1. Enter your player name
2. Click "Start a New Game"
3. Configure settings
4. Create lobby
5. **If you see a lobby ID** → ✅ It works!

---

## ✅ Verification Checklist

- [ ] Supabase account created
- [ ] Project created
- [ ] API keys copied (URL and anon key)
- [ ] SQL script run successfully
- [ ] `lobbies` table exists with all columns
- [ ] `.env.local` file created with keys
- [ ] App restarted
- [ ] Can create a lobby successfully

---

## 🐛 Troubleshooting

### "Invalid API key"
- Check `.env.local` file exists
- Verify no extra spaces in keys
- Make sure keys are on separate lines
- Restart app after adding keys

### "Table doesn't exist"
- Go back to SQL Editor
- Run `supabase-setup.sql` again
- Check Table Editor to verify

### "Permission denied"
- Make sure you're project owner
- Check RLS policies are set correctly
- Re-run the SQL script

### "Connection failed"
- Check internet connection
- Verify Project URL is correct
- Make sure project isn't paused (Free tier pauses after inactivity)

---

## 📋 Database Schema

Your `lobbies` table has these columns:

- `id` - UUID (Primary Key)
- `lobby_id` - TEXT (Unique, 6-digit code)
- `host_id` - TEXT (Host player name)
- `status` - TEXT ('waiting', 'playing', 'finished')
- `max_players` - INTEGER (Game setting)
- `max_rounds` - INTEGER (Game setting)
- `max_energy` - INTEGER (Game setting)
- `current_round` - INTEGER (Current game round)
- `current_player_index` - INTEGER (Whose turn)
- `players` - JSONB (Array of player objects)
- `game_state` - JSONB (Game state data)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

---

## 🎯 Quick Reference

**SQL File**: `cypher-hero-app/supabase-setup.sql`
**Env File**: `cypher-hero-app/.env.local`
**Keys Location**: Supabase → Settings → API

---

## 📞 Need Help?

- See `DATABASE_SETUP_SIMPLIFIED.md` for visual guide
- See `FIX_RLS_ERROR.md` for RLS issues
- Check Supabase docs: https://supabase.com/docs

---

**You're all set!** 🎉


