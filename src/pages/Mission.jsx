import { Link } from "react-router-dom";

// Hero image - using the same high-quality style as home page
import missionHero from "../assets/mission-vision.png";

export default function Mission() {
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
                        <h2>Mission & Vision</h2>
                        <p className="stack" style={{ fontSize: "1.1rem" }}>
                            We help startups build reliable, automated platforms that scale with confidence.
                            Our mission is to make enterprise-grade infrastructure accessible to every
                            founder, and our vision is a world where technology enables innovation without friction.
                        </p>
                        <div style={{ marginTop: "2rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                                <strong>Mission: Empower Founders</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>🔭</span>
                                <strong>Vision: Frictionless Innovation</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>💎</span>
                                <strong>Values: Excellence & Simplicity</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img
                            src={missionHero}
                            alt="Mission and vision: empowering founders with frictionless innovation"
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
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                            Enabling Innovation at Scale
                        </h3>
                        <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                            We believe great technology should be invisible, allowing founders to focus
                            on what matters most: building amazing products and serving their customers
                        </p>
                    </div>
                </div>

                {/* Guiding Principles */}
                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🎯</div>
                            <h3>Founder-First</h3>
                        </div>
                        <p className="stack">
                            We prioritize founder needs and business outcomes over technical complexity.
                            Our solutions are designed to solve real business problems and accelerate growth.
                        </p>
                        <ul className="stack">
                            <li>Business outcomes over technical complexity</li>
                            <li>Rapid time-to-value for founders</li>
                            <li>Scalable solutions that grow with your business</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🔭</div>
                            <h3>Long-Term Thinking</h3>
                        </div>
                        <p className="stack">
                            We build foundations that support today's needs and tomorrow's growth.
                            Our solutions are designed for scalability and long-term success.
                        </p>
                        <ul className="stack">
                            <li>Scalable architecture from day one</li>
                            <li>Future-proof technology choices</li>
                            <li>Sustainable technical debt management</li>
                        </ul>
                    </section>
                </div>

                <div className="grid2">
                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>💎</div>
                            <h3>Excellence & Simplicity</h3>
                        </div>
                        <p className="stack">
                            We deliver sophisticated solutions that are remarkably simple to use.
                            Complex problems deserve elegant, user-friendly solutions.
                        </p>
                        <ul className="stack">
                            <li>Enterprise-grade quality with startup speed</li>
                            <li>Clean, maintainable code and architecture</li>
                            <li>Intuitive user experiences</li>
                        </ul>
                    </section>

                    <section className="card" style={{ padding: "2.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem", opacity: 0.7 }}>🤝</div>
                            <h3>Partnership Approach</h3>
                        </div>
                        <p className="stack">
                            We work as an extension of your team, not just as consultants.
                            Your success is our success.
                        </p>
                        <ul className="stack">
                            <li>Collaborative problem-solving</li>
                            <li>Knowledge transfer and team enablement</li>
                            <li>Long-term partnership mindset</li>
                        </ul>
                    </section>
                </div>

                {/* Who We Serve */}
                <div className="card" style={{ maxWidth: "900px", margin: "3rem auto 0", padding: "3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "2.5rem", opacity: 0.7 }}>👥</div>
                        <h3>Who We Serve</h3>
                    </div>
                    <p className="stack">
                        Early-stage to Series B startups who need strong technical foundations but
                        lack the time or expertise to build them from scratch.
                    </p>
                    <div className="grid2" style={{ marginTop: "2rem" }}>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>🚀 Pre-Seed to Seed</h4>
                            <ul className="stack">
                                <li>Founders building their first product</li>
                                <li>Teams needing MVP infrastructure</li>
                                <li>Companies preparing for first customers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>📈 Series A to B</h4>
                            <ul className="stack">
                                <li>Scaling teams and products</li>
                                <li>Improving reliability and performance</li>
                                <li>Preparing for enterprise customers</li>
                            </ul>
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
                    <h3 style={{ marginBottom: "1.5rem" }}>Ready to Build Your Foundation?</h3>
                    <p className="stack" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Let's discuss how we can help you build the technical foundation
                        for your next stage of growth.
                    </p>
                    <Link to="/contact" className="btn">
                        Start the Conversation →
                    </Link>
                </div>
            </div>
        </section>
    );
}
