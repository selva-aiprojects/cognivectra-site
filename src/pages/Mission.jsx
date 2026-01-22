import { Link } from "react-router-dom";
import missionHero from "../assets/mission-vision.png";

export default function Mission() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">🎯 Mission & Vision</span>

            <h1>
              Empowering Founders <br />
              Through Frictionless Technology
            </h1>

            <p>
              We help startups build reliable, automated platforms that scale
              with confidence. Our mission is to make enterprise-grade
              infrastructure accessible to every founder.
            </p>

            <p>
              Our vision is a world where technology enables innovation without
              friction — invisible foundations that support bold ideas.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Start a Conversation
              </Link>
              <Link to="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>

            <p className="hero-subtext">
              Mission: Empower Founders · Vision: Frictionless Innovation · Values: Excellence & Simplicity
            </p>
          </div>

          {/* Visual */}
          <div className="hero-visual">
            <img
              src={missionHero}
              alt="Mission and vision: empowering founders with frictionless innovation"
              className="hero-image"
            />
          </div>

        </div>
      </section>

      {/* VALUE BREAK */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Enabling Innovation at Scale</h3>

          <p>
            We believe great technology should be invisible — allowing founders
            to focus on what matters most: building amazing products and serving
            their customers.
          </p>

          <div className="why-modern-grid">
            <div className="why-pill">Founder-first thinking</div>
            <div className="why-pill">Long-term architecture</div>
            <div className="why-pill">Enterprise-grade reliability</div>
            <div className="why-pill">Startup speed</div>
            <div className="why-pill">Human-centered automation</div>
            <div className="why-pill">Sustainable growth</div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="services-modern">
        <h3>Our Guiding Principles</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <span className="service-icon">🎯</span>
            <h4>Founder-First</h4>
            <p>
              We prioritize founder needs and business outcomes over technical
              complexity. Everything we build is designed to accelerate growth.
            </p>
            <ul>
              <li>Business outcomes over complexity</li>
              <li>Rapid time-to-value</li>
              <li>Scalable from day one</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <span className="service-icon">🔭</span>
            <h4>Long-Term Thinking</h4>
            <p>
              We build foundations that support today’s needs and tomorrow’s
              growth through future-proof architecture.
            </p>
            <ul>
              <li>Future-ready technology choices</li>
              <li>Managed technical debt</li>
              <li>Growth-aligned systems</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <span className="service-icon">💎</span>
            <h4>Excellence & Simplicity</h4>
            <p>
              We deliver sophisticated solutions that remain remarkably simple
              to use and maintain.
            </p>
            <ul>
              <li>Clean architecture</li>
              <li>Enterprise-grade quality</li>
              <li>Intuitive UX</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <span className="service-icon">🤝</span>
            <h4>Partnership Approach</h4>
            <p>
              We work as an extension of your team. Your success becomes our
              success.
            </p>
            <ul>
              <li>Collaborative problem-solving</li>
              <li>Knowledge transfer</li>
              <li>Long-term mindset</li>
            </ul>
          </div>

        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="services-modern">
        <h3>Who We Serve</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <span className="service-icon">🚀</span>
            <h4>Pre-Seed to Seed</h4>
            <p>
              Founders building their first product and teams needing MVP
              infrastructure to reach customers faster.
            </p>
            <ul>
              <li>First product launches</li>
              <li>MVP infrastructure</li>
              <li>Early customer readiness</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <span className="service-icon">📈</span>
            <h4>Series A to B</h4>
            <p>
              Scaling teams and platforms that need stronger reliability,
              performance, and enterprise readiness.
            </p>
            <ul>
              <li>Platform scalability</li>
              <li>Reliability improvements</li>
              <li>Enterprise readiness</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Ready to Build Your Foundation?</h3>
        <p>
          Let’s discuss how we can help you build the technical foundation for
          your next stage of growth.
        </p>
        <Link to="/contact" className="btn">
          Start the Conversation
        </Link>
      </section>

    </main>
  );
}
