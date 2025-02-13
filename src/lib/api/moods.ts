import { supabase } from '../supabase-client';
import type { Database } from '../../types/supabase';

type DailyMood = Database['public']['Tables']['daily_moods']['Row'];

export async function recordMood(moodId: string, notes?: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_moods')
    .insert({
      user_id: user.user.id,
      mood_id: moodId,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMoodHistory() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_moods')
    .select(`
      *,
      moods (
        name
      )
    `)
    .eq('user_id', user.user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as (DailyMood & { moods: { name: string } })[];
}