import React from 'react';

// Import logos
import stewardLogo from '../assets/logos/stocksteward-logo.svg';
import storeLogo from '../assets/logos/storeai-logo.svg';
import medflowLogo from '../assets/logos/medflow-logo.svg';
import eduportalLogo from '../assets/logos/eduportal-logo.svg';
import cognihrmsLogo from '../assets/logos/cognihrms-logo.svg';
import hospitalityLogo from '../assets/logos/hospitality-logo.svg';

const ProductLogo = ({ type, className = "", style = {} }) => {
    const commonStyle = {
        width: "64px",
        height: "64px",
        display: 'block',
        ...style
    };

    const logos = {
        steward: stewardLogo,
        store: storeLogo,
        medflow: medflowLogo,
        healthezee: medflowLogo,
        eduportal: eduportalLogo,
        cognihrms: cognihrmsLogo,
        hospitality: hospitalityLogo
    };


    const logoSrc = logos[type];

    if (!logoSrc) return null;

    return (
        <img
            src={logoSrc}
            alt={`${type} logo`}
            className={className}
            style={commonStyle}
        />
    );
};

export default ProductLogo;
