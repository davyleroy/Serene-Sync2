import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../supabase-client';

export function useSupabaseRealtime<T>(
  channel: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  table: string,
  callback: (payload: T) => void
) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const sub = supabase.channel(channel)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        (payload) => callback(payload.new as T)
      )
      .subscribe();

    setSubscription(sub);

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [channel, event, table, callback]);

  return subscription;
}