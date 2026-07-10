import React, { useState } from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  const [imgError, setImgError] = useState(false);

  // Optical sizing tokens designed to make 'cognivectra' and 'innovations' massive, distinct, and high-visibility
  const sizeMap = {
    default: {
      imgSize: '56px',
      titleSize: '2.25rem',
      subSize: '0.82rem',
      gap: '15px',
      dotSize: '8px'
    },
    large: {
      imgSize: '68px',
      titleSize: '2.75rem',
      subSize: '0.95rem',
      gap: '18px',
      dotSize: '10px'
    },
    footer: {
      imgSize: '64px',
      titleSize: '2.5rem',
      subSize: '0.9rem',
      gap: '16px',
      dotSize: '9px'
    },
    admin: {
      imgSize: '42px',
      titleSize: '1.6rem',
      subSize: '0.65rem',
      gap: '12px',
      dotSize: '6px'
    },
    mobile: {
      imgSize: '46px',
      titleSize: '1.8rem',
      subSize: '0.7rem',
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
      {/* 8K Quantum Neural Brain Orb (Tinted/Shadowed with Purple Energy) */}
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
              filter: 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.55)) drop-shadow(0 0 6px rgba(168, 85, 247, 0.75))',
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

      {/* Massive, Distinct Brand Typography Block ('cognivectra' + 'innovations' in Purple Theme) */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span 
            style={{ 
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontWeight: 850,
              fontSize: currentSize.titleSize,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 0.95,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)',
              whiteSpace: 'nowrap'
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
              marginLeft: '5px',
              boxShadow: '0 0 12px #c084fc, 0 0 24px #a855f7',
              flexShrink: 0
            }}
          />
        </div>

        {/* Distinct 'innovations' Subtitle in Luminous Purple */}
        <span 
          style={{ 
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontWeight: 750,
            fontSize: currentSize.subSize,
            letterSpacing: '0.28em',
            textTransform: 'lowercase',
            color: '#d8b4fe',
            marginTop: '5px',
            textShadow: '0 0 10px rgba(192, 132, 252, 0.45)',
            whiteSpace: 'nowrap',
            opacity: 0.95
          }}
        >
          innovations
        </span>
      </div>
    </div>
  );
}
