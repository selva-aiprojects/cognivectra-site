import { Link } from "react-router-dom";
import { FaEnvelope, FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { trackEvent } from "../lib/analytics";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand Column */}
        <div className="footer-brand" style={{ flex: '1.5' }}>
          <Link to="/" className="brand" style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 0, gap: '0.8rem' }}>
            <BrandLogo size="footer" />
            <span className="brand-tagline" style={{ fontSize: '0.7rem', display: 'block', maxWidth: '280px' }}>
              AI-Native Technology. Built for Business.
            </span>
          </Link>
          <p className="footer-tagline" style={{ marginTop: '1.25rem', maxWidth: '280px', fontSize: '0.85rem' }}>
            Cognivectra is an AI-native technology and product engineering
            company that designs, builds and evolves software platforms.
          </p>
          <div className="footer-cta">
            <Link
              to="/contact"
              className="btn"
              onClick={() => trackEvent('cta_click', { cta_name: "Let's Talk", location: 'Footer' })}
            >
              Let's Talk →
            </Link>
          </div>
        </div>

        {/* Capabilities */}
        <div className="footer-col">
          <h4>Capabilities</h4>
          <ul className="footer-links">
            <li><Link to="/ai-engineering">AI Engineering</Link></li>
            <li><Link to="/cloud-platform-engineering">Cloud & Platform Engineering</Link></li>
            <li><Link to="/product-engineering">Product Engineering</Link></li>
            <li><Link to="/data-integration">Data & Integration</Link></li>
            <li><Link to="/services">All Capabilities</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div className="footer-col">
          <h4>Products</h4>
          <ul className="footer-links">
            <li><Link to="/products/healthezee">Healthezee</Link></li>
            <li><Link to="/products/medflow">MediFlow</Link></li>
            <li><Link to="/products/stocksteward">StockSteward</Link></li>
            <li><Link to="/products/storeai">StoreAI</Link></li>
            <li><Link to="/products/eduportal">EduPortal</Link></li>
            <li><Link to="/products">Full Portfolio</Link></li>
          </ul>
        </div>

        {/* Solutions */}
        <div className="footer-col">
          <h4>Solutions</h4>
          <ul className="footer-links">
            <li><Link to="/industries#healthcare">Healthcare</Link></li>
            <li><Link to="/industries#hr-talent">HR & Talent</Link></li>
            <li><Link to="/industries#hospitality">Hospitality</Link></li>
            <li><Link to="/industries#bfsi-fintech">BFSI & FinTech</Link></li>
            <li><Link to="/industries#retail-commerce">Retail & Commerce</Link></li>
            <li><Link to="/industries">All Solutions</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/who-we-are">Who We Are</Link></li>
            <li><Link to="/leadership">Leadership</Link></li>
            <li><Link to="/case-studies">Case Studies</Link></li>
            <li><Link to="/engagements">Engagements</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <FaEnvelope style={{ color: 'var(--accent-light)', fontSize: '1.1rem', opacity: 0.8 }} />
              <a href="mailto:info@cognivectra.com" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                info@cognivectra.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <FaWhatsapp style={{ color: '#25D366', fontSize: '1.1rem', opacity: 0.8 }} />
              <a href="https://wa.me/918825492600" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                +91 8825492600
              </a>
            </div>

            <div className="footer-social">
              <a href="https://www.linkedin.com/company/cognivectra-innovations-solutions/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61582266623883" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="https://x.com/cognivectra" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Cognivectra Innovations. All rights reserved.
        </div>
        <div className="footer-legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
