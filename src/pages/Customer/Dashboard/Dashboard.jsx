import React, { use, useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';
import { userAction, userEmailAction } from '../../../redux/User/UserAction';
import { connect, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';

const Dashboard = ({
  loading,
  error,
  data,
  getuser
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();
  const [services, setServices] = useState([]);
  const email = location?.state?.email;
  const userEmail = useSelector((state) => state.login.data?.email || state.user?.data?.email);
  console.log("email from location state", email);
  useEffect(()=>{
    getuser();
  },[])

  useEffect(() => {
    if(!loading){
      if (!data || !data?.data) return;
      console.log("data from redux", data);
      const role = data.data?.role;
      console.log("role from data", role);

      if (!data.data.emailConfirmed) {
        navigate('/signup');
        return;
      }

      if (role === 'user') {
        navigate('/customer/dashboard');
      } else if (role === 'Artisan') {
        navigate('/artisan/dashboard');
      } else {
        console.warn("Unknown role:", role);
      }
    }
  }, [data, loading]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch('/jobs.json');
          if (!res.ok) {
            throw new Error('Failed to fetch services');
          }
          const data = await res.json();
          console.log(data);
          const filtedServices = data.filter((service) => service.tab === activeTab).slice(0, 5);
          console.log(filtedServices);
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
      { id: 'completed', label: "Completed" }
    ];

  return (
    <>
      <DashboardHeader data={data}/>
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/customer/dashboard" 
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">
        <RecentServices services={services} activeTab={activeTab}/>
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
