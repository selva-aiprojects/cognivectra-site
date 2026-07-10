import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

const DemoRequestModal = ({ isOpen, onClose, platform = 'general' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    platform: platform,
    timeline: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const platforms = {
    'medflow': 'MedFlow EMR - Healthcare Platform',
    'storeai': 'StoreAI - Retail Management',
    'cognihrms': 'CogniHRMS - Human Resource Management',
    'hospitality': 'Hospitality Management (eHMS)',
    'eduportal': 'EduPortal - Education & Institution Platform',
    'stocksteward': 'StockSteward AI - Trading Platform',
    'omnicore': 'OmniCore - Enterprise Orchestration',
    'general': 'General Inquiry'
  };

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const timelines = [
    'Immediate (within 1 month)',
    'Soon (1-3 months)',
    'Planning (3-6 months)',
    'Exploring options'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Forms submission
      const googleFormURL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdX4YzXqJ7Qk8l9w6R3kLmNpOqRtSvWxBxYzZcVfNqLwKg/formResponse';

      const formPayload = new FormData();
      formPayload.append('entry.2005620554', formData.name); // Name
      formPayload.append('entry.1045781291', formData.email); // Email
      formPayload.append('entry.1065046570', formData.phone); // Phone
      formPayload.append('entry.839330770', formData.organization); // Organization
      formPayload.append('entry.1166974658', platforms[formData.platform] || formData.platform); // Platform
      formPayload.append('entry.1846943667', formData.companySize); // Company Size
      formPayload.append('entry.2080697309', formData.timeline); // Timeline
      formPayload.append('entry.1375920428', formData.message); // Message

      await fetch(googleFormURL, {
        method: 'POST',
        body: formPayload,
        mode: 'no-cors'
      });

      // Also send acknowledgement email via Resend
      try {
        await supabase.functions.invoke('send-notification-email', {
          body: {
            type: 'demo_request',
            name: formData.name,
            email: formData.email,
            organization: formData.organization,
            platform: platforms[formData.platform] || formData.platform,
            timeline: formData.timeline,
            message: formData.message
          }
        });
      } catch (emailError) {
        console.warn('Demo ack email failed (non-blocking):', emailError);
      }

      setIsSubmitted(true);

      // Track conversion event
      trackEvent('lead_generated', {
        platform: formData.platform,
        organization: formData.organization,
        timeline: formData.timeline,
        type: 'demo_request'
      }, 'CONVERSION');

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          organization: '',
          platform: platform,
          timeline: '',
          message: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      // Fallback: still show success to user but log error
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
      >
        <motion.div
          className="modal-content glass-panel"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              opacity: 0.7
            }}
          >
            ×
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Request a Demo</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Get a personalized walkthrough of {platforms[formData.platform] || 'our solutions'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>



                {/* Organization */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Organization/Company *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Platform */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Platform Interested In *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  >
                    {Object.entries(platforms).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>



                {/* Timeline */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Implementation Timeline *
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select timeline</option>
                    {timelines.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your specific requirements or questions..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
                </button>
              </form>
            </>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                Thank You!
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your demo request has been received. Our team will contact you within 24 hours
                to schedule your personalized walkthrough.
              </p>
              <div style={{
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>What's next?</strong><br />
                  ✓ You'll receive a confirmation email shortly<br />
                  ✓ Our team will review your requirements<br />
                  ✓ We'll contact you to schedule the demo<br />
                  ✓ You'll get a personalized product walkthrough
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoRequestModal;
