export type Mood = {
  id: string;
  name: string;
  description?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  isDoctor: boolean;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  flagged: boolean;
};

export type DailyMood = {
  id: string;
  user_id: string;
  mood_id: string;
  date: string;
  notes?: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
};