import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { FaHeart, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks';
import { SpeedDialPaciente } from '../../components/ui/SpeedDialPaciente';
import './ConfiguracionPaciente.css';

export function ConfiguracionPaciente() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Settings synced with localStorage
    const [lang, setLang] = useState(() => localStorage.getItem('mente_conecta_lang') || 'es');
    const [textSize, setTextSize] = useState(() => localStorage.getItem('mente_conecta_text_size') || 'md');
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('mente_conecta_high_contrast') === 'true');
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('mente_conecta_sound') !== 'false');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mente_conecta_dark_mode') === 'true');
    const [readingMode, setReadingMode] = useState(() => localStorage.getItem('mente_conecta_reading_mode') || 'normal');

    // Slider value for text size: sm=0, md=1, lg=2
    const sizeToSlider = { sm: 0, md: 1, lg: 2 };
    const sliderToSize = ['sm', 'md', 'lg'];
    const [sliderVal, setSliderVal] = useState(sizeToSlider[textSize] ?? 1);

    useEffect(() => {
        localStorage.setItem('mente_conecta_lang', lang);
    }, [lang]);

    useEffect(() => {
        const size = sliderToSize[sliderVal];
        setTextSize(size);
        localStorage.setItem('mente_conecta_text_size', size);
    }, [sliderVal]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_high_contrast', highContrast ? 'true' : 'false');
    }, [highContrast]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_sound', soundEnabled ? 'true' : 'false');
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_dark_mode', darkMode ? 'true' : 'false');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_reading_mode', readingMode);
    }, [readingMode]);

    const handleSave = () => {
        navigate('/paciente/inicio');
    };

    if (auth === undefined) return null;
    if (!auth || auth?.detail || Number(auth?.typeLogin) !== 3) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className={[
            'config-page-container',
            `patient-text-${textSize}`,
            darkMode ? 'config-dark-mode' : '',
            readingMode === 'dislexia' ? 'config-dyslexia' : '',
            highContrast ? 'patient-high-contrast' : '',
        ].filter(Boolean).join(' ')}>
            {/* Header */}
            <header className="config-top-bar">
                <button type="button" className="config-back-btn" onClick={() => navigate('/paciente/inicio')}>
                    <FaArrowLeft />
                </button>
                <h1 className="config-top-title">
                    {lang === 'es' ? 'Ayuda y configuraciones' : 'Help & Settings'}
                </h1>
            </header>

            {/* Floating Background Icons */}
            <div className="config-floating-bg">
                <GiBrain className="config-floating-icon c-icon-1" />
                <FaShieldAlt className="config-floating-icon c-icon-2" />
                <FaHeart className="config-floating-icon c-icon-3" />
                <GiBrain className="config-floating-icon c-icon-4" />
                <FaHeart className="config-floating-icon c-icon-5" />
                <FaShieldAlt className="config-floating-icon c-icon-6" />
            </div>

            <main className="config-content">

                {/* ── Tamaño de Letra ── */}
                <div className="config-card">
                    <h2 className="config-card-title">
                        {lang === 'es' ? 'Tamaño de letra' : 'Font size'}
                    </h2>
                    <div className="config-slider-row">
                        <span className="config-slider-label-sm">Aa</span>
                        <input
                            type="range"
                            min={0}
                            max={2}
                            step={1}
                            value={sliderVal}
                            onChange={(e) => setSliderVal(Number(e.target.value))}
                            className="config-slider"
                        />
                        <span className="config-slider-label-lg">Aa</span>
                    </div>
                    <div className="config-slider-ticks">
                        <span className={sliderVal === 0 ? 'active' : ''}>
                            {lang === 'es' ? 'Pequeño' : 'Small'}
                        </span>
                        <span className={sliderVal === 1 ? 'active' : ''}>
                            {lang === 'es' ? 'Normal' : 'Normal'}
                        </span>
                        <span className={sliderVal === 2 ? 'active' : ''}>
                            {lang === 'es' ? 'Grande' : 'Large'}
                        </span>
                    </div>
                </div>

                {/* ── Apariencia Visual ── */}
                <div className="config-card">
                    <h2 className="config-card-title">
                        {lang === 'es' ? 'Apariencia Visual' : 'Visual Appearance'}
                    </h2>
                    <p className="config-card-subtitle">
                        {lang === 'es' ? 'Elige tu tema favorito' : 'Choose your favorite theme'}
                    </p>
                    <div className="config-theme-row">
                        {/* Modo Claro */}
                        <button
                            type="button"
                            className={`config-theme-btn ${!darkMode ? 'selected' : ''}`}
                            onClick={() => setDarkMode(false)}
                        >
                            <div className="config-theme-preview light-preview">
                                <FaHeart className="theme-preview-icon" />
                            </div>
                            <span className="config-theme-label">
                                {lang === 'es' ? 'Modo claro' : 'Light mode'}
                            </span>
                            <div className={`config-theme-check ${!darkMode ? 'checked' : ''}`}>
                                {!darkMode && <span>✓</span>}
                            </div>
                        </button>

                        {/* Modo Oscuro */}
                        <button
                            type="button"
                            className={`config-theme-btn ${darkMode ? 'selected' : ''}`}
                            onClick={() => setDarkMode(true)}
                        >
                            <div className="config-theme-preview dark-preview">
                                <FaHeart className="theme-preview-icon" />
                            </div>
                            <span className="config-theme-label">
                                {lang === 'es' ? 'Modo oscuro' : 'Dark mode'}
                            </span>
                            <div className={`config-theme-check ${darkMode ? 'checked' : ''}`}>
                                {darkMode && <span>✓</span>}
                            </div>
                        </button>
                    </div>
                </div>

                {/* ── Selector de modo de lectura ── */}
                <div className="config-card">
                    <h2 className="config-card-title">
                        {lang === 'es' ? 'Selector de modo de lectura' : 'Reading mode'}
                    </h2>
                    <div className="config-reading-row">
                        <button
                            type="button"
                            className={`config-reading-btn ${readingMode === 'normal' ? 'selected' : ''}`}
                            onClick={() => setReadingMode('normal')}
                        >
                            <span className="config-reading-icon">📖</span>
                            <span className="config-reading-label-aa">Aa</span>
                            <span className="config-reading-name">Normal</span>
                        </button>
                        <button
                            type="button"
                            className={`config-reading-btn ${readingMode === 'dislexia' ? 'selected' : ''}`}
                            onClick={() => setReadingMode('dislexia')}
                        >
                            <span className="config-reading-icon">👁️</span>
                            <span className="config-reading-label-aa config-reading-label-dyslexia">Aa</span>
                            <span className="config-reading-name">Dislexia</span>
                        </button>
                    </div>
                </div>

                {/* ── Guardar ── */}
                <button type="button" className="config-save-btn" onClick={handleSave}>
                    {lang === 'es' ? 'Guardar configuración y salir' : 'Save settings & exit'}
                </button>

            </main>

            <SpeedDialPaciente
                lang={lang}
                setLang={setLang}
                textSize={textSize}
                setTextSize={setTextSize}
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
            />
        </div>
    );
}
