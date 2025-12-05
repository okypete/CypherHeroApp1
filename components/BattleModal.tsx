'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getRandomFlowCard, FlowCard, getNextCypherGate, BOARD_SQUARES } from '@/lib/gameData';

interface BattleModalProps {
  player1: string; // Player already in Cypher
  player2: string; // Player trying to enter
  onClose?: () => void;
}

export default function BattleModal({ player1, player2, onClose }: BattleModalProps) {
  const { 
    language, 
    playerName, 
    players, 
    battleState, 
    setBattleState, 
    addBattleVote,
    lobbyId,
    inCypher,
    cypherRoundsRemaining,
    setInCypher,
    playerPosition,
  } = useGameStore();
  
  const [flowCard1, setFlowCard1] = useState<FlowCard | null>(null);
  const [flowCard2, setFlowCard2] = useState<FlowCard | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({ [player1]: 0, [player2]: 0 });

  const translations = {
    en: {
      title: 'BATTLE!',
      vs: 'VS',
      flowCard: 'Flow Card',
      vote: 'Vote',
      voted: 'Voted',
      waiting: 'Waiting for votes...',
      winner: 'Winner',
      youAreJury: 'You are a jury member',
      voteFor: 'Vote for',
      results: 'Results',
      player1Wins: 'wins!',
      player2Wins: 'wins!',
      tie: 'Tie!',
    },
    tr: {
      title: 'SAVAŞ!',
      vs: 'KARŞI',
      flowCard: 'Flow Kartı',
      vote: 'Oy Ver',
      voted: 'Oy Verildi',
      waiting: 'Oylar bekleniyor...',
      winner: 'Kazanan',
      youAreJury: 'Jüri üyesisiniz',
      voteFor: 'Oy ver',
      results: 'Sonuçlar',
      player1Wins: 'kazandı!',
      player2Wins: 'kazandı!',
      tie: 'Berabere!',
    },
  };

  const t = translations[language];

  // Check if current player is a jury member (not in battle)
  const isJury = playerName !== player1 && playerName !== player2;
  const isPlayer1 = playerName === player1;
  const isPlayer2 = playerName === player2;

  // Initialize flow cards from battle state or generate new ones
  useEffect(() => {
    if (battleState) {
      // Use flow cards from battle state if available
      if (battleState.flowCard1 && !flowCard1) {
        setFlowCard1(battleState.flowCard1);
      }
      if (battleState.flowCard2 && !flowCard2) {
        setFlowCard2(battleState.flowCard2);
      }
      
      // Generate new flow cards if not in battle state
      if (!battleState.flowCard1 || !battleState.flowCard2) {
        const card1 = battleState.flowCard1 || getRandomFlowCard();
        const card2 = battleState.flowCard2 || getRandomFlowCard();
        
        if (!battleState.flowCard1) setFlowCard1(card1);
        if (!battleState.flowCard2) setFlowCard2(card2);
        
        // Update battle state with flow cards
        const updatedBattle = {
          ...battleState,
          flowCard1: card1,
          flowCard2: card2,
        };
        setBattleState(updatedBattle);
        
        // Sync to Supabase
        const syncFlowCards = async () => {
          const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
          if (isSupabaseConfigured && lobbyId) {
            try {
              await supabase
                .from('lobbies')
                .update({ battle_state: updatedBattle })
                .eq('lobby_id', lobbyId);
            } catch (error) {
              console.error('Error updating flow cards:', error);
            }
          }
        };
        syncFlowCards();
      }
    }
  }, [battleState, flowCard1, flowCard2, setBattleState, lobbyId]);

  // Sync votes from Supabase
  useEffect(() => {
    if (!lobbyId) return;

    const syncVotes = async () => {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured && lobbyId) {
        try {
          const { data: lobbyData } = await supabase
            .from('lobbies')
            .select('battle_state')
            .eq('lobby_id', lobbyId)
            .single();

          if (lobbyData?.battle_state) {
            const battle = lobbyData.battle_state;
            setBattleState(battle);
            
            // Calculate vote counts
            const counts: Record<string, number> = { [player1]: 0, [player2]: 0 };
            Object.values(battle.votes || {}).forEach((votedPlayerName) => {
              if (votedPlayerName === player1) counts[player1]++;
              if (votedPlayerName === player2) counts[player2]++;
            });
            setVoteCounts(counts);
            
            // Check if current player has voted
            if (battle.votes && battle.votes[playerName]) {
              setHasVoted(true);
              setVotedPlayer(battle.votes[playerName]);
            }
          }
        } catch (error) {
          console.error('Error syncing battle votes:', error);
        }
      }
    };

    const interval = setInterval(syncVotes, 2000); // Poll every 2 seconds
    syncVotes();

    return () => clearInterval(interval);
  }, [lobbyId, playerName, player1, player2, setBattleState]);

  // Check if all jury members have voted
  const juryMembers = players.filter(p => p.name !== player1 && p.name !== player2);
  const totalVotes = Object.keys(battleState?.votes || {}).length;
  const allVoted = totalVotes >= juryMembers.length;

  // Determine winner
  const winner = allVoted ? (voteCounts[player1] > voteCounts[player2] ? player1 : 
                             voteCounts[player2] > voteCounts[player1] ? player2 : null) : null;

  // Handle battle result when all votes are in
  useEffect(() => {
    if (allVoted && winner && lobbyId) {
      const resolveBattle = async () => {
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
                if (winner === player1) {
                  // Player 1 wins - stays in Cypher, continues from current round
                  if (player.name === player1) {
                    // Get current rounds remaining from player data
                    const currentRounds = player.cypher_rounds_remaining || 3;
                    return { 
                      ...player, 
                      in_cypher: true,
                      cypher_rounds_remaining: currentRounds, // Continue from current round
                    };
                  }
                  // Player 2 loses - ejected from Cypher
                  if (player.name === player2) {
                    return { 
                      ...player, 
                      in_cypher: false,
                      cypher_rounds_remaining: 0,
                    };
                  }
                } else if (winner === player2) {
                  // Player 2 wins - enters Cypher, starts from round 1
                  if (player.name === player2) {
                    return { 
                      ...player, 
                      in_cypher: true,
                      cypher_rounds_remaining: 3, // Start from round 1 (3 rounds remaining)
                    };
                  }
                  // Player 1 loses - ejected from Cypher
                  if (player.name === player1) {
                    // Move to next gate
                    const player1Gate = player.cypher_entry_gate || player.position;
                    const nextGate = getNextCypherGate(player1Gate, BOARD_SQUARES.length);
                    return { 
                      ...player, 
                      in_cypher: false,
                      cypher_rounds_remaining: 0,
                      position: nextGate,
                    };
                  }
                }
                return player;
              });

              // Update players and clear battle state
              await supabase
                .from('lobbies')
                .update({ 
                  players: updatedPlayers,
                  battle_state: null,
                })
                .eq('lobby_id', lobbyId);

              // Update local state for current player
              if (winner === playerName) {
                if (winner === player2) {
                  // New winner enters Cypher - get their current position
                  const winnerPlayer = updatedPlayers.find((p: any) => p.name === player2);
                  if (winnerPlayer) {
                    setInCypher(true, 3, winnerPlayer.position);
                  }
                }
                // If winner is player1, they already have inCypher state - no change needed
              } else if (playerName === player2 && winner === player1) {
                // Loser ejected
                setInCypher(false, 0, null);
              } else if (playerName === player1 && winner === player2) {
                // Player 1 loses - ejected
                const loserPlayer = updatedPlayers.find((p: any) => p.name === player1);
                if (loserPlayer) {
                  setInCypher(false, 0, null);
                  // Position will be updated from Supabase sync
                }
              }
              
              // Close battle modal after resolution
              if (onClose) {
                setTimeout(() => {
                  setBattleState(null);
                  onClose();
                }, 2000);
              }
            }
          } catch (error) {
            console.error('Error resolving battle:', error);
          }
        }
      };

      // Wait a bit before resolving to show results
      const timer = setTimeout(() => {
        resolveBattle();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [allVoted, winner, lobbyId, playerName, player1, player2, setInCypher, playerPosition, onClose, setBattleState]);

  const handleVote = async (votedPlayerName: string) => {
    if (hasVoted || !isJury) return;

    addBattleVote(playerName, votedPlayerName);
    setHasVoted(true);
    setVotedPlayer(votedPlayerName);

    // Sync with Supabase
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    
    if (isSupabaseConfigured && lobbyId) {
      try {
        const { data: lobbyData } = await supabase
          .from('lobbies')
          .select('battle_state')
          .eq('lobby_id', lobbyId)
          .single();

        if (lobbyData?.battle_state) {
          const updatedBattle = {
            ...lobbyData.battle_state,
            votes: {
              ...lobbyData.battle_state.votes,
              [playerName]: votedPlayerName,
            },
          };

          await supabase
            .from('lobbies')
            .update({ battle_state: updatedBattle })
            .eq('lobby_id', lobbyId);
        }
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full max-w-4xl gaming-card rounded-2xl p-8 shadow-2xl border-2 border-neon-purple/50"
        style={{ borderRadius: '20px' }}
      >
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50 rounded-2xl"></div>
        <div className="absolute -top-1 -right-1 w-32 h-32 bg-neon-orange/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-8 neon-text-purple">
            {t.title}
          </h2>

          {/* Battle Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Player 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="gaming-card p-6 border-2 border-neon-blue/50 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-neon-blue mb-4 text-center">
                {player1}
              </h3>
              {flowCard1 && (
                <div className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/20 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-1">{t.flowCard}</p>
                  <p className="text-lg font-bold text-white">{flowCard1.title}</p>
                  <p className="text-sm text-gray-300 mt-2">{flowCard1.description}</p>
                </div>
              )}
              {isPlayer1 && (
                <p className="text-sm text-center text-gray-400">
                  {language === 'en' ? 'You are battling!' : 'Savaşıyorsun!'}
                </p>
              )}
              {allVoted && (
                <p className="text-2xl font-bold text-center mt-4 text-neon-blue">
                  {voteCounts[player1]} {language === 'en' ? 'votes' : 'oy'}
                </p>
              )}
            </motion.div>

            {/* VS */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-black text-neon-orange neon-text-orange"
              >
                {t.vs}
              </motion.div>
            </div>

            {/* Player 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="gaming-card p-6 border-2 border-neon-orange/50 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-neon-orange mb-4 text-center">
                {player2}
              </h3>
              {flowCard2 && (
                <div className="bg-gradient-to-br from-neon-orange/20 to-neon-red/20 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-1">{t.flowCard}</p>
                  <p className="text-lg font-bold text-white">{flowCard2.title}</p>
                  <p className="text-sm text-gray-300 mt-2">{flowCard2.description}</p>
                </div>
              )}
              {isPlayer2 && (
                <p className="text-sm text-center text-gray-400">
                  {language === 'en' ? 'You are battling!' : 'Savaşıyorsun!'}
                </p>
              )}
              {allVoted && (
                <p className="text-2xl font-bold text-center mt-4 text-neon-orange">
                  {voteCounts[player2]} {language === 'en' ? 'votes' : 'oy'}
                </p>
              )}
            </motion.div>
          </div>

          {/* Jury Voting Section */}
          {isJury && (
            <div className="gaming-card p-6 border-2 border-neon-purple/50 rounded-lg mb-6">
              <p className="text-lg font-bold text-center text-neon-purple mb-4">
                {t.youAreJury}
              </p>
              {!hasVoted ? (
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(player1)}
                    className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-blue text-white font-bold rounded-lg neon-glow-blue"
                  >
                    {t.voteFor} {player1}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(player2)}
                    className="px-6 py-3 bg-gradient-to-r from-neon-orange to-neon-red text-white font-bold rounded-lg neon-glow-pink"
                  >
                    {t.voteFor} {player2}
                  </motion.button>
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  {t.voted}: <span className="font-bold text-white">{votedPlayer}</span>
                </p>
              )}
            </div>
          )}

          {/* Results */}
          {allVoted && winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-6 border-2 border-neon-green/50 rounded-lg mb-6 text-center"
            >
              <p className="text-3xl font-bold text-neon-green neon-text-green mb-2">
                {t.winner}: {winner}
              </p>
              <p className="text-gray-400">
                {winner === player1 ? `${player1} ${t.player1Wins}` : `${player2} ${t.player2Wins}`}
              </p>
            </motion.div>
          )}

          {allVoted && !winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-6 border-2 border-neon-yellow/50 rounded-lg mb-6 text-center"
            >
              <p className="text-3xl font-bold text-neon-yellow neon-text-yellow">
                {t.tie}
              </p>
            </motion.div>
          )}

          {!allVoted && (
            <p className="text-center text-gray-400 mb-4">
              {t.waiting} ({totalVotes}/{juryMembers.length})
            </p>
          )}

          {/* Close button (only for non-battling players or after results) */}
          {(isJury || allVoted) && onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold rounded-lg neon-glow-purple"
            >
              {language === 'en' ? 'Close' : 'Kapat'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

