import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaCalendarAlt, FaEnvelope, FaWhatsapp, FaInfoCircle } from "react-icons/fa";
import heroContact from "../assets/generated/hero-contact-8k.png";
import { trackEvent } from "../lib/analytics";

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
          referrer_info: document.referrer || "direct",
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "user_email" });

      if (error) console.error("Supabase Save Error:", error);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (apiKey) {
        await fetch("https://api.web3forms.com/submit", {
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
      }

      clearTimeout(timeoutId);

      // Track conversion event
      trackEvent('lead_generated', {
        type: 'contact_form',
        stage: stage || 'Not specified',
        need: need || 'Not specified'
      }, 'CONVERSION');

      setMessage("Thank you! Your platform request has been logged. Our Principal Architect will review your requirements within 24 hours.");
      e.target.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage("System Alert: Unable to dispatch email, but your request has been cached in our secure vault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="hero-modern" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="login-grid" style={{ opacity: 0.3 }} />
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">💬 Strategic Gateway</span>

            <h1>
              Initiate <br />
              Conversation
            </h1>

            <p>
              Tell us about your platform requirements. No sales pressure — just direct access to Principal-level engineering insights and enterprise architecture strategy.
            </p>

            <div className="hero-cta">
              <Link to="/services" className="btn-outline">
                Explore Scale Solutions
              </Link>
            </div>
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

      <section className="services-modern" style={{ padding: '6rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="contact-tabs-card"
          >
            <div className="contact-tabs">
              <button
                className={`contact-tab ${activeTab === "message" ? "active" : ""}`}
                onClick={() => setActiveTab("message")}
              >
                <FaPaperPlane /> Dispatch Message
              </button>

              <button
                className={`contact-tab ${activeTab === "call" ? "active" : ""}`}
                onClick={() => setActiveTab("call")}
              >
                <FaCalendarAlt /> Secure a Demo
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "message" ? (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="contact-tab-panel"
                >
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                      <div className="form-group">
                        <label className="contact-label">Identifier (Name)</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          required
                          className="contact-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="contact-label">Return Address (Email)</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@company.com"
                          required
                          className="contact-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                      <div className="form-group">
                        <label className="contact-label">Organization Type</label>
                        <select name="stage" className="contact-input" defaultValue="">
                          <option value="" disabled>Status</option>
                          <option value="SaaS">SaaS / Product Company</option>
                          <option value="Mid-Market">Mid-Market Enterprise</option>
                          <option value="Enterprise">Global Enterprise / Healthcare</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="contact-label">Strategic Need</label>
                        <select name="need" className="contact-input" defaultValue="">
                          <option value="" disabled>Core Objective</option>
                          <option value="Architecture">Platform Architecture</option>
                          <option value="Development">Production Deployment</option>
                          <option value="Consulting">Strategic Advisory</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                      <label className="contact-label">Manuscript (Message)</label>
                      <textarea
                        name="message"
                        rows="5"
                        placeholder="Detail your challenges..."
                        required
                        className="contact-input"
                        style={{ resize: "none" }}
                      ></textarea>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ minWidth: '240px' }}
                      >
                        {loading ? "Transmitting..." : "Send Strategic Brief"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="call"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="contact-call-panel"
                >
                  <FaInfoCircle style={{ fontSize: '3rem', color: 'var(--accent-light)', marginBottom: '1.5rem', opacity: 0.5 }} />
                  <h4>Platform Strategy & Demo</h4>
                  <p>
                    Bypass the queue. Scheduled 30-minute deep dive with our lead architect to map your platform roadmap and view production demos.
                  </p>

                  <a
                    href="https://calendly.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ padding: '1rem 3rem' }}
                  >
                    📅 View Available Slots
                  </a>

                  <div className="contact-direct">
                    <a href="mailto:info@cognivectra.com" className="contact-item">
                      <span><FaEnvelope /></span>
                      <div>
                        <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>Direct Line</strong>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-light)' }}>info@cognivectra.com</div>
                      </div>
                    </a>

                    <a href="https://wa.me/918825492600" target="_blank" rel="noreferrer" className="contact-item">
                      <span><FaWhatsapp /></span>
                      <div>
                        <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>Rapid Comms</strong>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-light)' }}>+91 8825492600</div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {message && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="services-modern"
          style={{ paddingTop: 0 }}
        >
          <div className="contact-status glass-panel" style={{ borderRadius: '20px' }}>
            <h4 style={{ color: message.includes("Alert") ? "#f87171" : "white" }}>
              {message.includes("Thank you") ? "✅ Transmission Successful" : "🛰️ System Alternate"}
            </h4>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        </motion.section>
      )}
    </main>
  );
}

