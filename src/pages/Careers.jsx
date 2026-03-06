import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import careersHero from "../assets/careers-hero.png";

export default function Careers() {
    const [jobPostings, setJobPostings] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        portfolio_url: '',
        position: '',
        experience_years: '',
        current_location: '',
        expected_salary: '',
        notice_period: '',
        cover_letter: '',
        resume: null
    });

    useEffect(() => {
        fetchJobPostings();
    }, []);

    async function fetchJobPostings() {
        try {
            const { data, error } = await supabase
                .from('job_postings')
                .select('*')
                .eq('status', 'active')
                .order('posted_at', { ascending: false });

            if (error) throw error;
            setJobPostings(data || []);
        } catch (error) {
            console.error('Error fetching job postings:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setSubmitError('Please upload a PDF or Word document');
                e.target.value = '';
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSubmitError('File size must be less than 5MB');
                e.target.value = '';
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
            setSubmitError('');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        try {
            // 1. Upload resume to Supabase Storage
            const fileExt = formData.resume.name.split('.').pop();
            const fileName = `${Date.now()}_${formData.full_name.replace(/\s+/g, '_')}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, formData.resume);

            if (uploadError) throw uploadError;

            // 2. Get public URL for the resume
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            // 3. Insert application into database
            const { error: insertError } = await supabase
                .from('job_applications')
                .insert([{
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone || null,
                    linkedin_url: formData.linkedin_url || null,
                    portfolio_url: formData.portfolio_url || null,
                    position: formData.position,
                    job_posting_id: selectedJob?.id || null,
                    experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
                    current_location: formData.current_location || null,
                    expected_salary: formData.expected_salary || null,
                    notice_period: formData.notice_period || null,
                    cover_letter: formData.cover_letter || null,
                    resume_url: publicUrl,
                    resume_filename: formData.resume.name
                }]);

            if (insertError) throw insertError;

            // 4. Send acknowledgment email (via Supabase Edge Function)
            try {
                await supabase.functions.invoke('send-application-email', {
                    body: {
                        applicant_email: formData.email,
                        applicant_name: formData.full_name,
                        position: formData.position,
                        job_title: selectedJob?.title || formData.position
                    }
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the whole submission if email fails
            }

            // Success!
            setSubmitSuccess(true);
            setShowApplicationForm(false);

            // Reset form
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                linkedin_url: '',
                portfolio_url: '',
                position: '',
                experience_years: '',
                current_location: '',
                expected_salary: '',
                notice_period: '',
                cover_letter: '',
                resume: null
            });

        } catch (error) {
            console.error('Error submitting application:', error);
            setSubmitError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function openApplicationForm(job = null) {
        setSelectedJob(job);
        setFormData(prev => ({ ...prev, position: job?.title || '' }));
        setShowApplicationForm(true);
        setSubmitSuccess(false);
        setSubmitError('');
    }

    if (loading) {
        return (
            <main>
                <section className="hero-modern">
                    <div className="hero-modern-inner">
                        <div className="loading-container">
                            <FaSpinner className="loading-spinner spin" />
                            <p className="loading-text">Loading opportunities...</p>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <Helmet>
                <title>Build the Future of Enterprise AI | Careers at CogniVectra</title>
                <meta name="description" content="Join CogniVectra and work on cutting-edge cloud platforms, AI automation, and SaaS solutions. Remote-first, competitive compensation, and high-impact work." />
                <meta name="keywords" content="Software Engineering Jobs, AI Jobs, Cloud Architecture Careers, Remote Tech Jobs, CogniVectra Careers" />
                <meta property="og:title" content="Join Our Technical Vision | CogniVectra Careers" />
                <meta property="og:description" content="Build transformative AI and cloud platforms with our elite engineering team." />
                <meta property="og:url" content="https://cognivectra.com/careers" />
            </Helmet>
            {/* HERO */}
            <section className="hero-modern">
                <div className="hero-modern-inner">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">💼 Join Our Team</span>

                        <h1>
                            Build the Future <br />
                            of Enterprise Platforms
                        </h1>

                        <p>
                            Join CogniVectra and work on cutting-edge cloud platforms, AI automation,
                            and SaaS solutions that empower enterprises worldwide. We're looking for
                            passionate technologists who thrive in creating scalable, enterprise-grade systems.
                        </p>

                        <div className="hero-cta">
                            <button onClick={() => openApplicationForm()} className="btn">
                                Apply Now
                            </button>
                            <a href="#open-positions" className="btn-outline">
                                View Open Positions
                            </a>
                        </div>

                        <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
                            Remote-first · Competitive compensation · Flexible hours
                        </p>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="industry-visual glass-panel">
                            <img src={careersHero} alt="Join Our Team" className="w-full h-full object-cover rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* WHY JOIN US */}
            <section className="why-modern">
                <div className="why-modern-inner">
                    <h3>Why Join CogniVectra</h3>

                    <div className="why-modern-grid">
                        <div className="why-pill">Work with cutting-edge technology</div>
                        <div className="why-pill">Remote-first culture</div>
                        <div className="why-pill">Direct impact on global platforms</div>
                        <div className="why-pill">Continuous learning opportunities</div>
                        <div className="why-pill">Flexible work arrangements</div>
                        <div className="why-pill">Competitive compensation</div>
                    </div>
                </div>
            </section>

            {/* OPEN POSITIONS */}
            <section id="open-positions" className="services-modern">
                <h3>Open Positions</h3>

                {jobPostings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            No open positions at the moment. Check back soon or submit a general application!
                        </p>
                        <button onClick={() => openApplicationForm()} className="btn" style={{ marginTop: '2rem' }}>
                            Submit General Application
                        </button>
                    </div>
                ) : (
                    <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {jobPostings.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                className="service-modern-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '2.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: '20px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <span style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--accent-light)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {job.department}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: '600', letterSpacing: '0.05em' }}>
                                        REF: {job.slug?.split('-').pop()?.toUpperCase() || 'ROLE'}
                                    </span>
                                </div>

                                <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                                    {job.title}
                                </h4>

                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem', color: 'var(--text-secondary)', flex: 1 }}>
                                    {job.summary}
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.25rem',
                                    marginBottom: '2.5rem',
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        <FaMapMarkerAlt style={{ color: 'var(--accent-light)', opacity: 0.7 }} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        <FaClock style={{ color: 'var(--accent-light)', opacity: 0.7 }} />
                                        <span style={{ textTransform: 'capitalize' }}>{job.job_type.replace('-', ' ')}</span>
                                    </div>
                                    {job.salary_range && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--accent-light)', fontWeight: '600', gridColumn: 'span 2', marginTop: '8px', opacity: 0.9 }}>
                                            <FaMoneyBillWave style={{ opacity: 0.6 }} />
                                            <span>Est. Compensation: {job.salary_range}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => openApplicationForm(job)}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '1.1rem',
                                        fontWeight: '700',
                                        borderRadius: '12px'
                                    }}
                                >
                                    View Full Description <FaArrowRight style={{ fontSize: '0.8rem', opacity: 0.8 }} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* APPLICATION FORM MODAL */}
            {showApplicationForm && (
                <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Apply for {selectedJob?.title || 'Position'}</h2>
                            <button className="modal-close" onClick={() => setShowApplicationForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="application-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience_years"
                                        value={formData.experience_years}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        name="linkedin_url"
                                        value={formData.linkedin_url}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Portfolio/Website</label>
                                    <input
                                        type="url"
                                        name="portfolio_url"
                                        value={formData.portfolio_url}
                                        onChange={handleInputChange}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Current Location</label>
                                    <input
                                        type="text"
                                        name="current_location"
                                        value={formData.current_location}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Notice Period</label>
                                    <input
                                        type="text"
                                        name="notice_period"
                                        value={formData.notice_period}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2 weeks, 1 month"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Expected Salary Range</label>
                                <input
                                    type="text"
                                    name="expected_salary"
                                    value={formData.expected_salary}
                                    onChange={handleInputChange}
                                    placeholder="e.g., $80k - $100k"
                                />
                            </div>

                            <div className="form-group">
                                <label>Cover Letter</label>
                                <textarea
                                    name="cover_letter"
                                    value={formData.cover_letter}
                                    onChange={handleInputChange}
                                    rows="6"
                                    placeholder="Tell us why you're a great fit for this role..."
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Resume * (PDF or Word, max 5MB)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                />
                                {formData.resume && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                                        ✓ {formData.resume.name}
                                    </p>
                                )}
                            </div>

                            {submitError && (
                                <div className="error-message">
                                    {submitError}
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowApplicationForm(false)} className="btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SUCCESS MESSAGE */}
            {submitSuccess && (
                <div className="modal-overlay" onClick={() => setSubmitSuccess(false)}>
                    <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                            <h2>Application Submitted!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                Thank you for applying! We've received your application and will review it shortly.
                                You should receive a confirmation email at {formData.email}.
                            </p>
                            <button onClick={() => setSubmitSuccess(false)} className="btn" style={{ marginTop: '2rem' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <section className="cta-modern">
                <h3>Don't See the Right Role?</h3>
                <p>
                    We're always looking for talented individuals. Send us your resume
                    and we'll keep you in mind for future opportunities.
                </p>
                <button onClick={() => openApplicationForm()} className="btn">
                    Submit General Application
                </button>
            </section>
        </main>
    );
}
