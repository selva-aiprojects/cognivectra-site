import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroAbout from "../assets/generated/hero-about.svg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function About() {
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
            <span className="hero-badge">About CogniVectra</span>
            <h1>Building Foundations <br /> for Modern Enterprises</h1>

            <p>
              We are a team of experienced engineers and platform specialists
              helping organizations build reliable, scalable foundations with
              production-ready enterprise systems.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Talk to an Architect
              </Link>
              <Link to="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Deep Technical Expertise · Practical Business Impact · Enterprise Quality
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroAbout} alt="About CogniVectra" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXPERTISE GRID */}
      <section className="services-modern">
        <motion.div
          className="section-header"
          style={{ textAlign: "center", marginBottom: "5rem" }}
          {...fadeInUp}
        >
          <h3>Our Strategic Expertise</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            We combine deep technical mastery with enterprise-grade execution to ensure
            your platform supports your growth from deployment to global scale.
          </p>
        </motion.div>

        <div className="services-modern-grid">
          {[
            { icon: "🏗️", title: "Platform Engineering", desc: "We build the foundational platforms that power modern SaaS applications — from auth to billing.", highlights: ["Multi-tenant architecture", "Scalable Data Models", "Observability & Monitoring"] },
            { icon: "☁️", title: "Cloud Infrastructure", desc: "Secure, cost-efficient, and scalable infrastructure designed for growth without complexity.", highlights: ["Hybrid Cloud Strategy", "Security Foundations", "Cost Optimization"] },
            { icon: "🤖", title: "Process Automation", desc: "Automating repetitive workflows to allow your team to focus on building great products.", highlights: ["Low-code / No-code Solutions", "Custom Data Pipelines", "Workflow Orchestration"] },
            { icon: "📊", title: "Data & Analytics", desc: "Robust analytics platforms providing real-time business insights for data-driven decisions.", highlights: ["Data Warehouse Design", "Real-time Dashboards", "Business Intelligence"] }
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

      {/* VALUES */}
      <section className="why-modern relative overflow-hidden py-24">
        <div className="why-modern-inner relative z-10">
          <motion.h3 {...fadeInUp}>Our Core Values</motion.h3>
          <div className="why-modern-grid">
            {[
              { icon: "🎯", title: "Excellence", desc: "Enterprise-grade quality with rapid deployment and scalability." },
              { icon: "🤝", title: "Partnership", desc: "We work as an extension of your team, not just consultants." },
              { icon: "🚀", title: "Innovation", desc: "Cutting-edge solutions for unique business challenges." }
            ].map((value, i) => (
              <motion.div
                key={i}
                className="service-modern-card glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4>{value.icon} {value.title}</h4>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern relative overflow-hidden">
        <div className="container relative z-10 text-center">
          <motion.div {...fadeInUp}>
            <h3>Let’s Build Something Amazing Together</h3>
            <p className="mb-8">
              Ready to discuss how we can help you build the technical foundation
              for your organization’s success?
            </p>
            <Link to="/contact" className="btn">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
