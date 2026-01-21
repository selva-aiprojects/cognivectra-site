import { useState } from "react";

export default function NavbarTest() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(99, 102, 241, 0.1)', padding: '10px' }}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '44px',
            height: '44px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '2px solid #06B6D4',
            borderRadius: '10px',
            padding: '12px 10px',
            cursor: 'pointer',
            gap: '3px'
          }}
        >
          <span style={{ display: 'block', width: '100%', height: '3px', background: '#06B6D4', borderRadius: '2px' }}></span>
          <span style={{ display: 'block', width: '100%', height: '3px', background: '#06B6D4', borderRadius: '2px' }}></span>
          <span style={{ display: 'block', width: '100%', height: '3px', background: '#06B6D4', borderRadius: '2px' }}></span>
        </button>
        
        {mobileMenuOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.95)', zIndex: 9999, padding: '20px' }}>
            <p style={{ color: 'white', fontSize: '16px' }}>Mobile Menu is OPEN!</p>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: '#ff4444', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Close Menu</button>
          </div>
        )}
      </header>
    </>
  );
}
