import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, proporciona username y password.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/clientes/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);  // Esto actualizará el contexto de autenticación
        localStorage.setItem('token', data.token);  // Guarda el token en el localStorage
        navigate('/inicio');  // Redirige al usuario inmediatamente
      } else {
        setError(data.error || "Credenciales inválidas.");
      }
      
    } catch (error) {
      setError("Hubo un problema con la conexión.");
    }
  };

  return (
    <div className={styles.inicioSesion}>
      <h1>Iniciar sesión</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <a href="/Signup">Regístrate</a>
      </p>
    </div>
  );
};

export default Login;
