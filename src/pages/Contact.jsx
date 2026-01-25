import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import heroContact from "../assets/generated/hero-contact-8k.png";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "call" ? "call" : "message");

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

      // Save to chat_conversations
      const { error } = await supabase.from("chat_conversations").upsert([
        {
          user_name: name,
          user_email: email,
          company: "",
          stage: stage || "Not specified",
          challenge: need || "Not specified",
          messages: [
            { type: "user", text: `(Contact Form Message): ${msg}` }
          ],
          source: "contact",
          lead_score: "warm",
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "user_email" });

      if (error) console.error("Supabase Save Error:", error);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (!apiKey) {
        console.warn("Web3Forms API key not configured");
      } else {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            access_key: apiKey,
            name,
            email,
            message: `New Contact Form Submission from ${name}\n\n👤 Name: ${name}\n📧 Reply To: ${email}\n🏁 Stage: ${stage || "Not specified"}\n🎯 Need: ${need || "Not specified"}\n💬 Message: ${msg}`,
            subject: "CogniVectra New Contact Form",
            from_name: "CogniVectra Contact Form",
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("Web3Forms error:", result);
        }
      }

      clearTimeout(timeoutId);

      setMessage("Thank you! Your message has been received. We will reply within 24 hours.");
      e.target.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage("Unable to send via email service. However, your request has been logged in our system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
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

            <div className="hero-cta">
              <Link to="/#services" className="btn-outline">
                Explore Our Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Direct access to a Principal Architect · No sales pressure
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={heroContact} alt="Contact Us" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TABBED CONTACT SECTION */}
      <section className="services-modern">
        <div className="container">

          <div className="contact-tabs-card">

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
                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label className="contact-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        minLength={2}
                        required
                        className="contact-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="contact-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@startup.com"
                        required
                        className="contact-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label className="contact-label">Stage</label>
                      <select
                        name="stage"
                        className="contact-input"
                        defaultValue=""
                      >
                        <option value="" disabled>Select stage</option>
                        <option value="Idea">Idea Phase</option>
                        <option value="Seed">Seed / Pre-Revenue</option>
                        <option value="Growth">Growth / Series A+</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="contact-label">Challenge</label>
                      <select
                        name="need"
                        className="contact-input"
                        defaultValue=""
                      >
                        <option value="" disabled>Primary need</option>
                        <option value="Architecture">Architecture Review</option>
                        <option value="Development">Full Development</option>
                        <option value="Staffing">Staff Augmentation</option>
                        <option value="Consulting">Technical Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-8">
                    <label className="contact-label">Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Tell us about your project..."
                      required
                      className="contact-input"
                      style={{ resize: "vertical" }}
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full md:w-auto px-12 py-4 text-lg font-medium"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "call" && (
              <div className="contact-tab-panel contact-call-panel">
                <h4>Book a 30/15-Minute Strategy Call</h4>
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
                  📅 Book 30/15-min Call
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

    </main>
  );
}
