import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import styles from './CategoryPage.module.css';
import type { Product } from '../types/products';

const CategoryPage: React.FC = () => {
  const { gender, subCategory } = useParams(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const displayTitle = subCategory?.replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/products`, {
          params: {
            category: gender,      // HOMBRE o MUJER
            subCategory: displayTitle // "VER TODO" o el nombre de la prenda
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [gender, subCategory, displayTitle]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <p>Home / {gender} / {displayTitle}</p>
        </div>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{displayTitle}</h1>
          <span className={styles.count}>{products.length} Productos</span>
        </div>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h4>ORDENAR</h4>
            <ul>
              <li>Relevancia</li>
              <li>Precio: Menor a Mayor</li>
              <li>Precio: Mayor a Menor</li>
            </ul>
          </div>
        </aside>

        <main className={styles.productGrid}>
          {loading ? (
            <div className={styles.loading}>Cargando {displayTitle}...</div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className={styles.noProducts}>
                Lo sentimos, no hay stock disponible en {displayTitle} para {gender} en este momento.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;