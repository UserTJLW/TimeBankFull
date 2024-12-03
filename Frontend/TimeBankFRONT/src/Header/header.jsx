import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Login/AuthContext';  // Importar el contexto de autenticación
import RelojLogo from '../Logo/RelojLogo';
import styles from './Header.module.css';  // Importar el módulo de CSS

const Header = () => {
  const { authData, logout } = useAuth(); // Usamos el hook de autenticación
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/clientes/logout/', {
        method: 'POST',
        //credentials: 'include', // Asegúrate de que las cookies se envíen si se usan
      });
  
      if (response.ok) {
        const data = await response.json();  // La respuesta JSON debería ser recibida
        alert(data.message || "Has cerrado sesión exitosamente.");
        
        // Limpiar el token y el estado global de autenticación
        localStorage.removeItem('token');
        logout();  // Llamada a la función logout de tu contexto
  
        navigate('/login');  // Redirige al login después del logout
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Hubo un problema al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema con la conexión. Detalles del error: " + error.message);
    }
  };
  
  const handleLogin = () => {
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <div className={styles.Header}>
      <RelojLogo />
      {authData && authData.token ? (
        // Si hay un token, muestra el botón de "Cerrar sesión"
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar sesión</button>
      ) : (
        // Si no hay un token, muestra el botón de "Iniciar sesión"
        <button onClick={handleLogin} className={styles.loginButton}>Iniciar sesión</button>
      )}
    </div>
  );
};

export default Header;
