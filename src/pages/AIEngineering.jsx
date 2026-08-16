import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuBrain,
  LuBot,
  LuMessagesSquare,
  LuDatabase,
  LuArrowRight
} from "react-icons/lu";
import capAiImg from "../assets/generated/cap-ai-3d-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const services = [
  { icon: <LuBrain />, title: "Generative AI Applications", desc: "Production-ready GenAI features embedded into products, platforms and internal workflows." },
  { icon: <LuBot />, title: "Agentic AI & AI Agents", desc: "Multi-agent architectures that plan, reason and act across enterprise systems." },
  { icon: <LuMessagesSquare />, title: "AI Copilots", desc: "Intelligent assistants for employees, customers and domain experts." },
  { icon: <LuDatabase />, title: "RAG & Knowledge Systems", desc: "Enterprise knowledge retrieval grounded in your own data with citations." }
];

export default function AIEngineering() {
  return (
    <main>
      <Helmet>
        <title>AI Engineering | Cognivectra</title>
        <meta name="description" content="Cognivectra AI engineering: generative AI applications, agentic AI, copilots, RAG and enterprise knowledge systems, LLM integration and AI governance." />
      </Helmet>

      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-badge">Capability · AI Engineering</span>
            <h1>Intelligence,<br />Engineered for Production.</h1>
            <p>
              We help organizations move beyond AI experimentation into production-ready
              intelligent applications and workflows.
            </p>
            <p style={{ fontSize: '0.95rem', opacity: 0.75 }}>
              Generative AI · Agentic AI · AI Copilots · RAG · LLM Integration · AI Governance · AI Observability
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/services" className="btn-outline">View All Capabilities</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="industry-visual glass-panel">
              <img src={capAiImg} alt="AI Engineering" className="w-full h-full object-cover rounded-xl" />
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
                "Generative AI applications",
                "Agentic AI",
                "AI copilots",
                "RAG and enterprise knowledge systems",
                "LLM integration",
                "AI workflow automation",
                "AI-powered decision support",
                "AI agents",
                "AI governance",
                "AI observability",
                "Prompt and context engineering",
                "Enterprise AI architecture"
              ].map((item, j) => <li key={j} style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item}</li>)}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="cta-modern">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h3>Ready to build production AI?</h3>
            <p className="mb-8">Let's explore how intelligence can create measurable business value for your organization.</p>
            <Link to="/contact" className="btn">Talk to Cognivectra <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
