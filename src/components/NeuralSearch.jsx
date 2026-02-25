import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';
import { FaSearch, FaMagic, FaTimes, FaArrowRight } from 'react-icons/fa';

const NeuralSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);

    const logo = "/cognivectra-dark-crop.png";

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResult(null);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResult(null);
        trackEvent('neural_search_query', { query });

        try {
            // 1. Try Live Edge Function
            const { data, error } = await supabase.functions.invoke('ai-search', {
                body: { query }
            });

            if (error) throw error;

            setResult(data.answer);
            setHistory(prev => {
                const newHistory = [query, ...prev.filter(q => q !== query).slice(0, 4)];
                return newHistory;
            });
            setIsSearching(false);
        } catch (error) {
            console.warn('Neural Search Live Link unavailable, switching to Local Intelligence...', error);

            // 2. Local Intelligence Fallback (Deep Context Engineering)
            setTimeout(() => {
                const siteContext = {
                    'techstack': 'Our engineering core uses Vite + React 18, Framer Motion for premium aesthetics, Supabase for scalable backends, and Advanced AI Orchestration (LangGraph, CrewAI, LangChain). We focus on production-ready codebases with strict security guardrails.',
                    'medflow': 'MedFlow EMR: Multi-tenant, HIPAA-ready, and live at Kidz-Clinic. Unlike legacy systems like Epic/Cerner, MedFlow is agile, cloud-native, and reduces provider onboarding from weeks to hours.',
                    'steward': 'StockSteward: Elite FinTech platform using Multi-Agent AI (CrewAI) for market intelligence. It analyzes deep sentiment and liquidity, providing a higher fidelity of insight than standard trading bots.',
                    'eduportal': 'EduPortal: Scalable EdTech platform handling 10k+ concurrent users with AI-driven tutoring—solving the latency and personalization issues typical of older LMS platforms.',
                    'better': 'CogniVectra is better because we deliver senior-architected IP that YOU own. Most competitors provide black-box solutions or high-maintenance offshore code. We provide production-ready foundations with no technical debt and zero vendor lock-in.',
                    'price': 'Our modular Launch Packs for startups and Enterprise Retainers for scale save clients 30-50% on long-term operational costs by building correctly from day one. Inquire for a custom Quote.',
                    'customers': 'We partner with technical leaders at Kidz-Clinic and various North American EdTech/FinTech startups who require elite engineering foundations.',
                    'products': 'Our production-ready platforms include MedFlow (Healthcare), StockSteward (FinTech), StoreAI (Retail), and EduPortal (Education).'
                };

                const lowerQuery = query.toLowerCase();
                let bestContext = "I've analyzed your query. CogniVectra specializes in Production-Ready GenAI, FinTech (StockSteward), and Healthcare (MedFlow) platforms. How can I help you compare our solutions against external options?";

                if (lowerQuery.includes('compare') || lowerQuery.includes('better') || lowerQuery.includes('competitor') || lowerQuery.includes('why')) {
                    bestContext = siteContext['better'] + " " + siteContext['price'];
                } else if (lowerQuery.includes('fintech') || lowerQuery.includes('steward') || lowerQuery.includes('trading')) {
                    bestContext = siteContext['steward'];
                } else if (lowerQuery.includes('health') || lowerQuery.includes('medflow') || lowerQuery.includes('medical') || lowerQuery.includes('emr')) {
                    bestContext = siteContext['medflow'];
                } else if (lowerQuery.includes('edu') || lowerQuery.includes('learn') || lowerQuery.includes('portal')) {
                    bestContext = siteContext['eduportal'];
                } else if (lowerQuery.includes('cloud') || lowerQuery.includes('deployment') || lowerQuery.includes('infrastructure')) {
                    bestContext = siteContext['techstack'];
                } else {
                    for (const [key, value] of Object.entries(siteContext)) {
                        if (lowerQuery.includes(key)) {
                            bestContext = value;
                            break;
                        }
                    }
                }

                setResult(bestContext);
                setHistory(prev => {
                    const newHistory = [query, ...prev.filter(q => q !== query).slice(0, 4)];
                    return newHistory;
                });
                setIsSearching(false);
            }, 800);
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
                    id="neural-search-modal"
                    data-testid="neural-search-modal"
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
                    {/* Brand Header */}
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '32px' }} /> {/* Balance Spacer */}
                        <img
                            src={logo}
                            alt="CogniVectra"
                            style={{
                                height: '32px',
                                opacity: 0.95,
                                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
                            }}
                        />
                        <button
                            id="neural-search-close"
                            data-testid="neural-search-close"
                            onClick={onClose}
                            className="glass-panel"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.4)',
                                height: '32px',
                                width: '32px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Search Area */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <FaSearch style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }} />
                            <input
                                id="neural-search-input"
                                data-testid="neural-search-input"
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
                                    <FaMagic />
                                </motion.div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NEURAL SEEDING...</p>
                            </div>
                        ) : result ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                                    <FaMagic style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 5px var(--accent-primary))' }} />
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        color: 'var(--accent-primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        background: 'linear-gradient(90deg, var(--accent-primary), #a855f7)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        Intelligence Brief
                                    </span>
                                </div>
                                <div
                                    id="neural-search-result"
                                    style={{
                                        fontSize: '1.05rem',
                                        lineHeight: '1.8',
                                        color: 'rgba(255,255,255,0.95)',
                                        padding: '1.75rem',
                                        background: 'rgba(99, 102, 241, 0.03)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.05), 0 10px 30px -10px rgba(0,0,0,0.5)'
                                    }}>
                                    {result}
                                </div>
                                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="btn-outline"
                                        style={{
                                            fontSize: '0.9rem',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        Dismiss
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = '/contact'}
                                        className="btn"
                                        style={{
                                            fontSize: '0.9rem',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                            border: 'none',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
                                        }}
                                    >
                                        Discuss Strategy
                                    </motion.button>
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
                                        <h4 style={{ fontSize: '0.65rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Recent Inquiries</h4>
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
                            <FaMagic style={{ marginRight: '0.4rem' }} />
                            Powered by CogniVectra Neural Core (RAG v1.0)
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NeuralSearch;
