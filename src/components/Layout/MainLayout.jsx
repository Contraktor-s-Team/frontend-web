import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
