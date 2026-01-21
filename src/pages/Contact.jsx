import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData(e.target);
      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const msg = formData.get("message")?.toString().trim();
      const stage = formData.get("stage")?.toString().trim();
      const need = formData.get("need")?.toString().trim();

      // Client-side validation
      if (!name || !email || !msg || name.length < 2 || msg.length < 10) {
        throw new Error("Please fill all fields properly");
      }

      // Skip Supabase on localhost
      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      if (!isLocalhost) {
        const { error } = await supabase.from("contacts").insert([
          {
            name,
            email,
            message: msg,
            stage,
            need,
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) console.error("Supabase (non-critical):", error);
      }

      // Web3Forms submission
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: "eac1f10e-c0f3-4224-930e-ac76ba03adc0",
          name,
          email,
          message: `New Contact Form Submission from ${name}

👤 Name: ${name}
📧 Reply To: ${email}
🏁 Stage: ${stage || "Not specified"}
🎯 Need: ${need || "Not specified"}
💬 Message: ${msg}`,
          subject: "CogniVectra New Contact Form",
          from_name: "CogniVectra Contact Form",
        }),
      });

      clearTimeout(timeoutId);

      setMessage(
        "✅ Thank you! Your message has been received. We will reply within 24 hours."
      );
      e.target.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage(
        "❌ Unable to send. Please email: selvakumar.b@cognivectra.com"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div
          className="card hero-card"
          style={{
            maxWidth: "1000px",
            margin: "0 auto 4rem",
            textAlign: "center",
            padding: "3rem 2.5rem"
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>💬</div>
          <h2>Start a conversation</h2>
          <p className="stack" style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Not ready for a full pitch? Neither are we. <br />
            Tell us what you are building, and we will tell you if we can help (and how).
          </p>
        </div>

        <div className="grid2">
          {/* Contact Form */}
          <section className="card">
            <h3>Send a message</h3>
            <form onSubmit={handleSubmit} className="form">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  minLength={2}
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@startup.com"
                  required
                />
              </label>

              <label>
                <span>Stage</span>
                <select name="stage" defaultValue="">
                  <option value="" disabled>
                    Select your stage (optional)
                  </option>
                  <option>Pre-product / idea</option>
                  <option>MVP / Pre-Seed</option>
                  <option>Seed</option>
                  <option>Series A / B</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                <span>What do you need help with?</span>
                <select name="need" defaultValue="">
                  <option value="" disabled>
                    Choose one (optional)
                  </option>
                  <option>Startup Launch Pack / foundations</option>
                  <option>Cloud platform & DevOps</option>
                  <option>Process automation / workflows</option>
                  <option>SaaS building blocks (auth, billing, etc.)</option>
                  <option>AI / data enablement</option>
                  <option>Fractional CTO / advisory</option>
                  <option>Something else</option>
                </select>
              </label>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="A few lines about your product, team, and current challenges..."
                  minLength={10}
                  required
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send message →"}
              </button>
            </form>
          </section>

          {/* Contact Info */}
          <section className="card">
            <div style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)" }}>
              <h3>Prefer to talk?</h3>
              <p className="stack" style={{ marginBottom: "1rem" }}>
                Skip the form and book a 15-min intro call with our Principal Architect.
              </p>
              <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: "100%", textAlign: "center" }}>
                📅 Book 15-min Intro
              </a>
            </div>

            <h3>Connect with us</h3>
            <div className="stack">
              <div className="service-group">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>📧</span>
                  <strong>Email</strong>
                </div>
                <p>
                  <a href="mailto:selvakumar.b@cognivectra.com">
                    selvakumar.b@cognivectra.com
                  </a>
                </p>
              </div>

              <div className="service-group">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>📱</span>
                  <strong>WhatsApp</strong>
                </div>
                <p>
                  <a href="https://wa.me/918825492600">+91 8825492600</a>
                </p>
              </div>

              <div className="service-group">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🌐</span>
                  <strong>Follow us</strong>
                </div>
                <ul>
                  <li>
                    <a href="https://www.linkedin.com/company/cognivectra-innovations-solutions/?viewAsMember=true">
                      LinkedIn
                    </a>
                  </li>
                  <li>Twitter</li>
                  <li>GitHub</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className="card"
            style={{
              maxWidth: "600px",
              margin: "3rem auto 0",
              textAlign: "center",
            }}
          >
            <h4>{message.includes("Thank you") ? "✅ Message sent!" : "Oops!"}</h4>
            <p style={{ marginTop: "1rem" }}>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
