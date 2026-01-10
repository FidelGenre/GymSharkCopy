import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, ChevronDown, X, Info } from 'lucide-react';
import { formatARS } from '../../utils/formatCurrency';
import styles from './Checkout.module.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const shippingCost = 15500;

  // 1. Estado para dirección de envío
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    province: 'Santa Fe',
    phone: '',
    country: 'Argentina'
  });

  // 2. Estado para dirección de facturación (Billing)
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    province: 'Santa Fe'
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, number: formattedValue });
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName
      }));
    }
  }, [user]);

  const provincias = [
    "CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", 
    "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", 
    "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", 
    "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
  ];

  const handleFinishPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Payload ajustado para Card.java (Backend)
      const paymentPayload = {
        email: formData.email,
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardHolderName: cardData.name,
        expiryDate: cardData.expiry,
        cvv: cardData.cvv,
        amount: cartTotal + shippingCost
      };

      // 1. Guardar tarjeta
      const res = await axios.post('http://localhost:8080/api/payments/manual', paymentPayload);

      if (res.status === 200 || res.status === 201) {
        // 2. Crear Orden
        const orderData = {
          userId: user?.id || null,
          totalAmount: cartTotal + shippingCost,
          status: "COMPLETADO",
          items: cartItems?.map(item => ({
            productId: item.id,
            name: item.name,
            size: item.selectedSize,
            quantity: item.quantity,
            price: item.price
          }))
        };

        await axios.post('http://localhost:8080/api/orders', orderData);
        alert("¡Compra realizada con éxito!");
        clearCart();
        navigate('/orders'); 
      }
    } catch (error) {
      alert("Error al procesar el pago. Verifica los datos.");
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutPage}>
        <div className={styles.leftColumn}>
          <form onSubmit={handleFinishPurchase}>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>CONTACTO</h2>
              <input 
                type="email" placeholder="Email" className={styles.inputField} required 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> 
                <span>Enviarme novedades y ofertas por correo electrónico</span>
              </label>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>ENTREGA</h2>
              <div className={styles.selectWrapper}>
                <select className={styles.inputField} disabled value="Argentina">
                  <option value="Argentina">Argentina</option>
                </select>
                <ChevronDown className={styles.selectIcon} size={16} />
              </div>
              
              <div className={styles.inputRow}>
                <input type="text" placeholder="Nombre" className={styles.inputField} required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <input type="text" placeholder="Apellido" className={styles.inputField} required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>

              <input type="text" placeholder="Dirección (Calle y altura)" className={styles.inputField} required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <input type="text" placeholder="Departamento, suite, unidad, etc. (opcional)" className={styles.inputField} value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} />

              <div className={styles.inputRowThree}>
                <input type="text" placeholder="Código postal" className={styles.inputField} required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})}/>
                <input type="text" placeholder="Ciudad" className={styles.inputField} required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
                <div className={styles.selectWrapper}>
                  <select className={styles.inputField} required value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
                    {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className={styles.selectIcon} size={16} />
                </div>
              </div>

              <input type="tel" placeholder="Teléfono" className={styles.inputField} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>MÉTODO DE ENVÍO</h2>
              <div className={styles.shippingMethodBox}>
                <span>Express (4-6 Días Hábiles)</span>
                <strong>{formatARS(shippingCost)}</strong>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>PAGO</h2>
              <div className={styles.paymentContainer}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentType}>
                    <div className={styles.radioActive}></div>
                    <span>Tarjeta de Crédito/Débito</span>
                  </div>
                  <div className={styles.cardLogos}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className={styles.visaLogo}/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                    <img src="unnamed (5).jpg" alt="American Express" />
                    <img src="unnamed.jpg" alt="Naranja" />
                    <img src="unnamed (1).jpg" alt="Maestro" />
                  </div>
                </div>

                <div className={styles.cardForm}>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" placeholder="Número de tarjeta" className={styles.cardInput} 
                      maxLength={19} value={cardData.number} onChange={handleCardNumberChange} required 
                    />
                    <Lock size={16} className={styles.lockIcon} />
                  </div>
                  <div className={styles.inputRow}>
                    <input type="text" placeholder="Vencimiento (MM / YY)" className={styles.cardInput} value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} required />
                    <div className={styles.inputWrapper}>
                      <input type="text" placeholder="Código seg." className={styles.cardInput} maxLength={4} value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} required />
                      <Info size={16} className={styles.lockIcon} />
                    </div>
                  </div>
                  <input type="text" placeholder="Nombre en la tarjeta" className={styles.cardInput} value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} required />
                </div>

                <div className={styles.billingToggle}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={useShippingAsBilling} onChange={() => setUseShippingAsBilling(!useShippingAsBilling)} />
                    <span>Usar dirección de envío como dirección de facturación</span>
                  </label>
                </div>

                {/* FORMULARIO DE FACTURACIÓN (BILLING) */}
                {!useShippingAsBilling && (
                  <div className={styles.billingAddressForm}>
                    <h3 className={styles.billingTitle}>DIRECCIÓN DE FACTURACIÓN</h3>
                    <div className={styles.selectWrapper}>
                      <select className={styles.inputField} disabled value="Argentina">
                        <option value="Argentina">Argentina</option>
                      </select>
                      <ChevronDown className={styles.selectIcon} size={16} />
                    </div>
                    <div className={styles.inputRow}>
                      <input type="text" placeholder="Nombre" className={styles.inputField} value={billingData.firstName} onChange={e => setBillingData({...billingData, firstName: e.target.value})} />
                      <input type="text" placeholder="Apellido" className={styles.inputField} value={billingData.lastName} onChange={e => setBillingData({...billingData, lastName: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Dirección" className={styles.inputField} value={billingData.address} onChange={e => setBillingData({...billingData, address: e.target.value})} />
                    <div className={styles.inputRowThree}>
                      <input type="text" placeholder="Código postal" className={styles.inputField} value={billingData.postalCode} onChange={e => setBillingData({...billingData, postalCode: e.target.value})} />
                      <input type="text" placeholder="Ciudad" className={styles.inputField} value={billingData.city} onChange={e => setBillingData({...billingData, city: e.target.value})} />
                      <div className={styles.selectWrapper}>
                        <select className={styles.inputField} value={billingData.province} onChange={e => setBillingData({...billingData, province: e.target.value})}>
                          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown className={styles.selectIcon} size={16} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className={styles.payNowBtn}>PAGAR AHORA</button>
          </form>
        </div>

        <aside className={styles.rightColumn}>
          <div className={styles.itemList}>
            {cartItems?.map((item) => {
              const rawImg = item.image || (item.images && item.images[0]) || '';
              const displayImage = rawImg.startsWith('http') ? rawImg : rawImg.startsWith('/') ? rawImg : `/${rawImg}`;

              return (
                <div key={`${item.id}-${item.selectedSize}`} className={styles.summaryItem}>
                  <div className={styles.imgContainer}>
                    <img 
                      src={displayImage} 
                      alt={item.name} 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/imagegym.webp'; }}
                    />
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemSize}>{item.selectedSize}</p>
                  </div>
                  <p className={styles.itemPrice}>{formatARS(item.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalLine}><span>Subtotal</span><span>{formatARS(cartTotal)}</span></div>
            <div className={styles.totalLine}><span>Envío</span><span>{formatARS(shippingCost)}</span></div>
            <div className={`${styles.totalLine} ${styles.grandTotal}`}>
              <span>Total</span><span><strong>{formatARS(cartTotal + shippingCost)}</strong></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;