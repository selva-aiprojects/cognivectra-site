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

    const { error } = await supabase
      .from("posts")
      .update({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        body: editingPost.body
      })
      .eq("id", editingPost.id);

    if (error) alert("Error saving: " + error.message);
    else {
      alert("Changes saved.");
      setEditingPost(null);
      fetchDrafts();
    }
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
    <>
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">
          <div className="hero-copy">
            <span className="hero-badge">🛠 Admin Dashboard</span>
            <h1>
              Content <br />
              Management
            </h1>
            <p>
              Review, edit, and publish AI-generated content
              with our streamlined admin interface.
            </p>
            <p className="hero-subtext">
              Full control over your content pipeline
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-glass-card">
              <ul>
                <li>📝 Edit drafts instantly</li>
                <li>🚀 One-click publishing</li>
                <li>📊 Content analytics</li>
                <li>🔄 Real-time updates</li>
                <li>📱 Mobile-friendly interface</li>
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
              <h3>Content Queue</h3>
              <p className="muted">Manage your AI-generated posts and drafts</p>
            </div>
            <div className="admin-header-actions">
              <Link to="/admin/reports" className="btn-outline">
                📊 Reports
              </Link>
              <button onClick={handleSignOut} className="btn-outline">
                🚪 Sign Out
              </button>
            </div>
          </div>

        {/* EDIT MODE */}
        {editingPost && (
          <div className="service-modern-card admin-editor-card">
            <div className="admin-editor-header">
              <h3>✏️ Edit Post</h3>
              <button
                className="btn-outline btn-small"
                onClick={() => setEditingPost(null)}
              >
                ❌ Cancel
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
              </div>
            </form>
          </div>
        )}

        {/* POSTS LIST */}
        {!editingPost && (
          <div className="admin-post-grid">
            {posts.map(post => (
              <div key={post.id} className="service-modern-card admin-post-card">

                <div className="admin-post-info">
                  <span
                    className={`status-pill ${post.status}`}
                  >
                    {post.status.toUpperCase()}
                  </span>

                  <div>
                    <h3>{post.title}</h3>
                    <p className="muted">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="admin-post-actions">
                  <button
                    className="btn-outline"
                    onClick={() => setEditingPost(post)}
                  >
                    ✏️ Edit
                  </button>

                  {post.status !== "published" && (
                    <button
                      className="btn"
                      onClick={() => handlePublish(post)}
                    >
                      🚀 Publish
                    </button>
                  )}

                  {post.status === "published" && (
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      className="btn-outline"
                    >
                      👁 View Live
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        </div>
      </section>
    </>
  );
}
