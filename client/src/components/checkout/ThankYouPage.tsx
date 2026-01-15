import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { formatARS } from '../../utils/formatCurrency'; // Asegúrate de importar tu formateador

// Definimos los tipos para TypeScript
interface PurchaseState {
  purchaseData: {
    total: number;
    id: string;
  }
}

declare global {
  interface Window {
    gtag: (command: string, action: string, params: any) => void;
  }
}

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PurchaseState;

  useEffect(() => {
    // 1. Seguridad: Si alguien entra directo por URL sin comprar, lo sacamos
    if (!state?.purchaseData) {
      navigate('/');
      return;
    }

    const { total, id } = state.purchaseData;

    // 2. DISPARAR EL PÍXEL DE GOOGLE ADS
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17871751340/CLL5CMKgjeQbEKyR9clC', // <-- TU ID DE LA IMAGEN ANTERIOR
        'value': total,
        'currency': 'ARS',
        'transaction_id': id
      });
      console.log(`Conversión enviada a Google: $${total} (ID: ${id})`);
    }

  }, [state, navigate]);

  if (!state?.purchaseData) return null;

  return (
    <div style={{ padding: '50px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <CheckCircle size={80} color="#2ecc71" style={{ marginBottom: '20px' }} />
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu pedido <strong>#{state.purchaseData.id}</strong> ha sido confirmado.</p>
      
      <div style={{ margin: '30px 0', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <p>Monto total pagado:</p>
        <h2 style={{ color: '#2ecc71' }}>{formatARS(state.purchaseData.total)}</h2>
      </div>

      <p>Hemos enviado un correo de confirmación.</p>
      
      <div style={{ marginTop: '40px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Link to="/orders" style={{ padding: '10px 20px', border: '1px solid #333', textDecoration: 'none', color: '#333', borderRadius: '5px' }}>
          Ver mis pedidos
        </Link>
        <Link to="/" style={{ padding: '10px 20px', background: '#333', textDecoration: 'none', color: '#fff', borderRadius: '5px' }}>
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;