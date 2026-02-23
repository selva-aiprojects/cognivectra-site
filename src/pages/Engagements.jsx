import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import engagementModels from "../assets/generated/hero-engagements-8k.png";

export default function Engagements() {
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
            <span className="hero-badge">🤝 Flexible Partnerships</span>

            <h1>
              Engagement Models <br />
              Built for Enterprises
            </h1>

            <p>
              Modern enterprises need flexibility. Our engagement models are designed to match
              your scale, complexity, and urgency — providing high-impact technical expertise
              without long-term overhead.
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
              Complimentary consultation · Cost-effective solutions · No long-term lock-in
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={engagementModels} alt="Engagement Models" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODELS GRID */}
      <section className="services-modern">
        <h3>Our Engagement Models</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4>🚀 Enterprise Launch Pack (4–6 weeks)</h4>
            <p>
              A focused engagement to set up your mission-critical cloud, CI/CD,
              observability, and core enterprise foundations.
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
              Pay-as-you-go support for organizations that need ongoing expertise
              to maintain and evolve their production platforms.
            </p>
            <ul>
              <li>Pre-purchased hours at discounted rates</li>
              <li>Roll-over hours for up to 3 months</li>
              <li>Priority scheduling and faster response times</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4>👔 Strategic Advisory & Architecture</h4>
            <p>
              Executive-level technology leadership and architecture governance
              to align your platform with global business goals.
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
            <div className="why-pill">Scalable partner models</div>
            <div className="why-pill">No long-term lock-in</div>
            <div className="why-pill">Scale up or down anytime</div>
            <div className="why-pill">Direct access to senior architects</div>
            <div className="why-pill">Clear deliverables & milestones</div>
            <div className="why-pill">Predictable monthly engagement</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Which model fits your organization?</h3>
        <p>
          Not sure which engagement model is right for you?
          Let’s discuss your platform goals and find the perfect architectural fit.
        </p>
        <Link to="/#services" className="btn">
          Explore All Services
        </Link>
      </section>

    </main>
  );
}
