'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import GameSettingsModal from './GameSettingsModal';

export default function CreateLobby() {
  const { playerName, setLobbyId, setIsHost, language, maxEnergy } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  const translations = {
    en: {
      button: 'Start a New Game',
      creating: 'Creating...',
    },
    tr: {
      button: 'Yeni Oyun Başlat',
      creating: 'Oluşturuluyor...',
    },
  };

  const t = translations[language];

  const generateLobbyId = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreateLobby = () => {
    if (!playerName.trim()) return;
    setShowSettings(true);
  };

  const handleSettingsConfirm = async (settings: { maxPlayers: number; maxRounds: number; maxEnergy: number }) => {
    setShowSettings(false);
    setLoading(true);
    
    try {
      const lobbyId = generateLobbyId();

      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (!isSupabaseConfigured) {
        // For UI testing without Supabase, simulate success
        setLobbyId(lobbyId);
        setIsHost(true);
        // Initialize energy from settings
        const { setEnergy } = await import('@/store/gameStore');
        setEnergy(settings.maxEnergy);
        router.push(`/lobby/${lobbyId}`);
        return;
      }

      // Create lobby in Supabase
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('lobbies')
        .insert({
          lobby_id: lobbyId,
          host_id: playerName,
          status: 'waiting',
          max_players: settings.maxPlayers,
          max_rounds: settings.maxRounds,
          max_energy: settings.maxEnergy,
          players: [
            {
              name: playerName,
              energy: settings.maxEnergy,
              cypher_stones: 0,
              position: 0,
              is_host: true,
              is_active: true,
              saved_cards: [],
            },
          ],
        })
        .select()
        .single();

      if (error) throw error;

      setLobbyId(lobbyId);
      setIsHost(true);
      router.push(`/lobby/${lobbyId}`);
    } catch (error) {
      console.error('Error creating lobby:', error);
      alert('Failed to create lobby. Please check your Supabase configuration or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreateLobby}
      disabled={loading}
      className="w-full gaming-card p-6 shadow-2xl text-left transition-all relative overflow-hidden hover:neon-glow-purple"
      style={{
        borderRadius: '20px',
      }}
    >
      {/* Neon glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50"></div>
        <div className="flex items-center justify-between">
          <div>
          <h3 className="text-2xl font-bold text-white mb-1 relative z-10 neon-text-purple">
            {t.button}
          </h3>
          <p className="text-gray-400 text-sm relative z-10">
            {language === 'en' ? 'Create a lobby' : 'Bir lobi oluştur'}
          </p>
          </div>
          <div className="text-3xl">🎮</div>
        </div>
        {loading && (
          <div className="mt-4 text-center text-cyan-400 font-display">
            {t.creating}
          </div>
        )}
      </motion.button>

      {showSettings && (
        <GameSettingsModal
          onClose={() => setShowSettings(false)}
          onConfirm={handleSettingsConfirm}
        />
      )}
    </>
  );
}



