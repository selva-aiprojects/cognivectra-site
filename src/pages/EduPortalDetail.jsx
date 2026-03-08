import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import eduImg from "../assets/generated/ind-edtech-3d.png";
import ProductLogo from "../components/ProductLogo";
import DemoRequestModal from "../components/DemoRequestModal";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const pricingPlans = [
    {
        name: "Standard",
        price: "$199",
        period: "month",
        description: "Ideal for individual training centers and small setups",
        features: [
            "Up to 10 instructors",
            "Core student management",
            "Course scheduling",
            "Digital assessments",
            "Standard reporting",
            "Email support"
        ],
        highlighted: false
    },
    {
        name: "Campus",
        price: "$499",
        period: "month",
        description: "Optimized for colleges and professional institutions",
        features: [
            "Up to 100 instructors",
            "Advanced learning analytics",
            "AI-powered grading assistant",
            "Video lecture hosting",
            "Automated certification",
            "Priority support",
            "Parent-Student mobile app"
        ],
        highlighted: true
    },
    {
        name: "Institution",
        price: "Custom",
        period: "",
        description: "Enterprise solutions for university networks",
        features: [
            "Unlimited users",
            "Custom LLM integration",
            "Full API access",
            "Dedicated cloud infrastructure",
            "Whitelabel branding",
            "24/7 technical lead",
            "Advanced compliance & security"
        ],
        highlighted: false
    }
];

export default function EduPortalDetail() {
    const { hash } = useLocation();
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

    useEffect(() => {
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
            <Helmet>
                <title>EduPortal | Next-Gen Institution Management & AI Learning</title>
                <meta name="description" content="EduPortal is a scalable, multi-tenant education management platform. Empowering institutions with AI-driven analytics, streamlined administration, and digital learning tools." />
            </Helmet>

            {/* HERO */}
            <section className="hero-modern">
                <div className="hero-modern-inner">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">AI-Powered Education Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="edu" style={{ marginBottom: '1rem' }} />
                            <h1>EduPortal</h1>
                        </div>
                        <p>
                            Next-generation institution management platform. **Reduced manual scheduling time by 15+ hours per week** through intelligent automation and multi-tenant digital administration.
                        </p>
                        <div className="hero-cta">
                            <button onClick={() => setIsDemoModalOpen(true)} className="btn">Book Strategy Call</button>
                            <a
                                href="https://eduportal-new.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                Try Live Demo ↗
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={eduImg} alt="EduPortal Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* KEY FEATURES */}
            <section className="services-modern">
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Academic Excellence</span>
                    <h3>Intelligent Institution Orchestration</h3>
                </motion.div>

                <div className="services-modern-grid">
                    {[
                        {
                            icon: "🎓",
                            title: "Multi-Tenant Hub",
                            desc: "Manage multiple branches or departments under one unified secure architecture"
                        },
                        {
                            icon: "🤖",
                            title: "AI Grading Lead",
                            desc: "Automate subjective and objective assessments with high-accuracy AI assistance"
                        },
                        {
                            icon: "📅",
                            title: "Smart Timetabling",
                            desc: "Resolve complex scheduling conflicts automatically across thousands of students"
                        },
                        {
                            icon: "📊",
                            title: "Learning Analytics",
                            desc: "Deep insights into student performance using predictive modeling"
                        },
                        {
                            icon: "📱",
                            title: "Unified App",
                            desc: "Real-time communication bridge between faculty, students, and parents"
                        },
                        {
                            icon: "🛡️",
                            title: "Enterprise Security",
                            desc: "Cloud-native data protection ensuring student privacy and institutional security"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="service-modern-card glass-panel"
                            {...fadeInUp}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="service-icon-wrapper">{feature.icon}</div>
                            <h4>{feature.title}</h4>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="services-modern">
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Pricing Plans</span>
                    <h3>Structured for Educational Growth</h3>
                </motion.div>

                <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                    {pricingPlans.map((plan, i) => (
                        <motion.div
                            key={i}
                            className={`service-modern-card glass-panel ${plan.highlighted ? 'highlighted-plan' : ''}`}
                            style={{
                                border: plan.highlighted ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}
                        >
                            {plan.highlighted && (
                                <span className="hero-badge" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                                    Recommended
                                </span>
                            )}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>{plan.name}</h4>
                                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                                    {plan.price}
                                    {plan.period && <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/{plan.period}</span>}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{plan.description}</p>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                {plan.features.map((feature, j) => (
                                    <li key={j} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/contact?product=eduportal"
                                className={`btn ${plan.highlighted ? '' : 'btn-outline'}`}
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                {plan.name === 'Institution' ? 'Contact Sales' : 'Get Started'}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Ready to Modernize Your Learning Environment?</h3>
                        <p className="mb-8">
                            Transform your institution with AI-driven management. Schedule your strategy call today.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => setIsDemoModalOpen(true)} className="btn">
                                Book Strategy Call
                            </button>
                            <Link to="/contact" className="btn-outline">
                                View Case Studies
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <DemoRequestModal
                isOpen={isDemoModalOpen}
                onClose={() => setIsDemoModalOpen(false)}
                platform="eduportal"
            />
        </main>
    );
}
