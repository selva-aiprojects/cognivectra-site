import React from 'react';

const ProductLogo = ({ type, className = "", style = {} }) => {
    // Increase default size for better visibility of new details
    const commonProps = {
        width: "64",
        height: "64",
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        style: { display: 'block', ...style }
    };

    if (type === 'steward') {
        return (
            <svg {...commonProps}>
                <defs>
                    <linearGradient id="grad_steward" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z" fill="url(#grad_steward)" opacity="0.2" />
                <path d="M34 16H28V32H34V16Z" fill="url(#grad_steward)" />
                <path d="M26 22H20V32H26V22Z" fill="url(#grad_steward)" />
                <path d="M18 26H12V32H18V26Z" fill="url(#grad_steward)" />
                <path d="M12 24L20 18L28 22L36 14" stroke="url(#grad_steward)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (type === 'store') {
        return (
            <svg {...commonProps}>
                <defs>
                    <linearGradient id="grad_store" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M36 12H30C30 8.69 27.31 6 24 6C20.69 6 18 8.69 18 12H12C9.79 12 8 13.79 8 16V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V16C40 13.79 38.21 12 36 12ZM24 8C26.21 8 28 9.79 28 12H20C20 9.79 21.79 8 24 8ZM36 38H12V16H18V20C18 20.55 18.45 21 19 21C19.55 21 20 20.55 20 20V16H28V20C28 20.55 28.45 21 29 21C29.55 21 30 20.55 30 20V16H36V38Z" fill="url(#grad_store)" />
                <circle cx="24" cy="28" r="3" fill="url(#grad_store)" />
                <circle cx="18" cy="34" r="2" fill="url(#grad_store)" opacity="0.7" />
                <circle cx="30" cy="34" r="2" fill="url(#grad_store)" opacity="0.7" />
                <line x1="24" y1="28" x2="18" y2="34" stroke="url(#grad_store)" strokeWidth="1.5" />
                <line x1="24" y1="28" x2="30" y2="34" stroke="url(#grad_store)" strokeWidth="1.5" />
            </svg>
        );
    }
    if (type === 'medflow') {
        return (
            <svg {...commonProps}>
                <defs>
                    <linearGradient id="grad_med" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                </defs>
                <rect x="20" y="8" width="8" height="32" rx="2" fill="url(#grad_med)" opacity="0.3" />
                <rect x="8" y="20" width="32" height="8" rx="2" fill="url(#grad_med)" opacity="0.3" />
                <path d="M6 24C12 24 12 30 18 30C24 30 24 24 30 24C36 24 36 18 42 18" stroke="url(#grad_med)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return null;
};

export default ProductLogo;
