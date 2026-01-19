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
              Accelerate your startup growth with enterprise-grade technology infrastructure
            </h1>

            <p className="stack" style={{ fontSize: "1.2rem", fontWeight: "500", color: "var(--text-secondary)" }}>
              We deliver robust Cloud, DevOps, and Automation solutions that power your innovation, enabling you to focus entirely on product excellence and market expansion.
            </p>

            <ul style={{ margin: "1.5rem 0", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "0.5rem" }}>✓ <strong>Enterprise-grade reliability</strong> from Day 1</li>
              <li style={{ marginBottom: "0.5rem" }}>✓ <strong>Accelerated time-to-market</strong> with proven SaaS frameworks</li>
              <li>✓ <strong>Optimized operations</strong> through intelligent automation and cloud efficiency</li>
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
                Schedule Your Strategy Session →
              </Link>
              <Link to="/services" className="btn btn-outline">
                Explore Our Services
              </Link>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted-dark)" }}>
              Complimentary consultation. Direct engagement with our Principal Architect.
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

        {/* The Opportunity Section */}
        <div style={{ margin: "0 auto 4rem", maxWidth: "1000px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>Your Technology Foundation Matters</h2>
          <div className="grid2" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
              <h4>Scalable Infrastructure</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Build on automated deployment pipelines and consistent environments that support rapid, confident releases and continuous innovation.
              </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💡</div>
              <h4>Optimized Cloud Economics</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Maximize your runway with intelligent resource allocation, right-sized infrastructure, and proactive cost management strategies.
              </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
              <h4>Strategic Focus</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Free your team to concentrate on core product development and customer acquisition with fully automated operational workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Two-column feature grid */}
        <div className="grid2">
          <section className="card">
            <h3>Comprehensive Solutions for Modern Startups</h3>
            <p className="stack">
              We architect scalable, modular technology foundations tailored for{" "}
              <strong>SaaS, AI-native, and data-driven startups</strong>.
            </p>
            <ul className="stack">
              <li>Strategic cloud infrastructure on AWS, GCP, or Azure</li>
              <li>Intelligent process automation across Operations, Finance, HR, and Support</li>
              <li>Production-ready SaaS components: authentication, billing, notifications</li>
              <li>Enterprise-grade DevOps and platform engineering</li>
              <li>AI and data enablement for products and internal operations</li>
            </ul>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/mission" className="btn">
                Discover Our Methodology →
              </Link>
            </div>
          </section>

          <section className="card">
            <h3>Flexible Partnership Models</h3>
            <p className="stack">
              Adaptable engagement approaches designed to support your journey from inception through Series B and beyond.
            </p>
            <ul className="stack">
              <li>Startup Launch Pack (4–6 week foundation implementation)</li>
              <li>Ongoing platform and automation enhancement</li>
              <li>Flexible retainer models that scale with your growth</li>
              <li>Project-based delivery for strategic initiatives</li>
              <li>Fractional CTO and architectural advisory services</li>
            </ul>
            <div style={{ marginTop: "1.5rem" }}>
              <Link to="/contact" className="btn">
                Begin Your Journey →
              </Link>
            </div>
          </section>
        </div>

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
              <h3>Enterprise Excellence. Startup Agility.</h3>
              <p className="stack">
                Experience the perfect balance of proven enterprise methodologies delivered with startup velocity.
              </p>
              <p className="stack">
                We bring <strong>25+ years of expertise</strong> architecting mission-critical platforms for global enterprises, now refined into agile, high-impact solutions for startups.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link to="/about" style={{ fontWeight: "600" }}>
                  Learn about our expertise →
                </Link>
              </div>
            </div>

            <ul className="stack" style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <li>🚀 <strong>Fractional CTO & Strategic Advisory</strong></li>
              <li>⚙️ <strong>DevOps & Cloud Automation</strong></li>
              <li>🤖 <strong>AI & Workflow Orchestration</strong></li>
              <li>🏗️ <strong>SaaS Product Foundations</strong></li>
            </ul>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: "center", marginTop: "5rem", marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Ready to elevate your technology foundation?</h2>
          <Link to="/contact" className="btn" style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}>
            Let's Discuss Your Vision
          </Link>
        </div>

      </div>
    </section>
  );
}