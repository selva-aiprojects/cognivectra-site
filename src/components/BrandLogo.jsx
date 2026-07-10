import React, { useState } from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  const [imgError, setImgError] = useState(false);

  // Optical sizing tokens for refined, crystal-clear Nano Banana 8K quality and human visibility
  const sizeMap = {
    default: {
      imgSize: '52px',
      fontSize: '1.95rem',
      gap: '14px',
      dotSize: '8px'
    },
    large: {
      imgSize: '64px',
      fontSize: '2.45rem',
      gap: '16px',
      dotSize: '10px'
    },
    footer: {
      imgSize: '60px',
      fontSize: '2.25rem',
      gap: '16px',
      dotSize: '9px'
    },
    admin: {
      imgSize: '40px',
      fontSize: '1.5rem',
      gap: '12px',
      dotSize: '6px'
    },
    mobile: {
      imgSize: '44px',
      fontSize: '1.7rem',
      gap: '12px',
      dotSize: '7px'
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
        textDecoration: 'none',
        flexShrink: 0,
        userSelect: 'none'
      }}
      onClick={onClick}
    >
      {/* Nano Banana 8K Transparent Circular Quantum Emblem */}
      <div 
        style={{ 
          position: 'relative', 
          width: currentSize.imgSize, 
          height: currentSize.imgSize,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {!imgError ? (
          <img 
            src="/favicon.png?v=nanobanana_v1" 
            alt="CogniVectra Nano Banana 8K Emblem" 
            onError={() => setImgError(true)}
            style={{ 
              height: currentSize.imgSize, 
              width: currentSize.imgSize, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.5)) drop-shadow(0 0 4px rgba(99, 102, 241, 0.6))',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ) : (
          <svg viewBox="0 0 100 100" width={currentSize.imgSize} height={currentSize.imgSize}>
            <circle cx="50" cy="50" r="44" fill="url(#coreGlow)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#38bdf8" strokeWidth="3" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#6366f1" strokeWidth="2.5" transform="rotate(60 50 50)" />
            <circle cx="50" cy="50" r="14" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />
          </svg>
        )}
      </div>

      {/* High-Contrast, Crystal-Clear Pure White Lowercase Brand Typography */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span 
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: currentSize.fontSize,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)',
            whiteSpace: 'nowrap'
          }}
        >
          cognivectra
        </span>
        {/* Luminous Electric Cyan Quantum Dot */}
        <span 
          style={{ 
            display: 'inline-block',
            width: currentSize.dotSize,
            height: currentSize.dotSize,
            backgroundColor: '#38bdf8',
            borderRadius: '50%',
            marginLeft: '5px',
            marginBottom: '14px',
            boxShadow: '0 0 12px #38bdf8, 0 0 24px #6366f1',
            flexShrink: 0
          }}
        />
      </div>
    </div>
  );
}
