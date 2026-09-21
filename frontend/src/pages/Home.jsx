// src/pages/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { cartService } from '../services/cartService.js';
import { sellerService } from '../services/sellerService.js'; 
import toast, { Toaster } from 'react-hot-toast'; // --- IMPORT TOASTER ---

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  
  const { isAuthenticated, role, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const styles = {
    container: { padding: '40px 5%', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    searchContainer: { maxWidth: '600px', margin: '0 auto 40px auto', position: 'relative', display: 'flex', alignItems: 'center' },
    searchInput: { width: '100%', padding: '15px 20px', paddingLeft: '50px', borderRadius: '30px', border: '1px solid #dfe6e9', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', outline: 'none', transition: 'border-color 0.3s' },
    searchIcon: { position: 'absolute', left: '20px', fontSize: '18px', color: '#b2bec3' },
    title: { textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', color: '#2d3436', marginBottom: '30px', letterSpacing: '-1px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', border: '1px solid #eee' },
    imageContainer: { height: '200px', width: '100%', backgroundColor: '#dfe6e9', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
    badge: { position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#636e72', textTransform: 'uppercase' },
    content: { padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' },
    price: { fontSize: '1.4rem', fontWeight: '700', color: '#2d3436', margin: '10px 0' },
    btnPrimary: { backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products);

        if (isAuthenticated && role === 'customer') {
          const cartData = await cartService.getCart();
          const itemIds = cartData.cart.items.map(item => item.productId._id || item.productId);
          setCartItems(itemIds);
        }
      } catch (err) {
        setError('Failed to load the menu. Please try again later.');
        toast.error('Could not load products'); // --- TOAST ERROR ---
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, role]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) { 
      toast.error("Please login first!"); // --- TOAST ERROR ---
      navigate('/login'); 
      return; 
    }
    if (role !== 'customer') { 
      toast.error("Sellers cannot place orders."); // --- TOAST ERROR ---
      return; 
    }
    try {
      await cartService.addToCart(productId, 1);
      setCartItems((prev) => [...prev, productId]);
      // --- THIS TRIGGERS THE HEADER REFRESH ---
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Added to cart! 🛒"); // --- TOAST SUCCESS ---
    } catch (err) { 
      toast.error(err.response?.data?.message || "Error adding to cart"); // --- TOAST ERROR ---
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await sellerService.deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        
        toast.success("Product deleted successfully"); // --- TOAST SUCCESS ---
      } catch (err) { 
        toast.error("Failed to delete product"); // --- TOAST ERROR ---
      }
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '100px', color: '#636e72' }}>Preparing your menu... 🍔</h2>;
  if (error) return <h2 style={{ textAlign: 'center', color: '#ff4757', marginTop: '100px' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <Toaster position="top-center" reverseOrder={false} /> {/* --- TOASTER CONTAINER --- */}
      <h1 style={styles.title}>Explore Our Menu</h1>

      <div style={styles.searchContainer}>
        <span style={styles.searchIcon}>🔍</span>
        <input 
          type="text" 
          placeholder="Search for your favorite food (e.g. Burger, Pizza...)" 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#b2bec3' }}>
          <p>No products available right now.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products
            .filter(product => 
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => {
              const loggedInSellerId = user?._id || user?.id; 
              if (role === 'seller' && product.sellerId !== loggedInSellerId) return null;
              if (role !== 'seller' && (!product.isAvailable || product.stock <= 0)) return null;

              const isAlreadyInCart = cartItems.includes(product._id);

              return (
                <div 
                  key={product._id} 
                  style={styles.card}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    ...styles.imageContainer, 
                    backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200?text=No+Image'})` 
                  }}>
                    <span style={styles.badge}>{product.category}</span>
                  </div>

                  <div style={styles.content}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#2d3436' }}>{product.name}</h3>
                    <p style={{ color: '#636e72', fontSize: '0.9rem', lineHeight: '1.4', margin: '0' }}>
                      {product.description?.substring(0, 80)}...
                    </p>
                    
                    <div style={styles.price}>₹{product.price.toFixed(2)}</div>

                    {role === 'seller' && (
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: product.stock > 0 ? '#00b894' : '#d63031', marginBottom: '15px' }}>
                        ● {product.stock} units in stock
                      </div>
                    )}

                    <div style={{ marginTop: 'auto' }}>
                      {role === 'seller' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => navigate(`/products/edit/${product._id}`)} style={{ ...styles.btnPrimary, backgroundColor: '#0984e3', flex: 1 }}>Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} style={{ ...styles.btnPrimary, backgroundColor: '#ee5253', flex: 1 }}>Delete</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => isAlreadyInCart ? navigate('/cart') : handleAddToCart(product._id)}
                          disabled={product.stock <= 0}
                          style={{ 
                            ...styles.btnPrimary, 
                            backgroundColor: product.stock > 0 ? (isAlreadyInCart ? '#2ecc71' : '#ff4757') : '#dfe6e9',
                            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                            width: '100%' 
                          }}
                        >
                          {product.stock > 0 
                            ? (isAlreadyInCart ? 'View Cart 🛒' : 'Add to Cart 🛒') 
                            : 'Out of Stock'
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Home;