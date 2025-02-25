import React from "react";
import {
  User,
  Settings,
  LogOut,
  MessageCircle,
  Users,
  Stethoscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const DashboardNav = () => {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-30 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/dashboard"
              className="text-xl font-semibold text-purple-600 flex items-center"
            >
              Serene Sync
              {user?.is_doctor && (
                <Stethoscope className="h-5 w-5 text-purple-500 ml-2" />
              )}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard/messages"
              className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group relative"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Messages
              </span>
            </Link>
            {user?.is_doctor && (
              <Link
                to="/dashboard/patients"
                className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group relative"
              >
                <Users className="h-6 w-6" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Patients
                </span>
              </Link>
            )}
            <Link
              to="/dashboard/profile"
              className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group relative"
            >
              <User className="h-6 w-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Profile
              </span>
            </Link>
            <Link
              to="/dashboard/settings"
              className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group relative"
            >
              <Settings className="h-6 w-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Settings
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group relative"
            >
              <LogOut className="h-6 w-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
