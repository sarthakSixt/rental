// TypeScript types matching your backend entities

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  imageUrl?: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENENCE';
  category: Category;
}

export interface PricingPlan {
  id: number;
  durationMonths: number;
  kmPackage: number;
  pricePerMonth: number;
  isActive: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  carId: number;
  durationMonths: number;
  kmPackage: number;
  pricePerMonth: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId?: string;
  createdAt: string;
}

export interface PriceCalculation {
  categoryId: number;
  categoryName: string;
  durationMonths: number;
  kmPackage: number;
  pricePerMonth: number;
  totalAmount: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface BookingRequest {
  userId: number;
  carId: number;
  categoryId: number;
  durationMonths: number;
  kmPackage: number;
  startDate: string;
}

export interface PaymentRequest {
  bookingId: number;
  mockSuccess?: boolean;
}
