import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SearchOverlay.module.css';
import type { Product } from '../../types/products';
import { formatARS } from '../../utils/formatCurrency';

interface Props { isOpen: boolean; onClose: () => void; }

const SearchOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
      // Carga desde Spring Boot
      axios.get('http://localhost:8080/api/products')
        .then(res => setAllProducts(res.data))
        .catch(err => console.error("Error cargando productos:", err));
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setFilteredResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 1) { 
      setFilteredResults([]); 
      return; 
    }
    
    // SEPARACIÓN POR PALABRAS CLAVE: Permite buscar "short f" y encontrar "Shorts Focus"
    const keywords = term.split(' ').filter(word => word.length > 0);

    const results = allProducts.filter(p => {
      const name = p.name.toLowerCase();
      const category = (p.category || '').toLowerCase();
      const subCategory = (p.subCategory || '').toLowerCase();

      // El producto debe contener TODAS las palabras escritas en el buscador
      return keywords.every(key => 
        name.includes(key) || 
        category.includes(key) || 
        subCategory.includes(key)
      );
    });

    setFilteredResults(results.slice(0, 6));
  }, [searchTerm, allProducts]);

  // LÓGICA DE IMAGEN: Sincronizada con List<String> images de tu Backend Java
  const getProductImage = (product: any) => {
    const rawPath = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : product.image || '';
    
    if (!rawPath) return '/imagegym.webp';
    if (rawPath.startsWith('http')) return rawPath;
    
    // Forzamos "/" inicial para evitar errores de red y cargar desde public/
    const cleanPath = rawPath.trim();
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="¿Qué estás buscando hoy?" 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={styles.closeBtn} onClick={onClose}><X size={28} /></button>

        {filteredResults.length > 0 && (
          <div className={styles.resultsDropdown}>
            {filteredResults.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                className={styles.resultItem} 
                onClick={onClose}
              >
                <img 
                  src={getProductImage(product)} 
                  alt={product.name} 
                  className={styles.resultImg}
                  onError={(e) => {
                    // Fallback si la ruta local no existe
                    (e.target as HTMLImageElement).src = '/imagegym.webp';
                  }}
                />
                <div className={styles.resultInfo}>
                  <p className={styles.resultName}>{product.name}</p>
                  <p className={styles.resultCategory}>{product.category}</p>
                </div>
                {/* Formato de moneda para Argentina: $ 45.000 */}
                <p className={styles.resultPrice}>{formatARS(product.price)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;