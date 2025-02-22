/*
  # Initial Schema Setup for Mental Health Platform

  1. Tables
    - users (extends auth.users)
      - name
      - email
      - is_doctor
    - posts
      - content
      - user_id
      - flagged
    - messages
      - sender_id
      - receiver_id
      - content
      - read
    - daily_moods
      - user_id
      - mood_id
      - date
      - notes
    - moods (predefined list)
      - name
      - description

  2. Security
    - RLS enabled on all tables
    - Policies for user access
    - Special policies for doctor access
*/

-- Create tables
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  is_doctor boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) NOT NULL,
  content text NOT NULL,
  flagged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES public.users(id) NOT NULL,
  receiver_id uuid REFERENCES public.users(id) NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text
);

CREATE TABLE public.daily_moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) NOT NULL,
  mood_id uuid REFERENCES public.moods(id) NOT NULL,
  date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_moods ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can read all posts"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update flagged status"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_doctor = true
  ));

CREATE POLICY "Users can read and write their messages"
  ON public.messages
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Everyone can read moods"
  ON public.moods
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their daily moods"
  ON public.daily_moods
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert predefined moods
INSERT INTO public.moods (name) VALUES
  ('Admiration'),
  ('Adoration'),
  ('Aesthetic appreciation'),
  ('Amusement'),
  ('Anxiety'),
  ('Awe'),
  ('Awkwardness'),
  ('Boredom'),
  ('Calmness'),
  ('Confusion'),
  ('Craving'),
  ('Disgust'),
  ('Empathetic pain'),
  ('Entrancement'),
  ('Envy'),
  ('Excitement'),
  ('Fear'),
  ('Horror'),
  ('Interest'),
  ('Joy'),
  ('Nostalgia'),
  ('Romance'),
  ('Sadness'),
  ('Satisfaction'),
  ('Sexual desire'),
  ('Sympathy'),
  ('Triumph');