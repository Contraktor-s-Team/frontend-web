import React, { createContext, useReducer, useContext, useCallback, useRef } from 'react';
import axios from 'axios';

const initialState = {
  allArtisans: { loading: false, data: {}, error: {} },
  artisan: { loading: false, data: {}, error: {} },
  artisanAssignment: { loading: false, data: {}, error: {} },
  categories: { loading: false, data: [], error: {} }
};

const ArtisanContext = createContext();

function artisanReducer(state, action) {
  switch (action.type) {
    case 'ALL_ARTISAN_REQUEST':
      return { ...state, allArtisans: { ...state.allArtisans, loading: true } };
    case 'ALL_ARTISAN_SUCCESS':
      return { ...state, allArtisans: { loading: false, data: action.payload, error: {} } };
    case 'ALL_ARTISAN_FAILURE':
      return { ...state, allArtisans: { loading: false, data: {}, error: action.payload } };
    case 'ARTISAN_REQUEST':
      return { ...state, artisan: { ...state.artisan, loading: true } };
    case 'ARTISAN_SUCCESS':
      return { ...state, artisan: { loading: false, data: action.payload, error: {} } };
    case 'ARTISAN_FAILURE':
      return { ...state, artisan: { loading: false, data: {}, error: action.payload } };
    case 'ARTISAN_ASSIGNMENT_REQUEST':
      return { ...state, artisanAssignment: { ...state.artisanAssignment, loading: true } };
    case 'ARTISAN_ASSIGNMENT_SUCCESS':
      return { ...state, artisanAssignment: { loading: false, data: action.payload, error: {} } };
    case 'ARTISAN_ASSIGNMENT_FAILURE':
      return { ...state, artisanAssignment: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function ArtisanProvider({ children }) {
  const [state, dispatch] = useReducer(artisanReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com';

  // Add call guards to prevent duplicate API calls
  const callGuards = useRef({
    fetchArtisanById: new Map(), // Map to track calls by artisan ID
    fetchAllArtisans: false,
    lastFetchTimestamps: new Map()
  });

  // Fetch all artisans with call guard
  const fetchAllArtisans = useCallback(async () => {
    // Check if already loading or has recent data
    if (state.allArtisans.loading) {
      return;
    }

    if (callGuards.current.fetchAllArtisans) {
      return;
    }

    // Check if we have recent data (5 minutes cache)
    const lastFetchTime = callGuards.current.lastFetchTimestamps.get('allArtisans');
    if (lastFetchTime && Date.now() - lastFetchTime < 300000) {
      // 5 minutes
      return;
    }

    callGuards.current.fetchAllArtisans = true;

    dispatch({ type: 'ALL_ARTISAN_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/api/ArtisanDiscovery`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ALL_ARTISAN_SUCCESS', payload: response.data });
      callGuards.current.lastFetchTimestamps.set('allArtisans', Date.now());
    } catch (error) {
      dispatch({ type: 'ALL_ARTISAN_FAILURE', payload: error?.response?.data?.message || error.message });
    } finally {
      callGuards.current.fetchAllArtisans = false;
    }
  }, [state.allArtisans.loading]);

  // Fetch artisan by id with call guard
  const fetchArtisanById = useCallback(
    async (id, forceRefresh = false) => {
      if (!id) {
        return;
      }

      // Check if we already have valid data for this artisan ID
      const hasValidData = state.artisan.data && Object.keys(state.artisan.data).length > 0;
      const isCurrentlyLoading = state.artisan.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get(`artisan_${id}`) &&
        Date.now() - callGuards.current.lastFetchTimestamps.get(`artisan_${id}`) < 60000; // 1 minute cache

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        return state.artisan.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        return state.artisan.data;
      }

      // Prevent concurrent calls for the same artisan ID
      if (callGuards.current.fetchArtisanById.get(id)) {
        return;
      }

      callGuards.current.fetchArtisanById.set(id, true);
      dispatch({ type: 'ARTISAN_REQUEST' });
      try {
        const datas = JSON.parse(localStorage.getItem('auth'));

        if (!datas?.token) {
          throw new Error('No authentication token found');
        }

        const apiUrl = `${baseUrl}/api/ArtisanDiscovery/GetArtisanById?id=${id}`;

        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${datas?.token}` }
        });

        callGuards.current.lastFetchTimestamps.set(`artisan_${id}`, Date.now());
        dispatch({ type: 'ARTISAN_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('🔥 ArtisanContext: Error occurred in fetchArtisanById:', error);
        console.error('🔥 ArtisanContext: Error message:', error.message);
        console.error('🔥 ArtisanContext: Error response:', error.response);
        console.error('🔥 ArtisanContext: Error response status:', error.response?.status);
        console.error('🔥 ArtisanContext: Error response data:', error.response?.data);

        let errorMessage = 'Unknown error occurred';

        // Better error message extraction
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'Access forbidden. You may not have permission to view this data.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Artisan profile not found.';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          try {
            errorMessage = JSON.stringify(error.response.data);
          } catch {
            errorMessage = `HTTP ${error.response.status} error occurred`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.code) {
          errorMessage = `Network error: ${error.code}`;
        }

        console.error('🔥 ArtisanContext: Final error message:', errorMessage);
        dispatch({ type: 'ARTISAN_FAILURE', payload: errorMessage });
        throw error;
      } finally {
        callGuards.current.fetchArtisanById.delete(id);
      }
    },
    [state.artisan.data, state.artisan.loading]
  );

  // Post artisan assignment
  const postArtisanAssignment = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'ARTISAN_ASSIGNMENT_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(`${baseUrl}/api/ArtisanSubcategoryAssignment/assign-multiple`, postState, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ARTISAN_ASSIGNMENT_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'ARTISAN_ASSIGNMENT_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  return (
    <ArtisanContext.Provider
      value={{
        state,
        fetchAllArtisans,
        fetchArtisanById,
        postArtisanAssignment,
        postAssignment: postArtisanAssignment, // Add alias for compatibility
        assignmentLoading: state.artisanAssignment.loading,
        assignmentError: state.artisanAssignment.error
      }}
    >
      {children}
    </ArtisanContext.Provider>
  );
}

export function useArtisan() {
  const context = useContext(ArtisanContext);
  if (!context) {
    throw new Error('useArtisan must be used within an ArtisanProvider');
  }
  return context;
}
