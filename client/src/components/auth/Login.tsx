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
      // 🟢 CORREGIDO: Apunta a tu servidor en Render (HTTPS)
      const response = await axios.post('https://gymsharkcopyserver.onrender.com/api/auth/login', {
        email,
        password
      });

      /* IMPORTANTE: El backend debe devolver un objeto JSON con los datos del usuario.
         Ejemplo esperado: { "id": 1, "firstName": "Juan", "email": "juan@test.com" }
      */
      if (response.data && response.data.id) {
        login(response.data); // Guarda el usuario en el Contexto y LocalStorage
        navigate('/profile'); // Redirige a la página de perfil
      } else {
        throw new Error("El servidor no devolvió los datos completos del usuario.");
      }

    } catch (error: any) {
      console.error("Error en login:", error);
      // Mensaje amigable si falla (ej: 401 Unauthorized o 403 Forbidden)
      setError("Email o contraseña incorrectos, o el servidor está reiniciándose. Inténtalo de nuevo.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>INICIAR SESIÓN</h2>
      
      {error && (
        <p className={styles.errorMsg} style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '13px', marginBottom: '15px' }}>
          {error}
        </p>
      )}

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