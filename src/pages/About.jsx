export default function About() {
  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero - FULL WHITE BACKGROUND */}
        <div
          className="card"
          style={{
            background: "rgba(255, 255, 255, 0.97) !important",
            backdropFilter: "blur(16px)",
            maxWidth: "900px",
            margin: "0 auto 4rem",
            color: "#0f172a !important",
            padding: "2.5rem",
          }}
        >
          <h2>About CogniVectra</h2>
          <p style={{ color: "#041742ff", lineHeight: "1.75" }}>
            CogniVectra is a technology innovation and consulting partner focused
            on helping startups and enterprises design, build, and scale
            intelligent, automated digital platforms. [web:58]
          </p>
          <p style={{ color: "#0f172a", lineHeight: "1.75" }}>
            We specialize in{" "}
            <strong>
              cloud platforms, automation, AI, data engineering, and GenAI‑powered
              solutions
            </strong>
            , enabling teams to modernize legacy systems, streamline operations,
            and unlock data‑driven decision‑making. [web:55]
          </p>
          <p style={{ color: "#0f172a", lineHeight: "1.75" }}>
            With 25+ years of enterprise IT delivery experience across regulated
            industries, CogniVectra brings{" "}
            <strong>secure, scalable, and future‑ready</strong> foundations to
            startups that need enterprise‑grade reliability without enterprise‑size
            teams. [web:56]
          </p>
        </div>

        <div className="grid2">
          {/* Expertise */}
          <div
            className="card"
            style={{
              background: "rgba(255, 255, 255, 0.97) !important",
              color: "#0f172a !important",
            }}
          >
            <h3>Our Expertise</h3>
            <p style={{ color: "#0c2c76ff" }}>
              Our work bridges strategy and execution—from platform architecture
              and implementation to optimization and go‑to‑market enablement—so
              technology directly supports measurable business outcomes. [web:59]
            </p>

            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{ color: "#1e40af", marginBottom: "1rem" }}
              >
                What we do best:
              </h4>
              <ul style={{ color: "#0f172a" }}>
                <li>Design and implement startup‑ready cloud and data platforms.</li>
                <li>Build GenAI, automation, and AI‑assisted workflows into products and ops.</li>
                <li>Modernize legacy and monolithic systems into modular architectures.</li>
                <li>Enable scalable digital, analytics, and observability ecosystems.</li>
              </ul>
            </div>
          </div>

          {/* Industries & who we help */}
          <div
            className="card"
            style={{
              background: "rgba(255, 255, 255, 0.97) !important",
              color: "#0f172a !important",
            }}
          >
            <h3>Who We Help</h3>
            <p style={{ color: "#0f172a" }}>
              CogniVectra partners with{" "}
              <strong>SaaS, AI‑native, and data‑driven startups</strong> as well
              as enterprises in{" "}
              <strong>Healthcare, BFSI, Insurance, and other complex domains</strong>{" "}
              where reliability, compliance, and scalability are critical. [web:56]
            </p>
            <ul style={{ color: "#0f172a", marginTop: "1rem" }}>
              <li>Early‑stage startups (Pre‑Seed to Series B) needing solid foundations.</li>
              <li>Non‑tech founders looking for a trusted platform and automation partner.</li>
              <li>
                Established enterprises modernizing core systems with cloud, AI, and automation.
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div
          className="card"
          style={{
            background: "rgba(255, 255, 255, 0.97) !important",
            maxWidth: "700px",
            margin: "4rem auto 0",
            textAlign: "center",
            color: "#0f172a !important",
          }}
        >
          <h3 style={{ color: "#0f172a" }}>Ready to build your foundation?</h3>
          <p
            style={{
              color: "#334155",
              fontSize: "1.1rem",
              marginBottom: "2rem",
            }}
          >
            Partner with us to design automation‑driven, cloud‑native platforms
            that keep you moving fast today and ready for what comes next. [web:58]
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #1e40af, #6366f1)",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            Get In Touch →
          </a>
        </div>
      </div>
    </section>
  );
}
