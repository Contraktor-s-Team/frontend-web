import React, { use, useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { useUser } from '../../../contexts/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();
  const [services, setServices] = useState([]);
  const { user, loading } = useUser();
  const email = location?.state?.email;

  useEffect(() => {
    // If user is not loaded yet, wait
    if (loading) return;
    if (!user) return;
    const role = user.role;
    if (!user.emailConfirmed) {
      navigate('/signup');
      return;
    }
    if (role === 'user') {
      navigate('/customer/dashboard');
    } else if (role === 'Artisan') {
      navigate('/artisan/dashboard');
    } else {
      console.warn('Unknown role:', role);
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/jobs.json');
        if (!res.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await res.json();
        const filtedServices = data.filter((service) => service.tab === activeTab).slice(0, 5);
        setServices(filtedServices);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchData();
  }, [activeTab]);

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
        <RecentServices services={services} activeTab={activeTab} />
      </div>
    </>
  );
};

export default Dashboard;
