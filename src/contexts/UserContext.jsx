import React, { createContext, useReducer, useContext, useCallback } from 'react';
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

  // Fetch user by email
  const fetchUserByEmail = useCallback(async (email) => {
    dispatch({ type: 'USER_EMAIL_REQUEST' });
    try {
      const response = await axios.get(`${baseUrl}/by-email?email=${email}`);
      dispatch({ type: 'USER_EMAIL_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'USER_EMAIL_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    dispatch({ type: 'USER_REQUEST' });
    try {
      const datas = JSON.parse(localStorage.getItem('auth'));
      const response = await axios.get(`${baseUrl}/GetCurrentUser`, {
        headers: { Authorization: `Bearer ${datas?.token}` }
      });
      dispatch({ type: 'USER_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'USER_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

  // Fetch user by id
  const fetchUserById = useCallback(async (id) => {
    dispatch({ type: 'USER_REQUEST' });
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      dispatch({ type: 'USER_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'USER_FAILURE', payload: error?.response?.data?.message || error.message });
    }
  }, []);

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
      const res = await axios.post(`${baseUrl}/upload-picture`, postState);
      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        state,
        fetchUserByEmail,
        fetchCurrentUser,
        fetchUserById,
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
