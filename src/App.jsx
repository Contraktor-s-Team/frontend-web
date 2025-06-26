import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages
import Signup from './pages/Onboarding/Signup';
import Login from './pages/Onboarding/Login';
import ForgotPassword from './pages/Onboarding/ForgotPassword';
import VerificationCode from './pages/Onboarding/VerificationCode';
import CreateNewPassword from './pages/Onboarding/CreateNewPassword';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';
import FindArtisans from './pages/FindArtisans/FindArtisans';
import MyJobs from './pages/MyJobs/MyJobs';
import Messages from './pages/Messages/Messages';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';
import HelpCentre from './pages/HelpCentre/HelpCentre';

// Auth context
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext/useAuth';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Layout Wrapper for protected routes
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      {children}
    </MainLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerificationCode />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
          
          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artisans" element={<FindArtisans />} />
            <Route path="/jobs" element={<MyJobs />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/help" element={<HelpCentre />} />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App