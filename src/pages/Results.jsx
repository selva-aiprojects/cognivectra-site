import { Link } from "react-router-dom";

export default function Results() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">📈 Proven Outcomes</span>

            <h1>
              Results & <br />
              Case Snapshots
            </h1>

            <p>
              CogniVectra helps startups move from fragile setups to
              reliable, automated platforms. Here are examples of the
              tangible impact we deliver.
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
              Faster releases · AI enablement · Automation wins
            </p>
          </div>

          {/* Visual Card Instead of Image */}
          <div className="hero-visual">
            <img
              src="/hero_results.png"
              alt="Measurable Results & Outcomes"
              className="hero-image-modern"
            />
          </div>

        </div>
      </section>

      {/* CASE STUDIES GRID */}
      <section className="services-modern">
        <h3>Case Snapshots</h3>

        <div className="services-modern-grid">

          {/* CASE 1 */}
          <div className="service-modern-card">
            <h4>🚀 SaaS Startup — Faster Releases</h4>
            <p>
              A B2B SaaS startup was deploying manually with frequent
              production issues and slow release cycles.
            </p>
            <ul>
              <li>Implemented CI/CD pipelines and environment strategy</li>
              <li>Added automated smoke checks and alerting</li>
              <li>Documented a lightweight release process</li>
            </ul>
            <div className="result-highlight">
              <strong>Outcome:</strong> Release lead time reduced from
              weeks to a few days, with fewer production surprises.
            </div>
          </div>

          {/* CASE 2 */}
          <div className="service-modern-card">
            <h4>🤖 AI-Native Startup — Cloud Stability</h4>
            <p>
              An AI-native startup was scaling experiments fast but had
              rising cloud costs and unstable environments.
            </p>
            <ul>
              <li>Redesigned environments and governance</li>
              <li>Introduced cost tagging and spend dashboards</li>
              <li>Added service guardrails</li>
            </ul>
            <div className="result-highlight">
              <strong>Outcome:</strong> Predictable cloud spend and
              improved stability with fewer mystery cost spikes.
            </div>
          </div>

          {/* CASE 3 */}
          <div className="service-modern-card">
            <h4>💼 Non-Tech Founder — Operations Automation</h4>
            <p>
              A non-technical founder was managing onboarding,
              invoicing, and support manually across tools.
            </p>
            <ul>
              <li>Mapped workflows across sales, onboarding, and billing</li>
              <li>Implemented no-code automations</li>
              <li>Added reporting for throughput visibility</li>
            </ul>
            <div className="result-highlight">
              <strong>Outcome:</strong> Fewer manual handoffs, reduced
              errors, and more founder time for customers.
            </div>
          </div>

        </div>
      </section>

      {/* VALUE BREAK */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Measurable Impact</h3>

          <div className="why-modern-grid">
            <div className="why-pill">Faster time-to-market</div>
            <div className="why-pill">Lower cloud costs</div>
            <div className="why-pill">Higher platform reliability</div>
            <div className="why-pill">Reduced operational overhead</div>
            <div className="why-pill">Improved developer velocity</div>
            <div className="why-pill">Founder time saved</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Want similar outcomes for your startup?</h3>
        <p>
          Share your current platform and we will suggest the smallest
          useful starting point — Launch Pack, automation sprint, or advisory.
        </p>
        <Link to="/contact" className="btn">
          Talk to Us
        </Link>
      </section>

    </main>
  );
}
