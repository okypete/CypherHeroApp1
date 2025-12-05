'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { CHANCE_CARDS, TRAP_CARDS, ChanceCard, TrapCard, applyPositionChange, BOARD_SQUARES } from '@/lib/gameData';
import CardModal from './CardModal';

export default function CardsView() {
  const { language, addSavedCard, setEnergy, energy, cypherStones, setCypherStones, playerPosition, setPlayerPosition, lobbyId, playerName, addPendingEffect, setInCypher } = useGameStore();
  const [selectedCard, setSelectedCard] = useState<ChanceCard | TrapCard | null>(null);
  const [cardType, setCardType] = useState<'chance' | 'trap'>('chance');

  const translations = {
    en: {
      title: 'Cards',
      chance: 'Chance Cards',
      trap: 'Trap Cards',
      draw: 'Draw Card',
      yourCards: 'Your Cards',
    },
    tr: {
      title: 'Kartlar',
      chance: 'Şans Kartları',
      trap: 'Tuzak Kartları',
      draw: 'Kart Çek',
      yourCards: 'Kartlarınız',
    },
  };

  const t = translations[language];
  
  const canDrawCard = true; // Turn system removed - anyone can draw cards

  const handleDrawCard = () => {
    if (!canDrawCard) return;
    const cards = cardType === 'chance' ? CHANCE_CARDS : TRAP_CARDS;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setSelectedCard(randomCard);
  };

  const handleSaveCard = () => {
    if (selectedCard && selectedCard.canSave) {
      addSavedCard(cardType, selectedCard);
      setSelectedCard(null);
      // Turn system removed - no need to call nextTurn()
    }
  };

  const handleUseCard = async () => {
    if (selectedCard) {
      let newEnergy = energy;
      let newPosition = playerPosition;
      let newStones = cypherStones;

      // Special case: Monkey Business - Buy stone for 500 energy
      if (selectedCard.id === 22 && selectedCard.title === 'Monkey Business') {
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
        if (selectedCard.energyChange) {
          newEnergy = Math.max(0, energy + selectedCard.energyChange);
          setEnergy(newEnergy);
        }
      }

      // Apply position change if card has one
      if (selectedCard.positionChange && selectedCard.positionChange !== 'swap') {
        newPosition = applyPositionChange(
          playerPosition,
          selectedCard.positionChange,
          BOARD_SQUARES.length
        );
        setPlayerPosition(newPosition);
        
        // If teleporting to Cypher Gate, save entry gate
        if (selectedCard.positionChange === 'nearest_cypher') {
          setInCypher(true, 3, newPosition);
        }
      }

      // Add pending effect if card has one
      if (selectedCard.nextSquareEffect) {
        addPendingEffect({
          squareName: selectedCard.nextSquareEffect.squareName,
          effect: selectedCard.nextSquareEffect.effect,
          cardTitle: selectedCard.title,
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

      setSelectedCard(null);
      // Turn system removed - no need to call nextTurn()
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center ${canDrawCard ? 'text-white neon-text-purple' : 'text-gray-500'}`}>{t.title}</h2>

      {/* Card Type Selector - Mobile responsive */}
      <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCardType('chance');
            setSelectedCard(null);
          }}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all text-sm md:text-base ${
            cardType === 'chance'
              ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white shadow-lg neon-glow-blue'
              : 'gaming-card text-gray-400 border-2 border-gray-600 hover:text-white'
          }`}
        >
          {t.chance}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCardType('trap');
            setSelectedCard(null);
          }}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all text-sm md:text-base ${
            cardType === 'trap'
              ? 'bg-gradient-to-r from-neon-orange to-neon-red text-white shadow-lg neon-glow-pink'
              : 'gaming-card text-gray-400 border-2 border-gray-600 hover:text-white'
          }`}
        >
          {t.trap}
        </motion.button>
      </div>

      {/* Draw Card Button - Card Style */}
      <div className="flex justify-center mb-6 md:mb-8">
        <motion.button
          whileHover={canDrawCard ? { scale: 1.05, rotate: 2 } : {}}
          whileTap={canDrawCard ? { scale: 0.95 } : {}}
          onClick={handleDrawCard}
          disabled={!canDrawCard}
          className={`relative w-48 h-64 md:w-56 md:h-72 gaming-card shadow-2xl p-6 flex flex-col items-center justify-center border-2 ${
            cardType === 'chance'
              ? 'border-neon-blue neon-glow-blue'
              : 'border-neon-orange neon-glow-pink'
          } ${!canDrawCard ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            borderRadius: '20px',
          }}
        >
          {/* Neon glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50 rounded-2xl"></div>
          
          <div className="text-center z-10">
            <p className="text-xs md:text-sm font-bold mb-2 opacity-70 text-gray-400">
              {cardType === 'chance' ? 'CHANCE' : 'TRAP'}
            </p>
            <p className={`text-2xl md:text-3xl font-bold mb-4 ${
              cardType === 'chance' ? 'text-neon-blue neon-text-blue' : 'text-neon-orange neon-text-pink'
            }`}>
              {t.draw}
            </p>
            <div className="text-4xl md:text-5xl">🃏</div>
          </div>
        </motion.button>
      </div>

      {/* Card Display Area */}
      <div className="max-w-md mx-auto">
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="cursor-pointer"
              onClick={() => setSelectedCard(null)}
            >
              <CardModal
                card={selectedCard}
                type={cardType}
                onClose={() => {
                  setSelectedCard(null);
                  // Turn system removed - no need to call nextTurn()
                }}
                canSave={selectedCard.canSave || false}
                onSave={handleSaveCard}
                onUse={handleUseCard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}



