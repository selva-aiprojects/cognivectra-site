import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuCloud,
  LuRocket,
  LuCpu,
  LuBuilding2,
  LuSettings
} from "react-icons/lu";
import heroServices from "../assets/generated/hero-services-ultra-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

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
              <title>Enterprise AI & Cloud Services | CogniVectra</title>
              <meta name="description" content="Modular, production-ready engineering services including cloud architecture, DevOps, and GenAI orchestration for modern enterprises." />
            </Helmet>
            <span className="hero-badge"><LuSettings style={{ marginRight: '0.4rem' }} /> Enterprise-Grade Architecture</span>
            <h1>Platform Engineering <br />for Speed, Scale & Stability</h1>
            <p>
              CogniVectra delivers modular, production-ready systems that help
              enterprises build intelligent platforms, automate operations, and
              scale with enterprise-grade reliability.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Book Strategy Call</Link>
              <Link to="/#services" className="btn-outline">View Services</Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Senior engineers only · Security built-in · AI-first architecture
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroServices} alt="Our Services" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="services-modern">
        <motion.div
          className="section-header"
          style={{ textAlign: "center", marginBottom: "5rem" }}
          {...fadeInUp}
        >
          <span className="hero-badge">Engineering Excellence</span>
          <h3>Our Core Services</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Modular, scalable, and secure engineering services designed to help
            organizations deploy their vision with enterprise-grade stability.
          </p>
        </motion.div>

        <div className="services-modern-grid">
          {[
            { icon: <LuCloud />, title: "Cloud Architecture", desc: "Scalable, secure cloud foundations on AWS, GCP, or Azure with a focus on cost-optimization and resilience.", highlights: ["Landing Zone Construction", "Infrastructure as Code", "Disaster Recovery", "Security & Compliance"] },
            { icon: <LuRocket />, title: "DevOps & Platforms", desc: "Empowering your team with high-velocity CI/CD pipelines and high-reliability platform engineering.", highlights: ["Automated CI/CD Workflows", "Kubernetes Management", "Observability & Monitoring", "SRE Practices"] },
            { icon: <LuCpu />, title: "AI & Automation", desc: "Accelerating business processes and product features using state-of-the-art AI orchestration.", highlights: ["Custom LLM Integrations", "Automated Data Pipelines", "Internal Productivity Bots", "AI Strategy & Feasibility"] },
            { icon: <LuBuilding2 />, title: "SaaS Foundations", desc: "Standardized, battle-tested components for authentication, billing, and core SaaS functionality.", highlights: ["RBAC & IAM Architecture", "Stripe & Billing Integration", "Multi-tenant Partitioning", "Scalable API Gateways"] }
          ].map((service, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="service-icon-wrapper">{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
              <ul className="service-highlights">
                {service.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="services-modern py-24">
        <motion.h3 className="text-center mb-16" {...fadeInUp}>How We Work</motion.h3>
        <div className="services-modern-grid">
          {[
            { step: "1", title: "Discovery", desc: "Deep dive into your product, architecture, goals, and constraints to build a 90-day roadmap." },
            { step: "2", title: "Architecture", desc: "Define the blueprint for infrastructure, automation, and security tailored to your growth." },
            { step: "3", title: "Execution", desc: "Rapid implementation of pipelines, workflows, and core SaaS foundations by senior engineers." },
            { step: "4", title: "Optimization", desc: "Continuous refinement of performance, cost, and reliability as your user base expands." }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
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
            <h3>Ready to build your enterprise platform foundation?</h3>
            <p className="mb-8">
              Connect with our architects to discuss your production-ready deployment strategy.
            </p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn">Book Strategy Call</Link>
              <Link to="/engagements" className="btn-outline">View Engagements</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
