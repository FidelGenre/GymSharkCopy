export interface Product {
  id: string | number; // Acepta ambos por seguridad
  name: string;
  price: number;
  currency?: string;
  image?: string;      // Propiedad opcional por si viene como string único
  images?: string[];   // Propiedad opcional por si viene como array
  category: string;
  tag?: string;
  description?: string;
  sizes?: string[];
}