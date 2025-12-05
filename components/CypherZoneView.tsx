'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getRandomFlowCard, FlowCard, applyPositionChange, BOARD_SQUARES } from '@/lib/gameData';

export default function CypherZoneView() {
  const { 
    inCypher, 
    cypherRoundsRemaining, 
    setInCypher, 
    setCypherStones, 
    cypherStones, 
    setEnergy, 
    energy, 
    language, 
    currentRound,
    cypherEntryGate,
    playerPosition,
    setPlayerPosition,
    lobbyId,
    playerName,
  } = useGameStore();
  const [flowCard, setFlowCard] = useState<FlowCard | null>(null);

  const translations = {
    en: {
      title: 'CYPHER ZONE',
      roundsRemaining: 'Rounds Remaining',
      concept: 'This Round\'s Concept',
      perform: 'Perform with this concept',
      complete: 'Complete all rounds to earn 1 Cypher Stone!',
      earned: 'You earned 1 Cypher Stone!',
      exit: 'Exit Cypher',
    },
    tr: {
      title: 'CYPHER BÖLGESİ',
      roundsRemaining: 'Kalan Tur',
      concept: 'Bu Turun Konsepti',
      perform: 'Bu konseptle performans göster',
      complete: 'Tüm turları tamamla ve 1 Cypher Taşı kazan!',
      earned: '1 Cypher Taşı kazandın!',
      exit: 'Cypher\'dan Çık',
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (inCypher && cypherRoundsRemaining > 0) {
      // Draw new flow card each round (includes concepts and stories)
      setFlowCard(getRandomFlowCard());
    }
  }, [inCypher, cypherRoundsRemaining, currentRound]);

  useEffect(() => {
    if (inCypher && cypherRoundsRemaining === 0) {
      // Completed 3 rounds - award Cypher Stone and exit to next gate
      const newStones = cypherStones + 1;
      setCypherStones(newStones);
      
      // Move to next Cypher Gate (exit gate)
      const nextGatePosition = applyPositionChange(
        playerPosition,
        'next_cypher_gate',
        BOARD_SQUARES.length,
        cypherEntryGate
      );
      
      setPlayerPosition(nextGatePosition);
      setInCypher(false, 0, null);
      
      // Sync with Supabase
      const syncWithSupabase = async () => {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        
        if (isSupabaseConfigured && lobbyId) {
          try {
            const { data: lobbyData } = await supabase
              .from('lobbies')
              .select('players')
              .eq('lobby_id', lobbyId)
              .single();

            if (lobbyData?.players) {
              const updatedPlayers = lobbyData.players.map((player: any) => {
                if (player.name === playerName) {
                  return { 
                    ...player, 
                    position: nextGatePosition,
                    cypher_stones: newStones,
                    in_cypher: false,
                    cypher_rounds_remaining: 0,
                  };
                }
                return player;
              });

              await supabase
                .from('lobbies')
                .update({ players: updatedPlayers })
                .eq('lobby_id', lobbyId);
            }
          } catch (error) {
            console.error('Error updating position after Cypher exit:', error);
          }
        }
      };

      syncWithSupabase();
    }
  }, [cypherRoundsRemaining, inCypher, setCypherStones, cypherStones, setInCypher, cypherEntryGate, playerPosition, setPlayerPosition, lobbyId, playerName]);

  if (!inCypher) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 border-purple-500/30"
        >
          <h2 className="text-4xl font-cyber font-black mb-6 text-center text-purple-300 neon-text">
            {t.title}
          </h2>

          {/* Rounds Remaining */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
            <p className="text-purple-400/70 text-sm mb-2 font-display">{t.roundsRemaining}</p>
            <p className="text-6xl font-cyber font-bold text-purple-300 neon-text">
              {cypherRoundsRemaining}
            </p>
          </div>

          {/* Flow Card */}
          {flowCard && (
            <motion.div
              key={flowCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 mb-6 text-white"
            >
              <p className="text-sm mb-2 font-display opacity-75">{t.concept}</p>
              <p className="text-3xl font-cyber font-bold mb-2">{flowCard.title}</p>
              {flowCard.concept && (
                <p className="text-xl font-bold mb-2 text-purple-200">Konsept: {flowCard.concept}</p>
              )}
              <p className="text-sm opacity-90 mb-2">{flowCard.description}</p>
              {flowCard.story && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs font-bold mb-1 opacity-75">Hikaye:</p>
                  <p className="text-sm opacity-90 italic">{flowCard.story}</p>
                </div>
              )}
              <p className="text-xs mt-2 opacity-75 italic">{t.perform}</p>
            </motion.div>
          )}

          <p className="text-center text-purple-400/70 text-sm font-display">
            {t.complete}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Complete this round in Cypher
              if (cypherRoundsRemaining > 0) {
                setInCypher(true, cypherRoundsRemaining - 1, cypherEntryGate);
                // Turn system removed - no need to call nextTurn()
              } else {
                setInCypher(false, 0, null);
                // Turn system removed - no need to call nextTurn()
              }
            }}
            className="w-full mt-6 bg-white/20 backdrop-blur-sm text-white font-cyber font-bold py-3 rounded-lg"
          >
            {cypherRoundsRemaining > 0 
              ? (language === 'en' ? 'Complete Round' : 'Tur Tamamla')
              : t.exit}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

