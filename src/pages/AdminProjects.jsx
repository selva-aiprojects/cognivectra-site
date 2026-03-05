import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminProjects() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        project_name: '',
        client_id: '',
        project_type: '',
        description: '',
        start_date: '',
        estimated_end_date: '',
        project_status: 'planning',
        health_status: 'on_track',
        completion_percentage: 0,
        project_value: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [projRes, clientRes] = await Promise.all([
                supabase.from('project_summary').select('*'),
                supabase.from('clients').select('id, company_name').eq('is_active', true)
            ]);

            if (projRes.error) throw projRes.error;
            if (clientRes.error) throw clientRes.error;

            setProjects(projRes.data || []);
            setClients(clientRes.data || []);
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError('Failed to load project database');
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function openNewProjectForm() {
        setEditingProject(null);
        setFormData({
            project_name: '',
            client_id: '',
            project_type: 'DevOps Setup',
            description: '',
            start_date: new Date().toISOString().split('T')[0],
            estimated_end_date: '',
            project_status: 'planning',
            health_status: 'on_track',
            completion_percentage: 0,
            project_value: '',
            priority: 'medium'
        });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Clean the payload to include only fields that belong in the 'projects' table
            const payload = {
                project_name: formData.project_name,
                client_id: formData.client_id,
                project_type: formData.project_type,
                description: formData.description,
                start_date: formData.start_date || null,
                estimated_end_date: formData.estimated_end_date || null,
                project_status: formData.project_status,
                health_status: formData.health_status,
                completion_percentage: parseInt(formData.completion_percentage) || 0,
                project_value: formData.project_value ? parseFloat(formData.project_value) : null,
                priority: formData.priority || 'medium'
            };

            const { error } = editingProject
                ? await supabase.from('projects').update(payload).eq('id', editingProject.id)
                : await supabase.from('projects').insert([payload]);

            if (error) throw error;

            setSuccess(editingProject ? 'Project updated!' : 'Project created!');
            fetchData();
            setTimeout(() => {
                setShowForm(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            console.error('Error saving project:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <AdminLayout>Loading projects...</AdminLayout>;

    return (
        <AdminLayout>
            <header className="admin-header glass-panel">
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs">
                        <Link to="/admin">Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>Projects</span>
                    </div>
                    <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Delivery Board</h1>
                    <p style={{ opacity: 0.7 }}>Track execution, health metrics, and client deliverables.</p>
                </div>
                <div className="admin-actions">
                    <button onClick={openNewProjectForm} className="btn" style={{ padding: '0.6rem 1.5rem' }}>+ New Project</button>
                </div>
            </header>

            {success && <div className="success-message status-hot">{success}</div>}

            <div className="admin-table-container glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Project Details</th>
                            <th>Parent Client</th>
                            <th>Current Status</th>
                            <th>Delivery Health</th>
                            <th>Execution Progress</th>
                            <th>Contract Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id} onClick={() => { setEditingProject(project); setFormData(project); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                                <td>
                                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{project.project_name}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>{project.project_type}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{project.client_name}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{project.client_code}</div>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>{project.project_status.replace('_', ' ')}</span>
                                </td>
                                <td>
                                    <span className={`status-pill ${project.health_status === 'on_track' ? 'status-hot' : 'status-cold'}`}>
                                        {project.health_status === 'on_track' ? '🟢 ON TRACK' : '🔴 DELAYED'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', minWidth: '80px' }}>
                                            <div style={{ width: `${project.completion_percentage}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-light))' }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.8 }}>{project.completion_percentage}%</span>
                                    </div>
                                </td>
                                <td style={{ fontWeight: '700', color: 'var(--accent-light)' }}>
                                    ₹{(project.project_value / 100000).toFixed(1)}L
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PROJECT FORM MODAL */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingProject ? 'Modify Project' : 'Initialize New Project'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="application-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Project Name *</label>
                                    <input type="text" name="project_name" value={formData.project_name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Client Partner *</label>
                                    <select name="client_id" value={formData.client_id} onChange={handleInputChange} required>
                                        <option value="">-- Link to Client --</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Worksteam Type</label>
                                    <input type="text" name="project_type" value={formData.project_type} onChange={handleInputChange} placeholder="e.g. Cloud Migraton" />
                                </div>
                                <div className="form-group">
                                    <label>Lifecycle Status</label>
                                    <select name="project_status" value={formData.project_status} onChange={handleInputChange}>
                                        <option value="planning">Initial Planning</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="completed">Delivery Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Project Kick-off</label>
                                    <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Contract Value (INR)</label>
                                    <input type="number" name="project_value" value={formData.project_value} onChange={handleInputChange} placeholder="Total Budget" />
                                </div>
                            </div>
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
                                <button type="submit" className="btn" disabled={saving} style={{ flex: 2 }}>
                                    {saving ? 'Syncing...' : (editingProject ? 'Submit Updates' : 'Launch Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
