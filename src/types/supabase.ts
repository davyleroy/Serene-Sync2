export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          is_doctor: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          is_doctor?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_doctor?: boolean
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          flagged?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      daily_moods: {
        Row: {
          id: string
          user_id: string
          mood_id: string
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_id: string
          date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_id?: string
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}