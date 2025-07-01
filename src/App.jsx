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
import { Provider } from 'react-redux';
import { store } from './store';

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
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerificationCode />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App