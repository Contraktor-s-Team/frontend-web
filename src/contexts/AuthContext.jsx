import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

const initialState = {
  login: { loading: false, data: {}, error: {}, isAuthenticated: false, token: null },
  register: { loading: false, data: {}, error: {} },
  forgotPassword: { loading: false, data: {}, error: {} },
  resetPassword: { loading: false, data: {}, error: {} },
  validate: { loading: false, data: {}, error: {} },
  validateEmail: { loading: false, data: {}, error: {} },
  confirmEmail: { loading: false, data: {}, error: {} }
};

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    // Login
    case 'LOGIN_REQUEST':
      return { ...state, login: { ...state.login, loading: true } };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        login: { loading: false, data: action.payload, error: {}, isAuthenticated: true, token: action.payload.token }
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        login: { loading: false, data: {}, error: action.payload, isAuthenticated: false, token: null }
      };
    case 'LOGOUT':
      return { ...state, login: { ...state.login, isAuthenticated: false, token: null, data: {}, error: {} } };
    // Register
    case 'REGISTER_REQUEST':
      return { ...state, register: { ...state.register, loading: true } };
    case 'REGISTER_SUCCESS':
      return { ...state, register: { loading: false, data: action.payload, error: {} } };
    case 'REGISTER_FAILURE':
      return { ...state, register: { loading: false, data: {}, error: action.payload } };
    // Forgot Password
    case 'FORGOT_PASSWORD_REQUEST':
      return { ...state, forgotPassword: { ...state.forgotPassword, loading: true } };
    case 'FORGOT_PASSWORD_SUCCESS':
      return { ...state, forgotPassword: { loading: false, data: action.payload, error: {} } };
    case 'FORGOT_PASSWORD_FAILURE':
      return { ...state, forgotPassword: { loading: false, data: {}, error: action.payload } };
    // Reset Password
    case 'RESET_PASSWORD_REQUEST':
      return { ...state, resetPassword: { ...state.resetPassword, loading: true } };
    case 'RESET_PASSWORD_SUCCESS':
      return { ...state, resetPassword: { loading: false, data: action.payload, error: {} } };
    case 'RESET_PASSWORD_FAILURE':
      return { ...state, resetPassword: { loading: false, data: {}, error: action.payload } };
    // Validate Reset Code
    case 'VALIDATE_REQUEST':
      return { ...state, validate: { ...state.validate, loading: true } };
    case 'VALIDATE_SUCCESS':
      return { ...state, validate: { loading: false, data: action.payload, error: {} } };
    case 'VALIDATE_FAILURE':
      return { ...state, validate: { loading: false, data: {}, error: action.payload } };
    // Validate Email
    case 'VALIDATE_EMAIL_REQUEST':
      return { ...state, validateEmail: { ...state.validateEmail, loading: true } };
    case 'VALIDATE_EMAIL_SUCCESS':
      return { ...state, validateEmail: { loading: false, data: action.payload, error: {} } };
    case 'VALIDATE_EMAIL_FAILURE':
      return { ...state, validateEmail: { loading: false, data: {}, error: action.payload } };
    // Confirm Email
    case 'CONFIRM_EMAIL_REQUEST':
      return { ...state, confirmEmail: { ...state.confirmEmail, loading: true } };
    case 'CONFIRM_EMAIL_SUCCESS':
      return { ...state, confirmEmail: { loading: false, data: action.payload, error: {} } };
    case 'CONFIRM_EMAIL_FAILURE':
      return { ...state, confirmEmail: { loading: false, data: {}, error: action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/auth';

  // Login
  const login = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/login`, postState);
      console.log('Login response:', res.data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      localStorage.setItem('auth', JSON.stringify(res.data));
      console.log('Stored in localStorage:', JSON.stringify(res.data));
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // External Login
  const externalLogin = useCallback(async (providerName, onSuccess, onError) => {
    let provider;
    if (providerName === 'Google') provider = googleProvider;
    else if (providerName === 'Facebook') provider = facebookProvider;
    else throw new Error('Unsupported provider');
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result._tokenResponse.oauthIdToken;
      const password = crypto.randomUUID();
      const payload = { provider: providerName, token, password };
      const response = await axios.post(`${baseUrl}/external-login`, payload);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      localStorage.setItem('auth', JSON.stringify(response.data));
      if (onSuccess) onSuccess();
      return response.data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
  }, []);

  // Register
  const register = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/register`, postState);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      localStorage.setItem('auth', JSON.stringify(res.data));
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // External Register
  const externalRegister = useCallback(async (providerName, onSuccess, onError) => {
    let provider;
    if (providerName === 'Google') provider = googleProvider;
    else if (providerName === 'Facebook') provider = facebookProvider;
    else throw new Error('Unsupported provider');
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result._tokenResponse.oauthIdToken;
      const password = crypto.randomUUID();
      const payload = { provider: providerName, token, password };
      const response = await axios.post(`${baseUrl}/external-register`, payload);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
      localStorage.setItem('auth', JSON.stringify(response.data));
      if (onSuccess) onSuccess();
      return response.data;
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
      throw error;
    }
  }, []);

  // Forgot Password
  const forgotPassword = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'FORGOT_PASSWORD_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/forgot-password`, postState);
      dispatch({ type: 'FORGOT_PASSWORD_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'FORGOT_PASSWORD_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Reset Password
  const resetPassword = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'RESET_PASSWORD_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/reset-password`, postState);
      dispatch({ type: 'RESET_PASSWORD_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Validate Reset Code
  const validate = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'VALIDATE_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/validate-reset-code`, postState);
      dispatch({ type: 'VALIDATE_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'VALIDATE_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Validate Email
  const validateEmail = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'VALIDATE_EMAIL_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/validate-email`, postState, {
        headers: { 'Content-Type': 'application/json' }
      });
      dispatch({ type: 'VALIDATE_EMAIL_SUCCESS', payload: res.data });
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'VALIDATE_EMAIL_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  // Confirm Email
  const confirmEmail = useCallback(async (postState, onSuccess, onError) => {
    dispatch({ type: 'CONFIRM_EMAIL_REQUEST' });
    try {
      const res = await axios.post(`${baseUrl}/confirm-email-validation`, postState);
      dispatch({ type: 'CONFIRM_EMAIL_SUCCESS', payload: res.data });
      // Don't remove auth token - user should stay logged in after email confirmation
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch({ type: 'CONFIRM_EMAIL_FAILURE', payload: error?.response?.data?.message || error.message });
      if (onError) onError();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        externalLogin,
        logout,
        register,
        externalRegister,
        forgotPassword,
        resetPassword,
        validate,
        validateEmail,
        confirmEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
