// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 👈 NEW: Imported Link
import { AuthContext } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';

const Login = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      let role;
      let userData;

      if (isSeller) {
        response = await authService.sellerLogin(formData);
        role = 'seller';
        userData = response.seller;
      } else {
        response = await authService.customerLogin(formData);
        role = 'customer';
        userData = response.customer;
      }

      login(userData, response.token, role);
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // --- Animation & UI Styles ---
  const injectStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-fade-in {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }
    .form-input {
      transition: all 0.2s ease;
    }
    .form-input:focus {
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      transform: translateY(-1px);
    }
    .btn-active:active {
      transform: scale(0.98);
    }
  `;

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      padding: '20px'
    },
    card: {
      background: '#fff',
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      width: '100%',
      maxWidth: '420px',
    },
    toggleWrapper: {
      display: 'flex',
      background: '#f1f5f9',
      padding: '6px',
      borderRadius: '14px',
      marginBottom: '32px',
    },
    toggleBtn: (active) => ({
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: active ? '#fff' : 'transparent',
      color: active ? '#6366f1' : '#64748b',
      boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
    }),
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1.5px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      marginTop: '6px'
    },
    submitBtn: {
      width: '100%',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
      opacity: loading ? 0.8 : 1
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>{injectStyles}</style>
      <div style={styles.card} className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
            Login as {isSeller ? 'Seller 🏪' : 'Customer 🍔'}
          </p>
        </div>
        
        <div style={styles.toggleWrapper}>
          <button 
            onClick={() => setIsSeller(false)}
            style={styles.toggleBtn(!isSeller)}
          >
            Customer
          </button>
          <button 
            onClick={() => setIsSeller(true)}
            style={styles.toggleBtn(isSeller)}
          >
            Seller
          </button>
        </div>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            background: '#fee2e2', 
            padding: '12px', 
            borderRadius: '10px', 
            marginBottom: '20px', 
            fontSize: '14px', 
            textAlign: 'center',
            border: '1px solid #fecaca' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginLeft: '4px' }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="name@example.com"
              style={styles.input}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginLeft: '4px' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-active"
            style={styles.submitBtn}
          >
            {loading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>

        {/* 👈 NEW: Added the link to the Register page down here */}
        <p style={{ textAlign: 'center', marginTop: '28px', color: '#64748b', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '700' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;