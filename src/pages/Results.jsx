import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import resultsHero from "../assets/generated/hero-results-8k.png";

export default function Results() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">📈 Proven Outcomes</span>

            <h1>
              Results & <br />
              Case Snapshots
            </h1>

            <p>
              CogniVectra helps organizations transition from legacy systems to
              high-performance, automated platforms. Here are examples of the
              tangible impact we deliver at scale.
            </p>

            <div className="hero-cta">
              <button onClick={() => { }} className="btn">
                Request Demo
              </button>
              <Link to="/#services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Faster releases · AI enablement · Automation wins
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={resultsHero} alt="Results & Case Snapshots" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CASE STUDIES GRID */}
      <section className="services-modern">
        <h3>Case Snapshots</h3>

        <div className="services-modern-grid">

          {/* CASE 1 */}
          <div className="service-modern-card">
            <h4>🚀 Enterprise SaaS — Rapid Deployment</h4>
            <p>
              A multi-tenant SaaS provider was struggling with manual
              deployments and inconsistent environment stability across global regions.
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
            <h4>🤖 Healthcare AI — Platform Scalability</h4>
            <p>
              A healthcare platform provider was scaling AI-assisted diagnostics
              but required enhanced data governance and security hardening.
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
            <h4>💼 Enterprise Operations — Intelligent Automation</h4>
            <p>
              A large-scale organization needed to automate complex clinical
              and administrative workflows to improve physician efficiency.
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
            <div className="why-pill">Optimized cloud governance</div>
            <div className="why-pill">Enterprise platform reliability</div>
            <div className="why-pill">Reduced operational overhead</div>
            <div className="why-pill">Improved engineering velocity</div>
            <div className="why-pill">Strategic resource efficiency</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Want similar outcomes for your organization?</h3>
        <p>
          Share your platform goals and we will suggest the most
          effective architectural strategy — Enterprise Launch Pack,
          AI integration, or strategic advisory.
        </p>
        <Link to="/contact" className="btn">
          Start Your Free Strategy Session
        </Link>
      </section>

    </main>
  );
}
