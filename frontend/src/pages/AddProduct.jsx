// src/pages/AddProduct.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { sellerService } from '../services/sellerService.js';

const AddProduct = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Lunch', 
    stock: '',
    image: '' 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- UI STYLES OBJECT (Maintains logic separation) ---
  const styles = {
    wrapper: {
      maxWidth: '650px',
      margin: '50px auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#1a1a1a',
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#4b5563'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    button: {
      padding: '14px',
      backgroundColor: '#4f46e5', // Modern Indigo
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      marginTop: '10px',
      transition: 'background-color 0.2s',
      opacity: loading ? 0.7 : 1
    },
    alert: {
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      textAlign: 'center'
    }
  };

  // Kick out customers logic (Unchanged)
  if (role !== 'seller') {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2 style={{ color: '#ef4444' }}>🚫 Access Denied</h2>
            <p style={{ color: '#6b7280' }}>Only seller accounts can access this page.</p>
        </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      await sellerService.addProduct(productPayload);
      setSuccess('Product added successfully to the menu! ✨');
      
      setFormData({
        name: '', description: '', price: '', category: 'Lunch', stock: '', image: ''
      });
      
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.header}>Add New Menu Item</h2>

      {/* Modern Alert Boxes */}
      {error && (
        <div style={{ ...styles.alert, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ ...styles.alert, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Product Name */}
        <div>
          <label style={styles.label}>Product Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="e.g. Spicy Paneer Wrap"
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
        </div>

        {/* Description */}
        <div>
          <label style={styles.label}>Description</label>
          <textarea 
            name="description" 
            placeholder="Tell customers what makes this dish special..."
            value={formData.description} 
            onChange={handleChange} 
            rows="3" 
            style={{ ...styles.input, resize: 'none' }} 
          />
        </div>

        {/* Price & Stock Grid */}
        <div style={styles.row}>
          <div>
            <label style={styles.label}>Price (₹)</label>
            <input 
              type="number" 
              name="price" 
              placeholder="0.00"
              value={formData.price} 
              onChange={handleChange} 
              min="0" 
              step="0.01" 
              required 
              style={styles.input} 
            />
          </div>
          <div>
            <label style={styles.label}>Stock Quantity</label>
            <input 
              type="number" 
              name="stock" 
              placeholder="Qty"
              value={formData.stock} 
              onChange={handleChange} 
              min="0" 
              required 
              style={styles.input} 
            />
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label style={styles.label}>Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
            style={{ ...styles.input, backgroundColor: '#fff', cursor: 'pointer' }}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* Image Link */}
        <div>
          <label style={styles.label}>Image URL</label>
          <input 
            type="text" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            placeholder="https://images.unsplash.com/photo..." 
            style={styles.input} 
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading} 
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#4338ca')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
        >
          {loading ? 'Adding to Menu...' : 'Confirm & Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;