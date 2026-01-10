import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import styles from './MegaMenu.module.css';

interface Props {
  category: 'MUJER' | 'HOMBRE' | null;
  isVisible: boolean;
  isMobile?: boolean; 
  onClose?: () => void;
}

const MegaMenu: React.FC<Props> = ({ category, isVisible, isMobile, onClose }) => {
  if (!isVisible) return null;

  const menuData = {
    MUJER: [
      { title: 'PARTES SUPERIORES', links: [{ label: 'Tops Deportivos', id: 'BRASIER' }, { label: 'Mangas Largas', id: 'MANGALARGA' }, { label: 'Sudaderas', id: 'SUDADERA' }, { label: 'Camperas', id: 'CAMPERAS' }] },
      { title: 'PARTES INFERIORES', links: [{ label: 'Leggings', id: 'LEGGINS' }, { label: 'Shorts', id: 'SHORTS' }, { label: 'Joggers', id: 'JOGGERS' }] },
      { title: 'EXPLORAR', links: [{ label: 'Ver Todo', id: 'VER-TODO' }, { label: 'Colecciones', id: 'COLECCIONES' }] }
    ],
    HOMBRE: [
      { title: 'PARTES SUPERIORES', links: [{ label: 'Remeras', id: 'REMERAS' }, { label: 'Musculosas', id: 'MUSCULOSAS' }, { label: 'Mangas Largas', id: 'MANGASLARGA' }, { label: 'Sudaderas', id: 'SUDADERAS' }, { label: 'Camperas', id: 'CAMPERA' }] },
      { title: 'PARTES INFERIORES', links: [{ label: 'Shorts', id: 'SHORTS' }, { label: 'Joggers', id: 'JOGGERS' }] },
      { title: 'EXPLORAR', links: [{ label: 'Ver Todo', id: 'VER-TODO' }, { label: 'Novedades', id: 'NEW' }] }
    ]
  };

  // --- MÓVIL (Sidebar) ---
  if (isMobile) {
    return (
      <div className={styles.mobileOverlay} onClick={onClose}>
        <div className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.mobileHeader}>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={28} strokeWidth={1.5} />
            </button>
          </div>

          <div className={styles.mobileContent}>
            {['MUJER', 'HOMBRE'].map((cat) => (
              <div key={cat} className={styles.mobileCategoryGroup}>
                <h3 className={styles.mobileCatTitle}>{cat}</h3>
                <ul className={styles.mobileList}>
                  {menuData[cat as 'MUJER' | 'HOMBRE'].map((group) => 
                    group.links.map((link) => (
                      <li key={link.id}>
                        <Link 
                          to={`/category/${cat}/${link.id}`} 
                          className={styles.mobileLink}
                          onClick={onClose}
                        >
                          {link.label}
                          <ChevronRight size={16} opacity={0.5} />
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP ---
  if (!category) return null;

  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>
        <div className={styles.columnsWrapper}>
          {menuData[category]?.map((col, index) => (
            <div key={index} className={styles.column}>
              <h4 className={styles.columnTitle}>{col.title}</h4>
              <ul className={styles.linkList}>
                {col.links.map((item) => (
                  <li key={item.id}>
                    <Link to={`/category/${category}/${item.id}`} className={styles.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;