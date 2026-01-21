import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Car, Category } from '../types';

/**
 * CarList Component - Dark Theme with Animations
 */
const CarList: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCars();
  }, [selectedCategory, selectedBrand]);

  const loadData = async () => {
    try {
      const [carsRes, categoriesRes] = await Promise.all([
        apiService.getCars(),
        apiService.getCategories(),
      ]);

      if (carsRes.success && carsRes.data) {
        setCars(carsRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCars = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedCategory) {
        response = await apiService.getCarsByCategory(selectedCategory);
      } else if (selectedBrand) {
        response = await apiService.getCarsByBrand(selectedBrand);
      } else {
        response = await apiService.getCars();
      }

      if (response.success && response.data) {
        setCars(response.data);
      }
    } catch (err: any) {
      setError('Failed to load cars');
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));

  if (isLoading && cars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-dark-muted text-lg">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-slide-down">Available Cars</h1>
        <p className="text-dark-muted text-lg">Choose your perfect ride</p>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6 mb-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-dark-muted mb-2">
              Category
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value ? Number(e.target.value) : null);
                setSelectedBrand('');
              }}
              className="glass border border-dark-border rounded-lg px-4 py-2 text-dark-text bg-dark-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-dark-muted mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedCategory(null);
              }}
              className="glass border border-dark-border rounded-lg px-4 py-2 text-dark-text bg-dark-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          
          {(selectedCategory || selectedBrand) && (
            <div className="flex items-end animate-scale-in">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand('');
                }}
                className="px-4 py-2 bg-dark-card hover:bg-dark-border text-dark-text rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 animate-slide-down">
          {error}
        </div>
      )}

      {cars.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-dark-muted text-xl">No cars available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <button
              key={car.id}
              onClick={() => navigate('/configure', { state: { car } })}
              className="group glass rounded-2xl overflow-hidden card-hover hover:border-primary-500/50 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-gradient-to-br from-dark-card to-dark-surface flex items-center justify-center relative overflow-hidden">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <span className="text-gray-400 text-6xl group-hover:scale-110 transition-transform duration-300">🚗</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold backdrop-blur-sm ${
                    car.status === 'AVAILABLE'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}
                >
                  {car.status}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-dark-text group-hover:text-primary-400 transition-colors">
                    {car.brand} {car.model}
                  </h3>
                </div>
                <p className="text-sm text-dark-muted mb-3">{car.category.name}</p>
                <div className="flex items-center text-primary-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Select & Configure →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
