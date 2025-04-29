import React from 'react';

const PageTitle = ({ title }) => (
  <div style={{
    display: 'inline-block',
    margin: '0 auto 20px auto',
    padding: '3px 15px',
    borderRadius: '5px',
    border: '2px solid #17a2b8',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    color: '#333',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center'
  }}>
    {title}
  </div>
);

export default PageTitle;
