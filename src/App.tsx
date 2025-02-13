import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Contact } from './components/Contact';
import { Dashboard } from './components/dashboard/Dashboard';
import { MoodSlider } from './components/dashboard/MoodSlider';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/mood"
            element={user ? <MoodSlider /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/*"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;