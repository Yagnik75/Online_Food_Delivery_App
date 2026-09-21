// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import { Toaster } from 'react-hot-toast'; // 👈 NEW: Import Toaster for global notifications

function App() {
  return (
    <BrowserRouter>
      {/* 👈 NEW: Toaster component added here to be accessible by all pages */}
      {/* 'gutter' is the space between multiple toast bubbles */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* We use a flex container to ensure the footer always drops to the bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        {/* Main content area */}
        <main style={{ flex: 1, padding: '20px' }}>
          <AppRoutes />
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;