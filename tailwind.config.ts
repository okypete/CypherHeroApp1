import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        // Gaming neon theme colors
        neon: {
          pink: "#FF6B9D",
          blue: "#4A90E2",
          purple: "#9B59B6",
          teal: "#00CED1",
          orange: "#FF8C42",
          red: "#FF4444",
          cyan: "#4A90E2",
          gold: "#FFD700",
          green: "#00FF00",
          yellow: "#FFFF00",
        },
        dark: {
          bg: "#0A0A0F",
          card: "#1A1A2E",
          surface: "#16213E",
          border: "#2A2A3E",
        },
        primary: {
          // CYPHER colors: blue to purple
          cyan: "#4A90E2",
          teal: "#4A90E2",
          turquoise: "#4A90E2",
          purple: "#9B59B6",
          deepPurple: "#7B2CBF",
          // HERO colors: orange
          orange: "#FF8C42",
          brightOrange: "#FFA366",
          red: "#FF6B35",
          deepRed: "#E55A2B",
        },
        cyberpunk: {
          neon: "#00FFFF",
          glow: "#00FF88",
          dark: "#0A0A0F",
          darker: "#050508",
          accent: "#FF0080",
        },
        background: {
          gradient: "linear-gradient(135deg, #40E0D0 0%, #FF6B35 100%)",
        },
      },
      animation: {
        "logo-spin": "spin 3s linear infinite",
        "logo-scale": "scale-up 2s ease-out forwards",
        "dice-shake": "shake 0.5s ease-in-out",
        "dice-roll": "roll 1s ease-out",
        "fade-in": "fadeIn 0.5s ease-in",
        "fade-out": "fadeOut 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "energy-pulse": "pulse 0.5s ease-in-out",
        "neon-glow": "neonGlow 2s ease-in-out infinite alternate",
        "cyber-scan": "cyberScan 3s linear infinite",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(0.8) translateZ(0)" },
          "100%": { transform: "scale(1.2) translateZ(50px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px) rotate(-5deg)" },
          "75%": { transform: "translateX(10px) rotate(5deg)" },
        },
        roll: {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(720deg) rotateY(360deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        neonGlow: {
          "0%": { 
            textShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF, 0 0 20px #00FFFF",
            boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF, 0 0 20px #00FFFF",
          },
          "100%": { 
            textShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 0 40px #00FFFF",
            boxShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 0 40px #00FFFF",
          },
        },
        cyberScan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;



