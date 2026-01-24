import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminJobs() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        department: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        summary: '',
        description: '',
        responsibilities: '',
        requirements: '',
        nice_to_have: '',
        salary_range: '',
        benefits: '',
        status: 'draft',
        meta_description: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [user]);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
        }
        setUser(session.user);
        setLoading(false);
    }

    async function fetchJobs() {
        try {
            const { data, error } = await supabase
                .from('job_postings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to load job postings');
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === 'title') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }

    function openNewJobForm() {
        setEditingJob(null);
        setFormData({
            title: '',
            slug: '',
            department: '',
            location: '',
            job_type: 'full-time',
            experience_level: 'mid',
            summary: '',
            description: '',
            responsibilities: '',
            requirements: '',
            nice_to_have: '',
            salary_range: '',
            benefits: '',
            status: 'draft',
            meta_description: ''
        });
        setShowForm(true);
        setError('');
        setSuccess('');
    }

    function openEditJobForm(job) {
        setEditingJob(job);
        setFormData({
            title: job.title || '',
            slug: job.slug || '',
            department: job.department || '',
            location: job.location || '',
            job_type: job.job_type || 'full-time',
            experience_level: job.experience_level || 'mid',
            summary: job.summary || '',
            description: job.description || '',
            responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
            requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
            nice_to_have: Array.isArray(job.nice_to_have) ? job.nice_to_have.join('\n') : '',
            salary_range: job.salary_range || '',
            benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
            status: job.status || 'draft',
            meta_description: job.meta_description || ''
        });
        setShowForm(true);
        setError('');
        setSuccess('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Convert text areas to arrays
            const responsibilities = formData.responsibilities
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const requirements = formData.requirements
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const nice_to_have = formData.nice_to_have
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const benefits = formData.benefits
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const jobData = {
                title: formData.title,
                slug: formData.slug,
                department: formData.department,
                location: formData.location,
                job_type: formData.job_type,
                experience_level: formData.experience_level,
                summary: formData.summary,
                description: formData.description,
                responsibilities,
                requirements,
                nice_to_have: nice_to_have.length > 0 ? nice_to_have : null,
                salary_range: formData.salary_range || null,
                benefits: benefits.length > 0 ? benefits : null,
                status: formData.status,
                meta_description: formData.meta_description || null,
                updated_at: new Date().toISOString()
            };

            if (editingJob) {
                // Update existing job
                const { error } = await supabase
                    .from('job_postings')
                    .update(jobData)
                    .eq('id', editingJob.id);

                if (error) throw error;
                setSuccess('Job posting updated successfully!');
            } else {
                // Create new job
                const { error } = await supabase
                    .from('job_postings')
                    .insert([jobData]);

                if (error) throw error;
                setSuccess('Job posting created successfully!');
            }

            // Refresh jobs list
            await fetchJobs();

            // Close form after 2 seconds
            setTimeout(() => {
                setShowForm(false);
                setSuccess('');
            }, 2000);

        } catch (error) {
            console.error('Error saving job:', error);
            setError(error.message || 'Failed to save job posting');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(jobId) {
        if (!confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('job_postings')
                .delete()
                .eq('id', jobId);

            if (error) throw error;

            setSuccess('Job posting deleted successfully!');
            await fetchJobs();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job posting');
        }
    }

    async function handleStatusChange(jobId, newStatus) {
        try {
            const { error } = await supabase
                .from('job_postings')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', jobId);

            if (error) throw error;

            await fetchJobs();
            setSuccess(`Job status updated to ${newStatus}!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update job status');
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
                <Link to="/admin/projects" className="sidebar-link">🚀 Projects</Link>
                <Link to="/admin/jobs" className="sidebar-link active">💼 Careers & Jobs</Link>
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
                            <Link to="/admin">Dashboard</Link> <span>/</span> <span>Careers</span>
                        </div>
                        <h1>Job Management</h1>
                        <p>Create and manage job listings for the careers page.</p>
                    </div>
                    <div className="admin-actions">
                        <button onClick={openNewJobForm} className="btn">+ New Job Posting</button>
                    </div>
                </div>

                {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}
                {error && <div className="error-message" style={{ marginBottom: '2rem' }}>{error}</div>}

                {/* Job Form Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                            <div className="modal-header">
                                <h2>{editingJob ? 'Edit Job Posting' : 'New Job Posting'}</h2>
                                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="application-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Job Title *</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Slug (URL) *</label>
                                        <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Department *</label>
                                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Job Type *</label>
                                        <select name="job_type" value={formData.job_type} onChange={handleInputChange} required>
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Experience Level *</label>
                                        <select name="experience_level" value={formData.experience_level} onChange={handleInputChange} required>
                                            <option value="entry">Entry Level</option>
                                            <option value="mid">Mid Level</option>
                                            <option value="senior">Senior</option>
                                            <option value="lead">Lead</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Summary * (Brief description for job card)</label>
                                    <textarea name="summary" value={formData.summary} onChange={handleInputChange} required rows="2" />
                                </div>
                                <div className="form-group">
                                    <label>Responsibilities * (one per line)</label>
                                    <textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} required rows="4" />
                                </div>
                                <div className="form-group">
                                    <label>Requirements * (one per line)</label>
                                    <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} required rows="4" />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Salary Range (optional)</label>
                                        <input type="text" name="salary_range" value={formData.salary_range} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Status *</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} required>
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="paused">Paused</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Job'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Applications</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td style={{ fontWeight: '600' }}>{job.title}</td>
                                    <td>{job.department}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            background: job.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: job.status === 'active' ? '#10b981' : '#9ca3af'
                                        }}>{job.status}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{job.applications_count || 0}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditJobForm(job)} className="sidebar-link" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)' }}>Edit</button>
                                            <button onClick={() => handleDelete(job.id)} className="sidebar-link" style={{ padding: '0.4rem', color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
