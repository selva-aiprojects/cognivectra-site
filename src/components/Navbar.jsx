import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Navbar({ setIsChatOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger')) {
        setMobileMenuOpen(false);
      }
    };

    // Close on escape key
    const handleEscape = (event) => {
      if (mobileMenuOpen && event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    // Prevent scrolling when menu is open
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="navInner container">
          {/* Logo / Brand */}
          <NavLink
            to="/"
            className="brand"
            aria-label="CogniVectra Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={logo}
              alt="CogniVectra Logo"
              className="brand-logo"
            />
            <span className="brand-text">
              enterprise automation for startups
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="links desktop-links" aria-label="Desktop Navigation">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>
              Services
            </NavLink>
            <NavLink to="/engagements" className={({ isActive }) => (isActive ? "active" : "")}>
              Engagements
            </NavLink>
            <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")}>
              Results
            </NavLink>
            <NavLink to="/industries" className={({ isActive }) => (isActive ? "active" : "")}>
              Industries
            </NavLink>
            <NavLink to="/who-we-are" className={({ isActive }) => (isActive ? "active" : "")}>
              Who We Are
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact
            </NavLink>
            <button
              onClick={() => setIsChatOpen(true)}
              className="btn-outline"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                marginBottom: 0,
                marginLeft: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>💬</span> Chat with AI
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
        id="mobile-menu"
        aria-hidden={!mobileMenuOpen}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-header">
          <img src={logo} alt="CogniVectra Logo" className="mobile-menu-logo" />
          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        </div>

        <div className="mobile-menu-content">
          <nav className="mobile-nav" aria-label="Mobile Navigation Links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">🏠</span>
              Home
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">⚡</span>
              Services
            </NavLink>

            <NavLink
              to="/engagements"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">🤝</span>
              Engagements
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">📊</span>
              Results
            </NavLink>

            <NavLink
              to="/industries"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">🏢</span>
              Industries
            </NavLink>

            <NavLink
              to="/who-we-are"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">👥</span>
              Who We Are
            </NavLink>

            <NavLink
              to="/blog"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">📝</span>
              Blog
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">📞</span>
              Contact
            </NavLink>
          </nav>

          <div className="mobile-menu-footer">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsChatOpen(true);
              }}
              className="btn mobile-chat-btn"
            >
              <span className="chat-icon">💬</span>
              Chat with AI
            </button>

            <div className="mobile-contact">
              <p>Email: <a href="mailto:hello@cognivectra.com">hello@cognivectra.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}