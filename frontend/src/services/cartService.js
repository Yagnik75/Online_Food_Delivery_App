// src/services/cartService.js
import api from './api.js';

export const cartService = {
  // Add an item to the cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/shop/cart/add', { productId, quantity });
    return response.data;
  },

  // Fetch the current user's cart (with live pricing populated)
  getCart: async () => {
    const response = await api.get('/shop/cart');
    return response.data;
  },

  // Update item quantity in cart   //increment decrement functionality in the cart.
  updateQuantity: async (productId, quantity) => {
    const response = await api.put(`/shop/cart/update/${productId}`, { quantity });
    return response.data;
    },

  // Remove an item from the cart
  removeFromCart: async (productId) => {
    const response = await api.delete(`/shop/cart/remove/${productId}`);
    return response.data;
  },

  // Place the order (splits orders by seller backend-side)
  placeOrder: async (deliveryAddress) => {
    const response = await api.post('/shop/buy', { deliveryAddress });
    return response.data;
  },

  // Fetch past orders for the customer
  getOrders: async () => {
    const response = await api.get('/shop/orders');
    return response.data;
  }
};