import React, { use, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';
import { userEmailAction } from '../../../redux/User/UserAction';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = ({
  loading,
  error,
  data,
  getuser
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  console.log("email from location state", email);
  useEffect(()=>{
    console.log("email from location state", email);
    if (email) {
      getuser(email);
    }
  },[email])

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
  return (
    <>
      <DashboardHeader data={data}/>
      <div className="mt-8">
        <RecentServices />
      </div>
    </>
  );
};

const mapStoreToProps = (state) => {
  console.log(state)
    return {
        loading: state?.userEmail?.loading,
        error: state?.userEmail?.error,
        data: state?.userEmail?.data,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getuser: (email) => dispatch(userEmailAction(email)),
    };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard);
