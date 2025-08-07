import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, data } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { logout } from '../../redux/Auth/Login/LoginAction';
import { connect, useSelector } from 'react-redux';
import { getArtisanIdAction } from '../../redux/Artisan/ArtisanAction';
import { userAction, userEmailAction } from '../../redux/User/UserAction';

const MainLayout = ({ logout, data, getArtisanDiscovery, getuser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine user type based on the current route
  const isArtisanRoute = location.pathname.startsWith('/artisan');
  const userType = isArtisanRoute ? 'artisan' : 'customer';
  const email = location?.state?.email;
  const userEmail = useSelector((state) => state.login.data?.email || state.user?.data?.email);
 
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  useEffect(()=>{
    getuser();
  },[])
  // useEffect(()=>{
  //   if (data?.data?.id) {
  //     getArtisanDiscovery(data?.data?.id);
  //   }
  // },[data])
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userType={userType} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          logout={handleLogout}
          userType={userType}
          data={data}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pb-28 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
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
        logout: () => dispatch(logout()),
        getuser: () => dispatch(userAction()),
        getArtisanDiscovery: (id) => dispatch(getArtisanIdAction(id)),
    };
};

export default connect(mapStoreToProps,mapDispatchToProps)(MainLayout);

