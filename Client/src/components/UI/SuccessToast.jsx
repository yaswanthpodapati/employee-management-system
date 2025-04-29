import React, { useEffect } from 'react';

function SuccessToast({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#4BB543', color: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0,0,0,0.3)', zIndex: 1000 }}>
      {message}
    </div>
  );
}

export default SuccessToast;