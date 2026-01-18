import { Link } from "react-router-dom";
import heroImage from "../assets/home-hero-automation.png";

export default function Home() {
  return (
    <section className="section ai-neutral">
      <div className="container">

        {/* Hero Section */}
        <div
          className="card hero-card"
          style={{
            maxWidth: "1200px",
            margin: "0 auto 4rem",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "3rem",
            alignItems: "center",
            padding: "3rem 2.5rem",
          }}
        >
          {/* Left: Text */}
          <div>
            <h1 style={{ lineHeight: "1.15", marginBottom: "1.5rem" }}>
              Scale your startup without breaking your platform (or your budget)
            </h1>

            <p className="stack" style={{ fontSize: "1.2rem", fontWeight: "500", color: "#334155" }}>
              We build the "boring" but critical technology backbone—Cloud, DevOps,
              and Automation—so you can focus entirely on your product and growth.
            </p>

            <ul style={{ margin: "1.5rem 0", color: "#475569" }}>
              <li style={{ marginBottom: "0.5rem" }}>✅ <strong>Enterprise-grade reliability</strong> from Day 1.</li>
              <li style={{ marginBottom: "0.5rem" }}>✅ <strong>Launch faster</strong> with pre-built SaaS modules.</li>
              <li>✅ <strong>Reduce burn</strong> with automated ops and optimised cloud.</li>
            </ul>

            <div
              className="stack"
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Link to="/contact" className="btn">
                Book a Free Strategy Call →
              </Link>
              <Link to="/services" className="btn btn-outline">
                View our services
              </Link>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
              No commitment. Direct access to a Principal Architect.
            </p>
          </div>

          {/* Right: Image */}
          <div style={{ textAlign: "center" }}>
            <img
              src={heroImage}
              alt="Startup Platform Architecture"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>

        {/* The Problem / Solution Strip */}
        <div style={{ margin: "0 auto 4rem", maxWidth: "1000px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>The Startup "Scaling Trap"</h2>
          <div className="grid2" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚧</div>
              <h4>Fragile Infrastructure</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Manual deployments, downtime during releases, and "works on my machine" issues that kill momentum.
              </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💸</div>
              <h4>Cloud Bill Shock</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Credits run out, and suddenly you are paying $5k/mo because of unoptimised databases and wild logging.
              </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
              <h4>Founder Burnout</h4>
              <p style={{ fontSize: "0.9rem" }}>
                You spend 50% of your time fixing Ops, onboarding, and manual billing instead of selling.
              </p>
            </div>
          </div>
        </div>

        {/* Two-column feature grid */}
        <div className="grid2">
          <section className="card">
            <h3>What we build for startups</h3>
            <p className="stack">
              We design modular, pay-as-you-grow technology foundations for{" "}
              <strong>SaaS, AI-native, and data-driven startups</strong>.
            </p>
            <ul className="stack">
              <li>Cloud landing zones on AWS, GCP, or Azure.</li>
              <li>Process automation across Ops, Finance, HR, and Support.</li>
              <li>Plug-and-play SaaS components: auth, billing, notifications.</li>
              <li>Production-grade DevOps and platform engineering.</li>
              <li>AI and data enablement for products and internal operations.</li>
            </ul>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/mission" className="btn">
                Explore our approach →
              </Link>
            </div>
          </section>

          <section className="card">
            <h3>How we work with startups</h3>
            <p className="stack">
              Flexible engagement models aligned to your stage, from idea to
              Series B and beyond.
            </p>
            <ul className="stack">
              <li>Startup Launch Pack (4–6 week foundation setup).</li>
              <li>Monthly platform and automation support.</li>
              <li>Pay-as-you-grow retainers for evolving needs.</li>
              <li>Project-based delivery for focused initiatives.</li>
              <li>Fractional CTO and architecture advisory.</li>
            </ul>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/contact" className="btn">
                Start a conversation →
              </Link>
            </div>
          </section>
        </div>

        {/* Credibility Strip */}
        {/* Credibility / Why Us */}
        <div
          className="card"
          style={{
            marginTop: "3rem",
            maxWidth: "1000px",
            marginInline: "auto",
            background: "linear-gradient(to right, #ffffff, #f8fafc)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <h3>Enterprise DNA. Startup Speed.</h3>
              <p className="stack">
                You don't need a heavy consulting firm. You need a partner who has "seen the movie" before.
              </p>
              <p className="stack">
                We bring <strong>25+ years of experience</strong> delivering mission-critical platforms for global enterprises, distilled into a lean, fast-moving service for startups.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link to="/about" style={{ fontWeight: "600" }}>
                  Read more about our background →
                </Link>
              </div>
            </div>

            <ul className="stack" style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <li>🚀 <strong>Fractional CTO & Advisory</strong></li>
              <li>⚙️ <strong>DevOps & Cloud Automation</strong></li>
              <li>🤖 <strong>AI & Workflow Orchestration</strong></li>
              <li>🏗️ <strong>SaaS Product Foundations</strong></li>
            </ul>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: "center", marginTop: "5rem", marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Ready to stop fixing and start building?</h2>
          <Link to="/contact" className="btn" style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}>
            Let's talk about your project
          </Link>
        </div>

      </div>
    </section>
  );
}
