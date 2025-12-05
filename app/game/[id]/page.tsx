'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import GameScreen from '@/components/GameScreen';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { lobbyId, setLobbyId, playerName, gameStarted, setGameStarted, setGameSettings, setEnergy, setPlayers } = useGameStore();
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (params.id) {
      setLobbyId(params.id as string);
    }
  }, [params.id, setLobbyId]);

  useEffect(() => {
    if (!playerName) {
      router.push('/');
      return;
    }

    // Check game status from Supabase
    const checkGameStatus = async () => {
      if (!lobbyId || !isSupabaseConfigured) {
        setCheckingStatus(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('lobbies')
          .select('status, max_energy, players')
          .eq('lobby_id', lobbyId)
          .single();

        if (data) {
          // Update game settings
          if (data.max_energy) {
            setGameSettings({ maxEnergy: data.max_energy });
          }
          
          // Update players and current player's energy
          if (data.players && Array.isArray(data.players)) {
            setPlayers(data.players);
            const currentPlayer = data.players.find((p: any) => p.name === playerName);
            if (currentPlayer) {
              setEnergy(currentPlayer.energy || data.max_energy || 1000);
            }
          }
          
          if (data.status === 'playing') {
            setGameStarted(true);
          } else {
            // Game hasn't started yet, redirect to lobby
            router.push(`/lobby/${lobbyId}`);
            return;
          }
        } else if (error) {
          console.error('Error checking game status:', error);
          // If error, redirect to lobby
          router.push(`/lobby/${lobbyId}`);
          return;
        }
      } catch (error) {
        console.error('Error checking game status:', error);
        router.push(`/lobby/${lobbyId}`);
        return;
      } finally {
        setCheckingStatus(false);
      }
    };

    if (lobbyId) {
      checkGameStatus();
    }
  }, [lobbyId, playerName, router, setGameStarted, setGameSettings, setEnergy, setPlayers]);

  if (!playerName) {
    return null;
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return null;
  }

  return <GameScreen />;
}



