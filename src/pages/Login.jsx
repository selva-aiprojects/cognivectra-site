import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaEnvelope, FaSpinner, FaChevronRight, FaGlobe } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useTenant } from '../context/TenantContext';

export default function Login() {
    const { tenant, loading: tenantLoading } = useTenant();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    if (tenantLoading) {
        return (
            <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader"></div>
            </div>
        );
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/admin');
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            setMessage({ type: 'error', text: 'Operational error: Identifier required.' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password',
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Recovery packet dispatched to your terminal.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-grid" />
            <div className="login-glow" style={{ top: '10%', left: '10%' }} />
            <div className="login-glow" style={{ bottom: '10%', right: '10%', background: '#3b82f6' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="login-card glass-panel"
            >
                <Helmet>
                    <title>Command Portal | CogniVectra</title>
                    <meta name="description" content="Authorization required to access CogniVectra core infrastructure." />
                    <meta property="og:url" content="https://cognivectra.com/login" />
                    <meta property="og:image" content="https://cognivectra.com/og-image.png" />
                </Helmet>
                <div className="login-header">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}
                    >
                        {tenant?.branding?.logo_url ? (
                            <img src={tenant.branding.logo_url} alt={tenant.tenant_name} style={{ height: '40px', width: 'auto' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FaGlobe style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }} />
                                <div data-testid="tenant-name" style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
                                    {tenant?.tenant_name || 'Operations OS'}
                                </div>
                            </div>
                        )}
                    </motion.div>
                    <h2>Command Portal</h2>
                    <p>Authorization required to access {tenant?.tenant_name || 'CogniVectra'} core.</p>
                </div>

                <AnimatePresence mode="wait">
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '2rem',
                                fontSize: '0.85rem',
                                background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: message.type === 'error' ? '#f87171' : '#34d399',
                                border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{message.type === 'error' ? '⚠️' : '✅'}</span>
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label><FaEnvelope style={{ marginRight: '0.5rem', fontSize: '0.7rem' }} /> Identifier</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@cognivectra.com"
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <label style={{ margin: 0 }}><FaLock style={{ marginRight: '0.5rem', fontSize: '0.7rem' }} /> Access Code</label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Lost Access?
                            </button>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{ width: '100%', marginTop: '1rem', height: '50px', fontSize: '1rem' }}
                    >
                        {loading ? <FaSpinner className="spin" /> : (
                            <>Initialize Session <FaChevronRight style={{ marginLeft: '0.75rem', fontSize: '0.8rem' }} /></>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <FaLock style={{ fontSize: '0.7rem' }} /> Encrypted via Supabase High-Trust Mesh
                </div>
            </motion.div >
        </div >
    );
}