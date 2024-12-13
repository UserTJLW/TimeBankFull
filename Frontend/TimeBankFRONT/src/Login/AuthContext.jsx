import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token recuperado desde localStorage:', token);

    if (token) {
      setAuthData({ token });
    } else {
      setAuthData(null);
    }
    
    setLoading(false);  
  }, []); 

  const login = (token) => {
    setAuthData({ token });
    localStorage.setItem('token', token);  
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');  
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
