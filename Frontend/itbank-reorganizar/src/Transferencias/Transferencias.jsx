import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Transferencias.module.css';  

const Transferencia = () => {
  const [cuentas, setCuentas] = useState([]);
  const [destinoId, setDestinoId] = useState('');
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteData, setClienteData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClienteData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const clienteRes = await fetch('http://127.0.0.1:8000/clientes/logged-in/', {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (!clienteRes.ok) {
            throw new Error('No autorizado o error en la API');
          }
          const clienteData = await clienteRes.json();
          setClienteData(clienteData);
          fetchCuentas(clienteData.cuenta);
        } catch (error) {
          setError('Error al obtener los datos del cliente: ' + error.message);
        }
      } else {
        setError('No se encontró el token de autenticación');
      }
    };

    const fetchCuentas = async (cuentaLogueada) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token no encontrado.');
          return;
        }

        const res = await axios.get('http://127.0.0.1:8000/cuentas/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        const cuentasData = res.data;
        const cuentasFiltradas = cuentasData.filter(
          (cuenta) => cuenta.id !== cuentaLogueada.id
        );

        setCuentas(cuentasFiltradas);
      } catch (error) {
        setError('No se pudieron cargar las cuentas: ' + error.message);
      }
    };

    fetchClienteData();
  }, []);

  const handleTransferir = async () => {
    if (!destinoId || !monto) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a cero.');
      return;
    }
const handleTransferir = async () => {
  if (!destinoId || !monto) {
    setError('Todos los campos son obligatorios.');
    return;
  }

  const saldoDisponible = clienteData?.cuenta?.saldo; // Verifica si tienes el saldo disponible
  if (parseFloat(monto) <= 0) {
    setError('El monto debe ser mayor a cero.');
    return;
  }

  if (parseFloat(monto) > saldoDisponible) {
    setError('Saldo insuficiente para realizar la transferencia.');
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      return;
    }

    const response = await axios.post('http://127.0.0.1:8000/transferencias/', {
      destino: destinoId,
      monto: monto,
    }, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    });

    Swal.fire('Éxito', 'Transferencia realizada con éxito', 'success');
    navigate('/transferencias');
  } catch (error) {
    setError('Hubo un error al realizar la transferencia: ' + error.response?.data?.detail || error.message);
  } finally {
    setLoading(false);
  }
};

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado.');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/transferencias/', {
        destino: destinoId,
        monto: monto,
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      Swal.fire('Éxito', 'Transferencia realizada con éxito', 'success');
      navigate('/transferencias');
    } catch (error) {
      setError('Hubo un error al realizar la transferencia: ' + error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.transferenciaContainer}>
      <h2>Realizar Transferencia</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="destino">Cuenta Destino</label>
        <select
          id="destino"
          value={destinoId}
          onChange={(e) => setDestinoId(e.target.value)}
        >
          <option value="">Seleccione una cuenta</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.cliente_apellido} {cuenta.cliente_nombre} - CVU: {cuenta.cvu}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="monto">Monto a Transferir</label>
        <input
          type="number"
          id="monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
        />
      </div>

      <button
        onClick={handleTransferir}
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? 'Procesando...' : 'Transferir'}
      </button>
    </div>
  );
};

export default Transferencia;
