import { create } from "zustand";
import { supabase } from "../lib/supabase-client";
import type { Database } from "../types/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];
type Mood = { id: string; name: string; emoji: string };

interface AuthState {
  user: User | null;
  currentMood: Mood | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setMood: (mood: Mood | null) => void;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    isDoctor: boolean
  ) => Promise<{ user: User | null; error: Error | null }>;
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const user = data.user
      ? { ...data.user, name: data.user.user_metadata.name, is_doctor: false }
      : null;
    set({ user });
    return { user, error };
  },
  signUp: async (email, password, name, isDoctor) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, isDoctor } },
    });
    const user = data.user ? { ...data.user, name, is_doctor: isDoctor } : null;
    set({ user });
    return { user, error };
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, currentMood: null });
  },
}));
