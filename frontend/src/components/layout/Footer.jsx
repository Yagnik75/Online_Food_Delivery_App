// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #eee',
      padding: '15px 20px', // Reduced vertical padding
      marginTop: 'auto',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: '13px', // Slightly smaller text
      color: '#888',
      margin: 0,
      fontWeight: '400'
    }
  };

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        &copy; {currentYear} <strong>Swiato</strong>. Built with MERN.
      </p>
    </footer>
  );
};

export default Footer;