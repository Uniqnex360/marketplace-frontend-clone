import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    // Clean up stale user_id if user object is gone
    localStorage.removeItem("user_id");
    console.log("No user found, redirecting to login");
    return <Navigate to="/" replace />;
  }

  const userRole = user.role_name;

  if (allowedRoles && allowedRoles.includes(userRole)) {
    return children;
  } else {
    console.log("User role not allowed, redirecting to login");
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
