import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminEnhanced() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [publishingTo, setPublishingTo] = useState({});
    const [activeTab, setActiveTab] = useState('drafts'); // 'drafts', 'pending', 'published'
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
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else setPosts(data || []);
        setLoading(false);
    }

    // Filter posts by status
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'drafts') return post.status === 'draft';
        if (activeTab === 'pending') return post.status === 'pending_review';
        if (activeTab === 'published') return post.status === 'published';
        return true;
    });

    async function handleSave(e) {
        e.preventDefault();
        const { error } = await supabase
            .from('posts')
            .update({
                title: editingPost.title,
                excerpt: editingPost.excerpt,
                body: editingPost.body,
                tags: editingPost.tags || [],
                social_media_data: editingPost.social_media_data || {}
            })
            .eq('id', editingPost.id);

        if (error) alert('Error saving: ' + error.message);
        else {
            alert('Changes saved.');
            setEditingPost(null);
            fetchDrafts();
        }
    }

    async function publishPost(post, platforms = ['blog']) {
        setPublishingTo(prev => ({ ...prev, [post.id]: true }));

        try {
            // Update post status to published
            const { error: updateError } = await supabase
                .from('posts')
                .update({
                    status: 'published',
                    published_at: new Date().toISOString(),
                    published_platforms: platforms
                })
                .eq('id', post.id);

            if (updateError) throw updateError;

            // Collect social platforms (everything except 'blog')
            const socialPlatforms = platforms.filter(p => p !== 'blog');
            if (socialPlatforms.length > 0) {
                await publishToSocialMedia(post, socialPlatforms);
            }

            alert('Post published successfully!');
            fetchDrafts();
        } catch (error) {
            alert('Error publishing: ' + error.message);
        } finally {
            setPublishingTo(prev => ({ ...prev, [post.id]: false }));
        }
    }

    async function publishToSocialMedia(post, platforms) {
        console.log(`🚀 Triggering automated publishing for:`, platforms);

        try {
            const { data, error } = await supabase.functions.invoke('publish-social', {
                body: {
                    postId: post.id,
                    platforms: platforms
                }
            });

            if (error) throw error;

            console.log('✅ Edge Function Response:', data);

            const results = data.results || [];
            const successList = results.filter(r => r.success).map(r => r.platform);
            const failList = results.filter(r => !r.success);

            if (successList.length > 0) {
                alert(`✅ Successfully published to: ${successList.join(', ')}`);
            }

            if (failList.length > 0) {
                const details = failList.map(f => `${f.platform}: ${f.error || 'Check logs'}`).join('\n');
                alert(`⚠️ Issues publishing to some platforms:\n${details}`);
            }

        } catch (error) {
            console.error(`❌ Automation Error:`, error);

            // Try to extract a specific message if available
            let errorMsg = error.message || 'Unknown error';
            if (error.context?.json) {
                errorMsg = error.context.json.error || errorMsg;
            }

            alert(`❌ automation failed: ${errorMsg}\n\nCheck your browser console (F12) or Supabase Dashboard for full logs.`);
        }
    }

    async function schedulePost(post, scheduledDate) {
        const { error } = await supabase
            .from('posts')
            .update({
                status: 'scheduled',
                published_at: scheduledDate
            })
            .eq('id', post.id);

        if (error) alert('Error scheduling: ' + error.message);
        else {
            alert(`Post scheduled for ${scheduledDate}`);
            fetchDrafts();
        }
    }

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading admin panel...</div>;

    return (
        <div className="section ai-neutral">
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>📊 Admin Dashboard</h1>
                        <p>Manage, review, and publish AI-generated content to blog and social media</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/admin/reports" className="btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                            📈 View Reports
                        </Link>
                        <button onClick={handleSignOut} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            🚪 Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('drafts')}
                        style={{
                            background: activeTab === 'drafts' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'drafts' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'drafts' ? '600' : '500'
                        }}
                    >
                        ✏️ Drafts ({posts.filter(p => p.status === 'draft').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        style={{
                            background: activeTab === 'pending' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'pending' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'pending' ? '600' : '500'
                        }}
                    >
                        🔄 Pending Review ({posts.filter(p => p.status === 'pending_review').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('published')}
                        style={{
                            background: activeTab === 'published' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'published' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'published' ? '600' : '500'
                        }}
                    >
                        ✅ Published ({posts.filter(p => p.status === 'published').length})
                    </button>
                </div>

                {/* Edit Post Form */}
                {editingPost ? (
                    <div className="card no-hover-effect" style={{ marginBottom: '2rem' }}>
                        <h2>Edit Post</h2>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Title</label>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Excerpt</label>
                                <textarea
                                    value={editingPost.excerpt}
                                    onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Body (Markdown)</label>
                                <textarea
                                    value={editingPost.body}
                                    onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                                    rows={15}
                                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={editingPost.tags?.join(', ') || ''}
                                    onChange={e => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                                />
                            </div>

                            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem' }}>📱 Social Media Versions</h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>LinkedIn Post (max 3000 chars)</label>
                                    <textarea
                                        value={editingPost.social_media_data?.linkedin || ''}
                                        onChange={e => setEditingPost({
                                            ...editingPost,
                                            social_media_data: { ...(editingPost.social_media_data || {}), linkedin: e.target.value }
                                        })}
                                        rows={5}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Instagram Caption</label>
                                    <textarea
                                        value={editingPost.social_media_data?.instagram || ''}
                                        onChange={e => setEditingPost({
                                            ...editingPost,
                                            social_media_data: { ...(editingPost.social_media_data || {}), instagram: e.target.value }
                                        })}
                                        rows={3}
                                    />
                                </div>
                                <div style={{ marginBottom: '0' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Facebook Post</label>
                                    <textarea
                                        value={editingPost.social_media_data?.facebook || ''}
                                        onChange={e => setEditingPost({
                                            ...editingPost,
                                            social_media_data: { ...(editingPost.social_media_data || {}), facebook: e.target.value }
                                        })}
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn" style={{ marginBottom: 0 }}>
                                    💾 Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    style={{ marginBottom: 0, background: 'transparent', border: '1px solid var(--border-light)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}

                {/* Posts List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {filteredPosts.length === 0 ? (
                        <div className="card no-hover-effect" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ color: 'var(--text-muted-dark)' }}>No posts in this category yet.</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post.id} className="card no-hover-effect" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            background: post.status === 'published' ? '#dcfce7' : post.status === 'pending_review' ? '#fef3c7' : '#e0e7ff',
                                            color: post.status === 'published' ? '#166534' : post.status === 'pending_review' ? '#854d0e' : '#312e81',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {post.status}
                                        </span>
                                        {post.published_platforms?.length > 0 && (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>
                                                📱 {post.published_platforms.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        {post.excerpt}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>
                                        📅 {new Date(post.created_at).toLocaleDateString()} | 🏷️ {post.tags?.join(', ') || 'No tags'}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
                                    <button
                                        onClick={() => setEditingPost(post)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--border-light)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>

                                    {post.status === 'draft' && (
                                        <button
                                            onClick={() => publishPost(post, ['blog', 'linkedin', 'instagram', 'facebook'])}
                                            disabled={publishingTo[post.id]}
                                            className="btn"
                                            style={{ marginBottom: 0, fontSize: '0.9rem' }}
                                        >
                                            {publishingTo[post.id] ? '⏳ Publishing...' : '🚀 Publish All'}
                                        </button>
                                    )}

                                    {post.status === 'pending_review' && (
                                        <>
                                            <button
                                                onClick={() => publishPost(post, ['blog', 'linkedin'])}
                                                disabled={publishingTo[post.id]}
                                                className="btn"
                                                style={{ marginBottom: 0, fontSize: '0.9rem' }}
                                            >
                                                {publishingTo[post.id] ? '⏳ Publishing...' : '✅ Approve & Share'}
                                            </button>
                                            <button
                                                onClick={() => publishPost(post, ['blog'])}
                                                disabled={publishingTo[post.id]}
                                                style={{ marginBottom: 0, fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                📰 Blog Only
                                            </button>
                                        </>
                                    )}

                                    {post.status === 'published' && (
                                        <Link to={`/blog/${post.slug}`} target="_blank" style={{
                                            background: 'transparent',
                                            border: '1px solid var(--accent-primary)',
                                            color: 'var(--accent-primary)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}>
                                            👁️ View Live
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
