import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminCompensation() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        role_title: '',
        role_level: 'mid',
        department: '',
        currency: 'INR',
        annual_ctc_min: '',
        annual_ctc_max: '',
        basic_salary_percentage: '50',
        hra_percentage: '20',
        special_allowance_percentage: '20',
        performance_bonus_percentage: '10',
        benefits: ['', '', '', '', ''],
        annual_leave_days: '21',
        sick_leave_days: '12',
        casual_leave_days: '7',
        working_hours_per_week: '40',
        work_schedule: 'Monday to Friday, flexible hours',
        work_location: 'Remote',
        probation_period_months: '3',
        notice_period_days: '60',
        is_active: true,
        notes: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchPackages();
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

    async function fetchPackages() {
        try {
            const { data, error } = await supabase
                .from('compensation_packages')
                .select('*')
                .order('role_level', { ascending: true })
                .order('annual_ctc_min', { ascending: false });

            if (error) throw error;
            setPackages(data || []);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setError('Failed to load compensation packages');
        }
    }

    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleBenefitChange(index, value) {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    }

    function openNewPackageForm() {
        setEditingPackage(null);
        setFormData({
            role_title: '',
            role_level: 'mid',
            department: '',
            currency: 'INR',
            annual_ctc_min: '',
            annual_ctc_max: '',
            basic_salary_percentage: '50',
            hra_percentage: '20',
            special_allowance_percentage: '20',
            performance_bonus_percentage: '10',
            benefits: ['', '', '', '', ''],
            annual_leave_days: '21',
            sick_leave_days: '12',
            casual_leave_days: '7',
            working_hours_per_week: '40',
            work_schedule: 'Monday to Friday, flexible hours',
            work_location: 'Remote',
            probation_period_months: '3',
            notice_period_days: '60',
            is_active: true,
            notes: ''
        });
        setShowForm(true);
        setError('');
        setSuccess('');
    }

    function openEditPackageForm(pkg) {
        setEditingPackage(pkg);
        const benefits = Array.isArray(pkg.benefits) ? pkg.benefits : [];
        while (benefits.length < 5) benefits.push('');

        setFormData({
            role_title: pkg.role_title || '',
            role_level: pkg.role_level || 'mid',
            department: pkg.department || '',
            currency: pkg.currency || 'INR',
            annual_ctc_min: pkg.annual_ctc_min || '',
            annual_ctc_max: pkg.annual_ctc_max || '',
            basic_salary_percentage: pkg.basic_salary_percentage || '50',
            hra_percentage: pkg.hra_percentage || '20',
            special_allowance_percentage: pkg.special_allowance_percentage || '20',
            performance_bonus_percentage: pkg.performance_bonus_percentage || '10',
            benefits: benefits,
            annual_leave_days: pkg.annual_leave_days || '21',
            sick_leave_days: pkg.sick_leave_days || '12',
            casual_leave_days: pkg.casual_leave_days || '7',
            working_hours_per_week: pkg.working_hours_per_week || '40',
            work_schedule: pkg.work_schedule || 'Monday to Friday, flexible hours',
            work_location: pkg.work_location || 'Remote',
            probation_period_months: pkg.probation_period_months || '3',
            notice_period_days: pkg.notice_period_days || '60',
            is_active: pkg.is_active !== false,
            notes: pkg.notes || ''
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
            const benefits = formData.benefits.filter(b => b.trim().length > 0);

            const packageData = {
                role_title: formData.role_title,
                role_level: formData.role_level,
                department: formData.department,
                currency: formData.currency,
                annual_ctc_min: parseFloat(formData.annual_ctc_min),
                annual_ctc_max: parseFloat(formData.annual_ctc_max),
                basic_salary_percentage: parseFloat(formData.basic_salary_percentage),
                hra_percentage: parseFloat(formData.hra_percentage),
                special_allowance_percentage: parseFloat(formData.special_allowance_percentage),
                performance_bonus_percentage: parseFloat(formData.performance_bonus_percentage),
                benefits: benefits,
                annual_leave_days: parseInt(formData.annual_leave_days),
                sick_leave_days: parseInt(formData.sick_leave_days),
                casual_leave_days: parseInt(formData.casual_leave_days),
                working_hours_per_week: parseInt(formData.working_hours_per_week),
                work_schedule: formData.work_schedule,
                work_location: formData.work_location,
                probation_period_months: parseInt(formData.probation_period_months),
                notice_period_days: parseInt(formData.notice_period_days),
                is_active: formData.is_active,
                notes: formData.notes || null,
                updated_at: new Date().toISOString()
            };

            if (editingPackage) {
                const { error } = await supabase
                    .from('compensation_packages')
                    .update(packageData)
                    .eq('id', editingPackage.id);

                if (error) throw error;
                setSuccess('Compensation package updated successfully!');
            } else {
                const { error } = await supabase
                    .from('compensation_packages')
                    .insert([packageData]);

                if (error) throw error;
                setSuccess('Compensation package created successfully!');
            }

            await fetchPackages();
            setTimeout(() => {
                setShowForm(false);
                setSuccess('');
            }, 2000);

        } catch (error) {
            console.error('Error saving package:', error);
            setError(error.message || 'Failed to save compensation package');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(pkgId) {
        if (!confirm('Are you sure you want to delete this compensation package?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('compensation_packages')
                .delete()
                .eq('id', pkgId);

            if (error) throw error;

            setSuccess('Compensation package deleted successfully!');
            await fetchPackages();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting package:', error);
            setError('Failed to delete compensation package');
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) return <div className="admin-layout"><div className="admin-main-content">Loading...</div></div>;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link to="/admin" className="sidebar-link">🏠 Dashboard</Link>
                <Link to="/admin/clients" className="sidebar-link">👥 Clients & CRM</Link>
                <Link to="/admin/projects" className="sidebar-link">🚀 Projects</Link>
                <Link to="/admin/jobs" className="sidebar-link">💼 Careers & Jobs</Link>
                <Link to="/admin/compensation" className="sidebar-link active">💰 Compensation</Link>
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
                            <Link to="/admin">Dashboard</Link> <span>/</span> <span>Compensation</span>
                        </div>
                        <h1>Salary Packages</h1>
                        <p>Standardize compensation and benefits for roles.</p>
                    </div>
                    <div className="admin-actions">
                        <button onClick={openNewPackageForm} className="btn">+ New Package</button>
                    </div>
                </div>

                {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}
                {error && <div className="error-message" style={{ marginBottom: '2rem' }}>{error}</div>}

                {/* Package Form Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                            <div className="modal-header">
                                <h2>{editingPackage ? 'Edit Package' : 'New Package'}</h2>
                                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="application-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Role Title *</label>
                                        <input type="text" name="role_title" value={formData.role_title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Role Level *</label>
                                        <select name="role_level" value={formData.role_level} onChange={handleInputChange} required>
                                            <option value="entry">Entry</option>
                                            <option value="mid">Mid</option>
                                            <option value="senior">Senior</option>
                                            <option value="lead">Lead</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Department *</label>
                                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Currency *</label>
                                        <select name="currency" value={formData.currency} onChange={handleInputChange} required>
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Min Annual CTC</label>
                                        <input type="number" name="annual_ctc_min" value={formData.annual_ctc_min} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Annual CTC</label>
                                        <input type="number" name="annual_ctc_max" value={formData.annual_ctc_max} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <h3>Benefits</h3>
                                <div className="form-grid">
                                    {[0, 1, 2, 3].map(index => (
                                        <div key={index} className="form-group">
                                            <input type="text" value={formData.benefits[index]} onChange={(e) => handleBenefitChange(index, e.target.value)} placeholder={`Benefit ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Package'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Level</th>
                                <th>Salary Range (Annual)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(pkg => (
                                <tr key={pkg.id}>
                                    <td style={{ fontWeight: '600' }}>{pkg.role_title}</td>
                                    <td>{pkg.department}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{pkg.role_level}</td>
                                    <td style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>
                                        {formatCurrency(pkg.annual_ctc_min, pkg.currency)} - {formatCurrency(pkg.annual_ctc_max, pkg.currency)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditPackageForm(pkg)} className="sidebar-link" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)' }}>Edit</button>
                                            <button onClick={() => handleDelete(pkg.id)} className="sidebar-link" style={{ padding: '0.4rem', color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}>Delete</button>
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
