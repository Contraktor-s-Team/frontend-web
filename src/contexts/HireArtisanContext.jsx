import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';
import { handleAuthError, getAuthToken } from '../utils/authUtils';

const initialState = {
  jobTitle: '',
  category: '',
  description: '',
  photos: [null, null, null],
  fileUrls: [null, null, null],
  fileTypes: [null, null, null],
  date: '',
  time: '',
  urgent: false,
  address: {
    street: '',
    landmark: '',
    city: '',
    lga: '',
    state: ''
  },
  artisan: null,
  hireArtisan: { loading: false, data: {}, error: {} }
};

function hireArtisanReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_JOB_DATA':
      return { ...state, ...action.payload };
    case 'RESET_JOB_DATA':
      return initialState;
    case 'UPDATE_JOB_TITLE':
      return { ...state, jobTitle: action.payload };
    case 'UPDATE_CATEGORY':
      return { ...state, category: action.payload };
    case 'UPDATE_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'UPDATE_PHOTOS':
      return { ...state, photos: action.payload };
    case 'UPDATE_FILE_URLS':
      return { ...state, fileUrls: action.payload };
    case 'UPDATE_FILE_TYPES':
      return { ...state, fileTypes: action.payload };
    case 'UPDATE_DATE':
      return { ...state, date: action.payload };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload };
    case 'UPDATE_URGENT':
      return { ...state, urgent: action.payload };
    case 'UPDATE_ADDRESS':
      return { ...state, address: { ...state.address, ...action.payload } };
    case 'SET_ARTISAN_DETAILS':
      return { ...state, artisan: action.payload };
    // Hire Artisan API actions
    case 'HIRE_ARTISAN_REQUEST':
      return { ...state, hireArtisan: { ...state.hireArtisan, loading: true } };
    case 'HIRE_ARTISAN_SUCCESS':
      return { ...state, hireArtisan: { loading: false, data: action.payload, error: {} } };
    case 'HIRE_ARTISAN_FAILURE':
      return { ...state, hireArtisan: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

const HireArtisanContext = createContext();

export function HireArtisanProvider({ children }) {
  const [state, dispatch] = useReducer(hireArtisanReducer, initialState);

  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api';

  const hireArtisan = useCallback(async (postState, artisanId, price, onSuccess, onError) => {
    dispatch({ type: 'HIRE_ARTISAN_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the FormData contents for debugging
      console.log('Hire Artisan Debug - FormData entries:');
      for (let [key, value] of postState.entries()) {
        console.log(`${key}:`, value);
      }

      // Build URL with artisanId and price as query parameters
      const url = `${baseUrl}/ArtisanDiscovery?artisanId=${artisanId}&price=${price}`;

      const res = await axios.post(url, postState, {
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type manually for FormData - let axios handle it
        }
      });

      console.log('✅ HireArtisan Success Response:', res.data);
      dispatch({ type: 'HIRE_ARTISAN_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('HireArtisan Error Details:', {
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

      dispatch({ type: 'HIRE_ARTISAN_FAILURE', payload: error?.response?.data || error.message });
      if (onError) onError();
    }
  }, []);

  return <HireArtisanContext.Provider value={{ state, dispatch, hireArtisan }}>{children}</HireArtisanContext.Provider>;
}

export function useHireArtisan() {
  const context = useContext(HireArtisanContext);
  if (!context) {
    throw new Error('useHireArtisan must be used within a HireArtisanProvider');
  }
  return context;
}
