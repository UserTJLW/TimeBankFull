import React, { useState, useEffect } from 'react';
import { useAuth } from '../Login/AuthContext';  
import { useNavigate } from 'react-router-dom';
import styles from './Movimientos.module.css'; 

const Movimientos = () => {
  const { authData } = useAuth();  // Usamos el hook de autenticación
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para manejar qué listado mostrar
  const [activeTab, setActiveTab] = useState('transferenciasRecibidas');

  useEffect(() => {
    const fetchMovimientos = async () => {
      if (!authData || !authData.token) {
        navigate('/login');  // Si no hay token, redirige al login
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/movimientos/', {
            method: 'GET',
            headers: {
              'Authorization': `Token ${authData.token}`,
              'Content-Type': 'application/json',
            },
          });

        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos:', data);  // Para verificar la respuesta
          setMovimientos(data);  // Guarda los movimientos en el estado
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Hubo un problema al obtener los movimientos.");
        }
      } catch (error) {
        console.error("Error al obtener los movimientos:", error);
        setError("Hubo un problema con la conexión. Detalles del error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, [authData, navigate]);  // Solo se vuelve a ejecutar si cambia el token o authData

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Movimientos</h2>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'transferenciasRecibidas' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('transferenciasRecibidas')}
        >
          Transferencias Recibidas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'transferenciasEnviadas' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('transferenciasEnviadas')}
        >
          Transferencias Enviadas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'prestamos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('prestamos')}
        >
          Préstamos
        </button>
      </div>

      {activeTab === 'transferenciasRecibidas' && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Transferencias Recibidas</h3>
          <ul className={styles.list}>
            {movimientos.transferencias_recibidas && movimientos.transferencias_recibidas.length > 0 ? (
              movimientos.transferencias_recibidas.map((transferencia) => (
                <li key={transferencia.id} className={styles.item}>
                  {`Origen: ${transferencia.origen_nombre} - Monto: ${transferencia.monto} - Fecha: ${new Date(transferencia.fecha).toLocaleDateString()}`}
                </li>
              ))
            ) : (
              <li className={styles.item}>No hay transferencias recibidas.</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === 'transferenciasEnviadas' && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Transferencias Enviadas</h3>
          <ul className={styles.list}>
            {movimientos.transferencias_enviadas && movimientos.transferencias_enviadas.length > 0 ? (
              movimientos.transferencias_enviadas.map((transferencia) => (
                <li key={transferencia.id} className={styles.item}>
                  {`Enviada a: ${transferencia.destino_nombre} - Monto: ${transferencia.monto} - Fecha: ${new Date(transferencia.fecha).toLocaleDateString()}`}
                </li>
              ))
            ) : (
              <li className={styles.item}>No hay transferencias enviadas.</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === 'prestamos' && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Préstamos</h3>
          <ul className={styles.list}>
            {movimientos.prestamos && movimientos.prestamos.length > 0 ? (
              movimientos.prestamos.map((prestamo) => (
                <li key={prestamo.id} className={styles.item}>
                  {`Monto: ${prestamo.monto} - Tipo: ${prestamo.tipo_prestamo} - Fecha de Inicio: ${new Date(prestamo.fecha_inicio).toLocaleDateString()}`}
                </li>
              ))
            ) : (
              <li className={styles.item}>No hay préstamos.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
