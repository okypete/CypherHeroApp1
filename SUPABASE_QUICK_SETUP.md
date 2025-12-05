# ⚡ Supabase Quick Setup (5 Minutes)

## 🎯 Quick Steps

### 1️⃣ Create Account & Project
1. Go to: https://supabase.com
2. Sign up (use GitHub or email)
3. Click **"New Project"**
4. Name: `cypher-hero`
5. Set a database password (save it!)
6. Choose region (closest to you)
7. Click **"Create new project"**
8. Wait 1-2 minutes ⏳

### 2️⃣ Get API Keys
1. Click **⚙️ Settings** (bottom left)
2. Click **"API"** in menu
3. Copy **"Project URL"** 📋
4. Copy **"anon public"** key 📋

### 3️⃣ Set Up Database
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `supabase-setup.sql` file
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **"Run"** ✅

### 4️⃣ Add to App
1. Open `cypher-hero-app/.env.local`
2. Add these lines:

```env
NEXT_PUBLIC_SUPABASE_URL=paste-your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

3. Save file

### 5️⃣ Restart App
1. Stop server (Ctrl+C)
2. Run `npm run dev` again
3. Test creating a lobby!

---

## ✅ Done!

Your app now has multiplayer features! 🎮

**Full guide**: See `SUPABASE_SETUP_GUIDE.md` for detailed instructions.


