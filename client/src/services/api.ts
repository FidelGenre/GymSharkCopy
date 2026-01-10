import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Puerto por defecto de Spring Boot
});

export const getProducts = async (category?: string | null) => {
  const response = await api.get('/products', {
    params: { category }
  });
  return response.data;
};

export default api;