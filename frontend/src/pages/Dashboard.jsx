// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { cartService } from '../services/cartService.js';
import { sellerService } from '../services/sellerService.js';
import { authService } from '../services/authService.js'; 
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, role, logout } = useContext(AuthContext); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 👇 NEW: Added deleteError state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(''); // 👈 UI error message

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (role === 'customer') {
          const data = await cartService.getOrders();
          setOrders(data.orders);
        } else if (role === 'seller') {
          const data = await sellerService.getSellerOrders();
          setOrders(data.orders);
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [role]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (newStatus === 'Delivered') {
      const isConfirmed = window.confirm(
        "WARNING: Are you sure you want to mark this order as Delivered?\n\nOnce marked as Delivered, this action CANNOT be reverted, and the stock will be permanently deducted.\n\nDo you agree to proceed?"
      );
      if (!isConfirmed) return;
    }

    try {
      await sellerService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  // 👇 LOGIC: Now captures errors for the UI
  const executeDelete = async () => {
    setDeleteError(''); // Clear previous errors
    try {
      await authService.deleteAccount(role, deletePassword); 
      toast.success("Account deleted successfully");
      logout(); 
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete account. Please try again.";
      setDeleteError(msg); // 👈 Set the UI error
      toast.error(msg);
      setShowFinalWarning(false); // Send them back to the password step to retry
    }
  };

  const resetDeleteState = () => {
    setIsDeleting(false);
    setShowFinalWarning(false);
    setDeletePassword('');
    setDeleteError(''); // 👈 Clear errors on cancel
  };

  const styles = {
    container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" },
    headerSection: { borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' },
    roleBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
    orderCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px', transition: 'box-shadow 0.2s' },
    statusBadge: (status) => ({
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: status === 'Delivered' ? '#dcfce7' : status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
      color: status === 'Delivered' ? '#15803d' : status === 'Cancelled' ? '#b91c1c' : '#854d0e'
    }),
    itemRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', borderBottom: '1px dashed #f1f5f9' },
    select: (isDelivered) => ({
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1.5px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
      cursor: isDelivered ? 'not-allowed' : 'pointer',
      backgroundColor: isDelivered ? '#f8fafc' : '#fff'
    }),
    dangerZone: {
      marginTop: '60px',
      padding: '20px',
      border: '1px solid #fee2e2',
      borderRadius: '12px',
      backgroundColor: '#fffafb'
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px'
    },
    deleteInput: {
      padding: '10px',
      borderRadius: '8px',
      border: deleteError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', // 👈 Border turns red on error
      marginTop: '10px',
      width: '100%',
      maxWidth: '300px',
      display: 'block',
      outline: 'none'
    },
    cancelBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '15px'
    },
    warningBox: {
        backgroundColor: '#fef2f2',
        borderLeft: '4px solid #ef4444',
        padding: '12px',
        marginTop: '15px',
        color: '#991b1b',
        fontSize: '14px',
        fontWeight: '500'
    },
    errorText: {
        color: '#ef4444',
        fontSize: '13px',
        fontWeight: '600',
        marginTop: '8px',
        display: 'block'
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>Loading your dashboard...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '100px' }}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* ... (Existing Header and Orders Code) ... */}
      <div style={styles.headerSection}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#1e293b' }}>
          Welcome back, {user?.firstname || user?.name || 'User'}!
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={styles.roleBadge}>{role}</span>
          {role === 'seller' && (
            <span style={{ color: '#6366f1', fontWeight: '600', fontSize: '14px' }}>
              🏪 {user?.restaurantName || user?.shopName || "My Restaurant"}
            </span>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: '20px', color: '#334155', marginBottom: '20px' }}>
        {role === 'customer' ? 'Your Order History' : 'Recent Incoming Orders'}
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
          No orders found yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>ID: {order._id.slice(-6).toUpperCase()}</span>
                </div>
                <span style={styles.statusBadge(order.status)}>{order.status}</span>
              </div>
              <div style={{ margin: '15px 0' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Delivery Address</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#475569' }}>{order.deliveryAddress}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Total Amount</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              {role === 'seller' && (
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Update Order Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    disabled={order.status === 'Delivered'}
                    style={styles.select(order.status === 'Delivered')}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 👇 UPDATED DANGER ZONE WITH ERROR UI 👇 */}
      <div style={styles.dangerZone}>
        <h3 style={{ color: '#991b1b', margin: '0 0 10px 0' }}>Danger Zone</h3>
        
        {!isDeleting && (
          <>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Deleting your account is permanent and cannot be undone. 
            </p>
            <button onClick={() => setIsDeleting(true)} style={styles.deleteBtn}>
              Delete My Account
            </button>
          </>
        )}

        {isDeleting && !showFinalWarning && (
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b', display: 'block' }}>
              Confirm Password to Proceed:
            </label>
            <input 
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => {
                  setDeletePassword(e.target.value);
                  if(deleteError) setDeleteError(''); // Clear error while typing
              }}
              style={styles.deleteInput}
            />
            
            {/* 👇 ERROR UI 👇 */}
            {deleteError && <span style={styles.errorText}>⚠️ {deleteError}</span>}

            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => deletePassword ? setShowFinalWarning(true) : setDeleteError("Password is required.")}
                  style={styles.deleteBtn}
                >
                  Continue
                </button>
                <button onClick={resetDeleteState} style={styles.cancelBtn}>
                  Cancel
                </button>
            </div>
          </div>
        )}

        {showFinalWarning && (
          <div style={{ marginTop: '10px' }}>
            <div style={styles.warningBox}>
                <strong>FINAL WARNING:</strong> This action is permanent and your data will be erased forever. Are you absolutely sure?
            </div>
            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={executeDelete}
                  style={{ ...styles.deleteBtn, backgroundColor: '#b91c1c' }}
                >
                  Yes, Delete Forever
                </button>
                <button onClick={resetDeleteState} style={styles.cancelBtn}>
                  Wait, Keep My Account
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;