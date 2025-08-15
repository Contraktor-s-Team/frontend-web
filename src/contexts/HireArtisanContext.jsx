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

  const hireArtisan = async (formData, artisanId, price, onSuccess, onError) => {
    try {
      if (!artisanId) {
        throw new Error('Artisan ID is required');
      }

      // Ensure price is a valid number
      const validPrice = parseFloat(price);
      if (isNaN(validPrice)) {
        throw new Error('Valid price is required');
      }

      // Use the correct API endpoint
      // Changed from /api/ArtisanDiscovery/hire-artisan to /api/jobs/hire-artisan
      const url = `/api/jobs/hire-artisan`;

      // Add artisanId and price to formData instead of URL parameters
      formData.append('ArtisanId', artisanId);
      formData.append('Price', validPrice.toString());

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 || response.status === 201) {
        onSuccess && onSuccess(response.data);
      } else {
        onError && onError(response.data);
      }
    } catch (error) {
      console.error('HireArtisan Error Details:', error);
      onError && onError(error);
    }
  };

  return <HireArtisanContext.Provider value={{ state, dispatch, hireArtisan }}>{children}</HireArtisanContext.Provider>;
}

export function useHireArtisan() {
  const context = useContext(HireArtisanContext);
  if (!context) {
    throw new Error('useHireArtisan must be used within a HireArtisanProvider');
  }
  return context;
}
