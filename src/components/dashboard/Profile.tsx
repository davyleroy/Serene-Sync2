import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          {user?.name}
        </h1>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-gray-600">
            <Mail className="h-5 w-5 text-purple-600" />
            <span>Email associated with your account</span>
          </div>

          <div className="flex items-center space-x-4 text-gray-600">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Member since {new Date(user?.created_at || '').toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Posts Shared</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Mood Entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};