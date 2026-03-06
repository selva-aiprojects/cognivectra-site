import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MegaMenu = ({ isOpen, section, items, image, onClose }) => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="mega-menu-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={onClose}
                >
                    <div className="mega-menu-inner">
                        <div className="mega-menu-left">
                            <div className="mega-menu-image-container">
                                <img src={image} alt={section} className="mega-menu-image" />
                                <div className="mega-menu-image-overlay"></div>
                            </div>
                        </div>
                        <div className="mega-menu-right">
                            <div className="mega-menu-header">
                                <h3 className="mega-menu-title">{section}</h3>
                            </div>
                            <div className="mega-menu-grid">
                                {items.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className={`mega-menu-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={onClose}
                                    >
                                        <div className="mega-menu-item-content">
                                            <div className="mega-menu-item-text">
                                                <div className="mega-menu-item-label-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="mega-menu-item-label">{item.label}</span>
                                                    {item.badge && (
                                                        <span className="hiring-badge-tiny" style={{
                                                            background: 'var(--accent-primary)',
                                                            color: 'white',
                                                            fontSize: '0.65rem',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontWeight: '800',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                                                            animation: 'pulse 2s infinite'
                                                        }}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.desc && <p className="mega-menu-item-desc">{item.desc}</p>}
                                            </div>
                                            <svg
                                                className="mega-menu-item-arrow"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MegaMenu;
