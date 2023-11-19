import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user } = UserAuth();

  return user ? (
    // Render the children if the user is authenticated
    children
  ) : (
    // Redirect to the login page if the user is not authenticated
    <Navigate to="/" replace={true} />
  );
};

export default PrivateRoute