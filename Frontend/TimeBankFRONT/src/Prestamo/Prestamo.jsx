import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Prestamos.module.css';  // Asegúrate de que la ruta es correcta

const Prestamo = () => {
  const [tipoPrestamo, setTipoPrestamo] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoPrestamo || !monto || !fechaInicio) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación.');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/prestamos/',
        {
          tipo_prestamo: tipoPrestamo,
          monto: monto,
          fecha_inicio: fechaInicio,
          estado: 'aprobado',
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire('Éxito', `Préstamo solicitado con éxito. ID del Préstamo: ${response.data.prestamo_id}`, 'success');
        setTipoPrestamo('');
        setMonto('');
        setFechaInicio('');
        setError('');
      } else {
        setError('Hubo un problema al solicitar el préstamo.');
      }
    } catch (error) {
      setError('Error al solicitar el préstamo: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.prestamoContainer}>
      <h2>Solicitar Préstamo</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="tipoPrestamo">Tipo de Préstamo</label>
          <select
            id="tipoPrestamo"
            value={tipoPrestamo}
            onChange={(e) => setTipoPrestamo(e.target.value)}
          >
            <option value="">Seleccione un tipo de préstamo</option>
            <option value="PERSONAL">Personal</option>
            <option value="HIPOTECARIO">Hipotecario</option>
            <option value="AUTOMOTOR">Automotor</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="monto">Monto</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Monto"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fechaInicio">Fecha de Inicio</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Solicitando...' : 'Solicitar Préstamo'}
        </button>
      </form>
    </div>
  );
};

const CancelLoan = () => {
  const [loanId, setLoanId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e) => {
    e.preventDefault();

    if (!loanId) {
      setError('El ID del préstamo es obligatorio');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación.');
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/prestamos/cancel/${loanId}/`,
        {},
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire('Éxito', 'Préstamo cancelado con éxito', 'success');
        setLoanId('');
        setError('');
      } else {
        setError('Hubo un problema al cancelar el préstamo.');
      }
    } catch (error) {
      setError('Error al cancelar el préstamo: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cancelLoanContainer}>
      <h2>Anular Préstamo</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleCancel} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="loanId">ID del Préstamo</label>
          <input
            type="text"
            id="loanId"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            placeholder="ID del Préstamo"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Anulando...' : 'Anular Préstamo'}
        </button>
      </form>
    </div>
  );
};

const Prestamos = () => {
  return (
    <div>
      <Prestamo />
      <CancelLoan />
    </div>
  );
};

export default Prestamos;
export { Prestamo, CancelLoan };
