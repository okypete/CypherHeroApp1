'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { supabase, Player } from '@/lib/supabase';
import LobbyScreen from '@/components/LobbyScreen';

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const { lobbyId, setLobbyId, playerName } = useGameStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      setLobbyId(params.id as string);
    }
  }, [params.id, setLobbyId]);

  if (!playerName) {
    router.push('/');
    return null;
  }

  return <LobbyScreen />;
}




