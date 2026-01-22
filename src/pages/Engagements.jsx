import { Link } from "react-router-dom";

export default function Engagements() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">🤝 Flexible Partnerships</span>

            <h1>
              Engagement Models <br />
              Built for Startups
            </h1>

            <p>
              Startups need flexibility. Our engagement models are designed to match
              your stage, budget, and urgency — without locking you into heavy,
              long-term commitments.
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
              Complimentary consultation · No long-term lock-in
            </p>
          </div>

          {/* Visual Card Instead of Image */}
          <div className="hero-visual">
            <div className="hero-glass-card">
              <ul>
                <li>Startup Launch Pack</li>
                <li>Monthly Platform Support</li>
                <li>Flexible Retainer</li>
                <li>Fractional CTO & Advisory</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* MODELS GRID */}
      <section className="services-modern">
        <h3>Our Engagement Models</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4>🚀 Startup Launch Pack (4–6 weeks)</h4>
            <p>
              A focused engagement to set up your initial cloud, CI/CD,
              observability, and a few high-impact automations.
            </p>
            <ul>
              <li>Cloud landing zone for dev, test, and prod</li>
              <li>Basic CI/CD pipelines and deployment workflows</li>
              <li>Monitoring, logging, and one end-to-end automated workflow</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🔄 Monthly Platform Support</h4>
            <p>
              Ongoing support to keep your cloud, automation, and platforms
              healthy as your product and team evolve.
            </p>
            <ul>
              <li>Reliability, performance, and cost reviews</li>
              <li>Platform improvements and new automation</li>
              <li>On-call support for critical issues</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>🤝 Flexible Retainer</h4>
            <p>
              Pay-as-you-go support for startups that need ongoing expertise
              but want to control costs and scope.
            </p>
            <ul>
              <li>Pre-purchased hours at discounted rates</li>
              <li>Roll-over hours for up to 3 months</li>
              <li>Priority scheduling and faster response times</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>👔 Fractional CTO & Advisory</h4>
            <p>
              Strategic technology leadership without the full-time executive cost.
              Perfect for non-technical founders or growing teams.
            </p>
            <ul>
              <li>Technology roadmap and architecture reviews</li>
              <li>Team mentoring and skill development</li>
              <li>Board and investor meeting preparation</li>
            </ul>
          </div>

        </div>
      </section>

      {/* VALUE BREAK */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Why Our Engagement Models Work</h3>

          <div className="why-modern-grid">
            <div className="why-pill">No long-term lock-in</div>
            <div className="why-pill">Startup-friendly pricing</div>
            <div className="why-pill">Scale up or down anytime</div>
            <div className="why-pill">Direct access to senior engineers</div>
            <div className="why-pill">Clear deliverables & milestones</div>
            <div className="why-pill">Predictable monthly costs</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Which model fits your startup?</h3>
        <p>
          Not sure which engagement model is right for you?
          Let’s discuss your goals and find the perfect fit.
        </p>
        <Link to="/contact" className="btn">
          Explore Options
        </Link>
      </section>

    </main>
  );
}
