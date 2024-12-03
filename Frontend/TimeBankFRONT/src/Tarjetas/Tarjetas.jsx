import React, { useState, useEffect } from 'react';
import styles from './Tarjetas.module.css';

const Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('DEBITO');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  // Función para generar un número de tarjeta aleatorio de 12 dígitos
  const generarNumeroTarjeta = () => {
    let numeroGenerado = '';
    for (let i = 0; i < 12; i++) {
      numeroGenerado += Math.floor(Math.random() * 10);
    }
    return numeroGenerado;
  };

  // Función para generar un CVV aleatorio de 3 dígitos
  const generarCvv = () => {
    let cvvGenerado = '';
    for (let i = 0; i < 3; i++) {
      cvvGenerado += Math.floor(Math.random() * 10);
    }
    return cvvGenerado;
  };

  // Función para establecer la fecha de vencimiento (9 años a partir de hoy)
  const generarFechaVencimiento = () => {
    const hoy = new Date();
    const añoVencimiento = hoy.getFullYear() + 9;
    const mesVencimiento = hoy.getMonth() + 1; // Mes actual + 1
    return `${añoVencimiento}-${String(mesVencimiento).padStart(2, '0')}-01`; // El día se establece en el 1 del mes
  };

  const handleCrearTarjeta = (e) => {
    e.preventDefault();

    // Establecer los valores generados
    const numeroGenerado = generarNumeroTarjeta();
    const cvvGenerado = generarCvv();
    const fechaVencimientoGenerada = generarFechaVencimiento();

    const nuevaTarjeta = {
      tipo,
      numero: numeroGenerado,
      cvv: cvvGenerado,
      fecha_vencimiento: fechaVencimientoGenerada,
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
          setTarjetas([...tarjetas, data]);
          setMensajeExito('Tarjeta agregada con éxito');
          setMensajeError(''); // Limpiar mensaje de error
          setMostrarFormulario(false);

          // Limpiar mensaje después de 3 segundos
          setTimeout(() => {
            setMensajeExito('');
          }, 3000);
        })
        .catch(error => {
          setMensajeError('Error al agregar la tarjeta: ' + error.message);
          setMensajeExito(''); // Limpiar mensaje de éxito
        });
    } else {
      setMensajeError('No se encontró el token de autenticación');
      setMensajeExito(''); // Limpiar mensaje de éxito
    }
  };

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <div className={styles.App}>
      <h1>Mis Tarjetas</h1>

      {/* Mostrar mensajes de éxito o error */}
      {mensajeExito && <p className={styles.mensajeExito}>{mensajeExito}</p>}
      {mensajeError && <p className={styles.mensajeError}>{mensajeError}</p>}

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className={`${styles.btnFormulario} ${mostrarFormulario ? styles.activeBtn : ''}`}
      >
        {mostrarFormulario ? 'Cancelar' : 'Agregar Nueva Tarjeta'}
      </button>

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
              <div className={styles.cardFront}>
                <div className={styles.cardTitle}>{tarjeta.tipo === 'DEBITO' ? 'Débito' : 'Crédito'}</div>
                <div className={styles.cardNumber}>{tarjeta.numero}</div>
              </div>
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
