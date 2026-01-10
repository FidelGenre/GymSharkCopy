import React, { useEffect, useState } from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard'; 
import { productService } from '../../services/productService';
import type { Product } from '../../types/products';

interface Props {
  categoryFilter: string | null;
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<Props> = ({ categoryFilter, onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll(categoryFilter);
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.grid}>
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {products.map((product) => (
          <div 
            key={product.id} 
            className={styles.cardWrapper} 
            onClick={() => onProductClick(product)}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;