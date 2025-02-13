import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase-client';

const moods = [
  { id: '1', name: 'Admiration', emoji: '🤩' },
  { id: '2', name: 'Adoration', emoji: '😍' },
  { id: '3', name: 'Aesthetic appreciation', emoji: '🎨' },
  { id: '4', name: 'Amusement', emoji: '😄' },
  { id: '5', name: 'Anxiety', emoji: '😰' },
  { id: '6', name: 'Awe', emoji: '😲' },
  { id: '7', name: 'Awkwardness', emoji: '😅' },
  { id: '8', name: 'Boredom', emoji: '😑' },
  { id: '9', name: 'Calmness', emoji: '😌' },
  { id: '10', name: 'Confusion', emoji: '😕' },
  { id: '11', name: 'Craving', emoji: '🤤' },
  { id: '12', name: 'Disgust', emoji: '🤢' },
  { id: '13', name: 'Empathetic pain', emoji: '💔' },
  { id: '14', name: 'Entrancement', emoji: '🌟' },
  { id: '15', name: 'Envy', emoji: '😒' },
  { id: '16', name: 'Excitement', emoji: '🤗' },
  { id: '17', name: 'Fear', emoji: '😨' },
  { id: '18', name: 'Horror', emoji: '😱' },
  { id: '19', name: 'Interest', emoji: '🤔' },
  { id: '20', name: 'Joy', emoji: '😊' },
  { id: '21', name: 'Nostalgia', emoji: '🥹' },
  { id: '22', name: 'Romance', emoji: '💝' },
  { id: '23', name: 'Sadness', emoji: '😢' },
  { id: '24', name: 'Satisfaction', emoji: '😊' },
  { id: '25', name: 'Sexual desire', emoji: '💖' },
  { id: '26', name: 'Sympathy', emoji: '🫂' },
  { id: '27', name: 'Triumph', emoji: '🏆' }
];

export const MoodSlider = () => {
  const [selectedIndex, setSelectedIndex] = useState(13); // Default to middle mood
  const { setMood, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedIndex(parseInt(e.target.value, 10));
    },
    []
  );

  const handleSaveMood = async () => {
    const selectedMood = moods[selectedIndex];
    setMood(selectedMood);

    if (user) {
      await supabase.from('daily_moods').insert({
        user_id: user.id,
        mood_id: selectedMood.id,
        notes: '',
      });
    }

    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        How are you feeling today?
      </h2>
      <div className="space-y-6 flex flex-col gap-0">
        <div className="flex flex-col gap-4">
          <label htmlFor="moodSlider" className="sr-only">
            Select your mood
          </label>
          <input
            id="moodSlider"
            type="range"
            min="0"
            max="26"
            value={selectedIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600 rounded-lg appearance-none cursor-pointer"
            title="Mood Slider"
            aria-valuemin={0}
            aria-valuemax={26}
            aria-valuenow={selectedIndex}
            aria-valuetext={moods[selectedIndex].name}
            aria-label={`Mood: ${moods[selectedIndex].name}`}
          />
          <div className="text-center">
            <div className="text-4xl mb-2">{moods[selectedIndex].emoji}</div>
            <div className="text-purple-600 font-medium">
              {moods[selectedIndex].name}
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveMood}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Save Mood
        </button>
      </div>
    </div>
  );
};