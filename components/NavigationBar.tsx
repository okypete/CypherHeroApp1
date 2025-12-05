'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export default function NavigationBar() {
  const { activeTab, setActiveTab, language } = useGameStore();

  const { isHost } = useGameStore();
  
  const tabs = [
    { id: 'dice' as const, icon: '🎲', label: language === 'en' ? 'Dice' : 'Zar' },
    { id: 'timer' as const, icon: '⏱️', label: language === 'en' ? 'Timer' : 'Zamanlayıcı' },
    { id: 'cards' as const, icon: '🃏', label: language === 'en' ? 'Cards' : 'Kartlar' },
    { id: 'cypher' as const, icon: '🌀', label: language === 'en' ? 'Cypher' : 'Cypher' },
    { id: 'inventory' as const, icon: '🎒', label: language === 'en' ? 'Inventory' : 'Envanter' },
    ...(isHost ? [{ id: 'management' as const, icon: '👑', label: language === 'en' ? 'Manage' : 'Yönet' }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 gaming-card shadow-2xl border-t border-neon-purple/30 z-40">
      <div className="flex items-center justify-around py-1 md:py-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white shadow-lg neon-glow-purple'
                : 'text-gray-400 hover:text-white hover:bg-dark-surface/50'
            }`}
          >
            <span className="text-xl md:text-2xl">{tab.icon}</span>
            <span className="text-[10px] md:text-xs font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}



