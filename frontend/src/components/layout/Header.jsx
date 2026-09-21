// src/components/layout/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { cartService } from '../../services/cartService.js'; // Import cart service

const Header = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // --- NEW STATE: Track cart item count ---
  const [cartCount, setCartCount] = useState(0);

  // --- NEW LOGIC: Function to fetch cart count ---
  const fetchCartCount = async () => {
    if (isAuthenticated && role === 'customer') {
      try {
        const data = await cartService.getCart();
        setCartCount(data.cart.items.length);
      } catch (error) {
        console.error("Error fetching cart count", error);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Listen for the custom "cartUpdated" event from Home.jsx
    window.addEventListener('cartUpdated', fetchCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, [isAuthenticated, role]);

  const handleLogout = async () => {
    try {
      if (role) {
        await authService.logout(role);
      }
    } catch (error) {
      console.error("Logout failed on server, clearing local state anyway", error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const injectStyles = `
    .nav-item {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      font-size: 15px;
      padding: 6px 12px;
      transition: color 0.2s ease;
      position: relative;
    }
    .nav-item:hover {
      color: #000;
    }
    .auth-btn {
      background: #000;
      color: #fff !important;
      border-radius: 6px;
      padding: 8px 18px !important;
    }
    /* Style for the Red Cart Badge */
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -2px;
      background: #ff4757;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 50%;
      font-weight: 700;
    }
    .logout-link {
      background: transparent;
      border: 1px solid #ddd;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
    }
    .logout-link:hover {
      background: #f5f5f5;
      color: #ff4d4d;
      border-color: #ff4d4d;
    }
  `;

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 5%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eaeaea',
      fontFamily: "'Inter', -apple-system, sans-serif"
    },
    logo: {
      fontSize: '1.4rem',
      fontWeight: '700',
      margin: 0
    },
    nav: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }
  };

  return (
    <header style={styles.header}>
      <style>{injectStyles}</style>
      <div>
        <h2 style={styles.logo}>
          <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>
            Swiato
          </Link>
        </h2>
      </div>
      
      <nav style={styles.nav}>
        <Link to="/" className="nav-item">Home</Link>
        
        {!isAuthenticated && (
          <Link to="/login" className="nav-item auth-btn">Login / Register</Link>
        )}

        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            
            {role === 'customer' && (
              <Link to="/cart" className="nav-item">
                Cart 🛒
                {/* Display badge if items > 0 */}
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            )}

            {role === 'seller' && (
              <Link to="/products/add" className="nav-item">Add Product ➕</Link>
            )}

            <button onClick={handleLogout} className="logout-link" style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;