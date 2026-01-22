import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function SimpleNavbar({ setIsChatOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="navInner container">

          {/* Logo */}
          <NavLink
            to="/"
            className="brand"
            aria-label="CogniVectra Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={logo} alt="CogniVectra Logo" className="brand-logo" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="links desktop-links" aria-label="Desktop Navigation">

            <NavLink to="/services">Services</NavLink>
            <NavLink to="/engagements">Engagements</NavLink>
            <NavLink to="/results">Results</NavLink>
            <NavLink to="/industries">Industries</NavLink>
            <NavLink to="/who-we-are">Who We Are</NavLink>
            <NavLink to="/blog">Blog</NavLink>

            {/* Primary CTA */}
            <NavLink to="/contact" className="btn nav-cta">
              Book Strategy Call
            </NavLink>

            {/* AI Assistant */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="ai-chat-button"
              aria-label="Chat with AI Assistant"
            >
              AI Assistant
              <span className="ai-status-dot"></span>
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

      {/* Mobile Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
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

            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>Services</NavLink>
            <NavLink to="/engagements" onClick={() => setMobileMenuOpen(false)}>Engagements</NavLink>
            <NavLink to="/results" onClick={() => setMobileMenuOpen(false)}>Results</NavLink>
            <NavLink to="/industries" onClick={() => setMobileMenuOpen(false)}>Industries</NavLink>
            <NavLink to="/who-we-are" onClick={() => setMobileMenuOpen(false)}>Who We Are</NavLink>
            <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>

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
              Chat with AI Assistant
              <span className="mobile-ai-badge">NEW</span>
            </button>

            <NavLink
              to="/contact"
              className="btn mobile-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Strategy Call
            </NavLink>

          </div>
        </div>
      </div>
    </>
  );
}
