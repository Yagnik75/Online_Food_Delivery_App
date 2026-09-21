// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService.js';

const Register = () => {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    name: '',
    shopName: '',
    email: '',
    phoneno: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSeller) {
        const sellerData = {
          name: formData.name,
          shopName: formData.shopName,
          email: formData.email,
          phoneno: formData.phoneno,
          password: formData.password
        };
        await authService.sellerRegister(sellerData);
      } else {
        const customerData = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phoneno: formData.phoneno,
          password: formData.password
        };
        await authService.customerRegister(customerData);
      }
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Styles ---
  const injectStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    input:focus {
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      transform: translateY(-1px);
    }
    button:active {
      transform: scale(0.98);
    }
    .form-input {
      transition: all 0.2s ease;
    }
  `;

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: '20px'
    },
    card: {
      background: '#fff',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '480px',
    },
    toggleWrapper: {
      display: 'flex',
      background: '#f1f5f9',
      padding: '5px',
      borderRadius: '12px',
      marginBottom: '30px',
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
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      marginTop: '6px'
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(to right, #6366f1, #4f46e5)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>{injectStyles}</style>
      <div style={styles.card} className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '28px' }}>Join Us</h2>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Create your account in seconds</p>
        </div>

        <div style={styles.toggleWrapper}>
          <button type="button" onClick={() => setIsSeller(false)} style={styles.toggleBtn(!isSeller)}>
            Customer 🍔
          </button>
          <button type="button" onClick={() => setIsSeller(true)} style={styles.toggleBtn(isSeller)}>
            Seller 🏪
          </button>
        </div>

        {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#10b981', background: '#dcfce7', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isSeller ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>First Name</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required className="form-input" style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required className="form-input" style={styles.input} />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" style={styles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Shop Name</label>
                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required className="form-input" style={styles.input} />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" style={styles.input} />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Phone Number</label>
            <input type="text" name="phoneno" value={formData.phoneno} onChange={handleChange} pattern="\d{10}" required className="form-input" style={styles.input} />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6" required className="form-input" style={styles.input} />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;