import { Link } from "react-router-dom";

// Hero image - using the same high-quality style as home page
import servicesHero from "../assets/cognivectra-capabilities-hero.png";

// Service images
import cloudInfraImage from "../assets/hero-automation-new.png";
import automationImage from "../assets/hero-automation.png";
import saasImage from "../assets/home-hero-automation.png";
import devopsImage from "../assets/engagement-models.png";
import aiImage from "../assets/hero-automation-new.png";
import advisoryImage from "../assets/engagement-models.png";

export default function Services() {
    const services = [
        {
            title: "Cloud Infrastructure for Startups",
            description: "Secure, scalable, and cost-aware cloud foundations on AWS, GCP, or Azure tailored for SaaS and AI-native startups.",
            items: [
                "Cloud landing zones and multi-account / multi-environment setup.",
                "Network, security, and identity baselines baked in.",
                "FinOps-ready design to keep costs predictable."
            ],
            image: cloudInfraImage
        },
        {
            title: "Process Automation & Workflow Enablement",
            description: "Automate recurring work across operations, finance, HR, and support using no-code, low-code, and API-based orchestration.",
            items: [
                "Business process automation across key back-office functions.",
                "No-code / low-code apps plus event-driven workflows.",
                "GenAI-assisted workflows and internal or customer-facing chatbots."
            ],
            image: automationImage
        },
        {
            title: "SaaS Building Blocks",
            description: "Plug-and-play components so your team does not reinvent the wheel for every product capability.",
            items: [
                "Authentication, authorization, and user management.",
                "Billing, subscription management, and usage analytics.",
                "Notifications, email delivery, and customer communication."
            ],
            image: saasImage
        },
        {
            title: "DevOps & Platform Engineering",
            description: "Build, ship, and run software faster with CI/CD, infrastructure as code, and platform engineering best practices.",
            items: [
                "CI/CD pipelines with automated testing and deployment.",
                "Infrastructure as Code and GitOps workflows.",
                "Observability, monitoring, and reliability engineering."
            ],
            image: devopsImage
        },
        {
            title: "AI Enablement & Data Engineering",
            description: "Integrate AI capabilities into your products and build data pipelines that power intelligent experiences.",
            items: [
                "ML model deployment and MLOps pipelines.",
                "Data warehousing, ETL, and real-time streaming.",
                "API integration with AI services and custom model development."
            ],
            image: aiImage
        },
        {
            title: "CTO Advisory & Fractional Leadership",
            description: "Strategic technology guidance and hands-on leadership to help you make the right architectural decisions and build high-performing teams.",
            items: [
                "Technology roadmap and architecture reviews.",
                "Team building, hiring, and engineering culture.",
                "Vendor selection, due diligence, and technical due diligence."
            ],
            image: advisoryImage
        }
    ];

    return (
        <section className="section" style={{ padding: "6rem 0" }}>
            <div className="container">
                {/* Hero Section */}
                <div className="grid2" style={{ alignItems: "center" }}>
                    <div>
                        <h1 style={{ marginBottom: "1.5rem" }}>Services</h1>
                        <p className="stack" style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
                            End-to-end technology solutions designed for startups who need to move fast and build right.
                            From cloud foundations to AI integration, we provide the expertise and execution
                            to deliver solutions that truly matter for your startup's success
                        </p>
                        <div style={{ marginTop: "2rem" }}>
                            {services.map((service, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <img src={service.image} alt={service.title} style={{ width: "24px", height: "24px", borderRadius: "4px" }} />
                                    <strong>{service.title}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <img
                            src={servicesHero}
                            alt="Services: Cloud Infrastructure, DevOps, Automation, AI Enablement"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>
                </div>

                {/* Services Grid - Consistent Layout */}
                <div className="grid2">
                    {services.map((service, index) => (
                        <section key={index} className="card" style={{ padding: "2.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                                <div style={{ fontSize: "2rem", opacity: 0.7 }}>
                                    <img src={service.image} alt={service.title} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
                                </div>
                                <h3>{service.title}</h3>
                            </div>
                            <p className="stack" style={{ marginBottom: "1.5rem" }}>
                                {service.description}
                            </p>
                            
                            {/* High-Quality Service Image */}
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <img
                                    src={service.image}
                                    alt={service.title}
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
                            
                            <ul className="stack">
                                {service.items.map((item, itemIndex) => (
                                    <li key={itemIndex} style={{ marginBottom: "0.5rem" }}>
                                        ✓ {item}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: "2rem" }}>
                                <Link to="/contact" className="btn">
                                    Learn More →
                                </Link>
                            </div>
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
                    <h3 style={{ marginBottom: "1.5rem" }}>Ready to Accelerate Your Growth?</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Let's discuss how we can help you build the technical foundation
                        for your next stage of growth.
                    </p>
                    <Link to="/contact" className="btn">
                        Schedule Your Strategy Session →
                    </Link>
                </div>
            </div>
        </section>
    );
}
