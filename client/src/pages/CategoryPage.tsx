import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import styles from './CategoryPage.module.css';
import type { Product } from '../types/products';

const CategoryPage: React.FC = () => {
  const { gender, subCategory } = useParams(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [sortOption, setSortOption] = useState<'relevance' | 'asc' | 'desc'>('relevance');

  const displayTitle = subCategory?.replace(/-/g, ' ').toUpperCase() || '';

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // 🟢 CORREGIDO: Apunta a tu servidor en Render (HTTPS)
        // Eliminamos la lógica de variables de entorno para asegurar que funcione directo
        const API_URL = 'https://gymsharkcopyserver.onrender.com';
        
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            category: gender,      
            subCategory: displayTitle 
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
    setSortOption('relevance');
  }, [gender, subCategory, displayTitle]);

  // --- LÓGICA DE ORDENAMIENTO CORREGIDA ---
  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sortOption === 'asc') {
      return items.sort((a, b) => Number(a.price) - Number(b.price));
    } 
    if (sortOption === 'desc') {
      return items.sort((a, b) => Number(b.price) - Number(a.price));
    }
    
    // Solución al error TS2362/TS2363: forzamos el cast a Number
    return items.sort((a, b) => Number(a.id) - Number(b.id)); 
  }, [products, sortOption]);

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
              <li 
                className={sortOption === 'relevance' ? styles.activeFilter : ''}
                onClick={() => setSortOption('relevance')}
              >
                Relevancia
              </li>
              <li 
                className={sortOption === 'asc' ? styles.activeFilter : ''}
                onClick={() => setSortOption('asc')}
              >
                Precio: Menor a Mayor
              </li>
              <li 
                className={sortOption === 'desc' ? styles.activeFilter : ''}
                onClick={() => setSortOption('desc')}
              >
                Precio: Mayor a Menor
              </li>
            </ul>
          </div>
        </aside>

        <main className={styles.productGrid}>
          {loading ? (
            <div className={styles.loading}>Cargando {displayTitle}...</div>
          ) : sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.noProducts}>
                <p>Lo sentimos, no hay stock disponible en {displayTitle} para {gender} en este momento.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;