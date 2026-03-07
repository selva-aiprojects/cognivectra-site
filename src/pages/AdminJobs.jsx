import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LuCircleCheck, LuFilePen, LuPlus, LuSparkles } from 'react-icons/lu';
import AdminLayout from '../layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const location = useLocation();

    useEffect(() => {
        fetchJobs();
        const params = new URLSearchParams(location.search);
        if (params.get('new') === '1') {
            openNewJobForm();
        }
    }, [location.search]);

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
        } finally {
            setLoading(false);
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
            responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
            requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
            nice_to_have: Array.isArray(job.nice_to_have) ? job.nice_to_have.join('\n') : (job.nice_to_have || ''),
            salary_range: job.salary_range || '',
            benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : (job.benefits || ''),
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
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            const { error } = await supabase
                .from('job_postings')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setJobs(prev => prev.filter(job => job.id !== id));
            setSuccess('Job posting deleted successfully');

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job posting');
        }
    }

    if (loading) {
        return <AdminLayout>Loading jobs...</AdminLayout>;
    }

    return (
        <AdminLayout>
            <header className="admin-header glass-panel">
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs">
                        <Link to="/admin">Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>Talent</span>
                    </div>
                    <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Job Listings</h1>
                    <p style={{ opacity: 0.7 }}>Manage open positions and career opportunities.</p>
                </div>
                {!showForm && (
                    <div className="admin-actions">
                        <button onClick={openNewJobForm} className="btn">
                            <LuSparkles /> Post Strategic Role
                        </button>
                    </div>
                )}
            </header>

            {error && <div className="success-message status-cold">{error}</div>}
            {success && <div className="success-message status-hot">{success}</div>}

            <AnimatePresence mode="wait">
                {!showForm ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="admin-table-container glass-panel"
                    >
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Strategic Role</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Job Type</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No active job profiles found.</td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>
                                                <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>ID: {job.slug}</div>
                                            </td>
                                            <td>{job.department}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{job.job_type}</span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${job.status === 'active' || job.status === 'published' ? 'status-hot' : 'status-cold'}`} style={{ fontSize: '0.7rem' }}>
                                                    {job.status === 'active' || job.status === 'published' ? <><LuCircleCheck style={{ marginRight: '4px' }} /> Recruitment Open</> : <><LuFilePen style={{ marginRight: '4px' }} /> Internal Draft</>}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                                    <button onClick={() => openEditJobForm(job)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.85rem' }}>Update</button>
                                                    <button onClick={() => handleDelete(job.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="module-card glass-panel"
                        style={{ maxWidth: '1000px', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <div className="modal-header" style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingJob ? 'Refine Role Profile' : 'Design Job Architect'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="application-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Job Designation *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Principal AI Engineer" />
                                </div>
                                <div className="form-group">
                                    <label>Public Slug (URL)</label>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="principal-ai-engineer" />
                                </div>
                                <div className="form-group">
                                    <label>Corporate Department</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} required placeholder="e.g. Research & Development" />
                                </div>
                                <div className="form-group">
                                    <label>Primary Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g. Remote (Global)" />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Engagement Model</label>
                                    <select name="job_type" value={formData.job_type} onChange={handleInputChange}>
                                        <option value="full-time">Full-time Permanent</option>
                                        <option value="part-time">Part-time Engagement</option>
                                        <option value="contract">Professional Contract</option>
                                        <option value="freelance">Freelance/Consultant</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Publication Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="draft">Save as Internal Draft</option>
                                        <option value="published">Deploy to Careers Page</option>
                                        <option value="closed">Archive Post</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label>Executive Summary</label>
                                <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows="3" placeholder="A compelling 2-sentence hook for candidates."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Core Responsibilities (One per line)</label>
                                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} rows="5" placeholder="- Lead architecture design&#10;- Manage stakeholder alignment"></textarea>
                            </div>

                            <div className="form-group">
                                <label>Technical Requirements (One per line)</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="5" placeholder="- 10+ years of distributed systems&#10;- Expert Python/Go experience"></textarea>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
                                <button type="submit" className="btn" style={{ flex: 2 }} disabled={saving}>{saving ? 'Syncing...' : (editingJob ? 'Update Deployment' : 'Launch Recruitment')}</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}