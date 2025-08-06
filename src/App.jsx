import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import CustomerLayout from './pages/Customer/CustomerLayout';
import ArtisanLayout from './pages/Artisan/ArtisanLayout';

// Pages
import Signup from './pages/Onboarding/Signup';
import Login from './pages/Onboarding/Login';
import ForgotPassword from './pages/Onboarding/ForgotPassword';
import VerificationCode from './pages/Onboarding/VerificationCode';
import CreateNewPassword from './pages/Onboarding/CreateNewPassword';

import store from './redux/store';
import { Provider } from 'react-redux';

// Customer Pages
import CustomerDashboard from './pages/Customer/Dashboard/Dashboard';
import CustomerFindArtisans from './pages/Customer/FindArtisans/FindArtisans';
import CustomerMyJobs from './pages/Customer/MyJobs/MyJobs';
import CustomerMessages from './pages/Customer/Messages/Messages';
import CustomerProfileSettings from './pages/Customer/ProfileSettings/ProfileSettings';
import CustomerHelpCentre from './pages/Customer/HelpCentre/HelpCentre';
import CustomerPostJobLayout from './pages/Customer/PostJob/PostJobLayout';
import CustomerDescribeJob from './pages/Customer/PostJob/DescribeJob';
import CustomerTimeLocation from './pages/Customer/PostJob/TimeLocation';
import CustomerReviewPost from './pages/Customer/PostJob/ReviewPost';

import CustomerHireArtisanLayout from './pages/Customer/FindArtisans/HireArtisan/HireArtisanLayout';
import CustomerHireArtisanDescribeJob from './pages/Customer/FindArtisans/HireArtisan/DescribeJob';
import CustomerHireArtisanTimeLocation from './pages/Customer/FindArtisans/HireArtisan/TimeLocation';
import CustomerHireArtisanReviewSubmit from './pages/Customer/FindArtisans/HireArtisan/ReviewSubmit';

import CustomerArtisanDetails from './pages/Customer/FindArtisans/ArtisanDetails';
import CustomerJobDetails from './pages/Customer/MyJobs/JobDetails';

// Artisan Pages
import ArtisanDashboard from './pages/Artisan/Dashboard/Dashboard';
import ArtisanProfileSettings from './pages/Artisan/ProfileSettings/ProfileSettings';
import ArtisanMyJobs from './pages/Artisan/MyJobs/MyJobs';
import ArtisanMyJobDetails from './pages/Artisan/MyJobs/MyJobDetails';
import ArtisanMessages from './pages/Artisan/Messages/Messages';
import ArtisanHelpCentre from './pages/Artisan/HelpCentre/HelpCentre';
import ArtisanPaymentHistory from './pages/Artisan/PaymentHistory/PaymentHistory';
import ArtisanFindJob from './pages/Artisan/FindJob/FindJob';
import ArtisanJobDetails from './pages/Artisan/FindJob/JobDetails';

// Modals
import NotificationsModal from './components/Notifications/NotificationsModal';

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './ProtectedRoute';

// Layout Wrapper for protected routes
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
);

// Route-based modal wrapper component
const AppRoutes = () => {
  const location = useLocation();

  // Use the current location as the "under" location or the saved background location from state
  const backgroundLocation = location.state?.backgroundLocation || location;

    // Determine user type based on the current route
    const isArtisanRoute = location.pathname.startsWith('/artisan');
    const userType = isArtisanRoute ? 'artisan' : 'customer';

  return (
    <>
    <ErrorBoundary>
        <Routes location={backgroundLocation}>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerificationCode />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />

          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedLayout />}>
            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="artisans">
                <Route index element={<Navigate to="all" replace />} />
                <Route path=":tab" element={<CustomerFindArtisans />} />
                <Route path=":tab/:artisanId" element={<CustomerArtisanDetails />} />
              </Route>
              {/* Nested hire-artisan routes within artisan details */}
              <Route path="hire-artisan/:tab/:artisanId" element={<CustomerHireArtisanLayout />}>
                <Route index element={<Navigate to="describe" replace />} />
                <Route path="describe" element={<CustomerHireArtisanDescribeJob />} />
                <Route path="time-location" element={<CustomerHireArtisanTimeLocation />} />
                <Route path="review" element={<CustomerHireArtisanReviewSubmit />} />
              </Route>
              <Route path="jobs">
                <Route index element={<Navigate to="ongoing" replace />} />
                <Route path="ongoing" element={<CustomerMyJobs />} />
                <Route path=":tab" element={<CustomerMyJobs />} />
                <Route path=":tab/:jobId" element={<CustomerJobDetails />} />
              </Route>
              <Route path="messages" element={<CustomerMessages />} />
              {/* <Route path="profile&settings" element={<CustomerProfileSettings />} /> */}
              <Route path="profile&settings">
                <Route index element={<Navigate to="personalInfo" replace />} />
                <Route path="personalInfo" element={<CustomerProfileSettings />} />
                <Route path=":tab" element={<CustomerProfileSettings />} />
                <Route path=":tab/edit" element={<CustomerProfileSettings />} />
              </Route>
              <Route path="help" element={<CustomerHelpCentre />} />

              {/* Post a Job multi-step nested routes */}
              <Route path="post-job" element={<CustomerPostJobLayout />}>
                <Route index element={<Navigate to="describe" replace />} />
                <Route path="describe" element={<CustomerDescribeJob />} />
                <Route path="time-location" element={<CustomerTimeLocation />} />
                <Route path="review" element={<CustomerReviewPost />} />
              </Route>
            </Route>

            {/* Artisan Routes */}
            <Route path="/artisan" element={<ArtisanLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              {/* <Route path="dashboard" element={<ArtisanDashboard />} /> */}
              <Route path="dashboard">
                <Route index element={<Navigate to="new" replace />} />
                <Route path=":tab" element={<ArtisanDashboard />} />
              </Route>
              <Route path="profile&settings">
                <Route index element={<Navigate to="personalInfo" replace />} />
                <Route path="personalInfo" element={<ArtisanProfileSettings />} />
                <Route path=":tab" element={<ArtisanProfileSettings />} />
                <Route path=":tab/edit" element={<ArtisanProfileSettings />} />
              </Route>
              <Route path="my-jobs">
                <Route index element={<Navigate to="newRequests" replace />} />
                <Route path="newRequests" element={<ArtisanMyJobs />} />
                <Route path=":tab" element={<ArtisanMyJobs />} />
                <Route path=":tab/:jobId" element={<ArtisanMyJobDetails />} />
              </Route>
              {/* <Route path="find-jobs" element={<ArtisanFindJob />} /> */} 
              <Route path="find-jobs">
                <Route index element={<Navigate to="listings" replace />} />
                <Route path=":tab" element={<ArtisanFindJob />} />
                <Route path=":tab/:jobId" element={<ArtisanJobDetails />} />
              </Route>
              <Route path="messages" element={<ArtisanMessages />} />
              <Route path="payment-history" element={<ArtisanPaymentHistory />} />
              <Route path="help" element={<ArtisanHelpCentre />} />
            </Route>
          </Route>

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to={`/${userType}/dashboard`} replace />} />
 
        </Routes>

        {/* Modal Routes - shown on top of the main UI when URL matches */}
        {location !== backgroundLocation && (
          <Routes>
            <Route path={`/${userType}/notifications`} element={<NotificationsModal />} />
          </Routes>
        )}
      </ErrorBoundary>
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


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Try refreshing the page.</h2>;
    }
    return this.props.children;
  }
}