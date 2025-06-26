import React, { useMemo } from 'react';
import { AuthContext } from './context';

// Mock user data - can be easily replaced with real auth later
const MOCK_USER = {
  uid: '1',
  email: 'user@example.com',
  displayName: 'Demo User',
  photoURL: '/avatars/avatar.png'
};

export const AuthProvider = ({ children }) => {
  // Mock implementation that can be easily replaced
  const auth = useMemo(() => ({
    currentUser: MOCK_USER, // Always return mock user
    login: async () => {
      console.log('Login called - replace with actual auth implementation');
      return Promise.resolve();
    },
    logout: async () => {
      console.log('Logout called - replace with actual auth implementation');
      return Promise.resolve();
    },
  }), []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
