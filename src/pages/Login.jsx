import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            navigate('/admin');
        }
        setLoading(false);
    }

    async function handleForgotPassword() {
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address first.' });
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/admin',
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Password reset email sent! Please check your inbox.' });
        }
        setLoading(false);
    }

    return (
        <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "linear-gradient(180deg, rgba(5,7,12,0) 0%, rgba(5,7,12,1) 100%)" }}>
            <div className="card no-hover-effect" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to manage CogniVectra</p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? '#ef4444' : '#22c55e',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                        fontSize: '0.9rem'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin} className="form" style={{ marginTop: 0 }}>
                    <label>
                        <span>Email Address</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@cognivectra.com"
                        />
                    </label>
                    <label style={{ marginBottom: '0.5rem' }}>
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </label>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-primary)',
                                padding: 0,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                width: 'auto',
                                textTransform: 'none',
                                boxShadow: 'none',
                                minHeight: 'auto'
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <p>Secured by Supabase Infrastructure</p>
                </div>
            </div>
        </div>
    );
}
