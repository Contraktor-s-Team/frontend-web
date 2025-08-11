import React, { createContext, useReducer, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { handleAuthError, getAuthToken } from '../utils/authUtils';

const initialState = {
  jobListings: { loading: false, data: {}, error: {} },
  jobListingPost: { loading: false, data: {}, error: {} },
  jobListingDelete: { loading: false, data: {}, error: {} },
  jobListingById: { loading: false, data: {}, error: {} },
  categories: { loading: false, data: {}, error: {} },
  subcategories: { loading: false, data: {}, error: {} },
  artisanJobListings: { loading: false, data: {}, error: {} }
};

const JobListingContext = createContext(null);

function jobListingReducer(state, action) {
  switch (action.type) {
    // Job Listings
    case 'JOB_LISTING_REQUEST':
      return { ...state, jobListings: { ...state.jobListings, loading: true } };
    case 'JOB_LISTING_SUCCESS':
      return { ...state, jobListings: { loading: false, data: action.payload, error: {} } };
    case 'JOB_LISTING_FAILURE':
      return { ...state, jobListings: { loading: false, data: {}, error: action.payload } };
    // Post Job Listing
    case 'POST_JOB_LISTING_REQUEST':
      return { ...state, jobListingPost: { ...state.jobListingPost, loading: true } };
    case 'POST_JOB_LISTING_SUCCESS':
      return { ...state, jobListingPost: { loading: false, data: action.payload, error: {} } };
    case 'POST_JOB_LISTING_FAILURE':
      return { ...state, jobListingPost: { loading: false, data: {}, error: action.payload } };
    // Delete Job Listing
    case 'DELETE_JOB_LISTING_REQUEST':
      return { ...state, jobListingDelete: { ...state.jobListingDelete, loading: true } };
    case 'DELETE_JOB_LISTING_SUCCESS':
      return { ...state, jobListingDelete: { loading: false, data: action.payload, error: {} } };
    case 'DELETE_JOB_LISTING_FAILURE':
      return { ...state, jobListingDelete: { loading: false, data: {}, error: action.payload } };
    // Job Listing by ID
    case 'JOB_LISTING_ID_REQUEST':
      return { ...state, jobListingById: { ...state.jobListingById, loading: true } };
    case 'JOB_LISTING_ID_SUCCESS':
      return { ...state, jobListingById: { loading: false, data: action.payload, error: {} } };
    case 'JOB_LISTING_ID_FAILURE':
      return { ...state, jobListingById: { loading: false, data: {}, error: action.payload } };
    // Categories
    case 'CATEGORY_REQUEST':
      return { ...state, categories: { ...state.categories, loading: true } };
    case 'CATEGORY_SUCCESS':
      return { ...state, categories: { loading: false, data: action.payload, error: {} } };
    case 'CATEGORY_FAILURE':
      return { ...state, categories: { loading: false, data: {}, error: action.payload } };
    // Subcategories
    case 'SUBCATEGORY_REQUEST':
      return { ...state, subcategories: { ...state.subcategories, loading: true } };
    case 'SUBCATEGORY_SUCCESS':
      return { ...state, subcategories: { loading: false, data: action.payload, error: {} } };
    case 'SUBCATEGORY_FAILURE':
      return { ...state, subcategories: { loading: false, data: {}, error: action.payload } };
    // Artisan Job Listings
    case 'ARTISAN_JOB_LISTING_REQUEST':
      return { ...state, artisanJobListings: { ...state.artisanJobListings, loading: true } };
    case 'ARTISAN_JOB_LISTING_SUCCESS':
      return { ...state, artisanJobListings: { loading: false, data: action.payload, error: {} } };
    case 'ARTISAN_JOB_LISTING_FAILURE':
      return { ...state, artisanJobListings: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function JobListingProvider({ children }) {
  const [state, dispatch] = useReducer(jobListingReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/JobListing';

  // Add call guards to prevent duplicate API calls
  const callGuards = useRef({
    fetchAllJobListings: false,
    fetchJobListingById: new Map(),
    fetchArtisanJobListings: new Map(), // Map to track calls by subcategory combination
    fetchCategories: false,
    lastFetchTimestamps: new Map()
  });

  // Fetch all job listings (for artisan filtering)
  const fetchAllJobListings = useCallback(async () => {
    dispatch({ type: 'JOB_LISTING_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${baseUrl}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'JOB_LISTING_SUCCESS', payload: response.data });
    } catch (error) {
      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }
      dispatch({ type: 'JOB_LISTING_FAILURE', payload: error.response?.data?.message || error.message });
    }
  }, []);

  // Fetch all job listings
  const fetchJobListings = useCallback(async (filters = {}) => {
    dispatch({ type: 'JOB_LISTING_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const validFilters = Object.entries(filters)
        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => {
          const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
          acc[apiKey] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {});
      const response = await axios.get(`${baseUrl}/customer`, {
        headers: { Authorization: `Bearer ${token}` },
        params: validFilters
      });
      dispatch({ type: 'JOB_LISTING_SUCCESS', payload: response.data });
    } catch (error) {
      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }
      dispatch({ type: 'JOB_LISTING_FAILURE', payload: error.response?.data?.message || error.message });
    }
  }, []); // Fetch job by ID
  const fetchJobListingById = useCallback(
    async (id) => {
      console.log('🚀 fetchJobListingById called with ID:', id);
      console.log('🚀 fetchJobListingById ID type:', typeof id);
      console.log('🚀 fetchJobListingById ID length:', id?.length);

      dispatch({ type: 'JOB_LISTING_ID_REQUEST' });
      try {
        const token = getAuthToken();
        console.log('Auth token for fetchJobListingById:', token ? 'Token exists' : 'No token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('🌐 Making request to:', `${baseUrl}/${id}`);
        const response = await axios.get(`${baseUrl}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ fetchJobListingById success:', response.data);
        callGuards.current.lastFetchTimestamps.set(`job_${id}`, Date.now());
        dispatch({ type: 'JOB_LISTING_ID_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('fetchJobListingById error:', error.response?.status, error.response?.data);

        // Handle authentication errors first
        if (handleAuthError(error)) {
          return; // Early return if redirected to login
        }

        // Handle 500 Internal Server Error gracefully
        if (error.response?.status === 500) {
          console.warn('Server error when fetching job details. Job may not exist or server issue.');
          dispatch({
            type: 'JOB_LISTING_ID_FAILURE',
            payload: {
              message: 'Unable to load job details. The job may no longer be available.',
              jobId: id, // Include the job ID so Dashboard can mark it as failed
              status: 500
            }
          });
          return;
        }

        dispatch({
          type: 'JOB_LISTING_ID_FAILURE',
          payload: {
            message: error.response?.data?.message || error.message,
            jobId: id, // Include the job ID
            status: error.response?.status
          }
        });
        throw error;
      } finally {
        callGuards.current.fetchJobListingById.delete(id);
      }
    },
    [state.jobListingById.data, state.jobListingById.loading]
  );

  // Post a job listing
  const postJobListing = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'POST_JOB_LISTING_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the FormData contents for debugging
      console.log('PostJob Debug - FormData entries:');
      for (let [key, value] of postState.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post(`${baseUrl}/`, postState, {
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type manually for FormData - let axios handle it
        }
      });
      dispatch({ type: 'POST_JOB_LISTING_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('PostJob Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message
      });

      // Log specific validation errors if available
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          console.error(`${field}:`, messages);
        });
      }

      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }

      dispatch({ type: 'POST_JOB_LISTING_FAILURE', payload: error?.response?.data || error.message });
      if (onError) onError();
    }
  }, []);

  // Delete a job listing
  const deleteJobListing = useCallback(async (id, onSuccess) => {
    dispatch({ type: 'DELETE_JOB_LISTING_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'DELETE_JOB_LISTING_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }

      dispatch({ type: 'DELETE_JOB_LISTING_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch categories with call guard
  const fetchCategories = useCallback(async () => {
    // Check if already loading or has recent data
    if (state.categories.loading) {
      return;
    }

    if (callGuards.current.fetchCategories) {
      return;
    }

    // Check if we have recent data (10 minutes cache for categories)
    const lastFetchTime = callGuards.current.lastFetchTimestamps.get('categories');
    if (lastFetchTime && Date.now() - lastFetchTime < 600000) {
      // 10 minutes
      return;
    }

    callGuards.current.fetchCategories = true;

    dispatch({ type: 'CATEGORY_REQUEST' });
    try {
      const res = await axios.get('https://distrolink-001-site1.anytempurl.com/api/ArtisanCategory');
      dispatch({ type: 'CATEGORY_SUCCESS', payload: res.data });
      callGuards.current.lastFetchTimestamps.set('categories', Date.now());
    } catch (error) {
      dispatch({ type: 'CATEGORY_FAILURE', payload: error?.response?.data?.message || error.message });
    } finally {
      callGuards.current.fetchCategories = false;
    }
  }, [state.categories.loading]);

  // Fetch subcategories
  const fetchSubcategories = useCallback(async (categoryId) => {
    dispatch({ type: 'SUBCATEGORY_REQUEST' });
    try {
      const res = await axios.get(
        `https://distrolink-001-site1.anytempurl.com/api/ArtisanSubcategory/category/${categoryId}`
      );
      dispatch({ type: 'SUBCATEGORY_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'SUBCATEGORY_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch artisan job listings with call guard
  const fetchArtisanJobListings = useCallback(
    async (artisanSubcategoryIds = [], forceRefresh = false) => {
      // Create a unique key for this combination of subcategory IDs (removed limit from cache key)
      const cacheKey = `${JSON.stringify(artisanSubcategoryIds.sort())}`;

      // Check if we already have valid data for this combination
      const hasValidData =
        state.artisanJobListings.data &&
        state.artisanJobListings.data.data &&
        Array.isArray(state.artisanJobListings.data.data.items);
      const isCurrentlyLoading = state.artisanJobListings.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get(`artisan_jobs_${cacheKey}`) &&
        Date.now() - callGuards.current.lastFetchTimestamps.get(`artisan_jobs_${cacheKey}`) < 120000; // 2 minutes cache

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        console.log('✅ fetchArtisanJobListings: Using cached job listings data for:', cacheKey);
        return state.artisanJobListings.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        console.log('⏳ fetchArtisanJobListings: Already loading, skipping duplicate call for:', cacheKey);
        return state.artisanJobListings.data;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        console.log('⏰ fetchArtisanJobListings: Recent fetch detected, skipping duplicate call for:', cacheKey);
        return state.artisanJobListings.data;
      }

      // Prevent concurrent calls for the same combination
      if (callGuards.current.fetchArtisanJobListings.get(cacheKey)) {
        console.log('🚫 fetchArtisanJobListings: Call already in progress for:', cacheKey);
        return state.artisanJobListings.data;
      }

      callGuards.current.fetchArtisanJobListings.set(cacheKey, true);
      dispatch({ type: 'ARTISAN_JOB_LISTING_REQUEST' });
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('🔍 JobListingContext: Fetching all jobs with subcategory IDs:', artisanSubcategoryIds);

        // Fetch all jobs and filter client-side based on artisan subcategories
        const res = await axios.get(`${baseUrl}/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('🔍 JobListingContext: Raw API response:', res.data);

        // Filter jobs based on artisan subcategory IDs if provided
        let filteredData = res.data;
        if (artisanSubcategoryIds.length > 0 && res.data?.data?.items) {
          console.log('🔍 JobListingContext: Filtering jobs...');
          console.log('🔍 JobListingContext: Original items count:', res.data.data.items.length);
          console.log('🔍 JobListingContext: Artisan subcategory IDs:', artisanSubcategoryIds);

          const filteredItems = res.data.data.items.filter((job) => {
            const matches = artisanSubcategoryIds.includes(job.artisanSubcategoryId);
            console.log(
              `🔍 Job ${job.id} (${job.title}): artisanSubcategoryId=${job.artisanSubcategoryId}, matches=${matches}`
            );
            return matches;
          });

          console.log('🔍 JobListingContext: Filtered items count:', filteredItems.length);

          // Return all filtered items without any limit
          filteredData = {
            ...res.data,
            data: {
              ...res.data.data,
              items: filteredItems,
              totalCount: filteredItems.length
            }
          };
        } else {
          console.log('🔍 JobListingContext: No filtering applied - returning all jobs');
          // Return all items without any limit
        }

        console.log('🔍 JobListingContext: Final data being dispatched:', filteredData);
        callGuards.current.lastFetchTimestamps.set(`artisan_jobs_${cacheKey}`, Date.now());
        dispatch({ type: 'ARTISAN_JOB_LISTING_SUCCESS', payload: filteredData });
        return filteredData;
      } catch (error) {
        console.error('❌ JobListingContext: Error fetching jobs:', error);
        // Handle authentication errors first
        if (handleAuthError(error)) {
          return; // Early return if redirected to login
        }

        dispatch({ type: 'ARTISAN_JOB_LISTING_FAILURE', payload: error?.response?.data?.message || error.message });
        throw error;
      } finally {
        callGuards.current.fetchArtisanJobListings.delete(cacheKey);
      }
    },
    [state.artisanJobListings.data, state.artisanJobListings.loading]
  );

  return (
    <JobListingContext.Provider
      value={{
        state,
        fetchJobListings,
        fetchAllJobListings,
        fetchJobListingById,
        postJobListing,
        deleteJobListing,
        fetchCategories,
        fetchSubcategories,
        fetchArtisanJobListings
      }}
    >
      {children}
    </JobListingContext.Provider>
  );
}

export function useJobListings() {
  const context = useContext(JobListingContext);
  if (!context) {
    throw new Error('useJobListings must be used within a JobListingProvider');
  }
  return context;
}
