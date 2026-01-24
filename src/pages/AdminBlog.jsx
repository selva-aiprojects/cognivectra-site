import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminBlog() {
    const navigate = useNavigate();
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

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate("/login");
            return;
        }
        fetchPosts();
    }

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

    if (loading) return <div className="admin-layout"><div className="admin-main-content">Loading...</div></div>;

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <Link to="/admin" className="sidebar-link">🏠 Dashboard</Link>
                <Link to="/admin/clients" className="sidebar-link">👥 Clients & CRM</Link>
                <Link to="/admin/projects" className="sidebar-link">🚀 Projects</Link>
                <Link to="/admin/jobs" className="sidebar-link">💼 Careers & Jobs</Link>
                <Link to="/admin/compensation" className="sidebar-link">💰 Compensation</Link>
                <Link to="/admin/offers" className="sidebar-link">📄 Offer Letters</Link>
                <Link to="/admin/blog" className="sidebar-link active">✍️ Blog Posts</Link>
                <Link to="/admin/reports" className="sidebar-link">📊 Reports</Link>
            </aside>

            <main className="admin-main-content">
                <div className="admin-header">
                    <div className="admin-title-area">
                        <h1>Blog Management</h1>
                        <p>Write and publish insights to CogniVectra Blog.</p>
                    </div>
                    {!editingPost && (
                        <button className="btn" onClick={() => setEditingPost({ title: "", excerpt: "", body: "", status: "draft", tags: [] })}>
                            + New Post
                        </button>
                    )}
                </div>

                {editingPost ? (
                    <div className="module-card" style={{ maxWidth: '1000px' }}>
                        <h2>{editingPost.id ? "Edit Post" : "New Post"}</h2>
                        <form onSubmit={handleSavePost} className="application-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Excerpt</label>
                                <textarea
                                    value={editingPost.excerpt}
                                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                    rows="2"
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={editingPost.body}
                                        onChange={(val) => setEditingPost({ ...editingPost, body: val })}
                                        modules={modules}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={editingPost.status}
                                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-outline" onClick={() => setEditingPost(null)}>Cancel</button>
                                <button type="submit" className="btn" disabled={saving}>{saving ? "Saving..." : "Save Post"}</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td style={{ fontWeight: '500' }}>{post.title}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '99px',
                                                fontSize: '0.75rem',
                                                background: post.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                                color: post.status === 'published' ? '#10b981' : '#9ca3af'
                                            }}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setEditingPost(post)}>Edit</button>
                                                <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }} onClick={() => handleDeletePost(post.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
