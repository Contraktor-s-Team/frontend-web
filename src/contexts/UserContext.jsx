import React, { createContext, useReducer, useContext, useCallback, useRef } from 'react';
import axios from 'axios';

const initialState = {
  user: { loading: false, data: {}, error: {} },
  userEmail: { loading: false, data: {}, error: {} },
  updateUser: { loading: false, data: {}, error: {} }
};

const UserContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'USER_REQUEST':
      return { ...state, user: { ...state.user, loading: true } };
    case 'USER_SUCCESS':
      return { ...state, user: { loading: false, data: action.payload, error: {} } };
    case 'USER_FAILURE':
      return { ...state, user: { loading: false, data: {}, error: action.payload } };
    case 'USER_EMAIL_REQUEST':
      return { ...state, userEmail: { ...state.userEmail, loading: true } };
    case 'USER_EMAIL_SUCCESS':
      return { ...state, userEmail: { loading: false, data: action.payload, error: {} } };
    case 'USER_EMAIL_FAILURE':
      return { ...state, userEmail: { loading: false, data: {}, error: action.payload } };
    case 'UPDATE_USER_REQUEST':
      return { ...state, updateUser: { ...state.updateUser, loading: true } };
    case 'UPDATE_USER_SUCCESS':
      return { ...state, updateUser: { loading: false, data: action.payload, error: {} } };
    case 'UPDATE_USER_FAILURE':
      return { ...state, updateUser: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Users';

  // Add call guard to prevent duplicate API calls
  const callGuards = useRef({
    fetchCurrentUser: false,
    lastFetchTimestamp: null,
    lastErrorTimestamp: null,
    consecutiveErrors: 0
  });

  // Fetch current user with call guard
  const fetchCurrentUser = useCallback(
    async (forceRefresh = false) => {
      // Check if we already have valid data and it's not forced refresh
      const hasValidData = state.user.data?.data?.id || state.user.data?.id;
      const isCurrentlyLoading = state.user.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamp && Date.now() - callGuards.current.lastFetchTimestamp < 30000; // 30 seconds cache

      // Check for recent error and prevent rapid retries
      const hasRecentError =
        callGuards.current.lastErrorTimestamp &&
        Date.now() - callGuards.current.lastErrorTimestamp < 60000 && // 1 minute error cooldown
        callGuards.current.consecutiveErrors >= 3; // After 3 consecutive errors

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        return state.user.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        return state.user.data;
      }

      if (!forceRefresh && hasRecentError) {
        console.warn('⏸️ fetchCurrentUser: Too many recent errors, skipping call');
        return;
      }

      // Prevent concurrent calls
      if (callGuards.current.fetchCurrentUser) {
        return;
      }

      callGuards.current.fetchCurrentUser = true;
      dispatch({ type: 'USER_REQUEST' });
      try {
        const authData = localStorage.getItem('auth');

        if (!authData) {
          throw new Error('No authentication token found');
        }

        const datas = JSON.parse(authData);
        const token = datas?.token;

        if (!token) {
          throw new Error('Invalid authentication token');
        }

        const response = await axios.get(`${baseUrl}/GetCurrentUser`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        callGuards.current.lastFetchTimestamp = Date.now();
        callGuards.current.consecutiveErrors = 0; // Reset error count on success
        dispatch({ type: 'USER_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message;
        console.error('❌ fetchCurrentUser error:', errorMessage);

        // Track consecutive errors
        callGuards.current.lastErrorTimestamp = Date.now();
        callGuards.current.consecutiveErrors += 1;

        dispatch({ type: 'USER_FAILURE', payload: errorMessage });
        throw error;
      } finally {
        callGuards.current.fetchCurrentUser = false;
      }
    },
    [state.user.data, state.user.loading]
  );

  // Fetch user by id
  // const fetchUserById = useCallback(async (id) => {
  //   dispatch({ type: 'USER_REQUEST' });
  //   try {
  //     const response = await axios.get(`${baseUrl}/${id}`);
  //     dispatch({ type: 'USER_SUCCESS', payload: response.data });
  //   } catch (error) {
  //     dispatch({ type: 'USER_FAILURE', payload: error?.response?.data?.message || error.message });
  //   }
  // }, []);

  // Update user
  const updateUser = useCallback(async (id, postState, onSuccess, onError) => {
    dispatch({ type: 'UPDATE_USER_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/${id}/update`, postState);
      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Upload profile image
  const uploadProfileImage = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'UPDATE_USER_REQUEST' });
    try {
      // Get auth token from localStorage
      const authData = localStorage.getItem('auth');
      const token = authData ? JSON.parse(authData).token : localStorage.getItem('authToken');

      console.log('🔧 Upload profile image debug info:', {
        hasToken: !!token,
        formDataEntries: Array.from(postState.entries()),
        apiUrl: `${baseUrl}/upload-picture`
      });

      const res = await axios.post(`${baseUrl}/upload-picture`, postState, {
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type manually for FormData, let axios handle it
        }
      });
      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload profile image error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error.message
      });
      dispatch({ type: 'UPDATE_USER_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError(error?.response?.data?.message || error.message);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        state,
        fetchCurrentUser,
        updateUser,
        uploadProfileImage
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
