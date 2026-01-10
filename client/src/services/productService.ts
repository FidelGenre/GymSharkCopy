import axios from 'axios';
import type { Product } from '../types/products';

const API_URL = 'http://localhost:8080/api/products';

export const productService = {
  // Obtiene todos los productos (con filtro opcional por categoría)
  getAll: async (category?: string | null): Promise<Product[]> => {
    const response = await axios.get<Product[]>(API_URL, {
      params: { category }
    });
    return response.data;
  },

  // Obtiene un producto específico por su ID
  getById: async (id: string): Promise<Product> => {
    const response = await axios.get<Product>(`${API_URL}/${id}`);
    return response.data;
  }
};