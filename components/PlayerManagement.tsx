'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Player {
  name: string;
  energy: number;
  cypher_stones: number;
  position: number;
  is_host: boolean;
  is_active: boolean;
}

interface PlayerEditModalProps {
  player: Player;
  onClose: () => void;
  onSave: (player: Player, energy: number, stones: number) => void;
}

function PlayerEditModal({ player, onClose, onSave }: PlayerEditModalProps) {
  const { language } = useGameStore();
  const [energy, setEnergy] = useState(player.energy || 0);
  const [stones, setStones] = useState(player.cypher_stones || 0);

  // Update state when player changes
  useEffect(() => {
    setEnergy(player?.energy ?? 0);
    setStones(player?.cypher_stones ?? 0);
  }, [player?.name, player?.energy, player?.cypher_stones]);

  const translations = {
    en: {
      edit: 'Edit Player',
      energy: 'Energy',
      stones: 'Cypher Stones',
      save: 'Save',
      cancel: 'Cancel',
    },
    tr: {
      edit: 'Oyuncu Düzenle',
      energy: 'Enerji',
      stones: 'Cypher Taşları',
      save: 'Kaydet',
      cancel: 'İptal',
    },
  };

  const t = translations[language];

  const handleSave = () => {
    onSave(player, energy, stones);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="gaming-card p-6 shadow-2xl border-2 border-neon-purple/50 w-full max-w-md neon-glow-purple rounded-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center neon-text-purple">
          {t.edit}: {player.name}
        </h3>

        {/* Total Energy Display */}
        <div className="mb-4 p-4 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-lg border border-neon-blue/50">
          <label className="block text-neon-blue font-bold mb-2 neon-text-blue">
            {language === 'en' ? 'Total Energy' : 'Toplam Enerji'}
          </label>
          <p className="text-3xl font-bold text-neon-blue neon-text-blue text-center">
            {energy + (stones * 1000)}
          </p>
          {stones > 0 && (
            <p className="text-xs text-gray-400 text-center mt-1">
              ({energy} + {stones}×1000)
            </p>
          )}
        </div>

        {/* Energy Input */}
        <div className="mb-4">
          <label className="block text-neon-blue font-bold mb-2 neon-text-blue">
            {t.energy} {language === 'en' ? '(Base)' : '(Temel)'}
          </label>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEnergy(Math.max(0, energy - 50))}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 text-white font-bold rounded-full neon-glow-pink"
            >
              -50
            </motion.button>
            <input
              type="number"
              value={energy}
              onChange={(e) => setEnergy(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-4 py-3 rounded-lg bg-dark-surface border-2 border-neon-purple/50 text-center text-2xl font-bold text-white focus:border-neon-pink focus:neon-glow-pink focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEnergy(energy + 50)}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 text-white font-bold rounded-full neon-glow-blue"
            >
              +50
            </motion.button>
          </div>
        </div>

        {/* Cypher Stones Input */}
        <div className="mb-6">
          <label className="block text-neon-purple font-bold mb-2 neon-text-purple">
            {t.stones}
          </label>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStones(Math.max(0, stones - 1))}
              disabled={stones === 0}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 text-white font-bold rounded-full disabled:opacity-50 neon-glow-pink"
            >
              -1
            </motion.button>
            <input
              type="number"
              value={stones}
              onChange={(e) => setStones(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-4 py-3 rounded-lg bg-dark-surface border-2 border-neon-purple/50 text-center text-2xl font-bold text-white focus:border-neon-pink focus:neon-glow-pink focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStones(stones + 1)}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 text-white font-bold rounded-full neon-glow-blue"
            >
              +1
            </motion.button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-dark-surface border-2 border-gray-600 text-gray-300 font-bold rounded-lg hover:border-gray-500"
          >
            {t.cancel}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-white font-bold rounded-lg shadow-lg neon-glow-purple"
          >
            {t.save}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PlayerManagement() {
  const { players, isHost, lobbyId, playerName, language, setPlayers, setEnergy, setCypherStones } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Listen for real-time updates
  useEffect(() => {
    if (!isSupabaseConfigured || !lobbyId) return;

    const channel = supabase
      .channel(`player-management-${lobbyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lobbies',
          filter: `lobby_id=eq.${lobbyId}`,
        },
        (payload) => {
          if (payload.new) {
            const lobby = payload.new as any;
            const playersList = lobby.players || [];
            setPlayers(playersList);
            
            // Update current player's energy and stones if changed
            const currentPlayer = playersList.find((p: any) => p.name === playerName);
            if (currentPlayer) {
              setEnergy(currentPlayer.energy);
              setCypherStones(currentPlayer.cypher_stones || 0);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerName, setPlayers, setEnergy, setCypherStones]);

  const translations = {
    en: {
      title: 'Player Management',
      subtitle: 'Manage all players\' energy and stones',
      energy: 'Energy',
      stones: 'Stones',
      host: 'Host',
      you: 'You',
    },
    tr: {
      title: 'Oyuncu Yönetimi',
      subtitle: 'Tüm oyuncuların enerji ve taşlarını yönet',
      energy: 'Enerji',
      stones: 'Taşlar',
      host: 'Ev Sahibi',
      you: 'Sen',
    },
  };

  const t = translations[language];

  // Only show to host
  if (!isHost) {
    return null;
  }

  const handleSavePlayer = async (player: Player, energy: number, stones: number) => {
    if (!isSupabaseConfigured || !lobbyId) {
      // Update local state if Supabase not configured
      const updatedPlayers = players.map((p: any) => {
        if (p.name === player.name) {
          return { ...p, energy, cypher_stones: stones };
        }
        return p;
      });
      setPlayers(updatedPlayers);
      
      // Update current player's state if editing self
      if (player.name === playerName) {
        setEnergy(energy);
        setCypherStones(stones);
      }
      return;
    }

    try {
      const { data: lobbyData } = await supabase
        .from('lobbies')
        .select('players')
        .eq('lobby_id', lobbyId)
        .single();

      if (lobbyData?.players) {
        const updatedPlayers = lobbyData.players.map((p: any) => {
          if (p.name === player.name) {
            return { ...p, energy, cypher_stones: stones };
          }
          return p;
        });

        await supabase
          .from('lobbies')
          .update({ players: updatedPlayers })
          .eq('lobby_id', lobbyId);
        
        // Update local state immediately
        setPlayers(updatedPlayers);
        
        // Update current player's state if editing self
        if (player.name === playerName) {
          setEnergy(energy);
          setCypherStones(stones);
        }
      }
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center neon-text-purple">
        {t.title}
      </h2>
      <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 text-center">
        {t.subtitle}
      </p>

      <div className="max-w-2xl mx-auto space-y-3 md:space-y-4">
        {players.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              // Ensure we have the latest player data
              const latestPlayer = players.find((p: any) => p.name === player.name) || player;
              setSelectedPlayer(latestPlayer as Player);
            }}
            className="gaming-card p-4 md:p-6 shadow-lg border-2 border-neon-purple/50 cursor-pointer hover:neon-glow-purple hover:border-neon-pink transition-all rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center text-white font-bold text-lg md:text-xl neon-glow-purple">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-base md:text-lg">
                    {player.name}
                    {player.is_host && (
                      <span className="ml-2 text-xs md:text-sm text-neon-purple neon-text-purple">👑 {t.host}</span>
                    )}
                    {player.name === playerName && (
                      <span className="ml-2 text-xs md:text-sm text-neon-blue neon-text-blue">({t.you})</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">{t.energy}</p>
                  <p className="text-xl md:text-2xl font-bold text-neon-blue neon-text-blue">
                    {player.energy + ((player.cypher_stones || 0) * 1000)}
                  </p>
                  {(player.cypher_stones || 0) > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ({player.energy} + {player.cypher_stones || 0}×1000)
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">{t.stones}</p>
                  <p className="text-xl md:text-2xl font-bold text-neon-purple neon-text-purple">
                    {player.cypher_stones || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerEditModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            onSave={handleSavePlayer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

