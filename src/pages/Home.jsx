import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuShield,
  LuBrain,
  LuCloud,
  LuTrendingUp,
  LuActivity,
  LuArrowRight,
  LuBuilding2,
  LuCpu,
  LuDatabase,
  LuUsers,
  LuHotel,
  LuCircleCheck,
  LuCompass,
  LuPuzzle,
  LuWorkflow
} from "react-icons/lu";
import { FaCloud } from "react-icons/fa";
import {
  SiAmazonwebservices,
  SiGooglecloud,
  SiKubernetes,
  SiOpenai,
  SiSupabase
} from "react-icons/si";
import heroMain from "../assets/generated/hero-home-ultra-8k.png";
import capAiImg from "../assets/generated/cap-ai-3d-8k.png";
import capCloudImg from "../assets/generated/cap-cloud-3d-8k.png";
import capOpsImg from "../assets/generated/cap-ops-3d-8k.png";
import capAdvisoryImg from "../assets/generated/cap-advisory-3d-8k.png";
import DemoRequestModal from "../components/DemoRequestModal";
import { useState, useEffect } from "react";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
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
    trackEvent('cta_click', { platform, cta_name: 'Request Demo', location: 'Home' });
    setDemoPlatform(platform);
    setIsDemoModalOpen(true);
  };

  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hash]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArchitectureSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const organization = formData.get('organization');
      const focus = formData.get('focus');
      const challenge = formData.get('challenge');

      // Track conversion
      trackEvent('lead_generated', {
        type: 'architecture_review',
        organization,
        focus
      }, 'CONVERSION');

      // Save to Supabase (using existing chat_conversations as a lead vault)
      await supabase.from("chat_conversations").upsert([
        {
          user_name: name,
          user_email: email,
          company: organization,
          stage: focus,
          challenge: `(Architecture Review): ${challenge}`,
          source: "home_arch_review",
          lead_score: "hot",
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "user_email" });

      // Notification
      await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'architecture_review',
          name,
          email,
          organization,
          focus,
          message: challenge
        }
      });

      alert("Transmission Successful. Our team will reach out to schedule your review session.");
      e.target.reset();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission error. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Helmet>
        <title>Cognivectra | AI-Native Technology & Product Engineering</title>
        <meta name="description" content="Cognivectra is an AI-native technology and product engineering company building intelligent products, enterprise platforms and cloud-native solutions for modern businesses." />
        <meta name="keywords" content="AI engineering, cloud transformation, product engineering, data integration, enterprise platforms, multi-tenant SaaS, Cognivectra" />
        <meta property="og:title" content="Cognivectra | AI-Native Technology & Product Engineering" />
        <meta property="og:description" content="We build AI, enterprise and industry-specific software products across healthcare, HR, hospitality, finance, retail and intelligent automation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cognivectra.com/" />
      </Helmet>

      {/* HERO SECTION */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">AI-Native Technology & Product Engineering</span>
            <h1>AI-Native Technology. <br />Built for Business.</h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.2rem', opacity: 0.92 }}>
              Cognivectra builds intelligent products, enterprise platforms and
              cloud-native technology that help organizations modernize, automate and grow.
            </motion.p>
            <motion.p variants={fadeInUp} style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: '560px' }}>
              From AI engineering and cloud transformation to SaaS platforms and
              enterprise applications, we combine technology depth with product
              thinking and production-focused engineering.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <div className="cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn" onClick={() => trackEvent('cta_click', { cta_name: 'Explore Our Products', location: 'Hero' })}>
                  Explore Our Products
                </Link>
                <Link to="/contact" className="btn-outline" onClick={() => trackEvent('cta_click', { cta_name: 'Talk to Cognivectra', location: 'Hero' })}>
                  Talk to Cognivectra
                </Link>
              </div>
            </motion.div>
            <motion.p variants={fadeInUp} style={{ marginTop: '1.75rem', fontSize: '0.85rem', opacity: 0.65, letterSpacing: '0.5px' }}>
              AI Engineering · Cloud & Platform Engineering · Product Engineering · Data & Integration
            </motion.p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroMain} alt="Cognivectra AI-native engineering" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>

        {/* TRUST STRIP */}
        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2, 6, 23, 0.3)', backdropFilter: 'blur(10px)' }}>
          <motion.div
            className="container"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ padding: '2rem 2rem', textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2rem', opacity: 0.5, marginBottom: '1.5rem' }}>
              Built On Enterprise Foundations
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3.5rem',
              flexWrap: 'wrap',
              opacity: 0.6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SiAmazonwebservices size={28} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>AWS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCloud size={26} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Azure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SiGooglecloud size={28} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>GCP</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SiKubernetes size={28} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Kubernetes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SiOpenai size={28} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>OpenAI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SiSupabase size={28} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Supabase</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="services-modern">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="hero-badge">Core Capabilities</span>
          <h3>What We Do</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Four capability areas, engineered together to take technology from concept
            to production outcome.
          </p>
        </motion.div>

        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {[
            {
              img: capAiImg,
              icon: <LuBrain />,
              title: "AI Engineering",
              desc: "Generative AI, agentic AI, copilots and RAG built into products, platforms and enterprise workflows.",
              features: ["Generative & agentic AI", "Copilots & RAG systems", "AI governance & evaluation"],
              to: "/ai-engineering",
              highlight: "Generative AI · Agentic AI · RAG · AI Governance"
            },
            {
              img: capCloudImg,
              icon: <LuCloud />,
              title: "Cloud & Platform Engineering",
              desc: "Secure, scalable cloud and engineering platforms across AWS, Azure and GCP.",
              features: ["Cloud transformation", "Kubernetes & DevSecOps", "SRE & observability"],
              to: "/cloud-platform-engineering",
              highlight: "Cloud Transformation · Kubernetes · DevSecOps · SRE"
            },
            {
              img: capOpsImg,
              icon: <LuWorkflow />,
              title: "Product Engineering",
              desc: "From product discovery to scalable SaaS platforms and enterprise applications.",
              features: ["Product discovery & architecture", "SaaS & multi-tenant platforms", "Modernization & support"],
              to: "/product-engineering",
              highlight: "Product Discovery · SaaS · API Platforms · Multi-tenant"
            },
            {
              img: capAdvisoryImg,
              icon: <LuDatabase />,
              title: "Data & Integration",
              desc: "Reliable data and integration foundations that support modern applications and AI.",
              features: ["Data platforms & warehouses", "ETL/ELT pipelines", "API & system integration"],
              to: "/data-integration",
              highlight: "ETL/ELT · API Integration · Data Platforms · Vector DBs"
            }
          ].map((cap, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div style={{ height: '160px', overflow: 'hidden', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <img src={cap.img} alt={cap.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="service-icon-wrapper">{cap.icon}</div>
              <h4>{cap.title}</h4>
              <p>{cap.desc}</p>
              <ul className="service-highlights" style={{ margin: '1rem 0 1.25rem' }}>
                {cap.features.map((f) => <li key={f} style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>{f}</li>)}
              </ul>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>{cap.highlight}</p>
              <Link to={cap.to} className="btn-text" onClick={() => trackEvent('cta_click', { cta_name: `Explore ${cap.title}`, location: 'Home' })}>
                Explore {cap.title} <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTS & PLATFORMS */}
      <section className="services-modern section-transition-wrap" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="hero-badge">Products & Platforms</span>
          <h3>Products & Platforms Built by Cognivectra</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
            Cognivectra develops its own portfolio of software products, enterprise platforms
            and AI-enabled solutions across multiple industries.
          </p>
        </motion.div>

        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Live · Healthcare</span>
            <h4>Healthezee</h4>
            <p>Healthcare management platform with EMR, OPD, inpatient, pharmacy, billing and multi-tenant architecture.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/healthezee" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('healthezee')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Live · FinTech</span>
            <h4>StockSteward</h4>
            <p>AI-powered investment intelligence and portfolio management platform for modern investors and traders.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/stocksteward" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('steward')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production · Retail</span>
            <h4>StoreAI</h4>
            <p>Intelligent inventory and retail management for inventory, sales, purchasing, accounts and workforce operations.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/storeai" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('storeai')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production · Education</span>
            <h4>EduPortal</h4>
            <p>AI-powered education and institution management platform for enterprise-scale multi-tenant deployment.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/eduportal" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('eduportal')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production · HR</span>
            <h4>CogniHRMS</h4>
            <p>Next-generation Human Resource Management System powered by AI for recruitment, attendance and employee analytics.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products#cognihrms" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <a href="https://cognihr.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Launch Portal ↗</a>
            </div>
          </motion.div>
          <motion.div className="service-modern-card glass-panel" whileHover={{ y: -5 }} {...fadeInUp}>
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production · AI</span>
            <h4>SmartPortfolio</h4>
            <p>AI-powered portfolio intelligence with P&L, position analysis and hold / review / sell decision support.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/smartportfolio" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('smartportfolio')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/products" className="btn" onClick={() => trackEvent('cta_click', { cta_name: 'Explore the Cognivectra Product Portfolio', location: 'Home' })}>
            Explore the Cognivectra Product Portfolio <LuArrowRight style={{ marginLeft: '0.4rem', verticalAlign: 'middle' }} />
          </Link>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="services-modern">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="hero-badge">Selected Case Studies</span>
          <h3>Engineering Experience That Goes Beyond the Hype</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Cognivectra combines modern AI and cloud capabilities with deep enterprise
            technology delivery experience.
          </p>
        </motion.div>

        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {[
            {
              title: "Large-Scale Healthcare EHR Transformation",
              summary: "Enterprise architecture, delivery leadership and global coordination for a complex healthcare environment.",
              metrics: ["21 NHS Trusts", "3-year transformation", "30-member global delivery team"]
            },
            {
              title: "Cloud Transformation",
              summary: "Modernized and migrated a large enterprise workload portfolio while maintaining business continuity.",
              metrics: ["2,500+ workloads migrated", "Zero downtime", "100% client satisfaction"]
            },
            {
              title: "AI-Powered IT Operations",
              summary: "Multi-agent architecture and enterprise knowledge integration to reduce repetitive IT operations work.",
              metrics: ["40+ workflows automated", "50% L1 workload reduction", "40% MTTR improvement"]
            }
          ].map((cs, i) => (
            <motion.div
              key={i}
              className="service-modern-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Case Study {String(i + 1).padStart(2, '0')}</span>
              <h4 style={{ fontSize: '1.2rem' }}>{cs.title}</h4>
              <p style={{ fontSize: '0.9rem' }}>{cs.summary}</p>
              <ul className="service-highlights" style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
                {cs.metrics.map((m, j) => <li key={j} style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>{m}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/case-studies" className="btn-outline">View All Case Studies</Link>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="trust-modern" style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '4rem 0' }}>
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="hero-badge">Industries</span>
            <h3>Technology Built Around Business Context</h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
              Cognivectra develops technology across industries where complex workflows, data,
              integration and operational reliability matter.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <LuActivity />, title: "Healthcare", desc: "Healthcare management, hospital operations, pharmacy and digital health platforms." },
              { icon: <LuUsers />, title: "HR & Talent", desc: "HR management, workforce operations and talent management." },
              { icon: <LuHotel />, title: "Hospitality", desc: "Hospitality management and operational platforms." },
              { icon: <LuTrendingUp />, title: "BFSI & FinTech", desc: "Banking, financial workflows, portfolio intelligence and enterprise financial technology." },
              { icon: <LuBuilding2 />, title: "Retail & Commerce", desc: "Inventory, sales, purchasing and business operations." },
              { icon: <LuCpu />, title: "Enterprise Technology", desc: "AI, automation, cloud modernization, platform engineering and enterprise applications." }
            ].map((ind, i) => (
              <motion.div
                key={i}
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.75rem' }}>{ind.icon}</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{ind.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="trust-modern" style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '4rem 0' }}>
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="hero-badge">How We Work</span>
            <h3>From Technology Challenge to Production Outcome</h3>
          </motion.div>

          <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              { step: "01", icon: <LuCompass />, title: "Discover", desc: "Understand the business problem, users, constraints and desired outcomes." },
              { step: "02", icon: <LuPuzzle />, title: "Architect & Design", desc: "Define solution architecture, technology strategy, product experiences and data flows." },
              { step: "03", icon: <LuBrain />, title: "Build & AI Enable", desc: "Develop scalable applications and platforms, introducing intelligence where it creates business value." },
              { step: "04", icon: <LuTrendingUp />, title: "Deploy & Optimize", desc: "Implement secure cloud infrastructure, CI/CD and production operations, then continuously improve." }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ padding: '1.75rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {step.step}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{step.title}</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / EXPERIENCE */}
      <section className="services-modern">
        <div className="hero-modern-inner" style={{ padding: 0 }}>
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="hero-badge">About Cognivectra</span>
            <h3>Engineering Experience for an AI-Native World</h3>
            <p>
              Cognivectra is an AI-native technology and product engineering company focused on
              building intelligent products, enterprise platforms and modern technology foundations.
            </p>
            <p>
              Alongside client-focused engineering and transformation work, Cognivectra develops its
              own software products and industry platforms across healthcare, HR, hospitality,
              finance, retail, banking and AI.
            </p>
            <blockquote style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', margin: '1.5rem 0', opacity: 0.85 }}>
              Successful AI is not just about models. It requires strong architecture, reliable data,
              secure infrastructure, thoughtful product design and disciplined engineering.
            </blockquote>
            <Link to="/who-we-are" className="btn">Learn More About Us</Link>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="service-modern-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', color: 'var(--accent-primary)', fontWeight: '800' }}>25+</div>
              <p style={{ opacity: 0.8, fontSize: '1.05rem' }}>Years of Enterprise Technology Experience</p>
              <div style={{ fontSize: '3rem', color: 'var(--accent-primary)', fontWeight: '800', marginTop: '2rem' }}>40+</div>
              <p style={{ opacity: 0.8, fontSize: '1.05rem' }}>Platforms Built</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STRATEGIC ENGAGEMENT FORM */}
      <section id="architecture-review" className="services-modern" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="login-grid" style={{ opacity: 0.2 }} />
        <div className="container">
          <div className="glass-panel" style={{ padding: '4rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="hero-badge">Talk to Cognivectra</span>
              <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Have a Technology Challenge or Product Idea?</h2>
              <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                Whether you're exploring AI, modernizing your cloud environment or building your next
                digital product, request a direct technical discussion with our architects.
              </p>
            </div>

            <form onSubmit={handleArchitectureSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="contact-label">Full Name</label>
                  <input type="text" name="name" required className="contact-input" placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label className="contact-label">Work Email</label>
                  <input type="email" name="email" required className="contact-input" placeholder="you@organization.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="contact-label">Organization</label>
                  <input type="text" name="organization" required className="contact-input" placeholder="Company name" />
                </div>
                <div className="form-group">
                  <label className="contact-label">Area of Interest</label>
                  <select name="focus" className="contact-input" required>
                    <option value="">Select focus area</option>
                    <option value="ai-engineering">AI Engineering</option>
                    <option value="cloud">Cloud & Platform Engineering</option>
                    <option value="product">Product Engineering</option>
                    <option value="data">Data & Integration</option>
                    <option value="healthcare">Healthcare / Enterprise Platform</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="contact-label">Tell us about your challenge</label>
                <textarea name="challenge" rows="4" className="contact-input" required placeholder="Briefly describe the challenge, product idea or initiative..." style={{ resize: 'none' }}></textarea>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem 4rem' }}>
                  {isSubmitting ? "Transmitting..." : "Start the Conversation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-modern">
        <motion.div
          className="container"
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3>Let's Build What Comes Next.</h3>
          <p className="mb-8">
            Whether you're exploring AI, modernizing your cloud environment or building your next
            digital product, let's explore what is possible.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn" onClick={() => trackEvent('cta_click', { cta_name: 'Talk to Cognivectra', location: 'Final CTA' })}>
              Talk to Cognivectra
            </Link>
            <Link to="/products" className="btn-outline">Explore Our Products</Link>
          </div>
        </motion.div>
      </section>

      {/* Sticky CTA */}
      <motion.div
        className="sticky-cta-wrap"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={showStickyCTA ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          position: 'fixed',
          bottom: '6rem',
          right: '1.5rem',
          zIndex: 100,
          pointerEvents: showStickyCTA ? 'auto' : 'none'
        }}
      >
        <Link
          to="/#architecture-review"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #a855f7 100%)',
            color: 'white',
            textDecoration: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '30px',
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '0.5px',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            style={{ display: 'inline-block' }}
          >
            <LuArrowRight size={16} />
          </motion.span>
          Talk to Cognivectra
        </Link>
        <motion.div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '30px',
            background: 'var(--accent-primary)',
            zIndex: -1,
            opacity: 0.4
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Demo Request Modal */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        platform={demoPlatform}
      />
    </main>
  );
}
