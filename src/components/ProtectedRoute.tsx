/**
 * @fileoverview Protected Route Component
 * 
 * Wrapper component for routes that require authentication.
 * Can optionally enforce role-based access control.
 * 
 * @module components/ProtectedRoute
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Props for ProtectedRoute component
 * @interface ProtectedRouteProps
 * @property {React.ReactNode} children - Content to render if authorized
 * @property {'user' | 'admin'} [requiredRole] - Optional: specific role required
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

/**
 * ProtectedRoute Component
 * 
 * Restricts access to authenticated users.
 * Optionally restricts access to specific roles.
 * 
 * Behaviors:
 * - If loading: Shows loading message
 * - If not authenticated: Returns null (parent handles redirect)
 * - If role required but user doesn't have it: Shows unauthorized message
 * - Otherwise: Renders children
 * 
 * Usage:
 * ```jsx
 * // Require authentication only
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Require admin role
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {'user' | 'admin'} [props.requiredRole] - Optional role requirement
 * @returns {React.ReactElement|null} Protected content or message
 */
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
