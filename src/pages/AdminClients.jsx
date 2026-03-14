import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LuCircleCheck, LuCircleAlert, LuPlus, LuBuilding2, LuRocket } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function AdminClients() {
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
        fetchClients();
    }, []);

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

    if (loading) return <div>Loading clients...</div>;

    return (
        <>
            <header className="admin-header">
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs">
                        <Link to="/admin">Dashboard</Link> <span>/</span> <span className="current">CRM</span>
                    </div>
                    <h1>Client Hub</h1>
                    <p>Manage relationships, track leads, and view client health.</p>
                </div>
                <div className="admin-actions">
                    <button onClick={openNewClientForm} className="btn"><LuPlus /> Add Client</button>
                </div>
            </header>

            {/* CRM KPI STRIP */}
            <div className="admin-kpi-strip">
                <div className="kpi-card glass-panel">
                    <div className="kpi-icon" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}><LuBuilding2 /></div>
                    <div className="kpi-data">
                        <div className="kpi-value">{clients.filter(c => c.client_type === 'active').length}</div>
                        <div className="kpi-label">Active Partners</div>
                    </div>
                </div>
                <div className="kpi-card glass-panel">
                    <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><LuRocket /></div>
                    <div className="kpi-data">
                        <div className="kpi-value">{clients.filter(c => c.client_type === 'prospect' || c.client_type === 'lead').length}</div>
                        <div className="kpi-label">Pipeline Funnel</div>
                    </div>
                </div>
                <div className="kpi-card glass-panel">
                    <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><LuCircleCheck /></div>
                    <div className="kpi-data">
                        <div className="kpi-value">{clients.filter(c => c.relationship_status === 'healthy').length}</div>
                        <div className="kpi-label">Healthy Retention</div>
                    </div>
                </div>
                <div className="kpi-card glass-panel">
                    <div className="kpi-icon" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}><LuPlus /></div>
                    <div className="kpi-data">
                        <div className="kpi-value">₹{(clients.reduce((acc, c) => acc + (c.total_revenue || 0), 0) / 100000).toFixed(1)}L</div>
                        <div className="kpi-label">Portfolio Value</div>
                    </div>
                </div>
            </div>

            {success && <div className="success-message status-hot">{success}</div>}

            <div className="admin-table-container glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Company Information</th>
                            <th>Contact Person</th>
                            <th>Engagement Type</th>
                            <th>Relationship</th>
                            <th style={{ textAlign: 'center' }}>Projects</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} onClick={() => { setEditingClient(client); setFormData(client); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                                <td>
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{client.company_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{client.industry}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.9rem' }}>{client.primary_contact_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{client.primary_contact_email}</div>
                                </td>
                                <td>
                                    <span style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        color: client.client_type === 'active' ? 'var(--admin-accent)' : 'var(--admin-text-muted)'
                                    }}>
                                        {client.client_type}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-pill ${client.relationship_status === 'healthy' ? 'status-hot' : 'status-cold'}`}>
                                        {client.relationship_status === 'healthy' && <LuCircleCheck style={{ marginRight: '4px' }} />}
                                        {client.relationship_status === 'at_risk' && <LuCircleAlert style={{ marginRight: '4px' }} />}
                                        <span style={{ textTransform: 'uppercase' }}>{client.relationship_status}</span>
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span style={{ background: 'var(--admin-accent-soft)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        {client.active_projects}
                                    </span>
                                </td>
                                <td style={{ fontWeight: '700', color: 'var(--admin-accent)' }}>
                                    ₹{(client.total_revenue / 100000).toFixed(1)}L
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CLIENT FORM MODAL */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', border: `1px solid var(--admin-border)` }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingClient ? 'Update Details' : 'Create Client Profile'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="application-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company Legal Name *</label>
                                    <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} required placeholder="e.g. Acme Innovations" />
                                </div>
                                <div className="form-group">
                                    <label>Industry Vertical</label>
                                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Fintech, EdTech" />
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
                                    <label>Relationship Health</label>
                                    <select name="relationship_status" value={formData.relationship_status} onChange={handleInputChange}>
                                        <option value="new">New</option>
                                        <option value="nurturing">Nurturing</option>
                                        <option value="healthy">Healthy</option>
                                        <option value="at_risk">At Risk</option>
                                    </select>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Primary Decision Maker</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="primary_contact_name" value={formData.primary_contact_name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Business Email *</label>
                                    <input type="email" name="primary_contact_email" value={formData.primary_contact_email} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn" disabled={saving} style={{ flex: 2 }}>
                                    {saving ? 'Processing...' : (editingClient ? 'Sync Changes' : 'Initialize Client')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
