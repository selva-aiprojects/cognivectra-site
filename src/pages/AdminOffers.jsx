import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LuSparkles, LuCircleCheck, LuFilePen, LuPrinter, LuEye } from 'react-icons/lu';
import AdminLayout from '../layouts/AdminLayout';

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
    const [viewingOffer, setViewingOffer] = useState(null);

    const [offerData, setOfferData] = useState({
        candidateName: '',
        candidateEmail: '',
        candidateAddressLine1: '',
        candidateAddressLine2: '',
        candidateCity: '',
        candidateState: '',
        candidatePincode: '',
        jobTitle: '',
        department: '',
        reportingManager: 'Selvakumar B, Principal Architect',
        workLocation: 'Remote',
        jobResponsibilities: '',
        startDate: '',
        employmentType: 'full-time permanent',
        probationPeriod: 'You will be on probation for the first 3 months of employment.',
        compensationPackageId: '',
        annualCtc: '',
        basicSalary: '',
        hra: '',
        specialAllowance: '',
        performanceBonus: '',
        otherBenefits: '',
        benefits: ['', '', '', '', ''],
        workingHours: '40',
        workSchedule: 'Monday to Friday, flexible hours',
        annualLeave: '21',
        sickLeave: '12',
        casualLeave: '7',
        noticePeriod: '60',
        additionalCondition: 'Right to work in India',
        acceptanceDeadline: '',
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

    async function viewOfferLetter(offer) {
        if (offer.offer_letter_html) {
            setPreviewHTML(offer.offer_letter_html);
            setViewingOffer(offer);
            return;
        }
        // Generate from template for seeded offers without stored HTML
        try {
            const response = await fetch('/email-templates/offer-letter.html');
            let template = await response.text();
            const offerDate = new Date(offer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            const startDate = offer.start_date ? new Date(offer.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD';
            const addr = offer.candidate_address || {};
            const benefits = Array.isArray(offer.benefits) ? offer.benefits : [];

            template = template
                .replace(/{{OFFER_DATE}}/g, offerDate)
                .replace(/{{OFFER_REFERENCE}}/g, offer.offer_reference || 'N/A')
                .replace(/{{CANDIDATE_NAME}}/g, offer.candidate_name)
                .replace(/{{CANDIDATE_ADDRESS_LINE1}}/g, addr.line1 || '')
                .replace(/{{CANDIDATE_ADDRESS_LINE2}}/g, addr.line2 || '')
                .replace(/{{CANDIDATE_CITY}}/g, addr.city || '')
                .replace(/{{CANDIDATE_STATE}}/g, addr.state || '')
                .replace(/{{CANDIDATE_PINCODE}}/g, addr.pincode || '')
                .replace(/{{JOB_TITLE}}/g, offer.job_title)
                .replace(/{{DEPARTMENT}}/g, offer.department)
                .replace(/{{REPORTING_MANAGER}}/g, offer.reporting_manager || 'Selvakumar B')
                .replace(/{{WORK_LOCATION}}/g, offer.work_location || 'Remote')
                .replace(/{{JOB_RESPONSIBILITIES}}/g, offer.job_responsibilities || '')
                .replace(/{{START_DATE}}/g, startDate)
                .replace(/{{EMPLOYMENT_TYPE}}/g, offer.employment_type || 'full-time permanent')
                .replace(/{{PROBATION_PERIOD}}/g, offer.probation_period || '3 months')
                .replace(/{{ANNUAL_CTC}}/g, offer.annual_ctc)
                .replace(/{{BASIC_SALARY}}/g, offer.basic_salary || '')
                .replace(/{{HRA}}/g, offer.hra || '')
                .replace(/{{SPECIAL_ALLOWANCE}}/g, offer.special_allowance || '')
                .replace(/{{PERFORMANCE_BONUS}}/g, offer.performance_bonus || '')
                .replace(/{{OTHER_BENEFITS}}/g, offer.other_benefits || 'As per company policy')
                .replace(/{{BENEFIT_1}}/g, benefits[0] || 'N/A')
                .replace(/{{BENEFIT_2}}/g, benefits[1] || 'N/A')
                .replace(/{{BENEFIT_3}}/g, benefits[2] || 'N/A')
                .replace(/{{BENEFIT_4}}/g, benefits[3] || 'N/A')
                .replace(/{{BENEFIT_5}}/g, benefits[4] || 'N/A')
                .replace(/{{WORKING_HOURS}}/g, offer.working_hours || '40')
                .replace(/{{WORK_SCHEDULE}}/g, offer.work_schedule || '')
                .replace(/{{ANNUAL_LEAVE}}/g, offer.annual_leave_days || '21')
                .replace(/{{SICK_LEAVE}}/g, offer.sick_leave_days || '12')
                .replace(/{{CASUAL_LEAVE}}/g, offer.casual_leave_days || '7')
                .replace(/{{NOTICE_PERIOD}}/g, offer.notice_period_days || '60')
                .replace(/{{ADDITIONAL_CONDITION}}/g, offer.additional_conditions || '')
                .replace(/{{ACCEPTANCE_DEADLINE}}/g, '')
                .replace(/{{SIGNATORY_NAME}}/g, offer.signatory_name || 'Selvakumar B')
                .replace(/{{SIGNATORY_TITLE}}/g, offer.signatory_title || 'Director of Technology');

            setPreviewHTML(template);
            setViewingOffer(offer);
        } catch (err) {
            console.error('Error generating view:', err);
            setError('Failed to load offer letter template');
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

            const { error } = await supabase.from('offer_letters').insert([offerLetterData]);
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

    if (loading) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout>
            <header className="admin-header glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
                <div className="admin-title-area">
                    <div className="admin-breadcrumbs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <Link to="/admin" style={{ opacity: 0.6 }}>Dashboard</Link> <span>/</span> <span style={{ color: 'var(--accent-light)' }}>Hiring</span>
                    </div>
                    <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Offer Console</h1>
                    <p style={{ opacity: 0.7 }}>Design and issue employment agreements with standardized packages.</p>
                </div>
                <div className="admin-actions">
                    <button onClick={() => setShowGenerator(true)} className="btn">
                        <LuSparkles /> Generate New Offer
                    </button>
                </div>
            </header>

            {success && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)', animation: 'slideDown 0.3s ease' }}>{success}</div>}
            {error && <div className="error-message" style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

            {/* Offer Generator Modal */}
            {showGenerator && !showPreview && (
                <div className="modal-overlay" onClick={() => setShowGenerator(false)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Offer Construction</h2>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Step 1: Link to candidate and compensation</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowGenerator(false)}>×</button>
                        </div>
                        <form className="application-form">
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', opacity: 0.9 }}>Profile Matching</h3>
                            <div className="form-group">
                                <label>Shortlisted Application</label>
                                <select onChange={(e) => {
                                    const app = applications.find(a => a.id === parseInt(e.target.value));
                                    if (app) selectApplication(app);
                                }} value={selectedApplication?.id || ''}>
                                    <option value="">-- Associate with Application --</option>
                                    {applications.map(app => (
                                        <option key={app.id} value={app.id}>{app.full_name} | {app.position}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Candidate Full Name</label>
                                    <input type="text" name="candidateName" value={offerData.candidateName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Business Email</label>
                                    <input type="email" name="candidateEmail" value={offerData.candidateEmail} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1.25rem', opacity: 0.9 }}>Equity & Compensation</h3>
                            <div className="form-group">
                                <label>Standardized Package</label>
                                <select value={offerData.compensationPackageId} onChange={(e) => selectCompensationPackage(e.target.value)}>
                                    <option value="">-- Load Template Package --</option>
                                    {compensationPackages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>{pkg.role_title} ({pkg.role_level})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Final Annual CTC</label>
                                    <input type="text" name="annualCtc" value={offerData.annualCtc} onChange={handleInputChange} required placeholder="e.g. ₹18,00,000" />
                                </div>
                                <div className="form-group">
                                    <label>Target Joining Date</label>
                                    <input type="date" name="startDate" value={offerData.startDate} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowGenerator(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="button" onClick={generatePreview} className="btn" style={{ flex: 2 }}>
                                    Generate Draft Preview
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Review Agreement</h2>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Step 2: Legal validation and sign-off</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
                        </div>
                        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', marginBottom: '2rem', color: '#111827', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                            <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
                        </div>
                        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowPreview(false)} className="btn-outline" style={{ flex: 1 }}>Modify Details</button>
                            <button onClick={saveOffer} className="btn" disabled={saving} style={{ flex: 2 }}>
                                {saving ? 'Finalizing...' : 'Issue Offer Letter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Existing Offer Modal */}
            {viewingOffer && (
                <div className="modal-overlay" onClick={() => setViewingOffer(null)}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Offer Letter — {viewingOffer.candidate_name}</h2>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{viewingOffer.offer_reference} | {viewingOffer.job_title} | Status: {viewingOffer.offer_status?.toUpperCase()}</p>
                            </div>
                            <button className="modal-close" onClick={() => setViewingOffer(null)}>×</button>
                        </div>
                        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', marginBottom: '2rem', color: '#111827', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)', overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
                        </div>
                        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => { const w = window.open('', '_blank'); w.document.write(previewHTML); w.document.close(); w.print(); }} className="btn-outline" style={{ flex: 1 }}><LuPrinter /> Print / PDF</button>
                            <button onClick={() => setViewingOffer(null)} className="btn" style={{ flex: 1 }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-table-container glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Recipient Name</th>
                            <th>Target Role</th>
                            <th>Total Compensation</th>
                            <th>Lifecycle Status</th>
                            <th>Date Issued</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map(offer => (
                            <tr key={offer.id}>
                                <td>
                                    <div style={{ fontWeight: '700', color: '#fff' }}>{offer.candidate_name}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{offer.candidate_email}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{offer.job_title}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{offer.department}</div>
                                </td>
                                <td style={{ color: 'var(--accent-light)', fontWeight: '700' }}>
                                    {offer.annual_ctc}
                                </td>
                                <td>
                                    <span className={`status-pill ${offer.offer_status === 'accepted' ? 'status-hot' : 'status-cold'}`} style={{ fontSize: '0.7rem' }}>
                                        {offer.offer_status === 'accepted' ? <><LuCircleCheck style={{ marginRight: '4px' }} /> Accepted</> : (offer.offer_status === 'draft' ? <><LuFilePen style={{ marginRight: '4px' }} /> Draft</> : offer.offer_status)}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                    {new Date(offer.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <button onClick={() => viewOfferLetter(offer)} className="btn" style={{ padding: '0.35rem 1rem', fontSize: '0.75rem' }}>
                                        <LuEye /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
