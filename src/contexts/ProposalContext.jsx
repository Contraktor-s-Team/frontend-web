import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  proposalPost: { loading: false, data: {}, error: {} },
  jobProposal: { loading: false, data: {}, error: {} },
  artisanProposal: { loading: false, data: {}, error: {} },
  negotiateProposal: { loading: false, data: {}, error: {} },
  negotiate: { loading: false, data: {}, error: {} }
};

const ProposalContext = createContext();

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

  // Post a proposal
  const postProposal = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'POST_PROPOSAL_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(`${baseUrl}/`, postState, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'POST_PROPOSAL_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'POST_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Fetch job proposals
  const fetchJobProposal = useCallback(async (id) => {
    dispatch({ type: 'JOB_PROPOSAL_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/joblisting/${id}`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'JOB_PROPOSAL_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'JOB_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch artisan proposals
  const fetchArtisanProposal = useCallback(async () => {
    dispatch({ type: 'ARTISAN_PROPOSAL_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/Artisan`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ARTISAN_PROPOSAL_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'ARTISAN_PROPOSAL_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch negotiation
  const fetchNegotiation = useCallback(async (id) => {
    dispatch({ type: 'GET_NEGOTIATION_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/${id}/negotiations`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'GET_NEGOTIATION_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'GET_NEGOTIATION_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Negotiate proposal
  const negotiateProposal = useCallback(async (id, postState, onSuccess, onError) => {
    dispatch({ type: 'NEGOTIATE_PROPOSAL_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(`${baseUrl}/${id}/negotiate`, postState, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'NEGOTIATE_PROPOSAL_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
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
