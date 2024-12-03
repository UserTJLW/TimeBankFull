import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);  // Agregar estado de carga
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token recuperado desde localStorage:', token);

    if (token) {
      setAuthData({ token });
    } else {
      setAuthData(null);
    }
    
    setLoading(false);  // Cambiar el estado de carga después de verificar el token
  }, []);  // Esto se ejecuta solo una vez al montar el componente

  const login = (token) => {
    setAuthData({ token });
    localStorage.setItem('token', token);  // Guardar el token en localStorage
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');  // Eliminar el token de localStorage
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, loading }}>
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
