'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { applyPositionChange, BOARD_SQUARES } from '@/lib/gameData';
import CardModal from './CardModal';

export default function InventoryView() {
  const { energy, cypherStones, setCypherStones, savedCards, removeSavedCard, language, setEnergy, playerPosition, setPlayerPosition, lobbyId, playerName, addPendingEffect, setInCypher } = useGameStore();
  const [selectedCard, setSelectedCard] = useState<{ type: 'chance' | 'trap'; card: any; index: number } | null>(null);

  const translations = {
    en: {
      title: 'Inventory',
      energy: 'Energy',
      cypherStones: 'Cypher Stones',
      savedCards: 'Saved Cards',
      use: 'Use',
      convert: 'Convert to Energy',
      stoneValue: '1 Stone = 1000 Energy',
      noCards: 'No saved cards',
    },
    tr: {
      title: 'Envanter',
      energy: 'Enerji',
      cypherStones: 'Cypher Taşları',
      savedCards: 'Saklanan Kartlar',
      use: 'Kullan',
      convert: 'Enerjiye Çevir',
      stoneValue: '1 Taş = 1000 Enerji',
      noCards: 'Saklanan kart yok',
    },
  };

  const t = translations[language];

  const handleConvertStone = async () => {
    if (cypherStones <= 0) {
      alert(language === 'en' ? 'You cannot convert right now. You need at least 1 stone.' : 'Şu anda convert edemezsin. En az 1 taş gerekiyor.');
      return;
    }

    const newEnergy = energy + 1000;
    const newStones = cypherStones - 1;
    
    setEnergy(newEnergy);
    setCypherStones(newStones);

    // Sync with Supabase if configured
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
                energy: newEnergy,
                cypher_stones: newStones,
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
        console.error('Error updating energy from stone conversion:', error);
      }
    }
  };

  const handleUseCard = async (index: number) => {
    if (!selectedCard) return;
    
    let newEnergy = energy;
    let newPosition = playerPosition;
    let newStones = cypherStones;

    // Special case: Monkey Business - Buy stone for 500 energy
    if (selectedCard.card.id === 22 && selectedCard.card.title === 'Monkey Business') {
      if (energy >= 500) {
        newEnergy = Math.max(0, energy - 500);
        newStones = cypherStones + 1;
        setEnergy(newEnergy);
        setCypherStones(newStones);
      } else {
        // Not enough energy
        alert(language === 'en' ? 'Not enough energy! You need 500 energy to buy a stone.' : 'Yeterli enerji yok! Taş almak için 500 enerji gerekiyor.');
        return;
      }
    } else {
      // Apply energy change if card has one
      if (selectedCard.card.energyChange) {
        newEnergy = Math.max(0, energy + selectedCard.card.energyChange);
        setEnergy(newEnergy);
      }
    }

    // Apply position change if card has one
    if (selectedCard.card.positionChange && selectedCard.card.positionChange !== 'swap') {
      newPosition = applyPositionChange(
        playerPosition,
        selectedCard.card.positionChange,
        BOARD_SQUARES.length
      );
      setPlayerPosition(newPosition);
      
      // If teleporting to Cypher Gate, save entry gate
      if (selectedCard.card.positionChange === 'nearest_cypher') {
        setInCypher(true, 3, newPosition);
      }
    }

    // Add pending effect if card has one
    if (selectedCard.card.nextSquareEffect) {
      addPendingEffect({
        squareName: selectedCard.card.nextSquareEffect.squareName,
        effect: selectedCard.card.nextSquareEffect.effect,
        cardTitle: selectedCard.card.title,
      });
    }

    // Sync with Supabase if configured
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
                energy: newEnergy,
                position: newPosition,
                cypher_stones: newStones,
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
        console.error('Error updating player data from card:', error);
      }
    }
    
    // Remove card from inventory after use
    removeSavedCard(index);
    setSelectedCard(null);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center neon-text-purple">
        {t.title}
      </h2>

      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
        {/* Energy & Stones Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Energy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gaming-card p-4 md:p-6 border-2 border-neon-blue/50 neon-glow-blue rounded-lg"
          >
            <p className="text-gray-400 text-xs md:text-sm mb-2">{t.energy}</p>
            <p className="text-3xl md:text-4xl font-bold text-neon-blue neon-text-blue">
              {energy}
            </p>
          </motion.div>

          {/* Cypher Stones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gaming-card p-4 md:p-6 border-2 border-neon-purple/50 neon-glow-purple rounded-lg"
          >
            <p className="text-gray-400 text-xs md:text-sm mb-2">{t.cypherStones}</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-3xl md:text-4xl font-bold text-neon-purple neon-text-purple">
                {cypherStones}
              </p>
              {cypherStones > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConvertStone}
                  className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-neon-purple to-neon-orange text-white text-xs md:text-sm font-bold rounded-lg neon-glow-purple"
                >
                  {t.convert}
                </motion.button>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {language === 'en' ? 'Cannot convert' : 'Şu anda convert edemezsin'}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">{t.stoneValue}</p>
          </motion.div>
        </div>

        {/* Saved Cards */}
        <div className="gaming-card p-4 md:p-6 border-2 border-neon-purple/50 rounded-lg">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 neon-text-purple">
            {t.savedCards}
          </h3>

          {savedCards.length === 0 ? (
            <p className="text-center text-gray-500 py-6 md:py-8">{t.noCards}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {savedCards.map((savedCard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCard({ ...savedCard, index })}
                  className={`cursor-pointer gaming-card p-3 md:p-4 shadow-lg transition-all hover:scale-110 border-2 ${
                    savedCard.type === 'chance'
                      ? 'border-neon-blue hover:neon-glow-blue'
                      : 'border-neon-orange hover:neon-glow-pink'
                  } text-white rounded-lg`}
                >
                  <div className="text-center">
                    <p className="text-xs font-bold mb-1">
                      {savedCard.type === 'chance' ? 'CHANCE' : 'TRAP'}
                    </p>
                    <p className={`font-bold text-xs md:text-sm ${
                      savedCard.type === 'chance' ? 'text-neon-blue' : 'text-neon-orange'
                    }`}>
                      {savedCard.card.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4"
            >
              <CardModal
                card={selectedCard.card}
                type={selectedCard.type}
                onClose={() => setSelectedCard(null)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUseCard(selectedCard.index)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-white text-cyan-600 font-cyber font-bold rounded-lg shadow-lg"
              >
                {t.use}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

