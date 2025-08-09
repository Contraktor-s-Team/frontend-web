import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  allArtisans: { loading: false, data: {}, error: {} },
  artisan: { loading: false, data: {}, error: {} },
  artisanAssignment: { loading: false, data: {}, error: {} }
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

  // Fetch all artisans
  const fetchAllArtisans = useCallback(async () => {
    dispatch({ type: 'ALL_ARTISAN_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/api/ArtisanDiscovery`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ALL_ARTISAN_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'ALL_ARTISAN_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch artisan by id
  const fetchArtisanById = useCallback(async (id) => {
    dispatch({ type: 'ARTISAN_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/api/ArtisanDiscovery/GetArtisanById?id=${id}`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ARTISAN_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'ARTISAN_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

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
        postArtisanAssignment
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
