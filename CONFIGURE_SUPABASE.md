# ⚙️ Supabase Configuration - Quick Guide

## 🎯 What You Need

1. **Supabase Account** (free)
2. **Project URL** (from Supabase)
3. **Anon Key** (from Supabase)
4. **Database Setup** (run SQL script)

---

## 📝 Quick Steps

### 1. Get Supabase Keys

1. Go to: https://supabase.com
2. Sign up / Log in
3. Create new project
4. Go to: **Settings** → **API**
5. Copy:
   - **Project URL**
   - **anon public** key

### 2. Set Up Database

1. Go to: **SQL Editor**
2. Click: **New Query**
3. Open: `supabase-setup.sql`
4. Copy ALL code
5. Paste in SQL Editor
6. Click: **Run**

### 3. Add Keys to App

1. Create file: `.env.local` in `cypher-hero-app/` folder
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```
3. Save file

### 4. Restart App

1. Stop server (Ctrl+C)
2. Run: `npm run dev`
3. Test creating a lobby

---

## ✅ That's It!

Your app is now configured with Supabase!

**For detailed instructions**, see:
- `SUPABASE_COMPLETE_SETUP.md` - Full guide
- `SUPABASE_QUICK_SETUP.md` - 5-minute guide
- `DATABASE_SETUP_SIMPLIFIED.md` - Visual method

---

## 🆘 Problems?

- **Can't find keys?** → Settings → API
- **SQL error?** → See `FIX_RLS_ERROR.md`
- **Connection failed?** → Check `.env.local` file
- **Table missing?** → Run SQL script again

Good luck! 🍀


