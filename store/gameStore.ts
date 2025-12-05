import { create } from 'zustand';
import { Player } from '@/lib/supabase';

interface GameState {
  // Player info
  playerName: string;
  setPlayerName: (name: string) => void;
  
  // Lobby
  lobbyId: string | null;
  setLobbyId: (id: string | null) => void;
  isHost: boolean;
  setIsHost: (host: boolean) => void;
  
  // Players
  players: Player[];
  setPlayers: (players: Player[]) => void;
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  
  // Game state
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  
  // Player position
  playerPosition: number;
  setPlayerPosition: (position: number) => void;
  
  // Energy and stones
  energy: number;
  setEnergy: (energy: number) => void;
  cypherStones: number;
  setCypherStones: (stones: number) => void;
  
  // Saved cards (cards player keeps for later use)
  savedCards: Array<{ type: 'chance' | 'trap'; card: any }>;
  addSavedCard: (type: 'chance' | 'trap', card: any) => void;
  removeSavedCard: (index: number) => void;
  
  // Game settings
  maxPlayers: number;
  maxRounds: number;
  maxEnergy: number;
  setGameSettings: (settings: { maxPlayers?: number; maxRounds?: number; maxEnergy?: number }) => void;
  
  // Cypher state
  inCypher: boolean;
  cypherRoundsRemaining: number;
  cypherEntryGate: number | null; // Position of the gate player entered from
  setInCypher: (inCypher: boolean, rounds?: number, entryGate?: number | null) => void;
  
  // Round tracking
  currentRound: number;
  setCurrentRound: (round: number) => void;
  
  // Turn system (deprecated - kept for compatibility)
  currentPlayerIndex: number; // Index of player whose turn it is
  setCurrentPlayerIndex: (index: number) => void;
  
  // Game end
  gameFinished: boolean;
  setGameFinished: (finished: boolean) => void;
  
  // Language
  language: 'en' | 'tr';
  setLanguage: (lang: 'en' | 'tr') => void;
  
  // Active tab
  activeTab: 'board' | 'dice' | 'timer' | 'cards' | 'cypher' | 'inventory' | 'management';
  setActiveTab: (tab: 'board' | 'dice' | 'timer' | 'cards' | 'cypher' | 'inventory' | 'management') => void;
  
  // Pending effects (effects that trigger when landing on specific squares)
  pendingEffects: Array<{
    squareName: string; // Square name to trigger on (e.g., 'Footwork', 'Bounce')
    effect: {
      type: 'energy_penalty' | 'energy_bonus' | 'no_energy' | 'auto_complete' | 'fail_task';
      value?: number; // For energy changes
    };
    cardTitle: string; // Card that created this effect
  }>;
  addPendingEffect: (effect: {
    squareName: string;
    effect: {
      type: 'energy_penalty' | 'energy_bonus' | 'no_energy' | 'auto_complete' | 'fail_task';
      value?: number;
    };
    cardTitle: string;
  }) => void;
  removePendingEffect: (index: number) => void;
  clearPendingEffects: () => void;
  
  // Battle state (for Cypher Gate battles)
  battleState: {
    isActive: boolean;
    player1: string | null; // Player already in Cypher
    player2: string | null; // Player trying to enter
    votes: Record<string, string>; // { voterName: votedPlayerName }
    flowCard1: any | null; // Flow card for player 1
    flowCard2: any | null; // Flow card for player 2
  } | null;
  setBattleState: (battle: {
    isActive: boolean;
    player1: string | null;
    player2: string | null;
    votes: Record<string, string>;
    flowCard1: any | null;
    flowCard2: any | null;
  } | null) => void;
  addBattleVote: (voterName: string, votedPlayerName: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Player info
  playerName: '',
  setPlayerName: (name) => {
    set({ playerName: name });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('playerName', name);
    }
  },
  
  // Lobby
  lobbyId: null,
  setLobbyId: (id) => set({ lobbyId: id }),
  isHost: false,
  setIsHost: (host) => set({ isHost: host }),
  
  // Players
  players: [],
  setPlayers: (players) => set({ players }),
  currentPlayer: null,
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  
  // Game state
  gameStarted: false,
  setGameStarted: (started) => set({ gameStarted: started }),
  
  // Player position
  playerPosition: 0,
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  // Energy and stones
  energy: 500,
  setEnergy: (energy) => set({ energy }),
  cypherStones: 0,
  setCypherStones: (stones) => set({ cypherStones: stones }),
  
  // Saved cards
  savedCards: [],
  addSavedCard: (type, card) => set((state) => ({
    savedCards: [...state.savedCards, { type, card }],
  })),
  removeSavedCard: (index) => set((state) => ({
    savedCards: state.savedCards.filter((_, i) => i !== index),
  })),
  
  // Game settings
  maxPlayers: 4,
  maxRounds: 10,
  maxEnergy: 1000,
  setGameSettings: (settings) => set((state) => ({
    maxPlayers: settings.maxPlayers ?? state.maxPlayers,
    maxRounds: settings.maxRounds ?? state.maxRounds,
    maxEnergy: settings.maxEnergy ?? state.maxEnergy,
  })),
  
  // Cypher state
  inCypher: false,
  cypherRoundsRemaining: 0,
  cypherEntryGate: null,
  setInCypher: (inCypher, rounds = 0, entryGate = null) => set({ 
    inCypher, 
    cypherRoundsRemaining: rounds,
    cypherEntryGate: entryGate,
  }),
  
  // Round tracking
  currentRound: 1,
  setCurrentRound: (round) => set({ currentRound: round }),
  
  // Turn system (deprecated - kept for compatibility)
  currentPlayerIndex: 0,
  setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
  
  // Game end
  gameFinished: false,
  setGameFinished: (finished) => set({ gameFinished: finished }),
  
  // Language
  language: 'en',
  setLanguage: (lang) => {
    set({ language: lang });
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  },
  
  // Active tab
  activeTab: 'board',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Pending effects
  pendingEffects: [],
  addPendingEffect: (effect) => set((state) => ({
    pendingEffects: [...state.pendingEffects, effect],
  })),
  removePendingEffect: (index) => set((state) => ({
    pendingEffects: state.pendingEffects.filter((_, i) => i !== index),
  })),
  clearPendingEffects: () => set({ pendingEffects: [] }),
  
  // Battle state
  battleState: null,
  setBattleState: (battle) => set({ battleState: battle }),
  addBattleVote: (voterName, votedPlayerName) => set((state) => {
    if (!state.battleState) return state;
    return {
      battleState: {
        ...state.battleState,
        votes: {
          ...state.battleState.votes,
          [voterName]: votedPlayerName,
        },
      },
    };
  }),
}));

// Initialize from storage
if (typeof window !== 'undefined') {
  const storedName = sessionStorage.getItem('playerName');
  const storedLang = localStorage.getItem('language') as 'en' | 'tr' | null;
  
  if (storedName) {
    useGameStore.getState().setPlayerName(storedName);
  }
  
  if (storedLang && (storedLang === 'en' || storedLang === 'tr')) {
    useGameStore.getState().setLanguage(storedLang);
  }
}



