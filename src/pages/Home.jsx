import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  LuRocket,
  LuShield,
  LuBrain,
  LuLayers,
  LuTarget,
  LuCloud,
  LuTrendingUp,
  LuActivity,
  LuArrowRight,
  LuBuilding2,
  LuCpu
} from "react-icons/lu";
import heroMain from "../assets/generated/hero-home-ultra-8k.png";
import clientEduImg from "../assets/generated/ind-edtech-3d.png";
import clientKidzImg from "../assets/generated/ind-health-3d.png";
import DemoRequestModal from "../components/DemoRequestModal";
import { useState, useEffect } from "react";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase";
import ArchitectureMap from "../components/ArchitectureMap";

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
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const handleDemoRequest = (platform = 'general') => {
    trackEvent('cta_click', { platform, cta_name: 'Request Demo', location: 'Home' });
    setDemoPlatform(platform);
    setIsDemoModalOpen(true);
  };

  useEffect(() => {
    async function fetchLatestPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setLatestPosts(data);
      }
      setLoadingPosts(false);
    }
    fetchLatestPosts();
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
        <title>CogniVectra | Elite GenAI, Cloud & Healthcare Platform Engineering</title>
        <meta name="description" content="CogniVectra delivers production-ready GenAI foundations, scalable Healthcare EMR, and expert Cloud-native engineering for modern enterprises and startups." />
        <meta name="keywords" content="Enterprise GenAI, Healthcare EMR, Cloud Architecture, DevOps Automation, Multi-tenant SaaS, CogniVectra, AI Platform Engineering" />
        <meta property="og:title" content="CogniVectra | Elite GenAI & Healthcare Platforms" />
        <meta property="og:description" content="Production-ready GenAI foundations and scalable Healthcare platforms for modern enterprises." />
        <meta property="og:url" content="https://cognivectra.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cognivectra.com/og-image.png" />
      </Helmet>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="hero-badge">Enterprise-Grade Architecture</motion.span>
            <h1 style={{ opacity: 1, transform: 'none' }}>
              Enterprise GenAI and Healthcare Platforms <br />Ready for Deployment
            </h1>
            <motion.p variants={fadeInUp}>
              Cognivectra builds production-ready EMR systems, multi-tenant SaaS platforms,
              and enterprise GenAI solutions designed for healthcare, education, and modern enterprises.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <div className="hero-cta">
                <Link to="/contact" className="btn" onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Hero' })}>
                  Book Strategy Call
                </Link>
                <Link to="/#services" className="btn-outline">
                  Explore Solutions
                </Link>
              </div>
            </motion.div>
          </motion.div> {/* Closing tag for hero-copy */}

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

      {/* NEW: INTERACTIVE ARCHITECTURE MAP */}
      <section className="architecture-section relative z-10">
        <ArchitectureMap />
      </section>

      {/* ARCHITECTURE REVIEW FORM SECTION */}
      <section id="architecture-review" className="services-modern" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="login-grid" style={{ opacity: 0.2 }} />
        <div className="container">
          <div className="glass-panel" style={{ padding: '4rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="hero-badge">Strategic Engagement</span>
              <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Request a 30-Minute Architecture Review</h2>
              <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                Bypass the sales pitch. Get a direct technical deep-dive with our platform architects to map your roadmap and identify GenAI integration points.
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
                  <label className="contact-label">Current Focus</label>
                  <select name="focus" className="contact-input" required>
                    <option value="">Select focus area</option>
                    <option value="healthcare">Healthcare / EMR Systems</option>
                    <option value="fintech">FinTech / Trading</option>
                    <option value="retail">Retail / AI Automation</option>
                    <option value="enterprise">General Enterprise AI</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="contact-label">Primary Challenge</label>
                <textarea name="challenge" rows="4" className="contact-input" required placeholder="Briefly describe the challenge or goal for this session..." style={{ resize: 'none' }}></textarea>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem 4rem' }}>
                  {isSubmitting ? "Transmitting..." : "Secure My Review Session"}
                </button>
                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  ✨ Limited to 2 technical reviews per week for non-clients.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* PLATFORM CREDIBILITY STRIP */}
      <motion.section
        className="trust-modern"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2, 6, 23, 0.8)' }}
      >
        <div className="container" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Production-Ready Enterprise Platforms</h4>
          <div className="trust-modern-inner" style={{ justifyContent: 'space-around', gap: '2rem' }}>
            <div style={{ fontSize: '0.95rem' }}><strong style={{ color: 'white', display: 'block' }}>MedFlow EMR</strong> AI-powered healthcare platform</div>
            <div style={{ fontSize: '0.95rem' }}><strong style={{ color: 'white', display: 'block' }}>StoreAI</strong> Enterprise GenAI platform</div>
            <div style={{ fontSize: '0.95rem' }}><strong style={{ color: 'white', display: 'block' }}>EduPortal</strong> AI-powered education platform</div>
            <div style={{ fontSize: '0.95rem' }}><strong style={{ color: 'white', display: 'block' }}>StewardPlatform</strong> Multi-tenant SaaS foundation</div>
          </div>
        </div>
      </motion.section>

      {/* PARTNER ICP STRIP */}
      <section className="icp-strip glass-panel" style={{ margin: '0 auto', maxWidth: '1200px', borderRadius: '100px', padding: '1rem 2rem', marginBottom: '4rem' }}>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Who we partner with:</span>
          {['Healthcare Providers', 'Health-tech Startups', 'Enterprise Innovation', 'FinTech Platforms'].map((icp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ fontSize: '0.95rem', fontWeight: '500', color: 'white' }}
            >
              {icp}
            </motion.div>
          ))}
        </div>
      </section>
      {/* TRUST BAR (LEGACY STATS) */}
      <motion.section
        className="trust-modern"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ paddingTop: 0 }}
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
          <span className="hero-badge">Enterprise Strategy</span>
          <h3>Engineering Excellence</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            We provide high-impact enterprise platform engineering and strategic leadership
            to help organizations deploy resilient, GenAI-powered systems at scale.
          </p>
          <p style={{ color: "var(--accent-primary)", fontWeight: "600", marginTop: "1rem" }}>
            We help enterprises move from prototype GenAI tools to secure, production platforms in weeks, not months.
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
            { icon: <LuTarget />, title: "Enterprise Strategy", desc: "Executive-level technical leadership and architecture to align technology with your enterprise goals.", highlights: ["Strategic Roadmap Planning", "Platform Governance", "Technology Stack Selection"] },
            { icon: <LuCloud />, title: "Cloud Scale Architecture", desc: "Cloud-native infrastructure and CI/CD pipelines that enable your organization to scale safely.", highlights: ["Enterprise Cloud Migration", "Kubernetes Orchestration", "Security Hardening"] },
            { icon: <LuBrain />, title: "GenAI Integration", desc: "Integrating production-ready GenAI workflows to automate enterprise tasks and create intelligent systems.", highlights: ["Enterprise LLM Deployment", "Process Automation", "AI-First Architectures"] },
            { icon: <LuLayers />, title: "Multi-tenant SaaS", desc: "Building the core foundation for your SaaS products that is secure, multi-tenant, and enterprise-grade.", highlights: ["Scalable SaaS Architecture", "API Ecosystem Design", "Global Edge Distribution"] }
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
          <span className="hero-badge">Enterprise Platforms</span>
          <h3>Production-Ready Platforms</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
            We have already built and deployed enterprise-grade systems for healthcare, retail, and education.
          </p>
        </motion.div>

        <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production Ready</span>
            <h4>StoreAI</h4>
            <p>Enterprise GenAI platform for retail management with predictive analytics and multi-tenant architecture.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/storeai" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('storeai')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Request Demo
              </button>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production Ready</span>
            <h4>EduPortal</h4>
            <p>AI-powered education platform designed for enterprise scale with multi-tenant deployment capabilities.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/eduportal" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('eduportal')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Live Deployment</span>
            <h4>MedFlow EMR</h4>
            <p>Enterprise healthcare EMR platform with GenAI-enabled capabilities for production environments.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/medflow" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('medflow')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Enterprise Core</span>
            <h4>StewardPlatform</h4>
            <p>Foundational multi-tenant SaaS architecture (part of the StockSteward suite) for building secure, scalable enterprise systems. <br /><span style={{ fontSize: '0.85rem', opacity: 0.8, color: 'var(--accent-primary)' }}>StewardPlatform powers the StockSteward suite for fintech and trading.</span></p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/stocksteward" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('steward')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LATEST INSIGHTS (NEW) */}
      {!loadingPosts && latestPosts.length > 0 && (
        <section className="services-modern">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="hero-badge">Technical Deep-Dives</span>
            <h3>Latest from Our Blog</h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
              Practical insights on cloud infrastructure, AI automation, and enterprise engineering.
            </p>
          </motion.div>

          <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="service-modern-card glass-panel blog-card-mini"
                style={{ textDecoration: 'none' }}
              >
                <div style={{ marginBottom: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{post.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {post.excerpt}
                </p>
                <div className="btn-text">Read Article →</div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/blog" className="btn-outline">View All Insights</Link>
          </div>
        </section>
      )}

      {/* CAREER CALLOUT (NEW) */}
      <section className="why-modern" style={{ background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
        <div className="why-modern-inner" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="hero-badge" style={{ background: 'var(--accent-primary)', color: 'white' }}>Strategic Hiring Open</span>
          </div>
          <h3>Join Our Technical Vision</h3>
          <p style={{ maxWidth: '700px', margin: '1rem auto 3rem', color: 'var(--text-secondary)' }}>
            We're building the infrastructure of the future. If you're passionate about GenAI,
            cloud architecture, and startup speed, we want to hear from you.
          </p>
          <div className="why-modern-grid" style={{ justifyContent: 'center' }}>
            <Link to="/careers" className="btn" style={{ padding: '1rem 2.5rem' }}>
              View Career Opportunities
            </Link>
          </div>
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
              Next-generation institution management. **Reduced manual scheduling by 40%** through intelligent automation.
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
              Specialized pediatric healthcare platform. **Improved patient throughput by 22% and handled 10k+ monthly appointments** using MedFlow's smart scheduling.
            </p>
            <a href="https://kidz-clinic-client.onrender.com" target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 'auto' }}>
              Visit Clinic →
            </a>
          </motion.div>

          {/* Client 3: Dr. S.T. Pushpa */}
          <motion.div
            className="glass-panel"
            style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/favicon.svg" alt="Dr. S.T. Pushpa" style={{ height: '80px', width: 'auto', opacity: 0.8 }} />
            </div>
            <h4>Dr. S.T. Pushpa</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', flexGrow: 1 }}>
              Bangalore's leading paediatrician leveraging MedFlow EMR for compassionate care and efficient practice management.
            </p>
            <a href="https://drstpushpa.com/" target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 'auto' }}>
              Visit drstpushpa.com →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ENTERPRISE ARCHITECTURE SECTION */}
      <section className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.3)' }}>
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="hero-badge">Enterprise Standards</span>
          <h3>Enterprise-Grade Architecture</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
            Our platforms are built on a foundation of security, scalability, and modern AI integration architecture.
          </p>
        </motion.div>

        <div className="services-modern-grid">
          {[
            { title: "Multi-tenant SaaS Architecture", desc: "Securely scale to thousands of organizations with isolated data environments and unified management.", icon: <LuBuilding2 /> },
            { title: "Secure Cloud-Native Deployment", desc: "Automated provisioning and orchestration across major cloud providers with zero-trust security.", icon: <LuShield /> },
            { title: "Enterprise Scalability", desc: "Systems designed to handle extreme transaction volumes and large-scale data processing effortlessly.", icon: <LuTrendingUp /> },
            { title: "GenAI Integration Architecture", desc: "Production-ready pipelines for LLM orchestration, RAG, and agentic workflows.", icon: <LuCpu /> },
            { title: "Healthcare Platform Expertise", desc: "HIPAA-compliant data handling and interoperability standards for reliable healthcare delivery.", icon: <LuActivity /> }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="service-modern-card glass-panel" style={{ padding: '2rem' }}>
              <div className="service-icon-wrapper" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h4>{item.title}</h4>
              <p style={{ fontSize: '0.95rem' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION REWRITE */}
      <section className="services-modern">
        <div className="hero-modern-inner" style={{ padding: 0 }}>
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="hero-badge">Who We Are</span>
            <h3>Enterprise AI & Healthcare Platform Engineering</h3>
            <p>
              Cognivectra is an enterprise AI and healthcare platform engineering company
              specializing in production-ready EMR systems, multi-tenant SaaS platforms,
              and enterprise GenAI integration. We help organizations move from pilot GenAI projects to secure, production-grade platforms in weeks, not months.
            </p>
            <p>
              The company focuses on building secure, scalable platforms
              designed for real-world enterprise deployment.
            </p>
            <Link to="/who-we-are" className="btn">Learn More About Us</Link>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="service-modern-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3.5rem', color: 'var(--accent-primary)', fontWeight: '800' }}>25+</div>
              <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Years of Industry Leadership</p>
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
          <h3>Ready to Deploy Enterprise GenAI or Healthcare Platform?</h3>
          <p className="mb-8">
            Connect with our architects to discuss your production-ready deployment strategy.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn">
              Book Strategy Call
            </Link>
          </div>
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
