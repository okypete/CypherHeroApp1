'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface GameSettingsModalProps {
  onClose: () => void;
  onConfirm: (settings: { maxPlayers: number; maxRounds: number; maxEnergy: number }) => void;
}

export default function GameSettingsModal({ onClose, onConfirm }: GameSettingsModalProps) {
  const { language, maxPlayers, maxRounds, maxEnergy, setGameSettings } = useGameStore();
  const [settings, setSettings] = useState({
    maxPlayers,
    maxRounds,
    maxEnergy,
  });

  const translations = {
    en: {
      title: 'Game Settings',
      maxPlayers: 'Max Players',
      maxRounds: 'Max Rounds',
      maxEnergy: 'Starting Energy',
      cancel: 'Cancel',
      create: 'Create Game',
      description: 'Configure your game settings',
    },
    tr: {
      title: 'Oyun Ayarları',
      maxPlayers: 'Maksimum Oyuncu',
      maxRounds: 'Maksimum Tur',
      maxEnergy: 'Başlangıç Enerjisi',
      cancel: 'İptal',
      create: 'Oyun Oluştur',
      description: 'Oyun ayarlarınızı yapılandırın',
    },
  };

  const t = translations[language];

  const handleConfirm = () => {
    setGameSettings(settings);
    onConfirm(settings);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-2xl p-6 shadow-2xl border-cyan-500/30 w-full max-w-md"
      >
        <h2 className="text-2xl font-cyber font-bold text-cyan-300 mb-2 neon-text">
          {t.title}
        </h2>
        <p className="text-cyan-400/70 text-sm mb-6 font-display">{t.description}</p>

        <div className="space-y-4">
          {/* Max Players */}
          <div>
            <label className="block text-cyan-300 font-display font-semibold mb-2">
              {t.maxPlayers}
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={settings.maxPlayers}
              onChange={(e) =>
                setSettings({ ...settings, maxPlayers: parseInt(e.target.value) || 1 })
              }
              className="w-full px-4 py-3 rounded-lg bg-cyberpunk-darker/50 border-2 border-cyan-500/50 focus:border-cyan-400 focus:neon-glow focus:outline-none text-lg text-white font-display"
            />
          </div>

          {/* Max Rounds */}
          <div>
            <label className="block text-cyan-300 font-display font-semibold mb-2">
              {t.maxRounds}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.maxRounds}
              onChange={(e) =>
                setSettings({ ...settings, maxRounds: parseInt(e.target.value) || 1 })
              }
              className="w-full px-4 py-3 rounded-lg bg-cyberpunk-darker/50 border-2 border-cyan-500/50 focus:border-cyan-400 focus:neon-glow focus:outline-none text-lg text-white font-display"
            />
          </div>

          {/* Max Energy */}
          <div>
            <label className="block text-cyan-300 font-display font-semibold mb-2">
              {t.maxEnergy}
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={settings.maxEnergy}
              onChange={(e) =>
                setSettings({ ...settings, maxEnergy: parseInt(e.target.value) || 500 })
              }
              className="w-full px-4 py-3 rounded-lg bg-cyberpunk-darker/50 border-2 border-cyan-500/50 focus:border-cyan-400 focus:neon-glow focus:outline-none text-lg text-white font-display"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 bg-white/20 text-white font-display font-bold py-3 rounded-lg"
          >
            {t.cancel}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 text-white font-cyber font-bold py-3 rounded-lg neon-glow"
          >
            {t.create}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


