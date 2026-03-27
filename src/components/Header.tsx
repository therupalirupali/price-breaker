import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

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
