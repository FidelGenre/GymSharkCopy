import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/products';
import { formatARS } from '../../utils/formatCurrency'; // 1. Importamos la utilidad

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();

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
        {product.tag && <span className={styles.tag}>{product.tag}</span>}
        
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
          {/* 2. Reemplazamos el formato viejo por formatARS */}
          <span className={styles.price}>{formatARS(product.price)}</span>
        </div>
        <p className={styles.category}>{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;