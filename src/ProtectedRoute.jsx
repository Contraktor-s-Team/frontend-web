import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  // const { isAuthenticated, token } = useSelector((state) => {
  //   state.login
  //   console.log(state.login)
  // });
  const Authenticated = localStorage.getItem("auth")
  const location = useLocation();

  // Check if user is authenticated
  if (!Authenticated ) {
    // Redirect to login page with return url
    return <Navigate to="/"  replace />;
  }

  return children;
};

const mapStoreToProps = (state) => {
  console.log(state)
    return {
        isAuthenticated: state?.login?.isAuthenticated,
    };
};
export default connect(mapStoreToProps)(ProtectedRoute);