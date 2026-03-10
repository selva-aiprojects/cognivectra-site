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
        <div className="admin-theme login-page-body">
            <div className="login-grid" style={{ opacity: 0.1 }} />

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
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}
                    >
                        {tenant?.branding?.logo_url ? (
                            <img src={tenant.branding.logo_url} alt={tenant.tenant_name} style={{ height: '32px', width: 'auto' }} />
                        ) : (
                            <FaGlobe style={{ fontSize: '1.5rem', color: 'var(--admin-accent)' }} />
                        )}
                        <div style={{ textAlign: 'left' }}>
                            <div data-testid="tenant-name" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--admin-text-main)', letterSpacing: '-0.02em', lineHeight: '1' }}>
                                {tenant?.tenant_name || 'CogniVectra Global'}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginTop: '0.2rem' }}>
                                Command Center
                            </div>
                        </div>
                    </motion.div>
                    <h2>Welcome back</h2>
                    <p>Enter your credentials to access the operational bridge.</p>
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
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-main)' }}>Admin Identifier</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@cognivectra.com"
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-main)' }}>Access Code</label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-accent)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                            >
                                Forgot?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                            />
                        </div>
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

                <div className="login-footer" style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                        <FaLock style={{ fontSize: '0.7rem' }} /> Secure Bridge
                    </div>
                    <div style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.05em' }}>
                        v1.4.2 OPS_OS
                    </div>
                </div>
            </motion.div >
        </div >
    );
}