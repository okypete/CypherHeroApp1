# Cypher Hero - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install
```bash
npm install
```

### Step 2: Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor → New Query
4. Copy and paste the contents of `supabase-setup.sql`
5. Run the query

### Step 3: Get Your Keys
1. In Supabase, go to Settings → API
2. Copy your "Project URL" and "anon public" key

### Step 4: Create `.env.local`
Create a file named `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Run
```bash
npm run dev
```

Visit `http://localhost:3000` and start playing! 🎮

## 📱 What You Get

- ✨ Beautiful animated splash screen
- 🏠 Home screen with player name input
- 🎮 Real-time multiplayer lobbies
- 🎯 Interactive game board
- 🎲 3D animated dice
- ⚡ Energy system with animations
- 🃏 Chance & Trap cards
- ⏱️ Timer with countdown
- 🌍 English/Turkish support
- 📱 Fully responsive mobile design

## 🎨 Customize

- **Logo**: Replace text in `components/SplashScreen.tsx` with your logo image
- **Colors**: Update `tailwind.config.ts` with your brand colors
- **Cards**: Edit `lib/gameData.ts` to add/modify cards

## 📚 Full Documentation

See `SETUP.md` for detailed setup instructions and `README.md` for feature documentation.

## 🐛 Troubleshooting

**Can't connect to Supabase?**
- Double-check your `.env.local` file
- Make sure you ran the SQL setup script
- Verify RLS policies are set correctly

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall
- Check TypeScript errors: `npm run build`

## 🎯 Next Steps

1. Add your logo image to `public/logo.png`
2. Customize colors in `tailwind.config.ts`
3. Deploy to Vercel for free hosting
4. Add more game features as needed

Happy coding! 🚀




