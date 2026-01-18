import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
        <nav className="links desktop-links">
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
        </nav>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <nav className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/engagements" onClick={() => setMobileMenuOpen(false)}>
            Engagements
          </NavLink>
          <NavLink to="/results" onClick={() => setMobileMenuOpen(false)}>
            Results
          </NavLink>
          <NavLink to="/industries" onClick={() => setMobileMenuOpen(false)}>
            Industries
          </NavLink>
          <NavLink to="/who-we-are" onClick={() => setMobileMenuOpen(false)}>
            Who We Are
          </NavLink>
          <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)}>
            Blog
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
