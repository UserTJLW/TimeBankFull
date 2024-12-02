import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Usando CSS Modules

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={`${styles.sidebarWrapper} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebar}>
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
        >
          {isOpen ? '✕' : '☰'}
        </button>
        <ul className={styles.menuList}>
          <li><Link to="/inicio">Inicio</Link></li>
          <li><Link to="/prestamos">Préstamos</Link></li>
          <li><Link to="/transferencias">Transferencias</Link></li>
          <li><Link to="/cuentas">Cuentas</Link></li>
          <li><Link to="/tarjetas">Tarjetas</Link></li>
          <li><Link to="/convertidor">Conversor de moneda</Link></li>
          <li><Link to="/helpcenter">Centro de ayuda</Link></li>
          <li><Link to="/login" onClick={handleLogout}>Cerrar Sesión</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
