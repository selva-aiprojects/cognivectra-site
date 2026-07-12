import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import stewardImg from "../assets/generated/product-stocksteward.png";
import ProductLogo from "../components/ProductLogo";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const pricingPlans = [
    {
        name: "Starter",
        price: "$99",
        period: "month",
        description: "Perfect for individual traders and small portfolios",
        features: [
            "Up to 10 portfolio connections",
            "Basic AI market analysis",
            "Real-time price alerts",
            "Monthly performance reports",
            "Email support"
        ],
        highlighted: false
    },
    {
        name: "Professional",
        price: "$299",
        period: "month",
        description: "Ideal for active traders and investment firms",
        features: [
            "Unlimited portfolio connections",
            "Advanced AI market sentiment analysis",
            "Algorithmic trading automation",
            "Real-time risk assessment",
            "Custom trading strategies",
            "Priority support",
            "API access"
        ],
        highlighted: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for hedge funds and institutions",
        features: [
            "All Professional features",
            "Dedicated infrastructure",
            "Custom AI model training",
            "White-label solutions",
            "On-premise deployment option",
            "24/7 dedicated support",
            "Custom integrations"
        ],
        highlighted: false
    }
];

export default function StockStewardDetail() {
    const { hash } = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleQuickDemo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const email = e.target.email.value;
        const org = e.target.organization.value;

        trackEvent('lead_generated', {
            type: 'quick_demo_detail',
            platform: 'stocksteward',
            organization: org
        }, 'CONVERSION');

        await supabase.from("chat_conversations").upsert([
            {
                user_name: "Quick Demo Lead",
                user_email: email,
                company: org,
                stage: "stocksteward",
                challenge: "(Quick Demo Inquiry from StockSteward Detail Page)",
                source: "product_stocksteward_detail",
                lead_score: "hot",
                updated_at: new Date().toISOString(),
            },
        ], { onConflict: "user_email" });

        alert("Request received! Our team will contact you shortly.");
        e.target.reset();
        setIsSubmitting(false);
    };

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
                <title>StockSteward AI | Algorithmic Trading Intelligence</title>
                <meta name="description" content="Sophisticated algorithmic trading and market intelligence platform powered by advanced AI. High-performance fintech infrastructure." />
                <meta name="keywords" content="algorithmic trading consulting, fintech AI, market intelligence, StockSteward, AI trading platform" />
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
                        <span className="hero-badge">AIEngine Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="steward" style={{ marginBottom: '1rem' }} />
                            <h1>StockSteward AI Platform</h1>
                        </div>
                        <p>
                            Sophisticated algorithmic trading and market intelligence platform powered by advanced AI.
                            Make data-driven investment decisions with real-time insights and automated portfolio management.
                        </p>

                        <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Request a Live Demo</h4>
                            <form onSubmit={handleQuickDemo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    <input type="text" name="organization" placeholder="Org" required style={{ width: '120px', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                                    {isSubmitting ? "Processing..." : "Schedule My Demo"}
                                </button>
                            </form>
                            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                ⚡ Deployment-ready instances available today.
                            </p>
                        </div>

                        <div className="hero-cta">
                            <Link to="/contact?product=stocksteward" className="btn">
                                Book Strategy Call
                            </Link>
                            <a
                                href="https://stocksteward-ai.vercel.app/login"
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
                    >           <div className="industry-visual glass-panel">
                            <img src={stewardImg} alt="StockSteward Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* KEY FEATURES */}
            < section className="services-modern" >
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Powerful Features</span>
                    <h3>Everything You Need for Smart Trading</h3>
                </motion.div>

                <div className="services-modern-grid">
                    {[
                        {
                            icon: "🤖",
                            title: "AI-Powered Analysis",
                            desc: "Advanced LLM integration for market sentiment analysis and predictive modeling"
                        },
                        {
                            icon: "📊",
                            title: "Real-time Analytics",
                            desc: "Live market data processing with instant insights and recommendations"
                        },
                        {
                            icon: "⚡",
                            title: "Automated Trading",
                            desc: "Execute trades automatically based on your custom strategies and AI signals"
                        },
                        {
                            icon: "🛡️",
                            title: "Risk Management",
                            desc: "Comprehensive risk assessment and portfolio optimization tools"
                        },
                        {
                            icon: "📈",
                            title: "Performance Tracking",
                            desc: "Detailed analytics and reporting to track your investment performance"
                        },
                        {
                            icon: "🔗",
                            title: "API Integration",
                            desc: "Connect with your favorite brokers and financial data providers"
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
            </section >

            {/* PRICING */}
            < section id="pricing" className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.5)' }
            }>
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <span className="hero-badge">Pricing Plans</span>
                    <h3>Choose Your Trading Power</h3>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
                        Transparent pricing with no hidden fees. Start with our free trial and scale as you grow.
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
                                to="/contact?product=stocksteward&plan=${plan.name.toLowerCase()}"
                                className={`btn ${plan.highlighted ? '' : 'btn-outline'}`}
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section >

            {/* CTA */}
            < section className="cta-modern" >
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Ready to Transform Your Trading Strategy?</h3>
                        <p className="mb-8">
                            Get a personalized demo and see how StockSteward AI can enhance your investment decisions.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/contact?product=stocksteward" className="btn">
                                Book Strategy Call
                            </Link>
                            <a
                                href="https://stocksteward-ai.vercel.app/login"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                Try Live Platform
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section >
        </main >
    );
}
