import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';

const Dashboard = () => {
  return (
    <>
      <DashboardHeader />
      <div className="mt-8">
        <RecentServices />
      </div>
    </>
  );
};

export default Dashboard;
