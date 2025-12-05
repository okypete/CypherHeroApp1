'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getSquareEnergy, isCypherGate, isCardSquare, CHANCE_CARDS, TRAP_CARDS } from '@/lib/gameData';
import { useEffect, useState, useRef } from 'react';
import CardModal from './CardModal';

// Note: SquareDisplay doesn't handle Cypher Gate entry directly
// That's handled by SquareCardModal when player lands on a gate square

interface SquareDisplayProps {
  square: string;
  onClose?: () => void;
}

export default function SquareDisplay({ square, onClose }: SquareDisplayProps) {
  const { language, energy, setEnergy, cypherStones, setCypherStones, lobbyId, playerName, pendingEffects, removePendingEffect, playerPosition, setInCypher, addSavedCard } = useGameStore();
  const [showEnergy, setShowEnergy] = useState(false);
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [drawnCard, setDrawnCard] = useState<any>(null);
  const [cardType, setCardType] = useState<'chance' | 'trap'>('chance');
  const [cardDrawn, setCardDrawn] = useState(false); // Track if card has been drawn to prevent re-drawing
  const energyGain = getSquareEnergy(square as any);
  const isGate = isCypherGate(square as any);
  const isCard = isCardSquare(square as any);
  const hasAppliedEnergy = useRef(false);
  const hasAppliedPendingEffects = useRef(false);
  
  // Auto-draw card if landed on card square (only once)
  useEffect(() => {
    if (isCard && !drawnCard && !cardDrawn) {
      if (square === 'Chance Card') {
        const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
        setDrawnCard(card);
        setCardType('chance');
        setCardDrawn(true);
      } else if (square === 'Trap Card') {
        const card = TRAP_CARDS[Math.floor(Math.random() * TRAP_CARDS.length)];
        setDrawnCard(card);
        setCardType('trap');
        setCardDrawn(true);
      }
    }
  }, [isCard, square, drawnCard, cardDrawn]);
  
  // Reset hasAppliedEnergy when square changes
  useEffect(() => {
    hasAppliedEnergy.current = false;
    hasAppliedPendingEffects.current = false;
    setShowEnergy(false);
    setAppliedEffects([]);
    setCardDrawn(false); // Reset card drawn flag when square changes
    setDrawnCard(null); // Reset drawn card when square changes
  }, [square]);

  // Apply pending effects when landing on a square
  useEffect(() => {
    if (!hasAppliedPendingEffects.current) {
      const relevantEffects = pendingEffects.filter(
        (effect) => effect.squareName === square
      );

      if (relevantEffects.length > 0) {
        let finalEnergy = energy;
        const effectMessages: string[] = [];

        relevantEffects.forEach((pendingEffect, index) => {
          const { effect, cardTitle } = pendingEffect;

          switch (effect.type) {
            case 'energy_penalty':
              if (effect.value) {
                finalEnergy = Math.max(0, finalEnergy + effect.value);
                effectMessages.push(`${cardTitle}: ${effect.value} Energy`);
              }
              break;
            case 'energy_bonus':
              if (effect.value) {
                finalEnergy = Math.max(0, finalEnergy + effect.value);
                effectMessages.push(`${cardTitle}: +${effect.value} Energy`);
              }
              break;
            case 'no_energy':
              // Don't add energy from square
              effectMessages.push(`${cardTitle}: No Energy Gain`);
              break;
            case 'auto_complete':
              effectMessages.push(`${cardTitle}: Auto-completed`);
              break;
            case 'fail_task':
              effectMessages.push(`${cardTitle}: Task Failed`);
              break;
          }

          // Remove the effect after applying
          const effectIndex = pendingEffects.findIndex(
            (e) => e.squareName === square && e.cardTitle === cardTitle
          );
          if (effectIndex !== -1) {
            removePendingEffect(effectIndex);
          }
        });

        if (finalEnergy !== energy) {
          setEnergy(finalEnergy);
          
          // Sync with Supabase
          const syncEnergyWithSupabase = async () => {
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
                      return { ...player, energy: finalEnergy };
                    }
                    return player;
                  });

                  await supabase
                    .from('lobbies')
                    .update({ players: updatedPlayers })
                    .eq('lobby_id', lobbyId);
                }
              } catch (error) {
                // Error updating energy
              }
            }
          };

          syncEnergyWithSupabase();
        }

        setAppliedEffects(effectMessages);
        hasAppliedPendingEffects.current = true;
      }
    }
  }, [square, pendingEffects, energy, setEnergy, lobbyId, playerName, removePendingEffect]);

  useEffect(() => {
    // Only apply energy once when component mounts
    if (!hasAppliedEnergy.current) {
      // Check if there's a "no_energy" effect for this square
      const hasNoEnergyEffect = pendingEffects.some(
        (effect) => effect.squareName === square && effect.effect.type === 'no_energy'
      );

      if (energyGain > 0 && !hasNoEnergyEffect) {
        setShowEnergy(true);
        const newEnergy = Math.max(0, energy + energyGain);
        setEnergy(newEnergy);

        // Sync with Supabase if configured
        const syncEnergyWithSupabase = async () => {
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
                    return { ...player, energy: newEnergy };
                  }
                  return player;
                });

                await supabase
                  .from('lobbies')
                  .update({ players: updatedPlayers })
                  .eq('lobby_id', lobbyId);
              }
            } catch (error) {
              // Error updating energy
            }
          }
        };

        syncEnergyWithSupabase();
      }
      hasAppliedEnergy.current = true;
    }
  }, [square, energyGain, energy, setEnergy, lobbyId, playerName, pendingEffects]);

  const translations = {
    en: {
      landed: 'You landed on',
      energyGain: 'Energy Gain',
      points: 'points',
      close: 'Continue',
    },
    tr: {
      landed: 'Üzerine geldin',
      energyGain: 'Enerji Kazancı',
      points: 'puan',
      close: 'Devam Et',
    },
  };

  const t = translations[language];

  const handleSaveCard = () => {
    if (drawnCard && drawnCard.canSave) {
      addSavedCard(cardType, drawnCard);
      setDrawnCard(null);
      setCardDrawn(false);
      // Turn system removed - no need to call nextTurn()
      if (onClose) {
        onClose();
      }
    }
  };

  const handleUseCard = async () => {
    if (drawnCard) {
      let newEnergy = energy;
      let newStones = cypherStones;

      // Special case: Monkey Business - Buy stone for 500 energy
      if (drawnCard.id === 22 && drawnCard.title === 'Monkey Business') {
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
      } else if (drawnCard.energyChange) {
        newEnergy = Math.max(0, energy + drawnCard.energyChange);
        setEnergy(newEnergy);
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
          // Error updating energy
        }
      }
      
      setDrawnCard(null);
      setCardDrawn(false);
      // Turn system removed - no need to call nextTurn()
      if (onClose) {
        onClose();
      }
    }
  };
  
  // Show card modal if card was drawn
  if (isCard && drawnCard) {
    return (
      <CardModal
        card={drawnCard}
        type={cardType}
        onClose={async () => {
          // If card was not saved or used, force use it (apply energy change if any)
          let newEnergy = energy;
          let newStones = cypherStones;

          // Special case: Monkey Business - Buy stone for 500 energy
          if (drawnCard.id === 22 && drawnCard.title === 'Monkey Business') {
            if (energy >= 500) {
              newEnergy = Math.max(0, energy - 500);
              newStones = cypherStones + 1;
              setEnergy(newEnergy);
              setCypherStones(newStones);
            }
          } else if (drawnCard.energyChange) {
            newEnergy = Math.max(0, energy + drawnCard.energyChange);
            setEnergy(newEnergy);
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
              // Error updating energy
            }
          }
          
          setDrawnCard(null);
          setCardDrawn(false);
          // Turn system removed - no need to call nextTurn()
          if (onClose) {
            onClose();
          }
        }}
        canSave={drawnCard.canSave || false}
        onSave={handleSaveCard}
        onUse={handleUseCard}
      />
    );
  }

  // Gaming neon colors based on square type
  const getSquareColors = () => {
    if (isGate) {
      return {
        border: 'border-neon-purple',
        text: 'text-neon-purple',
        accent: 'text-neon-orange',
      };
    }
    if (isCard) {
      return {
        border: square === 'Chance Card' ? 'border-neon-blue' : 'border-neon-orange',
        text: square === 'Chance Card' ? 'text-neon-blue' : 'text-neon-orange',
        accent: square === 'Chance Card' ? 'text-neon-blue' : 'text-neon-red',
      };
    }
    return {
      border: 'border-neon-teal',
      text: 'text-neon-teal',
      accent: 'text-neon-blue',
    };
  };

  const colors = getSquareColors();

  // Random rotation for fun, decorative look
  const randomRotation = Math.random() * 8 - 4; // -4 to 4 degrees
  const randomSkew = Math.random() * 3 - 1.5; // -1.5 to 1.5 degrees

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50, rotate: randomRotation, skewX: randomSkew }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotate: randomRotation,
        skewX: randomSkew,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ type: 'spring', damping: 12, stiffness: 150 }}
      className={`relative w-full max-w-md mx-auto gaming-card p-8 shadow-2xl border-2 ${colors.border} neon-glow-purple`}
      style={{
        borderRadius: '20px',
        transform: `rotate(${randomRotation}deg)`,
      }}
    >
      {/* Neon glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50 rounded-2xl"></div>
      <div className="absolute -top-1 -right-1 w-32 h-32 bg-neon-orange/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400 mb-3 relative z-10"
        >
          {t.landed}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
          className={`text-5xl md:text-6xl font-black ${colors.text} mb-6 relative z-10`}
          style={{
            textShadow: `0 0 20px ${colors.text.includes('blue') ? 'rgba(0, 255, 255, 0.8)' : colors.text.includes('purple') ? 'rgba(147, 51, 234, 0.8)' : 'rgba(255, 107, 53, 0.8)'}`,
          }}
        >
          {square}
        </motion.h2>

        {showEnergy && energyGain > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.7 }}
            className="gaming-card p-6 mb-6 border-2 border-neon-blue/50 relative neon-glow-blue"
            style={{
              borderRadius: '15px',
            }}
          >
            {/* Neon glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent opacity-50 rounded-lg"></div>
            
            <p className="text-sm text-gray-400 mb-2 relative z-10">{t.energyGain}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.7, type: 'spring', bounce: 0.6 }}
              className={`text-4xl font-bold ${colors.accent} relative z-10 neon-text-blue`}
            >
              +{energyGain} {t.points}
            </motion.p>
          </motion.div>
        )}

        {/* Show applied card effects */}
        {appliedEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="gaming-card p-4 mb-6 border-2 border-neon-orange/50 relative neon-glow-orange"
            style={{
              borderRadius: '15px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-orange/10 to-transparent opacity-50 rounded-lg"></div>
            <p className="text-sm text-gray-400 mb-2 relative z-10">
              {language === 'en' ? 'Card Effect Applied' : 'Kart Efekti Uygulandı'}
            </p>
            {appliedEffects.map((effect, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-sm font-bold text-neon-orange relative z-10"
              >
                {effect}
              </motion.p>
            ))}
          </motion.div>
        )}

        {onClose && !isCard && (
          <motion.button
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: Math.random() * 4 - 2 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.1, rotate: 2, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              // Turn system removed - no need to call nextTurn()
              if (onClose) onClose();
            }}
            className="px-10 py-4 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden rounded-lg neon-glow-purple"
          >
            <span className="relative z-10">{t.close} →</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

