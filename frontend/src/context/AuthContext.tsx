import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { LoginResponse, User } from '../types';

/**
 * AuthContext - Manages authentication state across the application
 * 
 * This context provides:
 * 1. User authentication state (logged in/out)
 * 2. User information (name, email, role)
 * 3. Login/logout functions
 * 4. Token management
 * 
 * Usage: Wrap your app with <AuthProvider> and use useAuth() hook in components
 */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      // If token exists, try to decode and set user (simplified - in production, verify token)
      // For now, we'll just check if token exists
      // You could decode JWT here to get user info
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: '', // Not returned in login response
          role: response.data.role as 'CUSTOMER' | 'ADMIN',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => {
    try {
      const response = await apiService.signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber,
          role: response.data.role as 'CUSTOMER' | 'ADMIN',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
