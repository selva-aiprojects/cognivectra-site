import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    function formatCurrency(amount, currency) {
        const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';
        return `${symbol}${(amount / 100000).toFixed(1)}L`;
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
                    <h1 style={{ marginBottom: '0.5rem' }}>Compensation Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage salary packages and benefits for different roles
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/admin')} className="btn-outline">
                        ← Back to Admin
                    </button>
                    <button onClick={openNewPackageForm} className="btn">
                        + New Package
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

            {/* Package Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2>{editingPackage ? 'Edit Compensation Package' : 'New Compensation Package'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="application-form">
                            {/* Basic Information */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Role Title *</label>
                                    <input
                                        type="text"
                                        name="role_title"
                                        value={formData.role_title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Senior DevOps Engineer"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role Level *</label>
                                    <select
                                        name="role_level"
                                        value={formData.role_level}
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
                                    <label>Currency *</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Compensation Range */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Compensation Range</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Minimum Annual CTC *</label>
                                    <input
                                        type="number"
                                        name="annual_ctc_min"
                                        value={formData.annual_ctc_min}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., 1200000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Maximum Annual CTC *</label>
                                    <input
                                        type="number"
                                        name="annual_ctc_max"
                                        value={formData.annual_ctc_max}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., 1800000"
                                    />
                                </div>
                            </div>

                            {/* Salary Breakdown */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Salary Breakdown (% of CTC)</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Basic Salary %</label>
                                    <input
                                        type="number"
                                        name="basic_salary_percentage"
                                        value={formData.basic_salary_percentage}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        placeholder="50"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>HRA %</label>
                                    <input
                                        type="number"
                                        name="hra_percentage"
                                        value={formData.hra_percentage}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        placeholder="20"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Special Allowance %</label>
                                    <input
                                        type="number"
                                        name="special_allowance_percentage"
                                        value={formData.special_allowance_percentage}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        placeholder="20"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Performance Bonus %</label>
                                    <input
                                        type="number"
                                        name="performance_bonus_percentage"
                                        value={formData.performance_bonus_percentage}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            {/* Benefits */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Benefits (up to 5)</h3>
                            {[0, 1, 2, 3, 4].map(index => (
                                <div key={index} className="form-group">
                                    <label>Benefit {index + 1}</label>
                                    <input
                                        type="text"
                                        value={formData.benefits[index] || ''}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                        placeholder={`e.g., ${['Health insurance', 'Remote work', 'Learning budget', 'Latest equipment', 'Flexible hours'][index]}`}
                                    />
                                </div>
                            ))}

                            {/* Leave Policy */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Leave Policy</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Annual Leave Days</label>
                                    <input
                                        type="number"
                                        name="annual_leave_days"
                                        value={formData.annual_leave_days}
                                        onChange={handleInputChange}
                                        placeholder="21"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Sick Leave Days</label>
                                    <input
                                        type="number"
                                        name="sick_leave_days"
                                        value={formData.sick_leave_days}
                                        onChange={handleInputChange}
                                        placeholder="12"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Casual Leave Days</label>
                                    <input
                                        type="number"
                                        name="casual_leave_days"
                                        value={formData.casual_leave_days}
                                        onChange={handleInputChange}
                                        placeholder="7"
                                    />
                                </div>
                            </div>

                            {/* Working Conditions */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Working Conditions</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Working Hours/Week</label>
                                    <input
                                        type="number"
                                        name="working_hours_per_week"
                                        value={formData.working_hours_per_week}
                                        onChange={handleInputChange}
                                        placeholder="40"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Work Location</label>
                                    <input
                                        type="text"
                                        name="work_location"
                                        value={formData.work_location}
                                        onChange={handleInputChange}
                                        placeholder="Remote, Office, Hybrid"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Work Schedule</label>
                                <input
                                    type="text"
                                    name="work_schedule"
                                    value={formData.work_schedule}
                                    onChange={handleInputChange}
                                    placeholder="Monday to Friday, flexible hours"
                                />
                            </div>

                            {/* Employment Terms */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Employment Terms</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Probation Period (months)</label>
                                    <input
                                        type="number"
                                        name="probation_period_months"
                                        value={formData.probation_period_months}
                                        onChange={handleInputChange}
                                        placeholder="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Notice Period (days)</label>
                                    <input
                                        type="number"
                                        name="notice_period_days"
                                        value={formData.notice_period_days}
                                        onChange={handleInputChange}
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            {/* Status and Notes */}
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                    />
                                    Active Package
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Notes (optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Internal notes about this compensation package..."
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={saving}>
                                    {saving ? 'Saving...' : (editingPackage ? 'Update Package' : 'Create Package')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Packages List */}
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>All Compensation Packages ({packages.length})</h3>

                {packages.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            No compensation packages yet. Create your first one!
                        </p>
                        <button onClick={openNewPackageForm} className="btn">
                            + Create Package
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {packages.map(pkg => (
                            <div
                                key={pkg.id}
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
                                        <h4 style={{ margin: 0 }}>{pkg.role_title}</h4>
                                        <span style={{
                                            background: pkg.is_active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                                            color: pkg.is_active ? '#86efac' : '#9ca3af',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {pkg.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {pkg.department} • {pkg.role_level} level
                                    </p>
                                    <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        💰 {formatCurrency(pkg.annual_ctc_min, pkg.currency)} - {formatCurrency(pkg.annual_ctc_max, pkg.currency)} per annum
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        📍 {pkg.work_location} • 🏖️ {pkg.annual_leave_days} days leave • ⏰ {pkg.working_hours_per_week}h/week
                                    </p>
                                    {pkg.benefits && pkg.benefits.length > 0 && (
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                <strong>Benefits:</strong>
                                            </p>
                                            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.5rem' }}>
                                                {pkg.benefits.slice(0, 3).map((benefit, idx) => (
                                                    <li key={idx}>{benefit}</li>
                                                ))}
                                                {pkg.benefits.length > 3 && (
                                                    <li>+{pkg.benefits.length - 3} more...</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => openEditPackageForm(pkg)}
                                        className="btn-outline"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
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
