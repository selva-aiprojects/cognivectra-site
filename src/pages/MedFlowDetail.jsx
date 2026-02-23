import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import emrImg from "../assets/generated/ind-health-3d.png";
import ProductLogo from "../components/ProductLogo";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const pricingPlans = [
    {
        name: "Starter",
        price: "$299",
        period: "month",
        description: "Perfect for small clinics and individual practitioners",
        features: [
            "Up to 5 practitioners",
            "Basic patient management",
            "Appointment scheduling",
            "Electronic health records",
            "Basic reporting",
            "Email support"
        ],
        highlighted: false
    },
    {
        name: "Professional",
        price: "$699",
        period: "month",
        description: "Ideal for medium-sized clinics and healthcare centers",
        features: [
            "Up to 25 practitioners",
            "Advanced patient management",
            "AI-powered diagnostic assistance",
            "Telemedicine integration",
            "Billing and insurance processing",
            "Advanced analytics and reporting",
            "Priority support",
            "HIPAA compliance tools"
        ],
        highlighted: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for hospitals and large healthcare networks",
        features: [
            "Unlimited practitioners",
            "All Professional features",
            "Custom workflow automation",
            "Integration with hospital systems",
            "Advanced AI diagnostics",
            "Dedicated infrastructure",
            "On-premise deployment option",
            "24/7 dedicated support",
            "Custom compliance solutions"
        ],
        highlighted: false
    }
];

export default function MedFlowDetail() {
    const { hash } = useLocation();

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
            {/* HERO */}
            <section className="hero-modern">
                <div className="hero-modern-inner">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">Multi-Tenant Healthcare Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="medflow" style={{ marginBottom: '1rem' }} />
                            <h1>MedFlow EMR</h1>
                        </div>
                        <p>
                            Scalable, multi-tenant Electronic Medical Record system built for modern clinics.
                            Currently live with Kidz-Clinic, MedFlow streamlines clinical workflows and patient management.
                        </p>
                        <div className="hero-cta">
                            <a
                                href="https://emr-app-0909.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Try Live Demo ↗
                            </a>
                            <Link to="/contact?product=medflow" className="btn-outline">
                                Request Custom Demo
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
                            <img src={emrImg} alt="MedFlow EMR Dashboard" className="w-full h-full object-cover rounded-xl" />
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
                    <span className="hero-badge">Healthcare Innovation</span>
                    <h3>Comprehensive Clinical Management</h3>
                </motion.div>

                <div className="services-modern-grid">
                    {[
                        {
                            icon: "🏥",
                            title: "Multi-Tenant Architecture",
                            desc: "Scalable platform supporting multiple clinics with secure data isolation"
                        },
                        {
                            icon: "🤖",
                            title: "AI-Powered Diagnostics",
                            desc: "Intelligent diagnostic assistance and treatment recommendations"
                        },
                        {
                            icon: "📅",
                            title: "Smart Scheduling",
                            desc: "Automated appointment management with patient reminders and optimization"
                        },
                        {
                            icon: "🔒",
                            title: "HIPAA Compliant",
                            desc: "Enterprise-grade security and compliance with healthcare regulations"
                        },
                        {
                            icon: "💊",
                            title: "E-Prescriptions",
                            desc: "Digital prescription management with pharmacy integration"
                        },
                        {
                            icon: "📊",
                            title: "Clinical Analytics",
                            desc: "Advanced reporting and insights for improved patient outcomes"
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

            {/* LIVE IMPLEMENTATION */}
            <section className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Live Implementation</span>
                    <h3>Success Story: Kidz-Clinic</h3>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
                        See MedFlow EMR in action with our flagship implementation at Kidz-Clinic.
                    </p>
                </motion.div>

                <div className="hero-modern-inner" style={{ padding: '0 1rem' }}>
                    <motion.div
                        className="glass-panel"
                        style={{ flex: 1, padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
                        {...fadeInUp}
                    >
                        <h4 style={{ marginBottom: '1rem' }}>Kidz-Clinic Implementation</h4>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            A specialized pediatric healthcare platform using MedFlow EMR for digital appointment scheduling,
                            patient resource management, and comprehensive clinical workflows.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://kidz-clinic-client.onrender.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Visit Kidz-Clinic ↗
                            </a>
                            <a
                                href="https://emr-app-0909.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                Access EMR Portal ↗
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="services-modern">
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Pricing Plans</span>
                    <h3>Choose Your Healthcare Solution</h3>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
                        Flexible pricing designed for healthcare providers of all sizes. HIPAA compliant and secure.
                    </p>
                </motion.div>

                <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                    {pricingPlans.map((plan, i) => (
                        <motion.div
                            key={i}
                            className={`service-modern-card glass-panel ${plan.highlighted ? 'highlighted-plan' : ''}`}
                            {...fadeInUp}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                border: plan.highlighted ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}
                        >
                            {plan.highlighted && (
                                <span className="hero-badge" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                                    Most Popular
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
                                to="/contact?product=medflow&plan=${plan.name.toLowerCase()}"
                                className={`btn ${plan.highlighted ? '' : 'btn-outline'}`}
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Ready to Transform Your Clinic Operations?</h3>
                        <p className="mb-8">
                            Get a personalized demo and see how MedFlow EMR can streamline your clinical workflows.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/contact?product=medflow" className="btn">
                                Request Custom Demo
                            </Link>
                            <a
                                href="https://emr-app-0909.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                Try Live Platform
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
