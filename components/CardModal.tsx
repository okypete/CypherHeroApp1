'use client';

import { motion } from 'framer-motion';
import { ChanceCard, TrapCard } from '@/lib/gameData';
import { useGameStore } from '@/store/gameStore';

interface CardModalProps {
  card: ChanceCard | TrapCard;
  type: 'chance' | 'trap';
  onClose: () => void;
  canSave?: boolean;
  onSave?: () => void;
  onUse?: () => void;
}

export default function CardModal({ card, type, onClose, canSave = false, onSave, onUse }: CardModalProps) {
  const { language } = useGameStore();
  
  const translations = {
    en: {
      save: 'Save for Later',
      use: 'Use Now',
      close: 'Close',
    },
    tr: {
      save: 'Sonra Kullan',
      use: 'Şimdi Kullan',
      close: 'Kapat',
    },
  };
  
  const t = translations[language];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotateY: 180 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-80 h-96 gaming-card shadow-2xl p-6 flex flex-col justify-between border-2 ${
          type === 'chance'
            ? 'border-neon-blue neon-glow-blue'
            : 'border-neon-orange neon-glow-pink'
        } text-white rounded-2xl`}
      >
        {/* Card Type Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 gaming-card rounded-full text-xs font-bold border ${
            type === 'chance' ? 'border-neon-blue' : 'border-neon-orange'
          }`}>
            {type === 'chance' ? 'CHANCE' : 'TRAP'}
          </span>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4 text-center">{card.title}</h3>
          <div className="gaming-card rounded-lg p-4 mb-4 border border-white/20">
            <p className="text-lg font-semibold mb-2">{card.effect}</p>
            {card.description && (
              <p className="text-sm opacity-90 text-gray-300">{card.description}</p>
            )}
          </div>
          {card.energyChange && (
            <div className="text-center">
              <p
                className={`text-4xl font-bold ${
                  card.energyChange > 0 ? 'text-neon-blue neon-text-blue' : 'text-neon-red neon-text-pink'
                }`}
              >
                {card.energyChange > 0 ? '+' : ''}
                {card.energyChange} Energy
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {canSave && onSave && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSave();
                onClose();
              }}
              className="flex-1 gaming-card border-2 border-neon-purple/50 text-white font-bold py-2 rounded-lg hover:neon-glow-purple"
            >
              {t.save}
            </motion.button>
          )}
          {onUse && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onUse();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold py-2 rounded-lg neon-glow-purple"
            >
              {t.use}
            </motion.button>
          )}
          {!canSave && !onUse && (
            <p className="text-xs text-center opacity-75 w-full">Tap outside to close</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}



