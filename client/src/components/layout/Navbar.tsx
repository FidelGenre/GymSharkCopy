import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ArrowLeft } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import MegaMenu from './MegaMenu';

const logoUrl = '/gymsharklogo.avif';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsDrawerOpen, totalItems } = useCart();
  const { user } = useAuth();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'MUJER' | 'HOMBRE' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LÓGICA MINIMALISTA ---
  // Detectar si estamos en una de las páginas limpias
  const isMinimalistPage = ['/login', '/register', '/profile', '/orders', '/checkout'].some(path => 
    location.pathname.startsWith(path)
  );

  const handleOpenCart = () => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    setIsDrawerOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveMenu(null);
  };

  // --- RENDERIZADO 1: NAVBAR MINIMALISTA (Login, Profile, etc.) ---
  if (isMinimalistPage) {
    return (
      <header className={styles.minimalHeader}>
        <div className={styles.minimalContainer}>
          {/* Botón Volver */}
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft color="black" size={24} />
            <span className={styles.backText}>Volver</span>
          </button>

          {/* Logo Centrado */}
          <Link to="/" className={styles.logoMinimal}>
             <img src={logoUrl} alt="Gymshark Logo" className={styles.logoImage} />
          </Link>
          
          {/* Espaciador vacío para equilibrar el centro */}
          <div style={{ width: '60px' }}></div> 
        </div>
      </header>
    );
  }

  // --- RENDERIZADO 2: NAVBAR COMPLETA (Home, Tienda) ---
  return (
    <>
      <header 
        className={styles.header}
        onMouseLeave={() => !isMobileMenuOpen && setActiveMenu(null)}
      >
        <nav className={styles.navbar}>
          <div className={styles.topRow}>
            <div className={styles.navLeft}>
              <button className={styles.menuBtn} onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>

              <div className={styles.desktopNav}>
                {['MUJER', 'HOMBRE'].map((cat) => (
                  <button 
                    key={cat}
                    className={styles.navLink} 
                    onMouseEnter={() => setActiveMenu(cat as 'MUJER' | 'HOMBRE')}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.logo}>
              <Link to="/" className={styles.logoLink} onClick={() => setIsMobileMenuOpen(false)}>
                <img src={logoUrl} alt="Gymshark Logo" className={styles.logoImage} />
              </Link>
            </div>

            <div className={styles.navRight}>
              <button className={`${styles.iconBtn} ${styles.desktopOnly}`} onClick={() => setIsSearchOpen(true)}>
                <Search size={22} strokeWidth={1.5} />
              </button>
              
              <div className={styles.authSection}>
                {user ? (
                  <Link to="/profile" className={styles.userSessionLink}>
                    <div className={styles.userIconWrapper}>
                      <User size={22} strokeWidth={1.5} />
                    </div>
                  </Link>
                ) : (
                  <Link to="/login" className={styles.iconBtn}>
                    <User size={22} strokeWidth={1.5} />
                  </Link>
                )}
              </div>
              
              <button className={styles.cartBtn} onClick={handleOpenCart}>
                <ShoppingBag size={22} strokeWidth={1.5} />
                {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </button>
            </div>
          </div>

          <div className={styles.mobileSearchRow}>
            <button className={styles.searchBarMock} onClick={() => setIsSearchOpen(true)}>
              <Search size={18} className={styles.searchIcon} />
              <span>¿Qué estás buscando hoy?</span>
            </button>
          </div>
        </nav>

        <MegaMenu 
          category={activeMenu} 
          isVisible={activeMenu !== null || isMobileMenuOpen} 
          isMobile={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </header>

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;