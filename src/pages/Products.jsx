import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LuArrowRight, LuRocket, LuShield, LuCpu, LuUsers, LuHotel, LuActivity, LuDatabase, LuTrendingUp, LuBookOpen } from "react-icons/lu";
import heroProducts from "../assets/generated/hero-products-ultra-8k.png";
import storeAIImg from "../assets/generated/product-storeai.png";
import stewardImg from "../assets/generated/product-stocksteward.png";
import emrImg from "../assets/generated/ind-health-3d.png";
import clientEduImg from "../assets/generated/ind-edtech-3d.png";
import hrmsImg from "../assets/generated/ind-saas-3d.png";
import hospitalityImg from "../assets/generated/ind-ecommerce-3d.png";
import capAiImg from "../assets/generated/cap-ai-3d-8k.png";
import { trackEvent } from "../lib/analytics";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const industries = [
    "All",
    "Healthcare",
    "Pharmacy",
    "HR & Talent",
    "Hospitality",
    "Finance & FinTech",
    "Retail",
    "Education",
    "AI & Automation"
];

const products = [
    {
        name: "Healthezee",
        tagline: "Healthcare Management Platform",
        industry: "Healthcare",
        status: "Live",
        desc: "Original Cognivectra healthcare platform covering OPD, inpatient, daycare, pharmacy, billing, laboratory and hospital administration with multi-tenant architecture.",
        capabilities: ["EMR & Clinical Workflows", "Billing & Insurance", "Multi-tenant Architecture", "Hospital Administration"],
        to: "/products/healthezee",
        img: emrImg,
        icon: <LuActivity />
    },
    {
        name: "MediFlow",
        tagline: "Pharmacy Management System",
        industry: "Pharmacy",
        status: "Live",
        desc: "Modern pharmacy management platform for medicines, inventory and pharmacy operations.",
        capabilities: ["Drug / Medicine Master", "Inventory & Batch Management", "Expiry Management", "Purchase & Sales"],
        to: "/products/medflow",
        img: emrImg,
        icon: <LuShield />
    },
    {
        name: "StockSteward",
        tagline: "AI-Powered Investment Intelligence",
        industry: "Finance & FinTech",
        status: "Live",
        desc: "Sophisticated market intelligence and portfolio platform leveraging advanced LLMs and quantitative models for real-time insights.",
        capabilities: ["Portfolio Tracking", "Market Sentiment Analysis", "Risk Assessment", "Financial Intelligence Chat"],
        to: "/products/stocksteward",
        img: stewardImg,
        icon: <LuTrendingUp />
    },
    {
        name: "StoreAI",
        tagline: "Intelligent Inventory & Retail Management",
        industry: "Retail",
        status: "Production",
        desc: "Modern business platform for inventory, sales, purchasing, accounts and workforce operations.",
        capabilities: ["Inventory", "Product Management", "Purchasing & Sales", "Accounts & HR"],
        to: "/products/storeai",
        img: storeAIImg,
        icon: <LuDatabase />
    },
    {
        name: "EduPortal",
        tagline: "AI-Powered Education Platform",
        industry: "Education",
        status: "Production",
        desc: "Comprehensive institution management platform that leverages AI to automate complex administrative tasks.",
        capabilities: ["Resource Scheduling", "Student Progress Tracking", "Enrollment Portals", "Multi-campus Management"],
        to: "/products/eduportal",
        img: clientEduImg,
        icon: <LuBookOpen />
    },
    {
        name: "CogniHRMS",
        tagline: "Human Resource Management System",
        industry: "HR & Talent",
        status: "Production",
        desc: "Next-generation HR platform powered by AI for recruitment, attendance, payroll and employee analytics.",
        capabilities: ["Talent & Resume Screening", "Attendance & Leave", "Performance Analytics", "Employee Self-service"],
        to: "/products#cognihrms",
        img: hrmsImg,
        icon: <LuUsers />,
        external: "https://cognihr.onrender.com/"
    },
    {
        name: "Hospitality Management (eHMS)",
        tagline: "Smart Hospitality & Property Management",
        industry: "Hospitality",
        status: "Live",
        desc: "Smart hospitality and property management platform engineered for hotels, resort chains and guest concierge intelligence.",
        capabilities: ["Reservations", "Front Office", "Housekeeping", "Reporting"],
        to: "/products#hospitality",
        img: hospitalityImg,
        icon: <LuHotel />,
        external: "https://ehms-app-eta.vercel.app/"
    },
    {
        name: "Syntalyst",
        tagline: "Human Resource Management System",
        industry: "HR & Talent",
        status: "Pilot",
        desc: "Cognivectra HRMS product/platform for employee management, organization structure, attendance, leave and HR operations.",
        capabilities: ["Employee Management", "Organization Structure", "Attendance & Leave", "HR Analytics"],
        to: "/products/syntalyst",
        img: hrmsImg,
        icon: <LuUsers />
    },
    {
        name: "TalentPulse",
        tagline: "Talent Management Platform",
        industry: "HR & Talent",
        status: "In Development",
        desc: "Talent management platform for performance, goals, skills, career development and workforce intelligence.",
        capabilities: ["Performance", "Goals & Skills", "Career Development", "Workforce Intelligence"],
        to: "/products/talentpulse",
        img: hrmsImg,
        icon: <LuUsers />
    },
    {
        name: "SmartBook",
        tagline: "Accounting & Financial Management",
        industry: "Finance & FinTech",
        status: "In Development",
        desc: "Modern accounting platform designed to simplify financial operations, bookkeeping, business transactions and financial visibility.",
        capabilities: ["General Ledger", "Invoicing & Expenses", "Financial Reporting", "Tax / GST"],
        to: "/products/smartbook",
        img: stewardImg,
        icon: <LuDatabase />
    },
    {
        name: "SmartPortfolio",
        tagline: "AI-Powered Investment Intelligence",
        industry: "Finance & FinTech",
        status: "Production",
        desc: "Intelligent portfolio platform to help investors understand portfolio performance, profitability and potential portfolio decisions.",
        capabilities: ["Portfolio Tracking", "Profit & Loss", "Position Analysis", "AI-powered Insights"],
        to: "/products/smartportfolio",
        img: stewardImg,
        icon: <LuTrendingUp />
    },
    {
        name: "AI IT Operations",
        tagline: "Intelligent IT Operations Automation",
        industry: "AI & Automation",
        status: "Pilot",
        desc: "AI-powered IT operations workflows designed to reduce repetitive work and improve incident resolution.",
        capabilities: ["ITSM Automation", "Incident Intelligence", "AI Agents", "Workflow Automation"],
        to: "/products/ai-it-operations",
        img: capAiImg,
        icon: <LuCpu />
    }
];

export default function Products() {
    const { hash } = useLocation();
    const [activeFilter, setActiveFilter] = useState("All");

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

    const visibleProducts = activeFilter === "All"
        ? products
        : products.filter((p) => p.industry === activeFilter);

    return (
        <main>
            <Helmet>
                <title>Products & Platforms | Cognivectra</title>
                <meta name="description" content="Explore Cognivectra's portfolio of software products and enterprise platforms across healthcare, pharmacy, HR, hospitality, finance, retail and AI." />
                <meta property="og:title" content="Cognivectra | Products & Platforms" />
                <meta property="og:description" content="Software products and enterprise platforms built by Cognivectra." />
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
                        <span className="hero-badge">Product Portfolio</span>
                        <h1>Products We Build</h1>
                        <p>
                            Cognivectra develops software products and enterprise platforms across
                            healthcare, pharmacy, HR & talent, hospitality, finance, retail,
                            education and AI.
                        </p>
                        <div className="hero-cta">
                            <Link to="/contact" onClick={() => trackEvent('cta_click', { cta_name: 'Talk to Cognivectra', location: 'Products Hero' })} className="btn">Talk to Cognivectra</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={heroProducts} alt="Cognivectra Products" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FILTERS */}
            <section className="services-modern" style={{ paddingTop: '3rem' }}>
                <div className="container">
                    <motion.div
                        className="section-header text-center"
                        {...fadeInUp}
                        style={{ marginBottom: '2.5rem' }}
                    >
                        <span className="hero-badge">Filter by Industry</span>
                        <h3>Technology We Build. Products We Own.</h3>
                    </motion.div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem' }}>
                        {industries.map((ind) => (
                            <button
                                key={ind}
                                onClick={() => {
                                    setActiveFilter(ind);
                                    trackEvent('products_filter', { filter: ind });
                                }}
                                className={activeFilter === ind ? "btn" : "btn-outline"}
                                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                {ind}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="services-modern" style={{ paddingTop: 0 }}>
                <div className="container">
                    <motion.div
                        className="services-modern-grid"
                        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
                        variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {visibleProducts.map((product, i) => (
                            <motion.div
                                key={product.name}
                                id={product.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                                className="service-modern-card glass-panel"
                                {...fadeInUp}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ height: '150px', overflow: 'hidden', borderRadius: '14px', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)' }}>
                                    <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ color: 'var(--accent-primary)', fontSize: '1.3rem' }}>{product.icon}</span>
                                        <h4 style={{ margin: 0, fontSize: '1.15rem' }}>{product.name}</h4>
                                    </div>
                                    <span className="hero-badge" style={{ fontSize: '0.62rem', margin: 0 }}>{product.status}</span>
                                </div>
                                <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>{product.tagline}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flexGrow: 1 }}>{product.desc}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.75rem 0 1.25rem' }}>
                                    {product.capabilities.map((cap, j) => (
                                        <span key={j} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: '100px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--text-secondary)' }}>
                                            {cap}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                                    <Link to={product.to} onClick={() => trackEvent('cta_click', { cta_name: 'Explore Product', product: product.name })} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                        Explore Product <LuArrowRight style={{ marginLeft: '0.3rem', verticalAlign: 'middle' }} />
                                    </Link>
                                    {product.external && (
                                        <a href={product.external} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                            Launch Portal ↗
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Have a platform challenge you want to solve?</h3>
                        <p className="mb-8">
                            We partner with technical leaders to turn complex requirements into
                            production-ready products and enterprise platforms.
                        </p>
                        <Link to="/contact" onClick={() => trackEvent('cta_click', { cta_name: 'Talk to Cognivectra', location: 'Products Footer' })} className="btn">
                            Talk to Cognivectra
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
