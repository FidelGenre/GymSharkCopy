import React, { useEffect, useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, Info, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatARS } from '../../utils/formatCurrency'; // Importamos la utilidad
import styles from './CartDrawer.module.css';

const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, isDrawerOpen, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Cálculo de subtotales
  const subTotal = cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  
  // Ajustamos el envío a un valor coherente en Pesos (ej. 15.000 ARS)
  const shipping = 6000; 
  const total = subTotal + shipping;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim() !== '') setShowError(true);
  };

  return (
    <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <ShoppingBag size={20} />
            <h3>TU BOLSA</h3>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {(!cartItems || cartItems.length === 0) ? (
            <div className={styles.emptyMsg}>Tu bolsa está vacía.</div>
          ) : (
            cartItems.map(item => {
              const rawImage = item.image || (item.images && item.images[0]) || '';
              const displayImage = (rawImage.startsWith('http') || rawImage.startsWith('/')) ? rawImage : `/${rawImage}`;

              return (
                <div key={`${item.id}-${item.selectedSize}`} className={styles.cartItem}>
                  <img src={displayImage} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemDetail}>Talle: {item.selectedSize}</p>
                    <div className={styles.quantityContainer}>
                      <div className={styles.quantitySelector}>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.selectedSize, -1)}><Minus size={14} /></button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.selectedSize, 1)}><Plus size={14} /></button>
                      </div>
                      {/* Precio unitario formateado */}
                      <p className={styles.itemPrice}>{formatARS(item.price)}</p>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id, item.selectedSize)}><Trash2 size={18} /></button>
                </div>
              );
            })
          )}
        </div>

        {cartItems?.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.discountSection}>
              <p className={styles.sectionTitle}>CÓDIGO DE DESCUENTO</p>
              <form className={styles.promoForm} onSubmit={handleApplyCode}>
                <input 
                  type="text" placeholder="Introduce el código" 
                  className={`${styles.promoInput} ${showError ? styles.inputError : ''}`}
                  value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setShowError(false); }}
                />
                <button type="submit" className={styles.applyBtn}>APLICAR</button>
              </form>
              {showError && <p className={styles.errorMsg}>El código de descuento no es válido.</p>}
              <div className={styles.infoRow}><Info size={14} /><span>Los códigos de tarjetas regalo se aplican en el checkout.</span></div>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.sectionTitle}>RESUMEN DEL PEDIDO</p>
              
              {/* Totales formateados */}
              <div className={styles.totalLine}>
                <span>Subtotal</span>
                <span>{formatARS(subTotal)}</span>
              </div>
              <div className={styles.totalLine}>
                <span>Envío estimado</span>
                <span>{formatARS(shipping)}</span>
              </div>
              <div className={`${styles.totalLine} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>{formatARS(total)}</span>
              </div>
            </div>

            <button className={styles.checkoutBtn} onClick={() => { setIsDrawerOpen(false); navigate('/checkout'); }}>
              <Lock size={16} /> PAGAR DE FORMA SEGURA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;