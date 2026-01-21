import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function SimpleNavbar({ setIsChatOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [mobileMenuOpen]);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="nav">
        <div className="navInner container">
          {/* Logo */}
          <NavLink
            to="/"
            className="brand"
            aria-label="CogniVectra Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={logo} alt="CogniVectra Logo" className="brand-logo" />
            <span className="brand-text">enterprise automation for startups</span>
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
            <button onClick={() => setIsChatOpen(true)} className="ai-chat-button" aria-label="Chat with AI Assistant">
              <span className="ai-button-text">AI Assistant</span>
              <span className="ai-status-dot"></span>
              <span className="ai-button-glow"></span>
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
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

      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
        id="mobile-menu"
        aria-hidden={!mobileMenuOpen}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-header">
          <img src={logo} alt="CogniVectra Logo" className="mobile-menu-logo" />
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />
        </div>

        <div className="mobile-menu-content">
          <nav className="mobile-nav" aria-label="Mobile Navigation Links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">🏠</span>
              Home
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">⚡</span>
              Services
            </NavLink>
            <NavLink to="/engagements" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">🤝</span>
              Engagements
            </NavLink>
            <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">📊</span>
              Results
            </NavLink>
            <NavLink to="/industries" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">🏢</span>
              Industries
            </NavLink>
            <NavLink to="/who-we-are" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">👥</span>
              Who We Are
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
              <span className="mobile-nav-icon">📝</span>
              Blog
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
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
              className="mobile-ai-chat-button"
              aria-label="Chat with AI Assistant"
            >
              <span className="mobile-ai-text">Chat with AI Assistant</span>
              <span className="mobile-ai-badge">NEW</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
