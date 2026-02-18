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
                                                <span className="mega-menu-item-label">{item.label}</span>
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
