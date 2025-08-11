import React, { createContext, useReducer, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { handleAuthError, getAuthToken } from '../utils/authUtils';

const initialState = {
  proposalPost: { loading: false, data: {}, error: {} },
  jobProposal: { loading: false, data: {}, error: {} },
  artisanProposal: { loading: false, data: {}, error: {} },
  negotiateProposal: { loading: false, data: {}, error: {} },
  negotiate: { loading: false, data: {}, error: {} }
};

const ProposalContext = createContext(null);

function proposalReducer(state, action) {
  switch (action.type) {
    case 'POST_PROPOSAL_REQUEST':
      return { ...state, proposalPost: { ...state.proposalPost, loading: true } };
    case 'POST_PROPOSAL_SUCCESS':
      return { ...state, proposalPost: { loading: false, data: action.payload, error: {} } };
    case 'POST_PROPOSAL_FAILURE':
      return { ...state, proposalPost: { loading: false, data: {}, error: action.payload } };
    case 'JOB_PROPOSAL_REQUEST':
      return { ...state, jobProposal: { ...state.jobProposal, loading: true } };
    case 'JOB_PROPOSAL_SUCCESS':
      return { ...state, jobProposal: { loading: false, data: action.payload, error: {} } };
    case 'JOB_PROPOSAL_FAILURE':
      return { ...state, jobProposal: { loading: false, data: {}, error: action.payload } };
    case 'ARTISAN_PROPOSAL_REQUEST':
      return { ...state, artisanProposal: { ...state.artisanProposal, loading: true } };
    case 'ARTISAN_PROPOSAL_SUCCESS':
      return { ...state, artisanProposal: { loading: false, data: action.payload, error: {} } };
    case 'ARTISAN_PROPOSAL_FAILURE':
      return { ...state, artisanProposal: { loading: false, data: {}, error: action.payload } };
    case 'NEGOTIATE_PROPOSAL_REQUEST':
      return { ...state, negotiateProposal: { ...state.negotiateProposal, loading: true } };
    case 'NEGOTIATE_PROPOSAL_SUCCESS':
      return { ...state, negotiateProposal: { loading: false, data: action.payload, error: {} } };
    case 'NEGOTIATE_PROPOSAL_FAILURE':
      return { ...state, negotiateProposal: { loading: false, data: {}, error: action.payload } };
    case 'GET_NEGOTIATION_REQUEST':
      return { ...state, negotiate: { ...state.negotiate, loading: true } };
    case 'GET_NEGOTIATION_SUCCESS':
      return { ...state, negotiate: { loading: false, data: action.payload, error: {} } };
    case 'GET_NEGOTIATION_FAILURE':
      return { ...state, negotiate: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function ProposalProvider({ children }) {
  const [state, dispatch] = useReducer(proposalReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Proposal';

  // Add call guards to prevent duplicate API calls
  const callGuards = useRef({
    fetchArtisanProposal: false,
    fetchJobProposal: new Map(),
    fetchNegotiation: new Map(),
    lastFetchTimestamps: new Map()
  });

  // Post a proposal
  const postProposal = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'POST_PROPOSAL_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.post(`${baseUrl}/`, postState, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'POST_PROPOSAL_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }

      dispatch({ type: 'POST_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Fetch job proposals with call guard
  const fetchJobProposal = useCallback(
    async (id, forceRefresh = false) => {
      // Check if we already have valid data for this job proposal ID
      const hasValidData = state.jobProposal.data && state.jobProposal.data.data;
      const isCurrentlyLoading = state.jobProposal.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get(`job_proposal_${id}`) &&
        Date.now() - callGuards.current.lastFetchTimestamps.get(`job_proposal_${id}`) < 120000; // 2 minutes cache

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        console.log('✅ fetchJobProposal: Using cached job proposal data for ID:', id);
        return state.jobProposal.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        console.log('⏳ fetchJobProposal: Already loading, skipping duplicate call for ID:', id);
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        console.log('⏰ fetchJobProposal: Recent fetch detected, skipping duplicate call for ID:', id);
        return state.jobProposal.data;
      }

      // Prevent concurrent calls for the same job proposal ID
      if (callGuards.current.fetchJobProposal.get(id)) {
        console.log('🚫 fetchJobProposal: Call already in progress for ID:', id);
        return;
      }

      callGuards.current.fetchJobProposal.set(id, true);
      dispatch({ type: 'JOB_PROPOSAL_REQUEST' });
      try {
        const token = getAuthToken();
        console.log('Auth token for fetchJobProposal:', token ? 'Token exists' : 'No token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/joblisting/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        callGuards.current.lastFetchTimestamps.set(`job_proposal_${id}`, Date.now());
        dispatch({ type: 'JOB_PROPOSAL_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('fetchJobProposal error:', error.response?.status, error.response?.data);

        // Handle authentication errors first
        if (handleAuthError(error)) {
          return; // Early return if redirected to login
        }

        dispatch({ type: 'JOB_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
        throw error;
      } finally {
        callGuards.current.fetchJobProposal.delete(id);
      }
    },
    [state.jobProposal.data, state.jobProposal.loading]
  );

  // Fetch artisan proposals with call guard
  const fetchArtisanProposal = useCallback(
    async (forceRefresh = false) => {
      // Check if we already have valid data and it's not currently loading
      const hasValidData =
        state.artisanProposal.data &&
        Array.isArray(state.artisanProposal.data.data) &&
        state.artisanProposal.data.data.length >= 0; // Even empty array is valid data
      const isCurrentlyLoading = state.artisanProposal.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get('artisan_proposals') &&
        Date.now() - callGuards.current.lastFetchTimestamps.get('artisan_proposals') < 180000; // 3 minutes cache

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        console.log('✅ fetchArtisanProposal: Using cached proposal data');
        return state.artisanProposal.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        console.log('⏳ fetchArtisanProposal: Already loading, skipping duplicate call');
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        console.log('⏰ fetchArtisanProposal: Recent fetch detected, skipping duplicate call');
        return state.artisanProposal.data;
      }

      // Prevent concurrent calls
      if (callGuards.current.fetchArtisanProposal) {
        console.log('🚫 fetchArtisanProposal: Call already in progress, skipping duplicate');
        return;
      }

      callGuards.current.fetchArtisanProposal = true;
      dispatch({ type: 'ARTISAN_PROPOSAL_REQUEST' });
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('📡 Fetching artisan proposals from:', `${baseUrl}/Artisan`);
        const response = await axios.get(`${baseUrl}/Artisan`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Artisan proposals response:', response.data);
        callGuards.current.lastFetchTimestamps.set('artisan_proposals', Date.now());
        dispatch({ type: 'ARTISAN_PROPOSAL_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('❌ fetchArtisanProposal error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: `${baseUrl}/Artisan`
        });

        // Handle authentication errors first
        if (handleAuthError(error)) {
          return; // Early return if redirected to login
        }

        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error.message;
        dispatch({ type: 'ARTISAN_PROPOSAL_FAILURE', payload: errorMessage });
        throw error;
      } finally {
        callGuards.current.fetchArtisanProposal = false;
      }
    },
    [state.artisanProposal.data, state.artisanProposal.loading]
  );

  // Fetch negotiation with call guard
  const fetchNegotiation = useCallback(
    async (id, forceRefresh = false) => {
      // Check if we already have valid data for this negotiation ID
      const hasValidData = state.negotiate.data && state.negotiate.data.data;
      const isCurrentlyLoading = state.negotiate.loading;
      const hasRecentFetch =
        callGuards.current.lastFetchTimestamps.get(`negotiation_${id}`) &&
        Date.now() - callGuards.current.lastFetchTimestamps.get(`negotiation_${id}`) < 120000; // 2 minutes cache

      if (!forceRefresh && hasValidData && !isCurrentlyLoading) {
        console.log('✅ fetchNegotiation: Using cached negotiation data for ID:', id);
        return state.negotiate.data;
      }

      if (!forceRefresh && isCurrentlyLoading) {
        console.log('⏳ fetchNegotiation: Already loading, skipping duplicate call for ID:', id);
        return;
      }

      if (!forceRefresh && hasRecentFetch && !isCurrentlyLoading) {
        console.log('⏰ fetchNegotiation: Recent fetch detected, skipping duplicate call for ID:', id);
        return state.negotiate.data;
      }

      // Prevent concurrent calls for the same negotiation ID
      if (callGuards.current.fetchNegotiation.get(id)) {
        console.log('🚫 fetchNegotiation: Call already in progress for ID:', id);
        return;
      }

      callGuards.current.fetchNegotiation.set(id, true);
      dispatch({ type: 'GET_NEGOTIATION_REQUEST' });
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/${id}/negotiations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        callGuards.current.lastFetchTimestamps.set(`negotiation_${id}`, Date.now());
        dispatch({ type: 'GET_NEGOTIATION_SUCCESS', payload: response.data });
        return response.data;
      } catch (error) {
        // Handle authentication errors first
        if (handleAuthError(error)) {
          return; // Early return if redirected to login
        }

        dispatch({ type: 'GET_NEGOTIATION_FAILURE', payload: error?.response?.data?.message || error.message });
        throw error;
      } finally {
        callGuards.current.fetchNegotiation.delete(id);
      }
    },
    [state.negotiate.data, state.negotiate.loading]
  );

  // Negotiate proposal
  const negotiateProposal = useCallback(async (id, postState, onSuccess, onError) => {
    dispatch({ type: 'NEGOTIATE_PROPOSAL_REQUEST' });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.post(`${baseUrl}/${id}/negotiate`, postState, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'NEGOTIATE_PROPOSAL_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Handle authentication errors first
      if (handleAuthError(error)) {
        return; // Early return if redirected to login
      }

      dispatch({ type: 'NEGOTIATE_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  return (
    <ProposalContext.Provider
      value={{
        state,
        postProposal,
        fetchJobProposal,
        fetchArtisanProposal,
        fetchNegotiation,
        negotiateProposal
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposal() {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error('useProposal must be used within a ProposalProvider');
  }
  return context;
}
