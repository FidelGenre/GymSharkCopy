import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; // ReactNode sí es solo un tipo
// El resto del código sigue igual...
import type { Product } from '../types/products';

/**
 * Extendemos la interfaz Product para el carrito.
 * Usamos 'string | number' para el ID por compatibilidad con mocks y base de datos.
 */
interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string | number, size: string) => void;
  /**
   * updateQuantity: Permite sumar (+1) o restar (-1) a un producto específico.
   */
  updateQuantity: (id: string | number, size: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calcula el total de unidades físicas en la bolsa
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calcula el precio total acumulado (Subtotal)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe con el mismo talle.
   */
  const addToCart = (product: Product, size: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  /**
   * Modifica la cantidad de un item de uno en uno.
   * Si la cantidad resultante es menor a 1, el item se mantiene en 1 
   * (obligando a usar 'removeFromCart' para eliminarlo totalmente).
   */
  const updateQuantity = (id: string | number, size: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQuantity = item.quantity + delta;
        // Mantenemos al menos 1 unidad. 
        // Si prefieres que el botón '-' elimine el producto al llegar a 0, quita el Math.max
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));
  };

  /**
   * Elimina un producto por completo del carrito (sin importar su cantidad).
   */
  const removeFromCart = (id: string | number, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, // Exportamos la nueva función
      clearCart,
      totalItems, 
      cartTotal,
      isDrawerOpen, 
      setIsDrawerOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};