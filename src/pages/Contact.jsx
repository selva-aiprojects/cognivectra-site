import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("message");

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

      if (!name || !email || !msg || name.length < 2 || msg.length < 10) {
        throw new Error("Please fill all fields properly");
      }

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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
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

      setMessage("Thank you! Your message has been received. We will reply within 24 hours.");
      e.target.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage("Unable to send. Please email: Care@cognivectra.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">💬 Get in Touch</span>

            <h1>
              Start a <br />
              Conversation
            </h1>

            <p>
              Not ready for a full pitch? Neither are we.
              Tell us what you are building, and we will tell you
              if we can help (and how).
            </p>

            <p className="hero-subtext">
              Direct access to a Principal Architect · No sales pressure
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-glass-card">
              <ul>
                <li>Free 15-minute intro call</li>
                <li>Runway-aware advice</li>
                <li>No long-term lock-in</li>
                <li>Founder-friendly guidance</li>
                <li>24-hour response time</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* TABBED CONTACT */}
      <section className="services-modern">
        <h3>Contact Options</h3>

        <div className="service-modern-card contact-tabs-card">

          {/* TAB HEADERS */}
          <div className="contact-tabs">
            <button
              className={`contact-tab ${activeTab === "message" ? "active" : ""}`}
              onClick={() => setActiveTab("message")}
            >
              📩 Send Message
            </button>

            <button
              className={`contact-tab ${activeTab === "call" ? "active" : ""}`}
              onClick={() => setActiveTab("call")}
            >
              📅 Book a Call
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "message" && (
            <div className="contact-tab-panel">

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
                    <option>Startup Launch Pack</option>
                    <option>Cloud platform & DevOps</option>
                    <option>Process automation</option>
                    <option>SaaS building blocks</option>
                    <option>AI / data enablement</option>
                    <option>Fractional CTO</option>
                    <option>Something else</option>
                  </select>
                </label>

                <label>
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="A few lines about your product, team, and challenges..."
                    minLength={10}
                    required
                  />
                </label>

                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send message →"}
                </button>

              </form>

            </div>
          )}

          {activeTab === "call" && (
            <div className="contact-tab-panel contact-call-panel">

              <h4>Book a 15-Minute Intro Call</h4>
              <p>
                Skip the form and speak directly with our Principal Architect.
                No sales pressure — just practical guidance.
              </p>

              <a
                href="https://calendly.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                📅 Book 15-min Intro
              </a>

              <div className="contact-direct">

                <div className="contact-item">
                  <span>📧</span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:selvakumar.b@cognivectra.com">
                      selvakumar.b@cognivectra.com
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <span>📱</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <a href="https://wa.me/918825492600">
                      +91 8825492600
                    </a>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* STATUS MESSAGE */}
      {message && (
        <section className="services-modern">
          <div className="service-modern-card contact-status">
            <h4>
              {message.includes("Thank you") ? "✅ Message Sent!" : "Oops!"}
            </h4>
            <p>{message}</p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-modern">
        <h3>Build Your Platform with Confidence</h3>
        <p>
          Whether you are launching, scaling, or modernizing,
          we help you build technology foundations that last.
        </p>
        <a href="/services" className="btn">
          Explore Services
        </a>
      </section>

    </main>
  );
}
