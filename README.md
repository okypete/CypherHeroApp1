# Cypher Hero - Web & Mobile App

A mobile-first, responsive web application for the board game Cypher Hero.

## Features

- ✨ Animated splash screen with logo
- 🏠 Home screen with player name input
- 🎮 Real-time lobby system (Supabase)
- 🎯 Interactive game board with clockwise movement
- 🎲 3D dice with shake/spin animations
- ⚡ Energy and inventory system
- 🃏 Chance and Trap card system
- ⏱️ Timer with countdown
- 🌍 Multi-language support (EN/TR)
- 📱 Mobile-first responsive design

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Supabase** - Backend & real-time database
- **Zustand** - State management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up Supabase:
- Create a `lobbies` table with the following schema:
  - `id` (uuid, primary key)
  - `lobby_id` (text, unique)
  - `host_id` (text)
  - `status` (text: 'waiting' | 'playing' | 'finished')
  - `players` (jsonb)
  - `created_at` (timestamp)

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
cypher-hero-app/
├── app/
│   ├── game/[id]/      # Game screen
│   ├── lobby/[id]/     # Lobby screen
│   ├── layout.tsx
│   ├── page.tsx        # Home/Splash
│   └── globals.css
├── components/
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LobbyScreen.tsx
│   ├── GameScreen.tsx
│   ├── BoardView.tsx
│   ├── DiceView.tsx
│   ├── TimerView.tsx
│   ├── CardsView.tsx
│   ├── EnergyHUD.tsx
│   ├── NavigationBar.tsx
│   └── ...
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── gameData.ts     # Game rules & data
└── store/
    └── gameStore.ts    # Zustand store
```

## Game Rules

- Players start with 500 energy
- Standard squares give +100 energy
- Movement is clockwise around the board
- Players lose when energy reaches 0
- Chance and Trap cards modify gameplay

## Development Status

✅ Project setup
✅ Splash screen
✅ Home screen
✅ Lobby system
✅ Game board
✅ Dice system
✅ Timer
✅ Cards system
✅ Energy HUD
✅ Navigation
✅ Multi-language

## License

MIT




