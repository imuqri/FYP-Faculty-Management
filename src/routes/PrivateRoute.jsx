// PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = UserAuth();

  return user ? (
    // Render the route's element if the user is authenticated
    React.cloneElement(element, { ...rest })
  ) : (
    // Redirect to the login page if the user is not authenticated
    <Navigate to="/" replace={true} state={{ from: rest.location }} />
  );
};

export default PrivateRoute;
