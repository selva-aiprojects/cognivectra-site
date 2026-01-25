import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaLinkedin, FaInstagram, FaFacebook, FaEdit, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaPlus, FaExternalLinkAlt } from "react-icons/fa";

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
  const [previewMode, setPreviewMode] = useState(false);

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
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch social media publishing status
      const { data: socialData, error: socialError } = await supabase
        .from("social_media_posts")
        .select("*");

      if (socialError) throw socialError;

      const statusMap = {};
      socialData?.forEach(item => {
        if (!statusMap[item.post_id]) statusMap[item.post_id] = {};
        statusMap[item.post_id][item.platform] = item;
      });
      setSocialMediaStatus(statusMap);

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter(post => {
    if (activeTab === "drafts") return post.status === "draft";
    if (activeTab === "pending") return post.status === "pending_review";
    if (activeTab === "published") return post.status === "published";
    return true;
  });

  async function handleSave(e) {
    e.preventDefault();
    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const postData = {
      title: editingPost.title,
      excerpt: editingPost.excerpt,
      body: editingPost.body,
      slug,
      tags: editingPost.tags || [],
      social_media_data: editingPost.social_media_data || {},
      status: editingPost.status || 'draft'
    };

    const { error } = editingPost.id
      ? await supabase.from("posts").update(postData).eq("id", editingPost.id)
      : await supabase.from("posts").insert([postData]);

    if (!error) {
      alert(editingPost.id ? "Changes synced." : "New packet registered.");
      setEditingPost(null);
      setPreviewMode(false);
      fetchPosts();
    } else {
      alert("Error: " + error.message);
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



  return (
    <AdminLayout>
      <header className="admin-header glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
        <div className="admin-title-area">
          <div className="admin-breadcrumbs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <Link to="/admin" style={{ opacity: 0.6 }}>Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>Omni-Channel</span>
          </div>
          <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Publisher Console</h1>
          <p style={{ opacity: 0.7 }}>Distribute thought leadership across the CogniVectra ecosystem.</p>
        </div>
        <div className="admin-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] })} className="btn">
            <FaPlus style={{ marginRight: '0.5rem' }} /> New Packet
          </button>
          <button onClick={handleSignOut} className="btn-outline" style={{ fontSize: '0.8rem' }}>Terminate Session</button>
        </div>
      </header>

      {/* TELEMETRY TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {["drafts", "pending", "published"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              border: '1px solid',
              borderColor: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {tab} ({posts.filter(p => p.status === (tab === "drafts" ? "draft" : tab === "pending" ? "pending_review" : "published")).length})
          </button>
        ))}
      </div>

      {/* CENTRAL EDITOR ENGINE */}
      <AnimatePresence>
        {editingPost && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="module-card glass-panel"
            style={{ marginBottom: '3rem', border: '1px solid rgba(129, 140, 248, 0.3)', position: 'relative', zIndex: 10, maxWidth: '1200px' }}
          >
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Content Engineering</h2>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid var(--accent-primary)', background: !previewMode ? 'var(--accent-primary)' : 'transparent', color: 'white', cursor: 'pointer' }}
                  >Editor</button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid var(--accent-primary)', background: previewMode ? 'var(--accent-primary)' : 'transparent', color: 'white', cursor: 'pointer' }}
                  >Live Preview</button>
                </div>
              </div>
              <button className="modal-close" onClick={() => { setEditingPost(null); setPreviewMode(false); }} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSave} className="application-form">
              <div style={{ display: 'grid', gridTemplateColumns: previewMode ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                <div className="editor-side">
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Strategic Title</label>
                    <input
                      value={editingPost.title}
                      onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                      placeholder="The Singularity of Agentic Development..."
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Social Abstract</label>
                    <input
                      value={editingPost.excerpt}
                      onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="Short hook..."
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Destination Slug (URL Link)</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <span style={{ padding: '0 0.8rem', opacity: 0.4, fontSize: '0.8rem' }}>/blog/</span>
                      <input
                        value={editingPost.slug || ""}
                        onChange={e => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") })}
                        placeholder="custom-url-handle"
                        style={{ flex: 1, padding: '0.8rem 0.8rem 0.8rem 0', background: 'transparent', border: 'none', color: 'var(--accent-light)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Core Manuscript (Markdown)</label>
                    <textarea
                      rows={15}
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}
                      value={editingPost.body}
                      onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                    />
                  </div>
                </div>

                {previewMode && (
                  <div className="preview-side" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '600px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.4, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Production Preview</div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{editingPost.title}</h1>
                    <div className="markdown-render" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      <ReactMarkdown>{editingPost.body}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn" style={{ flex: 2 }}>Commit Changes</button>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => { setEditingPost(null); setPreviewMode(false); }}>Abort</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEPLOYMENT FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredPosts.length === 0 && (
          <div style={{ padding: '5rem', textAlign: 'center', opacity: 0.4 }}>
            <div style={{ fontSize: '3rem' }}>🛰️</div>
            <p>No content packets detected in this sector.</p>
          </div>
        )}

        {filteredPosts.map((post, idx) => {
          const selectorOpen = showPlatformSelector[post.id];
          const isPublishing = publishingTo[post.id];

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel"
              style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                  <span className={`status-pill ${post.status === 'published' ? 'status-hot' : 'status-cold'}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    {post.status.replace('_', ' ')}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'white' }}>{post.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1.5rem', lineHeight: '1.6' }}>{post.excerpt || "No summary engineering provided."}</p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'blog', icon: <FaRocket />, color: '#818cf8' },
                    { id: 'linkedin', icon: <FaLinkedin />, color: '#0077b5' },
                    { id: 'instagram', icon: <FaInstagram />, color: '#e4405f' },
                    { id: 'facebook', icon: <FaFacebook />, color: '#1877f2' }
                  ].map(platform => {
                    const status = getPlatformStatus(post.id, platform.id);
                    const isPublished = status?.type === "published" || (platform.id === 'blog' && post.status === 'published');

                    return (
                      <div
                        key={platform.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.75rem',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          background: isPublished ? `${platform.color}22` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isPublished ? platform.color + '44' : 'rgba(255,255,255,0.05)'}`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span style={{ color: isPublished ? platform.color : 'rgba(255,255,255,0.2)' }}>{platform.icon}</span>
                        {isPublished && status?.platform_url ? (
                          <a
                            href={status.platform_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textTransform: 'capitalize', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            {platform.id} <FaExternalLinkAlt style={{ fontSize: '0.6rem', opacity: 0.6 }} />
                          </a>
                        ) : (
                          <span style={{ textTransform: 'capitalize', color: isPublished ? 'white' : 'rgba(255,255,255,0.2)' }}>{platform.id}</span>
                        )}
                        {isPublished && <FaCheckCircle style={{ fontSize: '0.6rem', color: '#10b981', marginLeft: '2px' }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                <button
                  className="sidebar-link"
                  style={{ justifyContent: 'center', padding: '0.7rem', background: 'rgba(255,255,255,0.03)' }}
                  onClick={() => setEditingPost(post)}
                >
                  <FaEdit style={{ marginRight: '0.5rem' }} /> Engineer Packet
                </button>

                {selectorOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}
                  >
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.8rem', fontWeight: '800', letterSpacing: '0.05em' }}>Target Vectors</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                      {["blog", "linkedin", "instagram", "facebook"].map(p => (
                        <button
                          key={p}
                          onClick={() => togglePlatform(post.id, p)}
                          style={{
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.7rem',
                            borderRadius: '6px',
                            background: (selectedPlatforms[post.id] || []).includes(p) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            cursor: 'pointer',
                            flex: '1 1 45%',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn"
                      style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}
                      onClick={() => publishPost(post)}
                      disabled={isPublishing}
                    >
                      {isPublishing ? <FaSpinner className="spin" /> : "Initiate Deployment"}
                    </button>
                    <button
                      onClick={() => setShowPlatformSelector(prev => ({ ...prev, [post.id]: false }))}
                      style={{ width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '0.5rem', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  (post.status === "draft" || post.status === "pending_review") && (
                    <button
                      className="btn"
                      style={{ padding: '0.7rem' }}
                      onClick={() => togglePlatformSelector(post.id)}
                      disabled={isPublishing}
                    >
                      {isPublishing ? "Synchronizing..." : "🚀 Deploy Packet"}
                    </button>
                  )
                )}

                {post.status === "published" && !selectorOpen && (
                  <Link to={`/blog/${post.slug}`} target="_blank" className="btn-outline" style={{ textAlign: 'center', fontSize: '0.8rem', padding: '0.7rem' }}>
                    Verify Live Link
                  </Link>
                )}

                {publishStatus[post.id] && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {Object.entries(publishStatus[post.id]).map(([plat, stat]) => (
                      stat.status === 'error' && (
                        <div key={plat} style={{ fontSize: '0.7rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <FaExclamationTriangle /> {plat}: {stat.error?.slice(0, 30)}...
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
