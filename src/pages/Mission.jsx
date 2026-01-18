import missionImage from "../assets/mission-vision.png";

export default function Mission() {
  return (
    <section className="section ai-neutral">
      <div className="container">

        {/* Mission Hero */}
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
          <h2>Our Mission</h2>
          <p className="stack">
            Our mission is to help startups build intelligent, automated, and resilient
            technology foundations so they can operate smarter, scale faster, and stay
            focused on customers instead of infrastructure.
          </p>
          <p className="stack">
            Intelligence for us is not just about AI. It is the combination of clear
            thinking, robust architecture, thoughtful automation, and disciplined
            execution—so your cloud, data, and processes work together as one system.
          </p>
        </div>

        {/* Mission Visual: How We Work */}
        <div
          className="card"
          style={{
            maxWidth: "900px",
            margin: "0 auto 3rem",
            textAlign: "center",
          }}
        >
          <img
            src={missionImage}
            alt="CogniVectra mission illustrated as a layered approach from cloud foundations to intelligent insights"
            style={{
              maxWidth: "600px",
              width: "100%",
              height: "auto",
              margin: "0 auto",
              display: "block",
            }}
          />
        </div>

        {/* Guiding Principles */}
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto 2rem" }}>
          <h2>Guiding Principles</h2>
          <ul className="stack" style={{ paddingLeft: "1.5rem" }}>
            <li>Start with business outcomes, not tools or buzzwords.</li>
            <li>Design for simplicity first—simple systems scale better than complex ones.</li>
            <li>Treat automation as a product, with owners, feedback, and iteration.</li>
            <li>Build cloud and data foundations that can evolve as the startup grows.</li>
            <li>Prioritize reliability, security, and observability from day zero.</li>
            <li>Reuse proven patterns and components; reinvent only where differentiation matters.</li>
            <li>Create systems that remain understandable, maintainable, and valuable long term.</li>
          </ul>
        </div>

        {/* Who We Serve */}
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2>Who We Serve</h2>
          <p className="stack">
            CogniVectra partners with founders and teams who need enterprise-grade
            automation and cloud foundations without building a large in-house platform team.
          </p>
          <ul className="stack" style={{ paddingLeft: "1.5rem" }}>
            <li>Early-stage startups from Pre-Seed to Series B.</li>
            <li>SaaS and product-led startups building multi-tenant platforms.</li>
            <li>AI-native and data-driven startups with strong data backbones.</li>
            <li>Non-technical founders who need reliable, scalable IT foundations.</li>
            <li>Founders in FinTech, HealthTech, InsurTech, EdTech, and regulated domains.</li>
          </ul>
        </div>

      </div>
    </section>
  );
}
