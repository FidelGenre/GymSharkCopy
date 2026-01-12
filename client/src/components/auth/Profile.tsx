import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import axios from 'axios'; // Descomentar cuando tengas backend real
import { LogOut, Package, User, Mail, Phone, Lock, Save, ShieldCheck, Info } from 'lucide-react';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  // Ahora traemos también 'loading' y 'updateUser' del contexto
  const { user, logout, loading, updateUser } = useAuth(); 
  const navigate = useNavigate();
  
  // Estado para el formulario de datos personales
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Estado para el cambio de contraseña
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false); // Loading local del botón guardar
  const [message, setMessage] = useState({ type: '', text: '' });

  // EFECTO DE PROTECCIÓN Y CARGA DE DATOS
  useEffect(() => {
    // 1. Si el contexto está cargando, NO hacemos nada (esperamos)
    if (loading) return;

    // 2. Si terminó de cargar y no hay usuario, fuera.
    if (!user) {
      navigate('/login');
      return;
    }

    // 3. Si hay usuario, llenamos el form
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // AQUÍ: Llamada al backend real
      // await axios.put(`http://localhost:8080/api/users/${user?.id}`, formData);
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 800)); 

      // --- PASO CRUCIAL: Actualizar el contexto global ---
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      // --------------------------------------------------

      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    
    // Lógica simulada
    alert("Funcionalidad de cambio de contraseña simulada");
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Renderizado condicional para evitar "parpadeos" o errores
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <div className={styles.loader}>Cargando perfil...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      
      {/* --- SIDEBAR --- */}
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>{user.email}</p>
        </div>
        
        <nav className={styles.sideNav}>
          <button className={styles.activeTab}>
            <User size={18} /> MI CUENTA
          </button>
          <button onClick={() => navigate('/orders')}>
            <Package size={18} /> MIS PEDIDOS
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> CERRAR SESIÓN
          </button>
        </nav>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className={styles.content}>
        
        {/* Mensajes de feedback */}
        {message.text && (
          <div className={`${styles.alert} ${styles[message.type]}`}>
            {message.type === 'success' ? <ShieldCheck size={18} /> : <Info size={18} />}
            {message.text}
          </div>
        )}

        {/* SECCIÓN 1: DATOS PERSONALES */}
        <section className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>INFORMACIÓN PERSONAL</h2>
            <p className={styles.sectionSubtitle}>Actualiza tus datos de contacto y envío predeterminados.</p>
          </div>
          
          <form onSubmit={handleProfileUpdate} className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Nombre</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.icon} />
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Apellido</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.icon} />
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Correo Electrónico</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.icon} />
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className={styles.disabledInput}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Teléfono</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.icon} />
                <input 
                  type="tel" 
                  value={formData.phone} 
                  placeholder="+54 ..."
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                {isSaving ? 'GUARDANDO...' : (
                  <> <Save size={18} /> GUARDAR CAMBIOS </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* SECCIÓN 2: SEGURIDAD */}
        <section className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>SEGURIDAD</h2>
            <p className={styles.sectionSubtitle}>Cambia tu contraseña para mantener tu cuenta segura.</p>
          </div>

          <form onSubmit={handlePasswordChange} className={styles.securityForm}>
            <div className={styles.inputGroup}>
              <label>Contraseña Actual</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.icon} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passData.currentPassword}
                  onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                />
              </div>
            </div>
            
            <div className={styles.rowTwo}>
              <div className={styles.inputGroup}>
                <label>Nueva Contraseña</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.icon} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passData.newPassword}
                    onChange={e => setPassData({...passData, newPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Confirmar Nueva</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.icon} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passData.confirmPassword}
                    onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.outlineBtn}>
                ACTUALIZAR CONTRASEÑA
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
};

export default Profile;