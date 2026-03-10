import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LuPlus } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function AdminCompensation() {
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
        fetchPackages();
    }, []);

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
        } finally {
            setLoading(false);
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

    function formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount || 0);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <header className="admin-header">
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs">
                        <Link to="/admin">Dashboard</Link> <span>/</span> <span className="current">Compensation</span>
                    </div>
                    <h1>Salary Benchmarking</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontWeight: '500', marginTop: '0.5rem' }}>Standardize compensation and benefits across organizational roles.</p>
                </div>
                <div className="admin-actions">
                    <button onClick={openNewPackageForm} className="btn"><LuPlus /> Create Package</button>
                </div>
            </header>

            {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)', animation: 'slideDown 0.3s ease' }}>{success}</div>}
            {error && <div className="error-message" style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

            {/* Package Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', border: `1px solid var(--admin-border)` }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingPackage ? 'Update Package' : 'Design New Package'}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Define market-aligned compensation for selected role.</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="application-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Role Job Title *</label>
                                    <input type="text" name="role_title" value={formData.role_title} onChange={handleInputChange} required placeholder="e.g. Senior Software Engineer" />
                                </div>
                                <div className="form-group">
                                    <label>Organization Level *</label>
                                    <select name="role_level" value={formData.role_level} onChange={handleInputChange} required>
                                        <option value="entry">Entry (L1-L2)</option>
                                        <option value="mid">Mid-Career (L3-L4)</option>
                                        <option value="senior">Senior (L5-L6)</option>
                                        <option value="lead">Lead/Principal (L7+)</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Department / Team Code *</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} required placeholder="e.g. Engineering, Architecture" />
                                </div>
                                <div className="form-group">
                                    <label>Currency Localisation *</label>
                                    <select name="currency" value={formData.currency} onChange={handleInputChange} required>
                                        <option value="INR">INR (₹) - Indian Rupee</option>
                                        <option value="USD">USD ($) - US Dollar</option>
                                    </select>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1.25rem', fontWeight: '700' }}>CTC Range (Annual)</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Minimum Expected CTC</label>
                                    <input type="number" name="annual_ctc_min" value={formData.annual_ctc_min} onChange={handleInputChange} required placeholder="Baseline" />
                                </div>
                                <div className="form-group">
                                    <label>Maximum Ceiling CTC</label>
                                    <input type="number" name="annual_ctc_max" value={formData.annual_ctc_max} onChange={handleInputChange} required placeholder="Ceiling" />
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1.25rem', fontWeight: '700' }}>Supplementary Benefits</h3>
                            <div className="form-grid">
                                {[0, 1, 2, 3].map(index => (
                                    <div key={index} className="form-group">
                                        <input type="text" value={formData.benefits[index]} onChange={(e) => handleBenefitChange(index, e.target.value)} placeholder={`Benefit Perk ${index + 1}`} />
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Dismiss</button>
                                <button type="submit" className="btn" disabled={saving} style={{ flex: 2 }}>
                                    {saving ? 'Syncing...' : (editingPackage ? 'Update Architecture' : 'Deploy Package')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-table-container glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Role Specification</th>
                            <th>Parent Domain</th>
                            <th>Seniority Tier</th>
                            <th>Compensation Range (LPA)</th>
                            <th style={{ textAlign: 'center' }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>
                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{pkg.role_title}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>ID: CP-{pkg.id.toString().padStart(4, '0')}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.9rem' }}>{pkg.department}</div>
                                </td>
                                <td>
                                    <span style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.1em',
                                        padding: '0.3rem 0.6rem',
                                        background: 'var(--admin-accent-soft)',
                                        borderRadius: '4px',
                                        color: 'var(--admin-accent)'
                                    }}>{pkg.role_level}</span>
                                </td>
                                <td style={{ color: 'var(--admin-accent)', fontWeight: '700' }}>
                                    {formatCurrency(pkg.annual_ctc_min, pkg.currency)} - {formatCurrency(pkg.annual_ctc_max, pkg.currency)}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                        <button onClick={() => openEditPackageForm(pkg)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', fontSize: '0.85rem' }}>Modify</button>
                                        <button onClick={() => handleDelete(pkg.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}>Terminate</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
