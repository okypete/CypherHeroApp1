# Cyberpunk Theme Update

## 🎨 What Changed

The app has been completely redesigned with a **cyberpunk aesthetic** matching your logo's color scheme!

### Color Scheme (Matching Logo)

**CYPHER Colors** (Teal/Cyan to Purple gradient):
- `#00FFFF` - Bright Cyan
- `#00CED1` - Teal
- `#40E0D0` - Turquoise
- `#9333EA` - Purple
- `#6B21A8` - Deep Purple

**HERO Colors** (Orange to Red gradient):
- `#FF6B35` - Orange
- `#FF8C42` - Bright Orange
- `#FF4444` - Red
- `#DC2626` - Deep Red

### Typography

**New Fonts Added:**
- **Orbitron** - Cyberpunk display font (headings, titles)
- **Rajdhani** - Modern sans-serif (body text, UI)

### Visual Effects

✨ **Neon Glows** - Cyan/purple neon effects on interactive elements
✨ **Animated Gradients** - Dynamic gradient backgrounds
✨ **Grid Overlay** - Cyberpunk grid pattern on backgrounds
✨ **Glass Morphism** - Frosted glass effect on cards
✨ **Scanline Effects** - Animated scanlines on splash screen
✨ **Pulsing Animations** - Neon glow pulsing effects

### Components Updated

- ✅ Splash Screen - Dark background with neon logo glow
- ✅ Home Screen - Cyberpunk gradient background with glass cards
- ✅ Game Board - Center logo with animated neon glow
- ✅ Buttons - Neon borders and glow effects
- ✅ Input Fields - Cyberpunk styled with cyan borders
- ✅ Cards - Glass morphism with neon accents

## 📁 Files Modified

1. `app/layout.tsx` - Added Google Fonts (Orbitron, Rajdhani)
2. `app/globals.css` - Cyberpunk styles, neon effects, gradients
3. `tailwind.config.ts` - New color palette, fonts, animations
4. `components/SplashScreen.tsx` - Dark theme with neon logo
5. `components/HomeScreen.tsx` - Cyberpunk background and styling
6. `components/BoardView.tsx` - Animated neon center logo
7. `components/CreateLobby.tsx` - Glass cards with neon borders
8. `components/JoinLobby.tsx` - Cyberpunk input styling

## 🎯 Logo Integration

The app now uses your logo image with:
- **Neon glow effects** that pulse
- **Drop shadows** with cyan/purple colors
- **Animated scaling** on splash screen
- **Fallback text** with matching gradient colors if image not found

### Logo File Location

Place your logo at: `public/cypher-hero-logo.png`

The logo should be:
- PNG format (transparent background recommended)
- High resolution (at least 512x256px)
- Shows "CYPHER HERO" with the gradient colors

## 🚀 Usage

All the cyberpunk styling is automatic! Just:
1. Add your logo image to `public/cypher-hero-logo.png`
2. Run the app - everything is styled automatically

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:
```ts
colors: {
  primary: {
    cyan: "#00FFFF",  // Change to your preferred cyan
    purple: "#9333EA", // Change to your preferred purple
    // etc...
  }
}
```

### Change Fonts

Edit `app/layout.tsx` to use different Google Fonts, or update `tailwind.config.ts`:
```ts
fontFamily: {
  cyber: ['YourFont', 'sans-serif'],
}
```

### Adjust Neon Intensity

Edit `app/globals.css`:
```css
.neon-text {
  text-shadow: 
    0 0 5px currentColor,  /* Adjust blur radius */
    0 0 10px currentColor,
    /* etc... */
}
```

## ✨ Features

- **Dark Theme** - Black/dark backgrounds throughout
- **Neon Accents** - Cyan, purple, and orange neon effects
- **Animated Backgrounds** - Moving gradient effects
- **Glass Cards** - Frosted glass UI elements
- **Grid Patterns** - Cyberpunk grid overlays
- **Modern Typography** - Orbitron and Rajdhani fonts

Enjoy your cyberpunk Cypher Hero experience! 🎮✨


