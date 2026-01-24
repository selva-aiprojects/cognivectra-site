import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    if (loading) {
        return (
            <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Loading...</h2>
            </main>
        );
    }

    return (
        <main style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Job Postings Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Create and manage job listings for the careers page
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/admin')} className="btn-outline">
                        ← Back to Admin
                    </button>
                    <button onClick={openNewJobForm} className="btn">
                        + New Job Posting
                    </button>
                    <button onClick={handleSignOut} className="btn-outline">
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#86efac',
                    padding: '1rem',
                    borderRadius: '10px',
                    marginBottom: '2rem'
                }}>
                    {success}
                </div>
            )}

            {error && (
                <div className="error-message" style={{ marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            {/* Job Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                        <div className="modal-header">
                            <h2>{editingJob ? 'Edit Job Posting' : 'New Job Posting'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="application-form">
                            {/* Basic Information */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Senior DevOps Engineer"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Slug (URL) *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="auto-generated from title"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Department *</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Engineering, Sales, Marketing"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Remote, New York, Hybrid"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Job Type *</label>
                                    <select
                                        name="job_type"
                                        value={formData.job_type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Experience Level *</label>
                                    <select
                                        name="experience_level"
                                        value={formData.experience_level}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="entry">Entry Level</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior</option>
                                        <option value="lead">Lead</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="form-group">
                                <label>Summary * (Brief description for job card)</label>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="A brief 1-2 sentence summary of the role..."
                                />
                            </div>

                            {/* Full Description */}
                            <div className="form-group">
                                <label>Full Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    placeholder="Detailed description of the role, team, and what the candidate will be doing..."
                                />
                            </div>

                            {/* Responsibilities */}
                            <div className="form-group">
                                <label>Responsibilities * (one per line)</label>
                                <textarea
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    placeholder="Design and implement CI/CD pipelines&#10;Manage cloud infrastructure&#10;Collaborate with development teams"
                                />
                            </div>

                            {/* Requirements */}
                            <div className="form-group">
                                <label>Requirements * (one per line)</label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    placeholder="5+ years of DevOps experience&#10;Strong AWS/GCP knowledge&#10;Experience with Docker and Kubernetes"
                                />
                            </div>

                            {/* Nice to Have */}
                            <div className="form-group">
                                <label>Nice to Have (one per line, optional)</label>
                                <textarea
                                    name="nice_to_have"
                                    value={formData.nice_to_have}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Kubernetes certification&#10;Terraform expertise&#10;Experience with monitoring tools"
                                />
                            </div>

                            {/* Compensation & Benefits */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Salary Range (optional)</label>
                                    <input
                                        type="text"
                                        name="salary_range"
                                        value={formData.salary_range}
                                        onChange={handleInputChange}
                                        placeholder="e.g., $120k - $160k"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="form-group">
                                <label>Benefits (one per line, optional)</label>
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Remote work&#10;Health insurance&#10;401(k) matching&#10;Flexible hours"
                                />
                            </div>

                            {/* SEO */}
                            <div className="form-group">
                                <label>Meta Description (for SEO, optional)</label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="SEO-friendly description for search engines..."
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={saving}>
                                    {saving ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Jobs List */}
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>All Job Postings ({jobs.length})</h3>

                {jobs.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            No job postings yet. Create your first one!
                        </p>
                        <button onClick={openNewJobForm} className="btn">
                            + Create Job Posting
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {jobs.map(job => (
                            <div
                                key={job.id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '1rem',
                                    alignItems: 'start'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{job.title}</h4>
                                        <span style={{
                                            background: job.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                            color: job.status === 'active' ? '#86efac' : 'var(--accent-primary)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {job.department} • {job.location} • {job.job_type}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {job.summary}
                                    </p>
                                    {job.salary_range && (
                                        <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                            💰 {job.salary_range}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        Applications: {job.applications_count || 0} •
                                        Created: {new Date(job.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => openEditJobForm(job)}
                                        className="btn-outline"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    >
                                        Edit
                                    </button>
                                    {job.status !== 'active' && (
                                        <button
                                            onClick={() => handleStatusChange(job.id, 'active')}
                                            className="btn"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                        >
                                            Activate
                                        </button>
                                    )}
                                    {job.status === 'active' && (
                                        <button
                                            onClick={() => handleStatusChange(job.id, 'paused')}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                        >
                                            Pause
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#fca5a5',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
