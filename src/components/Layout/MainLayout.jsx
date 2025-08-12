import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useUserRole } from '../../hooks/useUserRole';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { fetchCurrentUser, state: userState } = useUser();
  const { userType } = useUserRole();

  // Fallback to route-based detection if role is not yet determined
  const isArtisanRoute = location.pathname.startsWith('/artisan');
  const effectiveUserType = userType || (isArtisanRoute ? 'artisan' : 'customer');
  const data = userState.user.data;

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Only fetch user data if we don't have it and have a valid token
    const authData = localStorage.getItem('auth');
    if (!authData) {
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      const hasToken = !!parsedAuth?.token;
      const hasUserData = userState.user.data?.data?.id || userState.user.data?.id;
      const isLoading = userState.user.loading;

      if (hasToken && !hasUserData && !isLoading) {
        fetchCurrentUser().catch((error) => {
          console.error('MainLayout: Failed to fetch current user:', error);
        });
      }
    } catch (error) {
      console.error('MainLayout: Error parsing auth data:', error);
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userType={effectiveUserType} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar logout={handleLogout} userType={effectiveUserType} data={data} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pb-28 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
