import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import { useLocation, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { useUser } from '../../../contexts/UserContext';
import { ProposalSentTab, NewJobRequestsTab, JobsInProgressTab, TodaysJobsTab } from './tabs';

const Dashboard = () => {
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();

  // Context hooks
  const { state: userState } = useUser();

  // Derived state
  const userData = userState.user.data;
  const user = userData?.data || userData;

  const tabs = [
    { id: 'proposals', label: 'Proposal Sent' },
    { id: 'new', label: 'New Job Requests' },
    { id: 'in-progress', label: 'Jobs In Progress' },
    { id: 'today', label: "Today's Jobs" }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'proposals':
        return <ProposalSentTab />;
      case 'new':
        return <NewJobRequestsTab />;
      case 'in-progress':
        return <JobsInProgressTab />;
      case 'today':
        return <TodaysJobsTab />;
      default:
        return <NewJobRequestsTab />;
    }
  };

  return (
    <>
      <DashboardHeader data={user} />
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        basePath="/artisan/dashboard"
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">{renderActiveTab()}</div>
    </>
  );
};

export default Dashboard;
