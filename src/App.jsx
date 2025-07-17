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
// import store from './redux/store';
import JobDetails from './pages/MyJobs/JobDetails';

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

// Hire Artisan Flow
import { 
  HireArtisanLayout, 
  DescribeJob as HireArtisanDescribeJob, 
  TimeLocation as HireArtisanTimeLocation, 
  ReviewSubmit 
} from './pages/FindArtisans/HireArtisan';

// Modals
import NotificationsModal from './components/Notifications/NotificationsModal';

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './ProtectedRoute';
import ArtisanDetails from './pages/FindArtisans/ArtisanDetails';


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
    <>
        <Routes location={backgroundLocation}>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        
        {/* Protected Routes with MainLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/artisans" element={<Navigate to="/artisans/all" replace />} />
          <Route path="/artisans/:tab" element={<FindArtisans />} />
          <Route path="/artisans/:tab/:artisanId" element={<ArtisanDetails />} />
          {/* Nested hire-artisan routes within artisan details */}
          <Route path="/artisans/:tab/:artisanId/hire-artisan" element={<HireArtisanLayout />}>
            <Route index element={<Navigate to="describe" replace />} />
            <Route path="describe" element={<HireArtisanDescribeJob />} />
            <Route path="time-location" element={<HireArtisanTimeLocation />} />
            <Route path="review" element={<ReviewSubmit />} />
          </Route>
          <Route path="/jobs" element={<Navigate to="/jobs/ongoing" replace />} />
          <Route path="/jobs/:tab" element={<MyJobs />} />
          <Route path="/jobs/:tab/:jobId" element={<JobDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/help" element={<HelpCentre />} />
          
          {/* Post a Job multi-step nested routes */}
          <Route path="/post-job" element={<PostJobLayout />}>
            <Route index element={<Navigate to="describe" replace />} />
            <Route path="describe" element={<DescribeJob />} />
            <Route path="time-location" element={<TimeLocation />} />
            <Route path="review" element={<ReviewPost />} />
          </Route>
          
          {/* Hire Artisan multi-step nested routes */}
          <Route path="/hire-artisan/:artisanId" element={<HireArtisanLayout />}>
            <Route index element={<Navigate to="describe" replace />} />
            <Route path="describe" element={<HireArtisanDescribeJob />} />
            <Route path="time-location" element={<HireArtisanTimeLocation />} />
            <Route path="review" element={<ReviewSubmit />} />
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
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;