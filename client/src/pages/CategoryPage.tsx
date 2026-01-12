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
  
  // Estado para el ordenamiento: 'relevance', 'asc' (menor precio), 'desc' (mayor precio)
  const [sortOption, setSortOption] = useState<'relevance' | 'asc' | 'desc'>('relevance');

  const displayTitle = subCategory?.replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/products`, {
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
    // Reseteamos el filtro al cambiar de categoría
    setSortOption('relevance');
  }, [gender, subCategory, displayTitle]);

  // --- LÓGICA DE ORDENAMIENTO ---
  const sortedProducts = useMemo(() => {
    // Creamos una copia para no mutar el estado original
    const items = [...products];

    if (sortOption === 'asc') {
      return items.sort((a, b) => a.price - b.price);
    } 
    if (sortOption === 'desc') {
      return items.sort((a, b) => b.price - a.price);
    }
    
    // Si es 'relevance', devolvemos el array tal cual viene de la API (por ID o fecha)
    return items.sort((a, b) => a.id - b.id); 
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