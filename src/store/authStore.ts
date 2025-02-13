import { create } from 'zustand';
import { supabase } from '../lib/supabase-client';
import type { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Mood = { id: string; name: string; emoji: string };

interface AuthState {
  user: User | null;
  currentMood: Mood | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setMood: (mood: Mood | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isDoctor: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentMood: null,
  loading: true,
  error: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setMood: (mood) => set({ currentMood: mood }),
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) throw signInError;
      if (!authData.user) throw new Error('No user returned from sign in');

      // Fetch the user profile after successful authentication
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      set({ user: userData });
      
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password, name, isDoctor) => {
    try {
      set({ loading: true, error: null });
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned from sign up');

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name,
          is_doctor: isDoctor,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      set({ user: userData });
      
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, currentMood: null });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));