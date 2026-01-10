import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Petición al endpoint de tu API en Spring Boot
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      /* IMPORTANTE: El backend debe devolver un objeto con:
         { id, firstName, lastName, email }
      */
      if (response.data && response.data.id) {
        login(response.data); // Guarda en Contexto y LocalStorage
        navigate('/profile'); // Te lleva directo a tu nueva página de Perfil
      } else {
        throw new Error("El servidor no devolvió los datos completos del usuario.");
      }

    } catch (error: any) {
      console.error("Error en login:", error);
      setError("Email o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>INICIAR SESIÓN</h2>
      
      {error && <p className={styles.errorMsg} style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '13px', marginBottom: '15px' }}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input 
            type="email" 
            placeholder="EMAIL" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="CONTRASEÑA" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          ENTRAR
        </button>
      </form>

      <div className={styles.helpLinks}>
        <p className={styles.switchAuth}>
          ¿ERES NUEVO AQUÍ? <Link to="/register" className={styles.link}>REGÍSTRATE</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;