import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminReports() {
    const [chats, setChats] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'contacts'
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
        } else {
            fetchData();
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    async function fetchData() {
        setLoading(true);
        try {
            const [chatsRes, contactsRes] = await Promise.all([
                supabase.from('chat_conversations').select('*').order('created_at', { ascending: false }),
                supabase.from('contacts').select('*').order('created_at', { ascending: false })
            ]);

            if (chatsRes.error) console.error('Chats fetch error:', chatsRes.error);
            if (contactsRes.error) console.error('Contacts fetch error:', contactsRes.error);

            setChats(chatsRes.data || []);
            setContacts(contactsRes.data || []);
        } catch (err) {
            console.error('Lead fetch error:', err);
        }
        setLoading(false);
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading reports...</div>;

    return (
        <div className="section ai-neutral">
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>📊 Lead Reports</h1>
                        <p>User details collected from ChatBot and Contact Form</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/admin" className="btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                            📁 Content Manager
                        </Link>
                        <button onClick={handleSignOut} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            🚪 Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => { setActiveTab('chats'); setSelectedItem(null); }}
                        style={{
                            background: activeTab === 'chats' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'chats' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'chats' ? '600' : '500'
                        }}
                    >
                        🤖 ChatBot Leads ({chats.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('contacts'); setSelectedItem(null); }}
                        style={{
                            background: activeTab === 'contacts' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'contacts' ? 'white' : 'var(--text-primary)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'contacts' ? '600' : '500'
                        }}
                    >
                        📧 Contact Form ({contacts.length})
                    </button>
                </div>

                <div className="grid2" style={{ alignItems: 'start' }}>
                    {/* Leads List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(activeTab === 'chats' ? chats : contacts).map((item) => (
                            <div
                                key={item.id}
                                className={`card no-hover-effect ${selectedItem?.id === item.id ? 'active' : ''}`}
                                onClick={() => setSelectedItem(item)}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    border: selectedItem?.id === item.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{item.user_name || item.name || 'Anonymous'}</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-dark)' }}>
                                        {formatDate(item.created_at)}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {item.user_email || item.email}
                                </div>
                                {activeTab === 'chats' && item.company && (
                                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                        🏢 {item.company}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Details View */}
                    <div className="card no-hover-effect" style={{ position: 'sticky', top: '2rem', minHeight: '400px' }}>
                        {selectedItem ? (
                            <div>
                                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                                    Full Details
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Name</label>
                                        <p style={{ margin: 0 }}>{selectedItem.user_name || selectedItem.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Email</label>
                                        <p style={{ margin: 0 }}><a href={`mailto:${selectedItem.user_email || selectedItem.email}`} style={{ color: 'var(--accent-primary)' }}>{selectedItem.user_email || selectedItem.email}</a></p>
                                    </div>

                                    {activeTab === 'chats' ? (
                                        <>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Company</label>
                                                <p style={{ margin: 0 }}>{selectedItem.company || 'Not provided'}</p>
                                            </div>
                                            <div className="grid2" style={{ gap: '1rem' }}>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Stage</label>
                                                    <p style={{ margin: 0 }}>{selectedItem.stage || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Budget</label>
                                                    <p style={{ margin: 0 }}>{selectedItem.budget || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Challenge</label>
                                                <p style={{ margin: 0 }}>{selectedItem.challenge || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Chat History</label>
                                                <div style={{
                                                    background: 'var(--bg-secondary)',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    marginTop: '0.5rem',
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {selectedItem.messages?.map((msg, i) => (
                                                        <div key={i} style={{ marginBottom: '0.75rem', textAlign: msg.role === 'assistant' ? 'left' : 'right' }}>
                                                            <div style={{
                                                                display: 'inline-block',
                                                                background: msg.role === 'assistant' ? 'var(--bg-primary)' : 'var(--accent-primary)',
                                                                color: msg.role === 'assistant' ? 'var(--text-primary)' : 'white',
                                                                padding: '0.5rem 0.75rem',
                                                                borderRadius: '8px',
                                                                maxWidth: '85%'
                                                            }}>
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid2" style={{ gap: '1rem' }}>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Stage</label>
                                                    <p style={{ margin: 0 }}>{selectedItem.stage || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Need</label>
                                                    <p style={{ margin: 0 }}>{selectedItem.need || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted-dark)', display: 'block' }}>Message</label>
                                                <p style={{
                                                    margin: 0,
                                                    background: 'var(--bg-secondary)',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    whiteSpace: 'pre-wrap'
                                                }}>{selectedItem.message}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted-dark)' }}>
                                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</span>
                                <p>Select a lead from the list to view full details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
