import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { LuRocket } from "react-icons/lu";
import heroProducts from "../assets/generated/hero-products-ultra-8k.png";
import storeAIImg from "../assets/generated/product-storeai.png";
import stewardImg from "../assets/generated/product-stocksteward.png";
import emrImg from "../assets/generated/ind-health-3d.png";
import clientEduImg from "../assets/generated/ind-edtech-3d.png";
import ProductLogo from "../components/ProductLogo";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

export default function Products() {
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

    const handleQuickDemo = async (e, platform) => {
        e.preventDefault();
        const email = e.target.email.value;
        const org = e.target.organization.value;

        trackEvent('lead_generated', {
            type: 'quick_demo_inline',
            platform,
            organization: org
        }, 'CONVERSION');

        await supabase.from("chat_conversations").upsert([
            {
                user_name: "Quick Demo Lead",
                user_email: email,
                company: org,
                stage: platform,
                challenge: "(Quick Demo Inquiry from Products Page)",
                source: `product_${platform}_inline`,
                lead_score: "warm",
                updated_at: new Date().toISOString(),
            },
        ], { onConflict: "user_email" });

        alert("Request received! Our team will contact you shortly.");
        e.target.reset();
    };

    return (
        <main>
            <Helmet>
                <title>Enterprise AI Platforms | Healthcare, Retail, FinTech & Education</title>
                <meta name="description" content="Explore CogniVectra's suite of production-ready platforms: MedFlow (Healthcare), StoreAI (Retail), StockSteward (FinTech), and EduPortal (Education)." />
                <meta name="keywords" content="Enterprise AI Platforms, Healthcare EMR, Retail AI, FinTech Trading, EdTech Solutions, CogniVectra Products" />
                <meta property="og:title" content="CogniVectra | High-Impact Enterprise Platforms" />
                <meta property="og:description" content="Deploy internal or customer-facing AI platforms at scale." />
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
                        <h1>Production-Ready <br />AI Platforms</h1>
                        <p>
                            CogniVectra develops production-ready platforms designed to solve
                            complex challenges in healthcare, retail, and enterprise AI orchestration.
                        </p>
                        <div className="hero-cta">
                            <Link to="/contact" onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Hero' })} className="btn">Book Strategy Call</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={heroProducts} alt="CogniVectra Products" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 1 - StockSteward AI */}
            <section id="steward" className="services-modern">
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">AIEngine Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="steward" style={{ marginBottom: '1rem' }} />
                            <h3>StockSteward AI</h3>
                        </div>
                        <p>
                            A sophisticated algorithmic trading and market intelligence platform.
                            StockSteward leverages advanced LLMs and quantitative models to provide
                            real-time insights, automated portfolio management, and predictive market analysis.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: Hedge funds, prop trading firms, and fintech startups.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Automated Algorithmic Trading</li>
                            <li>AI-Powered Market Sentiment Analysis</li>
                            <li>Real-time Portfolio Risk Assessment</li>
                            <li>Interactive Financial Intelligence Chat</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'stocksteward')} className="product-demo-form" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://steward-platform.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'stocksteward', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                            <Link to="/products/stocksteward" onClick={() => trackEvent('cta_click', { cta_name: 'View Product Details', product: 'stocksteward' })} className="btn-outline">
                                View Details
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        {...fadeInUp}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={stewardImg} alt="StockSteward Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 2 - StoreAI */}
            <section id="storeai" className="services-modern" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-visual"
                        {...fadeInUp}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={storeAIImg} alt="StoreAI Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">Retail Intelligence</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="store" style={{ marginBottom: '1rem' }} />
                            <h3>StoreAI</h3>
                        </div>
                        <p>
                            A revolutionary AI-powered retail management system that transforms how
                            stores operate. From automated inventory tracking to predictive sales
                            analytics and customer behavior insights.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: Multi-location retail chains and e-commerce enterprises.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Real-time Inventory Optimization</li>
                            <li>AI-Driven Sales Forecasting</li>
                            <li>Customer Sentiment Analysis</li>
                            <li>Automated Supply Chain Sync</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'storeai')} className="product-demo-form" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://storeai-app.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'storeai', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                            <Link to="/products/storeai" onClick={() => trackEvent('cta_click', { cta_name: 'View Product Details', product: 'storeai' })} className="btn-outline">
                                View Details
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 3 - MedFlow EMR */}
            <section id="emr" className="services-modern">
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">Multi-Tenant Healthcare Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="medflow" style={{ marginBottom: '1rem' }} />
                            <h3>MedFlow EMR</h3>
                        </div>
                        <p>
                            A scalable, multi-tenant Electronic Medical Record (EMR) system built for modern clinics.
                            Currently live with <strong>Kidz-Clinic</strong> and <strong>Dr. S.T. Pushpa</strong>, MedFlow streamlines clinical workflows
                            and patient management, with rapid onboarding for new providers starting this week.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: Multi-specialty clinics, pediatric hospitals, and digital health startups.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Multi-Tenant Architecture for Scalability</li>
                            <li>Live Deployment: Kidz-Clinic</li>
                            <li>Rapid Provider Onboarding</li>
                            <li>Comprehensive Clinical Workflow Automation</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'medflow')} className="product-demo-form" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://healthezee.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'medflow', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                            <Link to="/products/medflow" onClick={() => trackEvent('cta_click', { cta_name: 'View Product Details', product: 'medflow' })} className="btn-outline">
                                View Details
                            </Link>
                            <a
                                href="https://www.whitekraaft.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'medflow_implementation', location: 'Products Grid', client: 'whitekraaft' })}
                                className="btn-outline"
                            >
                                Visit White Kraaft ↗
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        {...fadeInUp}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={emrImg} alt="MedFlow EMR Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 4 - EduPortal */}
            <section id="eduportal" className="services-modern" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-visual"
                        {...fadeInUp}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={clientEduImg} alt="EduPortal Dashboard" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">AI-Powered EdTech</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="eduportal" style={{ marginBottom: '1rem' }} />
                            <h3>EduPortal</h3>
                        </div>
                        <p>
                            A comprehensive institution management platform that leverages AI to automate
                            complex administrative tasks. Designed for enterprise-scale deployment with
                            robust multi-tenant capabilities.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: K-12 schools, higher education institutions, and corporate training providers.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Intelligent Resource Scheduling</li>
                            <li>AI-Driven Student Progress Tracking</li>
                            <li>Automated Enrollment Portals</li>
                            <li>Multi-Campus Centralized Management</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'eduportal')} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://eduportal-new.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'eduportal', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                            <Link to="/products/eduportal" onClick={() => trackEvent('cta_click', { cta_name: 'View Product Details', product: 'eduportal' })} className="btn-outline">
                                View Details
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 5 - CogniHRMS */}
            <section id="cognihrms" className="services-modern">
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">Enterprise Workforce AI</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="cognihrms" style={{ marginBottom: '1rem' }} />
                            <h3>CogniHRMS</h3>
                        </div>
                        <p>
                            A next-generation Human Resource Management System powered by AI intelligence. CogniHRMS streamlines talent acquisition, automated payroll management, performance evaluations, and employee analytics across enterprise workforces.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: Mid-to-large enterprises, remote-first organizations, and multi-national teams.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>AI-Driven Talent & Resume Screening</li>
                            <li>Automated Attendance & Leave Tracking</li>
                            <li>Intelligent Performance & Skill Gap Analysis</li>
                            <li>Multi-Location Employee Portal & Self-Service</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'cognihrms')} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://cognihr.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'cognihrms', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PRODUCT 6 - Hospitality Management (eHMS) */}
            <section id="hospitality" className="services-modern" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <span className="hero-badge">Smart Hospitality Platform</span>
                        <div className="flex items-center gap-4 mb-4">
                            <ProductLogo type="hospitality" style={{ marginBottom: '1rem' }} />
                            <h3>Hospitality Management (eHMS)</h3>
                        </div>
                        <p>
                            An all-in-one smart hospitality management platform engineered for hotels, resorts, and multi-property chains. Delivers automated check-in/check-out orchestration, dynamic room pricing, smart housekeeping dispatch, and unified guest intelligence.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Best for: Boutique hotels, luxury resort chains, and commercial hospitality operators.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Smart Reservation & Front-Desk Automation</li>
                            <li>Dynamic Pricing & Occupancy Forecasting</li>
                            <li>Automated Housekeeping & Maintenance Dispatch</li>
                            <li>Integrated Guest Concierge & CRM</li>
                        </ul>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Get a 15-Min Recorded Demo</h4>
                            <form onSubmit={(e) => handleQuickDemo(e, 'hospitality')} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="email" name="email" placeholder="Work Email" required style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <input type="text" name="organization" placeholder="Org" required style={{ width: '100px', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>Send</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <a
                                href="https://ehms-app.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'hospitality', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                Launch Platform ↗
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* COMING SOON / PLACEHOLDERS */}
            <section className="services-modern py-24" style={{ background: 'rgba(5,7,12,0.4)' }}>
                <motion.div
                    className="section-header text-center"
                    {...fadeInUp}
                >
                    <h3>Additional Enterprise Platforms</h3>
                    <p>We are constantly innovating to bring production-ready AI to more sectors.</p>
                </motion.div>

                <div className="services-modern-grid">
                    {[
                        {
                            id: "omnicore",
                            title: "OmniCore",
                            desc: "Unified enterprise orchestration platform for cross-departmental AI automation and data flow management.",
                            status: "Beta"
                        },
                        {
                            id: "vectraflow",
                            title: "VectraFlow",
                            desc: "Intelligent workflow engine for automated document processing and compliance checking using LLMs.",
                            status: "Development"
                        },
                        {
                            id: "neuralops",
                            title: "NeuralOps",
                            desc: "Machine learning operations (MLOps) toolkit for scaling AI models from prototype to enterprise-wide deployment.",
                            status: "In Design"
                        }
                    ].map((product, i) => (
                        <motion.div
                            key={i}
                            id={product.id}
                            className="service-modern-card glass-panel"
                            {...fadeInUp}
                            transition={{ delay: i * 0.1 }}
                        >
                            <span className="hero-badge" style={{ marginBottom: '1rem' }}>{product.status}</span>
                            <h4>{product.title}</h4>
                            <p>{product.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Have a platform challenge you want to solve?</h3>
                        <p className="mb-8">
                            We partner with technical leaders to turn complex requirements into market-leading enterprise platforms.
                        </p>
                        <Link to="/contact" onClick={() => trackEvent('cta_click', { cta_name: 'Book Strategy Call', location: 'Products Footer' })} className="btn">
                            Book Strategy Call
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main >
    );
}

