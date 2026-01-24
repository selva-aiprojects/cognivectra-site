import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminOffers() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [compensationPackages, setCompensationPackages] = useState([]);
    const [showGenerator, setShowGenerator] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewHTML, setPreviewHTML] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const [offerData, setOfferData] = useState({
        // Candidate
        candidateName: '',
        candidateEmail: '',
        candidateAddressLine1: '',
        candidateAddressLine2: '',
        candidateCity: '',
        candidateState: '',
        candidatePincode: '',

        // Job
        jobTitle: '',
        department: '',
        reportingManager: 'Selvakumar B, Principal Architect',
        workLocation: 'Remote',
        jobResponsibilities: '',

        // Employment
        startDate: '',
        employmentType: 'full-time permanent',
        probationPeriod: 'You will be on probation for the first 3 months of employment.',

        // Compensation
        compensationPackageId: '',
        annualCtc: '',
        basicSalary: '',
        hra: '',
        specialAllowance: '',
        performanceBonus: '',
        otherBenefits: '',

        // Benefits
        benefits: ['', '', '', '', ''],

        // Working
        workingHours: '40',
        workSchedule: 'Monday to Friday, flexible hours',
        annualLeave: '21',
        sickLeave: '12',
        casualLeave: '7',

        // Terms
        noticePeriod: '60',
        additionalCondition: 'Right to work in India',
        acceptanceDeadline: '',

        // Signatory
        signatoryName: 'Selvakumar B',
        signatoryTitle: 'Principal Architect & Founder'
    });

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchOffers();
            fetchApplications();
            fetchCompensationPackages();
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

    async function fetchOffers() {
        try {
            const { data, error } = await supabase
                .from('offer_letters')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOffers(data || []);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    }

    async function fetchApplications() {
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .in('status', ['shortlisted', 'interviewed'])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }

    async function fetchCompensationPackages() {
        try {
            const { data, error } = await supabase
                .from('compensation_packages')
                .select('*')
                .eq('is_active', true)
                .order('role_title');

            if (error) throw error;
            setCompensationPackages(data || []);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setOfferData(prev => ({ ...prev, [name]: value }));
    }

    function handleBenefitChange(index, value) {
        const newBenefits = [...offerData.benefits];
        newBenefits[index] = value;
        setOfferData(prev => ({ ...prev, benefits: newBenefits }));
    }

    function selectApplication(app) {
        setSelectedApplication(app);
        setOfferData(prev => ({
            ...prev,
            candidateName: app.full_name,
            candidateEmail: app.email,
            jobTitle: app.position,
            jobResponsibilities: `performing duties related to ${app.position}`,
            startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            acceptanceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
    }

    function selectCompensationPackage(pkgId) {
        const pkg = compensationPackages.find(p => p.id === parseInt(pkgId));
        if (!pkg) return;

        const midCtc = (pkg.annual_ctc_min + pkg.annual_ctc_max) / 2;
        const basic = midCtc * (pkg.basic_salary_percentage / 100);
        const hra = midCtc * (pkg.hra_percentage / 100);
        const special = midCtc * (pkg.special_allowance_percentage / 100);
        const bonus = midCtc * (pkg.performance_bonus_percentage / 100);

        const formatAmount = (amount) => {
            return pkg.currency === 'INR'
                ? `₹${amount.toLocaleString('en-IN')}`
                : `$${amount.toLocaleString('en-US')}`;
        };

        const benefits = Array.isArray(pkg.benefits) ? pkg.benefits : [];
        while (benefits.length < 5) benefits.push('');

        setOfferData(prev => ({
            ...prev,
            compensationPackageId: pkgId,
            jobTitle: pkg.role_title,
            department: pkg.department,
            annualCtc: `${formatAmount(midCtc)} per annum`,
            basicSalary: formatAmount(basic),
            hra: formatAmount(hra),
            specialAllowance: formatAmount(special),
            performanceBonus: `Up to ${pkg.performance_bonus_percentage}% of annual CTC`,
            otherBenefits: '',
            benefits: benefits,
            workingHours: pkg.working_hours_per_week.toString(),
            workSchedule: pkg.work_schedule,
            workLocation: pkg.work_location,
            annualLeave: pkg.annual_leave_days.toString(),
            sickLeave: pkg.sick_leave_days.toString(),
            casualLeave: pkg.casual_leave_days.toString(),
            noticePeriod: pkg.notice_period_days.toString(),
            probationPeriod: `You will be on probation for the first ${pkg.probation_period_months} months of employment.`
        }));
    }

    async function generatePreview() {
        try {
            const response = await fetch('/email-templates/offer-letter.html');
            let template = await response.text();

            // Replace all variables
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

            template = template
                .replace(/{{OFFER_DATE}}/g, today)
                .replace(/{{OFFER_REFERENCE}}/g, 'COGNI/2026/XXX')
                .replace(/{{CANDIDATE_NAME}}/g, offerData.candidateName)
                .replace(/{{CANDIDATE_ADDRESS_LINE1}}/g, offerData.candidateAddressLine1 || '[Address Line 1]')
                .replace(/{{CANDIDATE_ADDRESS_LINE2}}/g, offerData.candidateAddressLine2 || '[Address Line 2]')
                .replace(/{{CANDIDATE_CITY}}/g, offerData.candidateCity || '[City]')
                .replace(/{{CANDIDATE_STATE}}/g, offerData.candidateState || '[State]')
                .replace(/{{CANDIDATE_PINCODE}}/g, offerData.candidatePincode || '[Pincode]')
                .replace(/{{JOB_TITLE}}/g, offerData.jobTitle)
                .replace(/{{DEPARTMENT}}/g, offerData.department)
                .replace(/{{REPORTING_MANAGER}}/g, offerData.reportingManager)
                .replace(/{{WORK_LOCATION}}/g, offerData.workLocation)
                .replace(/{{JOB_RESPONSIBILITIES}}/g, offerData.jobResponsibilities)
                .replace(/{{START_DATE}}/g, new Date(offerData.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }))
                .replace(/{{EMPLOYMENT_TYPE}}/g, offerData.employmentType)
                .replace(/{{PROBATION_PERIOD}}/g, offerData.probationPeriod)
                .replace(/{{ANNUAL_CTC}}/g, offerData.annualCtc)
                .replace(/{{BASIC_SALARY}}/g, offerData.basicSalary)
                .replace(/{{HRA}}/g, offerData.hra)
                .replace(/{{SPECIAL_ALLOWANCE}}/g, offerData.specialAllowance)
                .replace(/{{PERFORMANCE_BONUS}}/g, offerData.performanceBonus)
                .replace(/{{OTHER_BENEFITS}}/g, offerData.otherBenefits || 'As per company policy')
                .replace(/{{BENEFIT_1}}/g, offerData.benefits[0] || 'N/A')
                .replace(/{{BENEFIT_2}}/g, offerData.benefits[1] || 'N/A')
                .replace(/{{BENEFIT_3}}/g, offerData.benefits[2] || 'N/A')
                .replace(/{{BENEFIT_4}}/g, offerData.benefits[3] || 'N/A')
                .replace(/{{BENEFIT_5}}/g, offerData.benefits[4] || 'N/A')
                .replace(/{{WORKING_HOURS}}/g, offerData.workingHours)
                .replace(/{{WORK_SCHEDULE}}/g, offerData.workSchedule)
                .replace(/{{ANNUAL_LEAVE}}/g, offerData.annualLeave)
                .replace(/{{SICK_LEAVE}}/g, offerData.sickLeave)
                .replace(/{{CASUAL_LEAVE}}/g, offerData.casualLeave)
                .replace(/{{NOTICE_PERIOD}}/g, offerData.noticePeriod)
                .replace(/{{ADDITIONAL_CONDITION}}/g, offerData.additionalCondition)
                .replace(/{{ACCEPTANCE_DEADLINE}}/g, new Date(offerData.acceptanceDeadline).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }))
                .replace(/{{SIGNATORY_NAME}}/g, offerData.signatoryName)
                .replace(/{{SIGNATORY_TITLE}}/g, offerData.signatoryTitle);

            setPreviewHTML(template);
            setShowPreview(true);
        } catch (error) {
            console.error('Error generating preview:', error);
            setError('Failed to generate preview');
        }
    }

    async function saveOffer() {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const benefits = offerData.benefits.filter(b => b.trim().length > 0);

            const offerLetterData = {
                candidate_name: offerData.candidateName,
                candidate_email: offerData.candidateEmail,
                candidate_address: {
                    line1: offerData.candidateAddressLine1,
                    line2: offerData.candidateAddressLine2,
                    city: offerData.candidateCity,
                    state: offerData.candidateState,
                    pincode: offerData.candidatePincode
                },
                job_title: offerData.jobTitle,
                department: offerData.department,
                reporting_manager: offerData.reportingManager,
                work_location: offerData.workLocation,
                job_responsibilities: offerData.jobResponsibilities,
                start_date: offerData.startDate,
                employment_type: offerData.employmentType,
                probation_period: offerData.probationPeriod,
                annual_ctc: offerData.annualCtc,
                basic_salary: offerData.basicSalary,
                hra: offerData.hra,
                special_allowance: offerData.specialAllowance,
                performance_bonus: offerData.performanceBonus,
                other_benefits: offerData.otherBenefits,
                benefits: benefits,
                working_hours: offerData.workingHours,
                work_schedule: offerData.workSchedule,
                annual_leave_days: offerData.annualLeave,
                sick_leave_days: offerData.sickLeave,
                casual_leave_days: offerData.casualLeave,
                notice_period_days: offerData.noticePeriod,
                additional_conditions: offerData.additionalCondition,
                acceptance_deadline: offerData.acceptanceDeadline,
                signatory_name: offerData.signatoryName,
                signatory_title: offerData.signatoryTitle,
                offer_status: 'draft',
                offer_letter_html: previewHTML,
                job_application_id: selectedApplication?.id || null,
                compensation_package_id: offerData.compensationPackageId ? parseInt(offerData.compensationPackageId) : null
            };

            const { error } = await supabase
                .from('offer_letters')
                .insert([offerLetterData]);

            if (error) throw error;

            setSuccess('Offer letter saved successfully!');
            await fetchOffers();

            setTimeout(() => {
                setShowGenerator(false);
                setShowPreview(false);
                setSuccess('');
            }, 2000);

        } catch (error) {
            console.error('Error saving offer:', error);
            setError(error.message || 'Failed to save offer letter');
        } finally {
            setSaving(false);
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
                    <h1 style={{ marginBottom: '0.5rem' }}>Offer Letter Generator</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Generate and manage employment offer letters
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/admin')} className="btn-outline">
                        ← Back to Admin
                    </button>
                    <button onClick={() => setShowGenerator(true)} className="btn">
                        + Generate Offer
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

            {/* Offer Generator Modal */}
            {showGenerator && !showPreview && (
                <div className="modal-overlay" onClick={() => setShowGenerator(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2>Generate Offer Letter</h2>
                            <button className="modal-close" onClick={() => setShowGenerator(false)}>×</button>
                        </div>

                        <form className="application-form">
                            {/* Select Candidate */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>1. Select Candidate</h3>
                            <div className="form-group">
                                <label>Choose from Applications</label>
                                <select
                                    onChange={(e) => {
                                        const app = applications.find(a => a.id === parseInt(e.target.value));
                                        if (app) selectApplication(app);
                                    }}
                                    value={selectedApplication?.id || ''}
                                >
                                    <option value="">-- Select Application --</option>
                                    {applications.map(app => (
                                        <option key={app.id} value={app.id}>
                                            {app.full_name} - {app.position} ({app.status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Candidate Details */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>2. Candidate Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="candidateName"
                                        value={offerData.candidateName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="candidateEmail"
                                        value={offerData.candidateEmail}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Address Line 1</label>
                                    <input
                                        type="text"
                                        name="candidateAddressLine1"
                                        value={offerData.candidateAddressLine1}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address Line 2</label>
                                    <input
                                        type="text"
                                        name="candidateAddressLine2"
                                        value={offerData.candidateAddressLine2}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="candidateCity"
                                        value={offerData.candidateCity}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="candidateState"
                                        value={offerData.candidateState}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="candidatePincode"
                                        value={offerData.candidatePincode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Select Compensation Package */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>3. Select Role & Compensation</h3>
                            <div className="form-group">
                                <label>Compensation Package</label>
                                <select
                                    value={offerData.compensationPackageId}
                                    onChange={(e) => selectCompensationPackage(e.target.value)}
                                >
                                    <option value="">-- Select Package (Auto-fills compensation) --</option>
                                    {compensationPackages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.role_title} ({pkg.role_level}) - {pkg.currency === 'INR' ? '₹' : '$'}{(pkg.annual_ctc_min / 100000).toFixed(1)}L - {(pkg.annual_ctc_max / 100000).toFixed(1)}L
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Details */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Job Title *</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={offerData.jobTitle}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department *</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={offerData.department}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Reporting Manager</label>
                                    <input
                                        type="text"
                                        name="reportingManager"
                                        value={offerData.reportingManager}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Work Location</label>
                                    <input
                                        type="text"
                                        name="workLocation"
                                        value={offerData.workLocation}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Job Responsibilities</label>
                                <textarea
                                    name="jobResponsibilities"
                                    value={offerData.jobResponsibilities}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            {/* Employment Terms */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>4. Employment Terms</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={offerData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Acceptance Deadline *</label>
                                    <input
                                        type="date"
                                        name="acceptanceDeadline"
                                        value={offerData.acceptanceDeadline}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Compensation */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>5. Compensation Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Annual CTC *</label>
                                    <input
                                        type="text"
                                        name="annualCtc"
                                        value={offerData.annualCtc}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., ₹18,00,000 per annum"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Basic Salary</label>
                                    <input
                                        type="text"
                                        name="basicSalary"
                                        value={offerData.basicSalary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>HRA</label>
                                    <input
                                        type="text"
                                        name="hra"
                                        value={offerData.hra}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Special Allowance</label>
                                    <input
                                        type="text"
                                        name="specialAllowance"
                                        value={offerData.specialAllowance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Performance Bonus</label>
                                <input
                                    type="text"
                                    name="performanceBonus"
                                    value={offerData.performanceBonus}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Benefits */}
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>6. Benefits</h3>
                            {[0, 1, 2, 3, 4].map(index => (
                                <div key={index} className="form-group">
                                    <label>Benefit {index + 1}</label>
                                    <input
                                        type="text"
                                        value={offerData.benefits[index] || ''}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                    />
                                </div>
                            ))}

                            {/* Preview & Save */}
                            <div className="form-actions" style={{ marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowGenerator(false)} className="btn-outline">
                                    Cancel
                                </button>
                                <button type="button" onClick={generatePreview} className="btn">
                                    Preview Offer Letter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2>Offer Letter Preview</h2>
                            <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
                        </div>

                        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
                        </div>

                        <div className="form-actions">
                            <button onClick={() => setShowPreview(false)} className="btn-outline">
                                ← Back to Edit
                            </button>
                            <button onClick={saveOffer} className="btn" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Offer Letter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Offers List */}
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>All Offer Letters ({offers.length})</h3>

                {offers.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            No offer letters generated yet. Create your first one!
                        </p>
                        <button onClick={() => setShowGenerator(true)} className="btn">
                            + Generate Offer
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {offers.map(offer => (
                            <div
                                key={offer.id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>{offer.candidate_name}</h4>
                                    <span style={{
                                        background: offer.offer_status === 'sent' ? 'rgba(59, 130, 246, 0.15)' :
                                            offer.offer_status === 'accepted' ? 'rgba(34, 197, 94, 0.15)' :
                                                offer.offer_status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' :
                                                    'rgba(156, 163, 175, 0.15)',
                                        color: offer.offer_status === 'sent' ? '#93c5fd' :
                                            offer.offer_status === 'accepted' ? '#86efac' :
                                                offer.offer_status === 'rejected' ? '#fca5a5' :
                                                    '#9ca3af',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {offer.offer_status}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    {offer.job_title} • {offer.department}
                                </p>
                                <p style={{ color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: '600' }}>
                                    💰 {offer.annual_ctc}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    📧 {offer.candidate_email} • 📅 Start: {new Date(offer.start_date).toLocaleDateString()}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Reference: {offer.offer_reference} • Created: {new Date(offer.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
