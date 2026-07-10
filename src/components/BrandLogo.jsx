import React, { useState } from 'react';

export default function BrandLogo({ size = 'default', className = '', onClick = () => {} }) {
  const [imgError, setImgError] = useState(false);

  // Precision optical sizing tailored for Orbitron and Rajdhani (ultra-competitive futuristic AI typography)
  const sizeMap = {
    default: {
      imgSize: '56px',
      titleSize: '2.1rem',
      subSize: '0.88rem',
      gap: '15px',
      dotSize: '8px'
    },
    large: {
      imgSize: '68px',
      titleSize: '2.55rem',
      subSize: '1.05rem',
      gap: '18px',
      dotSize: '10px'
    },
    footer: {
      imgSize: '64px',
      titleSize: '2.35rem',
      subSize: '0.95rem',
      gap: '16px',
      dotSize: '9px'
    },
    admin: {
      imgSize: '42px',
      titleSize: '1.5rem',
      subSize: '0.68rem',
      gap: '12px',
      dotSize: '6px'
    },
    mobile: {
      imgSize: '46px',
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

      {/* Ultra-Competitive Tech Wordmark Block ('Orbitron' for Title, 'Rajdhani' bottom right for Subtitle) */}
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
