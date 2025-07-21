import React, { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/NewJobRequests';
import { useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';

const Dashboard = () => {
  const { tab: activeTab = 'new' } = useParams();
  const [services, setServices] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch('/new-job-requests.json');
          const data = await res.json();
          console.log(data);
          const filtedServices = data.filter((service) => service.category === activeTab);
          console.log(filtedServices);
          setServices(filtedServices);
        } catch (err) {
          console.error('Error:', err);
        }
      };
  
      fetchData();
    }, [activeTab]);

  const tabs = [
    { id: 'new', label: 'New Job Requests' },
    { id: 'in-progress', label: 'Jobs In Progress' },
    { id: 'today', label: "Today's Jobs" }
  ];
  
  return (
    <>
      <DashboardHeader />
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/artisan/dashboard" 
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">
        <RecentServices services={services} activeTab={activeTab} />
      </div>
    </>
  );
};

export default Dashboard;
