import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoColor from '../../assets/demo/logomccolor.png';
import './DemoLayout.css';

export function DemoLayout(props) {
    const { children } = props;
    const navigate = useNavigate();

    return (
        <div className="demo-layout">
            <header className="demo-minimal-header">
                <img 
                    src={logoColor} 
                    alt="Logo" 
                    className="demo-logo" 
                />
            </header>
            
            <div className="demo-top-wave-container">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                    <path d="M0,20 C250,160 450,-40 900,50 C1200,120 1350,30 1440,50 L1440,120 L0,120 Z" fill="#FFFFFF" />
                </svg>
            </div>

            <main className="demo-content">
                {children}
            </main>

            <div className="demo-bottom-wave-container">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', transform: 'scaleY(-1)' }}>
                    <path d="M0,20 C250,160 450,-40 900,50 C1200,120 1350,30 1440,50 L1440,120 L0,120 Z" fill="#FFFFFF" />
                </svg>
            </div>
        </div>
    );
}
