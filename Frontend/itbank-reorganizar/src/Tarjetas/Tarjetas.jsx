import React, { useState, useEffect } from 'react';
import styles from './Tarjetas.module.css'; // Importa tu CSS module

const Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('DEBITO');  // Por defecto, tipo 'DEBITO'
  const [numero, setNumero] = useState('');
  const [cvv, setCvv] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [errorCrear, setErrorCrear] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);  // Estado para controlar la visualización del formulario

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8000/tarjetas/tarjetas', {
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
          setTarjetas(data);
        })
        .catch(error => {
          setError('Error al obtener las tarjetas: ' + error.message);
        });
    } else {
      setError('No se encontró el token de autenticación');
    }
  }, [token]);

  const handleCrearTarjeta = (e) => {
    e.preventDefault();

    const nuevaTarjeta = {
      tipo,
      numero,
      cvv,
      fecha_vencimiento: fechaVencimiento,
    };

    if (token) {
      fetch('http://127.0.0.1:8000/tarjetas/agregar-tarjeta/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(nuevaTarjeta),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo agregar la tarjeta');
          }
          return response.json();
        })
        .then(data => {
          setTarjetas([...tarjetas, data]);  // Agregar la tarjeta creada a la lista
          alert('Tarjeta agregada con éxito');
          setNumero('');
          setCvv('');
          setFechaVencimiento('');
          setMostrarFormulario(false); // Cerrar formulario después de agregar la tarjeta
        })
        .catch(error => {
          setErrorCrear('Error al agregar la tarjeta: ' + error.message);
        });
    } else {
      setErrorCrear('No se encontró el token de autenticación');
    }
  };

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  if (tarjetas.length === 0) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando tarjetas...</p>
      </div>
    );
  }

  return (
    <div className={styles.App}>
      <h1>Mis Tarjetas</h1>
      {errorCrear && <p className={styles.errorMessage}>{errorCrear}</p>}

      {/* Botón para mostrar el formulario de agregar tarjeta */}
      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className={styles.btnFormulario}
      >
        {mostrarFormulario ? 'Cancelar' : 'Agregar Nueva Tarjeta'}
      </button>

      {/* Formulario para agregar tarjeta */}
      {mostrarFormulario && (
        <form onSubmit={handleCrearTarjeta} className={styles.formulario}>
          <h2>Agregar Tarjeta</h2>
          <div>
            <label htmlFor="tipo">Tipo de tarjeta</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>
          <div>
            <label htmlFor="numero">Número de tarjeta</label>
            <input
              type="text"
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
            <input
              type="date"
              id="fechaVencimiento"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              required
            />
          </div>
          <button type="submit">Agregar Tarjeta</button>
        </form>
      )}

      <div className={styles.cardContainer}>
        {tarjetas.map(tarjeta => (
          <div
            className={`${styles.card} ${tarjeta.tipo === 'DEBITO' ? styles.debito : styles.credito}`}
            key={tarjeta.id}
          >
            <div className={styles.cardContent}>
              {/* Parte frontal */}
              <div className={styles.cardFront}>
                <div className={styles.cardTitle}>{tarjeta.tipo === 'DEBITO' ? 'Débito' : 'Crédito'}</div>
                <div className={styles.cardNumber}>{tarjeta.numero}</div>
              </div>
              
              {/* Parte trasera (se muestra solo cuando pasa el mouse) */}
              <div className={styles.cardBack}>
                <div className={styles.cardCVV}>CVV: {tarjeta.cvv}</div>
                <div className={styles.cardExpiry}>Exp: {tarjeta.fecha_vencimiento}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tarjetas;
