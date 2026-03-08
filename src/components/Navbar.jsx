import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import {
  FaSearch, FaHome, FaCogs, FaRocket, FaBriefcase,
  FaChartBar, FaGlobe, FaUsers, FaRss, FaEnvelope,
  FaLinkedin, FaTwitter, FaFacebook, FaTimes
} from "react-icons/fa";
import { trackEvent } from "../lib/analytics";

// Images
import servicesImg from "../assets/generated/hero-services-ultra-8k.png";
import productsImg from "../assets/generated/hero-products-ultra-8k.png";
import engagementsImg from "../assets/generated/hero-engagements-8k.png";
import resultsImg from "../assets/generated/hero-results-8k.png";
import industriesImg from "../assets/generated/hero-industries-ultra-8k.png";
import aboutImg from "../assets/generated/hero-whoweare-ultra-8k.png";

const logo = "/logo-enterprise.png";

import ThemeSwitcher from "./ThemeSwitcher";

export default function SimpleNavbar({ setIsChatOpen, setIsDemoModalOpen, setDemoPlatform, setIsSearchOpen, theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const mobileToggleRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      // Return focus to toggle when navigating away
      mobileToggleRef.current?.focus();
    }
    setActiveMenu(null);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
      // Ensure focus is not trapped in hidden menu
      if (document.activeElement && document.getElementById('mobile-menu')?.contains(document.activeElement)) {
        mobileToggleRef.current?.focus();
      }
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

  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 100);
  };

  const handleDemoRequest = (platform = 'general') => {
    setDemoPlatform(platform);
    setIsDemoModalOpen(true);
  };

  const menuData = {
    services: {
      section: "Services",
      image: servicesImg,
      items: [
        { label: "Cloud Foundations", path: "/services#cloud", desc: "Enterprise-ready landing zones & SaaS architecture." },
        { label: "Intelligent Operations", path: "/services#ops", desc: "Lean workflow orchestration & API automation." },
        { label: "SaaS & AI Blocks", path: "/services#saas", desc: "Reusable components for rapid AI integration." },
        { label: "Enterprise Strategy", path: "/services#cto", desc: "Strategic technology leadership & architecture." },
      ]
    },
    products: {
      section: "Platforms",
      image: productsImg,
      items: [
        { label: "StockSteward AI", path: "/products#steward", desc: "Algorithmic trading & market intelligence." },
        { label: "StoreAI", path: "/products#storeai", desc: "Transformative retail management analytics." },
        { label: "MedFlow EMR", path: "/products#emr", desc: "Multi-tenant EMR live at Kidz-Clinic & Dr. S.T. Pushpa." },
        { label: "OmniCore (Beta)", path: "/products#omnicore", desc: "Unified enterprise AI orchestration engine." },
        { label: "VectraFlow", path: "/products#vectraflow", desc: "Intelligent document processing workflows." },
      ]
    },
    engagements: {
      section: "Engagements",
      image: engagementsImg,
      items: [
        { label: "Enterprise Launch Pack", path: "/engagements#launch", desc: "Guided 4-6 week cloud & automation setup." },
        { label: "Monthly Platform Support", path: "/engagements#support", desc: "Ongoing reliability & performance management." },
        { label: "Flexible Retainer", path: "/engagements#retainer", desc: "Pay-as-you-go expertise for growing teams." },
        { label: "Strategic Advisory", path: "/engagements#advisory", desc: "Board-level strategic tech guidance." },
      ]
    },
    results: {
      section: "Results",
      image: resultsImg,
      items: [
        { label: "SaaS Case Study", path: "/results#saas", desc: "Release cycles reduced from weeks to days." },
        { label: "AI Cloud Stability", path: "/results#cloud", desc: "Predictable spend & improved platform stability." },
        { label: "Ops Automation", path: "/results#ops", desc: "Reduced manual errors & saved founder time." },
        { label: "Our Impact", path: "/results", desc: "Explore the measurable outcomes we deliver." },
      ]
    },
    industries: {
      section: "Industries",
      image: industriesImg,
      items: [
        { label: "Fintech", path: "/industries#fintech", desc: "High-scale financial data & trading systems." },
        { label: "E-commerce", path: "/industries#ecommerce", desc: "Predictive retail automation & inventory sync." },
        { label: "Healthtech", path: "/industries#healthtech", desc: "Secure data platforms for health providers." },
        { label: "Logistics", path: "/industries#logistics", desc: "Supply chain optimization & intelligent tracking." },
      ]
    },
    about: {
      section: "Company",
      image: aboutImg,
      items: [
        { label: "Who We Are", path: "/who-we-are", desc: "Discover our mission & enterprise-grade approach." },
        { label: "Our Leadership", path: "/leadership", desc: "Meet the experts steering our technical vision." },
        { label: "Insights & Blog", path: "/blog", desc: "Technical deep-dives & industry perspectives.", badge: "New" },
        { label: "Join Our Team", path: "/careers", desc: "Build the future of AI technology with us.", badge: "Hiring" },
      ]
    }
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
            <img src="/logo-enterprise.png" alt="CogniVectra" className="brand-logo" />
            <div className="brand-divider"></div>
            <span className="brand-tagline">Transforming Ideas into Intelligent AI Systems</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="links desktop-links" aria-label="Desktop Navigation">
            <div
              className={`nav-item-wrapper ${activeMenu === 'services' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/services" className={`nav-link-with-arrow ${activeMenu === 'services' ? 'active-dropdown' : ''}`}>
                Services
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'services'}
                {...menuData.services}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'products' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/products" className={`nav-link-with-arrow ${activeMenu === 'products' ? 'active-dropdown' : ''}`}>
                Platforms
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'products'}
                {...menuData.products}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'engagements' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('engagements')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/engagements" className={`nav-link-with-arrow ${activeMenu === 'engagements' ? 'active-dropdown' : ''}`}>
                Engagements
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'engagements'}
                {...menuData.engagements}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'results' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('results')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/results" className={`nav-link-with-arrow ${activeMenu === 'results' ? 'active-dropdown' : ''}`}>
                Results
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'results'}
                {...menuData.results}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'industries' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('industries')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/industries" className={`nav-link-with-arrow ${activeMenu === 'industries' ? 'active-dropdown' : ''}`}>
                Industries
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'industries'}
                {...menuData.industries}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'about' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/who-we-are" className={`nav-link-with-arrow ${activeMenu === 'about' ? 'active-dropdown' : ''}`}>
                About
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'about'}
                {...menuData.about}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <NavLink to="/blog" className="nav-link desktop-only-link" style={{ marginLeft: '0.5rem' }}>
              Blog
            </NavLink>

            {/* Request Demo Button (Primary CTA) */}
            <Link
              to="/contact"
              onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Navbar' })}
              className="btn nav-cta"
            >
              Book Strategy Call
            </Link>

            {/* AI Assistant */}
            <button
              onClick={() => {
                trackEvent('cta_click', { cta_name: 'AI Assistant', location: 'Navbar' });
                setIsChatOpen(true);
              }}
              className="ai-chat-button"
              aria-label="Chat with AI Assistant"
            >
              AI Assistant
              <span className="ai-status-dot"></span>
            </button>

            {/* Theme Selector */}
            <ThemeSwitcher theme={theme} setTheme={setTheme} />

            {/* Neural Search Trigger */}
            <button
              id="neural-search-trigger"
              onClick={() => {
                trackEvent('cta_click', { cta_name: 'Neural Search', location: 'Navbar' });
                setIsSearchOpen(true);
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                height: '40px',
                width: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="nav-search-trigger"
              aria-label="Open AI Neural Search"
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <FaSearch size={14} />
            </button>
          </nav>

          {/* Mobile Actions (Search + Hamburger) */}
          <div className="mobile-actions">
            <button
              onClick={() => {
                trackEvent('cta_click', { cta_name: 'Neural Search', location: 'Mobile Header' });
                setIsSearchOpen(true);
              }}
              className="nav-search-trigger mobile-only"
              aria-label="Open AI Neural Search"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                height: '40px',
                width: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaSearch size={14} />
            </button>

            <ThemeSwitcher theme={theme} setTheme={setTheme} />

            <button
              ref={mobileToggleRef}
              className={`hamburger-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
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
        inert={mobileMenuOpen ? undefined : ""}
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
          {/* Mobile Neural Search Trigger */}
          <div className="mobile-search-shortcut">
            <button
              className="mobile-search-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
            >
              <div className="search-icon-circle">
                <FaSearch size={12} />
              </div>
              <span>Ask CogniVectra AI...</span>
              <div className="ai-badge-tiny">AI</div>
            </button>
          </div>

          <nav className="mobile-nav" aria-label="Mobile Navigation Links">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              <FaHome className="mobile-icon" /> Home
            </NavLink>
            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>
              <FaCogs className="mobile-icon" /> Services
            </NavLink>
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
              <FaRocket className="mobile-icon" /> Platforms
            </NavLink>
            <NavLink to="/engagements" onClick={() => setMobileMenuOpen(false)}>
              <FaBriefcase className="mobile-icon" /> Engagements
            </NavLink>
            <NavLink to="/results" onClick={() => setMobileMenuOpen(false)}>
              <FaChartBar className="mobile-icon" /> Results
            </NavLink>
            <NavLink to="/industries" onClick={() => setMobileMenuOpen(false)}>
              <FaGlobe className="mobile-icon" /> Industries
            </NavLink>
            <NavLink to="/who-we-are" onClick={() => setMobileMenuOpen(false)}>
              <FaUsers className="mobile-icon" /> About Us
            </NavLink>
            <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)}>
              <FaRss className="mobile-icon" /> Blog
            </NavLink>
            <NavLink to="/careers" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBriefcase className="mobile-icon" /> Careers
              <span style={{ fontSize: '0.6rem', background: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>Hiring</span>
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <FaEnvelope className="mobile-icon" /> Contact
            </NavLink>
          </nav>

          <div className="mobile-social-wrap">
            <span className="social-label">Join Our Network</span>
            <div className="mobile-social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://www.facebook.com/profile.php?id=61582266623883" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </div>

          <div className="mobile-menu-footer">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsChatOpen(true);
              }}
              className="mobile-ai-chat-button"
            >
              Chat with AI Assistant
              <span className="mobile-ai-badge">NEW</span>
            </button>

            <NavLink
              to="/contact"
              className="btn mobile-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Mobile Nav' });
              }}
            >
              Book Strategy Call
            </NavLink>
          </div>
        </div>
      </div >
    </>
  );
}
