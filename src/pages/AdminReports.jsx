import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuFlame,
  LuSnowflake,
  LuThermometer,
  LuFilter,
  LuUser,
  LuMail,
  LuBuilding2,
  LuMessageSquare,
  LuHistory,
  LuSend
} from "react-icons/lu";

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

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error || !data || data.length === 0) {
        // If error or empty, use MOCK
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

  const getScoreIcon = (score) => {
    switch (score) {
      case 'hot': return <LuFlame style={{ color: '#f87171' }} />;
      case 'warm': return <LuThermometer style={{ color: '#fbbf24' }} />;
      case 'cold': return <LuSnowflake style={{ color: '#60a5fa' }} />;
      default: return <LuUser style={{ opacity: 0.5 }} />;
    }
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'hot': return "status-hot";
      case 'warm': return "status-warm";
      case 'cold': return "status-cold";
      default: return "";
    }
  };

  if (loading) return (
    <div className="admin-layout">
      <div className="admin-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    </div>
  );

  return (
    <>
      <header className="admin-header">
        <div className="admin-title-area">
          <div className="admin-breadcrumbs">
            <Link to="/admin">Dashboard</Link> <span>/</span> <span className="current">Intelligence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1>Lead Insights</h1>
            {usingMock && (
              <span style={{ fontSize: '0.65rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>
                Demo Environment
              </span>
            )}
          </div>
          <p style={{ color: 'var(--admin-text-muted)', fontWeight: '500', marginTop: '0.5rem' }}>Analyzing organic acquisition via chatbot and contact channels.</p>
        </div>
        <div className="admin-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="filter-group" style={{ display: 'flex', gap: '0.75rem' }}>
            <select
              value={filterScore}
              onChange={e => setFilterScore(e.target.value)}
              style={{ width: '140px', fontSize: '0.85rem' }}
            >
              <option value="all">Global Reach</option>
              <option value="hot">High Intent</option>
              <option value="warm">Interested</option>
              <option value="cold">Passive</option>
            </select>
            <select
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              style={{ width: '140px', fontSize: '0.85rem' }}
            >
              <option value="all">All Stages</option>
              <option value="idea">Idea Stage</option>
              <option value="mvp">MVP Ready</option>
              <option value="series-a">Series A+</option>
            </select>
          </div>
        </div>
      </header>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', height: 'calc(100vh - 280px)' }}>
        {/* LEAD LIST SECTION */}
        <div className="admin-table-container glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="admin-table">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--admin-bg)' }}>
                <tr>
                  <th>Strategic Partner</th>
                  <th>Context</th>
                  <th>Score</th>
                  <th>Captured</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    style={{
                      cursor: 'pointer',
                      background: selectedLead?.id === lead.id ? 'var(--admin-accent-soft)' : 'transparent'
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--admin-text-main)', fontSize: '0.95rem' }}>{lead.user_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{lead.user_email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>{lead.company || "N/A"}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lead.stage}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${getScoreColor(lead.lead_score)}`} style={{ fontSize: '0.7rem' }}>
                        {getScoreIcon(lead.lead_score)} {lead.lead_score}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>
                      {new Date(lead.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>No results found for current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEAD DETAIL SECTION */}
        <div className="lead-detail-view glass-panel" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedLead ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-accent-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>{selectedLead.user_name}</h2>
                    <p style={{ color: 'var(--admin-accent)', fontSize: '0.9rem' }}>{selectedLead.user_email}</p>
                  </div>
                  <span className={`status-pill ${getScoreColor(selectedLead.lead_score)}`} style={{ padding: '0.5rem 1rem' }}>
                    {getScoreIcon(selectedLead.lead_score)} <span style={{ marginLeft: '5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>{selectedLead.lead_score} INTENT</span>
                  </span>
                </div>

                <div className="detail-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'var(--admin-accent-soft)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: '700', marginBottom: '0.25rem' }}>Organization</div>
                    <div style={{ fontWeight: '700' }}>{selectedLead.company || 'Not Specified'}</div>
                  </div>
                  <div style={{ background: 'var(--admin-accent-soft)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>Budget Range</div>
                    <div style={{ fontWeight: '700' }}>{selectedLead.budget || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Transcript History</h4>
                <div className="transcript-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedLead.messages?.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '85%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '16px',
                        fontSize: '0.9rem',
                        background: msg.type === 'user' ? 'var(--admin-accent)' : 'var(--admin-accent-soft)',
                        border: msg.type === 'user' ? 'none' : '1px solid var(--admin-border)',
                        color: msg.type === 'user' ? 'white' : 'var(--admin-text-main)'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {(!selectedLead.messages || selectedLead.messages.length === 0) && (
                    <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem', border: '1px dashed var(--admin-border)', borderRadius: '16px', fontWeight: '600' }}>
                      No conversational transcript available.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Sync: {new Date(selectedLead.updated_at).toLocaleString()}</div>
                <a href={`mailto:${selectedLead.user_email}`} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  <LuMail /> Outreach Partner
                </a>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><LuHistory /></div>
              <h3 style={{ fontSize: '1.25rem' }}>Intelligence Vault</h3>
              <p>Select a lead from the telemetry list to view detailed conversational insights.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}