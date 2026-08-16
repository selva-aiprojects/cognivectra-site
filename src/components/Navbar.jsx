import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import {
  FaSearch, FaHome, FaCogs, FaRocket, FaBriefcase,
  FaGlobe, FaUsers, FaRss, FaEnvelope,
  FaLinkedin, FaTwitter, FaFacebook, FaTimes
} from "react-icons/fa";
import { LuChartBar } from "react-icons/lu";
import { trackEvent } from "../lib/analytics";
import "../styles/hamburger.css";

// Images
import servicesImg from "../assets/generated/hero-services-ultra-8k.png";
import productsImg from "../assets/generated/hero-products-ultra-8k.png";
import resultsImg from "../assets/generated/hero-results-8k.png";
import industriesImg from "../assets/generated/hero-industries-ultra-8k.png";
import aboutImg from "../assets/generated/hero-whoweare-ultra-8k.png";

const logo = "/logo-enterprise.png";

import ThemeSwitcher from "./ThemeSwitcher";
import BrandLogo from "./BrandLogo";

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
    capabilities: {
      section: "Capabilities",
      image: servicesImg,
      items: [
        { label: "AI Engineering", path: "/ai-engineering", desc: "Generative AI, agentic AI, copilots & RAG." },
        { label: "Cloud & Platform Engineering", path: "/cloud-platform-engineering", desc: "Cloud transformation, Kubernetes & DevSecOps." },
        { label: "Product Engineering", path: "/product-engineering", desc: "SaaS, enterprise apps & multi-tenant platforms." },
        { label: "Data & Integration", path: "/data-integration", desc: "Data platforms, ETL/ELT & vector foundations." },
      ]
    },
    products: {
      section: "Products",
      image: productsImg,
      items: [
        { label: "Healthezee", path: "/products/healthezee", desc: "Healthcare management & EMR platform." },
        { label: "MediFlow", path: "/products/medflow", desc: "Pharmacy management system." },
        { label: "StockSteward", path: "/products/stocksteward", desc: "AI-powered investment intelligence." },
        { label: "StoreAI", path: "/products/storeai", desc: "Intelligent inventory & retail management." },
        { label: "EduPortal", path: "/products/eduportal", desc: "AI-powered education platform." },
        { label: "CogniHRMS", path: "/products#cognihrms", desc: "AI-driven workforce & HR management." },
        { label: "SmartPortfolio", path: "/products/smartportfolio", desc: "AI-powered portfolio intelligence." },
        { label: "Full Portfolio", path: "/products", desc: "Browse all Cognivectra products." },
      ]
    },
    solutions: {
      section: "Solutions",
      image: industriesImg,
      items: [
        { label: "Healthcare", path: "/industries#healthcare", desc: "Hospital operations & pharmacy platforms." },
        { label: "HR & Talent", path: "/industries#hr-talent", desc: "HR management & talent platforms." },
        { label: "Hospitality", path: "/industries#hospitality", desc: "Hospitality management platforms." },
        { label: "BFSI & FinTech", path: "/industries#bfsi-fintech", desc: "Banking & portfolio intelligence." },
        { label: "Retail & Commerce", path: "/industries#retail-commerce", desc: "Inventory & business operations." },
        { label: "Enterprise", path: "/industries#enterprise", desc: "AI, automation & platform engineering." },
      ]
    },
    results: {
      section: "Case Studies",
      image: resultsImg,
      items: [
        { label: "Healthcare EHR Transformation", path: "/case-studies#healthcare-ehr", desc: "Large-scale healthcare delivery program." },
        { label: "Cloud Transformation", path: "/case-studies#cloud-transformation", desc: "2,500+ workloads. Zero downtime." },
        { label: "AI IT Operations", path: "/case-studies#ai-it-operations", desc: "Enterprise AI for IT operations." },
        { label: "Our Results", path: "/results", desc: "Explore the measurable outcomes we deliver." },
      ]
    },
    about: {
      section: "Company",
      image: aboutImg,
      items: [
        { label: "Who We Are", path: "/who-we-are", desc: "Discover our mission & engineering approach." },
        { label: "Our Leadership", path: "/leadership", desc: "Meet the experts steering our technical vision." },
        { label: "Engagements", path: "/engagements", desc: "Flexible engagement & support models." },
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
            <BrandLogo size="default" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="links desktop-links" aria-label="Desktop Navigation">
            <div
              className={`nav-item-wrapper ${activeMenu === 'capabilities' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('capabilities')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/services" className={`nav-link-with-arrow ${activeMenu === 'capabilities' ? 'active-dropdown' : ''}`}>
                Capabilities
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'capabilities'}
                {...menuData.capabilities}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'products' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/products" className={`nav-link-with-arrow ${activeMenu === 'products' ? 'active-dropdown' : ''}`}>
                Products
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
              className={`nav-item-wrapper ${activeMenu === 'solutions' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/industries" className={`nav-link-with-arrow ${activeMenu === 'solutions' ? 'active-dropdown' : ''}`}>
                Solutions
                <svg className="nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L5 4.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'solutions'}
                {...menuData.solutions}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className={`nav-item-wrapper ${activeMenu === 'results' ? 'mega-menu-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('results')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/case-studies" className={`nav-link-with-arrow ${activeMenu === 'results' ? 'active-dropdown' : ''}`}>
                Case Studies
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
              onClick={() => trackEvent('cta_click', { cta_name: "Let's Talk", location: 'Navbar' })}
              className="btn nav-cta"
            >
              Let's Talk
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
          <BrandLogo size="mobile" />
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
              <span>Ask Cognivectra AI...</span>
              <div className="ai-badge-tiny">AI</div>
            </button>
          </div>

          <nav className="mobile-nav" aria-label="Mobile Navigation Links">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              <FaHome className="mobile-icon" /> Home
            </NavLink>
            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>
              <FaCogs className="mobile-icon" /> Capabilities
            </NavLink>
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
              <FaRocket className="mobile-icon" /> Products
            </NavLink>
            <NavLink to="/case-studies" onClick={() => setMobileMenuOpen(false)}>
              <LuChartBar className="mobile-icon" /> Case Studies
            </NavLink>
            <NavLink to="/industries" onClick={() => setMobileMenuOpen(false)}>
              <FaGlobe className="mobile-icon" /> Solutions
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
                trackEvent('cta_click', { cta_name: "Let's Talk", location: 'Mobile Nav' });
              }}
            >
              Let's Talk
            </NavLink>
          </div>
        </div>
      </div >
    </>
  );
}
