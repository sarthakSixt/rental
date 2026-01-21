import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Car, PriceCalculation, Booking, Payment } from '../types';

/**
 * Confirmation Page - Dark Theme with Animations
 */
const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const success = location.state?.success as boolean | undefined;
  const booking = location.state?.booking as Booking | undefined;
  const payment = location.state?.payment as Payment | undefined;
  const car = location.state?.car as Car | undefined;
  const priceCalculation = location.state?.priceCalculation as PriceCalculation | undefined;

  if (success === undefined) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slow ${
          success ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slow ${
          success ? 'bg-emerald-500/20' : 'bg-rose-500/20'
        }`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-3xl w-full relative z-10 animate-scale-in">
        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className={`p-10 text-center relative overflow-hidden ${
              success
                ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600'
            } text-white`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
              }}></div>
            </div>
            <div className="relative z-10">
              <div className="text-8xl mb-6 animate-bounce-slow">
                {success ? '✅' : '❌'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
                {success ? 'Booking Confirmed!' : 'Payment Failed'}
              </h1>
              <p className="text-xl opacity-90 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {success
                  ? 'Your car rental has been successfully booked'
                  : 'Unfortunately, your payment could not be processed'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            {success && booking && car && priceCalculation ? (
              <div className="space-y-8 animate-fade-in">
                {/* Booking ID */}
                <div className="glass rounded-xl p-6 text-center border-2 border-primary-500/50 glow-hover">
                  <p className="text-sm text-dark-muted mb-2">Booking Reference</p>
                  <p className="text-4xl font-bold gradient-text">#{booking.id}</p>
                </div>

                {/* Car Details */}
                <div className="border-t border-dark-border pt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
                    <span className="mr-3">🚗</span>
                    Car Details
                  </h2>
                  <div className="flex items-center space-x-6 glass rounded-xl p-6">
                    <div className="h-24 w-36 bg-dark-card rounded-xl flex items-center justify-center border-2 border-dark-border">
                      {car.imageUrl ? (
                        <img
                          src={car.imageUrl}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/144x96?text=No+Image';
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

                {/* Rental Period */}
                <div className="border-t border-dark-border pt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
                    <span className="mr-3">📅</span>
                    Rental Period
                  </h2>
                  <div className="grid grid-cols-2 gap-4 glass rounded-xl p-6">
                    <div>
                      <p className="text-sm text-dark-muted mb-2">Start Date</p>
                      <p className="font-bold text-dark-text text-lg">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-muted mb-2">End Date</p>
                      <p className="font-bold text-dark-text text-lg">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-muted mb-2">Duration</p>
                      <p className="font-bold text-dark-text text-lg">
                        {booking.durationMonths} month{booking.durationMonths > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-muted mb-2">KM Package</p>
                      <p className="font-bold text-dark-text text-lg">
                        {booking.kmPackage.toLocaleString()} km/month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                {payment && (
                  <div className="border-t border-dark-border pt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
                      <span className="mr-3">💳</span>
                      Payment Details
                    </h2>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 rounded-xl p-6 glow-hover">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-dark-text text-lg">Amount Paid</span>
                        <span className="text-3xl font-bold text-green-400">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-muted">Transaction ID</span>
                        <span className="text-dark-text font-mono">
                          {payment.transactionId || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-muted">Status</span>
                        <span className="px-3 py-1 bg-green-500/30 text-green-400 rounded-lg text-xs font-semibold border border-green-500/50">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="font-bold text-blue-400 mb-3 text-lg">What's Next?</h3>
                  <ul className="text-sm text-blue-300 space-y-2 list-disc list-inside">
                    <li>You will receive a confirmation email shortly</li>
                    <li>Pick up your car on the start date</li>
                    <li>View all your bookings in the dashboard</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-dark-muted text-lg mb-4">
                  {success
                    ? 'Your booking has been confirmed, but some details are missing.'
                    : 'Please try again or contact support if the issue persists.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-dark-border pt-8 mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-4 glass border-2 border-dark-border text-dark-text rounded-xl font-semibold hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Browse More Cars
              </button>
              {success && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/50 glow-hover"
                >
                  View My Bookings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
