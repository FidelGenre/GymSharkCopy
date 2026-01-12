import axios from 'axios';

// 1. Definimos la URL base apuntando DIRECTAMENTE a Render
// Esto asegura que toda la app mire al servidor en la nube.
const BACKEND_URL = 'https://gymsharkcopyserver.onrender.com';

const api = axios.create({
  // 2. Concatenamos '/api' para que la URL final sea correcta
  // Resultado: https://gymsharkcopyserver.onrender.com/api
  baseURL: `${BACKEND_URL}/api`, 
});

export const getProducts = async (category?: string | null) => {
  const response = await api.get('/products', {
    params: { category }
  });
  return response.data;
};

export default api;