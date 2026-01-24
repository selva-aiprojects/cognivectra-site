import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

/* =========================
   MOCK DATA (Fallback)
========================= */
const MOCK_LEADS = [
  {
    id: "mock-1",
    user_name: "Alex Founder",
    user_email: "alex@startup.io",
    company: "NextBigThing",
    stage: "mvp",
    challenge: "Scaling Infrastructure",
    budget: "5k-15k",
    timeline: "asap",
    lead_score: "hot",
    source: "chatbot",
    updated_at: new Date().toISOString(),
    messages: [
      { type: 'bot', text: 'Hello! How can I help?' },
      { type: 'user', text: 'I need to scale my MVP.' },
      { type: 'bot', text: 'What is your budget?' },
      { type: 'user', text: 'Around $10k/mo' }
    ]
  },
  {
    id: "mock-2",
    user_name: "Sarah CTO",
    user_email: "sarah@fintech.co",
    company: "FinTech Co",
    stage: "series-a",
    challenge: "Security Formatting",
    budget: "over-30k",
    timeline: "month",
    lead_score: "warm",
    source: "contact",
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    messages: []
  },
  {
    id: "mock-3",
    user_name: "Mike Dev",
    user_email: "mike@agency.net",
    company: "Dev Agency",
    stage: "idea",
    challenge: "Choosing Tech Stack",
    budget: "under-5k",
    timeline: "exploring",
    lead_score: "cold",
    source: "chatbot",
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    messages: [
      { type: 'bot', text: 'What stage are you?' },
      { type: 'user', text: 'Just an idea.' }
    ]
  }
];

export default function AdminReports() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  const [filterScore, setFilterScore] = useState("all");
  const [filterStage, setFilterStage] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    // In demo mode, we might skip auth or mock it. 
    // But assuming we want to keep it somewhat real:
    const { data: { session } } = await supabase.auth.getSession();

    // If no session, usually redirect. But for "Broken" state fix, we might allow bypass if Supabase is offline?
    // Let's stick to standard behavior but allow "fetchLeads" to fail gracefully.
    if (!session) {
      // Checking if real supabase connection exists
      if (supabase.supabaseUrl && supabase.supabaseUrl.includes("placeholder")) {
        // Mock Auth bypass for dev
        console.warn("Bypassing Auth (Demo Mode)");
        fetchLeads();
      } else {
        navigate("/login");
      }
    } else {
      fetchLeads();
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error || !data || data.length === 0) {
        // If error or empty, us MOCK
        console.warn("Using Mock Data for Reports");
        setLeads(MOCK_LEADS);
        setUsingMock(true);
      } else {
        setLeads(data);
      }
    } catch (err) {
      console.error("Lead fetch failed, using mock:", err);
      setLeads(MOCK_LEADS);
      setUsingMock(true);
    }
    setLoading(false);
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (filterScore !== "all" && l.lead_score !== filterScore) return false;
      if (filterStage !== "all" && l.stage !== filterStage) return false;
      return true;
    });
  }, [leads, filterScore, filterStage]);

  const badgeStyle = (score) => {
    if (score === "hot") return "background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4);";
    if (score === "warm") return "background: rgba(245,158,11,0.2); color: #fcd34d; border: 1px solid rgba(245,158,11,0.4);";
    return "background: rgba(59,130,246,0.2); color: #93c5fd; border: 1px solid rgba(59,130,246,0.4);";
  };

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0e14", color: "white" }}>
      Loading Reports...
    </div>
  );

  return (
    <section className="section" style={{ minHeight: "100vh", paddingTop: "120px", background: "linear-gradient(180deg, rgba(5,7,12,0) 0%, rgba(5,7,12,1) 100%)" }}>
      <div className="container" style={{ maxWidth: "1400px" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Lead Reports</h1>
            <p className="muted">
              {usingMock ? "⚠️ Demo Mode: Showing Example Data" : "Real-time lead analytics"}
            </p>
          </div>
          <div className="admin-actions">
            <Link to="/admin" className="btn-outline">
              ← Dashboard
            </Link>
            <button onClick={handleSignOut} className="btn-outline">
              Sign Out
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <select
            value={filterScore}
            onChange={e => setFilterScore(e.target.value)}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
          >
            <option value="all">All Scores</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">🟡 Warm</option>
            <option value="cold">❄ Cold</option>
          </select>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
          >
            <option value="all">All Stages</option>
            <option value="idea">Idea</option>
            <option value="mvp">MVP</option>
            <option value="series-a">Series A</option>
          </select>
        </div>

        {/* SPLIT VIEW */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>

          {/* LEFT: TABLE */}
          <div className="admin-table-container" style={{ marginTop: 0, height: "fit-content" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Stage</th>
                  <th>Score</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    style={{ cursor: "pointer", background: selectedLead?.id === lead.id ? "rgba(99, 102, 241, 0.1)" : "transparent" }}
                  >
                    <td>
                      <strong>{lead.user_name || "Anonymous"}</strong><br />
                      <span className="muted" style={{ fontSize: "0.8rem" }}>{lead.user_email}</span>
                    </td>
                    <td>{lead.stage}</td>
                    <td>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", cssText: badgeStyle(lead.lead_score) }}>
                        {lead.lead_score}
                      </span>
                    </td>
                    <td className="muted" style={{ fontSize: "0.85rem" }}>
                      {new Date(lead.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center" }}>No leads found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="card no-hover-effect" style={{ position: "sticky", top: "2rem", height: "fit-content", minHeight: "500px", background: "#0f172a" }}>
            {selectedLead ? (
              <>
                <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
                  <h2 style={{ marginBottom: "0.5rem" }}>{selectedLead.user_name}</h2>
                  <p className="muted" style={{ margin: 0 }}>{selectedLead.company}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div>
                    <label className="muted" style={{ fontSize: "0.8rem" }}>EMAIL</label>
                    <div>{selectedLead.user_email}</div>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: "0.8rem" }}>STAGE</label>
                    <div>{selectedLead.stage}</div>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: "0.8rem" }}>BUDGET</label>
                    <div>{selectedLead.budget}</div>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: "0.8rem" }}>TIMELINE</label>
                    <div>{selectedLead.timeline}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label className="muted" style={{ fontSize: "0.8rem" }}>CHALLENGE</label>
                    <div>{selectedLead.challenge}</div>
                  </div>
                </div>

                <h4 style={{ marginBottom: "1rem" }}>Conversation</h4>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "1rem", maxHeight: "300px", overflowY: "auto" }}>
                  {(selectedLead.messages || []).map((m, i) => (
                    <div key={i} style={{ marginBottom: "0.8rem", textAlign: m.type === 'user' ? "right" : "left" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.5rem 0.8rem",
                        borderRadius: "8px",
                        background: m.type === 'user' ? "var(--accent-primary)" : "rgba(255,255,255,0.1)",
                        color: m.type === 'user' ? "white" : "var(--text-primary)",
                        fontSize: "0.9rem"
                      }}>
                        {m.text}
                      </span>
                    </div>
                  ))}
                  {(!selectedLead.messages || selectedLead.messages.length === 0) && (
                    <p className="muted" style={{ textAlign: "center" }}>No transcript available.</p>
                  )}
                </div>
              </>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexDirection: "column" }}>
                <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>👈</span>
                <p>Select a lead to view details</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
