import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null; // Handled by parent component
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="unauthorized-screen">You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};
