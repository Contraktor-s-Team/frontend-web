import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useUserRole } from './hooks/useUserRole';

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();
  const { userType, isLoading, getDefaultDashboardPath } = useUserRole();

  // Check if user is authenticated via localStorage or context
  const Authenticated = localStorage.getItem('auth') || state.login.isAuthenticated;

  // Check if user is authenticated
  if (!Authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/" replace />;
  }

  // Wait for role to be determined before making routing decisions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Role-based route protection
  if (userType) {
    // If accessing artisan routes but user is not an artisan, redirect to customer dashboard
    if (location.pathname.startsWith('/artisan') && userType !== 'artisan') {
      console.log('🔄 Non-artisan user accessing artisan routes, redirecting to customer dashboard');
      return <Navigate to="/customer/dashboard" replace />;
    }

    // If accessing customer routes but user is an artisan, redirect to artisan dashboard
    if (location.pathname.startsWith('/customer') && userType !== 'customer') {
      console.log('🔄 Artisan user accessing customer routes, redirecting to artisan dashboard');
      return <Navigate to="/artisan/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
