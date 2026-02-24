import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import heroProducts from "../assets/generated/hero-products-ultra-8k.png";
import storeAIImg from "../assets/generated/product-storeai.png";
import stewardImg from "../assets/generated/product-stocksteward.png";
import emrImg from "../assets/generated/ind-health-3d.png";
import ProductLogo from "../components/ProductLogo";
import { trackEvent } from "../lib/analytics";

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
                        <span className="hero-badge">🚀 Our Platform Suite</span>
                        <h1>Intelligence-Driven <br />Enterprise Platforms</h1>
                        <p>
                            CogniVectra develops production-ready platforms designed to solve
                            complex challenges in healthcare, retail, and enterprise AI orchestration.
                        </p>
                        <div className="hero-cta">
                            <a href="#steward" onClick={() => trackEvent('cta_click', { cta_name: 'Explore Platforms', location: 'Products Hero' })} className="btn">Explore Platforms</a>
                            <Link to="/contact" onClick={() => trackEvent('cta_click', { cta_name: 'Inquire for Custom Deployment', location: 'Products Hero' })} className="btn-outline">Inquire for Custom Deployment</Link>
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
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Automated Algorithmic Trading</li>
                            <li>AI-Powered Market Sentiment Analysis</li>
                            <li>Real-time Portfolio Risk Assessment</li>
                            <li>Interactive Financial Intelligence Chat</li>
                        </ul>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                            <a
                                href="https://steward-platform.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'stocksteward', location: 'Products Grid' })}
                                className="btn"
                            >
                                Explore StockSteward ↗
                            </a>
                            <Link to="/products/stocksteward" onClick={() => trackEvent('cta_click', { cta_name: 'View Details & Pricing', product: 'stocksteward' })} className="btn-outline">
                                View Details & Pricing
                            </Link>
                            <Link to="/contact?product=stocksteward" onClick={() => trackEvent('cta_click', { cta_name: 'Request Demo', product: 'stocksteward' })} className="btn" style={{ background: 'var(--accent-secondary)', border: 'none' }}>
                                Request Demo
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
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Real-time Inventory Optimization</li>
                            <li>AI-Driven Sales Forecasting</li>
                            <li>Customer Sentiment Analysis</li>
                            <li>Automated Supply Chain Sync</li>
                        </ul>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                            <a
                                href="https://store-ai-prd.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'storeai', location: 'Products Grid' })}
                                className="btn"
                            >
                                Visit StoreAI Live ↗
                            </a>
                            <Link to="/products/storeai" onClick={() => trackEvent('cta_click', { cta_name: 'View Details & Pricing', product: 'storeai' })} className="btn-outline">
                                View Details & Pricing
                            </Link>
                            <Link to="/contact?product=storeai" onClick={() => trackEvent('cta_click', { cta_name: 'Request Demo', product: 'storeai' })} className="btn" style={{ background: 'var(--accent-secondary)', border: 'none' }}>
                                Request Demo
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
                            Currently live with <strong>Kidz-Clinic</strong>, MedFlow streamlines clinical workflows
                            and patient management, with rapid onboarding for new providers starting this week.
                        </p>
                        <ul className="service-highlights" style={{ marginBottom: '2rem' }}>
                            <li>Multi-Tenant Architecture for Scalability</li>
                            <li>Live Deployment: Kidz-Clinic</li>
                            <li>Rapid Provider Onboarding</li>
                            <li>Comprehensive Clinical Workflow Automation</li>
                        </ul>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                            <a
                                href="https://emr-app-0909.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'medflow', location: 'Products Grid' })}
                                className="btn"
                            >
                                Launch MedFlow ↗
                            </a>
                            <Link to="/products/medflow" onClick={() => trackEvent('cta_click', { cta_name: 'View Details & Pricing', product: 'medflow' })} className="btn-outline">
                                View Details & Pricing
                            </Link>
                            <Link to="/contact?product=medflow" onClick={() => trackEvent('cta_click', { cta_name: 'Request Demo', product: 'medflow' })} className="btn" style={{ background: 'var(--accent-secondary)', border: 'none' }}>
                                Request Demo
                            </Link>
                            <a
                                href="https://kidz-clinic-client.onrender.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('external_link_click', { product: 'medflow_implementation', location: 'Products Grid' })}
                                className="btn-outline"
                            >
                                View Live Implementation
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
                            title: "OmniCore",
                            desc: "Unified enterprise orchestration platform for cross-departmental AI automation and data flow management.",
                            status: "Beta"
                        },
                        {
                            title: "VectraFlow",
                            desc: "Intelligent workflow engine for automated document processing and compliance checking using LLMs.",
                            status: "Development"
                        },
                        {
                            title: "NeuralOps",
                            desc: "Machine learning operations (MLOps) toolkit for scaling AI models from prototype to enterprise-wide deployment.",
                            status: "In Design"
                        }
                    ].map((product, i) => (
                        <motion.div
                            key={i}
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
                        <Link to="/contact" className="btn">
                            Discuss Your Project
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
