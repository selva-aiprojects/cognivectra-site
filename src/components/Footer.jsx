import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

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
              Talk to an Expert →
            </Link>
          </div>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/who-we-are">Who We Are</Link></li>
            <li><Link to="/mission">Mission</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/engagements">Engagements</Link></li>
            <li><Link to="/industries">Industries</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact">
            <div>
              <span>Email</span><br />
              <a href="mailto:Care@cognivectra.com">
                Care@cognivectra.com
              </a>
            </div>
            <div>
              <span>WhatsApp</span><br />
              <a href="https://wa.me/918825492600">
                +91 8825492600
              </a>
            </div>

            <div className="footer-social">
              <a href="https://www.linkedin.com/company/cognivectra-innovations-solutions/" aria-label="LinkedIn">
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
