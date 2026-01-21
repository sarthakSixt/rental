import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Car, PriceCalculation, BookingRequest } from '../types';

/**
 * Review Page - Dark Theme with Animations
 */
const Review: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const car = location.state?.car as Car | undefined;
  const durationMonths = location.state?.durationMonths as number | undefined;
  const kmPackage = location.state?.kmPackage as number | undefined;
  const priceCalculation = location.state?.priceCalculation as PriceCalculation | undefined;

  const [startDate, setStartDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/review', ...location.state } });
      return;
    }

    if (!car || !durationMonths || !kmPackage || !priceCalculation) {
      navigate('/cars');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  }, [car, durationMonths, kmPackage, priceCalculation, isAuthenticated, navigate, location]);

  const handlePayment = async (mockSuccess: boolean) => {
    if (!user || !car || !durationMonths || !kmPackage || !priceCalculation || !startDate) {
      setError('Please fill in all details');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const bookingData: BookingRequest = {
        userId: user.id,
        carId: car.id,
        categoryId: car.category.id,
        durationMonths,
        kmPackage,
        startDate,
      };

      console.log('Creating booking with data:', bookingData);
      console.log('JWT Token:', apiService.getToken() ? 'Present' : 'Missing');

      const bookingResponse = await apiService.createBooking(bookingData);

      console.log('Booking response:', bookingResponse);

      if (!bookingResponse.success || !bookingResponse.data) {
        const errorMsg = bookingResponse.message || 'Failed to create booking';
        console.error('Booking creation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      const bookingId = bookingResponse.data.id;
      console.log('Booking created successfully with ID:', bookingId);

      console.log('Processing payment for booking:', bookingId);
      const paymentResponse = await apiService.processPayment({
        bookingId,
        mockSuccess,
      });

      console.log('Payment response:', paymentResponse);

      if (paymentResponse.success && paymentResponse.data) {
        console.log('Payment processed successfully');
        navigate('/confirmation', {
          state: {
            success: mockSuccess,
            booking: bookingResponse.data,
            payment: paymentResponse.data,
            car,
            priceCalculation,
          },
        });
      } else {
        const errorMsg = paymentResponse.message || 'Payment failed';
        console.error('Payment processing failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error in handlePayment:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      
      if (err.response) {
        console.error('API Error Response:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || !user || !car || !priceCalculation) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate('/configure', { state: { car, durationMonths, kmPackage, priceCalculation } })}
        className="mb-6 text-primary-400 hover:text-primary-300 flex items-center group transition-all duration-300 animate-slide-down"
      >
        <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span>
        <span className="ml-2">Back to Configuration</span>
      </button>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
            }}></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 animate-slide-down">Review & Confirm</h1>
            <p className="text-primary-100 text-lg">Please review your details and confirm your booking</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* User Details */}
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center">
              <span className="mr-3">👤</span>
              Your Details
            </h2>
            <div className="glass rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-dark-muted mb-1">Full Name</p>
                  <p className="font-semibold text-dark-text text-lg">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-muted mb-1">Email</p>
                  <p className="font-semibold text-dark-text text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-dark-muted mb-1">Phone Number</p>
                  <p className="font-semibold text-dark-text text-lg">
                    {user.phoneNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center">
              <span className="mr-3">🚗</span>
              Car Details
            </h2>
            <div className="glass rounded-xl p-6">
              <div className="flex items-center space-x-6">
                <div className="h-28 w-40 bg-dark-card rounded-xl flex items-center justify-center border-2 border-dark-border">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="h-full w-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x112?text=No+Image';
                      }}
                    />
                  ) : (
                    <span className="text-5xl">🚗</span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-text mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-dark-muted text-lg">{car.category.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Configuration */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center">
              <span className="mr-3">📅</span>
              Rental Configuration
            </h2>
            <div className="glass rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-2">
                  Rental Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  required
                  className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-dark-muted">Duration</p>
                  <p className="font-semibold text-dark-text text-lg">
                    {durationMonths} month{durationMonths && durationMonths > 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-muted">KM Package</p>
                  <p className="font-semibold text-dark-text text-lg">
                    {kmPackage?.toLocaleString()} km/month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center">
              <span className="mr-3">💰</span>
              Price Summary
            </h2>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 rounded-xl p-8 glow-hover">
              <div className="space-y-4">
                <div className="flex justify-between text-dark-text">
                  <span>Price per month:</span>
                  <span className="font-semibold text-lg">
                    ₹{priceCalculation.pricePerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-dark-text">
                  <span>Duration:</span>
                  <span className="font-semibold">
                    {priceCalculation.durationMonths} month{priceCalculation.durationMonths > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between text-dark-text">
                  <span>KM Package:</span>
                  <span className="font-semibold">
                    {priceCalculation.kmPackage.toLocaleString()} km/month
                  </span>
                </div>
                <div className="border-t border-green-500/30 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-dark-text">Total Amount:</span>
                    <span className="text-4xl font-bold gradient-text">
                      ₹{priceCalculation.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl animate-slide-down">
              {error}
            </div>
          )}

          {/* Payment Note */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-yellow-400">
              <strong>Note:</strong> This is a demo application. You can test both success and failure payment scenarios.
            </p>
          </div>

          {/* Payment Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => navigate('/configure', { state: { car, durationMonths, kmPackage, priceCalculation } })}
              disabled={isProcessing}
              className="px-6 py-3 glass border-2 border-dark-border text-dark-text rounded-xl font-semibold hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={() => handlePayment(false)}
              disabled={isProcessing || !startDate}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/50 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Test Payment Failure'}
            </button>
            <button
              onClick={() => handlePayment(true)}
              disabled={isProcessing || !startDate}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-green-500/50 glow-hover disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                  Processing...
                </span>
              ) : (
                'Confirm & Pay'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
