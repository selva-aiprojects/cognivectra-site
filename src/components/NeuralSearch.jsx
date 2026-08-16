import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';
import { FaSearch, FaMagic, FaTimes, FaArrowRight, FaClock, FaBolt } from 'react-icons/fa';

const TRENDING = [
    { label: 'What is Healthezee?', icon: '🏥' },
    { label: 'Retail AI solutions', icon: '🛒' },
    { label: 'Cloud Landing Zones', icon: '☁️' },
    { label: 'Healthcare EMR scalability', icon: '📈' },
    { label: 'GenAI architecture', icon: '🤖' },
];

const NeuralSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const logo = '/logo-enterprise.png';

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResult(null);
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const handleSearch = async (overrideQuery) => {
        const q = (overrideQuery ?? query).trim();
        if (!q) return;

        if (overrideQuery) setQuery(overrideQuery);
        setIsSearching(true);
        setResult(null);
        trackEvent('neural_search_query', { query: q });
        try {
            const { data, error } = await supabase.functions.invoke('ai-search', { body: { query: q } });
            if (error) throw error;
            setResult(data.answer);
            setHistory(prev => [q, ...prev.filter(x => x !== q).slice(0, 4)]);
            setIsSearching(false);
        } catch {
            setTimeout(() => {
                const siteContext = {
                    'techstack': 'Our engineering core uses Vite + React 18, Framer Motion, Supabase, and advanced AI orchestration (LangGraph, CrewAI, LangChain).',
                    'healthezee': 'Healthezee: AI-native, multi-tenant healthcare management and EMR platform, live in production at clinic deployments. Reduces provider onboarding from weeks to hours.',
                    'medflow': 'MediFlow: pharmacy management system for medicines, billing, inventory and prescription workflows.',
                    'stocksteward': 'StockSteward: AI-powered investment and market intelligence platform with personalized portfolio analytics.',
                    'storeai': 'StoreAI: intelligent inventory, sales and purchasing management for modern retail operations.',
                    'eduportal': 'EduPortal: scalable EdTech platform handling 10k+ concurrent users with AI-driven tutoring.',
                    'better': 'Cognivectra delivers senior-architected IP that YOU own — production-ready, no technical debt, zero vendor lock-in.',
                    'price': 'Our modular engagement models save clients 30–50% on long-term operational costs by building correctly from day one.',
                    'customers': 'We partner with healthcare, hospitality, retail, education and enterprise clients across India and global markets.',
                    'products': 'Production-ready platforms: Healthezee (Healthcare), MediFlow (Pharmacy), StockSteward (FinTech), StoreAI (Retail), EduPortal (Education), CogniHRMS (HR), eHMS (Hospitality).',
                };
                const lowerQ = q.toLowerCase();
                let answer = "Cognivectra is an AI-native technology and product engineering company building software for healthcare, HR, hospitality, finance, retail and education. How can I help?";
                if (lowerQ.includes('compare') || lowerQ.includes('better') || lowerQ.includes('why')) answer = siteContext['better'] + ' ' + siteContext['price'];
                else if (lowerQ.includes('fintech') || lowerQ.includes('stock') || lowerQ.includes('steward') || lowerQ.includes('trading') || lowerQ.includes('portfolio')) answer = siteContext['stocksteward'];
                else if (lowerQ.includes('health') || lowerQ.includes('medflow') || lowerQ.includes('healthezee') || lowerQ.includes('emr') || lowerQ.includes('pharmacy')) answer = siteContext['healthezee'] + ' ' + siteContext['medflow'];
                else if (lowerQ.includes('retail') || lowerQ.includes('inventory') || lowerQ.includes('storeai')) answer = siteContext['storeai'];
                else if (lowerQ.includes('edu') || lowerQ.includes('learn')) answer = siteContext['eduportal'];
                else if (lowerQ.includes('cloud') || lowerQ.includes('infrastructure')) answer = siteContext['techstack'];
                else for (const [k, v] of Object.entries(siteContext)) { if (lowerQ.includes(k)) { answer = v; break; } }
                setResult(answer);
                setHistory(prev => [q, ...prev.filter(x => x !== q).slice(0, 4)]);
                setIsSearching(false);
            }, 900);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(2, 4, 14, 0.92)',
                    backdropFilter: 'blur(18px)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: 'clamp(20px, 10vh, 100px)',
                    zIndex: 10000,
                }}
            >
                <motion.div
                    id="neural-search-modal"
                    data-testid="neural-search-modal"
                    initial={{ opacity: 0, y: -24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxWidth: '680px',
                        width: '92%',
                        maxHeight: '85vh',
                        background: 'linear-gradient(145deg, rgba(20, 24, 48, 0.98) 0%, rgba(10, 12, 28, 1) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1), 0 0 80px rgba(99,102,241,0.1)',
                    }}
                >
                    {/* ── Header ── */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(99,102,241,0.04)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <img
                                src={logo}
                                alt="CogniVectra"
                                style={{ height: '24px', width: 'auto', filter: 'brightness(1.2)' }}
                            />
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.2rem' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em' }}>
                                AI Search
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{
                                fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                                padding: '2px 7px', fontFamily: 'monospace', letterSpacing: '0.05em',
                            }}>ESC</span>
                            <button
                                id="neural-search-close"
                                data-testid="neural-search-close"
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.4)',
                                    height: '30px', width: '30px',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.8rem',
                                }}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.1)', color: 'white' })}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' })}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* ── Search Input ── */}
                    <div style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        transition: 'background 0.3s',
                        background: isFocused ? 'rgba(99,102,241,0.06)' : 'transparent',
                    }}>
                        <motion.form
                            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}
                        >
                            <FaSearch style={{
                                color: isFocused ? 'var(--accent-primary)' : 'rgba(255,255,255,0.25)',
                                fontSize: '1rem',
                                flexShrink: 0,
                                transition: 'color 0.3s',
                            }} />
                            <input
                                id="neural-search-input"
                                data-testid="neural-search-input"
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Ask anything about CogniVectra, Healthezee, GenAI..."
                                style={{
                                    flex: 1,
                                    background: 'none', border: 'none',
                                    color: 'white',
                                    fontSize: '1.05rem',
                                    outline: 'none',
                                    padding: '0.35rem 0',
                                }}
                            />
                            <AnimatePresence>
                                {query && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.7 }}
                                        type="button"
                                        onClick={() => { setQuery(''); setResult(null); inputRef.current?.focus(); }}
                                        style={{
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem',
                                            height: '26px', width: '26px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.12)', color: 'white' })}
                                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' })}
                                    >
                                        <FaTimes />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    height: '38px', width: '38px', padding: 0, flexShrink: 0,
                                    background: query ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'rgba(255,255,255,0.06)',
                                    border: 'none', borderRadius: '10px',
                                    color: query ? 'white' : 'rgba(255,255,255,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: query ? 'pointer' : 'default',
                                    boxShadow: query ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <FaArrowRight style={{ fontSize: '0.85rem' }} />
                            </motion.button>
                        </motion.form>
                    </div>

                    {/* ── Body ── */}
                    <div className="neural-search-body" style={{
                        padding: '1.25rem 1rem',
                        flex: 1,
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(99,102,241,0.2) transparent'
                    }}>
                        {isSearching ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '1rem' }}>
                                {/* Pulsing dots loader */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
                                            style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                                boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                                            }}
                                        />
                                    ))}
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>
                                    Neural Processing...
                                </p>
                            </div>
                        ) : result ? (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                {/* Result label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '22px', height: '22px', borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <FaMagic style={{ color: 'white', fontSize: '0.6rem' }} />
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    }}>Intelligence Brief</span>
                                </div>

                                {/* Answer card */}
                                <div
                                    id="neural-search-result"
                                    style={{
                                        fontSize: '0.98rem', lineHeight: '1.85',
                                        color: 'rgba(255,255,255,0.9)',
                                        padding: '1.25rem 1.5rem',
                                        background: 'rgba(99,102,241,0.05)',
                                        borderRadius: '14px',
                                        border: '1px solid rgba(99,102,241,0.18)',
                                        boxShadow: 'inset 0 0 30px rgba(99,102,241,0.04)',
                                    }}
                                >
                                    {result}
                                </div>

                                {/* Action row */}
                                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => { setResult(null); setQuery(''); inputRef.current?.focus(); }}
                                        style={{
                                            padding: '0.6rem 1.25rem', borderRadius: '10px',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500',
                                        }}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.08)' })}
                                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)' })}
                                    >
                                        New Search
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => window.location.href = '/contact'}
                                        style={{
                                            padding: '0.6rem 1.5rem', borderRadius: '10px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                            color: 'white', fontSize: '0.85rem', cursor: 'pointer',
                                            fontWeight: '600', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                        }}
                                    >
                                        Discuss Strategy →
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <div>
                                {/* Trending */}
                                <p style={{
                                    fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase',
                                    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)',
                                    marginBottom: '0.85rem',
                                }}>
                                    Trending Inquiries
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {TRENDING.map((item, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleSearch(item.label)}
                                            style={{
                                                padding: '0.45rem 0.9rem',
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.09)',
                                                borderRadius: '100px',
                                                color: 'rgba(255,255,255,0.65)',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                transition: 'all 0.2s',
                                                fontWeight: '500',
                                            }}
                                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, {
                                                background: 'rgba(99,102,241,0.12)',
                                                borderColor: 'rgba(99,102,241,0.4)',
                                                color: 'white',
                                            })}
                                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
                                                background: 'rgba(255,255,255,0.04)',
                                                borderColor: 'rgba(255,255,255,0.09)',
                                                color: 'rgba(255,255,255,0.65)',
                                            })}
                                        >
                                            <span>{item.icon}</span>
                                            {item.label}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* History */}
                                {history.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                                    >
                                        <p style={{
                                            fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase',
                                            letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)',
                                            marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        }}>
                                            <FaClock style={{ fontSize: '0.65rem' }} /> Recent
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {history.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSearch(item)}
                                                    style={{
                                                        textAlign: 'left', padding: '0.55rem 0.75rem',
                                                        background: 'none', border: 'none',
                                                        color: 'rgba(255,255,255,0.45)',
                                                        fontSize: '0.88rem', cursor: 'pointer',
                                                        borderRadius: '8px', transition: 'all 0.2s',
                                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                                    }}
                                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)' })}
                                                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'none', color: 'rgba(255,255,255,0.45)' })}
                                                >
                                                    <FaSearch style={{ fontSize: '0.7rem', opacity: 0.5, flexShrink: 0 }} />
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div style={{
                        padding: '0.7rem 1.25rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(0,0,0,0.18)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaMagic style={{ fontSize: '0.6rem' }} />
                            Powered by CogniVectra Neural Core · RAG v1.0
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', fontWeight: '600' }}>Live</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NeuralSearch;
