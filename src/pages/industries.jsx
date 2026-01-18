import industriesImage from "../assets/industries-sectors.png";

export default function Industries() {
    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h2>Industries & Use Cases</h2>
                    <p className="stack">
                        CogniVectra works with SaaS, AI-native, and data-driven startups, as well
                        as enterprises in regulated and complex domains where reliability and
                        compliance matter.
                    </p>

                    <img
                        src={industriesImage}
                        alt="Industries served: FinTech, HealthTech, EdTech, SaaS, AI-native startups"
                        style={{
                            maxWidth: "700px",
                            width: "100%",
                            height: "auto",
                            margin: "2rem auto 0",
                            display: "block",
                        }}
                    />
                </div>

                <div className="grid2">
                    <section className="card">
                        <h3>SaaS & Product Startups</h3>
                        <p className="stack">
                            Multi-tenant, subscription-based products that need strong cloud and
                            automation foundations from day one.
                        </p>
                        <ul className="stack">
                            <li>Multi-environment cloud setups for product teams.</li>
                            <li>Tenant-aware architectures and billing integrations.</li>
                            <li>Usage analytics and customer-facing dashboards.</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h3>FinTech & InsurTech</h3>
                        <p className="stack">
                            Startups dealing with sensitive financial and insurance data in
                            compliance-heavy contexts.
                        </p>
                        <ul className="stack">
                            <li>Secure cloud architectures with strong access controls.</li>
                            <li>Audit-ready logging, monitoring, and traceability.</li>
                            <li>Automation of KYC, underwriting, and back-office workflows.</li>
                        </ul>
                    </section>
                </div>

                <div className="grid2">
                    <section className="card">
                        <h3>HealthTech</h3>
                        <p className="stack">
                            Products that manage health data, clinical workflows, or patient
                            interactions.
                        </p>
                        <ul className="stack">
                            <li>Data and integration platforms for clinical and operational systems.</li>
                            <li>Automation across intake, triage, and reporting workflows.</li>
                            <li>Patterns that support security and regulatory needs.</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h3>EdTech & Learning Platforms</h3>
                        <p className="stack">
                            Learning products that require personalised experiences and robust
                            operational automation.
                        </p>
                        <ul className="stack">
                            <li>Scalable content delivery and user management foundations.</li>
                            <li>Automation of onboarding, enrolment, and notifications.</li>
                            <li>Analytics on engagement, outcomes, and platform health.</li>
                        </ul>
                    </section>
                </div>

                <div className="card" style={{ maxWidth: "900px", margin: "3rem auto 0" }}>
                    <h3>AI-native & Data-driven Startups</h3>
                    <p className="stack">
                        Teams whose products are built around data and AI, and need robust
                        pipelines, observability, and control.
                    </p>
                    <ul className="stack">
                        <li>Data platforms from ingestion through analytics and experimentation.</li>
                        <li>GenAI and ML features embedded into products and workflows.</li>
                        <li>Foundations for monitoring, safety, and lifecycle management.</li>
                    </ul>
                    <p className="stack">
                        Even if your domain is not listed here, if you are building a software
                        or data-driven product and need strong foundations, we can help.
                    </p>
                </div>
            </div>
        </section>
    );
}
