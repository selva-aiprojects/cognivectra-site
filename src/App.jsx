import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Mission from "./pages/Mission.jsx";
import WhoWeAre from "./pages/WhoWeAre.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Services from "./pages/Services.jsx";
import Engagements from "./pages/Engagements.jsx";
import Results from "./pages/Results.jsx";
import Industries from "./pages/Industries.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import "./index.css";

export default function App() {
  return (
    <div className="appShell">
      <div className="ambient-glow" />
      <Navbar />

      {/* Main Content */}
      <main style={{ minHeight: "80vh" }}>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/engagements" element={<Engagements />} />
            <Route path="/results" element={<Results />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
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
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/engagements">Engagements</a>
                </li>
                <li>
                  <a href="/industries">Industries</a>
                </li>
                <li>
                  <a href="/who-we-are">Who We Are</a>
                </li>
                <li>
                  <a href="/mission">Mission</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Cognivectra Innovations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
