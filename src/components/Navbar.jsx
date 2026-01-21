import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function SimpleNavbar({ setIsChatOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        background: 'rgba(99, 102, 241, 0.1)', 
        padding: '10px',
        borderBottom: '2px solid var(--accent-primary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          {/* Logo */}
          <NavLink to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="CogniVectra Logo" style={{ height: '40px' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>enterprise automation for startups</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none', gap: '10px' }} className="desktop-nav">
            <NavLink to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px' }}>Home</NavLink>
            <NavLink to="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px' }}>Services</NavLink>
            <NavLink to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px' }}>Contact</NavLink>
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              AI Assistant
            </button>
          </nav>

          {/* WORKING HAMBURGER MENU */}
          <button 
            onClick={toggleMenu}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '30px',
              height: '21px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: 'var(--accent-primary)',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(0, 8px)' : 'rotate(0) translate(0, 0)'
            }}></span>
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: 'var(--accent-primary)',
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1
            }}></span>
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: 'var(--accent-primary)',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(0, -8px)' : 'rotate(0) translate(0, 0)'
            }}></span>
          </button>
        </div>
      </header>

      {/* WORKING MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'var(--bg-secondary)',
          zIndex: 999,
          padding: '20px',
          borderBottom: '1px solid var(--border-light)',
          backdropFilter: 'blur(10px)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '10px' }} onClick={toggleMenu}>Home</NavLink>
            <NavLink to="/services" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '10px' }} onClick={toggleMenu}>Services</NavLink>
            <NavLink to="/contact" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '10px' }} onClick={toggleMenu}>Contact</NavLink>
            <button 
              onClick={() => {
                toggleMenu();
                setIsChatOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Chat with AI Assistant
            </button>
          </nav>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style jsx>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
