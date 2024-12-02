import React, { useEffect, useState } from 'react';
import './RelojLogo.css'; // Archivo de estilos

const RelojLogo = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  // Cálculos para las agujas del reloj
  const seconds = date.getSeconds() * 6;
  const minutes = (date.getMinutes() + date.getSeconds() / 60) * 6;
  const hours = (date.getHours() % 12 + date.getMinutes() / 60) * 30;

  return (
    <div className="reloj-logo">
      <div className="hand hour" style={{ transform: `rotate(${hours}deg)` }} />
      <div className="hand minute" style={{ transform: `rotate(${minutes}deg)` }} />
      <div className="hand second" style={{ transform: `rotate(${seconds}deg)` }} />
      <div className="center" />
      <div className="clock-text">Time Bank</div> {/* Texto dentro del reloj */}
    </div>
  );
};

export default RelojLogo;
