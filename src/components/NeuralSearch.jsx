import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';
import { FaSearch, FaSparkles, FaTimes, FaArrowRight } from 'react-icons/fa';

const NeuralSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResult(null);
        trackEvent('neural_search_query', { query });

        try {
            // Direct call to our Supabase Edge Function (Neural Core)
            const { data, error } = await supabase.functions.invoke('ai-search', {
                body: { query }
            });

            if (error) throw error;

            setResult(data.answer || "I've analyzed your query, but couldn't find a definitive answer in our neural core. Would you like to schedule a strategy session?");
            setIsSearching(false);
            setHistory(prev => [query, ...prev.slice(0, 4)]);
        } catch (error) {
            console.error('Neural Search failed:', error);
            // Fallback to minimal response if function isn't deployed yet
            setResult("The Neural Core is currently recalibrating its edge nodes. Please request a direct strategy session for now.");
            setIsSearching(false);
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
                    background: 'rgba(5, 7, 12, 0.9)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '10vh',
                    zIndex: 10000
                }}
            >
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxWidth: '800px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1)'
                    }}
                >
                    {/* Search Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <FaSearch style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask CogniVectra AI (e.g., 'What is MedFlow?', 'Cloud trends 2026')"
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    outline: 'none',
                                    padding: '0.5rem 0'
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                                >
                                    <FaTimes />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn"
                                style={{ height: '40px', width: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FaArrowRight />
                            </button>
                        </form>
                    </div>

                    {/* Results Area */}
                    <div style={{ padding: '2rem', minHeight: '300px', maxHeight: '60vh', overflowY: 'auto' }}>
                        {isSearching ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}
                                >
                                    <FaSparkles />
                                </motion.div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NEURAL SEEDING...</p>
                            </div>
                        ) : result ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <FaSparkles style={{ color: 'var(--accent-primary)' }} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Intelligence Brief</span>
                                </div>
                                <div style={{
                                    fontSize: '1.1rem',
                                    lineHeight: '1.7',
                                    color: 'rgba(255,255,255,0.9)',
                                    padding: '1.5rem',
                                    background: 'rgba(99, 102, 241, 0.05)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(99, 102, 241, 0.1)'
                                }}>
                                    {result}
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button onClick={onClose} className="btn-outline" style={{ fontSize: '0.9rem' }}>Dismiss</button>
                                    <button onClick={() => window.location.href = '/contact'} className="btn" style={{ fontSize: '0.9rem' }}>Discuss Strategy</button>
                                </div>
                            </motion.div>
                        ) : (
                            <div>
                                <h5 style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Trending Inquiries</h5>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {['What is MedFlow?', 'Retail AI solutions', 'Cloud Landing Zones', 'Healthcare EMR scalability', 'GenAI architecture'].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setQuery(item); handleSearch(); }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '100px',
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
                                            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>

                                {history.length > 0 && (
                                    <div style={{ marginTop: '3rem' }}>
                                        <h5 style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Recent Intelligence</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {history.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => { setQuery(item); handleSearch(); }}
                                                    style={{
                                                        textAlign: 'left',
                                                        padding: '0.75rem 1rem',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'rgba(255,255,255,0.5)',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                                >
                                                    <FaSearch style={{ marginRight: '0.75rem', fontSize: '0.8rem', opacity: 0.5 }} />
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                            <FaSparkles style={{ marginRight: '0.4rem' }} />
                            Powered by CogniVectra Neural Core (RAG v1.0)
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NeuralSearch;
