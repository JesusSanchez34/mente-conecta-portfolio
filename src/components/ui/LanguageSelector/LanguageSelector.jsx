import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export function LanguageSelector({ lightBg = false }) {
    const { i18n } = useTranslation();

    const changeLanguage = async (lng) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedLanguage', lng);
        }
        await i18n.changeLanguage(lng);
    };

    const currentLang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];

    return (
        <div className={`lang-selector-wrapper ${lightBg ? 'light-bg' : ''}`}>
            <span className="lang-globe-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </span>
            <div className="lang-buttons-pill">
                {/* sliding backplate background */}
                <div className={`lang-active-indicator ${currentLang === 'en' ? 'shift-right' : ''}`}></div>
                
                <button
                    type="button"
                    onClick={() => changeLanguage('es')}
                    className={`lang-btn ${currentLang === 'es' ? 'active' : ''}`}
                    aria-label="Español"
                >
                    ES
                </button>
                <button
                    type="button"
                    onClick={() => changeLanguage('en')}
                    className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                    aria-label="English"
                >
                    EN
                </button>
            </div>
        </div>
    );
}
export default LanguageSelector;
