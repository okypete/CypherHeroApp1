'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { language, setLanguage } = useGameStore();

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-primary-turquoise shadow-md'
            : 'text-white hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('tr')}
        className={`px-3 py-1 rounded-full font-medium transition-all ${
          language === 'tr'
            ? 'bg-white text-primary-turquoise shadow-md'
            : 'text-white hover:bg-white/20'
        }`}
      >
        TR
      </button>
    </div>
  );
}




