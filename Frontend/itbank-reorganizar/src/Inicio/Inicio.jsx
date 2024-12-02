import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css';  // Asegúrate de importar el CSS Module

const LandPage = () => {
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false); // Estado para mostrar/ocultar datos de la cuenta

  useEffect(() => {
    // Obtener el token de autenticación (asegúrate de que esté en localStorage o sessionStorage)
    const token = localStorage.getItem('token'); // O usa sessionStorage si prefieres

    if (token) {
      fetch('http://127.0.0.1:8000/clientes/logged-in/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,  // Formato correcto: 'Token <tu-token>'
        },
      })
        .then(response => {
          if (!response.ok) {
            // Si la respuesta no es OK, arroja un error con el código de estado
            throw new Error(`Error: ${response.status} - No autorizado o error en la API`);
          }
          return response.json();
        })
        .then(data => {
          setClienteData(data); // Recibes los datos del cliente aquí
        })
        .catch(error => {
          setError('Error al obtener los datos del cliente: ' + error.message);
          console.error(error);
        });
    } else {
      setError('No se encontró el token de autenticación');
    }
  }, []);

  const toggleAccountDetails = () => {
    setShowAccountDetails(prevState => !prevState); // Cambia el estado para mostrar/ocultar los detalles de la cuenta
  };

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>; // Muestra el error si ocurrió
  }

  if (!clienteData) {
    return <div className={styles.loadingMessage}>Cargando...</div>; // Mientras esperamos la respuesta de la API
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Bienvenido {clienteData.nombre} {clienteData.apellido}!</h1>
        <p>Email: {clienteData.email}</p>
        <p>Telefono: {clienteData.telefono}</p>
        <p>DNI: {clienteData.dni}</p>
        <p>Tipo de cuenta: {clienteData.cuenta}</p>

      </div>
    </div>
  );
};

export default LandPage;
