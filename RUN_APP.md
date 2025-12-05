# How to Run Cypher Hero App

## Quick Start (5 Steps)

### Step 1: Navigate to the Project
```bash
cd cypher-hero-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables (Optional for testing)
Create a file named `.env.local` in the `cypher-hero-app` folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key_here
```

**Note**: You can run the app without Supabase for testing the UI, but multiplayer features won't work.

### Step 4: Run the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Instructions

### Prerequisites
- **Node.js** (version 18 or higher)
  - Check if installed: `node --version`
  - Download from: [nodejs.org](https://nodejs.org/)

### First Time Setup

1. **Open Terminal/PowerShell**
   - Windows: Press `Win + X` and select "Windows PowerShell" or "Terminal"
   - Mac: Open "Terminal" from Applications
   - Linux: Open your terminal

2. **Navigate to Project Folder**
   ```bash
   cd "C:\Users\aliha\OneDrive\Masaüstü\PROJELER\CYPHER HERO\cypher-hero-app"
   ```

3. **Install Dependencies** (First time only)
   ```bash
   npm install
   ```
   This will install all required packages (Next.js, React, Tailwind, etc.)

4. **Run the App**
   ```bash
   npm run dev
   ```

5. **View the App**
   - The terminal will show: `Ready on http://localhost:3000`
   - Open your browser and go to: `http://localhost:3000`

---

## Available Commands

### Development
```bash
npm run dev
```
Starts the development server with hot-reload (changes update automatically)

### Production Build
```bash
npm run build
```
Creates an optimized production build

### Start Production Server
```bash
npm start
```
Runs the production build (run `npm run build` first)

### Lint Code
```bash
npm run lint
```
Checks for code errors

---

## Troubleshooting

### "npm is not recognized"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### "Port 3000 is already in use"
- Close other apps using port 3000
- Or run: `npm run dev -- -p 3001` (uses port 3001 instead)

### "Module not found" errors
- Delete `node_modules` folder
- Delete `package-lock.json` file
- Run `npm install` again

### Supabase Connection Issues
- The app will work for UI testing without Supabase
- For multiplayer features, set up Supabase (see SETUP.md)

### Build Errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

---

## What You'll See

1. **Splash Screen** (3 seconds)
   - Animated logo
   - Transitions to gradient background

2. **Home Screen**
   - Enter your player name
   - Create or Join a game

3. **Lobby Screen** (after creating/joining)
   - See lobby ID
   - View players
   - Start game (if host)

4. **Game Screen**
   - Game board
   - Dice, Timer, Cards tabs
   - Energy HUD

---

## Next Steps After Running

1. **Add Your Logo**
   - Place `cypher-hero-logo.png` in the `public/` folder
   - See `LOGO_SETUP.md` for details

2. **Set Up Supabase** (for multiplayer)
   - See `SETUP.md` for full instructions
   - Or `QUICK_START.md` for quick setup

3. **Customize**
   - Colors in `tailwind.config.ts`
   - Cards in `lib/gameData.ts`

---

## Need Help?

- Check `QUICK_START.md` for 5-minute setup
- Check `SETUP.md` for detailed instructions
- Check `README.md` for project overview

Happy coding! 🚀




