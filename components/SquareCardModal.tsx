'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getSquareEnergy, isCypherGate, isCardSquare, CHANCE_CARDS, TRAP_CARDS } from '@/lib/gameData';
import CypherGateModal from './CypherGateModal';
import CardModal from './CardModal';
import BattleModal from './BattleModal';

interface SquareCardModalProps {
  square: string;
  onClose: () => void;
}

export default function SquareCardModal({ square, onClose }: SquareCardModalProps) {
  const { 
    language, 
    addSavedCard, 
    setEnergy, 
    energy, 
    setInCypher, 
    setCypherStones, 
    cypherStones,
    playerName,
    players,
    lobbyId,
    battleState,
    setBattleState,
  } = useGameStore();
  const [showCypherModal, setShowCypherModal] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [drawnCard, setDrawnCard] = useState<any>(null);
  const [cardType, setCardType] = useState<'chance' | 'trap'>('chance');

  const translations = {
    en: {
      landed: 'You landed on',
      energyGain: 'Energy Gain',
      points: 'points',
      close: 'Close',
    },
    tr: {
      landed: 'Üzerine geldin',
      energyGain: 'Enerji Kazancı',
      points: 'puan',
      close: 'Kapat',
    },
  };

  const t = translations[language];

  const energyGain = getSquareEnergy(square as any);
  const isGate = isCypherGate(square as any);
  const isCard = isCardSquare(square as any);

  const handleEnterCypher = async () => {
    const { playerPosition } = useGameStore.getState();
    
    // Check if another player is already in Cypher
    // First check Supabase for real-time data
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    let playerInCypher = null;
    
    if (isSupabaseConfigured && lobbyId) {
      try {
        const { data: lobbyData } = await supabase
          .from('lobbies')
          .select('players')
          .eq('lobby_id', lobbyId)
          .single();

        if (lobbyData?.players) {
          playerInCypher = lobbyData.players.find((p: any) => 
            p.name !== playerName && p.in_cypher === true
          );
        }
      } catch (error) {
        console.error('Error checking Cypher status:', error);
        // Fallback to local players
        playerInCypher = players.find((p: any) => p.name !== playerName && p.in_cypher);
      }
    } else {
      // Fallback to local players
      playerInCypher = players.find((p: any) => p.name !== playerName && p.in_cypher);
    }
    
    if (playerInCypher) {
      // Battle triggered!
      const battle = {
        isActive: true,
        player1: playerInCypher.name, // Player already in Cypher
        player2: playerName, // Player trying to enter
        votes: {},
        flowCard1: null,
        flowCard2: null,
      };
      
      setBattleState(battle);
      setShowBattle(true);
      setShowCypherModal(false);
      
      // Sync battle state to Supabase
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && lobbyId) {
        try {
          await supabase
            .from('lobbies')
            .update({ battle_state: battle })
            .eq('lobby_id', lobbyId);
        } catch (error) {
          console.error('Error setting battle state:', error);
        }
      }
    } else {
      // No battle, enter Cypher normally
      setInCypher(true, 3, playerPosition);
      setShowCypherModal(false);
      // Don't close modal - player should see CypherZoneView
      // onClose will be called when they complete Cypher rounds
      
      // Update player's in_cypher status in Supabase
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
                return { ...player, in_cypher: true, cypher_rounds_remaining: 3 };
              }
              return player;
            });

            await supabase
              .from('lobbies')
              .update({ players: updatedPlayers })
              .eq('lobby_id', lobbyId);
          }
        } catch (error) {
          console.error('Error updating player Cypher status:', error);
        }
      }
    }
  };
  
  // Listen for battle state changes
  useEffect(() => {
    if (battleState && battleState.isActive) {
      setShowBattle(true);
    }
  }, [battleState]);

  const handleDrawCard = () => {
    if (square === 'Chance Card') {
      const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
      setDrawnCard(card);
      setCardType('chance');
    } else if (square === 'Trap Card') {
      const card = TRAP_CARDS[Math.floor(Math.random() * TRAP_CARDS.length)];
      setDrawnCard(card);
      setCardType('trap');
    }
  };

  const handleSaveCard = () => {
    if (drawnCard) {
      addSavedCard(cardType, drawnCard);
      setDrawnCard(null);
      onClose();
    }
  };

  const handleUseCard = () => {
    if (drawnCard) {
      if (drawnCard.energyChange) {
        setEnergy(energy + drawnCard.energyChange);
      }
      setDrawnCard(null);
      onClose();
    }
  };

  // Show Battle Modal if battle is active
  if (showBattle && battleState && battleState.isActive) {
    return (
      <BattleModal
        player1={battleState.player1 || ''}
        player2={battleState.player2 || ''}
        onClose={() => {
          setShowBattle(false);
          // Battle will be resolved in BattleModal
        }}
      />
    );
  }

  // Show Cypher Gate modal
  if (isGate && !showCypherModal && !showBattle) {
    return (
      <CypherGateModal
        onEnter={() => setShowCypherModal(true)}
        onClose={onClose}
      />
    );
  }

  // Show card draw for card squares
  if (isCard && !drawnCard) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl p-8 border-cyan-500/30 w-full max-w-md"
        >
          <h2 className="text-3xl font-cyber font-bold text-cyan-300 mb-4 text-center">
            {square}
          </h2>
          <p className="text-center text-cyan-400/70 mb-6 font-display">
            {language === 'en' ? 'Draw a card!' : 'Bir kart çek!'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawCard}
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 text-white font-cyber font-bold py-3 rounded-lg neon-glow"
          >
            {language === 'en' ? 'Draw Card' : 'Kart Çek'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show drawn card
  if (isCard && drawnCard) {
    return (
      <CardModal
        card={drawnCard}
        type={cardType}
        onClose={() => {
          setDrawnCard(null);
          onClose();
        }}
        canSave={true}
        onSave={handleSaveCard}
        onUse={handleUseCard}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-80 rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-primary-turquoise to-primary-orange text-white"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl" />

        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2 text-center">{t.landed}</h3>
          <h2 className="text-4xl font-bold mb-6 text-center">{square}</h2>

          {energyGain > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
              <p className="text-sm mb-2">{t.energyGain}</p>
              <p className="text-3xl font-bold text-center">
                +{energyGain} {t.points}
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-white text-primary-turquoise font-bold py-3 rounded-lg shadow-lg"
          >
            {t.close}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

