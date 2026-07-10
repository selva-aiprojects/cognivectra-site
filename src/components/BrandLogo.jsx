import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  // Sizing tokens for maximum human visibility and crystal-clear 8K impact
  const sizeMap = {
    default: {
      imgSize: '56px',
      fontSize: '2.15rem',
      gap: '14px',
      padding: '4px 0'
    },
    large: {
      imgSize: '68px',
      fontSize: '2.5rem',
      gap: '16px',
      padding: '6px 0'
    },
    footer: {
      imgSize: '64px',
      fontSize: '2.3rem',
      gap: '16px',
      padding: '0'
    },
    admin: {
      imgSize: '42px',
      fontSize: '1.6rem',
      gap: '12px',
      padding: '2px 0'
    },
    mobile: {
      imgSize: '46px',
      fontSize: '1.75rem',
      gap: '12px',
      padding: '2px 0'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div 
      className={`brand-logo-container ${className}`} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: currentSize.gap,
        padding: currentSize.padding,
        textDecoration: 'none',
        flexShrink: 0
      }}
      onClick={onClick}
    >
      {/* 8K Quantum Neural Orb Emblem */}
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img 
          src="/favicon.png?v=8k_v5" 
          alt="CogniVectra 8K Emblem" 
          style={{ 
            height: currentSize.imgSize, 
            width: currentSize.imgSize, 
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.45)) drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* High-Visibility Lowercase Brand Typography */}
      <span 
        style={{ 
          fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
          fontWeight: 850,
          fontSize: currentSize.fontSize,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }}
      >
        cogni<span style={{ 
          background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textShadow: 'none'
        }}>vectra</span>
      </span>
    </div>
  );
}
