import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import heroProducts from "../assets/generated/hero-products-ultra-8k.png";
import storeAIImg from "../assets/generated/product-storeai.png";
import stewardImg from "../assets/generated/product-stocksteward.png";
import emrImg from "../assets/generated/ind-health-3d.png";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const ProductLogo = ({ type }) => {
    const commonProps = {
        width: "48",
        height: "48",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { marginBottom: '1rem', display: 'block' }
    };

    if (type === 'steward') {
        return (
            <svg {...commonProps}>
                <rect x="2" y="3" width="20" height="18" rx="2" stroke="url(#grad1)" strokeWidth="2" strokeOpacity="0.8" />
                <path d="M7 15L10 12L13 15L17 9" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="grad1" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    if (type === 'store') {
        return (
            <svg {...commonProps}>
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="grad2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f59e0b" />
                        <stop offset="1" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    if (type === 'medflow') {
        return (
            <svg {...commonProps}>
                <path d="M19 14C20.49 14 22 12.69 22 11.5C22 10.16 21.05 9.17 19.5 9.17C19.29 9.17 19 9.06 18.82 8.88L15.65 5.71C15 5.06 14.28 4.7 13.5 4.56V2.5H10.5V4.56C9.72 4.7 9 5.06 8.35 5.71L5.18 8.88C5 9.06 4.71 9.17 4.5 9.17C2.95 9.17 2 10.16 2 11.5C2 12.69 3.51 14 5 14M12 16V22M9 19H15" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="url(#grad3)" strokeWidth="2" />
                <defs>
                    <linearGradient id="grad3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10b981" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    return null;
};

export default function Products() {
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
                        <span className="hero-badge">🚀 Our Product Suite</span>
                        <h1>Intelligence-Driven <br />Solutions for Business</h1>
                        <p>
                            CogniVectra develops cutting-edge products designed to solve complex
                            challenges in retail, enterprise operations, and AI orchestration.
                        </p>
                        <div className="hero-cta">
                            <a href="#steward" className="btn">Explore Products</a>
                            <Link to="/contact" className="btn-outline">Inquire for Custom</Link>
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
                            <ProductLogo type="steward" />
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
                        <a
                            href="https://steward-platform.onrender.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                        >
                            Explore StockSteward ↗
                        </a>
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
                            <ProductLogo type="store" />
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
                        <a
                            href="https://store-ai-prd.onrender.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                        >
                            Visit StoreAI Live ↗
                        </a>
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
                            <ProductLogo type="medflow" />
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
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <a
                                href="https://emr-app-0909.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Launch MedFlow ↗
                            </a>
                            <a
                                href="https://kidz-clinic-client.onrender.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                View Live Implementation (Kidz-Clinic)
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
                    <h3>More Products in Pipeline</h3>
                    <p>We are constantly innovating to bring the power of AI to more industries.</p>
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
                        <h3>Have a product idea you want to build?</h3>
                        <p className="mb-8">
                            We partner with founders to turn innovative concepts into market-ready products.
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
