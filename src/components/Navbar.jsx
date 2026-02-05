import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";

// Images
import servicesImg from "../assets/generated/hero-services-ultra-8k.png";
import productsImg from "../assets/generated/hero-products-ultra-8k.png";
import engagementsImg from "../assets/generated/hero-engagements-8k.png";
import industriesImg from "../assets/generated/hero-industries-ultra-8k.png";
import aboutImg from "../assets/generated/hero-whoweare-ultra-8k.png";

const logo = "/cognivectra-dark-crop.png";

export default function SimpleNavbar({ setIsChatOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location]);

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

  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  const menuData = {
    services: {
      section: "Services",
      image: servicesImg,
      items: [
        { label: "Cloud Foundations", path: "/services#cloud" },
        { label: "Intelligent Operations", path: "/services#ops" },
        { label: "SaaS & AI Blocks", path: "/services#saas" },
        { label: "Fractional CTO", path: "/services#cto" },
      ]
    },
    products: {
      section: "Products",
      image: productsImg,
      items: [
        { label: "StockSteward AI", path: "/products#steward" },
        { label: "StoreAI", path: "/products#storeai" },
        { label: "OmniCore (Beta)", path: "/products#omnicore" },
        { label: "VectraFlow", path: "/products#vectraflow" },
      ]
    },
    engagements: {
      section: "Engagements",
      image: engagementsImg,
      items: [
        { label: "Startup Launch Pack", path: "/engagements#launch" },
        { label: "Monthly Platform Support", path: "/engagements#support" },
        { label: "Flexible Retainer", path: "/engagements#retainer" },
        { label: "Fractional Advisory", path: "/engagements#advisory" },
      ]
    },
    industries: {
      section: "Industries",
      image: industriesImg,
      items: [
        { label: "Fintech", path: "/industries#fintech" },
        { label: "E-commerce", path: "/industries#ecommerce" },
        { label: "Healthtech", path: "/industries#healthtech" },
        { label: "Logistics & Supply Chain", path: "/industries#logistics" },
      ]
    },
    about: {
      section: "Company",
      image: aboutImg,
      items: [
        { label: "Who We Are", path: "/who-we-are" },
        { label: "Our Leadership", path: "/leadership" },
        { label: "Insights & Blog", path: "/blog" },
        { label: "Join Our Team", path: "/careers" },
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
            <img src={logo} alt="CogniVectra Logo" className="brand-logo" style={{ height: '32px', width: 'auto' }} />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="links desktop-links" aria-label="Desktop Navigation">
            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/services" className={`nav-link-with-arrow ${activeMenu === 'services' ? 'active-dropdown' : ''}`}>
                Services
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'services'}
                {...menuData.services}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/products" className={`nav-link-with-arrow ${activeMenu === 'products' ? 'active-dropdown' : ''}`}>
                Products
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'products'}
                {...menuData.products}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('engagements')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/engagements" className={`nav-link-with-arrow ${activeMenu === 'engagements' ? 'active-dropdown' : ''}`}>
                Engagements
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'engagements'}
                {...menuData.engagements}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <NavLink to="/results">Results</NavLink>

            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('industries')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/industries" className={`nav-link-with-arrow ${activeMenu === 'industries' ? 'active-dropdown' : ''}`}>
                Industries
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'industries'}
                {...menuData.industries}
                onClose={() => setActiveMenu(null)}
              />
            </div>

            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/who-we-are" className={`nav-link-with-arrow ${activeMenu === 'about' ? 'active-dropdown' : ''}`}>
                About
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'about'}
                {...menuData.about}
                onClose={() => setActiveMenu(null)}
              />
            </div>

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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
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
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
            <NavLink to="/engagements" onClick={() => setMobileMenuOpen(false)}>Engagements</NavLink>
            <NavLink to="/results" onClick={() => setMobileMenuOpen(false)}>Results</NavLink>
            <NavLink to="/industries" onClick={() => setMobileMenuOpen(false)}>Industries</NavLink>
            <NavLink to="/who-we-are" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
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
