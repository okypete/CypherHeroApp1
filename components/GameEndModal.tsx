'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';

interface PlayerScore {
  name: string;
  energy: number;
  stones: number;
  totalScore: number; // energy + (stones * 1000)
}

export default function GameEndModal() {
  const { players, language, gameFinished, setGameFinished, lobbyId } = useGameStore();
  const [sortedPlayers, setSortedPlayers] = useState<PlayerScore[]>([]);

  useEffect(() => {
    if (gameFinished && players.length > 0) {
      // Calculate scores: energy + (stones * 1000)
      const scores: PlayerScore[] = players.map((player: any) => ({
        name: player.name,
        energy: player.energy || 0,
        stones: player.cypher_stones || 0,
        totalScore: (player.energy || 0) + ((player.cypher_stones || 0) * 1000),
      }));

      // Sort by total score (descending)
      scores.sort((a, b) => b.totalScore - a.totalScore);
      setSortedPlayers(scores);
    }
  }, [gameFinished, players]);

  const translations = {
    en: {
      title: 'Game Over!',
      highscore: 'High Scores',
      champion: 'Cypher Hero',
      player: 'Player',
      energy: 'Energy',
      stones: 'Stones',
      total: 'Total Score',
      rank: 'Rank',
    },
    tr: {
      title: 'Oyun Bitti!',
      highscore: 'Yüksek Skorlar',
      champion: 'Cypher Hero',
      player: 'Oyuncu',
      energy: 'Enerji',
      stones: 'Taşlar',
      total: 'Toplam Skor',
      rank: 'Sıra',
    },
  };

  const t = translations[language];

  if (!gameFinished || sortedPlayers.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full max-w-4xl gaming-card rounded-2xl p-8 shadow-2xl border-2 border-neon-purple/50"
        style={{ borderRadius: '20px' }}
      >
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50 rounded-2xl"></div>
        <div className="absolute -top-1 -right-1 w-32 h-32 bg-neon-pink/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-8 neon-text-purple">
            {t.title}
          </h2>

          <h3 className="text-3xl font-bold text-center mb-6 text-neon-cyan">
            {t.highscore}
          </h3>

          {/* Highscore Table */}
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => {
              const isChampion = index === 0;
              const rank = index + 1;
              
              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`gaming-card p-6 border-2 rounded-lg ${
                    isChampion
                      ? 'border-neon-gold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 neon-glow-gold'
                      : 'border-neon-purple/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank and Name */}
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${
                        isChampion ? 'text-neon-gold' : 'text-gray-400'
                      }`}>
                        #{rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-2xl font-bold ${
                            isChampion ? 'text-neon-gold' : 'text-white'
                          }`}>
                            {player.name}
                          </h4>
                          {isChampion && (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg text-sm">
                              {t.champion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t.energy}</p>
                        <p className="text-lg font-bold text-neon-blue">{player.energy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t.stones}</p>
                        <p className="text-lg font-bold text-neon-orange">{player.stones}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t.total}</p>
                        <p className={`text-2xl font-bold ${
                          isChampion ? 'text-neon-gold' : 'text-neon-cyan'
                        }`}>
                          {player.totalScore}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Formula explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sortedPlayers.length * 0.1 }}
            className="mt-6 p-4 bg-white/5 rounded-lg text-center"
          >
            <p className="text-sm text-gray-400">
              {language === 'en' 
                ? 'Total Score = Energy + (Stones × 1000)' 
                : 'Toplam Skor = Enerji + (Taşlar × 1000)'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}


