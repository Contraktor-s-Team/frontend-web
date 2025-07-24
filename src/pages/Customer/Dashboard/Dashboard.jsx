import React, { use, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/RecentServices';
import { userEmailAction } from '../../../redux/User/UserAction';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Dashboard = ({
  loading,
  error,
  data,
  getuser
}) => {
  const location = useLocation();
  const email = location?.state?.email;
  useEffect(()=>{
    console.log("email from location state", email);
    if (email) {
      getuser(email);
    }
  },[])
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
