import './cuentas.css';
import React, { useState, useEffect } from 'react';

const Cuenta = () => {
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

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
            throw new Error(`Error: ${response.status} - No autorizado o error en la API`);
          }
          return response.json();
        })
        .then(data => {
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

  const toggleAccountDetails = () => {
    setShowAccountDetails(prevState => !prevState);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!clienteData) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Información de Cuenta</h2>
      </div>
      <div className="account-summary">
        <p><strong>Tipo de cuenta:</strong> {clienteData.cuenta}</p>
        <p><strong>CVU:</strong> {clienteData.cvu}</p>

        <button className="toggle-btn" onClick={toggleAccountDetails}>
          {showAccountDetails ? 'Ocultar saldo' : 'Mostrar saldo en la cuenta'}
        </button>
      </div>

      {showAccountDetails && (
        <div className="account-details">
          <p><strong>Saldo:</strong> {clienteData.saldo} ARS</p>
          {/* Otros detalles relevantes de la cuenta */}
        </div>
      )}
    </div>
  );
};

export default Cuenta;
