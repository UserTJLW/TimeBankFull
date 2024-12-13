import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditCliente.module.css'

const EditCliente = ({ clienteData, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    nacimiento: '',
    dni: '',
  });

  useEffect(() => {
    if (clienteData) {
      setFormData({
        nombre: clienteData.nombre || '',
        apellido: clienteData.apellido || '',
        email: clienteData.email || '',
        telefono: clienteData.telefono || '',
        direccion: clienteData.direccion || '',
        nacimiento: clienteData.nacimiento || '',
        dni: clienteData.dni || '',
      });
    }
  }, [clienteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://127.0.0.1:8000/clientes/update/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        onUpdate(response.data);  // Llama a la función de actualización en el componente padre
        alert('Datos actualizados con éxito');
      }
    } catch (error) {
      console.error('Error al actualizar los datos del cliente:', error);
      alert('Hubo un error al actualizar los datos del cliente');
    }
  };

  return (
    <div className={styles.editContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Editar Información del Cliente</h2>
        <label>
          Nombre:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </label>
        <label>
          Apellido:
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Teléfono:
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
        </label>
        <label>
          Dirección:
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
        </label>
        <label>
          Fecha de Nacimiento:
          <input type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} />
        </label>
        <label>
          DNI:
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditCliente;
