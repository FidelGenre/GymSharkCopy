import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🟢 CORREGIDO: Apunta a tu servidor en Render (HTTPS)
      // Antes: http://localhost:8080/api/auth/register
      await axios.post('https://gymsharkcopyserver.onrender.com/api/auth/register', formData);
      
      alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
      navigate('/login'); // Redirige al login tras el éxito
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Hubo un error al crear la cuenta. Es posible que el email ya esté en uso o el servidor esté reiniciándose.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>CREAR UNA CUENTA</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameFields}>
          <input 
            type="text" 
            placeholder="NOMBRE" 
            required
            onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
            className={styles.inputField}
          />
          <input 
            type="text" 
            placeholder="APELLIDO" 
            required
            onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
            className={styles.inputField}
          />
        </div>
        <input 
          type="email" 
          placeholder="EMAIL" 
          required
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          className={styles.inputField}
        />
        <input 
          type="password" 
          placeholder="CONTRASEÑA" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitBtn}>UNIRSE AHORA</button>
      </form>
      <p className={styles.switchAuth}>
        ¿YA TIENES CUENTA? <Link to="/login" className={styles.link}>INICIAR SESIÓN</Link>
      </p>
    </div>
  );
};

export default Register;