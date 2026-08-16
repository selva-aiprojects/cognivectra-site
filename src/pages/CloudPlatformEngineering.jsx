import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuCloud,
  LuServer,
  LuGitBranch,
  LuShield,
  LuArrowRight
} from "react-icons/lu";
import capCloudImg from "../assets/generated/cap-cloud-3d-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const services = [
  { icon: <LuCloud />, title: "Cloud Transformation", desc: "Modernize infrastructure and applications across AWS, Microsoft Azure and Google Cloud." },
  { icon: <LuServer />, title: "Platform Engineering", desc: "Internal platforms with Kubernetes, infrastructure as code and self-service developer experience." },
  { icon: <LuGitBranch />, title: "DevSecOps & CI/CD", desc: "High-velocity, secure delivery pipelines with automated testing and deployment." },
  { icon: <LuShield />, title: "SRE & Observability", desc: "Reliability engineering with monitoring, alerting, high availability and disaster recovery." }
];

export default function CloudPlatformEngineering() {
  return (
    <main>
      <Helmet>
        <title>Cloud & Platform Engineering | Cognivectra</title>
        <meta name="description" content="Cognivectra cloud & platform engineering: cloud transformation, workload migration, Kubernetes, DevSecOps, SRE and cloud-native architecture across AWS, Azure and GCP." />
      </Helmet>

      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-badge">Capability · Cloud & Platform Engineering</span>
            <h1>Modern Foundations<br />for Modern Applications.</h1>
            <p>
              We design and modernize secure, scalable cloud and engineering platforms
              across AWS, Microsoft Azure and Google Cloud.
            </p>
            <p style={{ fontSize: '0.95rem', opacity: 0.75 }}>
              Cloud Transformation · Kubernetes · Platform Engineering · DevSecOps · SRE · Observability
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/services" className="btn-outline">View All Capabilities</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="industry-visual glass-panel">
              <img src={capCloudImg} alt="Cloud & Platform Engineering" className="w-full h-full object-cover rounded-xl" />
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
                "Cloud transformation",
                "Workload migration",
                "Cloud-native architecture",
                "Platform engineering",
                "Kubernetes",
                "DevSecOps",
                "CI/CD",
                "Infrastructure as Code",
                "SRE",
                "Observability",
                "High availability",
                "Disaster recovery",
                "Cloud governance",
                "Cloud optimization"
              ].map((item, j) => <li key={j} style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item}</li>)}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Ready to modernize your platform?</h3>
            <p className="mb-8">Let's design secure, scalable foundations for your applications.</p>
            <Link to="/contact" className="btn">Talk to Cognivectra <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
