import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaLinkedin, FaInstagram, FaFacebook, FaEdit, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaPlus, FaExternalLinkAlt, FaUsers, FaFileContract, FaTools, FaBriefcase, FaEnvelopeOpenText } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

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
  const [activeConsole, setActiveConsole] = useState("publisher"); // or "talent"
  const [applications, setApplications] = useState([]);
  const [compensationPackages, setCompensationPackages] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showOfferGenerator, setShowOfferGenerator] = useState(false);
  const [offerData, setOfferData] = useState({
    annual_ctc: 0,
    joining_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days from now
    basic_salary: 0,
    hra: 0,
    special_allowance: 0,
    performance_bonus: 0,
    benefits: [],
    notice_period: 60,
    probation_months: 3
  });
  const [previewMode, setPreviewMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
    else fetchAdminData();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function fetchAdminData() {
    setLoading(true);
    try {
      // 1. Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) console.error("Posts fetch error:", postsError);
      else setPosts(postsData || []);

      // 2. Fetch social media status
      const { data: socialData } = await supabase.from("social_media_posts").select("*");
      const statusMap = {};
      socialData?.forEach(item => {
        if (!statusMap[item.post_id]) statusMap[item.post_id] = {};
        statusMap[item.post_id][item.platform] = item;
      });
      setSocialMediaStatus(statusMap);

      // 3. Fetch Job Applications
      const { data: appsData, error: appsError } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (appsError) console.error("Apps fetch error:", appsError);
      else setApplications(appsData || []);

      // 4. Fetch Compensation Benchmarks
      const { data: compData, error: compError } = await supabase
        .from("compensation_packages")
        .select("*")
        .eq("is_active", true);

      if (compError) console.error("Comp fetch error:", compError);
      else setCompensationPackages(compData || []);

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

  function handleSelectPackage(pkg) {
    const midCtc = (pkg.annual_ctc_min + pkg.annual_ctc_max) / 2;
    setOfferData({
      ...offerData,
      role_title: pkg.role_title,
      annual_ctc: midCtc,
      basic_salary: midCtc * (pkg.basic_salary_percentage / 100),
      hra: midCtc * (pkg.hra_percentage / 100),
      special_allowance: midCtc * (pkg.special_allowance_percentage / 100),
      performance_bonus: midCtc * (pkg.performance_bonus_percentage / 100),
      benefits: pkg.benefits || [],
      notice_period: pkg.notice_period_days,
      probation_months: pkg.probation_period_months,
      department: pkg.department,
      work_location: pkg.work_location
    });
  }

  function updateOfferCtc(newCtc, pkg) {
    setOfferData({
      ...offerData,
      annual_ctc: newCtc,
      basic_salary: newCtc * (pkg.basic_salary_percentage / 100),
      hra: newCtc * (pkg.hra_percentage / 100),
      special_allowance: newCtc * (pkg.special_allowance_percentage / 100),
      performance_bonus: newCtc * (pkg.performance_bonus_percentage / 100)
    });
  }

  async function sendOffer() {
    if (!window.confirm(`Initiate official offer deployment for ${selectedApplication.full_name}?`)) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-offer-document', {
        body: {
          ...offerData,
          candidate_email: selectedApplication.email,
          candidate_name: selectedApplication.full_name
        }
      });

      if (error) throw error;

      alert(`Strategic deployment successful! Offer sent to ${selectedApplication.email}`);
      setShowOfferGenerator(false);

      // Update application status in DB
      await supabase
        .from('job_applications')
        .update({
          status: 'offered',
          metadata: { ...(selectedApplication.metadata || {}), offered_at: new Date().toISOString() }
        })
        .eq('id', selectedApplication.id);

      fetchAdminData(); // Refresh list
    } catch (err) {
      console.error('Offer deployment failure:', err);
      alert(`Deployment failure: ${err.message || 'Check logs'}`);
    } finally {
      setLoading(false);
    }
  }

  async function publishPost(post, platforms = null) {
    // Use provided platforms or selected platforms
    const platformsToUse = platforms || selectedPlatforms[post.id] || ["blog"];

    if (platformsToUse.length === 0) {
      alert("Please select at least one platform to publish to.");
      return;
    }

    // Confirmation dialog
    const confirmMsg = `Initiate deployment of "${post.title}" to: ${platformsToUse.join(', ')}?`;
    if (!window.confirm(confirmMsg)) return;

    // Instagram check
    if (platformsToUse.includes('instagram') && !post.image_url) {
      const proceed = window.confirm("⚠️ Instagram requires an image. No image URL detected for this post. A placeholder will be used. Proceed anyway?");
      if (!proceed) return;
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
      // 1. Publish to Blog (Database status change)
      if (platformsToUse.includes('blog')) {
        const { error } = await supabase
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            published_platforms: platformsToUse
          })
          .eq("id", post.id);

        if (error) throw error;
      }

      // 2. Publish to social media
      if (socials.length > 0) {
        await publishToSocialMedia(post, socials);
      } else {
        // If only blog was selected, we are done
        alert(`Successfully published "${post.title}" to Blog.`);
        await fetchPosts();
      }

      // Clear status after a delay
      setTimeout(() => {
        setPublishStatus(prev => {
          const updated = { ...prev };
          delete updated[post.id];
          return updated;
        });
      }, 8000);
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
            <Link to="/admin" style={{ opacity: 0.6 }}>Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>{activeConsole === 'publisher' ? 'Omni-Channel' : 'Talent Ops'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em', margin: 0 }}>{activeConsole === 'publisher' ? 'Publisher Console' : 'Talent Console'}</h1>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setActiveConsole('publisher')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  background: activeConsole === 'publisher' ? 'var(--accent-primary)' : 'transparent',
                  color: activeConsole === 'publisher' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FaRocket style={{ marginRight: '6px' }} /> Publisher
              </button>
              <button
                onClick={() => setActiveConsole('talent')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  background: activeConsole === 'talent' ? 'var(--accent-primary)' : 'transparent',
                  color: activeConsole === 'talent' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FaUsers style={{ marginRight: '6px' }} /> Talent Ops
              </button>
            </div>
          </div>
          <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>
            {activeConsole === 'publisher'
              ? 'Distribute thought leadership across the CogniVectra ecosystem.'
              : 'Orchestrate elite talent acquisition and offer engineering.'}
          </p>
        </div>
        <div className="admin-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] })} className="btn">
            <FaPlus style={{ marginRight: '0.5rem' }} /> New Packet
          </button>
          <button onClick={handleSignOut} className="btn-outline" style={{ fontSize: '0.8rem' }}>Terminate Session</button>
        </div>
      </header>

      {/* CONSOLE SWITCHER ENGINE */}
      {activeConsole === 'publisher' ? (
        <>
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

          {/* OFFER GENERATOR ENGINE */}
          <AnimatePresence>
            {showOfferGenerator && selectedApplication && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                className="module-card glass-panel"
                style={{ marginBottom: '3rem', border: '1px solid var(--accent-primary)', position: 'relative', zIndex: 10, maxWidth: '1200px' }}
              >
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Offer Engineering</h2>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Designing official deployment for <strong>{selectedApplication.full_name}</strong></p>
                  </div>
                  <button className="modal-close" onClick={() => setShowOfferGenerator(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
                  {/* CONFIGURATION PANEL */}
                  <div className="config-panel">
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5 }}>1. Select Benchmark Vector</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {compensationPackages.map(pkg => (
                          <button
                            key={pkg.id}
                            onClick={() => handleSelectPackage(pkg)}
                            style={{
                              padding: '0.8rem',
                              borderRadius: '8px',
                              background: offerData.role_title === pkg.role_title ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white',
                              fontSize: '0.75rem',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: '700' }}>{pkg.role_title}</div>
                            <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{pkg.role_level} benchmark</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {offerData.role_title && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5 }}>2. Tune Compensation (CTC)</label>
                          <input
                            type="range"
                            min={compensationPackages.find(p => p.role_title === offerData.role_title)?.annual_ctc_min}
                            max={compensationPackages.find(p => p.role_title === offerData.role_title)?.annual_ctc_max}
                            step={50000}
                            value={offerData.annual_ctc}
                            onChange={(e) => updateOfferCtc(Number(e.target.value), compensationPackages.find(p => p.role_title === offerData.role_title))}
                            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--accent-light)' }}>
                            <span>INR {offerData.annual_ctc.toLocaleString()}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Calculated components updated.</span>
                          </div>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.5 }}>Breakdown Engineering</h4>
                          <div style={{ display: 'grid', gap: '0.8rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ opacity: 0.6 }}>Basic Salary (50%)</span>
                              <span>₹ {offerData.basic_salary.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ opacity: 0.6 }}>HRA (20%)</span>
                              <span>₹ {offerData.hra.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ opacity: 0.6 }}>Special Allowance (20%)</span>
                              <span>₹ {offerData.special_allowance.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-light)' }}>
                              <span style={{ opacity: 0.6 }}>Performance Bonus (10%)</span>
                              <span>₹ {offerData.performance_bonus.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="form-actions" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                          <button className="btn" style={{ flex: 2 }} onClick={sendOffer}>Execute Official Dispatch</button>
                          <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowOfferGenerator(false)}>Abort</button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* LIVE PREVIEW PANEL */}
                  <div className="preview-panel" style={{ background: 'white', borderRadius: '12px', padding: '0', overflow: 'hidden', height: '650px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#f8fafc', padding: '10px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '10px', fontWeight: '600' }}>cognivectra_offer_v2.html</span>
                    </div>
                    <div style={{ padding: '30px', flex: 1, overflowY: 'auto', color: '#1e293b', fontFamily: 'serif' }}>
                      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ margin: 0, color: '#0f172a' }}>CogniVectra</h2>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Employment Offer Letter</div>
                      </div>

                      <p>Date: {new Date().toLocaleDateString()}</p>
                      <p><strong>Dear {selectedApplication.full_name},</strong></p>

                      <p>We are delighted to offer you the position of <strong>{offerData.role_title || "Engineering Lead"}</strong> at CogniVectra Innovations. We were impressed with your skills and the value you will bring to our team.</p>

                      <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Employment Terms:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                          <li><strong>Position:</strong> {offerData.role_title}</li>
                          <li><strong>Annual CTC:</strong> INR {offerData.annual_ctc.toLocaleString()}</li>
                          <li><strong>Joining Date:</strong> {offerData.joining_date}</li>
                          <li><strong>Location:</strong> {offerData.work_location || "Remote"}</li>
                        </ul>
                      </div>

                      <p>This offer is subject to the terms and conditions outlined in our standard employee agreement.</p>

                      <p>Best regards,<br /><strong>The Talent Team</strong><br />CogniVectra Innovations</p>
                    </div>
                  </div>
                </div>
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
        </>
      ) : (
        <div className="talent-ops-view">
          {/* TALENT OPS TABS */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {["applicants", "benchmarks", "offers"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({
                  tab === 'applicants' ? applications.length :
                    tab === 'benchmarks' ? compensationPackages.length : 0
                })
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeTab === 'applicants' && (
              <>
                {applications.length === 0 ? (
                  <div style={{ padding: '5rem', textAlign: 'center', opacity: 0.4 }}>
                    <div style={{ fontSize: '3rem' }}>👥</div>
                    <p>No active talent packets detected.</p>
                  </div>
                ) : (
                  applications.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel"
                      style={{ padding: '1.5rem 2rem', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{app.full_name}</h3>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-primary)', color: 'white' }}>{app.position}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
                          <span>{app.email}</span>
                          <span>•</span>
                          <span>{app.experience_years} Years Exp.</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          className="btn-outline"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowOfferGenerator(true);
                          }}
                        >
                          <FaFileContract style={{ marginRight: '0.5rem' }} /> Engineer Offer
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {activeTab === 'benchmarks' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {compensationPackages.map(pkg => (
                  <div key={pkg.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0 }}>{pkg.role_title}</h4>
                      <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{pkg.role_level}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-light)' }}>
                      {pkg.currency} {pkg.annual_ctc_min.toLocaleString()} - {pkg.annual_ctc_max.toLocaleString()}
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', opacity: 0.7 }}>
                      {pkg.department} • {pkg.work_location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
