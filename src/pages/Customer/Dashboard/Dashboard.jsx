import React, { useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';
import { useLocation, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { useUser } from '../../../contexts/UserContext';

const Dashboard = () => {
  const location = useLocation();
  const { tab: activeTab = 'posted' } = useParams();
  const { state: userState, fetchCurrentUser } = useUser();
  const user = userState.user.data;
  const loading = userState.user.loading;
  const email = location?.state?.email;

  useEffect(() => {
    // Only fetch if we don't have user data, we're not loading, and we have a valid token
    const authData = localStorage.getItem('auth');
    if (!authData) {
      console.log('🚫 Customer Dashboard: No auth token found, skipping fetchCurrentUser');
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      const hasToken = !!parsedAuth?.token;
      const hasUserData = user?.data?.id || user?.id;

      // Prevent duplicate calls - only fetch if we really need to
      if (hasToken && !hasUserData && !loading) {
        console.log('🚀 Customer Dashboard: Fetching current user with valid token');
        fetchCurrentUser().catch((error) => {
          console.error('Customer Dashboard: Failed to fetch current user:', error);
        });
      } else {
        console.log('🚫 Customer Dashboard: Skipping fetchCurrentUser -', {
          hasToken,
          hasUserData: !!hasUserData,
          isLoading: loading
        });
      }
    } catch (error) {
      console.error('Customer Dashboard: Error parsing auth data:', error);
    }
  }, [user, loading]); // Add dependencies to prevent unnecessary calls

  const tabs = [
    { id: 'posted', label: 'Posted' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <>
      <DashboardHeader data={user} />
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        basePath="/customer/dashboard"
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">
        <RecentServices activeTab={activeTab} />
      </div>
    </>
  );
};

export default Dashboard;
