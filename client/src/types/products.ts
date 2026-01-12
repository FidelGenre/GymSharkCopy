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

// Define esto en tu carpeta de types o directamente en Checkout.tsx
export interface ShippingAddress {
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  departamento?: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string; // En tus capturas es "Santa Fe"
  telefono: string;
}