import React, { useState, useEffect } from "react";
import { Bell, Shield, Moon } from "lucide-react";

export const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`max-w-4xl mx-auto p-6 ${
        darkMode ? "text-gray-50" : "text-gray-900"
      }`}
    >
      <div
        className={`bg-white ${
          darkMode ? "dark:bg-black" : ""
        } rounded-xl shadow-md p-8`}
      >
        <h1
          className={`text-2xl font-bold mb-8 ${
            darkMode ? "text-gray-50" : "text-gray-900"
          }`}
        >
          Settings
        </h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-purple-600" />
              <div>
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? "text-gray-50" : "text-gray-900"
                  }`}
                >
                  Notifications
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-50" : "text-gray-500"
                  }`}
                >
                  Receive updates about activity
                </p>
              </div>
            </div>
            <button
              title="Toggle notifications"
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5 text-purple-600" />
              <div>
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? "text-gray-50" : "text-gray-900"
                  }`}
                >
                  Dark Mode
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-50" : "text-gray-500"
                  }`}
                >
                  Toggle dark theme
                </p>
              </div>
            </div>
            <button
              title="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? "text-gray-50" : "text-gray-900"
                  }`}
                >
                  Privacy Mode
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-50" : "text-gray-500"
                  }`}
                >
                  Hide your activity from others
                </p>
              </div>
            </div>
            <button
              title="Toggle privacy mode"
              onClick={() => setPrivacy(!privacy)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2
              className={`text-xl font-semibold mb-4 ${
                darkMode ? "text-gray-50" : "text-gray-900"
              }`}
            >
              Account
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-300 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
