import { Link } from "react-router-dom";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import logo from "/cognivectra-dark-crop.png";

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
            <Link to="/contact" className="btn">
              Book Strategy Call →
            </Link>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <FaEnvelope style={{ color: 'var(--accent-light)', fontSize: '1rem', opacity: 0.8 }} />
              <div>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.4, fontWeight: '700', letterSpacing: '0.05em' }}>Email</span><br />
                <a href="mailto:info@cognivectra.com" style={{ fontSize: '0.85rem' }}>
                  info@cognivectra.com
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <FaWhatsapp style={{ color: '#25D366', fontSize: '1rem', opacity: 0.8 }} />
              <div>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.4, fontWeight: '700', letterSpacing: '0.05em' }}>WhatsApp</span><br />
                <a href="https://wa.me/918825492600" style={{ fontSize: '0.85rem' }}>
                  +91 8825492600
                </a>
              </div>
            </div>

            <div className="footer-social">
              <a href="https://www.linkedin.com/company/cognivectra-innovations-solutions/?viewAsMember=true" aria-label="LinkedIn">
                in
              </a>
              <a href="#" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" aria-label="GitHub">
                GH
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
