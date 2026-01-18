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
    return (
        <section className="section ai-neutral">
            <div className="container">

                {/* Services Hero */}
                <div
                    className="card"
                    style={{ maxWidth: "900px", margin: "0 auto 3rem", textAlign: "center" }}
                >
                    <h2>Services</h2>
                    <p className="stack">
                        CogniVectra provides modular, pay-as-you-grow services that help startups
                        build reliable cloud foundations, automate workflows, and bring AI into
                        their products and operations.
                    </p>

                    <img
                        src={servicesHero}
                        alt="CogniVectra services overview: cloud, automation, DevOps, SaaS, AI, and advisory"
                        style={{
                            maxWidth: "700px",
                            width: "100%",
                            height: "auto",
                            margin: "2rem auto 0",
                            display: "block",
                        }}
                    />


                </div>

                {/* Cloud Infrastructure */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h3>
                        <img
                            src={cloudIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        Cloud Infrastructure for Startups
                    </h3>
                    <p className="stack">
                        Secure, scalable, and cost-aware cloud foundations on AWS, GCP, or Azure
                        tailored for SaaS and AI-native startups.
                    </p>
                    <ul className="stack">
                        <li>Cloud landing zones and multi-account / multi-environment setup.</li>
                        <li>Network, security, and identity baselines baked in.</li>
                        <li>FinOps-ready design to keep costs predictable.</li>
                    </ul>
                </div>

                {/* Process Automation */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h3>
                        <img
                            src={automationIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        Process Automation & Workflow Enablement
                    </h3>
                    <p className="stack">
                        Automate recurring work across operations, finance, HR, and support using
                        no-code, low-code, and API-based orchestration.
                    </p>
                    <ul className="stack">
                        <li>Business process automation across key back-office functions.</li>
                        <li>No-code / low-code apps plus event-driven workflows.</li>
                        <li>GenAI-assisted workflows and internal or customer-facing chatbots.</li>
                    </ul>
                </div>

                {/* SaaS Building Blocks */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h3>
                        <img
                            src={saasIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        SaaS Building Blocks
                    </h3>
                    <p className="stack">
                        Plug-and-play components so your team does not reinvent the wheel for
                        every product capability.
                    </p>
                    <ul className="stack">
                        <li>Authentication, authorization, and user management.</li>
                        <li>Billing, subscriptions, and usage-based metering.</li>
                        <li>Email, SMS, WhatsApp, and in-app notifications.</li>
                        <li>Logging, monitoring, and analytics dashboards.</li>
                    </ul>
                </div>

                {/* DevOps */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h3>
                        <img
                            src={devopsIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        DevOps & Platform Engineering
                    </h3>
                    <p className="stack">
                        Production-ready delivery pipelines and platform capabilities designed
                        to support rapid iteration without sacrificing reliability.
                    </p>
                    <ul className="stack">
                        <li>CI/CD pipelines and Infrastructure as Code (Terraform).</li>
                        <li>Kubernetes and container platforms where appropriate.</li>
                        <li>Observability, alerting, and release automation.</li>
                    </ul>
                </div>

                {/* AI & Data */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h3>
                        <img
                            src={aiIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        AI & Data Enablement
                    </h3>
                    <p className="stack">
                        Pragmatic AI and data platforms that align with your product roadmap
                        and risk appetite.
                    </p>
                    <ul className="stack">
                        <li>GenAI integrations, assistants, and copilots.</li>
                        <li>Data platforms from ingestion pipelines to analytics.</li>
                        <li>AI governance and lifecycle patterns suitable for startups.</li>
                    </ul>
                </div>

                {/* Advisory */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h3>
                        <img
                            src={advisoryIcon}
                            alt=""
                            style={{ width: "28px", marginRight: "0.5rem", verticalAlign: "middle" }}
                        />
                        Fractional CTO & Technology Advisory
                    </h3>
                    <p className="stack">
                        Senior technology leadership without the overhead of a full-time executive.
                    </p>
                    <ul className="stack">
                        <li>Technology roadmap and architecture reviews.</li>
                        <li>Tool selection, cost optimisation, and scaling strategies.</li>
                        <li>Advisory support for founders, product leaders, and boards.</li>
                    </ul>

                    <div style={{ marginTop: "1.5rem" }}>
                        <Link to="/contact" className="btn">
                            Talk to us →
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
