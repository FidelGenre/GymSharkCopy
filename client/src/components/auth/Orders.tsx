import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './Orders.module.css';
import { Package, Tag, Clock, ShoppingBag } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          // Consultamos las órdenes vinculadas al ID del usuario logueado
          const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`);
          setOrders(response.data);
        } catch (error) {
          console.error("Error al cargar pedidos:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div className={styles.centered}>Por favor, inicia sesión para ver tus pedidos.</div>;
  if (loading) return <div className={styles.centered}>Cargando tu historial...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>MIS PEDIDOS</h1>
      
      {orders.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Package size={48} strokeWidth={1} />
          <p className={styles.empty}>Aún no has realizado ninguna compra.</p>
          <button className={styles.shopBtn} onClick={() => window.location.href = '/'}>
            IR A LA TIENDA
          </button>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.orderLabel}>Nº DE PEDIDO</span>
                  <span className={styles.orderId}>#{order.id}</span>
                </div>
                <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                  {order.status}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.orderMeta}>
                   <Clock size={14} />
                   <span>Fecha: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Reciente'}</span>
                </div>

                <div className={styles.productList}>
                  <span className={styles.orderLabel}>PRODUCTOS</span>
                  {/* Mapeo de productNames definidos en el Checkout */}
                  {order.productNames?.map((name: string, i: number) => (
                    <p key={i} className={styles.productItem}>
                      <Tag size={12} /> {name}
                    </p>
                  ))}
                </div>

                <div className={styles.footerRow}>
                  <div className={styles.orderTotal}>
                     <span className={styles.totalLabel}>TOTAL PAGADO</span>
                     <span className={styles.totalAmount}>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;