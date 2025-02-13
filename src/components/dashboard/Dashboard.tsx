import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardNav } from './DashboardNav';
import { MoodSlider } from './MoodSlider';
import { SocialFeed } from './SocialFeed';
import { Profile } from './Profile';
import { Settings } from './Settings';
import { Messages } from './Messages';
import { Patients } from './Patients';
import { useAuthStore } from '../../store/authStore';

export const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-8">
                <MoodSlider />
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Your Community Feed
                  </h2>
                  <SocialFeed />
                </div>
              </div>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          {user?.is_doctor && <Route path="/patients" element={<Patients />} />}
        </Routes>
      </div>
    </div>
  );
};