import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import heroMain from "../assets/generated/hero-home-ultra-8k.png";
import clientEduImg from "../assets/generated/ind-edtech-3d.png";
import clientKidzImg from "../assets/generated/ind-health-3d.png";
import DemoRequestModal from "../components/DemoRequestModal";
import { useState } from "react";

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
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoPlatform, setDemoPlatform] = useState('general');

  const handleDemoRequest = (platform = 'general') => {
    setDemoPlatform(platform);
    setIsDemoModalOpen(true);
  };

  useEffect(() => {
    // Handle anchor scrolling
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
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
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <Link to="/contact?product=storeai" className="btn" style={{ background: 'var(--accent-secondary)', border: 'none' }} onClick={(e) => { e.preventDefault(); handleDemoRequest('storeai'); }}>
                Request Demo
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Beta</span>
            <h4>OmniCore</h4>
            <p>Unified enterprise orchestration platform for cross-departmental AI automation and data flow.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('omnicore')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--accent-secondary)', border: 'none' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Rolling Out</span>
            <h4>MedFlow EMR</h4>
            <p>Multi-tenant EMR platform live with Kidz-Clinic. Rapidly onboarding new healthcare providers this week.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('medflow')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--accent-secondary)', border: 'none' }}>Request Demo</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SUCCESS STORIES / CLIENTS */}
      <section className="services-modern" style={{ position: 'relative' }}>
        {/* Optional background decoration */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <span className="hero-badge">Proven Impact</span>
          <h3>Success Stories</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
            Partnering with forward-thinking organizations to deliver transformative digital solutions.
          </p>
        </motion.div>

        <div className="hero-modern-inner" style={{ padding: '0 1rem', gap: '3rem' }}>
          {/* Client 1: EduPortal */}
          <motion.div
            className="glass-panel"
            style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '0.75rem', marginBottom: '1rem' }}>
              <img src={clientEduImg} alt="EduPortal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>EduPortal</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', flexGrow: 1 }}>
              A next-generation education management platform empowering institutions with seamless digital learning and administration tools.
            </p>
            <a href="https://eduportal-new.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 'auto' }}>
              Visit Platform →
            </a>
          </motion.div>

          {/* Client 2: Kidz-Clinic */}
          <motion.div
            className="glass-panel"
            style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '0.75rem', marginBottom: '1rem' }}>
              <img src={clientKidzImg} alt="Kidz Clinic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>Kidz-Clinic</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', flexGrow: 1 }}>
              A specialized pediatric healthcare platform offering digital appointment scheduling and patient resource management.
            </p>
            <a href="https://kidz-clinic-client.onrender.com" target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 'auto' }}>
              Visit Clinic →
            </a>
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
      {/* Demo Request Modal */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        platform={demoPlatform}
      />
    </main>
  );
}
