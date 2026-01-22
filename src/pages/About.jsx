import { Link } from "react-router-dom";
import aboutHero from "../assets/illustrations/about-expertise.svg";

export default function About() {
  return (
    <section className="section ai-neutral">
      <div className="container">

        {/* HERO */}
        <div className="card hero-card about-hero">
          <div className="hero-copy">
            <span className="hero-badge">About CogniVectra</span>
            <h2>Building Foundations for Modern Startups</h2>

            <p className="stack lead">
              We are a team of experienced engineers and platform specialists
              helping startups build reliable, scalable foundations without
              the overhead of large teams.
            </p>

            <p className="stack">
              We combine deep technical expertise with practical business
              understanding to deliver solutions that truly matter for your
              startup’s long-term success.
            </p>
          </div>

          <div className="hero-visual-image">
            <img
              src={aboutHero}
              alt="CogniVectra expertise and platform engineering"
              className="hero-image"
            />
          </div>
        </div>

        {/* VISUAL BREAK */}
        <div className="highlight-pill">
          💡 Deep Technical Expertise · Practical Business Impact · Startup Speed
        </div>

        {/* EXPERTISE GRID */}
        <div className="grid2 about-expertise">
          <section className="card">
            <div className="industry-header">
              <span className="emoji">🏗️</span>
              <h3>Platform Engineering</h3>
            </div>

            <p className="stack">
              We design and build the foundational platforms that power modern
              SaaS applications — from authentication to billing and beyond.
            </p>

            <ul className="stack">
              <li>Multi-tenant architecture design</li>
              <li>Scalable data models and APIs</li>
              <li>Performance optimization and monitoring</li>
            </ul>
          </section>

          <section className="card">
            <div className="industry-header">
              <span className="emoji">☁️</span>
              <h3>Cloud Infrastructure</h3>
            </div>

            <p className="stack">
              We help you navigate cloud complexity while keeping your
              infrastructure secure, cost-efficient, and scalable.
            </p>

            <ul className="stack">
              <li>Multi-cloud and hybrid strategies</li>
              <li>Security and compliance frameworks</li>
              <li>Cost optimization and governance</li>
            </ul>
          </section>
        </div>

        <div className="grid2 about-expertise">
          <section className="card">
            <div className="industry-header">
              <span className="emoji">🤖</span>
              <h3>Process Automation</h3>
            </div>

            <p className="stack">
              We automate repetitive workflows, freeing your team to focus
              on building great products and serving customers.
            </p>

            <ul className="stack">
              <li>No-code and low-code solutions</li>
              <li>API integrations and data pipelines</li>
              <li>Workflow orchestration and monitoring</li>
            </ul>
          </section>

          <section className="card">
            <div className="industry-header">
              <span className="emoji">📊</span>
              <h3>Data & Analytics</h3>
            </div>

            <p className="stack">
              We help you make data-driven decisions with robust analytics
              platforms and real-time business insights.
            </p>

            <ul className="stack">
              <li>Data warehouse and pipeline design</li>
              <li>Real-time analytics and dashboards</li>
              <li>Business intelligence and reporting</li>
            </ul>
          </section>
        </div>

        {/* VALUES */}
        <div className="card about-values">
          <div className="industry-header">
            <span className="emoji">🌟</span>
            <h3>Our Values</h3>
          </div>

          <div className="grid2 values-grid">
            <div>
              <h4>🎯 Excellence</h4>
              <p>Enterprise-grade quality with startup speed and agility.</p>
            </div>

            <div>
              <h4>🤝 Partnership</h4>
              <p>We work as an extension of your team, not just consultants.</p>
            </div>

            <div>
              <h4>🚀 Innovation</h4>
              <p>Cutting-edge solutions for unique business challenges.</p>
            </div>

            <div>
              <h4>💎 Simplicity</h4>
              <p>We make complex technology simple and accessible.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card cta-card">
          <h3>Let’s Build Something Amazing Together</h3>

          <p className="stack lead">
            Ready to discuss how we can help you build the technical foundation
            for your startup’s success?
          </p>

          <Link to="/contact" className="btn">
            Get in Touch →
          </Link>
        </div>

      </div>
    </section>
  );
}
