// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { authData } = useAuth();
  console.log('authData en ProtectedRoute:', authData);  // Verifica el valor de authData

  if (authData === null) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
