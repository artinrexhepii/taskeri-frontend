import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  redirectPath?: string;
}

/**
 * A wrapper for routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;