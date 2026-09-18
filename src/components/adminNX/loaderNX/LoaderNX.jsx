import React from 'react';
import './LoaderNX.css';

export function LoaderNX({ isOpen, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="nx-loader-overlay">
            <div className="nx-loader-card">
                <div className="nx-loader-top">
                    <div className="nx-spinner-container">
                        <div className="nx-dot nx-dot-1"></div>
                        <div className="nx-dot nx-dot-2"></div>
                        <div className="nx-dot nx-dot-3"></div>
                        <div className="nx-dot nx-dot-4"></div>
                    </div>
                </div>
                <div className="nx-loader-body">
                    {title && <h3>{title}</h3>}
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}