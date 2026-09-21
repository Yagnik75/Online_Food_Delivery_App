// Logic of Product Quantity update - UI REFRESH
// src/pages/EditProduct.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { productService } from '../services/productService.js';
import { sellerService } from '../services/sellerService.js';

const EditProduct = () => {
  const { id } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Styles object for cleaner JSX
  const styles = {
    container: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#2d3436',
      fontSize: '28px',
      fontWeight: '600'
    },
    formGroup: {
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#636e72',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #dfe6e9',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      outline: 'none'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    submitBtn: {
      marginTop: '10px',
      padding: '14px',
      backgroundColor: '#00b894',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      opacity: updating ? 0.7 : 1
    },
    errorBanner: {
      backgroundColor: '#ff7675',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '14px'
    }
  };

  // Protect route logic (Unchanged)
  if (role !== 'seller') {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ color: '#d63031' }}>🚫 Access Denied</h2>
        <p>Sellers only area. Please log in with a seller account.</p>
      </div>
    );
  }

  // Fetch logic (Unchanged)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setFormData({
          name: data.product.name,
          description: data.product.description || '',
          price: data.product.price,
          category: data.product.category,
          stock: data.product.stock,
          image: data.product.image || ''
        });
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await sellerService.updateProduct(id, dataToSubmit);
      alert('Product updated successfully! ✅');
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: '#636e72' }}>
      <h3>Loading product data...</h3>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Edit Product Details</h2>
      
      {error && <div style={styles.errorBanner}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Product Title Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Title</label>
          <input 
            type="text" 
            name="name" 
            placeholder="e.g. Classic Pancakes"
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={styles.input} 
          />
        </div>

        {/* Description Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea 
            name="description" 
            placeholder="Describe your delicious product..."
            value={formData.description} 
            onChange={handleChange} 
            rows="4" 
            style={{ ...styles.input, resize: 'vertical' }} 
          />
        </div>

        {/* Price and Stock Grid */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Price (₹)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              min="0" 
              step="0.01" 
              required 
              style={styles.input} 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Stock Quantity</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              min="0" 
              required 
              style={styles.input} 
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
            style={{ ...styles.input, backgroundColor: '#fff' }}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* Image URL Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Image URL</label>
          <input 
            type="text" 
            name="image" 
            placeholder="https://example.com/image.jpg"
            value={formData.image} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={updating} 
          style={styles.submitBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = '#00a884'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#00b894'}
        >
          {updating ? 'Processing...' : 'Update Product Information'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;