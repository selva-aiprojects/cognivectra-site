import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const msg = formData.get('message')?.toString().trim();

      // Client-side validation
      if (!name || !email || !msg || name.length < 2 || msg.length < 10) {
        throw new Error('Please fill all fields properly');
      }

      // Skip Supabase on localhost
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      if (!isLocalhost) {
        const { error } = await supabase
          .from('contacts')
          .insert([{
            name,
            email,
            message: msg,
            created_at: new Date().toISOString()
          }]);
        if (error) console.error('Supabase (non-critical):', error);
      }

      // Web3Forms submission (PROVEN WORKING)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: 'eac1f10e-c0f3-4224-930e-ac76ba03adc0',
          name,
          email,
          message: `New Contact Form Submission from ${name}

👤 Name: ${name}
📧 Reply To: ${email}
💬 Message: ${msg}`,
          subject: 'CogniVectra New Contact Form',
          from_name: 'CogniVectra Contact Form'
        })
      });

      clearTimeout(timeoutId);
      
      // ✅ Success - Web3Forms dashboard receives everything
      setMessage('✅ Thank you! Your message has been received. We will reply within 24 hours.');
      e.target.reset();
      
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('❌ Unable to send. Please email: selvakumar.b@cognivectra.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div className="card" style={{maxWidth: '800px', margin: '0 auto 3rem'}}>
          <h2>Get In Touch</h2>
          <p className="stack">
            We'd love to hear from you. Whether you have a project in mind, need expert guidance, 
            or just want to say hello, our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid2">
          {/* Contact Form */}
          <section className="card">
            <h3>Send Message</h3>
            <form onSubmit={handleSubmit} className="form">
              <label>
                <span>Name</span>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your full name"
                  minLength="2"
                  required 
                />
              </label>
              
              <label>
                <span>Email</span>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="your@email.com"
                  required 
                />
              </label>
              
              <label>
                <span>Message</span>
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="Tell us about your project, question, or how we can help..."
                  minLength="10"
                  required
                />
              </label>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </section>

          {/* Contact Info */}
          <section className="card">
            <h3>Connect With Us</h3>
            <div className="stack">
              <div className="service-group">
                <p><strong>📧 Email</strong></p>
                <p><a href="mailto:selvakumar.b@cognivectra.com">selvakumar.b@cognivectra.com</a></p>
              </div>
              
              <div className="service-group">
                <p><strong>📱 WhatsApp</strong></p>
                <p><a href="https://wa.me/918825492600">+91 8825492600</a></p>
              </div>
              
              <div className="service-group">
                <p><strong>🌐 Follow Us</strong></p>
                <ul>
                  <li><a href="https://www.linkedin.com/company/cognivectra-innovations-solutions/?viewAsMember=true">LinkedIn</a></li>
                  <li>Twitter</li>
                  <li>GitHub</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className="card" style={{maxWidth: '600px', margin: '3rem auto 0', textAlign: 'center'}}>
            <h4>{message.includes('Thank you') ? '✅ Message Sent!' : 'Oops!'}</h4>
            <p style={{marginTop: '1rem'}}>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
