import { Link } from "react-router-dom";
import heroImage from "../assets/home-hero-automation.png";

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">⚡ Startup-Grade Engineering</span>

            <h1>
              Build Faster. <br />
              Scale Smarter. <br />
              Automate Everything.
            </h1>

            <p>
              CogniVectra helps startups and scaleups design resilient cloud platforms,
              automate workflows with AI, and execute technology strategy without enterprise drag.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Book Strategy Call
              </Link>
              <Link to="/services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext">
              Complimentary consultation · Direct engagement with our Principal Architect
            </p>
          </div>

          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Startup Platform Architecture"
              className="hero-image"
            />
          </div>

        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-modern">
        <div className="trust-modern-inner">
          <div><strong>25+</strong>Years Experience</div>
          <div><strong>40+</strong>Platforms Built</div>
          <div><strong>12+</strong>Countries Served</div>
          <div><strong>99.9%</strong>System Reliability</div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-modern">
        <h3>What We Do</h3>

        <div className="services-modern-grid">
          <div className="service-modern-card">
            <h4>Fractional CTO</h4>
            <p>Executive-level technical leadership without full-time cost.</p>
          </div>

          <div className="service-modern-card">
            <h4>DevOps Automation</h4>
            <p>Cloud infrastructure, CI/CD pipelines, and reliability engineering.</p>
          </div>

          <div className="service-modern-card">
            <h4>AI Orchestration</h4>
            <p>GenAI-powered workflow automation and intelligent systems.</p>
          </div>

          <div className="service-modern-card">
            <h4>SaaS Foundations</h4>
            <p>Scalable, secure, and cloud-native product platforms.</p>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Why CogniVectra</h3>

          <div className="why-modern-grid">
            <div className="why-pill">Enterprise architecture discipline</div>
            <div className="why-pill">Startup-speed execution</div>
            <div className="why-pill">AI-first automation mindset</div>
            <div className="why-pill">Cloud-native by default</div>
            <div className="why-pill">Security & compliance built in</div>
            <div className="why-pill">Battle-tested delivery frameworks</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Ready to accelerate your product roadmap?</h3>
        <p>
          Get a 90-day execution plan in a free strategy session.
        </p>
        <Link to="/contact" className="btn">
          Start Free Strategy Call
        </Link>
      </section>

    </main>
  );
}
