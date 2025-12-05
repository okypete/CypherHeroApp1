═══════════════════════════════════════════════════════════════
  CYPHER HERO - ONE-CLICK INSTALLATION & RUN
═══════════════════════════════════════════════════════════════

📦 QUICK START (EASIEST WAY)
───────────────────────────────────────────────────────────────

1. Double-click: START_HERE.bat
   → This will install everything and run the app automatically!

2. Wait for installation (first time only, takes 2-3 minutes)

3. The app will open at: http://localhost:3000

That's it! 🎉


📋 AVAILABLE SCRIPTS
───────────────────────────────────────────────────────────────

START_HERE.bat
  → Install + Run (all-in-one, recommended for first time)

INSTALL_AND_RUN.bat
  → Install dependencies + Run app (same as START_HERE)

INSTALL_ONLY.bat
  → Only install dependencies (don't run)

RUN_APP.bat
  → Only run the app (requires dependencies already installed)


⚠️  REQUIREMENTS
───────────────────────────────────────────────────────────────

- Windows 10/11
- Node.js installed (download from: https://nodejs.org/)
  → If you see "Node.js not found", install it first!


🔧 TROUBLESHOOTING
───────────────────────────────────────────────────────────────

Problem: "Node.js is not installed"
Solution: Install Node.js from https://nodejs.org/
         Then run START_HERE.bat again

Problem: "Port 3000 is already in use"
Solution: Close other apps using port 3000, or
         Edit RUN_APP.bat and change "npm run dev" to
         "npm run dev -- -p 3001"

Problem: Installation takes too long
Solution: This is normal for first-time installation.
         It downloads all dependencies (Next.js, React, etc.)


📚 MORE INFORMATION
───────────────────────────────────────────────────────────────

- See RUN_APP.md for detailed instructions
- See SETUP.md for Supabase setup (optional, for multiplayer)
- See QUICK_START.md for 5-minute setup guide


═══════════════════════════════════════════════════════════════
  Enjoy playing Cypher Hero! 🎮
═══════════════════════════════════════════════════════════════


