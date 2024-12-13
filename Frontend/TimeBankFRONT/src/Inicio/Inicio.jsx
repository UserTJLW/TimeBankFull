import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css';
import EditCliente from './EditCliente';

const LandPage = () => {
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar la edición

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
          console.log(data); // Verifica que los datos se reciben correctamente
          setClienteData(data);
        })
        .catch(error => {
          setError('Error al obtener los datos del cliente: ' + error.message);
          console.error(error);
        });
    } else {
      setError('No se encontró el token de autenticación');
    }
  }, []);

  const handleUpdate = (updatedData) => {
    setClienteData(updatedData);
    setIsEditing(false); // Cierra el formulario de edición después de actualizar
  };

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>; // Muestra el error si ocurrió
  }

  if (!clienteData) {
    return <div className={styles.loadingMessage}>Cargando...</div>; // Mientras esperamos la respuesta de la API
  }

  return (
    <div className={styles.container}>
      {isEditing ? (
        <EditCliente clienteData={clienteData} onUpdate={handleUpdate} />
      ) : (
        <div className={styles.card}>
          <h1>Hola {clienteData.user || 'Usuario'} que bueno que estes de vuelta!</h1>
          <h2>Información personal:</h2>
          <p>Email: {clienteData.email || 'No especificado'}</p>
          <p>Teléfono: {clienteData.telefono || 'No especificado'}</p>
          <p>Dirección: {clienteData.direccion || 'No especificada'}</p>
          <p>Fecha de nacimiento: {clienteData.nacimiento || 'No especificada'}</p>
          <p>DNI: {clienteData.dni || 'No especificado'}</p>
          <p>Tipo de cuenta: {clienteData.cuenta || 'No especificada'}</p>
          <p>Saldo: {clienteData.saldo || 'No especificado'}</p>
          <p>CVU: {clienteData.cvu || 'No especificado'}</p>
          <button onClick={() => setIsEditing(true)}>Editar Datos</button>
        </div>
      )}
    </div>
  );
};

export default LandPage;
