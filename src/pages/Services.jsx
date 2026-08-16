import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuBrain,
  LuCloud,
  LuRocket,
  LuDatabase,
  LuArrowRight,
  LuSettings
} from "react-icons/lu";
import heroServices from "../assets/generated/hero-services-ultra-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const capabilities = [
  {
    icon: <LuBrain />,
    title: "AI Engineering",
    tagline: "Intelligence, Engineered for Production.",
    desc: "We help organizations move beyond AI experimentation into production-ready intelligent applications and workflows.",
    to: "/ai-engineering",
    highlights: ["Generative AI applications", "Agentic AI", "AI copilots", "RAG & enterprise knowledge systems", "AI governance & observability", "Enterprise AI architecture"]
  },
  {
    icon: <LuCloud />,
    title: "Cloud & Platform Engineering",
    tagline: "Modern Foundations for Modern Applications.",
    desc: "We design and modernize secure, scalable cloud and engineering platforms across AWS, Microsoft Azure and Google Cloud.",
    to: "/cloud-platform-engineering",
    highlights: ["Cloud transformation", "Workload migration", "Cloud-native architecture", "Kubernetes & platform engineering", "DevSecOps & CI/CD", "SRE & observability"]
  },
  {
    icon: <LuRocket />,
    title: "Product Engineering",
    tagline: "From Concept to Scalable Product.",
    desc: "We turn business ideas into modern SaaS platforms and enterprise applications.",
    to: "/product-engineering",
    highlights: ["Product discovery & architecture", "UX/UI engineering", "SaaS development", "Enterprise applications", "API platforms", "Multi-tenant SaaS"]
  },
  {
    icon: <LuDatabase />,
    title: "Data & Integration",
    tagline: "Data Foundations for Intelligent Systems.",
    desc: "We build reliable data and integration foundations that support modern applications and AI.",
    to: "/data-integration",
    highlights: ["Data integration", "ETL / ELT", "API integration", "Data quality & MDM", "Data platforms", "Vector databases & AI-ready foundations"]
  }
];

export default function Services() {
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
              <title>Capabilities | AI, Cloud, Product & Data Engineering | Cognivectra</title>
              <meta name="description" content="Cognivectra capabilities: AI engineering, cloud & platform engineering, product engineering, and data & integration for modern enterprises." />
              <meta property="og:title" content="Cognivectra | Engineering Capabilities" />
              <meta property="og:description" content="AI engineering, cloud & platform engineering, product engineering, and data & integration." />
            </Helmet>
            <span className="hero-badge"><LuSettings style={{ marginRight: '0.4rem' }} /> Capabilities</span>
            <h1>Technology, Engineering<br />and Product IP</h1>
            <p>
              Cognivectra operates across the complete technology lifecycle — from strategy and
              architecture to product engineering, AI enablement, cloud modernization and
              production operations.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/#services" className="btn-outline">View Capabilities</Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              AI Engineering · Cloud & Platform · Product Engineering · Data & Integration
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroServices} alt="Cognivectra capabilities" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="services" className="services-modern">
        <motion.div
          className="section-header"
          style={{ textAlign: "center", marginBottom: "5rem" }}
          {...fadeInUp}
        >
          <span className="hero-badge">Core Capabilities</span>
          <h3>What We Do</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Four capability areas that work together to design, build, deploy and continuously
            improve real products and platforms.
          </p>
        </motion.div>

        <div className="services-modern-grid">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="service-icon-wrapper">{cap.icon}</div>
              <h4>{cap.title}</h4>
              <p style={{ color: 'var(--accent-primary)', fontSize: '0.95rem', fontWeight: '600' }}>{cap.tagline}</p>
              <p>{cap.desc}</p>
              <ul className="service-highlights">
                {cap.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
              <Link to={cap.to} className="btn-text">
                Explore {cap.title} <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="services-modern py-24">
        <motion.h3 className="text-center mb-16" {...fadeInUp}>From Technology Challenge to Production Outcome</motion.h3>
        <div className="services-modern-grid">
          {[
            { step: "01", title: "Discover", desc: "Understand the business problem, users, constraints and desired outcomes." },
            { step: "02", title: "Architect", desc: "Define solution architecture, technology strategy, data flows and integration models." },
            { step: "03", title: "Design", desc: "Create product experiences, workflows and technical foundations." },
            { step: "04", title: "Build", desc: "Develop scalable applications, platforms and AI capabilities." },
            { step: "05", title: "AI Enable", desc: "Introduce intelligence where it creates measurable business value." },
            { step: "06", title: "Deploy", desc: "Implement secure cloud infrastructure, CI/CD and production operations." },
            { step: "07", title: "Optimize", desc: "Continuously improve performance, reliability, cost and user outcomes." }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="service-icon-wrapper">{item.step}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Have a Technology Challenge or Product Idea?</h3>
            <p className="mb-8">
              Whether you're exploring AI, modernizing your cloud environment or building your next
              digital product, let's explore what is possible.
            </p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/products" className="btn-outline">Explore Our Products</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
