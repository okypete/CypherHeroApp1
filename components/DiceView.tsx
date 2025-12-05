'use client';

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { BOARD_SQUARES, calculateNewPosition } from '@/lib/gameData';
import SquareDisplay from './SquareDisplay';

function DiceView() {
  const { language, playerPosition, setPlayerPosition, energy, lobbyId, playerName, inCypher, setActiveTab } = useGameStore();
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [landedSquare, setLandedSquare] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'Roll the Dice',
      roll: 'Roll',
      rolling: 'Rolling...',
      result: 'You rolled',
      move: 'Move',
    },
    tr: {
      title: 'Zarı At',
      roll: 'At',
      rolling: 'Atılıyor...',
      result: 'Zar sonucu',
      move: 'Hareket Et',
    },
  };

  const t = translations[language];
  
  // Check if player can roll (not in Cypher and has energy)
  const canRoll = !inCypher && energy > 0;
  
  // If in Cypher, redirect to CypherZoneView
  useEffect(() => {
    if (inCypher) {
      // CypherZoneView will be shown automatically, but we can ensure dice tab is not active
      // Actually, CypherZoneView is shown in GameScreen, so we don't need to change tab
    }
  }, [inCypher]);

  const rollDice = () => {
    if (isRolling || !canRoll) return;

    setIsRolling(true);
    setShowResult(false);

    // Simulate dice roll animation
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setIsRolling(false);
      setShowResult(true);
    }, 1500);
  };

  const handleMove = async () => {
    if (!diceResult) return;
    
    const newPosition = calculateNewPosition(
      playerPosition,
      diceResult,
      BOARD_SQUARES.length
    );

    setPlayerPosition(newPosition);
    
    // Sync position with Supabase if configured
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
              return { ...player, position: newPosition };
            }
            return player;
          });

          await supabase
            .from('lobbies')
            .update({ players: updatedPlayers })
            .eq('lobby_id', lobbyId);
        }
      } catch (error) {
        // Error updating position
      }
    }
    
    // Get the square name the player landed on
    const squareName = BOARD_SQUARES[newPosition];
    setLandedSquare(squareName);

    // Reset dice
    setDiceResult(null);
    setShowResult(false);
    
    // Move to next turn after move (will be called after square is closed)
  };
  
  const handleCloseSquare = () => {
    setLandedSquare(null);
  };


  // 3D Dice faces
  const getDiceFace = (value: number) => {
    const dots = [
      [], // 0 (not used)
      [[0.5, 0.5]], // 1
      [[0.25, 0.25], [0.75, 0.75]], // 2
      [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], // 3
      [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]], // 4
      [[0.25, 0.25], [0.25, 0.75], [0.5, 0.5], [0.75, 0.25], [0.75, 0.75]], // 5
      [[0.25, 0.25], [0.25, 0.5], [0.25, 0.75], [0.75, 0.25], [0.75, 0.5], [0.75, 0.75]], // 6
    ];

    return dots[value] || [];
  };

  // Show Cypher message if in Cypher
  if (inCypher) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gaming-card p-8 border-2 border-neon-purple/50 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-neon-purple mb-4">
            {language === 'en' ? 'You are in Cypher Zone' : 'Cypher Bölgesindesin'}
          </h2>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Complete your rounds in the Cypher Zone. You cannot roll dice while in Cypher.' 
              : 'Cypher Bölgesindeki turlarını tamamla. Cypher\'dayken zar atamazsın.'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
      {!canRoll && energy <= 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-center"
        >
          <p className="text-red-400 font-bold">
            {language === 'en' ? 'You are eliminated!' : 'Elendin!'}
          </p>
        </motion.div>
      )}
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center ${canRoll ? 'text-white neon-text-blue' : 'text-gray-500'}`}>{t.title}</h2>

      {/* 3D Dice - Mobile responsive */}
      <div className="relative mb-6 md:mb-8">
        <motion.div
          animate={
            isRolling
              ? {
                  rotateX: [0, 360, 720],
                  rotateY: [0, 180, 360],
                  x: [0, -15, 15, -15, 15, 0],
                  y: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: isRolling ? 1.5 : 0,
            ease: 'easeOut',
          }}
          className="w-24 h-24 md:w-32 md:h-32 gaming-card rounded-2xl shadow-2xl flex items-center justify-center relative border-2 border-neon-purple/50 neon-glow-purple"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          {diceResult && !isRolling && (
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              {getDiceFace(diceResult).map((dot, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className="absolute w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-neon-orange to-neon-purple rounded-full shadow-lg neon-glow-orange"
                  style={{
                    left: `${dot[0] * 100 - 10}%`,
                    top: `${dot[1] * 100 - 10}%`,
                  }}
                />
              ))}
            </div>
          )}
          {!diceResult && !isRolling && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl md:text-5xl"
            >
              🎲
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && diceResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 md:mb-6 text-center"
          >
            <p className="text-lg md:text-xl text-gray-300 mb-3">
              {t.result}: <span className="font-bold text-3xl md:text-4xl text-neon-blue neon-text-blue">{diceResult}</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMove}
              className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold rounded-lg shadow-lg text-base md:text-lg neon-glow-purple"
            >
              {t.move}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll Button - Mobile responsive */}
      {!showResult && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollDice}
          disabled={isRolling || !canRoll}
          className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold text-lg md:text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden rounded-lg neon-glow-purple"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">{isRolling ? t.rolling : t.roll}</span>
        </motion.button>
      )}

      {energy <= 0 && (
        <p className="mt-4 text-red-500 text-center">
          {language === 'en' ? 'You are eliminated!' : 'Elendiniz!'}
        </p>
      )}

      {/* Show Square Display when player lands on a square */}
      <AnimatePresence>
        {landedSquare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <SquareDisplay square={landedSquare} onClose={handleCloseSquare} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(DiceView);
