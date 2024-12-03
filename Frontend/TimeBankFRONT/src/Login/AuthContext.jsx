// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthData({ token });
    } else {
      setAuthData(null);  // Si no hay token, asegurarse de que el estado esté limpio
    }
  }, []);  // Esto solo se ejecuta una vez al montar el componente

  const login = (token) => {
    setAuthData({ token });
    localStorage.setItem('token', token);  // Guardar el token en localStorage
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');  // Eliminar el token de localStorage
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
