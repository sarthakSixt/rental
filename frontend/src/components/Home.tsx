import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Component - Dark Theme with Animations
 */
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <div className="mb-6 animate-bounce-slow">
            <span className="text-8xl">🚗</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-slide-up">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-dark-text">Car Rental</span>
          </h1>
          <p className="text-xl md:text-2xl text-dark-muted mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Find your perfect car subscription plan. Flexible durations, competitive pricing,
            and a wide selection of vehicles to choose from.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/cars"
              className="group relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-primary-500/50 glow-hover overflow-hidden"
            >
              <span className="relative z-10">Browse Cars</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/signup"
              className="group glass text-primary-400 hover:text-primary-300 border-2 border-primary-500/50 hover:border-primary-400 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
            >
              Get Started →
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="group glass rounded-2xl p-8 text-center card-hover hover:border-primary-500/50">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🚗</div>
            <h3 className="text-2xl font-bold text-dark-text mb-4">
              Wide Selection
            </h3>
            <p className="text-dark-muted leading-relaxed">
              Choose from sedans, SUVs, and luxury vehicles
            </p>
          </div>
          
          <div className="group glass rounded-2xl p-8 text-center card-hover hover:border-primary-500/50" style={{ animationDelay: '0.1s' }}>
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💰</div>
            <h3 className="text-2xl font-bold text-dark-text mb-4">
              Flexible Pricing
            </h3>
            <p className="text-dark-muted leading-relaxed">
              Multiple duration and KM package options
            </p>
          </div>
          
          <div className="group glass rounded-2xl p-8 text-center card-hover hover:border-primary-500/50" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-2xl font-bold text-dark-text mb-4">
              Easy Booking
            </h3>
            <p className="text-dark-muted leading-relaxed">
              Quick and simple booking process
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
