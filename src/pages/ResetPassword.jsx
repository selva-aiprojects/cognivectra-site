import { useState, useEffect } from 'react';
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
    const navigate = useNavigate();

    const [isValidSession, setIsValidSession] = useState(false);

    const initialized = React.useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        async function handlePasswordRecovery() {

            // --- Strategy 1: URL Hash (Implicit flow from /auth/v1/verify redirect) ---
            // Supabase server-side verify redirects back with: #access_token=...&type=recovery
            if (window.location.hash) {
                const hash = new URLSearchParams(window.location.hash.replace('#', ''))
                const accessToken = hash.get('access_token')
                const refreshToken = hash.get('refresh_token')
                const tokenType = hash.get('type')

                if (accessToken && tokenType === 'recovery') {
                    console.log('🔑 Recovery tokens found in URL hash. Establishing session...')
                    try {
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || '',
                        })
                        if (error) throw error
                        if (data.session) {
                            console.log('✅ Session established via URL hash tokens.')
                            setIsValidSession(true)
                            setMessage({ type: 'success', text: 'Secure channel established. You may now update your access code.' })
                        }
                    } catch (err) {
                        console.error('❌ Hash session error:', err.message)
                        setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new one.' })
                    } finally {
                        setInitializing(false)
                    }
                    return
                }
            }

            // --- Strategy 2: PKCE Flow (Supabase JS v2 default) ---
            // The reset link arrives as: /reset-password?code=XXXX
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                console.log('🔑 PKCE code detected. Exchanging for session...');
                try {
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    if (data.session) {
                        console.log('✅ Session established via PKCE exchange.');
                        setIsValidSession(true);
                        setMessage({ type: 'success', text: 'Secure channel established. You may now update your access code.' });
                    }
                } catch (err) {
                    console.error('❌ PKCE exchange failed:', err.message);
                    setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new one.' });
                } finally {
                    setInitializing(false);
                }
                return;
            }

            // --- Strategy 3: Check for existing session ---
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                console.log('✨ Existing active session detected.');
                setIsValidSession(true);
                setMessage({ type: 'success', text: 'Secure channel established. You may now update your access code.' });
                setInitializing(false);
                return;
            }

            // --- Strategy 4: Listen for PASSWORD_RECOVERY event (fallback) ---
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('🔑 Auth Event:', event);
                if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                    setIsValidSession(true);
                    setInitializing(false);
                    setMessage({ type: 'success', text: 'Secure channel established. You may now update your access code.' });
                }
            });

            // If nothing fires after 4s, show error
            const timer = setTimeout(() => {
                setInitializing(false);
                setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new recovery link.' });
            }, 4000);

            return () => {
                subscription.unsubscribe();
                clearTimeout(timer);
            };
        }

        handlePasswordRecovery();
    }, []);


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
                    <p>Authenticating recovery session...</p>
                </div>
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
