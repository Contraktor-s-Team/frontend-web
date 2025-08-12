import React, { createContext, useReducer, useContext, useCallback, useRef } from 'react';
import axios from 'axios';

const initialState = {
  allArtisans: { loading: false, data: {}, error: {} },
  artisan: { loading: false, data: {}, error: {} },
  artisanAssignment: { loading: false, data: {}, error: {} },
  categories: { loading: false, data: [], error: {} },
  availabilityToggle: { loading: false, error: {} }
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
    case 'TOGGLE_AVAILABILITY_REQUEST':
      return {
        ...state,
        availabilityToggle: { loading: true, error: {} }
      };
    case 'TOGGLE_AVAILABILITY_SUCCESS':
      return {
        ...state,
        artisan: {
          ...state.artisan,
          data: {
            ...state.artisan.data,
            user: {
              ...state.artisan.data?.user,
              available: action.payload.available,
              isAvailable: action.payload.isAvailable || action.payload.available
            },
            available: action.payload.available,
            isAvailable: action.payload.isAvailable || action.payload.available
          }
        },
        availabilityToggle: { loading: false, error: {} }
      };
    case 'TOGGLE_AVAILABILITY_FAILURE':
      return {
        ...state,
        availabilityToggle: { loading: false, error: action.payload }
      };
    default:
      return state;
  }
}

export function ArtisanProvider({ children }) {
  const [state, dispatch] = useReducer(artisanReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com';

  // Add call guards to prevent duplicate API calls
  const callGuards = useRef({
    fetchArtisanById: new Map(),
    fetchAllArtisans: false,
    lastFetchTimestamps: new Map(),
    toggleAvailability: false
  });

  // Fetch all artisans with call guard
  const fetchAllArtisans = useCallback(async () => {
    if (state.allArtisans.loading) {
      return;
    }

    if (callGuards.current.fetchAllArtisans) {
      return;
    }

    const lastFetchTime = callGuards.current.lastFetchTimestamps.get('allArtisans');
    if (lastFetchTime && Date.now() - lastFetchTime < 300000) {
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

      const hasValidData = state.artisan.data && Object.keys(state.artisan.data).length > 0;
      const isCurrentlyLoading = state.artisan.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get(`artisan_${id}`) &&
        Date.now() - callGuards.current.lastFetchTimestamps.get(`artisan_${id}`) < 60000;

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        return state.artisan.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        return state.artisan.data;
      }

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

        let errorMessage = 'Unknown error occurred';

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

  // Toggle artisan availability
  const toggleArtisanAvailability = useCallback(
    async (newAvailability, onSuccess, onError) => {
      // Prevent concurrent calls
      if (callGuards.current.toggleAvailability) {
        return;
      }

      callGuards.current.toggleAvailability = true;
      dispatch({ type: 'TOGGLE_AVAILABILITY_REQUEST' });

      try {
        const datas = JSON.parse(localStorage.getItem('auth'));
        if (!datas?.token) {
          throw new Error('No authentication token found');
        }

        // Try multiple ways to get the user ID
        let userId = null;

        // Try from artisan data
        if (state.artisan.data?.id) {
          userId = state.artisan.data.id;
        } else if (state.artisan.data?.userId) {
          userId = state.artisan.data.userId;
        } else if (state.artisan.data?.user?.id) {
          userId = state.artisan.data.user.id;
        }

        // Try from auth data
        if (!userId && datas?.userId) {
          userId = datas.userId;
        } else if (!userId && datas?.user?.id) {
          userId = datas.user.id;
        } else if (!userId && datas?.id) {
          userId = datas.id;
        }

        // Try from nested data structures
        if (!userId && datas?.data?.id) {
          userId = datas.data.id;
        } else if (!userId && datas?.data?.userId) {
          userId = datas.data.userId;
        }

        console.log('Available user data sources:', {
          artisanData: state.artisan.data,
          authData: datas,
          extractedUserId: userId
        });

        if (!userId) {
          throw new Error('User ID not found. Please ensure you are logged in properly.');
        }

        console.log('🔄 Starting availability toggle request...', {
          userId,
          newAvailability,
          currentAvailability: state.artisan.data?.user?.isAvailable
        });

        // Use PATCH method as specified
        const response = await axios.patch(
          `${baseUrl}/api/Users/toggle-availability`,
          {
            id: userId,
            available: newAvailability
          },
          {
            headers: {
              Authorization: `Bearer ${datas?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('✅ API Response received:', response.data);
        console.log('✅ Response status:', response.status);

        dispatch({
          type: 'TOGGLE_AVAILABILITY_SUCCESS',
          payload: {
            available: newAvailability,
            isAvailable: newAvailability // Also update isAvailable for API consistency
          }
        });

        console.log('✅ Redux state updated successfully');

        if (onSuccess) {
          onSuccess(response.data);
          console.log('✅ Success callback executed');
        }

        return response.data;
      } catch (error) {
        console.error('❌ Toggle availability failed:', error);
        console.error('❌ Error response status:', error.response?.status);
        console.error('❌ Error response data:', error.response?.data);

        let errorMessage = 'Failed to update availability';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.error('❌ Final error message:', errorMessage);

        dispatch({
          type: 'TOGGLE_AVAILABILITY_FAILURE',
          payload: errorMessage
        });

        if (onError) {
          onError(errorMessage);
          console.log('❌ Error callback executed');
        }

        throw error;
      } finally {
        callGuards.current.toggleAvailability = false;
        console.log('🔄 Toggle availability call guard released');
      }
    },
    [state.artisan.data]
  );

  return (
    <ArtisanContext.Provider
      value={{
        state,
        fetchAllArtisans,
        fetchArtisanById,
        postArtisanAssignment,
        postAssignment: postArtisanAssignment,
        toggleArtisanAvailability,
        assignmentLoading: state.artisanAssignment.loading,
        assignmentError: state.artisanAssignment.error,
        availabilityLoading: state.availabilityToggle.loading,
        availabilityError: state.availabilityToggle.error
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
