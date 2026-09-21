// src/pages/Cart.jsx
import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService.js';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.cart);
    } catch (err) {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    try {
      await cartService.updateQuantity(productId, newQuantity);
      fetchCart();
    } catch (err) {
      toast.error("Failed to update quantity.");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress) {
      toast.error("Please provide a delivery address.");
      return;
    }
    setCheckoutLoading(true);
    try {
      await cartService.placeOrder(deliveryAddress);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Order placed successfully! 🚀");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed. Please check stock levels.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // UI Styles Object
  const styles = {
    container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" },
    title: { fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '32px', borderBottom: '2px solid #edf2f7', paddingBottom: '12px' },
    itemCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #edf2f7' },
    itemName: { fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: '0 0 4px 0' },
    itemPrice: { fontSize: '14px', color: '#718096', margin: 0 },
    qtyBtn: { padding: '4px 10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', color: '#4a5568', transition: 'all 0.2s' },
    removeBtn: { padding: '8px 14px', backgroundColor: 'transparent', color: '#e53e3e', border: '1px solid #feb2b2', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    totalSection: { textAlign: 'right', marginTop: '24px', padding: '20px 0' },
    totalLabel: { fontSize: '14px', color: '#718096', marginRight: '10px' },
    totalAmount: { fontSize: '22px', fontWeight: '700', color: '#1a202c' },
    formContainer: { marginTop: '40px', padding: '30px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', marginTop: '8px' },
    checkoutBtn: { width: '100%', marginTop: '20px', padding: '14px', backgroundColor: '#2f855a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#718096' }}>Loading Secure Cart...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#e53e3e', marginTop: '100px' }}>{error}</div>;

  const cartTotal = cart?.items?.reduce((total, item) => {
    return total + (item.productId?.price || 0) * item.quantity;
  }, 0) || 0;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#718096', fontSize: '16px' }}>Your cart is currently empty.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1a202c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Browse Menu</button>
        </div>
      ) : (
        <>
          <div>
            {cart.items.map((item) => (
              <div key={item._id} style={styles.itemCard}>
                <div>
                  <h3 style={styles.itemName}>{item.productId?.name}</h3>
                  <p style={styles.itemPrice}>
                    ₹{item.productId?.price.toFixed(2)} <span style={{ color: '#cbd5e0', margin: '0 8px' }}>|</span> 
                    Subtotal: <strong>₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}</strong>
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f7fafc', padding: '4px', borderRadius: '6px' }}>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      style={{ ...styles.qtyBtn, opacity: item.quantity <= 1 ? 0.5 : 1 }}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: '600', width: '20px', textAlign: 'center', fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity, 1)}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <button onClick={() => handleRemove(item.productId?._id)} style={styles.removeBtn}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.totalSection}>
            <span style={styles.totalLabel}>ORDER TOTAL</span>
            <span style={styles.totalAmount}>₹{cartTotal.toFixed(2)}</span>
          </div>

          <div style={styles.formContainer}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1a202c' }}>Delivery Information</h3>
            <form onSubmit={handleCheckout}>
              <label htmlFor="address" style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>
                Complete Shipping Address
              </label>
              <textarea 
                id="address"
                rows="3"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                style={styles.textarea}
                placeholder="Street address, Apartment, City, State, ZIP"
              />
              <button 
                type="submit" 
                disabled={checkoutLoading}
                style={{ 
                  ...styles.checkoutBtn, 
                  backgroundColor: checkoutLoading ? '#a0aec0' : '#2f855a' 
                }}
              >
                {checkoutLoading ? 'Verifying Transaction...' : 'Confirm and Place Order'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;