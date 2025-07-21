import React from 'react';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
