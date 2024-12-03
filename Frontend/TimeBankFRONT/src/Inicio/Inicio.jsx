import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css';

const LandPage = () => {
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false); // Estado para mostrar/ocultar datos de la cuenta

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      fetch('http://127.0.0.1:8000/clientes/logged-in/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`, 
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
          setClienteData(data); // Recibo los datos del cliente aquí
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
        <h1>Hola {clienteData.user} que bueno que estes de vuelta!</h1>
        <h2>Informacion personal: </h2>
        <p>Email: {clienteData.email}</p>
        <p>Telefono: {clienteData.telefono}</p>
        <p>Fecha de nacimiento: {clienteData.nacimiento}</p>
        <p>DNI: {clienteData.dni}</p>
        <p>Tipo de cuenta: {clienteData.cuenta}</p>

      </div>
    </div>
  );
};

export default LandPage;
