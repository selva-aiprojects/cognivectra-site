import { Link } from "react-router-dom";

// Add a hero image for Results page
import resultsHero from "../assets/engagement-models.png";

export default function Results() {
    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero */}
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
                        <h2>Results & Case Snapshots</h2>
                        <p className="stack" style={{ fontSize: "1.1rem" }}>
                            CogniVectra helps startups and teams move from fragile setups to
                            reliable, automated platforms. Here are a few examples of the kind
                            of impact we aim to deliver.
                        </p>
                        <div style={{ marginTop: "2rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🚀</span>
                                <strong>Faster Releases</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🤖</span>
                                <strong>AI Enablement</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>💼</span>
                                <strong>Automation Wins</strong>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            src={resultsHero}
                            alt="Results: Faster releases, AI enablement, automation wins"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>
                </div>

                {/* Case 1 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem", padding: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "2rem", opacity: 0.7 }}>🚀</div>
                        <h3>SaaS startup: faster releases with CI/CD and automation</h3>
                    </div>
                    <p className="stack">
                        A B2B SaaS startup was deploying manually, with frequent production
                        issues and slow release cycles.
                    </p>
                    <ul className="stack">
                        <li>Set up a basic but robust CI/CD pipeline and environment strategy.</li>
                        <li>Introduced automated smoke checks and alerting for key endpoints.</li>
                        <li>Documented a lightweight release process for the internal team.</li>
                    </ul>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginTop: "1.5rem"
                    }}>
                        <p className="stack" style={{ margin: 0, textAlign: "center" }}>
                            <strong>Outcome:</strong> release lead time reduced from weeks to a few days, with
                            fewer production surprises and clearer ownership.
                        </p>
                    </div>
                </div>

                {/* Case 2 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem", padding: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "2rem", opacity: 0.7 }}>🤖</div>
                        <h3>AI-native startup: clearer cloud costs and stability</h3>
                    </div>
                    <p className="stack">
                        An AI-native startup was scaling experiments fast but had rising
                        cloud costs and unstable environments.
                    </p>
                    <ul className="stack">
                        <li>Redesigned accounts, environments, and basic governance setup.</li>
                        <li>Introduced cost tagging and simple dashboards for spend visibility.</li>
                        <li>Added guardrails for key services and workloads.</li>
                    </ul>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginTop: "1.5rem"
                    }}>
                        <p className="stack" style={{ margin: 0, textAlign: "center" }}>
                            <strong>Outcome:</strong> better stability and visibility, with a more predictable
                            cloud bill and fewer "mystery" cost spikes.
                        </p>
                    </div>
                </div>

                {/* Case 3 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem", padding: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "2rem", opacity: 0.7 }}>💼</div>
                        <h3>Non‑tech founder: automation for core operations</h3>
                    </div>
                    <p className="stack">
                        A non‑technical founder was juggling onboarding, invoicing, and
                        support manually across multiple tools.
                    </p>
                    <ul className="stack">
                        <li>Mapped the core workflows across sales, onboarding, and billing.</li>
                        <li>Implemented no‑code automations connecting existing SaaS tools.</li>
                        <li>Added basic reporting to track throughput and bottlenecks.</li>
                    </ul>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginTop: "1.5rem"
                    }}>
                        <p className="stack" style={{ margin: 0, textAlign: "center" }}>
                            <strong>Outcome:</strong> fewer manual handoffs, less error‑prone work, and more time
                            for the founder to focus on customers.
                        </p>
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
                    <h3 style={{ marginBottom: "1.5rem" }}>Want similar outcomes for your startup?</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Share a bit about your current platform and we will suggest a
                        smallest useful starting point—whether that is a Launch Pack,
                        automation sprint, or advisory.
                    </p>
                    <Link to="/contact" className="btn">
                        Talk to us →
                    </Link>
                </div>

                {/* Visual Break Section */}
                <div style={{ margin: "4rem auto", textAlign: "center" }}>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                        borderRadius: "20px",
                        padding: "2.5rem",
                        maxWidth: "800px",
                        margin: "0 auto"
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                            Measurable Impact
                        </h3>
                        <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                            Our focus is on delivering tangible results that improve your development velocity,
                            reduce costs, and increase platform reliability
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
