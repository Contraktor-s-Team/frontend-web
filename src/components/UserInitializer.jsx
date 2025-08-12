import { useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * Component that ensures current user is fetched when needed
 * This should be used at the app level to ensure user data is available
 */
const UserInitializer = () => {
  const { state: userState, fetchCurrentUser } = useUser();
  const { state: authState } = useAuth();
  const location = useLocation();
  const initializeRef = useRef(false);

  // Public routes where we shouldn't fetch user data
  const isPublicRoute = () => {
    const publicRoutes = ['/', '/signup', '/forgot-password', '/verify-code', '/create-new-password'];
    return publicRoutes.includes(location.pathname);
  };

  useEffect(() => {
    // Don't run on public routes
    if (isPublicRoute()) {
      return;
    }

    // Check if we have auth token
    const authData = localStorage.getItem('auth');
    const hasToken = !!authData && !!authState.login.isAuthenticated;

    if (!hasToken) {
      return;
    }

    // Check if we already have user data
    const hasUserData = userState.user.data?.data?.id || userState.user.data?.id;
    const isLoading = userState.user.loading;

    // Only fetch if we don't have user data, we're not loading, and we haven't already initialized
    if (!hasUserData && !isLoading && !initializeRef.current) {
      console.log('🚀 UserInitializer: Fetching current user on app initialization');
      initializeRef.current = true;

      fetchCurrentUser(true) // Force refresh to get latest data
        .then(() => {
          console.log('✅ UserInitializer: Current user fetched successfully');
        })
        .catch((error) => {
          console.error('❌ UserInitializer: Failed to fetch current user:', error);
          initializeRef.current = false; // Reset on error to allow retry
        });
    }
  }, [
    location.pathname,
    authState.login.isAuthenticated,
    userState.user.data,
    userState.user.loading,
    fetchCurrentUser
  ]);

  return null; // This component doesn't render anything
};

export default UserInitializer;
