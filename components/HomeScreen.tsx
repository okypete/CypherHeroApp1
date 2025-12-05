'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import LanguageToggle from './LanguageToggle';
import CreateLobby from './CreateLobby';
import JoinLobby from './JoinLobby';

export default function HomeScreen() {
  const { playerName, setPlayerName, language } = useGameStore();
  const [showLobbyOptions, setShowLobbyOptions] = useState(false);

  const translations = {
    en: {
      title: 'CYPHER HERO',
      subtitle: 'Enter the Circle',
      enterName: 'Enter your player name',
      createGame: 'Start a New Game',
      joinGame: 'Join a Game',
      enterLobbyId: 'Enter Lobby ID',
      required: 'Player name is required',
    },
    tr: {
      title: 'CYPHER HERO',
      subtitle: 'Çembere Gir',
      enterName: 'Oyuncu adınızı girin',
      createGame: 'Yeni Oyun Başlat',
      joinGame: 'Oyuna Katıl',
      enterLobbyId: 'Lobi ID Gir',
      required: 'Oyuncu adı gereklidir',
    },
  };

  const t = translations[language];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setShowLobbyOptions(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Floating Ash Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small ash particles - increased to 80 */}
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={`ash-${i}`}
            className="absolute rounded-full bg-black/40"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
              ],
              opacity: [0, 0.6, 0.8, 0],
              scale: [0.5, 1, 1.2, 0.3],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
        {/* Medium ash particles - increased to 40 */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`ash-medium-${i}`}
            className="absolute rounded-full bg-black/35"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, -250, -380],
              x: [
                Math.random() * 60 - 30,
                Math.random() * 60 - 30,
                Math.random() * 60 - 30,
                Math.random() * 60 - 30,
              ],
              opacity: [0, 0.55, 0.75, 0],
              scale: [0.4, 1.1, 1.25, 0.25],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: Math.random() * 18 + 22,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'linear',
            }}
          />
        ))}
        {/* Larger ash particles - increased to 30 */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`ash-large-${i}`}
            className="absolute rounded-full bg-black/30"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, -300, -450],
              x: [
                Math.random() * 80 - 40,
                Math.random() * 80 - 40,
                Math.random() * 80 - 40,
                Math.random() * 80 - 40,
              ],
              opacity: [0, 0.5, 0.7, 0],
              scale: [0.3, 1, 1.3, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 25,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      {/* Subtle Glitch Effects - Small random glitches that appear and disappear */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const colors = [
            { main: 'rgba(74, 144, 226, 0.6)', glow: 'rgba(74, 144, 226, 0.3)' },
            { main: 'rgba(155, 89, 182, 0.6)', glow: 'rgba(155, 89, 182, 0.3)' },
            { main: 'rgba(255, 140, 66, 0.6)', glow: 'rgba(255, 140, 66, 0.3)' },
          ];
          const color = colors[i % 3];
          const glitchType = Math.floor(Math.random() * 3); // 0: horizontal line, 1: vertical bar, 2: small block
          const initialDelay = Math.random() * 8 + i * 0.5; // Her glitch farklı zamanda başlasın
          
          return (
            <motion.div
              key={`mini-glitch-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                ...(glitchType === 0 ? {
                  // Horizontal line
                  width: `${40 + Math.random() * 80}px`,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${color.main}, transparent)`,
                  boxShadow: `0 0 8px ${color.glow}`,
                } : glitchType === 1 ? {
                  // Vertical bar
                  width: '2px',
                  height: `${30 + Math.random() * 50}px`,
                  background: `linear-gradient(180deg, transparent, ${color.main}, transparent)`,
                  boxShadow: `0 0 8px ${color.glow}`,
                } : {
                  // Small block
                  width: `${15 + Math.random() * 25}px`,
                  height: `${15 + Math.random() * 25}px`,
                  background: color.main,
                  boxShadow: `0 0 10px ${color.glow}`,
                }),
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.8, 0],
                x: glitchType === 0 ? [0, -3, 3, -2, 0] : glitchType === 1 ? [0, -2, 2, -1, 0] : [0, -1, 1, -0.5, 0],
                y: glitchType === 0 ? [0, 0, 0, 0, 0] : glitchType === 1 ? [0, -2, 2, -1, 0] : [0, -1, 1, -0.5, 0],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 4, // Her glitch kaybolduktan sonra 3-7 saniye bekleyip tekrar belirsin
                delay: initialDelay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
      
      {/* Cartoon Dancer Characters - Silhouette Style */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Dancer 1 - Left Side */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-10 left-10 w-32 h-48 md:w-40 md:h-60 opacity-20"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #9333EA 100%)',
              clipPath: 'polygon(50% 0%, 60% 20%, 70% 15%, 75% 30%, 80% 25%, 85% 40%, 90% 35%, 95% 50%, 85% 60%, 75% 70%, 65% 80%, 55% 90%, 45% 100%, 35% 90%, 25% 80%, 15% 70%, 5% 60%, 0% 50%, 5% 35%, 10% 25%, 15% 30%, 20% 15%, 30% 20%, 40% 10%, 50% 0%)',
            }}
          />
          
          {/* Dancer 2 - Right Side */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-10 right-10 w-28 h-44 md:w-36 md:h-56 opacity-20"
            style={{
              background: 'linear-gradient(135deg, #00CED1 0%, #00FFFF 50%, #9333EA 100%)',
              clipPath: 'polygon(50% 0%, 55% 15%, 65% 10%, 70% 25%, 75% 20%, 80% 35%, 85% 30%, 90% 45%, 85% 55%, 75% 65%, 65% 75%, 55% 85%, 45% 95%, 35% 85%, 25% 75%, 15% 65%, 5% 55%, 0% 45%, 5% 30%, 10% 20%, 15% 25%, 20% 10%, 30% 15%, 40% 5%, 50% 0%)',
            }}
          />
          
          {/* Dancer 3 - Top Left */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute top-20 left-20 w-24 h-40 md:w-32 md:h-52 opacity-15"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #9333EA 50%, #00CED1 100%)',
              clipPath: 'polygon(50% 0%, 58% 18%, 68% 12%, 72% 28%, 78% 22%, 82% 38%, 88% 32%, 92% 48%, 88% 58%, 78% 68%, 68% 78%, 58% 88%, 42% 100%, 32% 88%, 22% 78%, 12% 68%, 2% 58%, 0% 48%, 2% 32%, 8% 22%, 12% 28%, 18% 12%, 28% 18%, 38% 8%, 50% 0%)',
            }}
          />
          
          {/* Dancer 4 - Top Right */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            className="absolute top-20 right-20 w-24 h-40 md:w-32 md:h-52 opacity-15"
            style={{
              background: 'linear-gradient(135deg, #00FFFF 0%, #FF6B35 50%, #9333EA 100%)',
              clipPath: 'polygon(50% 0%, 58% 18%, 68% 12%, 72% 28%, 78% 22%, 82% 38%, 88% 32%, 92% 48%, 88% 58%, 78% 68%, 68% 78%, 58% 88%, 42% 100%, 32% 88%, 22% 78%, 12% 68%, 2% 58%, 0% 48%, 2% 32%, 8% 22%, 12% 28%, 18% 12%, 28% 18%, 38% 8%, 50% 0%)',
            }}
          />
      </div>

      {/* Additional colorful spotlights */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2"
        />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          {/* Logo Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-[600px] md:max-w-[800px] h-[200px] md:h-[300px] mx-auto mb-4"
          >
            <div className="relative w-full h-full">
            <Image
              src="/cypher-hero-logo.png"
              alt="Cypher Hero"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                // Hide image if it fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Show fallback text
                const fallback = target.parentElement?.querySelector('.logo-fallback');
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'block';
                }
              }}
            />
              {/* Fallback text logo if image not found */}
              <div className="logo-fallback hidden text-center">
                <h1 
                  className="text-5xl md:text-7xl font-black mb-2" 
                  style={{ 
                    background: 'linear-gradient(135deg, #00FFFF 0%, #00CED1 25%, #40E0D0 50%, #9333EA 75%, #6B21A8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
                  }}
                >
                  CYPHER
                </h1>
                <h1 
                  className="text-5xl md:text-7xl font-black" 
                  style={{ 
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FF4444 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(255, 68, 68, 0.5)',
                  }}
                >
                  HERO
                </h1>
              </div>
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-neon-blue neon-text-blue font-bold" 
          >
            {t.subtitle}
          </motion.p>
        </div>

        {!showLobbyOptions ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleNameSubmit}
            className="gaming-card p-6 shadow-2xl relative overflow-hidden"
            style={{
              borderRadius: '20px',
            }}
          >
            {/* Neon glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-pink/10 to-transparent opacity-50"></div>
            <div className="absolute -top-1 -right-1 w-32 h-32 bg-neon-pink/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl"></div>
            <label className="block text-neon-blue font-bold mb-2 text-lg neon-text-blue relative z-10">
              {t.enterName}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t.enterName}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-neon-purple/50 focus:border-neon-pink focus:neon-glow-pink focus:outline-none text-lg text-black placeholder-gray-500 relative z-10"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-white font-bold py-4 text-lg neon-glow-pink relative overflow-hidden rounded-lg"
            >
              <span className="relative z-10">Continue →</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <CreateLobby />
            <JoinLobby />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

