import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Signup Component - Dark Theme with Animations
 */
const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phoneNumber
      );
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-scale-in">
        <div className="glass rounded-2xl p-10 shadow-2xl border border-dark-border">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce-slow">✨</div>
            <h2 className="text-4xl font-extrabold gradient-text mb-2">
              Create account
            </h2>
            <p className="text-dark-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg animate-slide-down">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-dark-muted mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-dark-muted mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  />
                </div>
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-dark-muted mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-dark-muted mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  placeholder="+1234567890"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-dark-muted mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-muted mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full glass border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 input-focus"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/50 glow-hover"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
