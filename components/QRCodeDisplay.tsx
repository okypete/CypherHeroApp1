'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface QRCodeDisplayProps {
  value: string;
  onClose?: () => void;
}

export default function QRCodeDisplay({ value, onClose }: QRCodeDisplayProps) {
  const { language } = useGameStore();
  
  const translations = {
    en: {
      title: 'QR Code',
      subtitle: 'Scan this code to join the game',
      lobbyId: 'Lobby ID',
      close: 'Close',
    },
    tr: {
      title: 'QR Kod',
      subtitle: 'Oyuna katılmak için bu kodu tarayın',
      lobbyId: 'Lobi ID',
      close: 'Kapat',
    },
  };
  
  const t = translations[language];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="gaming-card p-6 rounded-2xl shadow-2xl border-2 border-neon-purple/50 max-w-sm w-full"
      >
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white mb-2 neon-text-purple">
            {t.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {t.subtitle}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
          <QRCodeSVG
            value={value}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm mb-1">{t.lobbyId}</p>
          <p className="text-2xl font-bold text-neon-blue neon-text-blue tracking-widest">
            {value}
          </p>
        </div>
        
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-white font-bold py-3 rounded-lg neon-glow-purple"
          >
            {t.close}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

