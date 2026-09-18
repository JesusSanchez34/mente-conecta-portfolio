import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaGlobe, FaRegNewspaper, FaTimes, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { TRANSLATIONS } from '../../utils/translations';
import './SpeedDialPaciente.css';

export function SpeedDialPaciente({
    lang,
    setLang,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    soundEnabled,
    setSoundEnabled
}) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    // Menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Only show speed dial for Conasama patients (typeLogin === 3)
    if (Number(auth?.typeLogin) !== 3) {
        return null;
    }

    const t = TRANSLATIONS[lang];

    const getNestedVal = (obj, key) => {
        if (!obj) return null;
        if (obj[key] !== undefined && obj[key] !== null) return obj[key];
        if (obj.paciente && obj.paciente[key] !== undefined && obj.paciente[key] !== null) return obj.paciente[key];
        if (obj.patient && obj.patient[key] !== undefined && obj.patient[key] !== null) return obj.patient[key];
        if (obj.paciente_data && obj.paciente_data[key] !== undefined && obj.paciente_data[key] !== null) return obj.paciente_data[key];
        if (obj.usuario && obj.usuario[key] !== undefined && obj.usuario[key] !== null) return obj.usuario[key];
        return null;
    };

    const getCleanVal = (val) => {
        if (!val) return null;
        if (typeof val !== 'string') return val;
        
        let target = val.trim();
        
        // 1. Si está envuelto en el formato de bytes de Python b'...' o b"..."
        if (/^b['"]/i.test(target) && (target.endsWith("'") || target.endsWith('"'))) {
            target = target.slice(2, -1);
        }
        
        // 2. Si parece ser una cadena cifrada o binaria cruda en formato de escape (\x...)
        // O si contiene secuencias \x que son típicas de representación de bytes
        if (/^\\x/i.test(target) || target.toLowerCase().startsWith('\\x') || /\\x[0-9a-fA-F]{2}/.test(target) || /^x[0-9a-fA-F]+$/i.test(target)) {
            try {
                const cleanHex = target.replace(/^\\x/i, '').replace(/^x/i, '').replace(/\\x/g, '');
                if (/^[0-9a-fA-F]+$/.test(cleanHex)) {
                    const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    const decoded = new TextDecoder('utf-8').decode(bytes);
                    
                    const hasControlChars = [...decoded].some(char => {
                        const code = char.charCodeAt(0);
                        return (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
                    });
                    if (!hasControlChars) {
                        return decoded.trim();
                    }
                }
            } catch (e) {
                // Ignorar error de decodificación
            }
            return null;
        }
        
        // 3. Comprobación final: si la cadena contiene caracteres de control binarios directos
        const hasControl = [...target].some(char => {
            const code = char.charCodeAt(0);
            return (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
        });
        if (hasControl) {
            return null;
        }
        
        return target;
    };

    const nombre = getCleanVal(getNestedVal(auth?.me, 'nombre'));
    const apPaterno = getCleanVal(getNestedVal(auth?.me, 'apellido_paterno'));
    const apMaterno = getCleanVal(getNestedVal(auth?.me, 'apellido_materno'));
    const firstName = getCleanVal(getNestedVal(auth?.me, 'first_name'));
    const lastName = getCleanVal(getNestedVal(auth?.me, 'last_name'));

    let fullName = 'Paciente';
    if (nombre) {
        fullName = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ').trim();
    } else if (firstName) {
        fullName = `${firstName} ${lastName || ''}`.trim();
    } else {
        fullName = auth?.me?.username || auth?.me?.email || 'Paciente';
    }

    const toggleLanguage = () => {
        const nextLang = lang === 'es' ? 'en' : 'es';
        setLang(nextLang);
        toast.info(nextLang === 'es' ? "Idioma cambiado a Español" : "Language changed to English");
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* ==================== FLOATING SPEED DIAL MENU ==================== */}
            <div className={`patient-speed-dial-container ${isMenuOpen ? 'open' : ''}`}>
                <div className="speed-dial-stack">
                    {/* User Profile */}
                    <button
                        type="button"
                        className="speed-dial-btn speed-dial-btn-blue"
                        onClick={() => { navigate('/paciente/perfil'); setIsMenuOpen(false); }}
                    >
                        <FaUser />
                        <span className="speed-dial-tooltip">{t.tooltipProfile}</span>
                    </button>

                    {/* Settings */}
                    <button
                        type="button"
                        className="speed-dial-btn speed-dial-btn-blue"
                        onClick={() => { navigate('/paciente/configuracion'); setIsMenuOpen(false); }}
                    >
                        <FaCog />
                        <span className="speed-dial-tooltip">{t.tooltipSettings}</span>
                    </button>

                    {/* Web / Globe (Language Toggle) */}
                    <button
                        type="button"
                        className="speed-dial-btn speed-dial-btn-teal"
                        onClick={toggleLanguage}
                    >
                        <FaGlobe />
                        <span className="speed-dial-tooltip">{t.tooltipLanguage}</span>
                    </button>

                    {/* Newspaper / News */}
                    <button
                        type="button"
                        className="speed-dial-btn speed-dial-btn-blue"
                        onClick={() => { navigate('/paciente/noticias'); setIsMenuOpen(false); }}
                    >
                        <FaRegNewspaper />
                        <span className="speed-dial-tooltip">{t.tooltipNews}</span>
                    </button>
                </div>

                {/* Main Trigger Button */}
                <button
                    type="button"
                    className="speed-dial-btn speed-dial-btn-blue speed-dial-trigger"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* ==================== PROFILE MODAL ==================== */}
            <div className={`patient-modal-overlay ${showProfileModal ? 'show' : ''}`} onClick={() => setShowProfileModal(false)}>
                <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="patient-modal-close" onClick={() => setShowProfileModal(false)}>
                        <FaTimes />
                    </button>
                    <div className="patient-modal-header">
                        <FaUser className="patient-modal-header-icon" />
                        <h2 className="patient-modal-title">{t.profileTitle}</h2>
                    </div>
                    <div className="profile-modal-info">
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t.nameLabel}</span>
                            <span className="profile-info-value">
                                {fullName}
                            </span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t.emailLabel}</span>
                            <span className="profile-info-value">{auth?.me?.email || auth?.me?.username || 'No registrado'}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t.roleLabel}</span>
                            <span className="profile-info-value">{t.patientRole}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="profile-logout-btn"
                        onClick={() => {
                            setShowProfileModal(false);
                            logout();
                            toast.success(lang === 'es' ? 'Sesión cerrada con éxito' : 'Signed out successfully');
                            navigate('/admin');
                        }}
                    >
                        <FaSignOutAlt /> {t.signOutBtn}
                    </button>
                </div>
            </div>

            {/* ==================== SETTINGS MODAL ==================== */}
            <div className={`patient-modal-overlay ${showSettingsModal ? 'show' : ''}`} onClick={() => setShowSettingsModal(false)}>
                <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="patient-modal-close" onClick={() => setShowSettingsModal(false)}>
                        <FaTimes />
                    </button>
                    <div className="patient-modal-header">
                        <FaCog className="patient-modal-header-icon" />
                        <h2 className="patient-modal-title">{t.settingsTitle}</h2>
                    </div>
                    
                    <div className="settings-option">
                        <div className="settings-option-label">
                            <span className="settings-option-title">{t.textSizeTitle}</span>
                            <span className="settings-option-desc">{t.textSizeDesc}</span>
                        </div>
                        <div className="fontsize-control">
                            <button
                                type="button"
                                className={`fontsize-btn ${textSize === 'sm' ? 'active' : ''}`}
                                onClick={() => setTextSize('sm')}
                                title={lang === 'es' ? "Texto Pequeño" : "Small Text"}
                            >
                                A-
                            </button>
                            <button
                                type="button"
                                className={`fontsize-btn ${textSize === 'md' ? 'active' : ''}`}
                                onClick={() => setTextSize('md')}
                                title={lang === 'es' ? "Texto Normal" : "Normal Text"}
                            >
                                A
                            </button>
                            <button
                                type="button"
                                className={`fontsize-btn ${textSize === 'lg' ? 'active' : ''}`}
                                onClick={() => setTextSize('lg')}
                                title={lang === 'es' ? "Texto Grande" : "Large Text"}
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    <div className="settings-option">
                        <div className="settings-option-label">
                            <span className="settings-option-title">{t.soundTitle}</span>
                            <span className="settings-option-desc">{t.soundDesc}</span>
                        </div>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={(e) => setSoundEnabled(e.target.checked)}
                            />
                            <span className="switch-slider"></span>
                        </label>
                    </div>

                    <div className="settings-option">
                        <div className="settings-option-label">
                            <span className="settings-option-title">{t.contrastTitle}</span>
                            <span className="settings-option-desc">{t.contrastDesc}</span>
                        </div>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                            />
                            <span className="switch-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
