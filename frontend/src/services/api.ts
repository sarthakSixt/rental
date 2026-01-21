import axios, { AxiosInstance, AxiosError } from 'axios';
import type { 
  ApiResponse, 
  LoginRequest, 
  SignupRequest, 
  LoginResponse,
  BookingRequest,
  PaymentRequest,
  Car,
  Category,
  Booking,
  Payment,
  PriceCalculation
} from '../types';

/**
 * API Service - Centralized HTTP client for backend communication
 * 
 * This service handles:
 * 1. Base URL configuration
 * 2. JWT token management (storing/retrieving from localStorage)
 * 3. Automatic token injection in request headers
 * 4. Error handling
 */

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    // Use relative URL when proxying through Vite, or absolute URL for production
    const baseURL = import.meta.env.DEV 
      ? '/api'  // Use proxy in development
      : 'http://localhost:8080/api';  // Direct connection in production
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Request interceptor: Add JWT token to every request
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle errors globally
    this.api.interceptors.response.use(
      (response) => {
        // Log successful responses for debugging (only in dev)
        if (import.meta.env.DEV) {
          console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.status);
        }
        return response;
      },
      (error: AxiosError) => {
        // Log errors for debugging
        if (import.meta.env.DEV) {
          console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          });
        }

        if (error.response?.status === 401) {
          // Token expired or invalid - clear storage
          console.warn('Unauthorized - clearing token and redirecting to login');
          this.clearToken();
          localStorage.removeItem('user');
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else if (error.response?.status === 403) {
          console.error('Forbidden - insufficient permissions');
        } else if (error.response && error.response.status >= 500) {
          console.error('Server error - backend may be down');
        } else if (!error.response) {
          // Network error
          console.error('Network error - check if backend is running on http://localhost:8080');
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post<ApiResponse<LoginResponse>>('/auth/signup', userData);
    if (response.data.success && response.data.data) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  // Car endpoints
  async getCars(): Promise<ApiResponse<Car[]>> {
    const response = await this.api.get<ApiResponse<Car[]>>('/cars');
    return response.data;
  }

  async getCarById(id: number): Promise<ApiResponse<Car>> {
    const response = await this.api.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data;
  }

  async getCarsByCategory(categoryId: number): Promise<ApiResponse<Car[]>> {
    const response = await this.api.get<ApiResponse<Car[]>>(`/cars/category/${categoryId}`);
    return response.data;
  }

  async getCarsByBrand(brand: string): Promise<ApiResponse<Car[]>> {
    const response = await this.api.get<ApiResponse<Car[]>>(`/cars/brand/${brand}`);
    return response.data;
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const response = await this.api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }

  // Pricing endpoints
  async getPricingPlans(categoryId: number): Promise<ApiResponse<any[]>> {
    const response = await this.api.get<ApiResponse<any[]>>(`/pricing/category/${categoryId}`);
    return response.data;
  }

  async calculatePrice(
    categoryId: number,
    durationMonths: number,
    kmPackage: number
  ): Promise<ApiResponse<PriceCalculation>> {
    const response = await this.api.get<ApiResponse<PriceCalculation>>('/pricing/calculate', {
      params: { categoryId, durationMonths, kmPackage },
    });
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: BookingRequest): Promise<ApiResponse<Booking>> {
    console.log('API: Creating booking at /bookings with data:', bookingData);
    try {
      const response = await this.api.post<ApiResponse<Booking>>('/bookings', bookingData);
      console.log('API: Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Booking creation failed:', error);
      throw error;
    }
  }

  async getUserBookings(userId: number): Promise<ApiResponse<Booking[]>> {
    const response = await this.api.get<ApiResponse<Booking[]>>(`/bookings/user/${userId}`);
    return response.data;
  }

  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    const response = await this.api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  }

  async cancelBooking(id: number): Promise<ApiResponse<Booking>> {
    const response = await this.api.put<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
    return response.data;
  }

  // Payment endpoints
  async processPayment(paymentData: PaymentRequest): Promise<ApiResponse<Payment>> {
    const response = await this.api.post<ApiResponse<Payment>>('/payments/process', paymentData);
    return response.data;
  }

  async getPaymentByBooking(bookingId: number): Promise<ApiResponse<Payment>> {
    const response = await this.api.get<ApiResponse<Payment>>(`/payments/booking/${bookingId}`);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
