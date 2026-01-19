import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Cognivectra</h3>
            <p>Enterprise intelligence and automation for startups.</p>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>
              <a href="mailto:selvakumar.b@cognivectra.com">
                selvakumar.b@cognivectra.com
              </a>
            </p>
            <p>
              <a href="tel:+918825492600">+91 8825492600</a>
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/engagements">Engagements</Link>
              </li>
              <li>
                <Link to="/industries">Industries</Link>
              </li>
              <li>
                <Link to="/who-we-are">Who We Are</Link>
              </li>
              <li>
                <Link to="/mission">Mission</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cognivectra Innovations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
