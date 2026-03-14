import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaSpinner, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const navigate = useNavigate();

    const [isValidSession, setIsValidSession] = useState(false);

    const initialized = useRef(false);

    useEffect(() => {
        console.log('🛡️ CogniVectra Secure Auth Component Loaded [v2.1.0]');
        if (initialized.current) return;
        initialized.current = true;

        async function checkInitialHealth() {
            // Priority 1: Check for existing session
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession) {
                console.log('✨ Session detected on entry.');
                setIsValidSession(true);
                setInitializing(false);
                return;
            }

            // Priority 2: Detect if we have parameters that REQUIRE manual initialization
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const hasHash = window.location.hash.includes('access_token');

            if (code || hasHash) {
                console.log('📬 Recovery parameters detected. Awaiting manual activation.');
                setNeedsConfirmation(true);
                setInitializing(false);
                return;
            }

            // Priority 3: Fallback listener for async events
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                    setIsValidSession(true);
                    setInitializing(false);
                }
            });

            // If nothing found after 4s (resilient to slow network)
            const timer = setTimeout(() => {
                setInitializing(prev => {
                    if (prev) {
                        setMessage({ type: 'error', text: 'CogniVectra Auth Error: The recovery signal could not be established locally. [ERR-INIT-TIMEOUT]' });
                        return false;
                    }
                    return false;
                });
            }, 4000);

            return () => {
                subscription.unsubscribe();
                clearTimeout(timer);
            };
        }

        checkInitialHealth();
    }, []);

    async function handleInitializeRecovery() {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Check for Hash first (Implicit)
            if (window.location.hash) {
                const hash = new URLSearchParams(window.location.hash.replace('#', ''))
                const accessToken = hash.get('access_token')
                const refreshToken = hash.get('refresh_token')
                const tokenType = hash.get('type')

                if (accessToken && tokenType === 'recovery') {
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || '',
                    })
                    if (error) throw error
                    if (data.session) {
                        setIsValidSession(true)
                        setIsConfirmed(true)
                        return
                    }
                }
            }

            // Check for PKCE Code
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) throw error;
                if (data.session) {
                    setIsValidSession(true);
                    setIsConfirmed(true);
                    return;
                }
            }

            // Final fallback check
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
                setIsConfirmed(true);
            } else {
                throw new Error("CogniVectra Auth Error: The recovery link has expired or was already consumed. [ERR-MANUAL-CONSUMED]");
            }
        } catch (err) {
            // Check if we already have a session before showing an error
            // (prevents race condition with onAuthStateChange)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
                return;
            }
            console.error('❌ Recovery initialization failed:', err.message);
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    }

    // Clear any lingering error messages once a session is established
    useEffect(() => {
        if (isValidSession) {
            setMessage({ type: '', text: '' });
        }
    }, [isValidSession]);


    async function handleReset(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Access codes do not match.' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Access code must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Re-verify session before update
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("Session expired or invalid. Please request a new recovery packet.");
            }

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Access updated. Syncing with Command Portal...' });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    if (initializing) {
        return (
            <div className="login-page">
                <div className="login-grid" />
                <div className="login-card glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FaSpinner className="spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }} />
                    <p>Scanning authorization parameters...</p>
                </div>
            </div>
        );
    }

    if (needsConfirmation && !isValidSession) {
        return (
            <div className="login-page">
                <div className="login-grid" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="login-card glass-panel"
                    style={{ textAlign: 'center', padding: '3rem' }}
                >
                    <div className="login-header">
                        <FaShieldAlt style={{ fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
                        <h2>Identity Verification</h2>
                        <p>A recovery signal has been detected. Click below to initialize a secure session.</p>
                    </div>

                    {message.text && (
                        <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleInitializeRecovery}
                        disabled={loading}
                        className="btn"
                        style={{ width: '100%', height: '54px', fontSize: '1.1rem' }}
                    >
                        {loading ? <FaSpinner className="spin" /> : 'Initialize Secure Recovery'}
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!isValidSession) {
        return (
            <div className="login-page">
                <div className="login-grid" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="login-card glass-panel"
                    style={{ textAlign: 'center', padding: '3rem' }}
                >
                    <div className="login-header">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2>Session Error</h2>
                        <p>{message.text || 'Invalid or expired recovery link.'}</p>
                    </div>
                    <button onClick={() => navigate('/login')} className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                        Return to Bridge
                    </button>
                </motion.div>
            </div>
        );
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
                    <title>Reset Access Code | CogniVectra</title>
                    <meta name="description" content="Establish a new secure entry key for your CogniVectra terminal." />
                    <meta property="og:url" content="https://cognivectra.com/reset-password" />
                    <meta property="og:image" content="https://cognivectra.com/og-image.png" />
                </Helmet>
                <div className="login-header">
                    <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Reset Access Code Authorization</h1>
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        src="/logo-enterprise.png"
                        alt="CogniVectra"
                        style={{ height: '32px', width: 'auto', margin: '0 auto 1.5rem' }}
                    />
                    <h2>Reset Access Code</h2>
                    <p>Establish a new secure entry key for your terminal.</p>
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

                <form onSubmit={handleReset} className="login-form">
                    <div className="form-group">
                        <label><FaLock style={{ marginRight: '0.5rem', fontSize: '0.7rem' }} /> New Access Code</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-group">
                        <label><FaShieldAlt style={{ marginRight: '0.5rem', fontSize: '0.7rem' }} /> Confirm Access Code</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <>Update Access Code <FaChevronRight style={{ marginLeft: '0.75rem', fontSize: '0.8rem' }} /></>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <FaLock style={{ fontSize: '0.7rem' }} /> Bit-level encryption active
                </div>
            </motion.div>
        </div>
    );
}
