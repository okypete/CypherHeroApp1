'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function EnergyCounter() {
  const { energy, setEnergy, lobbyId, playerName, language, isHost } = useGameStore();

  const translations = {
    en: {
      energy: 'Energy',
      adjust: 'Adjust Energy',
    },
    tr: {
      energy: 'Enerji',
      adjust: 'Enerji Ayarla',
    },
  };

  const t = translations[language];

  // Sync energy with Supabase in real-time
  useEffect(() => {
    if (!isSupabaseConfigured || !lobbyId) return;

    const updateEnergyInSupabase = async () => {
      try {
        const { data: lobbyData } = await supabase
          .from('lobbies')
          .select('players')
          .eq('lobby_id', lobbyId)
          .single();

        if (lobbyData?.players) {
          const updatedPlayers = lobbyData.players.map((player: any) => {
            if (player.name === playerName) {
              return { ...player, energy };
            }
            return player;
          });

          await supabase
            .from('lobbies')
            .update({ players: updatedPlayers })
            .eq('lobby_id', lobbyId);
        }
      } catch (error) {
        console.error('Error updating energy:', error);
      }
    };

    // Debounce updates
    const timeoutId = setTimeout(updateEnergyInSupabase, 500);
    return () => clearTimeout(timeoutId);
  }, [energy, lobbyId, playerName]);

  // Listen for energy updates from other players
  useEffect(() => {
    if (!isSupabaseConfigured || !lobbyId) return;

    const channel = supabase
      .channel(`energy-${lobbyId}`)
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
            const players = lobby.players || [];
            const currentPlayer = players.find((p: any) => p.name === playerName);
            if (currentPlayer && currentPlayer.energy !== energy) {
              setEnergy(currentPlayer.energy);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerName, energy, setEnergy]);

  const handleIncrease = () => {
    setEnergy(energy + 50);
  };

  const handleDecrease = () => {
    if (energy >= 50) {
      setEnergy(energy - 50);
    }
  };

  // Only show to host - regular players can't adjust their own values
  if (!isHost) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border-4 border-yellow-300/50 mb-4 md:mb-6 w-full max-w-md mx-auto" style={{ borderRadius: '25px 10px 30px 15px' }}>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center" style={{ fontFamily: 'serif' }}>
        {t.adjust} ({playerName})
      </h3>
      
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* Decrease Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrease}
          disabled={energy < 50}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-400 to-red-600 text-white font-bold text-xl md:text-2xl rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          -50
        </motion.button>

        {/* Energy Display */}
        <div className="text-center min-w-[100px] md:min-w-[120px]">
          <p className="text-xs md:text-sm text-gray-600 mb-1" style={{ fontFamily: 'serif' }}>
            {t.energy}
          </p>
          <motion.p
            key={energy}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-purple-600"
            style={{ fontFamily: 'serif' }}
          >
            {energy}
          </motion.p>
        </div>

        {/* Increase Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrease}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-xl md:text-2xl rounded-full shadow-lg flex items-center justify-center"
        >
          +50
        </motion.button>
      </div>
    </div>
  );
}

