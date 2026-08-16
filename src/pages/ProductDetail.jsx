import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import hrmsImg from "../assets/generated/ind-saas-3d.png";
import stewardImg from "../assets/generated/product-stocksteward.png";
import capAiImg from "../assets/generated/cap-ai-3d-8k.png";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const productData = {
    syntalyst: {
        name: "Syntalyst",
        badge: "HR & Talent · Cognivectra Product",
        title: "Syntalyst HRMS",
        tagline: "Human Resource Management System",
        description: "Cognivectra HRMS product/platform for employee management, organization structure, attendance, leave, payroll and HR operations.",
        bestFor: "Mid-to-large enterprises and multi-location teams looking for a modern HR foundation.",
        capabilities: [
            "Employee management",
            "Organization structure",
            "Attendance & leave",
            "Payroll",
            "HR operations",
            "Employee self-service",
            "HR analytics"
        ],
        img: hrmsImg,
        status: "Pilot"
    },
    talentpulse: {
        name: "TalentPulse",
        badge: "HR & Talent · Cognivectra Product",
        title: "TalentPulse Platform",
        tagline: "Talent Management Platform",
        description: "Cognivectra talent management product focused on performance, goals, skills, career development and workforce intelligence.",
        bestFor: "Organizations focused on performance management and workforce development.",
        capabilities: [
            "Performance management",
            "Goals & OKRs",
            "Skills management",
            "Career development",
            "Workforce intelligence"
        ],
        img: hrmsImg,
        status: "In Development"
    },
    smartbook: {
        name: "SmartBook",
        badge: "Finance & FinTech · Cognivectra Product",
        title: "SmartBook Platform",
        tagline: "Accounting & Financial Management System",
        description: "A modern accounting platform designed to simplify financial operations, bookkeeping, business transactions and financial visibility.",
        bestFor: "SMEs and enterprises looking for clear financial operations and reporting.",
        capabilities: [
            "Accounting & general ledger",
            "Accounts payable & receivable",
            "Invoicing & expenses",
            "Financial reporting",
            "Tax / GST",
            "Business dashboards"
        ],
        img: stewardImg,
        status: "In Development"
    },
    smartportfolio: {
        name: "SmartPortfolio",
        badge: "Finance & FinTech · Cognivectra Product",
        title: "SmartPortfolio",
        tagline: "AI-Powered Investment Intelligence",
        description: "An intelligent portfolio platform designed to help investors understand portfolio performance, profitability and potential portfolio decisions.",
        bestFor: "Investors and advisory teams who need clear portfolio intelligence.",
        capabilities: [
            "Portfolio tracking",
            "Profit & loss",
            "Average price analysis",
            "Position analysis",
            "AI-powered insights",
            "Hold / review / sell intelligence",
            "Portfolio analytics"
        ],
        img: stewardImg,
        status: "Production"
    },
    "ai-it-operations": {
        name: "AI IT Operations",
        badge: "AI & Automation · Cognivectra Product",
        title: "AI IT Operations",
        tagline: "Intelligent IT Operations Automation",
        description: "AI-powered IT operations workflows designed to reduce repetitive work and improve incident resolution.",
        bestFor: "IT operations teams modernizing ITSM and incident response with enterprise AI.",
        capabilities: [
            "ITSM automation",
            "Incident intelligence",
            "Knowledge retrieval",
            "AI agents",
            "Workflow automation",
            "Enterprise system integration",
            "Operational analytics"
        ],
        img: capAiImg,
        status: "Pilot"
    }
};

export default function ProductDetail() {
    const { slug } = useParams();
    const product = productData[slug];
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!product) {
        return <Navigate to="/products" replace />;
    }

    const handleQuickDemo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const email = e.target.email.value;
        const org = e.target.organization.value;

        trackEvent('lead_generated', {
            type: 'quick_demo_detail',
            platform: slug,
            organization: org
        }, 'CONVERSION');

        await supabase.from("chat_conversations").upsert([
            {
                user_name: "Quick Demo Lead",
                user_email: email,
                company: org,
                stage: product.name,
                challenge: `(Quick Demo Inquiry from ${product.name} Detail Page)`,
                source: `product_${slug}_detail`,
                lead_score: "warm",
                updated_at: new Date().toISOString(),
            },
        ], { onConflict: "user_email" });

        alert("Request received! Our team will contact you shortly.");
        e.target.reset();
        setIsSubmitting(false);
    };

    return (
        <main>
            <Helmet>
                <title>{product.name} | {product.tagline} | Cognivectra</title>
                <meta name="description" content={`${product.name}: ${product.tagline}. ${product.description}`} />
            </Helmet>

            <section className="hero-modern">
                <div className="hero-modern-inner">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">{product.badge}</span>
                        <h1>{product.title}</h1>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{product.tagline}</p>
                        <p>{product.description}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'white' }}>Best for:</strong> {product.bestFor}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <Link to="/contact" className="btn">Talk to Cognivectra</Link>
                            <Link to="/products" className="btn-outline">View All Products</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={product.img} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="services-modern">
                <motion.div className="section-header text-center" {...fadeInUp}>
                    <span className="hero-badge">Status · {product.status}</span>
                    <h3>Key Capabilities</h3>
                </motion.div>
                <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {product.capabilities.map((cap, i) => (
                        <motion.div key={i} className="service-modern-card glass-panel" {...fadeInUp} transition={{ delay: i * 0.08 }}>
                            <div className="service-icon-wrapper">{String(i + 1).padStart(2, '0')}</div>
                            <h4 style={{ fontSize: '1.05rem' }}>{cap}</h4>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="services-modern" style={{ background: 'rgba(2, 6, 23, 0.5)' }}>
                <div className="container" style={{ maxWidth: '720px' }}>
                    <motion.div className="glass-panel" {...fadeInUp} style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Get a 15-Min Recorded Demo</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            See how {product.name} can help your organization.
                        </p>
                        <form onSubmit={handleQuickDemo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minWidth: '220px' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '140px', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.9rem' }}>
                                {isSubmitting ? "Processing..." : "Request Demo"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Ready to explore {product.name}?</h3>
                        <p className="mb-8">Let's discuss how it fits your product and technology roadmap.</p>
                        <Link to="/contact" className="btn">Talk to Cognivectra</Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
