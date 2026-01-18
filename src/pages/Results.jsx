import { Link } from "react-router-dom";

export default function Results() {
    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h2>Results & Case Snapshots</h2>
                    <p className="stack">
                        CogniVectra helps startups and teams move from fragile setups to
                        reliable, automated platforms. Here are a few examples of the kind
                        of impact we aim to deliver.
                    </p>
                </div>

                {/* Case 1 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem" }}>
                    <h3>SaaS startup: faster releases with CI/CD and automation</h3>
                    <p className="stack">
                        A B2B SaaS startup was deploying manually, with frequent production
                        issues and slow release cycles.
                    </p>
                    <ul className="stack">
                        <li>Set up a basic but robust CI/CD pipeline and environment strategy.</li>
                        <li>Introduced automated smoke checks and alerting for key endpoints.</li>
                        <li>Documented a lightweight release process for the internal team.</li>
                    </ul>
                    <p className="stack">
                        Outcome: release lead time reduced from weeks to a few days, with
                        fewer production surprises and clearer ownership.
                    </p>
                </div>

                {/* Case 2 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem" }}>
                    <h3>AI-native startup: clearer cloud costs and stability</h3>
                    <p className="stack">
                        An AI-native startup was scaling experiments fast but had rising
                        cloud costs and unstable environments.
                    </p>
                    <ul className="stack">
                        <li>Redesigned accounts, environments, and basic governance setup.</li>
                        <li>Introduced cost tagging and simple dashboards for spend visibility.</li>
                        <li>Added guardrails for key services and workloads.</li>
                    </ul>
                    <p className="stack">
                        Outcome: better stability and visibility, with a more predictable
                        cloud bill and fewer “mystery” cost spikes.
                    </p>
                </div>

                {/* Case 3 */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 2rem" }}>
                    <h3>Non‑tech founder: automation for core operations</h3>
                    <p className="stack">
                        A non‑technical founder was juggling onboarding, invoicing, and
                        support manually across multiple tools.
                    </p>
                    <ul className="stack">
                        <li>Mapped the core workflows across sales, onboarding, and billing.</li>
                        <li>Implemented no‑code automations connecting existing SaaS tools.</li>
                        <li>Added basic reporting to track throughput and bottlenecks.</li>
                    </ul>
                    <p className="stack">
                        Outcome: fewer manual handoffs, less error‑prone work, and more time
                        for the founder to focus on customers.
                    </p>
                </div>

                {/* CTA */}
                <div className="card" style={{ maxWidth: "900px", margin: "3rem auto 0" }}>
                    <h3>Want similar outcomes for your startup?</h3>
                    <p className="stack">
                        Share a bit about your current platform and we will suggest a
                        smallest useful starting point—whether that is a Launch Pack,
                        automation sprint, or advisory.
                    </p>
                    <Link to="/contact" className="btn">
                        Talk to us →
                    </Link>
                </div>
            </div>
        </section>
    );
}
