import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, ChevronDown, Info, CreditCard } from 'lucide-react';
import { formatARS } from '../../utils/formatCurrency';
import styles from './Checkout.module.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const shippingCost = 6000;
  
  // Estado para tipo de pago
  const [paymentType, setPaymentType] = useState<'credit' | 'debit'>('debit');
  
  // Estado para las cuotas
  const [installments, setInstallments] = useState<number>(1);

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  // --- LÓGICA MAESTRA DE TOTALES ---
  const calculateTotals = () => {
    let subtotal = cartTotal;
    let discountAmount = 0;

    // 1. APLICAMOS EL DESCUENTO DE CRÉDITO (20% OFF)
    if (paymentType === 'credit') {
      discountAmount = subtotal * 0.20; // 20% de descuento
      subtotal = subtotal - discountAmount;
    }

    // Total base antes de intereses (Subtotal con descuento + Envío)
    const baseTotalWithShipping = subtotal + shippingCost;
    let interestAmount = 0;

    // 2. APLICAMOS INTERESES POR CUOTAS (AUMENTADOS)
    if (paymentType === 'credit') {
       // 1, 3 y 6 son Sin Interés
       
       // 🔥 INTERESES MÁS ALTOS AQUÍ:
       if (installments === 9) interestAmount = baseTotalWithShipping * 0.40; // 40% recargo
       if (installments === 12) interestAmount = baseTotalWithShipping * 0.75; // 75% recargo
    }

    const totalToPay = baseTotalWithShipping + interestAmount;
    const amountPerInstallment = totalToPay / installments;

    return {
      subtotalOriginal: cartTotal,
      discountAmount,
      interestAmount,
      totalToPay,
      amountPerInstallment,
      baseTotalWithShipping // Lo retornamos para usarlo en el <select>
    };
  };

  const { totalToPay, discountAmount, interestAmount, amountPerInstallment, baseTotalWithShipping } = calculateTotals();

  // Resetear cuotas a 1 si cambia a débito
  useEffect(() => {
    if (paymentType === 'debit') {
      setInstallments(1);
    }
  }, [paymentType]);

  // --- FORMULARIOS ---
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
    const billingSource = useShippingAsBilling ? formData : billingData;

    try {
      const paymentPayload = {
        email: formData.email,
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardHolderName: cardData.name,
        expiryDate: cardData.expiry,
        cvv: cardData.cvv,
        amount: totalToPay, 
        paymentType: paymentType,
        installments: installments,

        // Datos de Entrega
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        postalCode: formData.postalCode,
        province: formData.province,
        phone: formData.phone,

        // Datos de Facturación
        billingFirstName: billingSource.firstName,
        billingLastName: billingSource.lastName,
        billingAddress: billingSource.address, 
        billingCity: billingSource.city,
        billingPostalCode: billingSource.postalCode,
        billingProvince: billingSource.province
      };

      const res = await axios.post('https://gymsharkcopyserver.onrender.com/api/payments/manual', paymentPayload);

      if (res.status === 200 || res.status === 201) {
        const orderData = {
          userId: user?.id || null,
          totalAmount: totalToPay,
          status: "COMPLETADO",
          items: cartItems?.map(item => ({
              productId: item.id,
              name: item.name,
              size: item.selectedSize,
              quantity: item.quantity,
              price: item.price
            }))
        };

        await axios.post('https://gymsharkcopyserver.onrender.com/api/orders', orderData);
        
        alert("¡Compra realizada con éxito!");
        clearCart();
        navigate('/orders'); 
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago. Verifica los datos o intenta más tarde.");
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutPage}>
        <div className={styles.leftColumn}>
          <form onSubmit={handleFinishPurchase}>
            
            {/* SECCIÓN CONTACTO */}
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

            {/* SECCIÓN ENTREGA */}
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

            {/* SECCIÓN MÉTODO DE ENVÍO */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>MÉTODO DE ENVÍO</h2>
              <div className={styles.shippingMethodBox}>
                <span>Express (4-6 Días Hábiles)</span>
                <strong>{formatARS(shippingCost)}</strong>
              </div>
            </div>

            {/* SECCIÓN PAGO */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>PAGO</h2>
              <div className={styles.paymentContainer}>
                
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentType}>
                    <div className={styles.radioActive}></div>
                    <span>Tarjeta de Crédito/Débito</span>
                  </div>
                  <div className={styles.cardLogos}>
                    <CreditCard size={24} />
                  </div>
                </div>

                <div className={styles.cardForm}>
                  
                  {/* SELECTOR TIPO TARJETA */}
                  <div className={styles.typeSelector}>
                    <label className={`${styles.typeOption} ${paymentType === 'debit' ? styles.selected : ''}`}>
                      <input 
                        type="radio" name="paymentType" value="debit" 
                        checked={paymentType === 'debit'} onChange={() => setPaymentType('debit')}
                      />
                      <span>Débito</span>
                    </label>

                    <label className={`${styles.typeOption} ${paymentType === 'credit' ? styles.selected : ''}`}>
                      <input 
                        type="radio" name="paymentType" value="credit" 
                        checked={paymentType === 'credit'} onChange={() => setPaymentType('credit')}
                      />
                      <span>Crédito <small style={{color: '#2ecc71', fontWeight: 'bold'}}>(20% OFF)</small></span>
                    </label>
                  </div>

                  {/* DATOS TARJETA */}
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

                  {/* 🟢 NUEVO: SELECTOR DE CUOTAS (Solo si es Crédito) */}
                  {paymentType === 'credit' && (
                    <div className={styles.installmentsWrapper}>
                      <label className={styles.installmentsLabel}>Elegir plan de cuotas:</label>
                      <div className={styles.selectWrapper}>
                        <select 
                          className={styles.inputField} 
                          value={installments} 
                          onChange={(e) => setInstallments(Number(e.target.value))}
                        >
                          <option value={1}>1 pago de {formatARS(baseTotalWithShipping)} (Sin interés)</option>
                          <option value={3}>3 cuotas de {formatARS(baseTotalWithShipping/3)} (Sin interés)</option>
                          <option value={6}>6 cuotas de {formatARS(baseTotalWithShipping/6)} (Sin interés)</option>
                          
                          {/* Cuotas con Interés ALTO (40% y 75%) */}
                          <option value={9}>
                            9 cuotas de {formatARS((baseTotalWithShipping * 1.40)/9)} (Total: {formatARS(baseTotalWithShipping * 1.40)})
                          </option>
                          <option value={12}>
                            12 cuotas de {formatARS((baseTotalWithShipping * 1.75)/12)} (Total: {formatARS(baseTotalWithShipping * 1.75)})
                          </option>
                        </select>
                        <ChevronDown className={styles.selectIcon} size={16} />
                      </div>
                    </div>
                  )}

                </div>

                {/* TOGGLE FACTURACIÓN */}
                <div className={styles.billingToggle}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" checked={useShippingAsBilling} 
                      onChange={() => setUseShippingAsBilling(!useShippingAsBilling)} 
                    />
                    <span>Usar dirección de envío como dirección de facturación</span>
                  </label>
                </div>

                {!useShippingAsBilling && (
                  <div className={styles.billingAddressForm}>
                    <h3 className={styles.billingTitle}>DIRECCIÓN DE FACTURACIÓN</h3>
                    <input type="text" placeholder="Dirección" className={styles.inputField} value={billingData.address} onChange={e => setBillingData({...billingData, address: e.target.value})} />
                     <div className={styles.inputRow}>
                      <input type="text" placeholder="Nombre" className={styles.inputField} value={billingData.firstName} onChange={e => setBillingData({...billingData, firstName: e.target.value})} />
                      <input type="text" placeholder="Apellido" className={styles.inputField} value={billingData.lastName} onChange={e => setBillingData({...billingData, lastName: e.target.value})} />
                    </div>
                    <div className={styles.inputRowThree}>
                      <input type="text" placeholder="CP" className={styles.inputField} value={billingData.postalCode} onChange={e => setBillingData({...billingData, postalCode: e.target.value})} />
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

            <button type="submit" className={styles.payNowBtn}>
              PAGAR AHORA {formatARS(totalToPay)}
            </button>
          </form>
        </div>

        {/* RESUMEN DERECHA */}
        <aside className={styles.rightColumn}>
          <div className={styles.itemList}>
            {cartItems?.map((item) => {
               const unitPrice = paymentType === 'credit' ? item.price * 0.80 : item.price; // 20% menos

               return (
                <div key={`${item.id}-${item.selectedSize}`} className={styles.summaryItem}>
                  <div className={styles.imgContainer}>
                    <img 
                      src={item.image || (item.images && item.images[0]) || ''} 
                      alt={item.name} 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/imagegym.webp'; }}
                    />
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemSize}>{item.selectedSize}</p>
                    {paymentType === 'credit' && <span className={styles.discountTag}>20% OFF</span>}
                  </div>
                  <p className={styles.itemPrice}>{formatARS(unitPrice * item.quantity)}</p>
                </div>
               );
            })}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalLine}><span>Subtotal</span><span>{formatARS(cartTotal)}</span></div>
            
            {paymentType === 'credit' && (
               <div className={styles.totalLine} style={{color: '#2ecc71', fontWeight: 'bold'}}>
                 <span>Descuento Tarjeta Crédito (20%)</span>
                 <span>- {formatARS(discountAmount)}</span>
               </div>
            )}

            <div className={styles.totalLine}><span>Envío</span><span>{formatARS(shippingCost)}</span></div>
            
            {interestAmount > 0 && (
              <div className={styles.totalLine}>
                <span>Recargo Cuotas ({installments})</span>
                <span>+ {formatARS(interestAmount)}</span>
              </div>
            )}
            
            <div className={`${styles.totalLine} ${styles.grandTotal}`}>
              <span>Total</span><span><strong>{formatARS(totalToPay)}</strong></span>
            </div>

            {paymentType === 'credit' && installments > 1 && (
               <div className={styles.installmentsSummary} style={{textAlign: 'right', fontSize: '13px', color: '#555', marginTop: '5px'}}>
                 Pagás en <strong>{installments} cuotas</strong> de <strong>{formatARS(amountPerInstallment)}</strong>
               </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;