import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
    else fetchDrafts();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchDrafts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data || []);
    setLoading(false);
  }

  async function handlePublish(post) {
    if (!window.confirm(`Publish "${post.title}"?`)) return;

    const { error } = await supabase
      .from("posts")
      .update({
        status: "published",
        published_at: new Date().toISOString()
      })
      .eq("id", post.id);

    if (error) alert("Error publishing: " + error.message);
    else {
      alert("Post published!");
      fetchDrafts();
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    const payload = {
      title: editingPost.title,
      excerpt: editingPost.excerpt,
      body: editingPost.body,
      updated_at: new Date().toISOString()
    };

    let error;

    if (editingPost.id) {
      // Update
      const res = await supabase.from("posts").update(payload).eq("id", editingPost.id);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from("posts").insert([{
        ...payload,
        status: "draft",
        created_at: new Date().toISOString(),
        tags: editingPost.tags || []
      }]);
      error = res.error;
    }

    if (error) alert("Error saving: " + error.message);
    else {
      alert("Saved successfully.");
      setEditingPost(null);
      fetchDrafts();
    }
  }

  async function publishToSocial(post) {
    if (!window.confirm(`Publish "${post.title}" to LinkedIn/Twitter?`)) return;

    // Mock loading
    await new Promise(r => setTimeout(r, 1000));
    alert("✅ Successfully published to LinkedIn, Facebook, and Instagram (Simulated)!");
  }

  if (loading) {
    return (
      <div className="container blog-loading">
        <div className="blog-loading-icon">⏳</div>
        <p>Checking access...</p>
      </div>
    );
  }

  return (
    <section className="section" style={{ minHeight: "100vh", paddingTop: "120px", background: "linear-gradient(180deg, rgba(5,7,12,0) 0%, rgba(5,7,12,1) 100%)" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>

        {/* HEADER & ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
            <p className="muted">Manage your content and platform health.</p>
          </div>

          <div className="admin-actions">
            <button
              className="btn"
              onClick={() => setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] })}
            >
              + New Post
            </button>
            <Link to="/admin/reports" className="btn-outline">
              📊 View Reports
            </Link>
            <button onClick={handleSignOut} className="btn-outline">
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        {!editingPost && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-number">{posts.length}</div>
              <div className="admin-stat-label">Total Articles</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-number">
                {posts.filter(p => p.status === "published").length}
              </div>
              <div className="admin-stat-label">Published Live</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-number">
                {posts.filter(p => p.status !== "published").length}
              </div>
              <div className="admin-stat-label">Drafts Pending</div>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {editingPost ? (
          <div className="card admin-editor">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3>✏️ Edit Post</h3>
              <button
                className="btn-outline"
                onClick={() => setEditingPost(null)}
              >
                ← Back to List
              </button>
            </div>

            <form onSubmit={handleSave} className="form">
              <label>
                <span>Title</span>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={e =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Excerpt</span>
                <textarea
                  rows={3}
                  value={editingPost.excerpt}
                  onChange={e =>
                    setEditingPost({ ...editingPost, excerpt: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Body (Markdown)</span>
                <textarea
                  rows={14}
                  value={editingPost.body}
                  className="monospace"
                  onChange={e =>
                    setEditingPost({ ...editingPost, body: e.target.value })
                  }
                />
              </label>

              <div className="admin-editor-actions">
                <button type="submit" className="btn">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setEditingPost(null)}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* DATA TABLE VIEW */
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Date Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <span className={`status-pill ${post.status}`}>
                        {post.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{post.title}</strong>
                    </td>
                    <td className="muted">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          className="btn-outline"
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                          onClick={() => setEditingPost(post)}
                        >
                          ✏️ Edit
                        </button>

                        {post.status !== "published" && (
                          <button
                            className="btn"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                            onClick={() => handlePublish(post)}
                          >
                            🚀 Publish
                          </button>
                        )}

                        {post.status === "published" && (
                          <button
                            className="btn-outline"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                            onClick={() => publishToSocial(post)}
                          >
                            📢 Social
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "3rem" }}>
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
}
