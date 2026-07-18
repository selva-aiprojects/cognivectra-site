import React, { useState } from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  const [imgError, setImgError] = useState(false);

  // Precision sizing map boosting the neural orb icon to 64px with ultra-luminous neon visibility
  const sizeMap = {
    default: {
      imgSize: '64px',
      titleSize: '2.1rem',
      subSize: '0.88rem',
      gap: '15px',
      dotSize: '8px'
    },
    large: {
      imgSize: '76px',
      titleSize: '2.55rem',
      subSize: '1.05rem',
      gap: '18px',
      dotSize: '10px'
    },
    footer: {
      imgSize: '44px',
      titleSize: '1.5rem',
      subSize: '0.68rem',
      gap: '12px',
      dotSize: '6px'
    },
    admin: {
      imgSize: '46px',
      titleSize: '1.5rem',
      subSize: '0.68rem',
      gap: '12px',
      dotSize: '6px'
    },
    mobile: {
      imgSize: '52px',
      titleSize: '1.7rem',
      subSize: '0.75rem',
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
      {/* Ultra-Luminous 64px Quantum Neural Brain Orb */}
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
            src="/favicon.png?v=nanobanana_v2" 
            alt="CogniVectra Quantum Core" 
            onError={() => setImgError(true)}
            style={{ 
              height: currentSize.imgSize, 
              width: currentSize.imgSize, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 18px rgba(192, 132, 252, 0.9)) drop-shadow(0 0 28px rgba(56, 189, 248, 0.75)) brightness(1.15) contrast(1.12)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ) : (
          <svg viewBox="0 0 100 100" width={currentSize.imgSize} height={currentSize.imgSize}>
            <circle cx="50" cy="50" r="44" fill="rgba(168, 85, 247, 0.25)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#c084fc" strokeWidth="3.5" transform="rotate(-30 50 50)" filter="drop-shadow(0 0 6px #c084fc)" />
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#38bdf8" strokeWidth="3" transform="rotate(60 50 50)" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="50" cy="50" r="16" fill="#ffffff" filter="drop-shadow(0 0 12px #c084fc)" />
          </svg>
        )}
      </div>

      {/* Ultra-Competitive Tech Wordmark ('Orbitron' Title, 'Rajdhani' bottom right Subtitle) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyItems: 'center', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span 
            style={{ 
              fontFamily: "'Orbitron', 'Space Grotesk', 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: currentSize.titleSize,
              letterSpacing: '0.01em',
              color: '#ffffff',
              lineHeight: 0.92,
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
              marginLeft: '6px',
              boxShadow: '0 0 12px #c084fc, 0 0 24px #a855f7',
              flexShrink: 0
            }}
          />
        </div>

        {/* 'innovations' in Rajdhani positioned right below cognivectra at the right side */}
        <span 
          style={{ 
            fontFamily: "'Rajdhani', 'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: currentSize.subSize,
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color: '#d8b4fe',
            marginTop: '5px',
            marginRight: '2px',
            textShadow: '0 0 12px rgba(192, 132, 252, 0.5)',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-end'
          }}
        >
          innovations
        </span>
      </div>
    </div>
  );
}
