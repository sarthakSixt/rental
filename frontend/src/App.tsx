import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CarList from './components/CarList';
import Configuration from './components/Configuration';
import Review from './components/Review';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';

/**
 * App Component - Main application component
 * 
 * Sets up:
 * 1. React Router for navigation
 * 2. AuthProvider for global authentication state
 * 3. Route definitions
 * 4. Protected routes (require authentication)
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg dark">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars" element={<CarList />} />
            
            {/* Booking Flow Routes */}
            <Route path="/configure" element={<Configuration />} />
            <Route
              path="/review"
              element={
                <ProtectedRoute>
                  <Review />
                </ProtectedRoute>
              }
            />
            <Route path="/confirmation" element={<Confirmation />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
