'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import NavigationBar from './NavigationBar';
import EnergyHUD from './EnergyHUD';
import DiceView from './DiceView';
import TimerView from './TimerView';
import CardsView from './CardsView';
import InventoryView from './InventoryView';
import PlayerManagement from './PlayerManagement';
import BattleModal from './BattleModal';
import GameEndModal from './GameEndModal';
import CypherZoneView from './CypherZoneView';
import CypherFlowView from './CypherFlowView';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function GameScreen() {
  const { 
    activeTab, 
    playerPosition, 
    currentRound, 
    setCurrentRound, 
    lobbyId, 
    playerName, 
    players, 
    setPlayers, 
    energy,
    setEnergy, 
    cypherStones,
    setCypherStones, 
    battleState, 
    setBattleState,
    maxRounds,
    gameFinished,
    setGameFinished,
    inCypher,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    maxEnergy,
    setGameSettings,
    setGameStarted,
  } = useGameStore();
  const router = useRouter();
  const prevPositionRef = useRef(playerPosition);

  // Sync player data from Supabase in real-time
  useEffect(() => {
    if (!isSupabaseConfigured || !lobbyId) return;

    const channel = supabase
      .channel(`game-screen-${lobbyId}`)
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
            
            // Check if lobby was closed
            if (lobby.status === 'closed') {
              setGameStarted(false);
              router.push('/');
              return;
            }
            
            const playersList = lobby.players || [];
            
            // Check if players list is empty (host left and cleared players)
            if (playersList.length === 0) {
              setGameStarted(false);
              router.push('/');
              return;
            }
            
            setPlayers(playersList);
            
            // Check if current player was removed from lobby
            const currentPlayer = playersList.find((p: any) => p.name === playerName);
            if (!currentPlayer) {
              setGameStarted(false);
              router.push('/');
              return;
            }
            
            // Update game settings from lobby
            if (lobby.max_players || lobby.max_rounds || lobby.max_energy) {
              setGameSettings({
                maxPlayers: lobby.max_players,
                maxRounds: lobby.max_rounds,
                maxEnergy: lobby.max_energy,
              });
            }
            
            // Update battle state only if changed
            const newBattleState = lobby.battle_state || null;
            if (JSON.stringify(newBattleState) !== JSON.stringify(battleState)) {
              setBattleState(newBattleState);
            }
            
            // Update current player's energy and stones only if changed
            const newEnergy = currentPlayer.energy;
            const newStones = currentPlayer.cypher_stones || 0;
            // Only update if values changed to prevent unnecessary re-renders
            if (energy !== newEnergy) {
              setEnergy(newEnergy);
            }
            if (cypherStones !== newStones) {
              setCypherStones(newStones);
            }
            
            // Sync currentPlayerIndex from Supabase only if changed
            if (lobby.current_player_index !== undefined && lobby.current_player_index !== null) {
              const newIndex = lobby.current_player_index;
              if (newIndex !== currentPlayerIndex) {
                setCurrentPlayerIndex(newIndex);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerName, currentPlayerIndex, battleState, router, setBattleState, setCurrentPlayerIndex, setCypherStones, setEnergy, setGameSettings, setGameStarted, setPlayers, energy, cypherStones]);


  // Update round if completed a full loop (energy system removed)
  useEffect(() => {
    if (prevPositionRef.current !== playerPosition) {
      // Update round if completed a full loop
      if (playerPosition === 0 && prevPositionRef.current > 0) {
        const newRound = currentRound + 1;
        setCurrentRound(newRound);
        
        // Check if game should end
        if (newRound > maxRounds) {
          setGameFinished(true);
          
          // Update Supabase
          if (isSupabaseConfigured && lobbyId) {
            supabase
              .from('lobbies')
              .update({ status: 'finished' })
              .eq('lobby_id', lobbyId)
              .catch(console.error);
          }
        }
      }
      
      prevPositionRef.current = playerPosition;
    }
  }, [playerPosition, currentRound, setCurrentRound, maxRounds, setGameFinished, lobbyId]);


  const renderActiveView = useMemo(() => {
    // If in Cypher, show CypherZoneView
    if (inCypher) {
      return <CypherZoneView />;
    }
    
    switch (activeTab) {
      case 'dice':
        return <DiceView />;
      case 'timer':
        return <TimerView />;
      case 'cards':
        return <CardsView />;
      case 'cypher':
        return <CypherFlowView />;
      case 'inventory':
        return <InventoryView />;
      case 'management':
        return <PlayerManagement />;
      default:
        return <DiceView />;
    }
  }, [inCypher, activeTab]);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'transparent' }}>
      {/* Energy HUD */}
      <EnergyHUD />

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20 relative z-10">
        {renderActiveView}
      </div>

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Battle Modal */}
      {battleState && battleState.isActive && battleState.player1 && battleState.player2 && (
        <BattleModal
          player1={battleState.player1}
          player2={battleState.player2}
          onClose={() => {
            // Battle will be resolved automatically
          }}
        />
      )}

      {/* Game End Modal */}
      <GameEndModal />
    </div>
  );
}

