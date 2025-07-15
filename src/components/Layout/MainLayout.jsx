import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { logout } from '../../redux/Auth/Login/LoginAction';
import { connect } from 'react-redux';
const MainLayout = ({logout}) => {
  const navigate = useNavigate();

  const handleLogout = async () =>{
    await logout()
    navigate("/")
    console.log("i got here")
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          logout={handleLogout}
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
        
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    };
};

export default connect(mapStoreToProps,mapDispatchToProps)(MainLayout);
