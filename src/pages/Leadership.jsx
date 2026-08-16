import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import heroLeadership from "../assets/generated/hero-leadership-ultra-8k.png";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

export default function Leadership() {
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
                        <Helmet>
                            <title>Leadership & Technical Vision | Cognivectra</title>
                            <meta name="description" content="Meet the leadership team at Cognivectra. Over 25 years of hands-on technical excellence and strategic vision in AI, cloud and platform engineering." />
                        </Helmet>
                        <span className="hero-badge">💼 Leadership</span>
                        <h1>Expertise That <br />Drives Innovation</h1>
                        <p>
                            With over 25 years of deep industry experience, our leadership
                            combines strategic vision with hands-on technical excellence
                            to guide Cognivectra toward the future of AI.
                        </p>
                        <div className="hero-cta">
                            <Link to="/contact" className="btn">Book Strategy Call</Link>
                            <Link to="/who-we-are" className="btn-outline">About Our Mission</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={heroLeadership} alt="Leadership at Cognivectra" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CORE EXPERTISE */}
            <section className="services-modern">
                <div className="hero-modern-inner" style={{ padding: 0 }}>
                    <motion.div
                        className="hero-copy"
                        {...fadeInUp}
                    >
                        <h3>Decades of Excellence</h3>
                        <p>
                            Our leadership team brings a wealth of knowledge from over 25 years
                            in both service-oriented and product development sectors. We've
                            navigated multiple technology waves, from the early web to the
                            current AI revolution.
                        </p>

                        <div className="expertise-grid">
                            <div className="expertise-item">
                                <h4>Service & Product Mastery</h4>
                                <p>Expertise in building high-scale service architectures and developing market-winning products across diverse domains.</p>
                            </div>
                            <div className="expertise-item">
                                <h4>Cutting-edge Technologies</h4>
                                <p>A relentless focus on staying ahead of the curve, from cloud-native architectures to complex distributed systems.</p>
                            </div>
                            <div className="expertise-item">
                                <h4>AI & Applied Intelligence</h4>
                                <p>Specialized expertise in integrating Generative AI, Large Language Models, and automated orchestration into business workflows.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        {...fadeInUp}
                    >
                        <div className="service-modern-card glass-panel" style={{ height: 'auto', padding: '3rem' }}>
                            <div className="stats-list">
                                <div className="stat-item">
                                    <h2>25+</h2>
                                    <p>Years of Industry Experience</p>
                                </div>
                                <div className="stat-item">
                                    <h2>50+</h2>
                                    <p>Products Launched to Market</p>
                                </div>
                                <div className="stat-item">
                                    <h2>100%</h2>
                                    <p>Commitment to AI-First Future</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* LEADERSHIP PILLARS */}
            <section className="services-modern py-24" style={{ background: 'rgba(5,7,12,0.4)' }}>
                <div className="services-modern-grid">
                    {[
                        {
                            title: "Strategic Vision",
                            desc: "Mapping long-term technology roadmaps that align with business growth and market evolution.",
                            icon: "🔭"
                        },
                        {
                            title: "Technical Depth",
                            desc: "Deep-rooted understanding of complex systems engineering and the latest advancements in AI/ML.",
                            icon: "💻"
                        },
                        {
                            title: "Operational Excellence",
                            desc: "Championing lean methodologies and high-efficiency workflows in both service and product delivery.",
                            icon: "⚙️"
                        }
                    ].map((pillar, i) => (
                        <motion.div
                            key={i}
                            className="service-modern-card glass-panel"
                            {...fadeInUp}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="service-icon-wrapper" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{pillar.icon}</div>
                            <h4>{pillar.title}</h4>
                            <p>{pillar.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-modern">
                <div className="container text-center">
                    <motion.div {...fadeInUp}>
                        <h3>Looking for strategic technology advice?</h3>
                        <p className="mb-8">
                            Leverage our decades of experience to accelerate your journey.
                        </p>
                        <div className="hero-cta" style={{ justifyContent: 'center' }}>
                            <Link to="/contact" className="btn">Book Strategy Call</Link>
                            <Link to="/products" className="btn-outline">
                                View Platforms
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
