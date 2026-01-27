import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import heroMain from "../assets/generated/hero-home-ultra-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    // Handle anchor scrolling
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <main>
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="hero-badge">Startup-Grade Engineering Excellence</motion.span>
            <motion.h1 variants={fadeInUp}>Build Faster. <br />Scale Smarter. <br />Automate Everything.</motion.h1>
            <motion.p variants={fadeInUp}>
              CogniVectra helps startups design resilient cloud platforms,
              automate workflows with AI, and execute technology strategy with Fractional CTO expertise.
            </motion.p>
            <motion.div variants={fadeInUp} className="hero-cta">
              <Link to="/contact" className="btn">Start Strategy Session</Link>
              <Link to="/services" className="btn-outline">Explore Services</Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroMain} alt="CogniVectra Engineering" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <motion.section
        className="trust-modern"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="trust-modern-inner">
          <div><strong>25+</strong>Years Experience</div>
          <div><strong>40+</strong>Platforms Built</div>
          <div><strong>12+</strong>Countries Served</div>
          <div><strong>99.9%</strong>System Reliability</div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <section id="services" className="services-modern">
        <motion.div
          className="section-header"
          style={{ textAlign: "center", marginBottom: "5rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge">Strategic Engineering</span>
          <h3>What We Do</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            We provide high-impact engineering and strategic leadership to help your startup
            outpace the competition with resilient, automated technology.
          </p>
        </motion.div>

        <motion.div
          className="services-modern-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            { icon: "🚀", title: "Fractional CTO", desc: "Executive-level technical leadership and strategy to align technology with your business goals.", highlights: ["Technical Roadmap Planning", "Team Mentorship & Growth", "Technology Stack Selection"] },
            { icon: "⛓️", title: "DevOps Automation", desc: "Infrastructure as Code and CI/CD pipelines that enable your team to ship code safely and at scale.", highlights: ["Cloud-Native Migration", "Kubernetes Orchestration", "Infrastructure Hardening"] },
            { icon: "🧠", title: "AI Orchestration", desc: "Integrating advanced AI workflows to automate repetitive tasks and create intelligent products.", highlights: ["LLM Integration", "Process Automation", "AI-First User Experiences"] },
            { icon: "💎", title: "SaaS Foundations", desc: "Building the core architecture for your SaaS product that is secure, multi-tenant, and highly scalable.", highlights: ["Multi-tenant Architecture", "API Design & Ecosystem", "Global Edge Distribution"] }
          ].map((service, i) => (
            <motion.div key={i} variants={fadeInUp} className="service-modern-card glass-panel">
              <div className="service-icon-wrapper">{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
              <ul className="service-highlights">
                {service.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="hero-badge">Our Innovation</span>
          <h3>Intelligence-Driven Products</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
            Beyond services, we build proprietary AI products that solve real-world business challenges.
          </p>
        </motion.div>

        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Featured</span>
            <h4>StoreAI</h4>
            <p>AI-powered retail management system with predictive analytics and real-time inventory optimization.</p>
            <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Beta</span>
            <h4>OmniCore</h4>
            <p>Unified enterprise orchestration platform for cross-departmental AI automation and data flow.</p>
            <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
          </motion.div>
        </div>
      </section>

      {/* LEADERSHIP PREVIEW */}
      <section className="services-modern">
        <div className="hero-modern-inner" style={{ padding: 0 }}>
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="hero-badge">Expert Leadership</span>
            <h3>25+ Years of Industry Excellence</h3>
            <p>
              Our leadership team brings decades of experience in building high-scale service
              architectures and market-winning products.
            </p>
            <Link to="/leadership" className="btn">Meet Our Leadership</Link>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="service-modern-card glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: 'var(--accent-primary)', fontWeight: '800' }}>25+</div>
              <p style={{ opacity: 0.8 }}>Years Experience</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">

        <motion.div
          className="container"
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3>Ready to accelerate your product roadmap?</h3>
          <p className="mb-8">
            Get a 90-day execution plan in a free strategy session.
          </p>
          <Link to="/contact" className="btn">
            Start Free Strategy Call
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
