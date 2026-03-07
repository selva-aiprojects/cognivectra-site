import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminLayout from '../layouts/AdminLayout';
import { motion } from "framer-motion";
import { LuPlus, LuCircleCheck, LuFilePen } from 'react-icons/lu';
import { Link, useLocation } from "react-router-dom";

export default function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [saving, setSaving] = useState(false);

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
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
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

    if (loading) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout>
            <header className="admin-header glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <Link to="/admin" style={{ opacity: 0.6 }}>Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>Content</span>
                    </div>
                    <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Blog Management</h1>
                    <p style={{ opacity: 0.7 }}>Write and publish insights to CogniVectra Blog.</p>
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
                    style={{ maxWidth: '1000px', border: '1px solid rgba(255,255,255,0.1)' }}
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
                            <div className="glass-panel" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
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
                                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{post.title}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>/{post.slug}</div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${post.status === 'published' ? 'status-hot' : 'status-cold'}`} style={{ fontSize: '0.7rem' }}>
                                            {post.status === 'published' ? <><LuCircleCheck style={{ marginRight: '4px' }} /> Published</> : <><LuFilePen style={{ marginRight: '4px' }} /> Draft</>}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                            <button onClick={() => setEditingPost(post)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.85rem' }}>Edit Post</button>
                                            <button onClick={() => handleDeletePost(post.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}>Purge</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
