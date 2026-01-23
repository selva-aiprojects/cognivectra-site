import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function AdminEnhanced() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [publishingTo, setPublishingTo] = useState({});
  const [publishStatus, setPublishStatus] = useState({}); // { postId: { platform: { status, error } } }
  const [selectedPlatforms, setSelectedPlatforms] = useState({}); // { postId: ['blog', 'linkedin', ...] }
  const [showPlatformSelector, setShowPlatformSelector] = useState({}); // { postId: true/false }
  const [socialMediaStatus, setSocialMediaStatus] = useState({}); // { postId: { platform: { published_at, platform_post_id } } }
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

  function togglePlatformSelector(postId) {
    setShowPlatformSelector(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    // Initialize with default selection if not set
    if (!selectedPlatforms[postId]) {
      setSelectedPlatforms(prev => ({
        ...prev,
        [postId]: ["blog", "linkedin"]
      }));
    }
  }

  function togglePlatform(postId, platform) {
    setSelectedPlatforms(prev => {
      const current = prev[postId] || [];
      if (current.includes(platform)) {
        return { ...prev, [postId]: current.filter(p => p !== platform) };
      } else {
        return { ...prev, [postId]: [...current, platform] };
      }
    });
  }

  async function publishPost(post, platforms = null) {
    // Use provided platforms or selected platforms
    const platformsToUse = platforms || selectedPlatforms[post.id] || ["blog"];
    
    if (platformsToUse.length === 0) {
      alert("Please select at least one platform to publish to.");
      return;
    }

    setPublishingTo(prev => ({ ...prev, [post.id]: true }));
    setShowPlatformSelector(prev => ({ ...prev, [post.id]: false }));
    
    // Initialize status tracking
    const socials = platformsToUse.filter(p => p !== "blog");
    const initialStatus = {};
    socials.forEach(platform => {
      initialStatus[platform] = { status: "publishing", error: null };
    });
    setPublishStatus(prev => ({ ...prev, [post.id]: initialStatus }));

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          published_platforms: platformsToUse
        })
        .eq("id", post.id);

      if (error) throw error;

      // Publish to social media
      if (socials.length > 0) {
        await publishToSocialMedia(post, socials);
      }

      // Refresh posts and social media status
      await fetchPosts();
      
      // Clear status after a delay
      setTimeout(() => {
        setPublishStatus(prev => {
          const updated = { ...prev };
          delete updated[post.id];
          return updated;
        });
      }, 5000);
    } catch (err) {
      alert("Publish failed: " + err.message);
    } finally {
      setPublishingTo(prev => ({ ...prev, [post.id]: false }));
    }
  }

  async function publishToSocialMedia(post, platforms) {
    try {
      const { data, error } = await supabase.functions.invoke("publish-social", {
        body: { postId: post.id, platforms }
      });

      if (error) throw error;

      // Update status based on results
      if (data && data.results) {
        const statusUpdate = {};
        data.results.forEach((result) => {
          statusUpdate[result.platform] = {
            status: result.success ? "success" : "error",
            error: result.error || null
          };
        });
        setPublishStatus(prev => ({
          ...prev,
          [post.id]: { ...prev[post.id], ...statusUpdate }
        }));

        // Show summary
        const successCount = data.results.filter(r => r.success).length;
        const failCount = data.results.filter(r => !r.success).length;
        if (failCount > 0) {
          const failedPlatforms = data.results
            .filter(r => !r.success)
            .map(r => `${r.platform}: ${r.error}`)
            .join("\n");
          alert(`Published to ${successCount} platform(s).\n\nFailed:\n${failedPlatforms}`);
        }
      }
    } catch (err) {
      console.error("Social media publishing error:", err);
      const errorStatus = {};
      platforms.forEach(platform => {
        errorStatus[platform] = { status: "error", error: err.message };
      });
      setPublishStatus(prev => ({
        ...prev,
        [post.id]: { ...prev[post.id], ...errorStatus }
      }));
    }
  }

  function getPlatformStatus(postId, platform) {
    // Check if already published
    if (socialMediaStatus[postId]?.[platform]) {
      return { type: "published", date: socialMediaStatus[postId][platform].published_at };
    }
    // Check current publishing status
    if (publishStatus[postId]?.[platform]) {
      return publishStatus[postId][platform];
    }
    return null;
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

                {/* Platform Status Display */}
                {(post.status === "published" || socialMediaStatus[post.id]) && (
                  <div className="platform-status" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    {["blog", "linkedin", "instagram", "facebook"].map(platform => {
                      const status = getPlatformStatus(post.id, platform);
                      if (!status) return null;
                      
                      if (status.type === "published") {
                        return (
                          <span key={platform} style={{ 
                            marginRight: "0.5rem", 
                            padding: "0.2rem 0.5rem", 
                            background: "var(--bg-secondary)", 
                            borderRadius: "4px",
                            display: "inline-block"
                          }}>
                            ✅ {platform}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Publishing Actions */}
                {(post.status === "draft" || post.status === "pending_review") && (
                  <div style={{ marginTop: "0.5rem" }}>
                    {!showPlatformSelector[post.id] ? (
                      <button
                        className="btn"
                        disabled={publishingTo[post.id]}
                        onClick={() => togglePlatformSelector(post.id)}
                      >
                        {publishingTo[post.id] ? "⏳ Publishing…" : "🚀 Publish"}
                      </button>
                    ) : (
                      <div style={{ 
                        background: "var(--bg-secondary)", 
                        padding: "1rem", 
                        borderRadius: "8px",
                        marginTop: "0.5rem"
                      }}>
                        <div style={{ marginBottom: "0.75rem", fontWeight: "600" }}>
                          Select Platforms:
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                          {["blog", "linkedin", "instagram", "facebook"].map(platform => {
                            const isSelected = (selectedPlatforms[post.id] || []).includes(platform);
                            const status = getPlatformStatus(post.id, platform);
                            const isDisabled = publishingTo[post.id];
                            
                            return (
                              <label
                                key={platform}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "0.5rem 0.75rem",
                                  background: isSelected ? "var(--accent-primary)" : "transparent",
                                  border: `1px solid ${isSelected ? "var(--accent-primary)" : "var(--border-color)"}`,
                                  borderRadius: "6px",
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                  opacity: isDisabled ? 0.6 : 1,
                                  fontSize: "0.9rem"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onChange={() => togglePlatform(post.id, platform)}
                                  style={{ marginRight: "0.5rem" }}
                                />
                                {platform === "blog" && "📰"}
                                {platform === "linkedin" && "💼"}
                                {platform === "instagram" && "📷"}
                                {platform === "facebook" && "👥"}
                                <span style={{ marginLeft: "0.25rem" }}>{platform}</span>
                                {status?.type === "published" && " ✓"}
                              </label>
                            );
                          })}
                        </div>
                        
                        {/* Publishing Status */}
                        {publishStatus[post.id] && (
                          <div style={{ marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                            {Object.entries(publishStatus[post.id]).map(([platform, status]) => (
                              <div key={platform} style={{ marginBottom: "0.25rem" }}>
                                {status.status === "publishing" && `⏳ Publishing to ${platform}...`}
                                {status.status === "success" && `✅ ${platform} published`}
                                {status.status === "error" && (
                                  <span style={{ color: "var(--error-color, #e74c3c)" }}>
                                    ❌ {platform}: {status.error}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn"
                            disabled={publishingTo[post.id] || (selectedPlatforms[post.id] || []).length === 0}
                            onClick={() => publishPost(post)}
                          >
                            {publishingTo[post.id] ? "⏳ Publishing…" : "✅ Publish Selected"}
                          </button>
                          <button
                            className="btn-outline"
                            disabled={publishingTo[post.id]}
                            onClick={() => {
                              setShowPlatformSelector(prev => ({ ...prev, [post.id]: false }));
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {post.status === "published" && (
                  <>
                    <Link to={`/blog/${post.slug}`} target="_blank" className="btn-outline" style={{ marginTop: "0.5rem" }}>
                      👁️ View Live
                    </Link>
                    {Object.keys(socialMediaStatus[post.id] || {}).length > 0 && (
                      <button
                        className="btn-outline"
                        style={{ marginTop: "0.5rem", marginLeft: "0.5rem" }}
                        onClick={() => togglePlatformSelector(post.id)}
                      >
                        🔄 Republish
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
