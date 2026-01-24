import { Link } from "react-router-dom";

export default function Services() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">⚙️ Startup-Grade Engineering</span>

            <h1>
              Services Built for <br />
              Speed, Scale & Stability
            </h1>

            <p>
              CogniVectra delivers modular, enterprise-grade services that help
              startups build intelligent platforms, automate operations, and
              scale without technical debt.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Book Strategy Call
              </Link>
              <Link to="/engagements" className="btn-outline">
                View Engagement Models
              </Link>
            </div>

            <p className="hero-subtext">
              Flexible delivery · Cost-effective solutions · Senior engineers only
            </p>
          </div>

          {/* No image dependency — premium glass card instead */}
          <div className="hero-visual">
            <img
              src="/hero_tech_services.png"
              alt="Cloud Infrastructure & Services"
              className="hero-image-modern"
            />
          </div>

        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="services-modern">
        <h3>Our Core Services</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4>☁️ Cloud Architecture</h4>
            <p>
              Scalable, secure cloud foundations on AWS, GCP, or Azure.
            </p>
            <ul>
              <li>Landing zones & environment strategy</li>
              <li>Infrastructure as Code (Terraform)</li>
              <li>High-availability architecture</li>
              <li>Security & compliance baseline</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🚀 DevOps & Platform Engineering</h4>
            <p>
              CI/CD pipelines, reliability engineering, and platform automation.
            </p>
            <ul>
              <li>CI/CD pipelines (GitHub, GitLab, Bitbucket)</li>
              <li>Monitoring, logging & observability</li>
              <li>Release automation</li>
              <li>Performance optimization</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🤖 AI & Workflow Automation</h4>
            <p>
              GenAI-powered automations across business and engineering.
            </p>
            <ul>
              <li>AI workflow orchestration</li>
              <li>Internal tools & bots</li>
              <li>Customer support automation</li>
              <li>Operations & finance automation</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🏗 SaaS Foundations</h4>
            <p>
              Production-ready components for modern SaaS products.
            </p>
            <ul>
              <li>Authentication & authorization</li>
              <li>Billing & subscription systems</li>
              <li>Notifications & messaging</li>
              <li>API design & data modeling</li>
            </ul>
          </div>

        </div>
      </section>

      {/* WHY US */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Why Startups Choose CogniVectra</h3>

          <div className="why-modern-grid">
            <div className="why-pill">Senior engineers only</div>
            <div className="why-pill">Startup-speed execution</div>
            <div className="why-pill">AI-first mindset</div>
            <div className="why-pill">Cloud-native by default</div>
            <div className="why-pill">Security built in</div>
            <div className="why-pill">No vendor lock-in</div>
          </div>
        </div>
      </section>

      {/* DELIVERY PROCESS */}
      <section className="services-modern">
        <h3>How We Work</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4>1. Discover</h4>
            <p>
              Deep dive into your product, architecture, goals, and constraints.
            </p>
          </div>

          <div className="service-modern-card">
            <h4>2. Design</h4>
            <p>
              Define architecture, automation strategy, and delivery roadmap.
            </p>
          </div>

          <div className="service-modern-card">
            <h4>3. Build</h4>
            <p>
              Implement infrastructure, pipelines, and workflows.
            </p>
          </div>

          <div className="service-modern-card">
            <h4>4. Scale</h4>
            <p>
              Optimize performance, costs, and reliability as you grow.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Ready to build your startup foundation?</h3>
        <p>
          Book a free strategy session and get a 90-day execution plan.
        </p>
        <Link to="/contact" className="btn">
          Start Free Strategy Call
        </Link>
      </section>

    </main>
  );
}
