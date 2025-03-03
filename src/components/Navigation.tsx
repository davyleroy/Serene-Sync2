import React, { useState } from "react";
import { Menu, X, Heart, Stethoscope, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const isDashboardView = location.pathname.startsWith("/dashboard");
  const isMoodPage = location.pathname === "/mood";

  return (
    <nav
      className={`${
        isDashboardView || isMoodPage
          ? "bg-transparent"
          : "bg-white/50 dark:bg-gray-700"
      } backdrop-blur-md fixed w-full z-20 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                Serene Sync
              </span>
              {user?.is_doctor && (
                <Stethoscope className="h-5 w-5 text-purple-500 ml-2" />
              )}
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-white hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                Contact Us
              </Link>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : null}
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-white hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-700 shadow-lg">
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-white hover:text-purple-600 hover:bg-purple-50"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-white hover:text-purple-600 hover:bg-purple-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : null}
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
      </div>
    </nav>
  );
};
