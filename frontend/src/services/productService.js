// src/services/productService.js
import api from './api.js';

export const productService = {
  // Fetch all available products (supports Suchi's pagination)
  getAllProducts: async (page = 1, limit = 20) => {
    const response = await api.get(`/product/all?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Fetch a single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }
};