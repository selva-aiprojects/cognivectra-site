import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";

// Images
import servicesImg from "../assets/generated/hero-services-ultra-8k.png";
import productsImg from "../assets/generated/hero-products-ultra-8k.png";
import engagementsImg from "../assets/generated/hero-engagements-8k.png";
import resultsImg from "../assets/generated/hero-results-8k.png";
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
        { label: "Cloud Foundations", path: "/services#cloud", desc: "Startup-ready landing zones & SaaS architecture." },
        { label: "Intelligent Operations", path: "/services#ops", desc: "Lean workflow orchestration & API automation." },
        { label: "SaaS & AI Blocks", path: "/services#saas", desc: "Reusable components for rapid AI integration." },
        { label: "Fractional CTO", path: "/services#cto", desc: "Strategic technology leadership & advisory." },
      ]
    },
    products: {
      section: "Products",
      image: productsImg,
      items: [
        { label: "StockSteward AI", path: "/products#steward", desc: "Algorithmic trading & market intelligence." },
        { label: "StoreAI", path: "/products#storeai", desc: "Transformative retail management analytics." },
        { label: "MedFlow EMR", path: "/products#emr", desc: "Multi-tenant EMR live at Kidz-Clinic." },
        { label: "OmniCore (Beta)", path: "/products#omnicore", desc: "Unified enterprise AI orchestration engine." },
        { label: "VectraFlow", path: "/products#vectraflow", desc: "Intelligent document processing workflows." },
      ]
    },
    engagements: {
      section: "Engagements",
      image: engagementsImg,
      items: [
        { label: "Startup Launch Pack", path: "/engagements#launch", desc: "Guided 4-6 week cloud & automation setup." },
        { label: "Monthly Platform Support", path: "/engagements#support", desc: "Ongoing reliability & performance management." },
        { label: "Flexible Retainer", path: "/engagements#retainer", desc: "Pay-as-you-go expertise for growing teams." },
        { label: "Fractional Advisory", path: "/engagements#advisory", desc: "Board-level strategic tech guidance." },
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
        { label: "Who We Are", path: "/who-we-are", desc: "Discover our mission & startup-focused approach." },
        { label: "Our Leadership", path: "/leadership", desc: "Meet the experts steering our technical vision." },
        { label: "Insights & Blog", path: "/blog", desc: "Technical deep-dives & industry perspectives." },
        { label: "Join Our Team", path: "/careers", desc: "Build the future of AI technology with us." },
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

            <div
              className="nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter('results')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/results" className={`nav-link-with-arrow ${activeMenu === 'results' ? 'active-dropdown' : ''}`}>
                Results
              </NavLink>
              <MegaMenu
                isOpen={activeMenu === 'results'}
                {...menuData.results}
                onClose={() => setActiveMenu(null)}
              />
            </div>

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
