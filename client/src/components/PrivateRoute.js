import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, employerOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (employerOnly && user.role !== 'employer') {
    return <Navigate to="/jobs" />;
  }

  return children;
};

export default PrivateRoute;
