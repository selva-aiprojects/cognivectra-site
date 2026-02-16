import React from 'react';

const ProductLogo = ({ type, className = "", style = {} }) => {
    const commonProps = {
        width: "48",
        height: "48",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        style: { display: 'block', ...style }
    };

    if (type === 'steward') {
        return (
            <svg {...commonProps}>
                <rect x="2" y="3" width="20" height="18" rx="2" stroke="url(#grad1)" strokeWidth="2" strokeOpacity="0.8" />
                <path d="M7 15L10 12L13 15L17 9" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="grad1" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    if (type === 'store') {
        return (
            <svg {...commonProps}>
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="grad2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f59e0b" />
                        <stop offset="1" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    if (type === 'medflow') {
        return (
            <svg {...commonProps}>
                <path d="M19 14C20.49 14 22 12.69 22 11.5C22 10.16 21.05 9.17 19.5 9.17C19.29 9.17 19 9.06 18.82 8.88L15.65 5.71C15 5.06 14.28 4.7 13.5 4.56V2.5H10.5V4.56C9.72 4.7 9 5.06 8.35 5.71L5.18 8.88C5 9.06 4.71 9.17 4.5 9.17C2.95 9.17 2 10.16 2 11.5C2 12.69 3.51 14 5 14M12 16V22M9 19H15" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="url(#grad3)" strokeWidth="2" />
                <defs>
                    <linearGradient id="grad3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10b981" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
    return null;
};

export default ProductLogo;
