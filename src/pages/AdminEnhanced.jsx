import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function AdminEnhanced() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [publishingTo, setPublishingTo] = useState({});
  const [activeTab, setActiveTab] = useState("drafts");

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
    else fetchPosts();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data || []);
    setLoading(false);
  }

  const filteredPosts = posts.filter(post => {
    if (activeTab === "drafts") return post.status === "draft";
    if (activeTab === "pending") return post.status === "pending_review";
    if (activeTab === "published") return post.status === "published";
    return true;
  });

  async function handleSave(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("posts")
      .update({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        body: editingPost.body,
        tags: editingPost.tags || [],
        social_media_data: editingPost.social_media_data || {}
      })
      .eq("id", editingPost.id);

    if (!error) {
      alert("Changes saved.");
      setEditingPost(null);
      fetchPosts();
    }
  }

  async function publishPost(post, platforms = ["blog"]) {
    setPublishingTo(prev => ({ ...prev, [post.id]: true }));

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          published_platforms: platforms
        })
        .eq("id", post.id);

      if (error) throw error;

      const socials = platforms.filter(p => p !== "blog");
      if (socials.length) await publishToSocialMedia(post, socials);

      alert("Post published.");
      fetchPosts();
    } catch (err) {
      alert("Publish failed.");
    } finally {
      setPublishingTo(prev => ({ ...prev, [post.id]: false }));
    }
  }

  async function publishToSocialMedia(post, platforms) {
    await supabase.functions.invoke("publish-social", {
      body: { postId: post.id, platforms }
    });
  }

  if (loading) {
    return (
      <div className="container blog-loading">
        <div className="blog-loading-icon">⏳</div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <section className="section ai-neutral">
      <div className="container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>📊 Admin Dashboard</h1>
            <p className="muted">
              Manage, review, and publish content across platforms.
            </p>
          </div>

          <div className="admin-actions">
            <Link to="/admin/reports" className="btn-outline">📈 Reports</Link>
            <button onClick={handleSignOut} className="btn-outline">🚪 Sign Out</button>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          {["drafts", "pending", "published"].map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "drafts" && `✏️ Drafts (${posts.filter(p => p.status === "draft").length})`}
              {tab === "pending" && `🔄 Pending (${posts.filter(p => p.status === "pending_review").length})`}
              {tab === "published" && `✅ Published (${posts.filter(p => p.status === "published").length})`}
            </button>
          ))}
        </div>

        {/* EDITOR */}
        {editingPost && (
          <div className="card admin-editor">
            <h2>Edit Post</h2>

            <form onSubmit={handleSave} className="form">
              <label>
                <span>Title</span>
                <input
                  value={editingPost.title}
                  onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </label>

              <label>
                <span>Excerpt</span>
                <textarea
                  rows={3}
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                />
              </label>

              <label>
                <span>Body (Markdown)</span>
                <textarea
                  rows={10}
                  value={editingPost.body}
                  onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                />
              </label>

              <label>
                <span>Tags (comma-separated)</span>
                <input
                  value={editingPost.tags?.join(", ") || ""}
                  onChange={e =>
                    setEditingPost({
                      ...editingPost,
                      tags: e.target.value.split(",").map(t => t.trim())
                    })
                  }
                />
              </label>

              <div className="editor-actions">
                <button type="submit" className="btn">💾 Save</button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POSTS */}
        <div className="admin-posts">
          {filteredPosts.length === 0 && (
            <div className="card blog-empty">
              <div className="blog-empty-icon">📭</div>
              <p>No posts in this category yet.</p>
            </div>
          )}

          {filteredPosts.map(post => (
            <div key={post.id} className="card admin-post-row">

              <div className="admin-post-meta">
                <span className={`status-pill ${post.status}`}>
                  {post.status}
                </span>

                <h3>{post.title}</h3>
                <p className="muted">{post.excerpt}</p>

                <small className="muted">
                  📅 {new Date(post.created_at).toLocaleDateString()}  
                  &nbsp;•&nbsp; 🏷 {post.tags?.join(", ") || "No tags"}
                </small>
              </div>

              <div className="admin-post-actions">
                <button
                  className="btn-outline"
                  onClick={() => setEditingPost(post)}
                >
                  ✏️ Edit
                </button>

                {post.status === "draft" && (
                  <button
                    className="btn"
                    disabled={publishingTo[post.id]}
                    onClick={() => publishPost(post, ["blog", "linkedin", "instagram", "facebook"])}
                  >
                    {publishingTo[post.id] ? "⏳ Publishing…" : "🚀 Publish All"}
                  </button>
                )}

                {post.status === "pending_review" && (
                  <>
                    <button
                      className="btn"
                      disabled={publishingTo[post.id]}
                      onClick={() => publishPost(post, ["blog", "linkedin"])}
                    >
                      {publishingTo[post.id] ? "⏳ Publishing…" : "✅ Approve & Share"}
                    </button>

                    <button
                      className="btn-outline"
                      disabled={publishingTo[post.id]}
                      onClick={() => publishPost(post, ["blog"])}
                    >
                      📰 Blog Only
                    </button>
                  </>
                )}

                {post.status === "published" && (
                  <Link to={`/blog/${post.slug}`} target="_blank" className="btn-outline">
                    👁️ View Live
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
