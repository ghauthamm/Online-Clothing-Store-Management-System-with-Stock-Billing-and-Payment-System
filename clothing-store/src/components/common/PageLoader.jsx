// Page Loader Component - Animated loading screen
import React, { useState, useEffect } from 'react';

const PageLoader = ({ onLoadComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                if (onLoadComplete) onLoadComplete();
            }, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onLoadComplete]);

    return (
        <div className={`page-loader ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader-logo">
                <h1>Samy Silks</h1>
                <p style={{ fontSize: '1rem', opacity: 0.8 }}>& Readymades</p>
            </div>
            <div className="loader-spinner"></div>
            <p className="loader-text">Loading Premium Collections...</p>
        </div>
    );
};

export default PageLoader;
