import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Car, PricingPlan, PriceCalculation } from '../types';
import BookingForm from './BookingForm';

/**
 * CarDetails Component
 * 
 * Features:
 * - Displays detailed car information
 * - Shows pricing plans for the car's category
 * - Integrated booking form
 * - Price calculation
 */
const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [car, setCar] = useState<Car | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Form state for price calculation
  const [durationMonths, setDurationMonths] = useState(1);
  const [kmPackage, setKmPackage] = useState(1000);

  useEffect(() => {
    if (id) {
      loadCarDetails();
    }
  }, [id]);

  const loadCarDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const [carRes, plansRes] = await Promise.all([
        apiService.getCarById(Number(id)),
        apiService.getPricingPlans(0), // We'll update this after getting car
      ]);

      if (carRes.success && carRes.data) {
        setCar(carRes.data);
        // Load pricing plans for this car's category
        const categoryPlansRes = await apiService.getPricingPlans(carRes.data.category.id);
        if (categoryPlansRes.success && categoryPlansRes.data) {
          setPricingPlans(categoryPlansRes.data);
        }
      } else {
        setError('Car not found');
      }
    } catch (err: any) {
      setError('Failed to load car details');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = async () => {
    if (!car) return;

    try {
      const response = await apiService.calculatePrice(
        car.category.id,
        durationMonths,
        kmPackage
      );

      if (response.success && response.data) {
        setPriceCalculation(response.data);
      }
    } catch (err: any) {
      setError('Failed to calculate price');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Car not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          ← Back to cars
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
      >
        ← Back to cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image and Info */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              ) : (
                <span className="text-gray-400 text-8xl">🚗</span>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">{car.category.name}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded ${
                    car.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {car.status}
                </span>
              </div>
              <p className="text-gray-700">{car.category.description}</p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure Your Rental</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months)
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Package
                </label>
                <select
                  value={kmPackage}
                  onChange={(e) => setKmPackage(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={500}>500 km/month</option>
                  <option value={1000}>1000 km/month</option>
                  <option value={2000}>2000 km/month</option>
                </select>
              </div>

              <button
                onClick={calculatePrice}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition"
              >
                Calculate Price
              </button>

              {priceCalculation && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Price Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Price per month:</span>
                      <span className="font-medium">₹{priceCalculation.pricePerMonth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{priceCalculation.durationMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KM Package:</span>
                      <span>{priceCalculation.kmPackage} km/month</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span>₹{priceCalculation.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAuthenticated ? (
            <div>
              {showBookingForm ? (
                <BookingForm
                  car={car}
                  priceCalculation={priceCalculation}
                  durationMonths={durationMonths}
                  kmPackage={kmPackage}
                  onCancel={() => setShowBookingForm(false)}
                />
              ) : (
                <button
                  onClick={() => {
                    if (!priceCalculation) {
                      alert('Please calculate price first');
                      return;
                    }
                    setShowBookingForm(true);
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium text-lg transition"
                >
                  Book This Car
                </button>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
              <p className="text-yellow-800 mb-2">Please login to book this car</p>
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
