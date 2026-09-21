// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'customer' or 'seller'
  const [loading, setLoading] = useState(true);
  
  // --- ADDED: Global Cart Count State ---
  // This allows Header.jsx to reset the badge immediately on Logout/Delete
  const [cartCount, setCartCount] = useState(0);

  // Check if a user is already logged in when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedUser && storedRole) {
      try {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
    setLoading(false);
  }, []);

  // Call this function after a successful login API call
  const login = (userData, token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
    
    setUser(userData);
    setRole(userRole);
  };

  // --- UPDATED: Logout now clears cartCount too ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    setUser(null);
    setRole(null);
    setCartCount(0); // Reset the badge to 0 immediately
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      login, 
      logout, 
      isAuthenticated: !!user,
      cartCount,      // Exported for Header
      setCartCount    // Exported for Header/Home
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};