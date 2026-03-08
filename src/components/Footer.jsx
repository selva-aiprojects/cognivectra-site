import { Link } from "react-router-dom";
import { FaEnvelope, FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "/cognivectra-dark-crop.png";
import { trackEvent } from "../lib/analytics";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand Column */}
        <div className="footer-brand">
          <img src={logo} alt="CogniVectra Logo" className="footer-logo" />
          <p className="footer-tagline">
            Enterprise-grade cloud, automation, and platform foundations
            for startups that need to scale with confidence.
          </p>
          <div className="footer-cta">
            <a
              href="https://calendly.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Footer' })}
            >
              Book Strategy Call →
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/who-we-are">Who We Are</Link></li>
            <li><Link to="/leadership">Leadership</Link></li>
            <li><Link to="/mission">Mission</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li>
              <Link to="/careers" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Careers <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: '700' }}>• 1 Open Role</span>
              </Link>
            </li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>

        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/engagements">Engagements</Link></li>
            <li><Link to="/industries">Industries</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
          © {new Date().getFullYear()} CogniVectra Innovations. All rights reserved.
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
