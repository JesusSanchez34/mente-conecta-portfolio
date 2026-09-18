import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import './ConfiguracionScreen.css';

export function ConfiguracionScreen() {
    const navigate = useNavigate();
    const { fontSize, isDarkMode, isDyslexiaFont, setFontSize, toggleDarkMode, toggleDyslexiaFont, saveSettings, revertSettings, t } = useSettings();
    const [guardado, setGuardado] = useState(false);

    const handleGuardar = async () => {
        await saveSettings();
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2500);
    };

    const handleVolver = () => {
        revertSettings();
        navigate(-1);
    };

    const fontOptions = [
        {
            size: 14,
            label: t('pequena'),
            icon: (
                <span className="cfg-font-icon">
                    <span className="cfg-font-a" style={{ fontSize: '16px' }}>A</span>
                    <span className="cfg-font-minus">−</span>
                </span>
            ),
        },
        {
            size: 16,
            label: t('normal'),
            icon: (
                <span className="cfg-font-icon cfg-font-tt">
                    <span className="cfg-font-t-big">T</span>
                    <span className="cfg-font-t-small">T</span>
                </span>
            ),
        },
        {
            size: 18,
            label: t('grande'),
            icon: (
                <span className="cfg-font-icon">
                    <span className="cfg-font-a" style={{ fontSize: '22px' }}>A</span>
                    <span className="cfg-font-plus">+</span>
                </span>
            ),
        },
    ];

    return (
        <div className="cfg-bg">
            <div className="cfg-wrapper">
                <button className="cfg-back-btn" onClick={handleVolver} title="Volver">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>

                <div className="cfg-title-card">
                    <h1 className="cfg-title">{t('ayuda')}</h1>
                </div>

                <div className="cfg-card">
                    <p className="cfg-label">{t('tamanoLetra')}</p>
                    <div className="cfg-font-row">
                        {fontOptions.map((opt) => (
                            <button
                                key={opt.size}
                                className={`cfg-font-btn ${fontSize === opt.size ? 'cfg-font-btn--active' : ''}`}
                                onClick={() => setFontSize(opt.size)}
                            >
                                {opt.icon}
                                <span className="cfg-font-btn-label">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cfg-card">
                    <div className="cfg-toggle-row">
                        <span className="cfg-toggle-label">{t('claro')}</span>
                        <label className="cfg-switch">
                            <input type="checkbox" checked={isDarkMode} onChange={(e) => toggleDarkMode(e.target.checked)} />
                            <span className="cfg-slider" />
                        </label>
                        <span className="cfg-toggle-label">{t('oscuro')}</span>
                    </div>
                </div>

                <div className="cfg-card">
                    <div className="cfg-toggle-row">
                        <span className="cfg-toggle-label">{t('normal')}</span>
                        <label className="cfg-switch">
                            <input type="checkbox" checked={isDyslexiaFont} onChange={(e) => toggleDyslexiaFont(e.target.checked)} />
                            <span className="cfg-slider" />
                        </label>
                        <span className="cfg-toggle-label">{t('dislexia')}</span>
                    </div>
                </div>

                {guardado && <p className="cfg-success">{t('configGuardada')}</p>}

                <button className="cfg-save-btn" onClick={handleGuardar}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    {t('guardarConfig')}
                </button>
            </div>
        </div>
    );
}
