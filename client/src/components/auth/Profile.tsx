import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { LogOut, Package, User, Mail } from 'lucide-react';
import styles from './Profile.module.css';

// CORRECCIÓN: Los nombres deben coincidir con los campos del JSON de Java
interface Order {
  id: number;
  orderDate: string;  // Antes era 'date'
  totalAmount: number; // Antes era 'total'
  status: string;
  productNames: string[];
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.firstName[0]}{user.lastName[0]}
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

      <main className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>DETALLES DE LA CUENTA</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <User size={20} />
              <div>
                <span>Nombre Completo</span>
                <p>{user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className={styles.detailCard}>
              <Mail size={20} />
              <div>
                <span>Correo Electrónico</span>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>HISTORIAL DE COMPRAS</h2>
          {loading ? (
            <p className={styles.infoText}>Cargando tus pedidos...</p>
          ) : orders.length > 0 ? (
            <div className={styles.ordersTableWrapper}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>ID PEDIDO</th>
                    <th>FECHA</th>
                    <th>ESTADO</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>#{order.id}</td>
                      {/* CORRECCIÓN: Usar orderDate */}
                      <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '---'}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                      {/* CORRECCIÓN: Usar totalAmount y validación opcional */}
                      <td className={styles.orderTotal}>
                        ${(order.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noOrders}>
              <Package size={48} opacity={0.2} />
              <p>Aún no has realizado ninguna compra.</p>
              <button onClick={() => navigate('/')} className={styles.shopBtn}>
                IR A LA TIENDA
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;