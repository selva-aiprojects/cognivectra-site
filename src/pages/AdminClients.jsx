import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminClients() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        company_name: '',
        industry: '',
        company_size: 'startup',
        website: '',
        primary_contact_name: '',
        primary_contact_email: '',
        primary_contact_phone: '',
        primary_contact_title: '',
        client_type: 'prospect',
        lead_source: '',
        relationship_status: 'new',
        country: 'India',
        notes: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
        }
        fetchClients();
    }

    async function fetchClients() {
        try {
            const { data, error } = await supabase
                .from('client_summary') // Using the view we created
                .select('*');

            if (error) throw error;
            setClients(data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients');
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function openNewClientForm() {
        setEditingClient(null);
        setFormData({
            company_name: '',
            industry: '',
            company_size: 'startup',
            website: '',
            primary_contact_name: '',
            primary_contact_email: '',
            primary_contact_phone: '',
            primary_contact_title: '',
            client_type: 'prospect',
            lead_source: '',
            relationship_status: 'new',
            country: 'India',
            notes: ''
        });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Clean the payload for 'clients' table
            const payload = {
                company_name: formData.company_name,
                industry: formData.industry,
                company_size: formData.company_size,
                website: formData.website,
                primary_contact_name: formData.primary_contact_name,
                primary_contact_email: formData.primary_contact_email,
                primary_contact_phone: formData.primary_contact_phone,
                primary_contact_title: formData.primary_contact_title,
                client_type: formData.client_type,
                lead_source: formData.lead_source,
                relationship_status: formData.relationship_status,
                country: formData.country,
                notes: formData.notes
            };

            const { error } = editingClient
                ? await supabase.from('clients').update(payload).eq('id', editingClient.id)
                : await supabase.from('clients').insert([payload]);

            if (error) throw error;

            setSuccess(editingClient ? 'Client updated!' : 'Client added!');
            fetchClients();
            setTimeout(() => {
                setShowForm(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            console.error('Error saving client:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) return <div className="admin-layout"><div className="admin-main-content">Loading...</div></div>;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link to="/admin" className="sidebar-link">🏠 Dashboard</Link>
                <Link to="/admin/clients" className="sidebar-link active">👥 Clients & CRM</Link>
                <Link to="/admin/projects" className="sidebar-link">🚀 Projects</Link>
                <Link to="/admin/jobs" className="sidebar-link">💼 Careers & Jobs</Link>
                <Link to="/admin/compensation" className="sidebar-link">💰 Compensation</Link>
                <Link to="/admin/offers" className="sidebar-link">📄 Offer Letters</Link>
                <Link to="/admin/blog" className="sidebar-link">✍️ Blog Posts</Link>
                <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
                    <button onClick={handleSignOut} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        🚪 Sign Out
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <div className="admin-header">
                    <div className="admin-title-area">
                        <div className="admin-breadcrumbs">
                            <Link to="/admin">Dashboard</Link> <span>/</span> <span>CRM</span>
                        </div>
                        <h1>Client Management</h1>
                        <p>Manage relationships, track leads, and view client health.</p>
                    </div>
                    <div className="admin-actions">
                        <button onClick={openNewClientForm} className="btn">+ Add Client</button>
                    </div>
                </div>

                {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Projects</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} onClick={() => { setEditingClient(client); setFormData(client); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{client.company_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.industry}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.9rem' }}>{client.primary_contact_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.primary_contact_email}</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            textTransform: 'capitalize',
                                            fontSize: '0.8rem',
                                            color: client.client_type === 'active' ? '#10b981' : '#9ca3af'
                                        }}>{client.client_type}</span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            background: client.relationship_status === 'healthy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                                            color: client.relationship_status === 'healthy' ? '#10b981' : '#9ca3af'
                                        }}>{client.relationship_status}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{client.active_projects}</td>
                                    <td style={{ fontWeight: '500' }}>₹{(client.total_revenue / 100000).toFixed(1)}L</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CLIENT FORM MODAL */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <div className="modal-header">
                                <h2>{editingClient ? 'Edit Client' : 'New Client'}</h2>
                                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="application-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Industry</label>
                                        <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Client Type</label>
                                        <select name="client_type" value={formData.client_type} onChange={handleInputChange}>
                                            <option value="prospect">Prospect</option>
                                            <option value="lead">Lead</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship Status</label>
                                        <select name="relationship_status" value={formData.relationship_status} onChange={handleInputChange}>
                                            <option value="new">New</option>
                                            <option value="nurturing">Nurturing</option>
                                            <option value="healthy">Healthy</option>
                                            <option value="at_risk">At Risk</option>
                                        </select>
                                    </div>
                                </div>
                                <h3 style={{ marginTop: '1.5rem' }}>Primary Contact</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Contact Name *</label>
                                        <input type="text" name="primary_contact_name" value={formData.primary_contact_name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Email *</label>
                                        <input type="email" name="primary_contact_email" value={formData.primary_contact_email} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Client'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
