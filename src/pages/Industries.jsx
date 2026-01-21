import { Link } from "react-router-dom";

// Hero image - using the same high-quality style as home page
import industriesHero from "../assets/industries-sectors.png";

// High-quality industry images
import saasImage from "../assets/hero-automation-new.png";
import fintechImage from "../assets/engagement-models.png";
import healthImage from "../assets/hero-automation.png";
import ecommerceImage from "../assets/home-hero-automation.png";
import edtechImage from "../assets/hero-automation-new.png";
import logisticsImage from "../assets/engagement-models.png";

export default function Industries() {
    const industries = [
        {
            title: "SaaS & Product Startups",
            description: "From MVP to scale—cloud foundations, CI/CD, observability, and platform engineering for subscription businesses.",
            features: [
                "Multi-tenant architecture design",
                "Scalable data models and APIs",
                "Performance optimization and monitoring"
            ],
            image: saasImage
        },
        {
            title: "FinTech & Regulated Industries",
            description: "Secure, compliant platforms with audit trails, encryption, and governance for financial services and regulated sectors.",
            features: [
                "Security and compliance frameworks",
                "Multi-cloud and hybrid strategies",
                "Cost optimization and governance"
            ],
            image: fintechImage
        },
        {
            title: "HealthTech & Life Sciences",
            description: "HIPAA-ready infrastructure, data pipelines, and AI platforms for healthcare, diagnostics, and research.",
            features: [
                "Data and integration platforms",
                "Automation across clinical workflows",
                "Security and regulatory compliance"
            ],
            image: healthImage
        },
        {
            title: "E-commerce & Retail Tech",
            description: "High-availability storefronts, inventory systems, and customer data platforms for modern retail.",
            features: [
                "Scalable e-commerce platforms",
                "Inventory and order management",
                "Customer analytics and personalization"
            ],
            image: ecommerceImage
        },
        {
            title: "EdTech & Learning Platforms",
            description: "Scalable learning management systems, content delivery, and analytics for education and training.",
            features: [
                "Scalable content delivery",
                "User management and analytics",
                "Automation of learning workflows"
            ],
            image: edtechImage
        },
        {
            title: "Logistics & Supply Chain",
            description: "Real-time tracking, optimization engines, and integration platforms for modern supply chains.",
            features: [
                "Real-time tracking systems",
                "Optimization engines",
                "Integration platforms"
            ],
            image: logisticsImage
        }
    ];

    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero Section - Matching Home Page Style */}
                <div 
                    className="card hero-card"
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto 4rem",
                        display: "grid",
                        gridTemplateColumns: "1.1fr 0.9fr",
                        gap: "3rem",
                        alignItems: "center",
                        padding: "3rem 2.5rem"
                    }}
                >
                    <div>
                        <h2>Industries & Use Cases</h2>
                        <p className="stack" style={{ fontSize: "1.1rem" }}>
                            CogniVectra works with SaaS, AI-native, and data-driven startups, as well
                            as enterprises in regulated and complex domains where reliability and
                            compliance matter.
                        </p>
                        <div style={{ marginTop: "2rem" }}>
                            {industries.map((industry, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <img src={industry.image} alt={industry.title} style={{ width: "24px", height: "24px", borderRadius: "4px" }} />
                                    <strong>{industry.title}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <img
                            src={industriesHero}
                            alt="Industries served: FinTech, HealthTech, EdTech, SaaS, AI-native startups"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>
                </div>

                {/* Visual Break Section */}
                <div style={{ margin: "3rem auto", textAlign: "center" }}>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                        borderRadius: "20px",
                        padding: "2.5rem",
                        maxWidth: "800px",
                        margin: "0 auto"
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                          Industry-Specific Expertise
                        </h3>
                        <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                          We bring deep domain knowledge combined with technical excellence
                          to solve your unique industry challenges
                        </p>
                    </div>
                </div>

                {/* Industries Grid - Consistent with Other Pages */}
                <div className="grid2">
                    {industries.map((industry, index) => (
                        <section key={index} className="card" style={{ padding: "2.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                                <div style={{ fontSize: "2rem", opacity: 0.7 }}>
                                    <img src={industry.image} alt={industry.title} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
                                </div>
                                <h3>{industry.title}</h3>
                            </div>
                            <p className="stack" style={{ marginBottom: "1.5rem" }}>
                                {industry.description}
                            </p>
                            
                            {/* High-Quality Industry Image */}
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <img
                                    src={industry.image}
                                    alt={industry.title}
                                    style={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        height: "auto",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                                        padding: "1rem"
                                    }}
                                />
                            </div>
                            
                            {/* Features List */}
                            <ul className="stack">
                                {industry.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} style={{ marginBottom: "0.5rem" }}>
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                {/* CTA */}
                <div 
                    className="card"
                    style={{
                        maxWidth: "700px",
                        margin: "3rem auto 0",
                        textAlign: "center",
                        padding: "3rem"
                    }}
                >
                    <h3 style={{ marginBottom: "1.5rem" }}>Your Industry Not Listed?</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Even if your domain is not listed here, if you are building a software
                        or data-driven product and need strong foundations, we can help.
                    </p>
                    <Link to="/contact" className="btn">
                        Discuss Your Industry →
                    </Link>
                </div>
            </div>
        </section>
    );
}
