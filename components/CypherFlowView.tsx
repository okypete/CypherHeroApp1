'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getRandomFlowCard, FlowCard } from '@/lib/gameData';

export default function CypherFlowView() {
  const { language } = useGameStore();
  const [flowCard, setFlowCard] = useState<FlowCard | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const translations = {
    en: {
      title: 'CYPHER FLOW CARDS',
      draw: 'Draw Flow Card',
      concept: 'Concept',
      story: 'Story',
      description: 'Description',
      perform: 'Perform with this concept',
      drawAnother: 'Draw Another Card',
    },
    tr: {
      title: 'CYPHER FLOW KARTLARI',
      draw: 'Flow Kartı Çek',
      concept: 'Konsept',
      story: 'Hikaye',
      description: 'Açıklama',
      perform: 'Bu konseptle performans göster',
      drawAnother: 'Başka Kart Çek',
    },
  };

  const t = translations[language];

  const handleDrawCard = () => {
    const card = getRandomFlowCard();
    setFlowCard(card);
    setHasDrawn(true);
  };

  const handleDrawAnother = () => {
    const card = getRandomFlowCard();
    setFlowCard(card);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gaming-card shadow-2xl p-6 md:p-8 border-2 border-neon-purple/50 rounded-2xl max-w-2xl w-full"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-neon-purple neon-text-purple">
          {t.title}
        </h2>

        {!hasDrawn ? (
          <div className="text-center">
            <p className="text-gray-400 mb-6 text-lg">
              {language === 'en' 
                ? 'Draw a Flow Card to see your creative dance concept and story!' 
                : 'Yaratıcı dans konseptin ve hikayeni görmek için bir Flow Kartı çek!'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDrawCard}
              className="px-8 py-4 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold rounded-lg text-lg md:text-xl shadow-2xl neon-glow-purple"
            >
              {t.draw}
            </motion.button>
          </div>
        ) : (
          flowCard && (
            <motion.div
              key={flowCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-6 mb-6 border-2 border-purple-500/30"
            >
              <p className="text-sm mb-2 text-gray-400 font-display opacity-75">{t.concept}</p>
              <p className="text-3xl font-bold mb-4 text-white">{flowCard.title}</p>
              
              {flowCard.concept && (
                <div className="mb-4">
                  <p className="text-sm font-bold mb-1 text-purple-300">{t.concept}:</p>
                  <p className="text-xl text-purple-200">{flowCard.concept}</p>
                </div>
              )}
              
              {flowCard.description && (
                <div className="mb-4">
                  <p className="text-sm font-bold mb-1 text-purple-300">{t.description}:</p>
                  <p className="text-sm opacity-90 text-gray-300">{flowCard.description}</p>
                </div>
              )}
              
              {flowCard.story && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs font-bold mb-2 opacity-75 text-purple-300">{t.story}:</p>
                  <p className="text-sm opacity-90 italic text-gray-300">{flowCard.story}</p>
                </div>
              )}
              
              <p className="text-xs mt-4 opacity-75 italic text-center text-purple-300">
                {t.perform}
              </p>
            </motion.div>
          )
        )}

        {hasDrawn && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawAnother}
            className="w-full px-6 py-3 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange text-white font-bold rounded-lg shadow-lg neon-glow-blue"
          >
            {t.drawAnother}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

