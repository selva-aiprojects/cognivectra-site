import React, { useState } from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  const [imgError, setImgError] = useState(false);

  // Precision optical tokens keeping 'cognivectra' and 'innovations' large, distinct, and horizontal on the right side
  const sizeMap = {
    default: {
      imgSize: '54px',
      titleSize: '2.15rem',
      subSize: '1.25rem',
      gap: '14px',
      dotSize: '8px'
    },
    large: {
      imgSize: '66px',
      titleSize: '2.6rem',
      subSize: '1.5rem',
      gap: '16px',
      dotSize: '10px'
    },
    footer: {
      imgSize: '62px',
      titleSize: '2.4rem',
      subSize: '1.4rem',
      gap: '16px',
      dotSize: '9px'
    },
    admin: {
      imgSize: '40px',
      titleSize: '1.55rem',
      subSize: '0.9rem',
      gap: '10px',
      dotSize: '6px'
    },
    mobile: {
      imgSize: '44px',
      titleSize: '1.75rem',
      subSize: '1.05rem',
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
      {/* 8K Quantum Neural Brain Orb (Royal Purple & Sapphire Theme) */}
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
            alt="CogniVectra Quantum Core" 
            onError={() => setImgError(true)}
            style={{ 
              height: currentSize.imgSize, 
              width: currentSize.imgSize, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.55)) drop-shadow(0 0 5px rgba(168, 85, 247, 0.8))',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ) : (
          <svg viewBox="0 0 100 100" width={currentSize.imgSize} height={currentSize.imgSize}>
            <circle cx="50" cy="50" r="44" fill="rgba(168, 85, 247, 0.15)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#c084fc" strokeWidth="3" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#a855f7" strokeWidth="2.5" transform="rotate(60 50 50)" />
            <circle cx="50" cy="50" r="14" fill="#c084fc" filter="drop-shadow(0 0 8px #c084fc)" />
          </svg>
        )}
      </div>

      {/* Single Horizontal Line: 'cognivectra' + dot + 'innovations' at right side */}
      <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
        <span 
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontWeight: 850,
            fontSize: currentSize.titleSize,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            lineHeight: 1,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)'
          }}
        >
          cognivectra
        </span>

        {/* Luminous Royal Purple Quantum Dot */}
        <span 
          style={{ 
            display: 'inline-block',
            width: currentSize.dotSize,
            height: currentSize.dotSize,
            backgroundColor: '#c084fc',
            borderRadius: '50%',
            margin: '0 10px',
            boxShadow: '0 0 12px #c084fc, 0 0 24px #a855f7',
            flexShrink: 0,
            transform: 'translateY(-2px)'
          }}
        />

        {/* 'innovations' on the right side in distinct luminous purple */}
        <span 
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontWeight: 750,
            fontSize: currentSize.subSize,
            letterSpacing: '0.08em',
            color: '#d8b4fe',
            lineHeight: 1,
            textShadow: '0 0 12px rgba(192, 132, 252, 0.55)'
          }}
        >
          innovations
        </span>
      </div>
    </div>
  );
}
