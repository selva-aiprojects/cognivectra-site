import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { LuArrowRight, LuCircleCheck } from "react-icons/lu";
import heroResults from "../assets/generated/hero-results-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const caseStudies = [
  {
    id: "healthcare-ehr",
    category: "Healthcare",
    title: "Large-Scale Healthcare EHR Transformation",
    challenge: "Deliver a large-scale electronic health record transformation across a complex healthcare environment.",
    did: [
      "Enterprise architecture",
      "Program and delivery leadership",
      "Application implementation",
      "Integration",
      "Global delivery coordination",
      "Stakeholder management"
    ],
    outcomes: ["21 NHS Trusts", "3-year transformation", "30-member global delivery team"]
  },
  {
    id: "cloud-transformation",
    category: "Cloud",
    title: "2,500+ Workloads. Zero Downtime.",
    challenge: "Modernize and migrate a large enterprise workload portfolio while maintaining business continuity.",
    did: [
      "Cloud migration strategy",
      "Architecture",
      "Migration planning",
      "Workload modernization",
      "Program governance",
      "Risk management"
    ],
    outcomes: ["2,500+ workloads migrated", "Zero downtime", "100% client satisfaction"]
  },
  {
    id: "ai-it-operations",
    category: "AI & Automation",
    title: "AI-Powered IT Operations Automation",
    challenge: "Reduce repetitive IT operations and improve incident resolution using enterprise AI.",
    did: [
      "Multi-agent architecture",
      "Enterprise knowledge integration",
      "ITSM integration",
      "AI workflow automation",
      "Context engineering",
      "Operational intelligence"
    ],
    outcomes: ["40+ IT operations workflows automated", "50% reduction in L1 workload", "40% improvement in MTTR"]
  }
];

export default function CaseStudies() {
  return (
    <main>
      <Helmet>
        <title>Case Studies | Cognivectra</title>
        <meta name="description" content="Cognivectra engineering case studies: healthcare EHR transformation, cloud transformation and AI-powered IT operations automation." />
      </Helmet>

      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-badge">Case Studies</span>
            <h1>Case Studies: Engineering That<br />Goes Beyond the Hype</h1>
            <p>
              Cognivectra combines modern AI and cloud capabilities with deep enterprise
              technology delivery experience.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="industry-visual glass-panel">
              <img src={heroResults} alt="Cognivectra case studies" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="services-modern">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.id}
              id={cs.id}
              className="glass-panel"
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="hero-badge">Case Study {String(i + 1).padStart(2, '0')} · {cs.category}</span>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>{cs.title}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Challenge</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{cs.challenge}</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>What We Did</h4>
                  <ul className="service-highlights" style={{ paddingLeft: '1.2rem' }}>
                    {cs.did.map((item, j) => <li key={j} style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Verified Outcomes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {cs.outcomes.map((o, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LuCircleCheck style={{ color: '#10b981', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Have a technology challenge or product idea?</h3>
            <p className="mb-8">Let's explore what is possible together.</p>
            <Link to="/contact" className="btn">Talk to Cognivectra <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
