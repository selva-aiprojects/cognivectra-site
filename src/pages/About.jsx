import { Link } from "react-router-dom";

export default function About() {
    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero Section */}
                <div 
                    className="card hero-card"
                    style={{
                        maxWidth: "1000px",
                        margin: "0 auto 4rem",
                        textAlign: "center",
                        padding: "3rem 2.5rem"
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>👋</div>
                    <h2>About CogniVectra</h2>
                    <p className="stack" style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
                        We are a team of experienced engineers and platform specialists dedicated to helping
                        startups build reliable, scalable foundations without the overhead of large teams.
                    </p>
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
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                            Our Approach
                        </h3>
                        <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                            We combine deep technical expertise with practical business understanding
                            to deliver solutions that truly matter for your startup's success
                        </p>
                    </div>
                </div>

                {/* Our Expertise */}
                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🏗️</div>
                            <h3>Platform Engineering</h3>
                        </div>
                        <p className="stack">
                            We design and build the foundational platforms that power modern SaaS
                            applications, from authentication to billing and everything in between.
                        </p>
                        <ul className="stack">
                            <li>Multi-tenant architecture design</li>
                            <li>Scalable data models and APIs</li>
                            <li>Performance optimization and monitoring</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>☁️</div>
                            <h3>Cloud Infrastructure</h3>
                        </div>
                        <p className="stack">
                            We help you navigate the complexity of cloud providers, ensuring your
                            infrastructure is secure, cost-effective, and ready to scale.
                        </p>
                        <ul className="stack">
                            <li>Multi-cloud and hybrid strategies</li>
                            <li>Security and compliance frameworks</li>
                            <li>Cost optimization and governance</li>
                        </ul>
                    </section>
                </div>

                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🤖</div>
                            <h3>Process Automation</h3>
                        </div>
                        <p className="stack">
                            We automate repetitive tasks and workflows, freeing your team to focus
                            on building great products and serving customers.
                        </p>
                        <ul className="stack">
                            <li>No-code and low-code solutions</li>
                            <li>API integrations and data pipelines</li>
                            <li>Workflow orchestration and monitoring</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>📊</div>
                            <h3>Data & Analytics</h3>
                        </div>
                        <p className="stack">
                            We help you make data-driven decisions with robust analytics platforms
                            and real-time insights into your business metrics.
                        </p>
                        <ul className="stack">
                            <li>Data warehouse and pipeline design</li>
                            <li>Real-time analytics and dashboards</li>
                            <li>Business intelligence and reporting</li>
                        </ul>
                    </section>
                </div>

                {/* Team Values */}
                <div className="card" style={{ maxWidth: "900px", margin: "3rem auto 0", padding: "3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "2.5rem", opacity: 0.7 }}>🌟</div>
                        <h3>Our Values</h3>
                    </div>
                    <div className="grid2" style={{ marginTop: "2rem" }}>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>🎯 Excellence</h4>
                            <p style={{ color: "var(--text-secondary)" }}>
                                We deliver enterprise-grade quality with startup speed and agility.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>🤝 Partnership</h4>
                            <p style={{ color: "var(--text-secondary)" }}>
                                We work as an extension of your team, not just as consultants.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>🚀 Innovation</h4>
                            <p style={{ color: "var(--text-secondary)" }}>
                                We bring cutting-edge solutions to solve your unique challenges.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>💎 Simplicity</h4>
                            <p style={{ color: "var(--text-secondary)" }}>
                                We make complex technology simple and accessible.
                            </p>
                        </div>
                    </div>
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
                    <h3 style={{ marginBottom: "1.5rem" }}>Let's Build Something Amazing Together</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Ready to discuss how we can help you build the technical foundation
                        for your startup's success?
                    </p>
                    <Link to="/contact" className="btn">
                        Get in Touch →
                    </Link>
                </div>
            </div>
        </section>
    );
}
