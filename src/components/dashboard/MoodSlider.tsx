import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase-client";

const moods = [
  { id: "0c201584-5002-4fbe-93c7-5dd880f66cda", name: "Envy", emoji: "😒" },
  { id: "10eda853-f311-4c38-a1d5-73c8e2d9f6c7", name: "Sadness", emoji: "😢" },
  {
    id: "146459cc-9fcb-424e-bb69-02165a2b1921",
    name: "Entrancement",
    emoji: "🌟",
  },
  { id: "19157e19-e80d-4ca8-97be-776a6d7ec797", name: "Fear", emoji: "😨" },
  {
    id: "1d04b2c6-d0fa-4816-b078-29e6e1bb1d6c",
    name: "Excitement",
    emoji: "🤗",
  },
  { id: "205b014f-2442-4c3f-8ee3-8c1a18b2c010", name: "Nostalgia", emoji: "🥹" },
  { id: "2ec9e382-5722-4911-b019-e10bf7f2c374", name: "Interest", emoji: "🤔" },
  { id: "302386fe-8029-422a-8693-6bbe1b0bf7ab", name: "Boredom", emoji: "😑" },
  { id: "35727e2f-e89c-45cc-859c-5b8ff727155f", name: "Romance", emoji: "💝" },
  { id: "3ac06a09-761d-4810-a357-563cec631fb7", name: "Craving", emoji: "🤤" },
  {
    id: "4ddd0dfd-cc92-4c52-80cf-a524496ff5ba",
    name: "Admiration",
    emoji: "🤩",
  },
  { id: "5f19aae7-ecc6-4d76-af5d-bf39e968303b", name: "Disgust", emoji: "🤢" },
  { id: "8a73b8bb-7f66-4fb4-93fe-927a234fae9e", name: "Anxiety", emoji: "😰" },
  {
    id: "a2075d1e-6050-40d4-ac1c-03b4ad98d983",
    name: "Amusement",
    emoji: "😄",
  },
  { id: "a6d2a478-927a-4c08-bc47-20f5258ee72a", name: "Joy", emoji: "😊" },
  {
    id: "acff6c1d-20c9-45be-aa9c-30e079ab5029",
    name: "Awkwardness",
    emoji: "😅",
  },
  {
    id: "b6ea9555-7a03-44c9-950d-acbd30d705fd",
    name: "Satisfaction",
    emoji: "😊",
  },
  {
    id: "baa95cca-0768-4e6f-84c7-838f2e18f076",
    name: "Aesthetic appreciation",
    emoji: "🎨",
  },
  {
    id: "babac918-83b2-4d4c-b046-bf7604a105e6",
    name: "Confusion",
    emoji: "😕",
  },
  {
    id: "be5139fa-7d5d-4474-a2ce-be8c2afdd180",
    name: "Sexual desire",
    emoji: "💖",
  },
  { id: "c7a9bcf4-da1d-4d97-9b68-2a3391339e62", name: "Sympathy", emoji: "🫂" },
  {
    id: "cdb8ca89-c02c-441b-bf8e-12b28888d8f0",
    name: "Empathetic pain",
    emoji: "💔",
  },
  {
    id: "d79b5a3b-5987-419e-a9eb-8005872d37ab",
    name: "Adoration",
    emoji: "😍",
  },
  { id: "da04488f-52ce-4c52-9937-6c2839cb5d8e", name: "Horror", emoji: "😱" },
  { id: "dfc45935-a240-455b-b658-e7ed2a73032f", name: "Calmness", emoji: "😌" },
  { id: "e210ef52-f332-4bd9-958b-46576d8dc035", name: "Triumph", emoji: "🏆" },
  { id: "fdf256da-21fa-48f4-b5d9-e61ecfc5ed19", name: "Awe", emoji: "😲" },
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
      const { error } = await supabase.from("daily_moods").insert({
        user_id: user.id,
        mood_id: selectedMood.id,
        notes: "",
      });

      if (error) {
        navigate("/dashboard");
      }
    }
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
            aria-valuemin="0"
            aria-valuemax="26"
            aria-valuenow={selectedIndex.toString()}
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
