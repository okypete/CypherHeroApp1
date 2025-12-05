'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import QRCodeScanner from './QRCodeScanner';

export default function JoinLobby() {
  const { playerName, setLobbyId, setIsHost, language } = useGameStore();
  const [lobbyIdInput, setLobbyIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const router = useRouter();

  const translations = {
    en: {
      button: 'Join a Game',
      placeholder: 'Enter Lobby ID',
      invalid: 'Invalid Lobby ID',
      joining: 'Joining...',
    },
    tr: {
      button: 'Oyuna Katıl',
      placeholder: 'Lobi ID Gir',
      invalid: 'Geçersiz Lobi ID',
      joining: 'Katılıyor...',
    },
  };

  const t = translations[language];

  const handleJoinLobby = async () => {
    if (!playerName.trim() || !lobbyIdInput.trim()) {
      setError(t.invalid);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (!isSupabaseConfigured) {
        // For UI testing without Supabase, simulate success
        setLobbyId(lobbyIdInput);
        setIsHost(false);
        router.push(`/lobby/${lobbyIdInput}`);
        return;
      }

      // Check if lobby exists
      const { supabase } = await import('@/lib/supabase');
      const { data, error: fetchError } = await supabase
        .from('lobbies')
        .select('*')
        .eq('lobby_id', lobbyIdInput)
        .single();

      if (fetchError || !data) {
        throw new Error('Lobby not found');
      }

      if (data.status !== 'waiting') {
        throw new Error('Lobby is not accepting players');
      }

      // Add player to lobby with maxEnergy from lobby settings
      const maxEnergy = data.max_energy || 1000;
      const updatedPlayers = [
        ...(data.players || []),
        {
          name: playerName,
          energy: maxEnergy,
          cypher_stones: 0,
          position: 0,
          is_host: false,
          is_active: true,
        },
      ];

      const { error: updateError } = await supabase
        .from('lobbies')
        .update({ players: updatedPlayers })
        .eq('lobby_id', lobbyIdInput);

      if (updateError) throw updateError;

      setLobbyId(lobbyIdInput);
      setIsHost(false);
      router.push(`/lobby/${lobbyIdInput}`);
    } catch (error) {
      console.error('Error joining lobby:', error);
      setError(t.invalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full gaming-card p-6 shadow-2xl transition-all relative overflow-hidden hover:neon-glow-purple"
      style={{
        borderRadius: '20px',
      }}
    >
      {/* Neon glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 relative z-10 neon-text-purple">
            {t.button}
          </h3>
          <p className="text-gray-400 text-sm relative z-10">
            {language === 'en' ? 'Enter lobby ID to join' : 'Katılmak için lobi ID girin'}
          </p>
        </div>
        <div className="text-3xl">🔗</div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={lobbyIdInput}
            onChange={(e) => {
              setLobbyIdInput(e.target.value);
              setError('');
            }}
            placeholder={t.placeholder}
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-neon-purple/50 focus:border-neon-pink focus:neon-glow-pink focus:outline-none text-lg text-center tracking-widest text-black placeholder-gray-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQRScanner(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-bold rounded-lg shadow-lg neon-glow-blue"
            title={language === 'en' ? 'Scan QR Code' : 'QR Kod Tara'}
          >
            📷
          </motion.button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoinLobby}
          disabled={loading}
          className="w-full bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-white font-bold py-3 rounded-lg text-lg shadow-lg neon-glow-purple disabled:opacity-50"
        >
          {loading ? t.joining : t.button}
        </motion.button>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <QRCodeScanner
            onScanSuccess={async (decodedText) => {
              setLobbyIdInput(decodedText);
              setShowQRScanner(false);
              // Auto-join after scanning
              setError('');
              setLoading(true);
              try {
                const { isSupabaseConfigured } = await import('@/lib/supabase');
                
                if (!isSupabaseConfigured) {
                  setLobbyId(decodedText);
                  setIsHost(false);
                  router.push(`/lobby/${decodedText}`);
                  return;
                }

                const { supabase } = await import('@/lib/supabase');
                const { data, error: fetchError } = await supabase
                  .from('lobbies')
                  .select('*')
                  .eq('lobby_id', decodedText)
                  .single();

                if (fetchError || !data) {
                  throw new Error('Lobby not found');
                }

                if (data.status !== 'waiting') {
                  throw new Error('Lobby is not accepting players');
                }

                const maxEnergy = data.max_energy || 1000;
                const updatedPlayers = [
                  ...(data.players || []),
                  {
                    name: playerName,
                    energy: maxEnergy,
                    cypher_stones: 0,
                    position: 0,
                    is_host: false,
                    is_active: true,
                  },
                ];

                const { error: updateError } = await supabase
                  .from('lobbies')
                  .update({ players: updatedPlayers })
                  .eq('lobby_id', decodedText);

                if (updateError) throw updateError;

                setLobbyId(decodedText);
                setIsHost(false);
                router.push(`/lobby/${decodedText}`);
              } catch (error) {
                console.error('Error joining lobby:', error);
                setError(t.invalid);
              } finally {
                setLoading(false);
              }
            }}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}



