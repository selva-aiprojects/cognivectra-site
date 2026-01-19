import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

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
        if (!session) {
            navigate('/login');
        } else {
            fetchDrafts();
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    async function fetchDrafts() {
        setLoading(true);
        // Fetch all posts order by created_at desc
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else setPosts(data || []);
        setLoading(false);
    }

    async function handlePublish(post) {
        if (!window.confirm(`Are you sure you want to publish "${post.title}"?`)) return;

        const { error } = await supabase
            .from('posts')
            .update({ status: 'published', published_at: new Date() })
            .eq('id', post.id);

        if (error) alert('Error publishing: ' + error.message);
        else {
            alert('Post published!');
            fetchDrafts();
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        const { error } = await supabase
            .from('posts')
            .update({
                title: editingPost.title,
                excerpt: editingPost.excerpt,
                body: editingPost.body
            })
            .eq('id', editingPost.id);

        if (error) alert('Error saving: ' + error.message);
        else {
            alert('Changes saved.');
            setEditingPost(null);
            fetchDrafts();
        }
    }

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Checking access...</div>;

    return (
        <div className="section ai-neutral">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Admin Dashboard</h1>
                    <button onClick={handleSignOut} style={{ background: 'transparent', border: `1px solid var(--border-light)` }}>Sign Out</button>
                </div>
                <p>Review and publish AI-generated content.</p>

                {editingPost ? (
                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3>Edit Post</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Excerpt</label>
                                <textarea
                                    value={editingPost.excerpt}
                                    onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Body (Markdown)</label>
                                <textarea
                                    value={editingPost.body}
                                    onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                                    rows={15}
                                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                                />
                            </div>
                            <div>
                                <button type="submit" className="button-primary">Save Changes</button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid1" style={{ marginTop: '2rem' }}>
                        {posts.map(post => (
                            <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{
                                        background: post.status === 'published' ? '#dcfce7' : '#fef9c3',
                                        color: post.status === 'published' ? '#166534' : '#854d0e',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        marginRight: '1rem'
                                    }}>
                                        {post.status.toUpperCase()}
                                    </span>
                                    <h3 style={{ display: 'inline', fontSize: '1.2rem' }}>{post.title}</h3>
                                    <p style={{ color: "var(--text-muted-dark)", fontSize: '0.9rem' }}>{new Date(post.created_at).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setEditingPost(post)}>Edit</button>
                                    {post.status !== 'published' && (
                                        <button
                                            onClick={() => handlePublish(post)}
                                            className="button-primary"
                                        >
                                            Publish
                                        </button>
                                    )}
                                    {post.status === 'published' && (
                                        <Link to={`/blog/${post.slug}`} target="_blank">View Live</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
