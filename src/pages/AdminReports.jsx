import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function AdminReports() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  const [filterScore, setFilterScore] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const navigate = useNavigate();

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) navigate("/login");
    else fetchLeads();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  /* =========================
     DATA LOAD
  ========================= */

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Lead fetch failed:", err);
    }
    setLoading(false);
  }

  /* =========================
     FILTERS
  ========================= */

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (filterScore !== "all" && l.lead_score !== filterScore) return false;
      if (filterStage !== "all" && l.stage !== filterStage) return false;
      if (filterSource !== "all" && l.source !== filterSource) return false;
      return true;
    });
  }, [leads, filterScore, filterStage, filterSource]);

  /* =========================
     CSV EXPORT
  ========================= */

  const exportCSV = () => {
    if (!filteredLeads.length) return alert("No data to export.");

    const headers = [
      "Name",
      "Email",
      "Company",
      "Stage",
      "Challenge",
      "Budget",
      "Timeline",
      "Lead Score",
      "Source",
      "Updated At",
    ];

    const rows = filteredLeads.map((l) => [
      l.user_name,
      l.user_email,
      l.company,
      l.stage,
      l.challenge,
      l.budget,
      l.timeline,
      l.lead_score,
      l.source,
      new Date(l.updated_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cognivectra-leads.csv";
    link.click();
  };

  /* =========================
     UI HELPERS
  ========================= */

  const badgeStyle = (score) => {
    if (score === "hot") return "badge-hot";
    if (score === "warm") return "badge-warm";
    return "badge-cold";
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading)
    return (
      <div className="container" style={{ padding: "4rem" }}>
        Loading reports…
      </div>
    );

  return (
    <>
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">
          <div className="hero-copy">
            <span className="hero-badge">📊 Lead Intelligence</span>
            <h1>
              Analytics &amp;
              <br />
              Reports
            </h1>
            <p>
              Track, analyze, and convert leads with our
              comprehensive reporting dashboard and real-time insights.
            </p>
            <p className="hero-subtext">
              Data-driven decisions for startup growth
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-glass-card">
              <ul>
                <li>📈 Real-time lead scoring</li>
                <li>🎯 Advanced filtering</li>
                <li>📊 CSV export capability</li>
                <li>💬 Chat history tracking</li>
                <li>🔄 Live data updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="services-modern">
        <div className="container">
          {/* HEADER ACTIONS */}
          <div className="service-modern-card admin-header-card">
            <div>
              <h3>Lead Dashboard</h3>
              <p className="muted">All chatbot &amp; contact leads — centralized</p>
            </div>
            <div className="admin-header-actions">
              <Link to="/admin" className="btn-outline">
                📁 Content Manager
              </Link>
              <button onClick={exportCSV} className="btn-outline">
                ⬇ Export CSV
              </button>
              <button onClick={handleSignOut} className="btn-outline">
                🚪 Sign Out
              </button>
            </div>
          </div>

        {/* FILTERS */}
        <div
          className="card no-hover-effect"
          style={{ marginBottom: "1.5rem" }}
        >
          <div className="grid3">
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">🟡 Warm</option>
              <option value="cold">❄ Cold</option>
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="all">All Stages</option>
              <option value="idea">Idea / Pre-Seed</option>
              <option value="mvp">MVP / Seed</option>
              <option value="launched">Launched</option>
              <option value="series-a">Series A+</option>
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="chatbot">Chatbot</option>
              <option value="contact">Contact Form</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="grid2" style={{ alignItems: "start" }}>
          {/* LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredLeads.length === 0 && (
              <div className="card no-hover-effect">
                No leads match filters.
              </div>
            )}

            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`card no-hover-effect ${
                  selectedLead?.id === lead.id ? "active" : ""
                }`}
                onClick={() => setSelectedLead(lead)}
                style={{
                  cursor: "pointer",
                  border:
                    selectedLead?.id === lead.id
                      ? "2px solid var(--accent-primary)"
                      : "1px solid var(--border-light)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>{lead.user_name || "Anonymous"}</strong>
                  <span className={`badge ${badgeStyle(lead.lead_score)}`}>
                    {lead.lead_score || "cold"}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem" }}>
                  {lead.user_email}
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {lead.stage} • {lead.budget} • {formatDate(lead.updated_at)}
                </div>
              </div>
            ))}
          </div>

          {/* DETAILS */}
          <div
            className="card no-hover-effect"
            style={{ position: "sticky", top: "2rem", minHeight: "420px" }}
          >
            {selectedLead ? (
              <>
                <h3 style={{ marginBottom: "1rem" }}>
                  Lead Profile
                </h3>

                <div className="stack">
                  <div><strong>Name:</strong> {selectedLead.user_name}</div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${selectedLead.user_email}`}
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {selectedLead.user_email}
                    </a>
                  </div>
                  <div><strong>Company:</strong> {selectedLead.company}</div>
                  <div><strong>Stage:</strong> {selectedLead.stage}</div>
                  <div><strong>Budget:</strong> {selectedLead.budget}</div>
                  <div><strong>Timeline:</strong> {selectedLead.timeline}</div>
                  <div>
                    <strong>Challenge:</strong>{" "}
                    {selectedLead.challenge}
                  </div>
                  <div>
                    <strong>Score:</strong>{" "}
                    <span
                      className={`badge ${badgeStyle(
                        selectedLead.lead_score
                      )}`}
                    >
                      {selectedLead.lead_score}
                    </span>
                  </div>
                </div>

                <hr />

                <h4>Chat History</h4>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "1rem",
                    borderRadius: "12px",
                    maxHeight: "260px",
                    overflowY: "auto",
                    fontSize: "0.9rem",
                  }}
                >
                  {(selectedLead.messages || []).map((m, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: "0.75rem",
                        textAlign: m.type === "user" ? "right" : "left",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          background:
                            m.type === "user"
                              ? "var(--accent-primary)"
                              : "var(--bg-primary)",
                          color:
                            m.type === "user"
                              ? "white"
                              : "var(--text-primary)",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          maxWidth: "85%",
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  📥
                </span>
                <p>Select a lead to view full profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
