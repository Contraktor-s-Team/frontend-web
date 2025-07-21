import React from 'react';
import { Outlet } from 'react-router-dom';

const ArtisanLayout = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default ArtisanLayout;
