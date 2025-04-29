import React from 'react';

function EmployeeDeleteModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '350px', textAlign: 'center' }}>
        <h3>Are you sure?</h3>
        <p>You want to delete selected employees?</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={onConfirm} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', marginRight: '10px', border: 'none', borderRadius: '5px' }}>Delete</button>
          <button onClick={onClose} style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDeleteModal;