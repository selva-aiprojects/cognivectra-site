import engagementImage from "../assets/engagement-models.png";

export default function Engagements() {
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
                        <h2>Engagement Models</h2>
                        <p className="stack" style={{ fontSize: "1.1rem" }}>
                            Startups need flexibility. Our engagement models are designed to match
                            your stage, budget, and urgency—without locking you into heavy, long-term
                            commitments.
                        </p>
                        <div style={{ marginTop: "2rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🚀</span>
                                <strong>Startup Launch Pack</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🔄</span>
                                <strong>Monthly Platform Support</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🤝</span>
                                <strong>Flexible Retainer</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>👔</span>
                                <strong>Advisory Services</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img
                            src={engagementImage}
                            alt="Flexible engagement models: Launch Pack, Monthly Support, Retainer, Advisory"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>
                </div>

                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🚀</div>
                            <h3>Startup Launch Pack (4–6 weeks)</h3>
                        </div>
                        <p className="stack">
                            A focused engagement to set up your initial cloud, CI/CD, observability,
                            and a few high-impact automations.
                        </p>
                        <ul className="stack">
                            <li>Cloud landing zone and environments for dev, test, and prod.</li>
                            <li>Basic CI/CD pipelines and deployment workflows.</li>
                            <li>Monitoring, logging, and at least one end-to-end automated workflow.</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🔄</div>
                            <h3>Monthly Platform Support</h3>
                        </div>
                        <p className="stack">
                            Ongoing support to keep your cloud, automation, and platforms healthy
                            as your product and team evolve.
                        </p>
                        <ul className="stack">
                            <li>Regular reviews of reliability, performance, and costs.</li>
                            <li>Platform improvements and new automation capabilities.</li>
                            <li>On-call support for critical platform issues.</li>
                        </ul>
                    </section>
                </div>

                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🤝</div>
                            <h3>Flexible Retainer</h3>
                        </div>
                        <p className="stack">
                            Pay-as-you-go support for startups that need ongoing expertise but
                            want to control costs and scope.
                        </p>
                        <ul className="stack">
                            <li>Pre-purchased hours at discounted rates.</li>
                            <li>Roll-over hours for up to 3 months.</li>
                            <li>Priority scheduling and faster response times.</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>👔</div>
                            <h3>Fractional CTO & Advisory</h3>
                        </div>
                        <p className="stack">
                            Strategic technology leadership without the full-time executive cost.
                            Perfect for non-technical founders or growing teams.
                        </p>
                        <ul className="stack">
                            <li>Technology roadmap and architecture reviews.</li>
                            <li>Team mentoring and skill development.</li>
                            <li>Board and investor meeting preparation.</li>
                        </ul>
                    </section>
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
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💎</div>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                            Flexible Partnership
                        </h3>
                        <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                            We adapt to your needs, not the other way around. Start small,
                            scale as you grow, and stay in control of your technology journey.
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
                    <h3 style={{ marginBottom: "1.5rem" }}>Which model fits your startup?</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Not sure which engagement model is right for you? Let's discuss your
                        current challenges and goals to find the perfect fit.
                    </p>
                    <a href="/contact" className="btn">
                        Explore Options →
                    </a>
                </div>
            </div>
        </section>
    );
}
