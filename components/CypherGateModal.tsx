'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getRandomConceptCard } from '@/lib/gameData';

interface CypherGateModalProps {
  onEnter: () => void;
  onClose: () => void;
}

export default function CypherGateModal({ onEnter, onClose }: CypherGateModalProps) {
  const { language, inCypher, cypherRoundsRemaining } = useGameStore();
  const conceptCard = getRandomConceptCard();

  const translations = {
    en: {
      title: 'CYPHER GATE',
      enter: 'Enter Cypher',
      stay: 'Stay in Cypher',
      roundsRemaining: 'Rounds Remaining',
      concept: 'This Round\'s Concept',
      description: 'Perform with this concept in mind',
      complete: 'Complete 3 rounds to earn 1 Cypher Stone!',
      exit: 'Exit Cypher',
    },
    tr: {
      title: 'CYPHER KAPISI',
      enter: 'Cypher\'a Gir',
      stay: 'Cypher\'da Kal',
      roundsRemaining: 'Kalan Tur',
      concept: 'Bu Turun Konsepti',
      description: 'Bu konseptle performans göster',
      complete: '3 turu tamamla ve 1 Cypher Taşı kazan!',
      exit: 'Cypher\'dan Çık',
    },
  };

  const t = translations[language];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white"
      >
        <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl" />

        <div className="relative z-10">
          <h2 className="text-4xl font-cyber font-black mb-4 text-center neon-text">
            {t.title}
          </h2>

          {inCypher ? (
            <>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">{t.roundsRemaining}</p>
                <p className="text-3xl font-cyber font-bold text-center">
                  {cypherRoundsRemaining}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">{t.concept}</p>
                <p className="text-2xl font-cyber font-bold text-center mb-2">
                  {conceptCard.concept}
                </p>
                <p className="text-xs text-center opacity-75">
                  {conceptCard.description}
                </p>
              </div>

              <p className="text-center text-sm mb-4 opacity-75">
                {t.complete}
              </p>
            </>
          ) : (
            <>
              <p className="text-center mb-6">
                {language === 'en'
                  ? 'Enter the Cypher Zone! Stay for 3 rounds to earn a Cypher Stone.'
                  : 'Cypher Bölgesine gir! 3 tur kal ve Cypher Taşı kazan.'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnter}
                className="w-full bg-white text-purple-600 font-cyber font-bold py-3 rounded-lg shadow-lg mb-2"
              >
                {t.enter}
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-white/20 backdrop-blur-sm text-white font-display font-bold py-3 rounded-lg"
          >
            {inCypher ? t.exit : t.stay}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


