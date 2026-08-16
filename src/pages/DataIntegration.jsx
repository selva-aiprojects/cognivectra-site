import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuDatabase,
  LuGitMerge,
  LuClipboardCheck,
  LuServer,
  LuArrowRight
} from "react-icons/lu";
import capAdvisoryImg from "../assets/generated/cap-advisory-3d-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const services = [
  { icon: <LuGitMerge />, title: "Data Integration", desc: "Reliable data pipelines that move and transform data across systems." },
  { icon: <LuDatabase />, title: "Data Platforms", desc: "Modern data platforms, warehouses and AI-ready data foundations." },
  { icon: <LuClipboardCheck />, title: "Data Quality & MDM", desc: "Data quality, master data management and metadata management." },
  { icon: <LuServer />, title: "API & Vector Foundations", desc: "API integration and vector databases that power retrieval-based AI." }
];

export default function DataIntegration() {
  return (
    <main>
      <Helmet>
        <title>Data & Integration | Cognivectra</title>
        <meta name="description" content="Cognivectra data & integration: data integration, ETL/ELT, API integration, data quality, MDM, data platforms and vector databases for AI-ready foundations." />
      </Helmet>

      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-badge">Capability · Data & Integration</span>
            <h1>Data Foundations<br />for Intelligent Systems.</h1>
            <p>
              We build reliable data and integration foundations that support modern
              applications and AI.
            </p>
            <p style={{ fontSize: '0.95rem', opacity: 0.75 }}>
              Data Integration · ETL/ELT · API Integration · Data Quality · Data Platforms · Vector Databases
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/services" className="btn-outline">View All Capabilities</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="industry-visual glass-panel">
              <img src={capAdvisoryImg} alt="Data & Integration" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="services-modern">
        <motion.div className="section-header text-center" style={{ marginBottom: '3rem' }} {...fadeInUp}>
          <span className="hero-badge">Services</span>
          <h3>What We Deliver</h3>
        </motion.div>
        <div className="services-modern-grid">
          {services.map((s, i) => (
            <motion.div key={i} className="service-modern-card glass-panel" {...fadeInUp} transition={{ delay: i * 0.1 }}>
              <div className="service-icon-wrapper">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeInUp} style={{ marginTop: '4rem' }}>
          <h3 className="text-center" style={{ marginBottom: '1.5rem' }}>Full Service Line</h3>
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <ul className="service-highlights" style={{ columns: 2, columnGap: '3rem', paddingLeft: '1.2rem' }}>
              {[
                "Data integration",
                "ETL / ELT",
                "API integration",
                "Data migration",
                "Data quality",
                "Master data management",
                "Metadata management",
                "Data platforms",
                "Vector databases",
                "AI-ready data foundations"
              ].map((item, j) => <li key={j} style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item}</li>)}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Need reliable data foundations?</h3>
            <p className="mb-8">Let's build the data and integration layer your applications and AI depend on.</p>
            <Link to="/contact" className="btn">Talk to Cognivectra <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
