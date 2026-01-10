import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna 1: Ayuda */}
          <div className={styles.column}>
            <h4 className={styles.title}>AYUDA</h4>
            <ul className={styles.list}>
              <li><a href="#">Preguntas frecuentes</a></li>
              <li><a href="#">Estado del envío</a></li>
              <li><a href="#">Devoluciones</a></li>
              <li><a href="#">Hacer un cambio</a></li>
            </ul>
          </div>

          {/* Columna 2: Mi Cuenta */}
          <div className={styles.column}>
            <h4 className={styles.title}>MI CUENTA</h4>
            <ul className={styles.list}>
              <li><a href="#">Login</a></li>
              <li><a href="#">Registro</a></li>
              <li><a href="#">Descuento estudiantes</a></li>
            </ul>
          </div>

          {/* Columna 3: Páginas */}
          <div className={styles.column}>
            <h4 className={styles.title}>PÁGINAS</h4>
            <ul className={styles.list}>
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Sostenibilidad</a></li>
              <li><a href="#">Carreras</a></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className={styles.column}>
            <h4 className={styles.title}>MANTENTE AL DÍA</h4>
            <p className={styles.text}>Suscríbete para recibir noticias de lanzamientos y ofertas.</p>
            <div className={styles.newsletter}>
              <input type="email" placeholder="Email" className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 | GYMSHARK CLONE | USANDO REACT + TS</p>
          <div className={styles.legalLinks}>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;