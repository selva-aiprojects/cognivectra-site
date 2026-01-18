import engagementImage from "../assets/engagement-models.png";

export default function Engagements() {
    return (
        <section className="section ai-neutral">
            <div className="container">
                {/* Hero */}
                <div className="card" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
                    <h2>Engagement Models</h2>
                    <p className="stack">
                        Startups need flexibility. Our engagement models are designed to match
                        your stage, budget, and urgency—without locking you into heavy, long-term
                        commitments.
                    </p>

                    <img
                        src={engagementImage}
                        alt="Flexible engagement models: Launch Pack, Monthly Support, Retainer, Advisory"
                        style={{
                            maxWidth: "600px",
                            width: "100%",
                            height: "auto",
                            margin: "2rem auto 0",
                            display: "block",
                        }}
                    />
                </div>

                <div className="grid2">
                    <section className="card">
                        <h3>Startup Launch Pack (4–6 weeks)</h3>
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

                    <section className="card">
                        <h3>Monthly Platform Support</h3>
                        <p className="stack">
                            Ongoing support to keep your cloud, automation, and platforms healthy
                            as your product and team evolve.
                        </p>
                        <ul className="stack">
                            <li>Regular reviews of reliability, performance, and costs.</li>
                            <li>Small enhancements and automation improvements every month.</li>
                            <li>Access to guidance for your in-house engineers.</li>
                        </ul>
                    </section>
                </div>

                <div className="grid2">
                    <section className="card">
                        <h3>Pay-as-you-grow Retainer</h3>
                        <p className="stack">
                            A flexible retainer that scales with your usage and roadmap rather
                            than fixed, large retainers.
                        </p>
                        <ul className="stack">
                            <li>Pre-agreed number of consulting and engineering hours.</li>
                            <li>Prioritised backlog of improvements and features.</li>
                            <li>Ideal for teams that are still forming their in-house platform capability.</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h3>Project-based Delivery</h3>
                        <p className="stack">
                            Fixed-scope or milestone-based projects for specific outcomes such
                            as a new product module, migration, or automation initiative.
                        </p>
                        <ul className="stack">
                            <li>Clearly defined deliverables and timelines.</li>
                            <li>Suitable for migrations, new foundations, or major automation waves.</li>
                            <li>Option to transition into a support or retainer model.</li>
                        </ul>
                    </section>
                </div>

                <div className="card" style={{ maxWidth: "900px", margin: "3rem auto 0" }}>
                    <h3>Fractional CTO Advisory</h3>
                    <p className="stack">
                        For founders who need senior technology guidance but are not yet ready
                        for a full-time CTO.
                    </p>
                    <ul className="stack">
                        <li>Regular strategy sessions and architecture reviews.</li>
                        <li>Support with hiring, vendor selection, and major technology decisions.</li>
                        <li>Board and investor-ready technical narratives and roadmaps.</li>
                    </ul>
                    <p className="stack">
                        Every engagement starts with a short discovery call to understand your
                        stage, constraints, and goals, then we propose the smallest effective
                        starting point.
                    </p>
                </div>
            </div>
        </section>
    );
}
