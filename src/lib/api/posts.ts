import { supabase } from '../supabase-client';
import type { Database } from '../../types/supabase';

type Post = Database['public']['Tables']['posts']['Row'];

export async function createPost(content: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Post & { users: { name: string } })[];
}

export async function likePost(postId: string) {
  // In a real application, you'd have a separate likes table
  // For now, we'll just return a mock response
  return { success: true };
}