/**
 * Utility functions for handling authentication
 */

/**
 * Handles authentication errors by clearing stored auth data and redirecting to login
 * @param {Error} error - The error object from the API call
 * @param {Function} navigate - The navigate function from useNavigate hook (optional)
 * @returns {boolean} - Returns true if the error was a 401 and handled
 */
export const handleAuthError = (error, navigate = null) => {
  if (error?.response?.status === 401) {
    console.warn('Authentication token expired or invalid. Redirecting to login...');

    // Clear auth data from localStorage
    localStorage.removeItem('auth');

    // If navigate function is provided, use it
    if (navigate) {
      navigate('/', { replace: true });
      return true;
    }

    // Fallback: redirect using window.location
    window.location.href = '/';
    return true;
  }

  return false;
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} - Returns true if user has a valid token
 */
export const isAuthenticated = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    return !!authData?.token;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return false;
  }
};

/**
 * Gets the auth token from localStorage
 * @returns {string|null} - Returns the token or null if not found
 */
export const getAuthToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    return authData?.token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};
