import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Car, PriceCalculation } from '../types';

/**
 * BookingForm Component
 * 
 * Features:
 * - Booking creation form
 * - Date selection for rental start
 * - Payment processing
 * - Success/error handling
 */
interface BookingFormProps {
  car: Car;
  priceCalculation: PriceCalculation | null;
  durationMonths: number;
  kmPackage: number;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  car,
  priceCalculation,
  durationMonths,
  kmPackage,
  onCancel,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'booking' | 'payment'>('booking');
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !priceCalculation) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.createBooking({
        userId: user.id,
        carId: car.id,
        categoryId: car.category.id,
        durationMonths,
        kmPackage,
        startDate,
      });

      if (response.success && response.data) {
        setBookingId(response.data.id);
        setStep('payment');
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.processPayment({
        bookingId,
        mockSuccess: true, // Set to true for successful payment
      });

      if (response.success && response.data) {
        // Payment successful - redirect to dashboard
        navigate('/dashboard', { state: { bookingSuccess: true } });
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'payment') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Payment</h3>
        
        {priceCalculation && (
          <div className="mb-6">
            <div className="bg-gray-50 rounded-md p-4 mb-4">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Car:</span>
                  <span>{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{durationMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span>KM Package:</span>
                  <span>{kmPackage} km/month</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>₹{priceCalculation.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demo application. Payment processing is simulated.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Confirm Payment'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create Booking</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rental Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {priceCalculation && (
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-semibold mb-2">Price Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Price per month:</span>
                <span>₹{priceCalculation.pricePerMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total amount:</span>
                <span className="font-bold">₹{priceCalculation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !startDate}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Continue to Payment'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
