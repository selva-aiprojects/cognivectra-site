import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPalette, FaCheck } from "react-icons/fa";

export default function ThemeSwitcher({ theme, setTheme }) {
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'deep-tech', label: 'Deep Tech', color: '#6366f1' },
        { id: 'vibrant-blue', label: 'Vibrant Blue', color: '#0ea5e9' },
        { id: 'technical-emerald', label: 'Tech Emerald', color: '#10b981' },
        { id: 'sunset-glow', label: 'Sunset Glow', color: '#f59e0b' },
        { id: 'royal-amethyst', label: 'Royal Amethyst', color: '#8b5cf6' },
        { id: 'cyber-oasis', label: 'Cyber Oasis', color: '#d946ef' },
        { id: 'space-dark', label: 'Space Dark', color: '#71717a' },
    ];

    return (
        <div className="theme-switcher-wrapper" style={{ position: 'relative', marginLeft: '0.5rem' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav-theme-trigger"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                aria-label="Switch Theme"
            >
                <FaPalette size={14} style={{ color: themes.find(t => t.id === theme)?.color || 'white' }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 15px)',
                                right: 0,
                                width: '180px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                padding: '0.75rem',
                                zIndex: 999
                            }}
                        >
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                                Select Experience
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTheme(t.id);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.6rem 0.75rem',
                                            borderRadius: '8px',
                                            background: theme === t.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            border: 'none',
                                            color: theme === t.id ? 'white' : 'rgba(255,255,255,0.6)',
                                            fontSize: '0.85rem',
                                            fontWeight: theme === t.id ? '700' : '500',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
                                            {t.label}
                                        </div>
                                        {theme === t.id && <FaCheck size={10} style={{ color: t.color }} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
