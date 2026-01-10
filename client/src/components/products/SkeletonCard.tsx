import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard: React.FC = () => {
  return (
    <div className={styles.skeletonCard}>
      {/* Espacio para la imagen */}
      <div className={styles.skeletonImage}></div>
      
      {/* Espacio para el texto del nombre */}
      <div className={styles.skeletonText}></div>
      
      {/* Espacio para la categoría */}
      <div className={styles.skeletonSubText}></div>
      
      {/* Espacio para el precio */}
      <div className={styles.skeletonPrice}></div>
    </div>
  );
};

export default SkeletonCard;