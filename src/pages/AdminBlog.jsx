import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from "framer-motion";
import { LuPlus, LuCircleCheck, LuFilePen } from 'react-icons/lu';
import { FaFacebook, FaLinkedin, FaInstagram, FaSpinner } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";

export default function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [socialPosts, setSocialPosts] = useState({}); // Tracking platform status per post
    const [broadcasting, setBroadcasting] = useState(null); // ID of post being broadcasted
    const [editingPost, setEditingPost] = useState(null);

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const location = useLocation();

    useEffect(() => {
        fetchPosts();
        const params = new URLSearchParams(location.search);
        if (params.get('new') === '1') {
            setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] });
        }
    }, [location.search]);

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPosts(data || []);

            // Fetch social sharing status
            const { data: socialData, error: socialError } = await supabase
                .from("social_media_posts")
                .select("post_id, platform");

            if (!socialError && socialData) {
                const mapping = {};
                socialData.forEach(s => {
                    if (!mapping[s.post_id]) mapping[s.post_id] = [];
                    mapping[s.post_id].push(s.platform);
                });
                setSocialPosts(mapping);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }

    async function triggerSocialPublishing(postId, slug) {
        setBroadcasting(postId);
        try {
            console.log(`Triggering social publishing for post ${postId}...`);
            const { data, error } = await supabase.functions.invoke('publish-social', {
                body: {
                    postId: postId,
                    platforms: ['linkedin', 'facebook', 'instagram']
                }
            });

            if (error) throw error;
            console.log("Social publishing triggered successfully:", data);
        } catch (err) {
            console.error("Error triggering social publishing:", err);
        } finally {
            setBroadcasting(null);
            fetchPosts(); // Refresh to show icons
        }
    }

    async function handleSavePost(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const slug = editingPost.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const postData = { ...editingPost, slug };

            const { error } = editingPost.id
                ? await supabase.from("posts").update(postData).eq("id", editingPost.id)
                : await supabase.from("posts").insert([postData]);

            if (error) throw error;

            // Trigger social publishing if newly published
            if (postData.status === 'published') {
                const postId = editingPost.id || (await supabase.from("posts").select("id").eq("slug", slug).single()).data?.id;
                if (postId) triggerSocialPublishing(postId, slug);
            }

            setEditingPost(null);
            fetchPosts();
        } catch (err) {
            console.error("Error saving post:", err);
            alert("Error saving post. Check console.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeletePost(id) {
        if (!confirm("Are you sure?")) return;
        try {
            const { error } = await supabase.from("posts").delete().eq("id", id);
            if (error) throw error;
            fetchPosts();
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <header className="admin-header">
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs">
                        <Link to="/admin">Dashboard</Link> <span>/</span> <span className="current">Content</span>
                    </div>
                    <h1>Blog Management</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontWeight: '500', marginTop: '0.5rem' }}>Write and publish insights to CogniVectra Blog.</p>
                </div>
                {!editingPost && (
                    <div className="admin-actions">
                        <button className="btn" onClick={() => setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] })}>
                            <LuPlus /> New Post
                        </button>
                    </div>
                )}
            </header>

            {editingPost ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="module-card glass-panel"
                    style={{ maxWidth: '1000px', border: `1px solid var(--admin-border)` }}
                >
                    <div className="modal-header" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingPost.id ? "Edit Masterpiece" : "New Thought Leadership"}</h2>
                        <button className="modal-close" onClick={() => setEditingPost(null)}>×</button>
                    </div>
                    <form onSubmit={handleSavePost} className="application-form">
                        <div className="form-group">
                            <label>Post Title *</label>
                            <input
                                type="text"
                                value={editingPost.title}
                                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                required
                                placeholder="The Future of Agentic Workflows..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Short Abstract (Excerpt)</label>
                            <textarea
                                value={editingPost.excerpt}
                                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                rows="2"
                                placeholder="A brief hook for the social cards and list views."
                            />
                        </div>
                        <div className="form-group">
                            <label>Article Body</label>
                            <div className="glass-panel" style={{ overflow: 'hidden', border: `1px solid var(--admin-border)` }}>
                                <ReactQuill
                                    theme="snow"
                                    value={editingPost.body}
                                    onChange={(val) => setEditingPost({ ...editingPost, body: val })}
                                    modules={modules}
                                    style={{ height: 'auto', minHeight: '300px' }}
                                />
                            </div>
                        </div>
                        <div className="form-grid" style={{ marginTop: '4rem' }}>
                            <div className="form-group">
                                <label>Publication Status</label>
                                <select
                                    value={editingPost.status}
                                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                                >
                                    <option value="draft">Draft (Save for later)</option>
                                    <option value="published">Published (Go live)</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setEditingPost(null)}>Discard Changes</button>
                            <button type="submit" className="btn" style={{ flex: 2 }} disabled={saving}>{saving ? "Publishing..." : "Sync Article"}</button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="admin-table-container glass-panel">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Article Profile</th>
                                <th>Identity Status</th>
                                <th>Deployment Date</th>
                                <th style={{ textAlign: 'center' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>{post.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>/{post.slug}</span>
                                            {post.status === 'published' && (
                                                <div style={{ display: 'flex', gap: '6px', marginLeft: '0.5rem' }}>
                                                    <FaLinkedin title="LinkedIn" style={{ color: socialPosts[post.id]?.includes('linkedin') ? '#0A66C2' : 'var(--admin-border)', fontSize: '0.8rem' }} />
                                                    <FaFacebook title="Facebook" style={{ color: socialPosts[post.id]?.includes('facebook') ? '#1877F2' : 'var(--admin-border)', fontSize: '0.8rem' }} />
                                                    <FaInstagram title="Instagram" style={{ color: socialPosts[post.id]?.includes('instagram') ? '#E4405F' : 'var(--admin-border)', fontSize: '0.8rem' }} />
                                                    {broadcasting === post.id && <FaSpinner className="spin" style={{ fontSize: '0.7rem', color: 'var(--admin-accent)' }} />}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${post.status === 'published' ? 'status-hot' : 'status-cold'}`} style={{ fontSize: '0.7rem' }}>
                                            {post.status === 'published' ? <><LuCircleCheck style={{ marginRight: '4px' }} /> Published</> : <><LuFilePen style={{ marginRight: '4px' }} /> Draft</>}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                                            <button onClick={() => setEditingPost(post)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                                            {post.status === 'published' && (
                                                <button 
                                                    onClick={() => triggerSocialPublishing(post.id, post.slug)} 
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
                                                    title="Broadcast to All Socials"
                                                    disabled={broadcasting === post.id}
                                                >
                                                    {broadcasting === post.id ? <FaSpinner className="spin" /> : <FaLinkedin style={{ color: '#0A66C2' }} />}
                                                </button>
                                            )}
                                            {post.status === 'published' && (
                                                <a
                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cognivectra.com/blog/${post.slug}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#1877F2', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
                                                    title="Share on Facebook"
                                                >
                                                    <FaFacebook />
                                                </a>
                                            )}
                                            <button onClick={() => handleDeletePost(post.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}>Purge</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
