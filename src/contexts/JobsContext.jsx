import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  jobs: { loading: false, data: {}, error: {} },
  jobPost: { loading: false, data: {}, error: {} },
  jobDelete: { loading: false, data: {}, error: {} },
  jobById: { loading: false, data: {}, error: {} },
  categories: { loading: false, data: {}, error: {} },
  subcategories: { loading: false, data: {}, error: {} },
  artisanJobs: { loading: false, data: {}, error: {} }
};

const JobsContext = createContext();

function jobsReducer(state, action) {
  switch (action.type) {
    // Jobs
    case 'JOB_REQUEST':
      return { ...state, jobs: { ...state.jobs, loading: true } };
    case 'JOB_SUCCESS':
      return { ...state, jobs: { loading: false, data: action.payload, error: {} } };
    case 'JOB_FAILURE':
      return { ...state, jobs: { loading: false, data: {}, error: action.payload } };
    // Post Job
    case 'POST_JOB_REQUEST':
      return { ...state, jobPost: { ...state.jobPost, loading: true } };
    case 'POST_JOB_SUCCESS':
      return { ...state, jobPost: { loading: false, data: action.payload, error: {} } };
    case 'POST_JOB_FAILURE':
      return { ...state, jobPost: { loading: false, data: {}, error: action.payload } };
    // Delete Job
    case 'DELETE_JOB_REQUEST':
      return { ...state, jobDelete: { ...state.jobDelete, loading: true } };
    case 'DELETE_JOB_SUCCESS':
      return { ...state, jobDelete: { loading: false, data: action.payload, error: {} } };
    case 'DELETE_JOB_FAILURE':
      return { ...state, jobDelete: { loading: false, data: {}, error: action.payload } };
    // Job by ID
    case 'JOB_ID_REQUEST':
      return { ...state, jobById: { ...state.jobById, loading: true } };
    case 'JOB_ID_SUCCESS':
      return { ...state, jobById: { loading: false, data: action.payload, error: {} } };
    case 'JOB_ID_FAILURE':
      return { ...state, jobById: { loading: false, data: {}, error: action.payload } };
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
    // Artisan Jobs
    case 'ARTISAN_JOB_REQUEST':
      return { ...state, artisanJobs: { ...state.artisanJobs, loading: true } };
    case 'ARTISAN_JOB_SUCCESS':
      return { ...state, artisanJobs: { loading: false, data: action.payload, error: {} } };
    case 'ARTISAN_JOB_FAILURE':
      return { ...state, artisanJobs: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(jobsReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/JobListing';

  // Fetch all jobs
  const fetchJobs = useCallback(async (filters = {}) => {
    dispatch({ type: 'JOB_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const validFilters = Object.entries(filters)
        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => {
          const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
          acc[apiKey] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {});
      const response = await axios.get(`${baseUrl}/customer`, {
        headers: { Authorization: `Bearer ${datas?.token}` },
        params: validFilters
      });
      dispatch({ type: 'JOB_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'JOB_FAILURE', payload: error.response?.data?.message || error.message });
    }
  }, []);

  // Fetch job by ID
  const fetchJobById = useCallback(async (id) => {
    dispatch({ type: 'JOB_ID_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'JOB_ID_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'JOB_ID_FAILURE', payload: error.response?.data?.message || error.message });
    }
  }, []);

  // Post a job
  const postJob = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'POST_JOB_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(`${baseUrl}/`, postState, {
        headers: {
          Authorization: `Bearer ${datas?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: 'POST_JOB_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'POST_JOB_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Delete a job
  const deleteJob = useCallback(async (id, onSuccess) => {
    dispatch({ type: 'DELETE_JOB_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'DELETE_JOB_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'DELETE_JOB_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    dispatch({ type: 'CATEGORY_REQUEST' });
    try {
      const res = await axios.get('https://distrolink-001-site1.anytempurl.com/api/ArtisanCategory');
      dispatch({ type: 'CATEGORY_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'CATEGORY_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

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

  // Fetch artisan jobs
  const fetchArtisanJobs = useCallback(async (subCategoryId) => {
    dispatch({ type: 'ARTISAN_JOB_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.get(`${baseUrl}/subcategory/${subCategoryId}`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'ARTISAN_JOB_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'ARTISAN_JOB_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  return (
    <JobsContext.Provider
      value={{
        state,
        fetchJobs,
        fetchJobById,
        postJob,
        deleteJob,
        fetchCategories,
        fetchSubcategories,
        fetchArtisanJobs
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
