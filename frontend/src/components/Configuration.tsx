import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Car, PriceCalculation } from '../types';

/**
 * Configuration Page - Dark Theme with Animations
 */
const Configuration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const car = location.state?.car as Car | undefined;

  const [durationMonths, setDurationMonths] = useState(1);
  const [kmPackage, setKmPackage] = useState(1000);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!car) {
      navigate('/cars');
      return;
    }
    calculatePrice();
  }, [durationMonths, kmPackage, car]);

  const calculatePrice = async () => {
    if (!car) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.calculatePrice(
        car.category.id,
        durationMonths,
        kmPackage
      );

      if (response.success && response.data) {
        setPriceCalculation(response.data);
      } else {
        setError(response.message || 'Failed to calculate price');
      }
    } catch (err: any) {
      setError('Failed to calculate price. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!car || !priceCalculation) {
      alert('Please wait for price calculation');
      return;
    }

    navigate('/review', {
      state: {
        car,
        durationMonths,
        kmPackage,
        priceCalculation,
      },
    });
  };

  if (!car) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate('/cars')}
        className="mb-6 text-primary-400 hover:text-primary-300 flex items-center group transition-all duration-300 animate-slide-down"
      >
        <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span>
        <span className="ml-2">Back to Cars</span>
      </button>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Car Summary Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
            }}></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 animate-slide-down">Configure Your Rental</h1>
            <div className="flex items-center space-x-6 mt-6">
              <div className="h-32 w-48 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/20 animate-scale-in">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192x128?text=No+Image';
                    }}
                  />
                ) : (
                  <span className="text-6xl">🚗</span>
                )}
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-bold mb-2">{car.brand} {car.model}</h2>
                <p className="text-primary-100 text-lg">{car.category.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Duration Selection */}
          <div className="mb-10 animate-fade-in">
            <h3 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
              <span className="mr-3">📅</span>
              Select Rental Duration
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 3, 6].map((months, index) => (
                <button
                  key={months}
                  onClick={() => setDurationMonths(months)}
                  className={`p-8 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 animate-scale-in ${
                    durationMonths === months
                      ? 'border-primary-500 bg-gradient-to-br from-primary-600/20 to-primary-700/20 text-primary-400 shadow-lg shadow-primary-500/20 glow'
                      : 'border-dark-border hover:border-primary-400/50 glass text-dark-text'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl font-bold mb-2">{months}</div>
                  <div className="text-sm text-dark-muted">Month{months > 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
          </div>

          {/* KM Package Selection */}
          <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
              <span className="mr-3">🛣️</span>
              Select Monthly KM Package
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[500, 1000, 2000].map((kms, index) => (
                <button
                  key={kms}
                  onClick={() => setKmPackage(kms)}
                  className={`p-8 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 animate-scale-in ${
                    kmPackage === kms
                      ? 'border-primary-500 bg-gradient-to-br from-primary-600/20 to-primary-700/20 text-primary-400 shadow-lg shadow-primary-500/20 glow'
                      : 'border-dark-border hover:border-primary-400/50 glass text-dark-text'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl font-bold mb-2">{kms.toLocaleString()}</div>
                  <div className="text-sm text-dark-muted">KM per month</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          {isLoading ? (
            <div className="glass rounded-xl p-8 text-center mb-6 animate-pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-dark-muted">Calculating price...</p>
            </div>
          ) : priceCalculation ? (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 rounded-xl p-8 mb-8 animate-scale-in glow-hover">
              <h3 className="text-xl font-bold text-dark-text mb-6 flex items-center">
                <span className="mr-3">💰</span>
                Price Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-dark-text">
                  <span>Price per month:</span>
                  <span className="font-semibold text-lg">₹{priceCalculation.pricePerMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-dark-text">
                  <span>Duration:</span>
                  <span className="font-semibold">{priceCalculation.durationMonths} month{priceCalculation.durationMonths > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-dark-text">
                  <span>KM Package:</span>
                  <span className="font-semibold">{priceCalculation.kmPackage.toLocaleString()} km/month</span>
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
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6 animate-slide-down">
              {error}
            </div>
          ) : null}

          {/* Continue Button */}
          <div className="flex justify-end space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => navigate('/cars')}
              className="px-8 py-4 glass border-2 border-dark-border text-dark-text rounded-xl font-semibold text-lg hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!priceCalculation || isLoading}
              className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-primary-500/50 glow-hover"
            >
              Continue to Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
