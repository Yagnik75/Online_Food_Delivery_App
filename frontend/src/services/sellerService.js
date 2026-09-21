// src/services/sellerService.js
import api from './api.js';

export const sellerService = {
  // Fetch orders for the logged-in seller
  getSellerOrders: async () => {
    const response = await api.get('/seller/orders');
    return response.data;
  },

  // Update the status of a specific order
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/seller/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Add a new product to the menu (Suchi's controller)
  addProduct: async (productData) => {
    const response = await api.post('/product/add', productData);
    return response.data;
  },

  // NEW: Update an existing product //Logic of Product Quantity update
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/product/update/${productId}`, productData);
    return response.data;
  },

  // NEW: Delete a product  //Logic for Product Delete
  deleteProduct: async (productId) => {
    const response = await api.delete(`/product/delete/${productId}`);
    return response.data;
  }
};