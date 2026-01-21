import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component - Dark Theme with Animations
 */
const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-surface/80 backdrop-blur-lg border-b border-dark-border sticky top-0 z-50 shadow-xl animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                🚗 CarRental
              </span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-dark-muted hover:text-primary-400 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300"
              >
                Browse Cars
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="border-transparent text-dark-muted hover:text-primary-400 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300"
                >
                  My Bookings
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 animate-fade-in">
                <span className="text-dark-muted text-sm hidden md:block">
                  Welcome, <span className="text-primary-400 font-semibold">{user?.firstName}</span>!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-dark-muted hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary-500/50 glow-hover"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
