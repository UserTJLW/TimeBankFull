import React, { useState } from 'react';
import styles from './HelpCenter.module.css'; 

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { question: '¿Cómo puedo realizar una transferencia?', answer: 'Puedes ingresar a la seccion Transferencias e ingresar los datos necesarios.' },
    { question: '¿Cual es el horario de atención de Timex?', answer: 'El horario de atencion es de 9 AM a 18 PM.' },
    { question: '¿Donde puedo comunicarme con Time Bank?', answer: 'Dejanos tu mensaje y contestaremos a la brevedad'}]

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.helpCenter}>
      <h1>Centro de Ayuda Time Bank</h1>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Buscar en el Centro de Ayuda..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.faqSection}>
        <h2>Preguntas Frecuentes</h2>
        {filteredFaqs.length > 0 ? (
          <ul>
            {filteredFaqs.map((faq, index) => (
              <li key={index}>
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados para "{searchTerm}".</p>
        )}
      </div>

      <div className={styles.contactSection}>
        <h2>¿Necesitas más ayuda? Contáctanos</h2>
        {submitted ? (
          <p>Gracias por tu mensaje, nos pondremos en contacto contigo pronto.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={contactInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Mensaje:</label>
              <textarea
                name="message"
                value={contactInfo.message}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Enviar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
