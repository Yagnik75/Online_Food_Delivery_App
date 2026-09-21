// src/services/authService.js
import api from './api.js';
//import axiosInstance from './axiosInstance';

export const authService = {
  // --- Customer Auth ---
  customerLogin: async (credentials) => {
    const response = await api.post('/customer/login', credentials);
    return response.data;
  },
  customerRegister: async (data) => {
    const response = await api.post('/customer/register', data);
    return response.data;
  },

  // --- Seller Auth ---
  sellerLogin: async (credentials) => {
    const response = await api.post('/seller/login', credentials);
    return response.data;
  },
  sellerRegister: async (data) => {
    const response = await api.post('/seller/register', data);
    return response.data;
  },

  // --- Shared Logout ---
  // The backend uses token blacklisting, so we must call the logout endpoint
  logout: async (role) => {
    // role must be 'customer' or 'seller' to hit the correct backend route
    const response = await api.post(`/${role}/logout`);
    return response.data;
  },

  // --- Shared Delete Account ---
  // Hits the specific role endpoint to permanently remove the user
  // src/services/authService.js
// src/services/authService.js
// src/services/authService.js

//   deleteAccount: async (role, password) => {
//   const response = await api.delete(
//     `/${role}/delete-account`,
//     { data: { password } }
//   );
//   return response.data;
// }
deleteAccount: async (role, password) => {
  const response = await api.delete(
    `/${role}/delete-account`,
    { data: { password } }
  );
  return response.data;
}
};