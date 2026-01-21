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

  // Close mobile menu when clicking outside - DISABLED FOR TESTING
  useEffect(() => {
    // Temporarily disabled to debug hamburger menu issue
    /*
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const hamburger = document.querySelector('.hamburger-menu-toggle');
      
      if (mobileMenuOpen && mobileMenu && hamburger && 
          !mobileMenu.contains(event.target) && 
          !hamburger.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    */

    // Close on escape key
    const handleEscape = (event) => {
      if (mobileMenuOpen && event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    // Prevent scrolling when menu is open
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      // document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
      // document.removeEventListener('click', handleClickOutside);
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
              className="ai-chat-button"
              aria-label="Chat with AI Assistant"
            >
              <span className="ai-icon-wrapper">
                <svg className="ai-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="ai-button-text">AI Assistant</span>
              <span className="ai-status-dot"></span>
              <span className="ai-button-glow"></span>
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-menu-toggle"
            onClick={() => {
              console.log('Hamburger clicked, current state:', mobileMenuOpen);
              setMobileMenuOpen(!mobileMenuOpen);
              console.log('New state:', !mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
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
              className="mobile-ai-chat-button"
              aria-label="Chat with AI Assistant"
            >
              <span className="mobile-ai-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.5 9.5C9.77614 9.5 10 9.27614 10 9C10 8.72386 9.77614 8.5 9.5 8.5C9.22386 8.5 9 8.72386 9 9C9 9.27614 9.22386 9.5 9.5 9.5Z"
                    fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M13.5 9.5C13.7761 9.5 14 9.27614 14 9C14 8.72386 13.7761 8.5 13.5 8.5C13.2239 8.5 13 8.72386 13 9C13 9.27614 13.2239 9.5 13.5 9.5Z"
                    fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M17.5 9.5C17.7761 9.5 18 9.27614 18 9C18 8.72386 17.7761 8.5 17.5 8.5C17.2239 8.5 17 8.72386 17 9C17 9.27614 17.2239 9.5 17.5 9.5Z"
                    fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </span>
              <span className="mobile-ai-text">Chat with AI Assistant</span>
              <span className="mobile-ai-badge">NEW</span>
            </button>

            <div className="mobile-contact">
              <p>Email: <a href="mailto:hello@cognivectra.com">hello@cognivectra.com</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS styles */}
      <style jsx>{`
        .ai-chat-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-left: 1rem;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .ai-chat-button:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
          background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));
        }

        .ai-chat-button:active {
          transform: translateY(-1px) scale(1.005);
        }

        .ai-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ai-icon {
          width: 16px;
          height: 16px;
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          transition: transform 0.3s ease;
        }

        .ai-chat-button:hover .ai-icon {
          transform: scale(1.1);
        }

        .ai-button-text {
          position: relative;
          z-index: 2;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .ai-status-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          border: 2px solid white;
          animation: statusPulse 2s infinite;
          z-index: 3;
        }

        .ai-button-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .ai-chat-button:hover .ai-button-glow {
          opacity: 1;
        }

        .mobile-ai-chat-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin: 1.5rem 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .mobile-ai-chat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .mobile-ai-icon {
          width: 22px;
          height: 22px;
          color: white;
        }

        .mobile-ai-text {
          flex: 1;
          text-align: center;
        }

        .mobile-ai-badge {
          background: #ff6b6b;
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 700;
          animation: glow 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes pulse {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px #ff6b6b;
          }
          50% {
            box-shadow: 0 0 15px #ff6b6b;
          }
        }

        @media (max-width: 768px) {
          .ai-chat-button {
            display: none;
          }
        }
      `}</style>
    </>
  );
}