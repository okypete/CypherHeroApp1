'use client';

import { memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import LanguageToggle from './LanguageToggle';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function EnergyHUD() {
  const { playerName, energy, cypherStones, language, lobbyId, isHost, setGameStarted } = useGameStore();
  const router = useRouter();

  const translations = {
    en: {
      energy: 'Energy',
      cypherStones: 'Cypher Stones',
      leaveGame: 'Leave Game',
    },
    tr: {
      energy: 'Enerji',
      cypherStones: 'Cypher Taşları',
      leaveGame: 'Oyundan Ayrıl',
    },
  };


  const t = translations[language];
  
  const totalEnergy = useMemo(() => energy + (cypherStones * 1000), [energy, cypherStones]);

  const handleLeaveGame = useCallback(async () => {
    if (!lobbyId) {
      router.push('/');
      return;
    }

    if (isHost) {
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('lobbies')
            .update({ 
              status: 'closed',
              players: [],
            })
            .eq('lobby_id', lobbyId);
        } catch (error) {
          // Silent fail
        }
      }
    } else {
      if (isSupabaseConfigured) {
        try {
          const { data: lobbyData } = await supabase
            .from('lobbies')
            .select('players')
            .eq('lobby_id', lobbyId)
            .single();

          if (lobbyData?.players) {
            const updatedPlayers = lobbyData.players.filter((p: any) => p.name !== playerName);
            
            await supabase
              .from('lobbies')
              .update({ players: updatedPlayers })
              .eq('lobby_id', lobbyId);
          }
        } catch (error) {
          // Silent fail
        }
      }
    }

    setGameStarted(false);
    router.push('/');
  }, [lobbyId, isHost, playerName, router, setGameStarted]);

  return (
    <div className="gaming-card shadow-lg p-2 md:p-4 flex items-center justify-between flex-wrap gap-2 border-neon-purple/50">
      {/* Player Info */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue flex items-center justify-center text-white font-bold text-base md:text-lg neon-glow-purple">
          {playerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm md:text-base text-white">
              {playerName}
            </p>
          </div>
          {energy <= 0 && (
            <p className="text-xs text-red-500 line-through neon-text-pink">
              {language === 'en' ? 'Eliminated' : 'Elendi'}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Total Energy (Energy + Stones * 1000) */}
        <motion.div
          key={`${energy}-${cypherStones}`}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-xs text-gray-400 mb-1">{t.energy}</p>
          <p
            className={`text-xl md:text-2xl font-bold ${
              energy <= 0 ? 'text-red-500 line-through neon-text-pink' : 'text-neon-blue neon-text-blue'
            }`}
          >
            {totalEnergy}
          </p>
          {cypherStones > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              ({energy} + {cypherStones}×1000)
            </p>
          )}
        </motion.div>

        {/* Cypher Stones */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">{t.cypherStones}</p>
          <p className="text-xl md:text-2xl font-bold text-neon-purple neon-text-purple">
            {cypherStones}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Leave Game Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaveGame}
          className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-xs md:text-sm font-bold rounded-lg hover:bg-red-500/30 hover:border-red-500/70 transition-all"
        >
          {t.leaveGame}
        </motion.button>
        
        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </div>
  );
}

export default memo(EnergyHUD);



