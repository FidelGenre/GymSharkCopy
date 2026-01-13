import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Hero.module.css';
import ProductCard from '../products/ProductCard';
import type { Product } from '../../types/products';

const Hero: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newStyles, setNewStyles] = useState<Product[]>([]);
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);
  const [activeGender, setActiveGender] = useState<'MUJER' | 'HOMBRE'>('MUJER');
  
  const newStylesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const shuffle = (array: Product[]) => [...array].sort(() => 0.5 - Math.random());

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 🟢 FIX: URL apuntando DIRECTO a Render para evitar errores de localhost
        const response = await axios.get('https://gymsharkcopyserver.onrender.com/api/products');
        
        const data: Product[] = response.data;
        // Si data es null o undefined, evitar crash
        if (data && Array.isArray(data)) {
            setAllProducts(data);
            const initialFiltered = data.filter(p => p.category === 'MUJER');
            setNewStyles(shuffle(initialFiltered).slice(0, 12));
            setMoreProducts(shuffle(initialFiltered).slice(0, 12));
        }
      } catch (error) {
        console.error("Error cargando productos. Verifica que el Backend esté 'Live' en Render.", error);
      }
    };
    fetchHomeData();
  }, []);

  const handleGenderSwitch = (gender: 'MUJER' | 'HOMBRE') => {
    setActiveGender(gender);
    const filtered = allProducts.filter(p => p.category === gender);
    setNewStyles(shuffle(filtered).slice(0, 12));
    setMoreProducts(shuffle(filtered).slice(0, 12));
  };

  const getCategories = () => {
    if (activeGender === 'MUJER') {
      return [
        { id: 'BRASIER', name: 'TOPS DEPORTIVOS', img: '/brascard.avif' },
        { id: 'LEGGINS', name: 'LEGGINGS', img: '/legginscard.avif' },
        { id: 'SHORTS', name: 'SHORTS', img: '/shortscard.avif' },
        { id: 'SUDADERA', name: 'SUDADERAS', img: '/sudaderascard.avif' }
      ];
    } else {
      return [
        { id: 'REMERAS', name: 'REMERAS', img: '/remerascard.avif' },
        { id: 'SHORTS', name: 'SHORTS', img: '/shortscardhombre.avif' },
        { id: 'JOGGERS', name: 'JOGGERS', img: '/joggermancard.avif' },
        { id: 'SUDADERAS', name: 'SUDADERAS', img: '/sudaderashombrecard.avif' }
      ];
    }
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.8; 
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.homeWrapper}>
      
      {/* SECCIÓN 1: BANNER PRINCIPAL */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <span className={styles.tagline}>Compra las nuevas colecciones 2026</span>
            <h2 className={styles.title}>NUEVOS <br /> ESTILOS</h2>
            <div className={styles.actions}>
              <button className={styles.primaryBtn} onClick={() => handleGenderSwitch('MUJER')}>
                COMPRAR MUJER
              </button>
              <button className={styles.primaryBtn} onClick={() => handleGenderSwitch('HOMBRE')}>
                COMPRAR HOMBRE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: BRAND NEW STYLES */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>NUEVOS ESTILOS - {activeGender}</h2>
          <div className={styles.controls}>
            <button onClick={() => scroll(newStylesRef, 'left')} className={styles.controlBtn}><ChevronLeft size={20}/></button>
            <button onClick={() => scroll(newStylesRef, 'right')} className={styles.controlBtn}><ChevronRight size={20}/></button>
          </div>
        </div>
        <div className={styles.slider} ref={newStylesRef}>
          {newStyles.map((p) => (
            <div key={p.id} className={styles.sliderItem}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: POPULAR RIGHT NOW */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>POPULAR AHORA MISMO</h2>
        <div className={styles.categoryBannerGrid}>
          {getCategories().map((cat) => (
            <Link key={cat.id} to={`/category/${activeGender}/${cat.id}`} className={styles.popularCategoryCard}>
              <div className={styles.catImgBox}>
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  onError={(e) => (e.currentTarget.src = '/imagegym.webp')} 
                />
              </div>
              <div className={styles.catInfo}>
                <h3 className={styles.catName}>{cat.name}</h3>
                <span className={styles.catLink}>EXPLORAR</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN 4: DUAL SHOP CARDS */}
      <section className={styles.shopSection}>
        <div className={styles.dualBannerGrid}>
          <div className={styles.largeShopCard}>
            <img src="/womanimage.avif" alt="Comprar Mujer" />
            <Link to="/category/MUJER/VER-TODO" className={styles.shopLabel}>COMPRAR MUJER</Link>
          </div>
          <div className={styles.largeShopCard}>
            <img src="/menimage.avif" alt="Comprar Hombre" />
            <Link to="/category/HOMBRE/VER-TODO" className={styles.shopLabel}>COMPRAR HOMBRE</Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: WAIT THERE'S MORE */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ESPERA, HAY MÁS...</h2>
          <div className={styles.controls}>
            <button onClick={() => scroll(moreRef, 'left')} className={styles.controlBtn}><ChevronLeft size={20}/></button>
            <button onClick={() => scroll(moreRef, 'right')} className={styles.controlBtn}><ChevronRight size={20}/></button>
          </div>
        </div>
        <div className={styles.slider} ref={moreRef}>
          {moreProducts.map((p) => (
            <div key={`more-${p.id}`} className={styles.sliderItem}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;