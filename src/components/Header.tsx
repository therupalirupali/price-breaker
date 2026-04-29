/**
 * @fileoverview Application Header Component
 * 
 * Displays application title, user information, and logout button.
 * Shows user email and admin status if applicable.
 * 
 * @module components/Header
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

/**
 * Header Component
 * 
 * Application header showing:
 * - App title and description
 * - Current user's email
 * - Admin badge (if user is admin)
 * - Logout button
 * 
 * @component
 * @returns {React.ReactElement} Header UI with user info and logout button
 */
export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>💎 Price Breaker</h1>
        <p>Metal Making Charge Calculator</p>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          {user?.role === 'admin' && <span className="admin-badge">ADMIN</span>}
        </div>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
};
