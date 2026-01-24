import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminProjects() {
    const navigate = useNavigate();
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
        checkAuth();
    }, []);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
        }
        fetchData();
    }

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
            const { error } = editingProject
                ? await supabase.from('projects').update(formData).eq('id', editingProject.id)
                : await supabase.from('projects').insert([formData]);

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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) return <div className="admin-layout"><div className="admin-main-content">Loading...</div></div>;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link to="/admin" className="sidebar-link">🏠 Dashboard</Link>
                <Link to="/admin/clients" className="sidebar-link">👥 Clients & CRM</Link>
                <Link to="/admin/projects" className="sidebar-link active">🚀 Projects</Link>
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
                            <Link to="/admin">Dashboard</Link> <span>/</span> <span>Projects</span>
                        </div>
                        <h1>Project Delivery Board</h1>
                        <p>Track delivery status, health metrics, and client deliverables.</p>
                    </div>
                    <div className="admin-actions">
                        <button onClick={openNewProjectForm} className="btn">+ New Project</button>
                    </div>
                </div>

                {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Health</th>
                                <th>Progress</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.id} onClick={() => { setEditingProject(project); setFormData(project); setShowForm(true); }} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{project.project_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.project_type}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.9rem' }}>{project.client_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.client_id}</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            textTransform: 'capitalize'
                                        }}>{project.project_status.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            background: project.health_status === 'on_track' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: project.health_status === 'on_track' ? '#10b981' : '#ef4444'
                                        }}>{project.health_status.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${project.completion_percentage}%`, height: '100%', background: 'var(--accent-primary)' }} />
                                        </div>
                                        <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{project.completion_percentage}%</div>
                                    </td>
                                    <td style={{ fontWeight: '500' }}>₹{(project.project_value / 100000).toFixed(1)}L</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PROJECT FORM MODAL */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <div className="modal-header">
                                <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="application-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Project Name *</label>
                                        <input type="text" name="project_name" value={formData.project_name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Client *</label>
                                        <select name="client_id" value={formData.client_id} onChange={handleInputChange} required>
                                            <option value="">-- Select Client --</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Project Type</label>
                                        <input type="text" name="project_type" value={formData.project_type} onChange={handleInputChange} placeholder="e.g. Cloud Migraton" />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select name="project_status" value={formData.project_status} onChange={handleInputChange}>
                                            <option value="planning">Planning</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="on_hold">On Hold</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Project Value (INR)</label>
                                        <input type="number" name="project_value" value={formData.project_value} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
