import React from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  // Precision sizing map tailored specifically for the user's uploaded 2.7:1 logo (450x167)
  const sizeMap = {
    default: {
      height: '68px',
      maxWidth: '320px'
    },
    large: {
      height: '78px',
      maxWidth: '360px'
    },
    footer: {
      height: '74px',
      maxWidth: '340px'
    },
    admin: {
      height: '46px',
      maxWidth: '240px'
    },
    mobile: {
      height: '56px',
      maxWidth: '260px'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div 
      className={`brand-logo-container ${className}`} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        textDecoration: 'none',
        flexShrink: 0,
        userSelect: 'none'
      }}
      onClick={onClick}
    >
      <img 
        src="/logo-enterprise.png?v=user_fit_v2" 
        alt="CogniVectra Innovations" 
        style={{ 
          height: currentSize.height, 
          maxWidth: currentSize.maxWidth, 
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.45)) drop-shadow(0 0 4px rgba(99, 102, 241, 0.6))',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  );
}
