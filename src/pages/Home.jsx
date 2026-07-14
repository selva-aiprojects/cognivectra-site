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
  LuCpu,
  LuDatabase,
  LuNetwork,
  LuUsers,
  LuHotel
} from "react-icons/lu";
import {
  SiAmazonwebservices,
  SiGooglecloud,
  SiKubernetes,
  SiOpenai,
  SiSupabase
} from "react-icons/si";
import heroMain from "../assets/generated/hero-home-ultra-8k.png";
import clientEduImg from "../assets/generated/ind-edtech-3d.png";
import clientKidzImg from "../assets/generated/ind-health-3d.png";
import flowBusiness from "../assets/generated/flow-business.png";
import flowDevOps from "../assets/generated/flow-devops.png";
import flowCloud from "../assets/generated/flow-cloud.png";
import flowModernization from "../assets/generated/flow-modernization.png";
import flowUnique from "../assets/generated/flow-unique.png";
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

  const [showStickyCTA, setShowStickyCTA] = useState(false);

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
        <title>CogniVectra | GenAI & Healthcare EMR Platform Engineering</title>
        <meta name="description" content="CogniVectra builds production‑ready GenAI, EMR, and cloud platforms for healthcare, education, and fintech organizations." />
        <meta name="keywords" content="GenAI healthcare, EMR platform, cloud-native EMR, multi-tenant SaaS, algorithmic trading consulting, CogniVectra" />
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
            <span className="hero-badge">Cognivectra</span>
            <h1>Engineering the Future <br />with Artificial Intelligence</h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', opacity: 0.9 }}>
              Transforming Ideas into Intelligent AI Systems
            </motion.p>
            <motion.div variants={fadeInUp}>
              <div className="cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn" onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Hero' })}>
                  Book Strategy Call
                </Link>
                <Link to="/contact" className="btn-outline" onClick={() => trackEvent('cta_click', { cta_name: 'Build with AI', location: 'Hero' })}>
                  Build with AI
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

        {/* TRUST STRIP - SILICON VALLEY STYLE */}
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

      {/* NEW: SOLUTIONS ARCHITECTURE SLIDER */}
      <section className="solutions-architecture" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', padding: 'var(--spacing-section) 0' }}>
        <div className="neural-pattern" style={{ opacity: 0.1 }} />
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="hero-badge">Enterprise Flows</span>
            <h3>Visualizing the Transformation</h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
              Our architecture flows are designed to bridge the gap between complex legacy challenges and modern, AI-driven excellence.
            </p>
          </motion.div>

          <div className="relative" style={{ width: '100%', overflow: 'hidden' }}>
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '2rem',
                cursor: 'grab',
                padding: '2rem 1rem'
              }}
              drag="x"
              dragConstraints={{ left: -1400, right: 0 }}
            >
              {[
                {
                  title: "Business Problem to AI Solution",
                  desc: "Bridging the gap between manual data silos and intelligent AI orchestration for predictable growth.",
                  example: "Example: Turning manual claims review into an AI-assisted automated workflow.",
                  img: flowBusiness,
                  color: "rgba(79, 70, 229, 0.15)",
                  accentColor: "#6366f1",
                  steps: ["Problem", "Data", "AI Model", "Insights", "Action"]
                },
                {
                  title: "Enterprise DevOps Pipeline",
                  desc: "Automated, AI-enhanced CI/CD flows with Kubernetes orchestration and secure IaC deployment.",
                  example: "Example: Moving from slow manual releases to secure, zero-touch daily deployments.",
                  img: flowDevOps,
                  color: "rgba(16, 185, 129, 0.15)",
                  accentColor: "#22c55e",
                  steps: ["Code", "Build", "Test", "Deploy", "Monitor"]
                },
                {
                  title: "Cloud Strategy & Migration",
                  desc: "Seamlessly migrating legacy infrastructure to distributed, resilient, and multi-cloud architectures.",
                  example: "Example: Transitioning expensive on-premise servers to scalable AWS/GCP clusters.",
                  img: flowCloud,
                  color: "rgba(14, 165, 233, 0.15)",
                  accentColor: "#0ea5e9",
                  steps: ["Legacy", "Assess", "Migrate", "Optimize", "Cloud Ops"]
                },
                {
                  title: "IT Modernization with AI",
                  desc: "Systematic modernization of monolithic technical debt into scalable, high-performing AI-native systems.",
                  example: "Example: Replacing a tangled monolith with nimble AI microservices.",
                  img: flowModernization,
                  color: "rgba(245, 158, 11, 0.15)",
                  accentColor: "#f59e0b",
                  steps: ["Monolith", "API Layer", "Services", "AI Ops", "Scale"]
                },
                {
                  title: "Solving Unique Business Problems",
                  desc: "Custom AI blueprints designed for your specific, non-trivial industry challenges and edge cases.",
                  example: "Example: Building a specialized clinical trial matching model.",
                  img: flowUnique,
                  color: "rgba(236, 72, 153, 0.15)",
                  accentColor: "#ec4899",
                  steps: ["Challenge", "Blueprint", "AI Build", "Integrate", "ROI"]
                }
              ].map((flow, i) => (
                <motion.div
                  key={i}
                  className="glass-panel"
                  style={{
                    width: '500px',
                    flexShrink: 0,
                    padding: '2.5rem',
                    borderRadius: '32px',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${flow.color} 100%)`,
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                    overflow: 'hidden'
                  }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.9, x: 100 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <div style={{
                    height: '220px',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    marginBottom: '1.5rem',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                    position: 'relative'
                  }}>
                    <div className="gradient-overlay" style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%)',
                      zIndex: 1
                    }} />
                    <motion.img
                      src={flow.img}
                      alt={flow.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1, rotate: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <h4 style={{
                    fontSize: '1.4rem',
                    marginBottom: '1rem',
                    color: 'white',
                    fontWeight: '700',
                    letterSpacing: '-0.01em'
                  }}>{flow.title}</h4>

                  {/* Horizontal Flow Arrow Strip */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    marginBottom: '1.2rem',
                    padding: '0.8rem 1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: `1px solid ${flow.accentColor}22`,
                    overflowX: 'auto'
                  }}>
                    {flow.steps.map((step, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: si * 0.08 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: flow.accentColor,
                            boxShadow: `0 0 8px ${flow.accentColor}88`,
                            flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '0.6rem',
                            color: 'white',
                            opacity: 0.8,
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>{step}</span>
                        </motion.div>

                        {si < flow.steps.length - 1 && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0 0.4rem',
                            marginBottom: '0.9rem'
                          }}>
                            <div style={{
                              width: '28px',
                              height: '1.5px',
                              background: `linear-gradient(90deg, ${flow.accentColor}66, ${flow.accentColor}cc)`,
                              position: 'relative'
                            }}>
                              <motion.div
                                style={{
                                  position: 'absolute',
                                  top: '-2.5px',
                                  left: 0,
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: flow.accentColor
                                }}
                                animate={{ left: ['0%', '100%'] }}
                                transition={{
                                  duration: 1.5,
                                  delay: si * 0.3 + i * 0.2,
                                  repeat: Infinity,
                                  ease: 'linear'
                                }}
                              />
                            </div>
                            {/* Arrow tip */}
                            <div style={{
                              width: 0,
                              height: 0,
                              borderTop: '4px solid transparent',
                              borderBottom: '4px solid transparent',
                              borderLeft: `6px solid ${flow.accentColor}cc`,
                              marginLeft: '-1px',
                              marginBottom: '0.9rem'
                            }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    opacity: 1,
                    marginBottom: '0.8rem'
                  }}>{flow.desc}</p>

                  <p style={{
                    fontSize: '0.85rem',
                    color: '#10b981', // green for outcome/impact
                    lineHeight: '1.5',
                    opacity: 0.9,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    borderLeft: `2px solid ${flow.accentColor}`
                  }}>
                    <strong style={{ color: 'white', marginRight: '4px' }}>Outcome:</strong>
                    {flow.example.replace('Example: ', '')}
                  </p>
                </motion.div>
              ))}
            </motion.div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.85rem', opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase' }}>
              ← Swipe to see our Architectural Workflows →
            </div>
          </div>
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
                  {isSubmitting ? "Transmitting..." : "Book Strategy Call"}
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
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(2, 6, 23, 0.8)',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h4 style={{
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
              margin: 0
            }}>Production-Ready Enterprise Platforms</h4>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            {[
              { name: "Healthezee", desc: "AI-powered healthcare platform", icon: <LuActivity size={24} /> },
              { name: "StoreAI", desc: "Enterprise GenAI platform", icon: <LuTrendingUp size={24} /> },
              { name: "EduPortal", desc: "AI-powered education platform", icon: <LuBrain size={24} /> },
              { name: "StewardPlatform", desc: "Multi-tenant SaaS foundation", icon: <LuShield size={24} /> },
              { name: "CogniHRMS", desc: "AI-driven workforce & HR platform", icon: <LuUsers size={24} /> },
              { name: "Hospitality eHMS", desc: "Smart hotel & resort management", icon: <LuHotel size={24} /> }
            ].map((platform, i) => (
              <motion.div
                key={i}
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ y: -5, borderColor: 'var(--accent-light)', boxShadow: '0 15px 30px -5px rgba(0,0,0,0.3)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{
                  padding: '2.5rem 1.5rem',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'default'
                }}
              >
                <div style={{
                  color: 'var(--accent-primary)',
                  marginBottom: '1.5rem',
                  background: 'rgba(79, 70, 229, 0.1)',
                  padding: '1.25rem',
                  borderRadius: '50%',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}>
                  {platform.icon}
                </div>
                <h5 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.75rem', fontWeight: '600' }}>
                  {platform.name}
                </h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {platform.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PARTNER ICP STRIP */}
      <section className="icp-strip" style={{ margin: '0 auto', maxWidth: '1200px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem', fontWeight: '700' }}>Who We Partner With</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          {[
            { name: 'Healthcare Providers', icon: <LuActivity size={20} /> },
            { name: 'Health-tech Startups', icon: <LuRocket size={20} /> },
            { name: 'Enterprise Innovation', icon: <LuBuilding2 size={20} /> },
            { name: 'FinTech Platforms', icon: <LuTrendingUp size={20} /> }
          ].map((icp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -3, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'white',
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem 1.75rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                cursor: 'default'
              }}
            >
              <div style={{ color: 'var(--accent-light)' }}>{icp.icon}</div>
              {icp.name}
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
        style={{ paddingTop: 0, paddingBottom: '4rem' }}
      >
        <div className="container" style={{ padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem 2rem',
            background: 'linear-gradient(145deg, rgba(2, 6, 23, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {[
              { value: "25+", label: "Years Experience" },
              { value: "40+", label: "Platforms Built" },
              { value: "12+", label: "Countries Served" },
              { value: "99.9%", label: "System Reliability" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <section id="services" className="services-modern section-transition-wrap">
        <div className="neural-pattern" />
        <motion.div
          className="section-header"
          style={{ textAlign: "center", marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge">Silicon Valley Standard</span>
          <h3>Intelligence-Driven Platforms</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            We capitalize on the latest AI breakthroughs to build production-ready systems
            that scale with enterprise-grade reliability.
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
            { icon: <LuBrain />, title: "GenAI Solutions", desc: "Build agentic workflows and intelligent copilots with RAG and LLM orchestration.", highlights: ["Agentic Workflows", "Custom RAG Pipelines", "Model Governance"] },
            { icon: <LuLayers />, title: "Enterprise DevOps", desc: "AI-enhanced CI/CD, containerization, and IaC for high-frequency deployment.", highlights: ["Kubernetes (EKS/GKE)", "Infrastructure as Code", "Security Scanning"] },
            { icon: <LuCloud />, title: "Cloud Migrations", desc: "Seamless legacy-to-cloud transitions with zero-downtime and multi-cloud strategies.", highlights: ["Modernization Strategy", "Multi-Cloud Setup", "Cost Optimization"] }
          ].map((service, i) => (
            <motion.div key={i} variants={fadeInUp} className="service-modern-card glass-panel">
              <div className="service-icon-wrapper">{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
              <ul className="service-highlights" style={{ paddingLeft: '1.2rem' }}>
                {service.highlights.map((h, j) => <li key={j} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="services-modern section-transition-wrap" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
        <div className="neural-pattern" />
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
            <h4>Healthezee</h4>
            <p>Enterprise healthcare EMR platform with GenAI-enabled capabilities for production environments.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products/healthezee" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <button onClick={() => handleDemoRequest('healthezee')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Request Demo</button>
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
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production Ready</span>
            <h4>CogniHRMS</h4>
            <p>Next-generation Human Resource Management System powered by AI for automated recruitment, attendance, and employee analytics.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products#cognihrms" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <a href="https://cognihr.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Launch Portal ↗</a>
            </div>
          </motion.div>
          <motion.div
            className="service-modern-card glass-panel"
            whileHover={{ y: -5 }}
          >
            <span className="hero-badge" style={{ fontSize: '0.7rem' }}>Production Ready</span>
            <h4>Hospitality Management (eHMS)</h4>
            <p>Smart hospitality and property management platform engineered for hotels, resort chains, and automated guest concierge intelligence.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/products#hospitality" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Learn More</Link>
              <a href="https://ehms-app-eta.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Launch Portal ↗</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LATEST INSIGHTS (NEW) */}
      {
        !loadingPosts && latestPosts.length > 0 && (
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

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/blog" className="btn-outline">View All Insights</Link>
            </div>
          </section>
        )
      }

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

        <div className="relative" style={{ maxWidth: '1000px', margin: '0 auto', overflow: 'hidden', padding: '1rem' }}>
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1.5rem',
              cursor: 'grab'
            }}
            drag="x"
            dragConstraints={{ left: -800, right: 0 }}
          >
            {[
              {
                img: clientEduImg,
                title: "EduPortal",
                challenge: "Inefficient institution management with heavy manual scheduling overhead.",
                solution: "Implemented scalable intelligent automation.",
                impact: "Reduced manual scheduling by 40%.",
                link: "https://cogni-lms.vercel.app/",
                linkText: "Visit Platform →"
              },
              {
                img: clientKidzImg,
                title: "Kidz Clinic",
                challenge: "Bottlenecks in specialized pediatric patient load and scheduling.",
                solution: "Deployed Healthezee smart scheduling & EMR system.",
                impact: "Improved patient throughput by 22%.",
                link: "https://www.whitekraaft.com/",
                linkText: "Visit Partner"
              },
              {
                title: "drstpushpa.com",
                challenge: "Balancing busy practice management without losing focus on pediatric care.",
                solution: "Leveraged custom Healthezee operational tools.",
                impact: "Streamlined care for thousands of patients.",
                link: "https://drstpushpa.com/",
                linkText: "Visit Site",
                isCustom: true
              },
              {
                title: "Whitekraft",
                challenge: "Needed an enterprise-ready healthcare platform partner for scalable digital operations.",
                solution: "Partnered on Healthezee-powered healthcare workflows and enterprise platform delivery.",
                impact: "Enabled a stronger foundation for production healthcare operations.",
                link: "https://www.whitekraaft.com/",
                linkText: "Visit Partner",
                isCustom: true
              }
            ].map((client, i) => (
              <motion.div
                key={i}
                className="glass-panel"
                style={{
                  width: '320px',
                  flexShrink: 0,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
                whileHover={{ y: -5 }}
              >
                <div style={{ height: '160px', overflow: 'hidden', borderRadius: '0.75rem', marginBottom: '0.5rem', background: client.isCustom ? 'rgba(255,255,255,0.02)' : 'transparent', display: client.isCustom ? 'flex' : 'block', alignItems: 'center', justifyContent: 'center' }}>
                  {client.isCustom ? (
                    <img src="/favicon.svg" alt={client.title} style={{ height: '60px', width: 'auto', opacity: 0.8 }} />
                  ) : (
                    <img src={client.img} alt={client.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{client.title}</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flexGrow: 1 }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Challenge</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>{client.challenge}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Solution</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>{client.solution}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Impact</span>
                    <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: '600', margin: '0.2rem 0 0' }}>{client.impact}</p>
                  </div>
                </div>

                <a href={client.link} target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 'auto', fontSize: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {client.linkText}
                </a>
              </motion.div>
            ))}
          </motion.div>
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
            ← Drag to explore →
          </div>
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
            { title: "GenAI & LLM Orchestration", desc: "Production-ready pipelines for RAG, agentic workflows, and model security.", icon: <LuCpu /> },
            { title: "DevOps Excellence", desc: "Global-scale CI/CD, K8s orchestration, and automated infrastructure as code.", icon: <LuNetwork /> },
            { title: "Cloud Modernization", desc: "Legacy migration paths to modern cloud-native architectures with zero downtime.", icon: <LuCloud /> },
            { title: "Multi-tenant SaaS Foundation", desc: "Securely scale to thousands of organizations with isolated data environments.", icon: <LuBuilding2 /> },
            { title: "Healthcare Data Compliance", desc: "HIPAA-compliant platforms with deep EMR and interoperability expertise.", icon: <LuActivity /> }
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
      {/* Sticky CTA (Raised to avoid chat widget, styled to be compact and catchy) */}
      <motion.div
        className="sticky-cta-wrap"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={showStickyCTA ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          position: 'fixed',
          bottom: '6rem', // Raised above typical chat widget height
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
            🚀
          </motion.span>
          Review Architecture
        </Link>
        {/* Subtle pulsing glow ring behind it */}
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
    </main >
  );
}

