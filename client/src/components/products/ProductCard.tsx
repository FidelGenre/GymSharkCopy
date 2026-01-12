import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/products';
import { formatARS } from '../../utils/formatCurrency';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();

  // --- LÓGICA DE PRECIOS BASADA EN LA BASE DE DATOS ---
  
  // 1. Verificamos si la DB dice que es oferta
  const esOferta = product.tag === 'OFERTA';

  // 2. Obtenemos el precio actual (que ya viene bajo desde la DB)
  const precioActual = product.price;

  // 3. Si es oferta, calculamos el "Precio Viejo" dividiendo por 0.80
  const precioAnterior = esOferta ? precioActual / 0.80 : null;

  // Manejo de URL de imágenes
  const rawImage = product.image || (product.images && product.images[0]) || '';
  const displayImage = (rawImage.startsWith('http') || rawImage.startsWith('/')) 
    ? rawImage 
    : `/${rawImage}`;

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.card} onClick={handleNavigate}>
      <div className={styles.imageContainer}>
        
        {/* --- BADGES (Etiquetas) --- */}
        {/* Solo mostramos badge si es OFERTA. Se eliminó el "else" para etiquetas como "NEW" */}
        {esOferta && (
           <span className={styles.badgeDiscount}>20% DESCUENTO</span>
        )}
        
        <img 
          src={displayImage} 
          alt={product.name} 
          className={styles.productImg} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/imagegym.webp';
          }}
        />

        <div className={styles.overlay}>
          <button className={styles.quickAddBtn}>
            + AÑADIR
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.mainRow}>
          <h3 className={styles.name}>{product.name}</h3>
        </div>

        {/* --- SECCIÓN DE PRECIOS --- */}
        <div className={styles.priceContainer}>
          {esOferta && precioAnterior ? (
            // CASO OFERTA: Precio actual + Precio viejo tachado
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatARS(precioActual)}</span>
              <span className={styles.oldPrice}>{formatARS(precioAnterior)}</span>
            </div>
          ) : (
            // CASO NORMAL: Solo el precio actual
            <span className={styles.price}>{formatARS(precioActual)}</span>
          )}
        </div>
        
        <p className={styles.category}>{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;