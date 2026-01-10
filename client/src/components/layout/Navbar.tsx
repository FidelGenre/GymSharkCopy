import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, LogOut, Package, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import MegaMenu from './MegaMenu';

const logoUrl = '/gymsharklogo.avif';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { setIsDrawerOpen, totalItems } = useCart();
  const { user, logout } = useAuth();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'MUJER' | 'HOMBRE' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenCart = () => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    setIsDrawerOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveMenu(null);
  };

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
                  /* ENLACE AL PERFIL (Solo con ícono) */
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
              <span>What are you looking for today?</span>
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