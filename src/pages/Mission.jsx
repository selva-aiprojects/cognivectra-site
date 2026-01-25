import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroMission from "../assets/generated/hero-mission.svg";

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
            <span className="hero-badge">🎯 Mission & Vision</span>
            <h1>Empowering Founders <br />Through Frictionless Technology</h1>
            <p>
              We help startups build reliable, automated platforms that scale
              with confidence. Our mission is to make enterprise-grade
              infrastructure accessible to every founder.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Start a Conversation</Link>
              <Link to="/services" className="btn-outline">Explore Services</Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Mission: Empower Founders · Vision: Frictionless Innovation
            </p>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroMission} alt="Our Mission" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="services-modern py-24">
        <motion.h3 className="text-center mb-16" {...fadeInUp}>Our Guiding Principles</motion.h3>
        <div className="services-modern-grid">
          {[
            { icon: "🎯", title: "Founder-First", desc: "We prioritize founder needs and business outcomes over technical complexity.", highlights: ["Business outcomes first", "Rapid time-to-value", "Scalable foundations"] },
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
            { icon: "🚀", title: "Pre-Seed to Seed", desc: "Founders building their first product and teams needing MVP infrastructure to reach customers faster.", highlights: ["First product launches", "MVP infrastructure", "Early customer readiness"] },
            { icon: "📈", title: "Series A to B", desc: "Scaling teams and platforms that need stronger reliability, performance, and enterprise readiness.", highlights: ["Platform scalability", "Reliability improvements", "Enterprise readiness"] }
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
            <h3>Ready to Build Your Foundation?</h3>
            <p className="mb-8">
              Let's discuss how we can help you build the technical foundation for
              your next stage of growth.
            </p>
            <Link to="/services" className="btn">
              Explore Our Services
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
