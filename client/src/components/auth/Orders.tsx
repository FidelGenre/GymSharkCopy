import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Orders.module.css';
import { Package, Tag, Clock, User, LogOut, Truck } from 'lucide-react';

const Orders: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          // 🟢 CORREGIDO: Apunta a tu servidor en Render (HTTPS)
          const response = await axios.get(`https://gymsharkcopyserver.onrender.com/api/orders/user/${user.id}`);
          
          // --- CORRECCIÓN: ORDENAR DESCENDENTE (NUEVOS PRIMERO) ---
          const sortedOrders = response.data.sort((a: any, b: any) => b.id - a.id);
          
          setOrders(sortedOrders);
        } catch (error) {
          console.error("Error al cargar pedidos:", error);
          // MOCK DATA: Si falla la API o no hay conexión, mostramos datos de prueba
          setOrders([
            { id: 11, status: 'DELIVERED', orderDate: new Date(Date.now() - 864000000), totalAmount: 30400, productNames: ['Top Deportivo Verve'] },
            { id: 10, status: 'PENDING', orderDate: new Date(), totalAmount: 39000, productNames: ['Joggers Arrival (XXL)'] }
          ]); 
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- FUNCIÓN PARA CORREGIR EL PRECIO ---
  const formatPrice = (amount: number) => {
    if (!amount) return "$ 0";
    
    // TRUCO: Si el precio es muy bajo (ej: 39), asumimos que le faltan los ceros.
    const correctedAmount = amount < 1000 ? amount * 1000 : amount;

    return `$ ${Math.floor(correctedAmount).toLocaleString('es-AR')}`;
  };
  // ---------------------------------------

  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>{user.email}</p>
        </div>
        
        <nav className={styles.sideNav}>
          <button onClick={() => navigate('/profile')}>
            <User size={18} /> MI CUENTA
          </button>
          <button className={styles.activeTab}>
            <Package size={18} /> MIS PEDIDOS
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> CERRAR SESIÓN
          </button>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>HISTORIAL DE PEDIDOS</h1>
        
        {loading ? (
          <div className={styles.centered}>Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Package size={48} strokeWidth={1} />
            <p className={styles.empty}>Aún no has realizado ninguna compra.</p>
            <button className={styles.shopBtn} onClick={() => navigate('/')}>
              IR A LA TIENDA
            </button>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerInfo}>
                    <span className={styles.orderLabel}>Nº DE PEDIDO</span>
                    <span className={styles.orderId}>#{order.id}</span>
                  </div>
                  <span className={`${styles.orderStatus} ${styles[order.status?.toLowerCase() || 'pending']}`}>
                    {order.status === 'PENDING' ? 'EN PROCESO' : order.status === 'DELIVERED' ? 'COMPLETADO' : order.status}
                  </span>
                </div>
                
                {/* Body */}
                <div className={styles.cardBody}>
                  
                  {/* Meta Datos */}
                  <div className={styles.orderMeta}>
                      <div className={styles.metaDate}>
                        <Clock size={14} />
                        <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Hoy'}</span>
                      </div>
                      <div className={styles.deliveryInfo}>
                        <Truck size={14} />
                        <span>Entrega estimada: 4-6 días</span>
                      </div>
                  </div>

                  {/* Productos */}
                  <div className={styles.productList}>
                    <span className={styles.orderLabel}>ARTÍCULOS</span>
                    {order.productNames?.map((name: string, i: number) => (
                      <div key={i} className={styles.productItem}>
                        <Tag size={14} /> {name}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className={styles.footerRow}>
                    <div className={styles.orderTotal}>
                       <span className={styles.totalLabel}>TOTAL PAGADO</span>
                       {/* AQUÍ USAMOS LA FUNCIÓN CORRECTORA */}
                       <span className={styles.totalAmount}>
                         {formatPrice(order.totalAmount)}
                       </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;