import axios from 'axios';

// 1. Definimos la URL base
// Si existe la variable de entorno de Vite (Producción), la usa.
// Si no, usa localhost (Desarrollo).
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  // 2. Concatenamos '/api' para que la URL final sea correcta
  // Ejemplo Producción: https://gymsharkcopyserver.onrender.com/api
  baseURL: `${BACKEND_URL}/api`, 
});

export const getProducts = async (category?: string | null) => {
  const response = await api.get('/products', {
    params: { category }
  });
  return response.data;
};

export default api;