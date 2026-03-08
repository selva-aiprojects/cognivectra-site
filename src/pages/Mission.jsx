import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import missionVision from "../assets/mission-vision.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Mission() {
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
            <Helmet>
              <title>Mission & Vision | CogniVectra Production-Ready Innovation</title>
              <meta name="description" content="Discover CogniVectra's mission to empower organizations through high-performance technology and our vision for accessible, production-ready AI orchestration." />
            </Helmet>
            <span className="hero-badge">🎯 Mission & Vision</span>
            <h1>High-Performance Technology <br />for Modern Enterprises</h1>
            <p>
              We help enterprises build reliable, automated platforms that scale
              with confidence. Our mission is to make production-ready
              infrastructure and AI orchestration accessible to every organization.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Book Strategy Call
              </Link>
              <Link to="/#services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Mission: Empower Organizations · Vision: Production-Ready Innovation
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ paddingTop: 0 }} /* Align with the top of the text block */
          >
            <div
              className="industry-visual glass-panel"
              style={{
                background: 'transparent',
                border: 'none',
                height: 'auto',        /* Override fixed height to prevent cropping */
                minHeight: 'unset',    /* Clear global min-height */
                maxHeight: 'unset',    /* Clear global max-height */
                aspectRatio: '1 / 1'   /* Ensure square aspect ratio for the illustration */
              }}
            >
              <img
                src={missionVision}
                alt="CogniVectra Mission"
                className="w-full h-auto object-contain rounded-xl"
                style={{
                  filter: 'drop-shadow(0 10px 40px rgba(99, 102, 241, 0.4))',
                  maxHeight: '100%'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="services-modern py-24">
        <motion.h3 className="text-center mb-16" {...fadeInUp}>Our Guiding Principles</motion.h3>
        <div className="services-modern-grid">
          {[
            { icon: "🎯", title: "Business-First", desc: "We prioritize business outcomes and platform reliability over arbitrary technical complexity.", highlights: ["Strategic business outcomes", "Rapid time-to-market", "Production-ready foundations"] },
            { icon: "🔭", title: "Long-Term Thinking", desc: "We build foundations that support today's needs and tomorrow's growth.", highlights: ["Future-ready choices", "Managed technical debt", "Growth-aligned systems"] },
            { icon: "💎", title: "Excellence & Simplicity", desc: "Sophisticated solutions that remain remarkably simple to maintain.", highlights: ["Clean architecture", "Enterprise quality", "Intuitive interfaces"] },
            { icon: "🤝", title: "Partnership Approach", desc: "We work as an extension of your team. Your success is our success.", highlights: ["Collaborative solving", "Knowledge transfer", "Long-term mindset"] }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="service-icon-wrapper">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <ul className="service-highlights">
                {item.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="services-modern py-24 bg-slate-800/20">
        <motion.h3 className="text-center mb-16" {...fadeInUp}>Who We Serve</motion.h3>
        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {[
            { icon: "🚀", title: "Scaling SaaS & AI Companies", desc: "Organizations building technical products that need mission-critical infrastructure to scale without technical debt.", highlights: ["Platform maturity", "Cloud-native scaling", "Enterprise deployment"] },
            { icon: "📈", title: "Modern Enterprises", desc: "Established companies modernizing their architecture with GenAI, multi-tenancy, and high-reliability platform engineering.", highlights: ["Enterprise AI integration", "Modernization strategy", "Regulatory compliance"] }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="service-icon-wrapper">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <ul className="service-highlights">
                {item.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Ready to Build Your Enterprise Platform?</h3>
            <p className="mb-8">
              Let's discuss how we can build the production-ready foundation for
              your organization’s next phase of growth.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/contact" className="btn">
                Book Strategy Call
              </Link>
              <Link to="/careers" className="btn-outline">
                Join Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
