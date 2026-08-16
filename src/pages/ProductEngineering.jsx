import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuRocket,
  LuPalette,
  LuAppWindow,
  LuLayers,
  LuArrowRight
} from "react-icons/lu";
import capOpsImg from "../assets/generated/cap-ops-3d-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const services = [
  { icon: <LuRocket />, title: "Product Discovery & Architecture", desc: "Turn business ideas into defined product strategies, architecture and roadmaps." },
  { icon: <LuPalette />, title: "UX/UI Engineering", desc: "Product experiences and workflows designed for real users and real operations." },
  { icon: <LuAppWindow />, title: "SaaS & API Platforms", desc: "Multi-tenant SaaS development, API platforms and enterprise applications." },
  { icon: <LuLayers />, title: "Modernization & Support", desc: "Application modernization, product enhancement and production support." }
];

export default function ProductEngineering() {
  return (
    <main>
      <Helmet>
        <title>Product Engineering | Cognivectra</title>
        <meta name="description" content="Cognivectra product engineering: product discovery, UX/UI engineering, SaaS development, enterprise applications, API platforms and multi-tenant SaaS." />
      </Helmet>

      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-badge">Capability · Product Engineering</span>
            <h1>From Concept<br />to Scalable Product.</h1>
            <p>
              We turn business ideas into modern SaaS platforms and enterprise applications.
            </p>
            <p style={{ fontSize: '0.95rem', opacity: 0.75 }}>
              Product Discovery · SaaS Development · Enterprise Applications · API Platforms · Multi-tenant SaaS
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/services" className="btn-outline">View All Capabilities</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="industry-visual glass-panel">
              <img src={capOpsImg} alt="Product Engineering" className="w-full h-full object-cover rounded-xl" />
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
                "Product discovery",
                "Product architecture",
                "UX/UI engineering",
                "SaaS development",
                "Enterprise applications",
                "Web applications",
                "API platforms",
                "Integration",
                "Multi-tenant SaaS",
                "Application modernization",
                "Product enhancement",
                "Production support"
              ].map((item, j) => <li key={j} style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item}</li>)}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Have a product idea you want to build?</h3>
            <p className="mb-8">Let's turn your concept into a scalable, production-ready product.</p>
            <Link to="/contact" className="btn">Talk to Cognivectra <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
