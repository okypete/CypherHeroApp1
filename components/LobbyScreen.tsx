'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { supabase, Player } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import QRCodeDisplay from './QRCodeDisplay';

export default function LobbyScreen() {
  const { lobbyId, isHost, playerName, setPlayers, setGameStarted, language, setCurrentPlayerIndex, setGameSettings } = useGameStore();
  const [players, setLocalPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  const translations = {
    en: {
      title: 'Game Lobby',
      lobbyId: 'Lobby ID',
      copy: 'Copy',
      copied: 'Copied!',
      qrCode: 'QR Code',
      players: 'Players',
      startGame: 'Start Game',
      startSolo: 'Start Solo Game',
      waiting: 'Loading...',
      leave: 'Leave Lobby',
      soloMode: 'Solo Mode',
    },
    tr: {
      title: 'Oyun Lobisi',
      lobbyId: 'Lobi ID',
      copy: 'Kopyala',
      copied: 'Kopyalandı!',
      qrCode: 'QR Kod',
      players: 'Oyuncular',
      startGame: 'Oyunu Başlat',
      startSolo: 'Tek Başına Başlat',
      waiting: 'Yükleniyor...',
      leave: 'Lobiden Ayrıl',
      soloMode: 'Tek Oyunculu Mod',
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (!lobbyId) return;

    let channel: any = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const setupLobby = async () => {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (!isSupabaseConfigured) {
        // For UI testing without Supabase, use mock data
        const mockPlayer = {
          name: playerName,
          energy: 500,
          cypher_stones: 0,
          position: 0,
          is_host: isHost,
          is_active: true,
        };
        setLocalPlayers([mockPlayer]);
        setPlayers([mockPlayer]);
        return;
      }

      // Initial fetch first
      const fetchLobby = async () => {
        const { data, error } = await supabase
          .from('lobbies')
          .select('*')
          .eq('lobby_id', lobbyId)
          .single();

        if (data) {
          const playersList = data.players || [];
          console.log('Initial players fetched:', playersList);
          setLocalPlayers(playersList);
          setPlayers(playersList);
          
          // Update game settings from lobby
          if (data.max_players || data.max_rounds || data.max_energy) {
            setGameSettings({
              maxPlayers: data.max_players,
              maxRounds: data.max_rounds,
              maxEnergy: data.max_energy,
            });
          }
          
          // Check if game has already started
          if (data.status === 'playing') {
            setGameStarted(true);
            router.push(`/game/${lobbyId}`);
            return;
          }
        } else if (error) {
          console.error('Error fetching lobby:', error);
        }
      };

      await fetchLobby();

      // Subscribe to lobby changes - listen for both INSERT and UPDATE
      channel = supabase
        .channel(`lobby-${lobbyId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'lobbies',
            filter: `lobby_id=eq.${lobbyId}`,
          },
          (payload) => {
            console.log('Lobby update received:', payload);
            if (payload.new) {
              const lobby = payload.new as any;
              const playersList = lobby.players || [];
              console.log('Updated players from subscription:', playersList);
              setLocalPlayers(playersList);
              setPlayers(playersList);
              
              // Check if game status changed to 'playing'
              if (lobby.status === 'playing') {
                console.log('Game started! Redirecting to game screen...');
                setGameStarted(true);
                router.push(`/game/${lobbyId}`);
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            // Re-fetch after subscription is confirmed
            fetchLobby();
          }
        });

      // Set up polling as backup to ensure we get updates
      pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from('lobbies')
          .select('players, status')
          .eq('lobby_id', lobbyId)
          .single();
        
        if (data) {
          // Check for player list changes
          if (data.players) {
            setLocalPlayers((prevPlayers) => {
              const currentPlayerCount = prevPlayers.length;
              const newPlayerCount = data.players.length;
              if (newPlayerCount !== currentPlayerCount || JSON.stringify(prevPlayers) !== JSON.stringify(data.players)) {
                console.log('Player list changed via polling, updating:', data.players);
                setPlayers(data.players);
                return data.players;
              }
              return prevPlayers;
            });
          }
          
          // Check if game status changed to 'playing'
          if (data.status === 'playing') {
            console.log('Game started via polling! Redirecting to game screen...');
            setGameStarted(true);
            router.push(`/game/${lobbyId}`);
            if (pollInterval) {
              clearInterval(pollInterval);
            }
          }
        }
      }, 2000); // Poll every 2 seconds as backup
    };

    setupLobby();

    return () => {
      if (channel) {
        import('@/lib/supabase').then(({ supabase }) => {
          supabase.removeChannel(channel);
        });
      }
      // Clear polling interval if it exists
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [lobbyId, setPlayers, playerName, isHost, setGameStarted, router, setGameSettings]);

  const handleCopyLobbyId = () => {
    if (lobbyId) {
      navigator.clipboard.writeText(lobbyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartGame = async () => {
    if (!lobbyId || !isHost) return;

    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    
    if (!isSupabaseConfigured) {
      // For UI testing without Supabase, just navigate to game
      setGameStarted(true);
      router.push(`/game/${lobbyId}`);
      return;
    }

    // Get lobby data to get maxEnergy and current players
    const { data: lobbyData, error: fetchError } = await supabase
      .from('lobbies')
      .select('max_energy, players')
      .eq('lobby_id', lobbyId)
      .single();

    if (fetchError || !lobbyData) {
      console.error('Error fetching lobby data:', fetchError);
      return;
    }

    const maxEnergy = lobbyData.max_energy || 1000;
    const currentPlayers = lobbyData.players || [];

    // Update all players' energy to maxEnergy
    const updatedPlayers = currentPlayers.map((player: any) => ({
      ...player,
      energy: maxEnergy, // Set all players to starting energy
    }));

    // Initialize currentPlayerIndex to 0 (first player)
    setCurrentPlayerIndex(0);
    
    const { error } = await supabase
      .from('lobbies')
      .update({ 
        status: 'playing',
        current_player_index: 0,
        players: updatedPlayers, // Update players with maxEnergy
      })
      .eq('lobby_id', lobbyId);

    if (!error) {
      setGameStarted(true);
      router.push(`/game/${lobbyId}`);
    }
  };

  const handleLeave = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <LanguageToggle />
      </div>

      {/* Lobby ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gaming-card p-6 shadow-2xl mb-6 border-2 border-neon-purple/50"
        style={{ borderRadius: '20px' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">{t.lobbyId}</p>
            <p className="text-4xl font-bold text-white tracking-widest neon-text-blue">
              {lobbyId}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLobbyId}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold rounded-lg shadow-lg neon-glow-purple"
          >
            {copied ? t.copied : t.copy}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQR(true)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange text-white font-bold rounded-lg shadow-lg neon-glow-blue"
          >
            📱 {t.qrCode}
          </motion.button>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      {showQR && lobbyId && (
        <QRCodeDisplay
          value={lobbyId}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Players List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6 flex-1"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.players}</h2>
        <div className="space-y-3">
          {players.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t.waiting}</p>
          ) : (
            players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-turquoise to-primary-orange flex items-center justify-center text-white font-bold text-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{player.name}</p>
                    {player.is_host && (
                      <p className="text-xs text-primary-orange">Host</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Energy</p>
                  <p className="font-bold text-primary-turquoise">
                    {player.energy}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isHost && (
          <>
            <motion.button
              whileHover={players.length >= 1 ? { scale: 1.02 } : {}}
              whileTap={players.length >= 1 ? { scale: 0.98 } : {}}
              onClick={handleStartGame}
              disabled={players.length === 0}
              className={`w-full text-white font-bold py-4 rounded-lg text-lg shadow-2xl ${
                players.length >= 1
                  ? 'bg-gradient-to-r from-primary-turquoise to-primary-orange cursor-pointer'
                  : 'bg-white/30 cursor-not-allowed opacity-50'
              }`}
            >
              {players.length === 0
                ? t.waiting
                : players.length === 1
                ? t.startSolo
                : t.startGame}
            </motion.button>
            {players.length === 1 && (
              <p className="text-center text-white/70 text-sm">
                {t.soloMode} - {language === 'en' ? 'You can start alone or wait for others' : 'Tek başına başlayabilir veya diğerlerini bekleyebilirsin'}
              </p>
            )}
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLeave}
          className="w-full bg-white/20 backdrop-blur-sm text-white font-bold py-4 rounded-lg text-lg"
        >
          {t.leave}
        </motion.button>
      </div>
    </div>
  );
}



