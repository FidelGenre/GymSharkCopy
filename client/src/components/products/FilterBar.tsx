import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar: React.FC = () => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.left}>
        <button className={styles.filterBtn}>
          FILTRAR Y ORDENAR
        </button>
        <p className={styles.count}>4 productos</p>
      </div>
      <div className={styles.right}>
        <select className={styles.sortSelect}>
          <option>Relevancia</option>
          <option>Precio: Menor a Mayor</option>
          <option>Precio: Mayor a Menor</option>
          <option>Lo más nuevo</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;