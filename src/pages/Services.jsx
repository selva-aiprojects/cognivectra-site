import { Link } from "react-router-dom";

// Hero image
import servicesHero from "../assets/cognivectra-capabilities-hero.png";

// Service icons
import cloudIcon from "../assets/icons/icon-cloud-platform.svg";
import automationIcon from "../assets/icons/icon-process-automation.svg";
import saasIcon from "../assets/icons/icon-saas-blocks.svg";
import devopsIcon from "../assets/icons/icon-devops.svg";
import aiIcon from "../assets/icons/icon-ai-data.svg";
import advisoryIcon from "../assets/icons/icon-advisory.svg";

export default function Services() {
    const services = [
        {
            title: "Cloud Infrastructure for Startups",
            icon: cloudIcon,
            description: "Secure, scalable, and cost-aware cloud foundations on AWS, GCP, or Azure tailored for SaaS and AI-native startups.",
            items: [
                "Cloud landing zones and multi-account / multi-environment setup.",
                "Network, security, and identity baselines baked in.",
                "FinOps-ready design to keep costs predictable."
            ],
            image: null // service_cloud_infrastructure.png
        },
        {
            title: "Process Automation & Workflow Enablement",
            icon: automationIcon,
            description: "Automate recurring work across operations, finance, HR, and support using no-code, low-code, and API-based orchestration.",
            items: [
                "Business process automation across key back-office functions.",
                "No-code / low-code apps plus event-driven workflows.",
                "GenAI-assisted workflows and internal or customer-facing chatbots."
            ],
            image: null // service_process_automation.png
        },
        {
            title: "SaaS Building Blocks",
            icon: saasIcon,
            description: "Plug-and-play components so your team does not reinvent the wheel for every product capability.",
            items: [
                "Authentication, authorization, and user management.",
                "Billing, subscriptions, and usage-based metering.",
                "Email, SMS, WhatsApp, and in-app notifications.",
                "Logging, monitoring, and analytics dashboards."
            ],
            image: null // service_saas_blocks.png
        },
        {
            title: "DevOps & Platform Engineering",
            icon: devopsIcon,
            description: "Production-ready delivery pipelines and platform capabilities designed to support rapid iteration without sacrificing reliability.",
            items: [
                "CI/CD pipelines and Infrastructure as Code (Terraform).",
                "Kubernetes and container platforms where appropriate.",
                "Observability, alerting, and release automation."
            ],
            image: null // service_devops_platform.png
        },
        {
            title: "AI & Data Enablement",
            icon: aiIcon,
            description: "Pragmatic AI and data platforms that align with your product roadmap and risk appetite.",
            items: [
                "GenAI integrations, assistants, and copilots.",
                "Data platforms from ingestion pipelines to analytics.",
                "AI governance and lifecycle patterns suitable for startups."
            ],
            image: null // service_ai_data.png
        },
        {
            title: "Fractional CTO & Technology Advisory",
            icon: advisoryIcon,
            description: "Senior technology leadership without the overhead of a full-time executive.",
            items: [
                "Technology roadmap and architecture reviews.",
                "Tool selection, cost optimisation, and scaling strategies.",
                "Advisory support for founders, product leaders, and boards."
            ],
            image: null, // service_advisory_cto.png
            cta: true
        }
    ];

    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Services Hero */}
                <div
                    className="card no-hover-effect"
                    style={{ maxWidth: "1000px", margin: "0 auto 5rem", textAlign: "center", padding: "4rem 2rem" }}
                >
                    <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}>Our Capabilities</h1>
                    <p className="stack" style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 3rem" }}>
                        CogniVectra provides modular, pay-as-you-grow services that help startups
                        build reliable cloud foundations, automate workflows, and bring AI into
                        their products and operations.
                    </p>

                    <img
                        src={servicesHero}
                        alt="Services overview"
                        style={{
                            maxWidth: "850px",
                            width: "100%",
                            height: "auto",
                            borderRadius: "16px",
                            boxShadow: "var(--shadow-lg)"
                        }}
                    />
                </div>

                {/* Service Items */}
                <div className="stack" style={{ gap: "4rem" }}>
                    {services.map((s, idx) => (
                        <div
                            key={idx}
                            className="card"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                                gap: "3rem",
                                alignItems: "center",
                                padding: "3rem"
                            }}
                        >
                            <div style={{ order: idx % 2 === 0 ? 0 : 1 }}>
                                <h2 style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <img src={s.icon} alt="" style={{ width: "32px", height: "32px" }} />
                                    {s.title}
                                </h2>
                                <p className="stack" style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
                                    {s.description}
                                </p>
                                <ul className="stack" style={{ marginTop: "1.5rem" }}>
                                    {s.items.map((item, i) => (
                                        <li key={i} style={{ marginBottom: "0.5rem" }}>✓ {item}</li>
                                    ))}
                                </ul>
                                {s.cta && (
                                    <div style={{ marginTop: "2rem" }}>
                                        <Link to="/contact" className="btn">Talk to us →</Link>
                                    </div>
                                )}
                            </div>

                            {/* Image Placeholder / Slot */}
                            <div
                                style={{
                                    background: "rgba(99, 102, 241, 0.03)",
                                    borderRadius: "12px",
                                    width: "100%",
                                    aspectRatio: "16 / 9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px dashed rgba(255, 255, 255, 0.1)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                            >
                                {s.image ? (
                                    <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
                                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem", filter: "grayscale(1) opacity(0.5)" }}>✨</div>
                                        Visual Insight Pending
                                    </div>
                                )}
                                {/* Decorative Gradient Glow */}
                                <div style={{
                                    position: "absolute",
                                    top: "-50%",
                                    left: "-50%",
                                    width: "200%",
                                    height: "200%",
                                    background: "radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
                                    pointerEvents: "none"
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
