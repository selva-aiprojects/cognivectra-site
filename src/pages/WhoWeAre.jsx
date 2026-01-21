export default function WhoWeAre() {
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
            padding: "3rem 2.5rem"
          }}
        >
          <div>
            <h2>Who We Are</h2>
            <p className="stack">
              CogniVectra Innovations is a startup-focused technology partner
              specializing in automation, cloud foundations, and SaaS building
              blocks that enable founders to move fast without compromising on
              reliability.
            </p>
            <p className="stack">
              We work at the intersection of systems engineering, data, cloud, and
              applied intelligence, helping startups modernize operations,
              streamline workflows, and build future-ready digital platforms that
              investors and customers can trust.
            </p>
            <p className="stack">
              Our approach is pragmatic and outcome-driven: design lean, robust
              foundations, automate what slows you down, and keep your technology
              stack understandable as you scale.
            </p>
          </div>

          {/* Visual Element */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))",
              borderRadius: "16px",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem"
            }}>
              <div style={{ fontSize: "4rem", opacity: 0.8 }}>🏗️</div>
              <h3 style={{ color: "var(--accent-primary)" }}>Startup-Focused Engineering</h3>
              <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
                Pragmatic technology solutions designed for startup velocity and sustainability
              </p>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid2">
          <section className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>💎</div>
              <h2>What We Value</h2>
            </div>
            <ul className="stack">
              <li>Integrity in advice, estimates, and delivery.</li>
              <li>Consistency in architecture, operations, and support.</li>
              <li>Community ownership and knowledge sharing with your team.</li>
              <li>Outcome-driven innovation, not technology for its own sake.</li>
              <li>
                Pragmatic technology leadership that balances speed, cost, and
                risk.
              </li>
            </ul>
          </section>

          <section className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>🎯</div>
              <h2>Our Approach</h2>
            </div>
            <p className="stack">
              We start with your business model, customers, and runway, then
              design automation and cloud foundations that match your current
              stage and future growth.
            </p>
            <p className="stack">
              Every engagement blends architecture, hands-on implementation, and
              mentoring for your in-house team, so you are not locked into a
              black-box platform.
            </p>
            <div style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
              borderRadius: "12px",
              padding: "1.5rem",
              marginTop: "1.5rem",
              textAlign: "center"
            }}>
              <p style={{ margin: 0, fontWeight: "600", color: "var(--accent-primary)" }}>
                Pragmatic. Sustainable. Built for startups.
              </p>
            </div>
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
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
            <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
              What We Do
            </h3>
            <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Comprehensive technology solutions spanning cloud foundations, intelligent operations,
              SaaS building blocks, and strategic advisory
            </p>
          </div>
        </div>

        {/* What We Do - Grid Layout */}
        <div className="grid2">
          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>☁️</div>
              <h3>Cloud & Platform Foundations</h3>
            </div>
            <ul>
              <li>Design and setup of startup-ready cloud landing zones.</li>
              <li>Cloud-native and hybrid architecture for SaaS products.</li>
              <li>Multi-environment, multi-account setups with security baked in.</li>
              <li>
                Integration of data, automation, and observability into core
                platforms.
              </li>
            </ul>
          </div>

          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>🤖</div>
              <h3>Intelligent Operations & Automation</h3>
            </div>
            <ul>
              <li>Business and IT operations optimization for lean teams.</li>
              <li>Workflow orchestration and event-driven automation.</li>
              <li>
                No-code, low-code, and API-based automation across tools and
                teams.
              </li>
            </ul>
          </div>
        </div>

        <div className="grid2">
          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>🚀</div>
              <h3>SaaS & Applied Intelligence</h3>
            </div>
            <ul>
              <li>Reusable SaaS components: auth, billing, and notifications.</li>
              <li>
                Practical AI and analytics embedded into products and operations.
              </li>
              <li>
                Human-in-the-loop patterns for safer, more reliable automation.
              </li>
            </ul>
          </div>

          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", opacity: 0.7 }}>👥</div>
              <h3>Advisory & Fractional Leadership</h3>
            </div>
            <ul>
              <li>Technology strategy and runway-aware roadmaps.</li>
              <li>Architecture reviews and modernization planning.</li>
              <li>
                Fractional CTO and platform advisory for founders and boards.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
