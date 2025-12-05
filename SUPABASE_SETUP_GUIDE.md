# 🚀 Complete Supabase Setup Guide for Cypher Hero

Follow these steps to set up Supabase for multiplayer features!

---

## 📋 Step 1: Create Supabase Account

1. **Go to Supabase Website**
   - Visit: https://supabase.com
   - Click **"Start your project"** or **"Sign Up"**

2. **Sign Up**
   - Click **"Sign in with GitHub"** (recommended) OR
   - Use email/password
   - Complete the sign-up process

3. **Verify Your Email** (if using email)
   - Check your inbox
   - Click the verification link

---

## 📋 Step 2: Create a New Project

1. **Click "New Project"**
   - You'll see a dashboard after logging in
   - Click the green **"New Project"** button

2. **Fill in Project Details**
   - **Name**: `cypher-hero` (or any name you like)
   - **Database Password**: 
     - Create a strong password (save it somewhere safe!)
     - You'll need this later
   - **Region**: Choose closest to you
     - Examples: `West US`, `East US`, `Europe West`, etc.
   - **Pricing Plan**: Select **"Free"** (perfect for development)

3. **Click "Create new project"**
   - Wait 1-2 minutes for project to be created
   - You'll see a loading screen

---

## 📋 Step 3: Get Your API Keys

Once your project is ready:

1. **Go to Project Settings**
   - Click the **⚙️ Settings** icon (bottom left)
   - Or click **"Project Settings"** in the sidebar

2. **Open API Settings**
   - Click **"API"** in the left menu

3. **Copy Your Credentials**
   You'll see two important values:
   
   **a) Project URL**
   - Look for **"Project URL"**
   - Example: `https://abcdefghijklmnop.supabase.co`
   - Click the **copy icon** 📋 next to it
   - Save this somewhere (you'll need it!)

   **b) Anon/Public Key**
   - Look for **"anon public"** key
   - It's a long string starting with `eyJ...`
   - Click the **copy icon** 📋 next to it
   - Save this too!

   ⚠️ **Important**: Never share your `service_role` key publicly!

---

## 📋 Step 4: Set Up Database

1. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Or click the **"</>"** icon

2. **Create New Query**
   - Click **"New query"** button

3. **Copy and Paste SQL**
   - Open the file: `supabase-setup.sql` in your project
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the Query**
   - Click **"Run"** button (or press `Ctrl+Enter`)
   - Wait for success message: ✅ "Success. No rows returned"

5. **Verify Table Created**
   - Click **"Table Editor"** in left sidebar
   - You should see a table called **"lobbies"**

---

## 📋 Step 5: Configure Your App

1. **Open `.env.local` File**
   - Navigate to: `cypher-hero-app/` folder
   - Open `.env.local` file (create it if it doesn't exist)

2. **Add Your Credentials**
   Paste these lines and fill in your values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Example:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIwMDAwMCwiZXhwIjoxOTYwNzgwMDAwfQ.example
   ```

3. **Save the File**
   - Make sure to save `.env.local`
   - ⚠️ **Important**: Never commit this file to Git!

---

## 📋 Step 6: Enable Row Level Security (RLS)

1. **Go to Authentication**
   - Click **"Authentication"** in left sidebar
   - Click **"Policies"** tab

2. **Check RLS Status**
   - The `lobbies` table should have RLS enabled
   - If not, go to Table Editor → `lobbies` → Settings → Enable RLS

3. **Verify Policy**
   - The SQL script should have created a policy
   - If you see errors, the policy allows all operations (for development)

---

## 📋 Step 7: Test Your Setup

1. **Restart Your App**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again
   - Or use `START_HERE.bat`

2. **Test Creating a Lobby**
   - Enter your player name
   - Click "Start a New Game"
   - If it works, you'll see a lobby ID!

3. **Check Supabase Dashboard**
   - Go to Table Editor → `lobbies`
   - You should see your new lobby entry!

---

## ✅ Verification Checklist

- [ ] Supabase account created
- [ ] Project created
- [ ] API keys copied
- [ ] `.env.local` file created with credentials
- [ ] SQL script run successfully
- [ ] `lobbies` table exists
- [ ] App restarted
- [ ] Can create a lobby successfully

---

## 🐛 Troubleshooting

### Problem: "Invalid API key"
**Solution**: 
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart your dev server

### Problem: "Table doesn't exist"
**Solution**:
- Go back to SQL Editor
- Run the `supabase-setup.sql` script again
- Check Table Editor to verify

### Problem: "Permission denied"
**Solution**:
- Check RLS policies in Authentication → Policies
- Make sure the policy allows operations
- Re-run the SQL script

### Problem: "Connection failed"
**Solution**:
- Check your internet connection
- Verify the Project URL is correct
- Make sure project is not paused (Free tier pauses after inactivity)

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **SQL Editor Help**: https://supabase.com/docs/guides/database

---

## 🎉 You're Done!

Once you complete these steps:
- ✅ Multiplayer lobbies will work
- ✅ Real-time player updates
- ✅ Game state synchronization
- ✅ All features enabled!

**Need Help?** Check the troubleshooting section or Supabase documentation.

Happy gaming! 🎮✨


