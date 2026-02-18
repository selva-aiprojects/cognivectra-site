import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import storeAIImg from "../assets/generated/product-storeai.png";
import ProductLogo from "../components/ProductLogo";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const pricingPlans = [
    {
        name: "Basic",
        price: "$149",
        period: "month",
        description: "Perfect for small retail stores and boutiques",
        features: [
            "Up to 100 SKUs",
            "Basic inventory tracking",
            "Sales analytics dashboard",
            "Mobile app access",
            "Email support"
        ],
        highlighted: false
    },
    {
        name: "Professional",
        price: "$399",
        period: "month",
        description: "Ideal for growing retail chains and multi-store operations",
        features: [
            "Unlimited SKUs",
            "Advanced AI-powered inventory optimization",
            "Predictive sales forecasting",
            "Customer behavior analytics",
            "Multi-store management",
            "API access",
            "Priority support"
        ],
        highlighted: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for large retail enterprises",
        features: [
            "All Professional features",
            "Custom AI model training",
            "White-label mobile app",
            "Advanced supply chain integration",
            "Dedicated account manager",
            "On-premise deployment option",
            "Custom reporting and analytics"
        ],
        highlighted: false
    }
];

export default function StoreAIDetail() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
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
                        <span className="hero-badge">Retail Intelligence</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="store" style={{ marginBottom: '1rem' }} />
                            <h1>StoreAI</h1>
                        </div>
                        <p>
                            Revolutionary AI-powered retail management system that transforms how stores operate.
                            From automated inventory tracking to predictive sales analytics and customer insights.
                        </p>
                        <div className="hero-cta">
                            <a
                                href="https://store-ai-prd.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Try Live Demo ↗
                            </a>
                            <Link to="/contact?product=storeai" className="btn-outline">
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
                            <img src={storeAIImg} alt="StoreAI Dashboard" className="w-full h-full object-cover rounded-xl" />
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
                    <span className="hero-badge">Smart Retail Features</span>
                    <h3>Transform Your Store Operations</h3>
                </motion.div>

                <div className="services-modern-grid">
                    {[
                        {
                            icon: "🤖",
                            title: "AI Inventory Management",
                            desc: "Automated stock tracking with predictive replenishment and optimization suggestions"
                        },
                        {
                            icon: "📊",
                            title: "Sales Forecasting",
                            desc: "Advanced machine learning models predict demand and optimize inventory levels"
                        },
                        {
                            icon: "👥",
                            title: "Customer Analytics",
                            desc: "Deep insights into customer behavior, preferences, and purchasing patterns"
                        },
                        {
                            icon: "📱",
                            title: "Mobile Management",
                            desc: "Complete store management from anywhere with our intuitive mobile app"
                        },
                        {
                            icon: "🔄",
                            title: "Supply Chain Sync",
                            desc: "Seamless integration with suppliers and automated purchase order generation"
                        },
                        {
                            icon: "📈",
                            title: "Real-time Dashboards",
                            desc: "Comprehensive analytics and reporting for data-driven decision making"
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
            <section id="pricing" className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Pricing Plans</span>
                    <h3>Choose Your Retail Intelligence Level</h3>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
                        Flexible pricing designed to grow with your retail business. Start with our 14-day free trial.
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
                                to="/contact?product=storeai&plan=${plan.name.toLowerCase()}" 
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
                        <h3>Ready to Revolutionize Your Retail Operations?</h3>
                        <p className="mb-8">
                            Get a personalized demo and see how StoreAI can transform your store management and boost sales.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/contact?product=storeai" className="btn">
                                Request Custom Demo
                            </Link>
                            <a
                                href="https://store-ai-prd.onrender.com/"
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
