import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

export const useUserRole = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state: userState, fetchCurrentUser } = useUser();
  const { state: authState } = useAuth();

  // Ref to prevent multiple concurrent API calls and track initialization
  const fetchingRef = useRef(false);
  const initializedRef = useRef(false);

  // Public routes where we shouldn't fetch user data
  const isPublicRoute = () => {
    const publicRoutes = ['/', '/signup', '/forgot-password', '/verify-code', '/create-new-password'];
    return publicRoutes.includes(location.pathname);
  };

  // Helper function to extract role from various data sources
  const extractRole = (userData) => {
    if (!userData) return null;

    // Try different possible role locations in the data
    const role = userData.role || userData.data?.role || userData.user?.role || userData.user?.data?.role;

    return role;
  };

  // Helper function to get role from localStorage
  const getRoleFromStorage = () => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        return extractRole(parsedAuth);
      }
    } catch (error) {
      console.error('Error parsing auth data for role:', error);
    }
    return null;
  };

  // Helper function to determine if user is artisan
  const isArtisan = (role) => {
    return role === 'artisan' || role === 'Artisan';
  };

  // Helper function to determine if user is customer/user
  const isCustomer = (role) => {
    return role === 'user' || role === 'User' || role === 'customer' || role === 'Customer';
  };

  // Check if we have valid authentication
  const isAuthenticated = () => {
    const authData = localStorage.getItem('auth');
    return !!authData && !!authState.login.isAuthenticated;
  };

  useEffect(() => {
    const initializeUserRole = async () => {
      // Don't run on public routes
      if (isPublicRoute()) {
        setIsLoading(false);
        return;
      }

      // Prevent concurrent calls and re-initialization
      if (fetchingRef.current || initializedRef.current) {
        return;
      }

      // Skip if not authenticated
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First, try to get role from localStorage (fastest)
        const storageRole = getRoleFromStorage();
        if (storageRole) {
          setUserRole(storageRole);
          initializedRef.current = true;
          setIsLoading(false);
          return;
        }

        // Second, try to get from context
        const contextRole = extractRole(userState.user.data);
        if (contextRole) {
          setUserRole(contextRole);
          initializedRef.current = true;
          setIsLoading(false);
          return;
        }

        // Only fetch if we have auth token, no existing data, and not already loading
        const hasUserData = userState.user.data?.data?.id || userState.user.data?.id;

        if (!hasUserData && !userState.user.loading && fetchCurrentUser) {
          fetchingRef.current = true;

          try {
            const userData = await fetchCurrentUser();
            const fetchedRole = extractRole(userData);
            if (fetchedRole) {
              setUserRole(fetchedRole);
              initializedRef.current = true;
            } else {
              setError('Unable to determine user role');
            }
          } catch (fetchError) {
            console.error('❌ useUserRole: Error fetching current user for role:', fetchError);
            setError('Failed to fetch user role');
          } finally {
            fetchingRef.current = false;
          }
        }
      } catch (err) {
        console.error('❌ useUserRole: Error initializing user role:', err);
        setError('Failed to initialize user role');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserRole();
  }, [location.pathname]); // Only re-run when route changes

  // Update role when user state changes (separate effect to avoid loops)
  useEffect(() => {
    if (!isPublicRoute() && userState.user.data && !userState.user.loading) {
      const contextRole = extractRole(userState.user.data);
      if (contextRole && contextRole !== userRole) {
        setUserRole(contextRole);
        initializedRef.current = true;
      }
    }
  }, [userState.user.data, userState.user.loading]);

  const getUserType = () => {
    if (!userRole) return null;
    return isArtisan(userRole) ? 'artisan' : 'customer';
  };

  const getDefaultDashboardPath = () => {
    const userType = getUserType();
    if (!userType) return '/customer/dashboard'; // Default fallback
    return `/${userType}/dashboard`;
  };

  const refreshRole = () => {
    if (!fetchingRef.current && !isPublicRoute() && isAuthenticated()) {
      setIsLoading(true);
      setError(null);
      fetchingRef.current = true;
      initializedRef.current = false;

      fetchCurrentUser(true) // Force refresh
        .then(() => {
          console.log('✅ useUserRole: Manual refresh completed');
        })
        .catch((error) => {
          console.error('❌ useUserRole: Manual refresh failed:', error);
          setError('Failed to refresh user role');
        })
        .finally(() => {
          fetchingRef.current = false;
          setIsLoading(false);
        });
    }
  };

  return {
    userRole,
    userType: getUserType(),
    isArtisan: isArtisan(userRole),
    isCustomer: isCustomer(userRole),
    isLoading,
    error,
    getDefaultDashboardPath,
    refreshRole
  };
};
