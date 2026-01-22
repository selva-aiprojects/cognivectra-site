import { Link } from "react-router-dom";

/* High-resolution illustrations */
import aboutHero from "../assets/illustrations/mission-vision.png";
import cloudImage from "../assets/illustrations/industries-saas.svg";
import automationImage from "../assets/illustrations/industries-fintech.svg";
import aiImage from "../assets/illustrations/industries-healthcare.svg";
import advisoryImage from "../assets/illustrations/industries-edtech.svg";

export default function WhoWeAre() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">👥 About CogniVectra</span>

            <h1>
              Startup-Focused <br />
              Technology Partners
            </h1>

            <p>
              CogniVectra Innovations is a startup-focused technology partner
              specializing in automation, cloud foundations, and SaaS building
              blocks that enable founders to move fast without compromising
              reliability.
            </p>

            <p>
              We operate at the intersection of systems engineering, cloud,
              data, and applied intelligence — helping startups modernize
              operations, streamline workflows, and build future-ready
              digital platforms investors and customers can trust.
            </p>

            <p>
              Our approach is pragmatic and outcome-driven: design lean,
              robust foundations, automate what slows you down, and keep
              your technology stack understandable as you scale.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Talk to Us
              </Link>
              <Link to="/services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext">
              Pragmatic · Sustainable · Built for startups
            </p>
          </div>

          {/* Visual */}
          <div className="hero-visual">
            <div className="hero-glass-card hero-visual-image">
              <img
                src={aboutHero}
                alt="Startup-focused engineering expertise"
              />
            </div>
          </div>

        </div>
      </section>

      {/* VALUES + APPROACH */}
      <section className="services-modern">
        <h3>What Guides Our Work</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4>💎 What We Value</h4>
            <ul>
              <li>Integrity in advice, estimates, and delivery</li>
              <li>Consistency in architecture and operations</li>
              <li>Community ownership and team knowledge sharing</li>
              <li>Outcome-driven innovation, not hype</li>
              <li>Pragmatic leadership balancing speed, cost, and risk</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🎯 Our Approach</h4>
            <p>
              We start with your business model, customers, and runway — then
              design automation and cloud foundations that match your current
              stage and future growth.
            </p>
            <p>
              Every engagement blends architecture, hands-on implementation,
              and mentoring for your in-house team, so you are never locked
              into a black-box platform.
            </p>
            <div className="highlight-pill">
              Pragmatic. Sustainable. Built for startups.
            </div>
          </div>

        </div>
      </section>

      {/* OFFERINGS */}
      <section className="services-modern">
        <h3>What We Do</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={cloudImage} alt="Cloud foundations" className="industry-icon" />
              <h4>Cloud & Platform Foundations</h4>
            </div>
            <ul>
              <li>Startup-ready cloud landing zones</li>
              <li>Cloud-native and hybrid SaaS architecture</li>
              <li>Multi-environment setups with security baked in</li>
              <li>Data, automation, and observability integration</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={automationImage} alt="Automation" className="industry-icon" />
              <h4>Intelligent Operations & Automation</h4>
            </div>
            <ul>
              <li>Lean business & IT operations optimization</li>
              <li>Workflow orchestration & event-driven automation</li>
              <li>No-code, low-code, and API-based automation</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={aiImage} alt="Applied AI" className="industry-icon" />
              <h4>SaaS & Applied Intelligence</h4>
            </div>
            <ul>
              <li>Reusable SaaS components (auth, billing, notifications)</li>
              <li>Practical AI embedded into products and operations</li>
              <li>Human-in-the-loop automation patterns</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={advisoryImage} alt="Advisory" className="industry-icon" />
              <h4>Advisory & Fractional Leadership</h4>
            </div>
            <ul>
              <li>Technology strategy and runway-aware roadmaps</li>
              <li>Architecture reviews & modernization planning</li>
              <li>Fractional CTO and board-level advisory</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Build Your Platform with Confidence</h3>
        <p>
          Whether you are launching, scaling, or modernizing,
          we help you build technology foundations that last.
        </p>
        <Link to="/contact" className="btn">
          Start the Conversation
        </Link>
      </section>

    </main>
  );
}
