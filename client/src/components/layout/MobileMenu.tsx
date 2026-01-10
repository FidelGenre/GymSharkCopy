import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import styles from './MobileMenu.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.menu}>
        <div className={styles.header}>
          <button onClick={onClose}><X size={28} /></button>
          <span className={styles.logo}>GYMSHARK</span>
        </div>
        
        <div className={styles.links}>
          <button className={styles.mainLink}>MUJER <ChevronRight /></button>
          <button className={styles.mainLink}>HOMBRE <ChevronRight /></button>
          <button className={styles.mainLink}>ACCESORIOS <ChevronRight /></button>
        </div>

        <div className={styles.footer}>
          <a href="#">MI CUENTA</a>
          <a href="#">AYUDA</a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;