/**
 * @fileoverview Login/Registration Component
 * 
 * Provides authentication form for login and registration.
 * Supports both user and admin accounts based on email.
 * Shows demo credentials for testing.
 * 
 * @module components/Login
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/**
 * Login Component
 * 
 * Provides user authentication interface with:
 * - Email and password input fields
 * - Sign In / Sign Up mode toggle
 * - Error message display
 * - Loading state during authentication
 * - Demo credentials helper
 * 
 * Admin accounts are created by using email containing 'admin'.
 * 
 * @component
 * @returns {React.ReactElement} Login/registration form UI
 */
export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  /**
   * Handles form submission for login or registration
   * 
   * Validates input, calls appropriate auth function, and handles errors.
   * 
   * @async
   * @function
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  };

  /**
   * Toggles between login and registration mode
   * Clears form fields and error messages
   * 
   * @function
   * @returns {void}
   */
  const toggleMode = () => {
    setError('');
    setEmail('');
    setPassword('');
    setIsRegister(!isRegister);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>💎 Price Breaker</h1>
        <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={toggleMode} className="btn-link" disabled={loading}>
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <p className="demo-title">Demo Credentials:</p>
          <p>Email: <code>user@example.com</code></p>
          <p>Email (Admin): <code>admin@example.com</code></p>
          <p>Password: <code>any password</code></p>
        </div>
      </div>
    </div>
  );
};
