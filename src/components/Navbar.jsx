import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="navInner container">
        {/* Logo */}
        <a href="/" className="brand" aria-label="CogniVectra Home">
          <img 
//            src="/vite.svg"
            src="/logo.png"
            alt="CogniVectra Logo"
            className="brand-logo"
          />
          <span className="brand-text">emerging innovations & engineering</span> {/* Shortened for mobile */}
        </a>

        {/* DESKTOP Links - HIDDEN on mobile */}
        <nav className="links desktop-links">
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/mission" className={({isActive}) => isActive ? 'active' : ''}>Mission</NavLink>
          <NavLink to="/who-we-are" className={({isActive}) => isActive ? 'active' : ''}>Who we are</NavLink>
          <NavLink to="/blog" className={({isActive}) => isActive ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink>
        </nav>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* MOBILE MENU OVERLAY */}
        <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/mission" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Mission</NavLink>
          <NavLink to="/who-we-are" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Who we are</NavLink>
          <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
