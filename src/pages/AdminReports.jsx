import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function AdminReports() {
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
    else fetchData();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchData() {
    setLoading(true);
    const [chatsRes, contactsRes] = await Promise.all([
      supabase.from("chat_conversations").select("*").order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false })
    ]);

    setChats(chatsRes.data || []);
    setContacts(contactsRes.data || []);
    setLoading(false);
  }

  const items = activeTab === "chats" ? chats : contacts;

  const formatDate = date =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  if (loading) {
    return (
      <div className="container blog-loading">
        <div className="blog-loading-icon">⏳</div>
        <p>Loading lead reports...</p>
      </div>
    );
  }

  return (
    <section className="section ai-neutral">
      <div className="container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>📊 Lead Reports</h1>
            <p className="muted">User details collected from Chatbot and Contact Form</p>
          </div>

          <div className="admin-actions">
            <Link to="/admin" className="btn-outline">📁 Content Manager</Link>
            <button onClick={handleSignOut} className="btn-outline">🚪 Sign Out</button>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => { setActiveTab("chats"); setSelectedItem(null); }}
          >
            🤖 ChatBot Leads ({chats.length})
          </button>

          <button
            className={`admin-tab ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }}
          >
            📧 Contact Form ({contacts.length})
          </button>
        </div>

        {/* GRID */}
        <div className="admin-report-grid">

          {/* LIST */}
          <div className="admin-lead-list">
            {items.map(item => (
              <div
                key={item.id}
                className={`card admin-lead-row ${selectedItem?.id === item.id ? "active" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="lead-row-header">
                  <strong>{item.user_name || item.name || "Anonymous"}</strong>
                  <span className="muted">{formatDate(item.created_at)}</span>
                </div>

                <div className="lead-row-sub">
                  {item.user_email || item.email}
                </div>

                {activeTab === "chats" && item.company && (
                  <div className="lead-row-sub">
                    🏢 {item.company}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DETAILS */}
          <div className="card admin-lead-details">
            {selectedItem ? (
              <>
                <h3>Full Details</h3>

                <div className="lead-detail-group">
                  <label>Name</label>
                  <p>{selectedItem.user_name || selectedItem.name || "Not provided"}</p>
                </div>

                <div className="lead-detail-group">
                  <label>Email</label>
                  <p>
                    <a href={`mailto:${selectedItem.user_email || selectedItem.email}`}>
                      {selectedItem.user_email || selectedItem.email}
                    </a>
                  </p>
                </div>

                {activeTab === "chats" ? (
                  <>
                    <div className="lead-detail-group">
                      <label>Company</label>
                      <p>{selectedItem.company || "Not provided"}</p>
                    </div>

                    <div className="lead-detail-grid">
                      <div>
                        <label>Stage</label>
                        <p>{selectedItem.stage || "Not provided"}</p>
                      </div>
                      <div>
                        <label>Budget</label>
                        <p>{selectedItem.budget || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="lead-detail-group">
                      <label>Challenge</label>
                      <p>{selectedItem.challenge || "Not provided"}</p>
                    </div>

                    <div className="lead-detail-group">
                      <label>Chat History</label>
                      <div className="chat-history-box">
                        {selectedItem.messages?.map((msg, i) => (
                          <div key={i} className={`chat-bubble ${msg.role}`}>
                            {msg.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lead-detail-grid">
                      <div>
                        <label>Stage</label>
                        <p>{selectedItem.stage || "Not provided"}</p>
                      </div>
                      <div>
                        <label>Need</label>
                        <p>{selectedItem.need || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="lead-detail-group">
                      <label>Message</label>
                      <div className="contact-message-box">
                        {selectedItem.message}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="admin-empty-state">
                <div className="blog-empty-icon">📥</div>
                <p>Select a lead from the list to view full details</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
