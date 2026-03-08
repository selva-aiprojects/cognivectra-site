import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LuTrendingUp,
  LuRocket,
  LuCpu,
  LuBuilding2,
  LuCircleCheck
} from "react-icons/lu";
import resultsHero from "../assets/generated/hero-results-8k.png";

const SuccessStory = ({ title, icon, category, challenge, solution, metrics }) => (
  <motion.div
    className="service-modern-card success-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="success-header">
      <div className="success-icon">{icon}</div>
      <div className="success-title-wrap">
        <span className="success-category">{category}</span>
        <h4>{title}</h4>
      </div>
    </div>

    <div className="success-body">
      <div className="success-section">
        <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5, marginBottom: '0.5rem' }}>The Challenge</h5>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{challenge}</p>
      </div>
      <div className="success-section">
        <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5, marginBottom: '0.5rem' }}>Our Architecture</h5>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{solution}</p>
      </div>
      <div className="success-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-item">
            <span className="metric-value" style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-light)' }}>{m.value}</span>
            <span className="metric-label" style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6 }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default function Results() {
  const stories = [
    {
      title: "Rapid Deployment for Global SaaS",
      category: "Platform Engineering",
      icon: <LuRocket />,
      challenge: "Manual deployments and configuration drift were causing 20% release failure rates and scaling bottlenecks across 3 global regions.",
      solution: "Implemented a shared-nothing multi-tenant architecture with fully automated CI/CD pipelines and immutable infrastructure using Terraform.",
      metrics: [
        { value: "400%", label: "Speed" },
        { value: "99.99%", label: "Uptime" },
        { value: "0", label: "Errors" }
      ]
    },
    {
      title: "Healthcare Data Governance at Scale",
      category: "HealthTech / Compliance",
      icon: <LuCpu />,
      challenge: "A diagnostic platform struggled to meet HIPAA data residency requirements while maintaining sub-second query performance for millions of records.",
      solution: "Deployed a sharded data layer with regional residency guards and a unified compliance-aware API gateway with audit logging.",
      metrics: [
        { value: "100%", label: "HIPAA" },
        { value: "650ms", label: "Latency" },
        { value: "3.2M", label: "Records" }
      ]
    },
    {
      title: "Intelligent Process Automation",
      category: "Enterprise AI",
      icon: <LuBuilding2 />,
      challenge: "Legacy administrative workflows required 4,000+ manual hours monthly, leading to significant delays and billing errors.",
      solution: "Engineered a custom workflow orchestration engine with integrated GenAI for automated document classification and error-correction.",
      metrics: [
        { value: "85%", label: "Efficiency" },
        { value: "4x", label: "Speed" },
        { value: "$1.2M", label: "Savings" }
      ]
    }
  ];

  return (
    <main>
      <Helmet>
        <title>Case Studies & Impact | CogniVectra Results</title>
        <meta name="description" content="Explore our success stories in healthcare, fintech, and enterprise AI. Real metrics and architectural deep-dives from our production deployments." />
      </Helmet>
      {/* HERO */}
      <section className="hero-modern bg-visual-energy">
        <div className="hero-modern-inner" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge"><LuTrendingUp style={{ marginRight: '0.4rem' }} /> Impact Report</span>

            <h1>Measurable <br />Engineering Wins</h1>

            <p>
              We don't just ship code; we deliver strategic business outcomes.
              Our platforms are engineered to reduce friction, eliminate human error,
              and scale with your most ambitious growth targets.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Scale My Platform
              </Link>
              <Link to="/#services" className="btn-outline">
                See Our Approach
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={resultsHero} alt="CogniVectra Results" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip" style={{ padding: '0 2rem', marginTop: '-3rem', position: 'relative', zIndex: 20 }}>
        <div className="container glass-panel" style={{ display: 'flex', justifyContent: 'space-around', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-light)' }}>15+</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '0.5rem' }}>Enterprise Deployments</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-light)' }}>$50M+</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '0.5rem' }}>Cloud Budgets Managed</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-light)' }}>100%</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '0.5rem' }}>Compliance Score</div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="services-modern">
        <div className="container">
          <div className="section-header text-left mb-12">
            <h3>Strategic Success Stories</h3>
          </div>

          <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {stories.map((story, i) => (
              <SuccessStory key={i} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern" style={{ position: 'relative', overflow: 'hidden', padding: '8rem 2rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h3>Ready to Scale Your Impact?</h3>
          <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
            Whether you need to bridge the "Architecture Gap" or accelerate your GenAI roadmap, our engineering team is ready to deploy.
          </p>
          <Link to="/contact" className="btn" style={{ padding: '1rem 3rem' }}>
            Start Your Strategy Session
          </Link>
        </div>
      </section>
    </main>
  );
}
