import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

// --- SUB-COMPONENTE TOOLTIP ---
interface TooltipProps {
  label: string;
  text: string;
}

const FooterTooltip: React.FC<TooltipProps> = ({ label, text }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={styles.tooltipWrapper} onClick={toggle}>
      <span className={styles.fakeLink}>{label}</span>
      <div className={`${styles.tooltipBox} ${isOpen ? styles.active : ''}`}>
        {text}
        <div className={styles.tooltipClose}>(Toca para cerrar)</div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL FOOTER ---
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Columna 1: Ayuda */}
          <div className={styles.column}>
            <h4 className={styles.title}>AYUDA</h4>
            <ul className={styles.list}>
              
              {/* --- AQUI ESTÁ EL CAMBIO: PREGUNTAS FRECUENTES AHORA ES TOOLTIP --- */}
              <li>
                <FooterTooltip 
                  label="Preguntas frecuentes" 
                  text="Consulta nuestro Centro de Ayuda para resolver dudas rápidas sobre tallas, envíos y cuidados de la prenda." 
                />
              </li>

              <li><Link to="/orders">Estado del envío</Link></li>
              
              <li>
                <FooterTooltip 
                  label="Devoluciones" 
                  text="Tienes 30 días. Las prendas deben estar sin usar. Inicia el proceso en tu perfil." 
                />
              </li>
              <li>
                <FooterTooltip 
                  label="Hacer un cambio" 
                  text="No hacemos cambios directos. Devuelve tu artículo y realiza un pedido nuevo." 
                />
              </li>
            </ul>
          </div>

          {/* Columna 2: Mi Cuenta */}
          <div className={styles.column}>
            <h4 className={styles.title}>MI CUENTA</h4>
            <ul className={styles.list}>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register">Crear cuenta</Link></li>
            </ul>
          </div>

          {/* Columna 3: Acerca De */}
          <div className={styles.column}>
            <h4 className={styles.title}>ACERCA DE</h4>
            <ul className={styles.list}>
              <li>
                <FooterTooltip 
                  label="Sobre nosotros" 
                  text="Existimos para unir a la comunidad del acondicionamiento físico." 
                />
              </li>
              <li>
                <FooterTooltip 
                  label="Sostenibilidad" 
                  text="Nuestro compromiso es con el planeta y nuestra gente." 
                />
              </li>
              <li>
                <FooterTooltip 
                  label="Trabaja con nosotros" 
                  text="Buscamos a los mejores talentos. Revisa nuestro LinkedIn." 
                />
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter + CONTACTO */}
          <div className={styles.column}>
            <h4 className={styles.title}>ÚNETE A LA FAMILIA</h4>
            <p className={styles.text}>Sé el primero en enterarte de nuevos lanzamientos y ofertas.</p>
            
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              {status === 'success' ? (
                <div className={styles.successMessage}>¡Suscrito correctamente! ✅</div>
              ) : (
                <>
                  <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    required
                  />
                  <button 
                    type="submit" 
                    className={styles.submitBtn} 
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? '...' : 'ENVIAR'}
                  </button>
                </>
              )}
            </form>

            <div className={styles.contactWrapper}>
              <span className={styles.contactLabel}>¿Tienes alguna duda?</span>
              <a href="mailto:gymsharkcontacto@gmail.com" className={styles.contactEmail}>
                gymsharkcontacto@gmail.com
              </a>
            </div>

          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 | GYMSHARK</p>
          <div className={styles.legalLinks}>
            <Link to="/terms">Términos</Link>
            <Link to="/privacy">Privacidad</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;