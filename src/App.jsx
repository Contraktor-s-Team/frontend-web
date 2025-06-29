import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import PostJobLayout from './pages/PostJob/PostJobLayout';
import DescribeJob from './pages/PostJob/DescribeJob';
import TimeLocation from './pages/PostJob/TimeLocation';
import ReviewPost from './pages/PostJob/ReviewPost';

// Modals
import NotificationsModal from './components/Notifications/NotificationsModal';

// Auth context
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext/useAuth';
import ScrollToTop from './components/ScrollToTop';

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

// Route-based modal wrapper component
const AppRoutes = () => {
  const location = useLocation();
  
  // Use the current location as the "under" location or the saved background location from state
  const backgroundLocation = location.state?.backgroundLocation || location;
  
  return (
    <AuthProvider>
      <Routes location={backgroundLocation}>
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
          {/* Post a Job multi-step nested routes */}
          <Route path="/dashboard/post-job" element={<PostJobLayout />}>
            <Route index element={<Navigate to="describe" replace />} />
            <Route path="describe" element={<DescribeJob />} />
            <Route path="time-location" element={<TimeLocation />} />
            <Route path="review" element={<ReviewPost />} />
          </Route>
        </Route>
        
        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Modal Routes - shown on top of the main UI when URL matches */}
      {location !== backgroundLocation && (
        <Routes>
          <Route path="/notifications" element={<NotificationsModal />} />
        </Routes>
      )}
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App