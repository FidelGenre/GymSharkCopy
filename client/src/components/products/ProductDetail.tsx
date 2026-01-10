import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductDetail.module.css';
import { useCart } from '../../context/CartContext';
import { formatARS } from '../../utils/formatCurrency'; // Utility para $ 103.999
import type { Product } from '../../types/products';
import clsx from 'clsx';
import { X } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null); 
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [unit, setUnit] = useState<'CM' | 'IN'>('CM');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Conexión con tu API de Spring Boot
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error cargando el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loader}>Cargando prenda oficial...</div>;
  if (!product) return <div className={styles.loader}>Producto no encontrado.</div>;

  // --- LÓGICA DE IMÁGENES CORREGIDA (Evita net::ERR_NAME_NOT_RESOLVED) ---
  const getDisplayImage = (img: string | undefined) => {
    if (!img) return '/imagegym.webp';
    if (img.startsWith('http')) return img;
    // Asegura que la ruta empiece con / para que el navegador no se pierda
    return img.startsWith('/') ? img : `/${img}`;
  };

  // --- PROCESAMIENTO DE DATOS ---
  const subCat = (product.subCategory || '').trim().toUpperCase();
  const genero = (product.category || 'MUJER').toUpperCase() as 'MUJER' | 'HOMBRE';

  const esBra = subCat === 'BRASIER';
  const esInferior = ['SHORTS', 'JOGGERS', 'LEGGINS'].includes(subCat);

  const tallesBase = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const displaySizes = product.sizes && product.sizes.length > 0 ? product.sizes : tallesBase;

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona un talle");
      return;
    }
    addToCart(product, selectedSize);
  };

  // --- MATRICES DE GUÍA DE TALLES ---
  const braData = {
    CM: {
      headers: ['79-82', '84-87', '89-92', '94-97', '99-102', '104-107'],
      rows: [
        { label: '63-67', sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '68-72', sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '73-77', sizes: ['XS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '78-82', sizes: ['XS', 'S', 'S', 'M', 'L', 'XL'] },
        { label: '83-87', sizes: ['XS', 'S', 'M', 'M', 'L', 'XXL'] },
      ]
    },
    IN: {
      headers: ['31-32', '33-34', '35-36', '37-38', '39-40', '41-42'],
      rows: [
        { label: '25-26', sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '27-28', sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '29-30', sizes: ['XS', 'XS', 'S', 'M', 'L', 'XL'] },
        { label: '31-32', sizes: ['XS', 'S', 'S', 'M', 'L', 'XXL'] },
      ]
    }
  };

  const inferiorData = {
    MUJER: {
      CM: [{ s: 'XS', w: '75', l: '82' }, { s: 'S', w: '80', l: '82' }, { s: 'M', w: '85', l: '82' }, { s: 'L', w: '90', l: '82' }, { s: 'XL', w: '95', l: '82' }, { s: 'XXL', w: '100', l: '82' }],
      IN: [{ s: 'XS', w: '29.5', l: '32' }, { s: 'S', w: '31.5', l: '32' }, { s: 'M', w: '33.5', l: '32' }, { s: 'L', w: '35.5', l: '32' }, { s: 'XL', w: '37.5', l: '32' }, { s: 'XXL', w: '39.5', l: '32' }]
    },
    HOMBRE: {
      CM: [{ s: 'S', w: '76-81', l: '82' }, { s: 'M', w: '81-86', l: '82' }, { s: 'L', w: '86-91', l: '82' }, { s: 'XL', w: '91-96', l: '82' }, { s: 'XXL', w: '96-101', l: '82' }],
      IN: [{ s: 'S', w: '30-32', l: '32' }, { s: 'M', w: '32-34', l: '32' }, { s: 'L', w: '34-36', l: '32' }, { s: 'XL', w: '36-38', l: '32' }, { s: 'XXL', w: '38-40', l: '32' }]
    }
  };

  const superiorData = {
    MUJER: {
      CM: [{ s: 'XS', b: '78-83', w: '62-67' }, { s: 'S', b: '83-88', w: '67-72' }, { s: 'M', b: '88-93', w: '72-77' }, { s: 'L', b: '93-98', w: '77-82' }, { s: 'XL', b: '98-103', w: '82-87' }, { s: 'XXL', b: '103-108', w: '87-92' }],
      IN: [{ s: 'XS', b: '30-32', w: '24-26' }, { s: 'S', b: '33-35', w: '26-28' }, { s: 'M', b: '35-37', w: '28-30' }, { s: 'L', b: '37-39', w: '30-32' }, { s: 'XL', b: '39-41', w: '32-34' }, { s: 'XXL', b: '41-43', w: '34-36' }]
    },
    HOMBRE: {
      CM: [{ s: 'S', c: '91-96', w: '76-81' }, { s: 'M', c: '96-101', w: '81-86' }, { s: 'L', c: '101-106', w: '86-91' }, { s: 'XL', c: '106-111', w: '91-96' }, { s: 'XXL', c: '111-116', w: '96-101' }],
      IN: [{ s: 'S', c: '36-38', w: '30-32' }, { s: 'M', c: '38-40', w: '32-34' }, { s: 'L', c: '40-42', w: '34-36' }, { s: 'XL', c: '42-44', w: '36-38' }, { s: 'XXL', c: '44-46', w: '38-40' }]
    }
  };

  return (
    <div className={styles.pageContainer}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← VOLVER A LA TIENDA</button>

      <div className={styles.content}>
        {/* GALERÍA */}
        <div className={styles.galleryWrapper}>
          <div className={styles.thumbnailList}>
            {(product.images || [product.image]).map((img: string, i: number) => (
              <button 
                key={i} 
                className={clsx(styles.thumbBtn, i === selectedImageIndex && styles.activeThumb)} 
                onClick={() => setSelectedImageIndex(i)}
              >
                <img src={getDisplayImage(img)} alt="thumb" />
              </button>
            ))}
          </div>
          <div className={styles.mainImageContainer}>
             <img 
               src={getDisplayImage(product.images?.[selectedImageIndex] || product.image || '')} 
               alt={product.name} 
               className={styles.mainImage} 
               onError={(e) => { (e.target as HTMLImageElement).src = '/imagegym.webp'; }}
             />
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className={styles.infoSection}>
          <p className={styles.categoryTag}>{product.category} | {product.subCategory}</p>
          <h1 className={styles.title}>{product.name}</h1>
          
          {/* Precio formateado para Argentina: $ 103.999 */}
          <p className={styles.price}>{formatARS(product.price)}</p>

          <div className={styles.sizeSelector}>
            <div className={styles.sizeHeader}>
              <span className={styles.sizeLabel}>SELECCIONAR TALLE</span>
              <button className={styles.guideBtn} onClick={() => setShowSizeGuide(true)}>Guía de talles</button>
            </div>
            <div className={styles.sizeGrid}>
              {displaySizes.map((s: string) => (
                <button 
                  key={s} 
                  className={clsx(styles.sizeBtn, selectedSize === s && styles.activeSize)} 
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.addBtn} 
            onClick={handleAddToBag}
          >
            AÑADIR A LA BOLSA
          </button>
        </div>
      </div>

      {/* MODAL DE GUÍA */}
      {showSizeGuide && (
        <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowSizeGuide(false)}><X size={24} /></button>
            <h2 className={styles.modalTitle}>GUÍA DE TALLES {genero}</h2>
            
            <div className={styles.unitToggle}>
              <button className={clsx(styles.toggleBtn, unit === 'IN' && styles.toggleActive)} onClick={() => setUnit('IN')}>PULGADAS (IN)</button>
              <button className={clsx(styles.toggleBtn, unit === 'CM' && styles.toggleActive)} onClick={() => setUnit('CM')}>CENTÍMETROS (CM)</button>
            </div>

            {esBra ? (
              <div className={styles.matrixWrapper}>
                <p className={styles.tableLabel}>BUSTO ({unit})</p>
                <table className={styles.braTable}>
                  <thead>
                    <tr>
                      <th className={styles.emptyCell}>BAJO BUSTO</th>
                      {braData[unit].headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {braData[unit].rows.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.underbustCol}>{row.label}</td>
                        {row.sizes.map((s, j) => <td key={j}>{s}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : esInferior ? (
              <table className={styles.sizeTable}>
                <thead>
                  <tr><th>TALLE</th><th>CINTURA</th><th>LARGO PIERNA</th></tr>
                </thead>
                <tbody>
                  {inferiorData[genero][unit].map((item: any) => (
                    <tr key={item.s}>
                      <td className={styles.boldCell}>{item.s}</td>
                      <td>{item.w}</td>
                      <td>{item.l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>TALLE</th>
                    <th>{genero === 'MUJER' ? 'BUSTO' : 'PECHO'}</th>
                    <th>CINTURA</th>
                  </tr>
                </thead>
                <tbody>
                  {superiorData[genero][unit].map((item: any) => (
                    <tr key={item.s}>
                      <td className={styles.boldCell}>{item.s}</td>
                      <td>{genero === 'MUJER' ? item.b : item.c}</td>
                      <td>{item.w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;