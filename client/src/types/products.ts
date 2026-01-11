// src/types/products.ts
export interface Product {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
  images: string[];     // Coincide con List<String> en Java
  image?: string;      // Por compatibilidad con el buscador
  category: string;
  subCategory: string; // ¡Añadir esta línea!
  tag?: string;
  description?: string;
  sizes: string[];
}