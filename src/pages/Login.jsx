import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaEnvelope, FaSpinner, FaChevronRight, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useTenant } from '../context/TenantContext';
import '../admin.css';

export default function Login() {
    const { tenant, loading: tenantLoading } = useTenant();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    if (tenantLoading) {
        return (
            <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <FaSpinner className="spin" style={{ fontSize: '2rem', color: 'var(--admin-accent)' }} />
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
            <Helmet>
                <title>Command Portal | CogniVectra</title>
                <meta name="description" content="Authorization required to access CogniVectra core infrastructure." />
            </Helmet>

            <div className="login-split-container">
                {/* Visual Left Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="login-left-panel"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 2, position: 'relative' }}>
                        {tenant?.branding?.logo_url ? (
                            <img src={tenant.branding.logo_url} alt={tenant.tenant_name} style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
                        ) : (
                            <FaGlobe style={{ fontSize: '2rem', color: '#ffffff' }} />
                        )}
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: '1' }}>
                                {tenant?.tenant_name || 'CogniVectra'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700', marginTop: '0.2rem' }}>
                                Central Command System
                            </div>
                        </div>
                    </div>

                    <div className="login-left-content">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Enterprise AI <br/>Operations Platform
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Secure access point for managing cognitive vectors, neural integrations, and system architecture across your organizational network.
                        </motion.p>
                    </div>

                    <div style={{ zIndex: 2, position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <FaShieldAlt /> <span>SOC2 Type II Certified Subsystem</span>
                    </div>
                </motion.div>

                {/* Form Right Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="login-right-panel"
                >
                    <div className="login-right-inner" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                        <div className="login-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--admin-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                                Welcome back
                            </h2>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '1rem' }}>
                                Enter your credentials to access the bridge.
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        marginBottom: '2rem',
                                        fontSize: '0.9rem',
                                        background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: message.type === 'error' ? '#dc2626' : '#059669',
                                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>{message.type === 'error' ? '⚠️' : '✅'}</span>
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--admin-text-main)' }}>Admin Identifier</label>
                                <div style={{ position: 'relative' }}>
                                    <FaEnvelope style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@cognivectra.com"
                                        style={{ 
                                            padding: '0.9rem 1rem 0.9rem 3rem', 
                                            width: '100%', 
                                            borderRadius: '10px', 
                                            border: '1px solid var(--admin-border)',
                                            background: '#f8fafc',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            color: 'var(--admin-text-main)'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--admin-accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--admin-border)'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--admin-text-main)' }}>Access Code</label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        style={{ background: 'none', border: 'none', color: 'var(--admin-accent)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        style={{ 
                                            padding: '0.9rem 1rem 0.9rem 3rem', 
                                            width: '100%', 
                                            borderRadius: '10px', 
                                            border: '1px solid var(--admin-border)',
                                            background: '#f8fafc',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            color: 'var(--admin-text-main)'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--admin-accent)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--admin-border)'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn"
                                style={{ 
                                    width: '100%', 
                                    height: '52px', 
                                    fontSize: '1rem', 
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--admin-accent)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px 0 rgba(67, 56, 202, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(67, 56, 202, 0.4)'; }}
                                onMouseOut={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 14px 0 rgba(67, 56, 202, 0.3)'; }}
                            >
                                {loading ? <FaSpinner className="spin" /> : (
                                    <>Initialize Session <FaChevronRight style={{ marginLeft: '0.75rem', fontSize: '0.8rem' }} /></>
                                )}
                            </button>
                        </form>

                        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>
                                <FaLock style={{ fontSize: '0.7rem' }} /> Secure Connection
                            </div>
                            <div style={{ background: '#f1f5f9', color: '#64748b', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                                v1.4.2 OPS
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}