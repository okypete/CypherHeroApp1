# Cypher Hero - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd cypher-hero-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase-setup.sql`
3. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Database Setup

The `supabase-setup.sql` file contains all the necessary SQL to set up your database:

- Creates the `lobbies` table
- Sets up indexes for performance
- Enables Row Level Security (RLS)
- Creates a cleanup function for old lobbies

Run this SQL in your Supabase SQL Editor.

## Project Structure

```
cypher-hero-app/
├── app/                    # Next.js app directory
│   ├── game/[id]/         # Game screen route
│   ├── lobby/[id]/        # Lobby screen route
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (splash + home)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SplashScreen.tsx   # Animated splash screen
│   ├── HomeScreen.tsx     # Home with name input
│   ├── LobbyScreen.tsx    # Lobby management
│   ├── GameScreen.tsx     # Main game screen
│   ├── BoardView.tsx      # Game board display
│   ├── DiceView.tsx       # 3D dice component
│   ├── TimerView.tsx      # Timer/countdown
│   ├── CardsView.tsx      # Chance/Trap cards
│   ├── EnergyHUD.tsx      # Energy & inventory HUD
│   ├── NavigationBar.tsx  # Bottom navigation
│   └── ...                # Other components
├── lib/                   # Utilities
│   ├── supabase.ts       # Supabase client
│   └── gameData.ts       # Game rules & data
└── store/                 # State management
    └── gameStore.ts      # Zustand store
```

## Features Implemented

✅ **Splash Screen** - Animated logo with gradient transition
✅ **Home Screen** - Player name input, create/join lobby
✅ **Lobby System** - Real-time multiplayer lobbies with Supabase
✅ **Game Board** - Circular board with clockwise movement
✅ **Dice System** - 3D dice with shake/spin animations
✅ **Energy System** - Energy points with animations
✅ **Timer** - Countdown timer with multiple time options
✅ **Cards** - Chance and Trap card system
✅ **Navigation** - Bottom navigation bar with 4 tabs
✅ **Multi-language** - English/Turkish support
✅ **Square Cards** - Modal showing square info when landing

## Customization

### Adding Your Logo

Replace the text logo in `components/SplashScreen.tsx` with your actual logo image:

```tsx
<img 
  src="/logo.png" 
  alt="Cypher Hero" 
  className="w-48 h-48"
/>
```

### Changing Colors

Update the color values in `tailwind.config.ts`:

```ts
colors: {
  primary: {
    turquoise: "#40E0D0",  // Your turquoise
    orange: "#FF6B35",     // Your orange
  },
}
```

### Adding More Cards

Edit the card arrays in `lib/gameData.ts`:
- `CHANCE_CARDS` - Chance card definitions
- `TRAP_CARDS` - Trap card definitions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- etc.

## Troubleshooting

### Supabase Connection Issues

- Verify your `.env.local` file has correct values
- Check that RLS policies allow access
- Ensure the `lobbies` table exists

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`
- Verify all environment variables are set

## Next Steps

- Add authentication (optional)
- Implement card saving/inventory
- Add battle mode features
- Create admin dashboard
- Add sound effects
- Implement animations for card draws

## Support

For issues or questions, check the README.md or create an issue in your repository.




