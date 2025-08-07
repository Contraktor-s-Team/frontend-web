import React, { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/NewJobRequests';
import { useLocation, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { connect, useSelector } from 'react-redux';
import { userAction, userEmailAction } from '../../../redux/User/UserAction';

const Dashboard = ({
  loading,
  error,
  data,
  getuser
}) => {
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();
  const [services, setServices] = useState([]);
  const email = location?.state?.email;
  const userEmail = useSelector((state) => state.login.data?.email || state.user?.data?.email);
  useEffect(()=>{
    getuser();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/new-job-requests.json');
        if (!res.ok) {
          throw new Error('Failed to fetch services');
        }
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
      <DashboardHeader data={data}/>
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

const mapStoreToProps = (state) => {
  console.log(state)
    return {
        loading: state?.user?.loading,
        error: state?.user?.error,
        data: state?.user?.data,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getuser: () => dispatch(userAction()),
    };
};


export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard);
