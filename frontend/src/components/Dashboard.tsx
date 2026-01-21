import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';

/**
 * Dashboard Component - Dark Theme with Animations
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.bookingSuccess) {
      loadBookings();
    }
  }, [location]);

  const loadBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiService.getUserBookings(user.id);
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err: any) {
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await apiService.cancelBooking(bookingId);
      if (response.success) {
        loadBookings();
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-dark-card text-dark-text border-dark-border';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-dark-muted text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-slide-down">My Bookings</h1>
        <p className="text-dark-muted text-lg">
          Welcome back, <span className="text-primary-400 font-semibold">{user?.firstName}</span>!
        </p>
      </div>

      {location.state?.bookingSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl mb-6 animate-slide-down glow-hover">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <span>Booking created and payment processed successfully!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6 animate-slide-down">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center animate-scale-in">
          <div className="text-8xl mb-6 animate-bounce-slow">📋</div>
          <p className="text-dark-muted text-xl mb-6">You don't have any bookings yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/50 glow-hover"
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div
              key={booking.id}
              className="glass rounded-2xl p-8 card-hover hover:border-primary-500/50 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-dark-text mb-2">
                    Booking #{booking.id}
                  </h3>
                  <p className="text-sm text-dark-muted">
                    Created: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 text-sm rounded-lg font-semibold border ${
                    getStatusColor(booking.status)
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-dark-muted mb-1">Duration</p>
                  <p className="font-bold text-dark-text text-lg">{booking.durationMonths} months</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-dark-muted mb-1">KM Package</p>
                  <p className="font-bold text-dark-text text-lg">{booking.kmPackage} km/month</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-dark-muted mb-1">Price per Month</p>
                  <p className="font-bold text-dark-text text-lg">₹{booking.pricePerMonth.toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-dark-muted mb-1">Start Date</p>
                  <p className="font-bold text-dark-text text-lg">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-dark-muted mb-1">End Date</p>
                  <p className="font-bold text-dark-text text-lg">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="glass rounded-xl p-4 bg-gradient-to-br from-primary-600/20 to-primary-700/20 border-2 border-primary-500/50">
                  <p className="text-sm text-dark-muted mb-1">Total Amount</p>
                  <p className="font-bold gradient-text text-2xl">
                    ₹{booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                <div className="flex justify-end pt-4 border-t border-dark-border">
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/50"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
