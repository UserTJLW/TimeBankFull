import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { authData, loading } = useAuth();  
  if (loading) {
    // Mientras se esté cargando el estado de autenticación, no redirigimos ni renderizamos nadaa
    return null;
  }

  console.log('authData en ProtectedRoute:', authData);  // Verifica si authData tiene el token

  // Si no hay autenticación (no hay token), redirige a la página de login
  if (!authData) {
    return <Navigate to="/login" />;
  }

  // Si hay autenticación, renderiza el componente protegido
  return element;
};

export default ProtectedRoute;
