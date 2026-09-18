import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    FaHeart, FaShieldAlt, FaLock,
    FaArrowLeft, FaClipboardCheck, FaSpinner
} from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { useAuth, useCuestionario } from '../../hooks';
import { toast } from 'react-toastify';
import { aceptarConsentimientoApi, cancelarConsentimientoApi } from '../../api/user';
import { TRANSLATIONS } from '../../utils/translations';
import { SpeedDialPaciente } from '../../components/ui/SpeedDialPaciente';
import './InicioPaciente.css';

// Import new image assets
import personalImg from '../../assets/img/personal_paciente.png';
import saludImg from '../../assets/img/personal_salud.png';
import familiarImg from '../../assets/img/familiar_paciente.png';

// Import module images for welcome screen
import sociodemograficoImg from '../../assets/img/social demmografico-conasama.png';
import saludMentalImg from '../../assets/img/salud mental-conasama.png';
import determinanteImg from '../../assets/img/determinante social-conasama.png';

// ── Module metadata ──────────────────────────────────────────────────────────
// Each entry has keywords to match against the section "titulo" returned by API.
// The first section whose title includes any of the keywords wins the slot.
const MODULE_SLOTS = [
    {
        key:        'sociodemografico',
        img:        sociodemograficoImg,
        label:      'SOCIODEMOGRÁFICOS',
        desc:       'Recopilación de datos básicos de Identidad y Entorno.',
        keywords:   ['socio', 'demogr', 'personal'],
        defaultId:  1,
        color:      '#2b5fc0',
        intro:      'En esta sección contestará preguntas básicas, que nos ayudarán a conocerlo, como datos sobre su origen, género, estatura, etc. Es importante señalar que su nombre será decodificado con una clave numérica, para mantener siempre su anonimato e información protegida.',
    },
    {
        key:        'saludmental',
        img:        saludMentalImg,
        label:      'SALUD MENTAL',
        desc:       'Evaluación Psicológica y Emocional.',
        keywords:   ['salud mental', 'mental', 'psicol', 'emocional'],
        defaultId:  2,
        color:      '#7c3aed',
        intro:      'El envejecimiento es un proceso gradual y continuo donde muchas funciones del cuerpo comienzan a disminuir gradualmente. Tradicionalmente, la edad de 65 años se considera como el comienzo de la vejez. Esta edad es cercana a la edad real de jubilación de la mayoría de las personas que viven en sociedades económicamente avanzadas.',
    },
    {
        key:        'determinantes',
        img:        determinanteImg,
        label:      'DETERMINANTES SOCIALES',
        desc:       'Factores Sociales, Económicos y Ambientales que afectan tu salud.',
        keywords:   ['determinante', 'social', 'entorno', 'econom', 'ambient'],
        defaultId:  3,
        color:      '#3aaa5c',
        intro:      'Los determinantes sociales son las condiciones sociales, económicas y físicas del lugar donde una persona nace, vive, estudia, trabaja, se divierte y envejece, que situaciones pueden afectar su salud, el bienestar y la calidad de vida. En esta sección buscaremos conocer que determinantes sociales, pueden afectar su salud.',
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const MODULE_COLOR_PALETTE = [
    '#7c3aed', '#3aaa5c', '#f5a623',
    '#2b5fc0', '#07afb8', '#e74c8b',
];

function getRandomColors() {
    const shuffled = [...MODULE_COLOR_PALETTE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
}

/** Match a backend section to one of the 3 UI slots by keyword */
function matchSlot(seccion) {
    const titleLower = (seccion.titulo || seccion.title || '').toLowerCase();
    return MODULE_SLOTS.find(slot =>
        slot.keywords.some(kw => titleLower.includes(kw))
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function InicioPaciente() {
    const { auth } = useAuth();
    const navigate         = useNavigate();
    const { getSecciones } = useCuestionario();

    // Screen-flow state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showConsent,       setShowConsent]      = useState(false);
    const [consentChecked,    setConsentChecked]   = useState(false);
    const [apiLoading,        setApiLoading]       = useState(false);
    const [showWelcomeScreen, setShowWelcomeScreen]= useState(false);
    const [moduleColors,      setModuleColors]     = useState(getRandomColors);

    // Modal state
    const [introModalData, setIntroModalData] = useState(null);
    const [introAccepted,  setIntroAccepted]  = useState(false);

    // Dynamic sections from API
    const [resolvedSlots, setResolvedSlots] = useState(
        MODULE_SLOTS.map(s => ({ ...s, seccionId: s.defaultId, titulo: s.label, descripcion: s.intro }))
    );
    const [sectionsLoading, setSectionsLoading] = useState(false);

    // Settings preferences synced with localStorage
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [textSize, setTextSize] = useState(() => localStorage.getItem('mente_conecta_text_size') || 'md');
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('mente_conecta_high_contrast') === 'true');
    const [lang, setLang] = useState(() => localStorage.getItem('mente_conecta_lang') || 'es');
    const [darkMode] = useState(() => localStorage.getItem('mente_conecta_dark_mode') === 'true');
    const [readingMode] = useState(() => localStorage.getItem('mente_conecta_reading_mode') || 'normal');

    useEffect(() => {
        localStorage.setItem('mente_conecta_lang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_text_size', textSize);
    }, [textSize]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_high_contrast', highContrast ? 'true' : 'false');
    }, [highContrast]);

    const t = TRANSLATIONS[lang];

    // Fetch real section IDs when welcome screen is shown
    useEffect(() => {
        if (!showWelcomeScreen || !auth?.token) return;

        const fetchSections = async () => {
            setSectionsLoading(true);
            try {
                // Use patient age from profile (fallback 25)
                const edad = auth.me?.edad || auth.me?.age || 25;
                const secciones = await getSecciones(edad, auth.token);

                if (Array.isArray(secciones) && secciones.length > 0) {
                    setResolvedSlots(prev => {
                        const updated = prev.map(slot => ({ ...slot }));

                        secciones.forEach(seccion => {
                            const match = matchSlot(seccion);
                            if (match) {
                                const idx = updated.findIndex(s => s.key === match.key);
                                if (idx !== -1) {
                                    updated[idx] = {
                                        ...updated[idx],
                                        seccionId:   seccion.id,
                                        titulo:      seccion.titulo || seccion.title || match.label,
                                        descripcion: seccion.descripcion || seccion.description || match.intro,
                                    };
                                }
                            }
                        });
                        return updated;
                    });
                }
            } catch (err) {
                console.warn('No se pudieron obtener secciones del servidor, usando IDs por defecto:', err.message);
            } finally {
                setSectionsLoading(false);
            }
        };

        fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showWelcomeScreen, auth?.token]);

    // Route guards – after hooks
    if (auth === undefined) return null;
    if (!auth || auth?.detail) return <Navigate to="/admin" replace />;

    const isConasama = Number(auth?.typeLogin) === 3;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSelectOption = (optionName) => {
        setSelectedCategory(optionName);
        setShowConsent(true);
    };

    const handleCheckboxChange = async (e) => {
        const checked = e.target.checked;
        setApiLoading(true);
        try {
            if (checked) {
                await aceptarConsentimientoApi(auth.token);
                setConsentChecked(true);
                toast.success(lang === 'es' ? "Consentimiento aceptado con éxito" : "Consent accepted successfully");
            } else {
                const userId = auth.me?.id || auth.me?.user_id || 1;
                await cancelarConsentimientoApi(userId, auth.token);
                setConsentChecked(false);
                toast.info(lang === 'es' ? "Consentimiento cancelado" : "Consent cancelled");
            }
        } catch (error) {
            toast.error(error.message || (lang === 'es' ? "Error al procesar el consentimiento." : "Error processing consent."));
        } finally {
            setApiLoading(false);
        }
    };

    const handleContinue = () => {
        if (!consentChecked) {
            toast.warning(lang === 'es' ? "Debes aceptar el consentimiento informado para continuar." : "You must accept the informed consent to continue.");
            return;
        }
        setModuleColors(getRandomColors());
        setShowConsent(false);
        setShowWelcomeScreen(true);
    };

    const handleBackFromWelcome = () => {
        setShowWelcomeScreen(false);
        setShowConsent(true);
    };

    const handleBackToSelect = () => {
        setShowConsent(false);
        setConsentChecked(false);
    };

    const handleModuleClick = (slot) => {
        setIntroModalData({
            id:         slot.seccionId,
            titulo:     slot.titulo,
            descripcion:slot.intro,   // always use the curated intro text
        });
        setIntroAccepted(false);
    };

    const handleIntroStart = () => {
        if (!introAccepted) return;
        const data = introModalData;
        setIntroModalData(null);
        navigate('/paciente/cuestionarios', {
            state: {
                seccionId: data.id,
                titulo:    data.titulo,
            }
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={[
            'patient-landing-container',
            showWelcomeScreen ? 'welcome-screen-active' : '',
            isConasama ? `patient-text-${textSize}` : '',
            isConasama && highContrast ? 'patient-high-contrast' : '',
            isConasama && darkMode && !highContrast ? 'patient-dark-mode' : '',
            isConasama && readingMode === 'dislexia' ? 'patient-dyslexia' : '',
        ].filter(Boolean).join(' ')}>

            {/* ════════════ STEP 3: WELCOME / MODULE SELECTION ════════════ */}
            {showWelcomeScreen && (
                <>
                    <header className="welcome-top-bar">
                        <button type="button" className="welcome-back-btn" onClick={handleBackFromWelcome}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="welcome-top-title">{t.welcome}</h1>
                    </header>

                    <div className="patient-floating-bg">
                        <GiBrain       className="patient-floating-icon p-icon-1" />
                        <FaShieldAlt   className="patient-floating-icon p-icon-2" />
                        <FaHeart       className="patient-floating-icon p-icon-3" />
                        <GiBrain       className="patient-floating-icon p-icon-4" />
                        <FaHeart       className="patient-floating-icon p-icon-5" />
                        <FaShieldAlt   className="patient-floating-icon p-icon-6" />
                    </div>

                    <main className="welcome-modules-container">
                        {sectionsLoading && (
                            <div className="sections-loading-overlay">
                                <FaSpinner className="sections-spinner" />
                            </div>
                        )}

                        {resolvedSlots.map((slot, i) => {
                            let title = slot.titulo;
                            let desc = slot.descripcion;
                            if (slot.key === 'sociodemografico') {
                                title = t.sociodemographics;
                                desc = t.sociodemographicsDesc;
                            } else if (slot.key === 'saludmental') {
                                title = t.mentalHealth;
                                desc = t.mentalHealthDesc;
                            } else if (slot.key === 'determinantes') {
                                title = t.socialDeterminants;
                                desc = t.socialDeterminantsDesc;
                            }

                            return (
                                <div
                                    key={slot.key}
                                    className="welcome-module-card"
                                    style={{ backgroundColor: moduleColors[i] || slot.color, cursor: 'pointer' }}
                                    onClick={() => handleModuleClick(slot)}
                                >
                                    <div className="module-img-wrapper">
                                        <img src={slot.img} alt={title} className="module-thumb" />
                                    </div>
                                    <div className="module-info">
                                        <h2 className="module-title">{title}</h2>
                                        <p className="module-desc">{desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </main>
                </>
            )}

            {/* ════════════ STEP 1: PERSON SELECTION ════════════ */}
            {!showConsent && !showWelcomeScreen && (
                <>
                    <header className="patient-header">
                        <div className="patient-header-card">
                            <h1 className="patient-header-title">{t.whoPerform}</h1>
                        </div>
                    </header>

                    <div className="patient-floating-bg">
                        <GiBrain     className="patient-floating-icon p-icon-1" />
                        <FaShieldAlt className="patient-floating-icon p-icon-2" />
                        <FaHeart     className="patient-floating-icon p-icon-3" />
                        <GiBrain     className="patient-floating-icon p-icon-4" />
                        <FaHeart     className="patient-floating-icon p-icon-5" />
                        <FaShieldAlt className="patient-floating-icon p-icon-6" />
                    </div>

                    <main className="patient-options-container">
                        <div className="new-card card-personal" onClick={() => handleSelectOption('Personal')}>
                            <div className="card-bg-image" style={{ backgroundImage: `url("${personalImg}")` }}></div>
                            <div className="card-overlay"></div>
                            <div className="card-content"><h2 className="card-title">{t.personal}</h2></div>
                        </div>
                        <div className="new-card card-salud" onClick={() => handleSelectOption('Personal de salud')}>
                            <div className="card-bg-image" style={{ backgroundImage: `url("${saludImg}")` }}></div>
                            <div className="card-overlay"></div>
                            <div className="card-content"><h2 className="card-title">{t.healthStaff}</h2></div>
                        </div>
                        <div className="new-card card-familiar" onClick={() => handleSelectOption('Familiar')}>
                            <div className="card-bg-image" style={{ backgroundImage: `url("${familiarImg}")` }}></div>
                            <div className="card-overlay"></div>
                            <div className="card-content"><h2 className="card-title">{t.familyMember}</h2></div>
                        </div>
                    </main>
                </>
            )}

            {/* ════════════ STEP 2: INFORMED CONSENT ════════════ */}
            {showConsent && !showWelcomeScreen && (
                <>
                    <div className="patient-floating-bg">
                        <GiBrain     className="patient-floating-icon p-icon-1" />
                        <FaShieldAlt className="patient-floating-icon p-icon-2" />
                        <FaHeart     className="patient-floating-icon p-icon-3" />
                        <GiBrain     className="patient-floating-icon p-icon-4" />
                        <FaHeart     className="patient-floating-icon p-icon-5" />
                        <FaShieldAlt className="patient-floating-icon p-icon-6" />
                    </div>

                    <main className="consent-view-container">
                        <div className="consent-simple-header">
                            <button type="button" className="consent-back-btn-simple" onClick={handleBackToSelect} title={t.back}>
                                <FaArrowLeft />
                            </button>
                            <div className="consent-title-row">
                                <FaClipboardCheck className="consent-header-icon-simple" />
                                <h1 className="consent-title-text">
                                    {selectedCategory === 'Personal' ? t.informedConsent : t.informedAssent}
                                </h1>
                            </div>
                        </div>

                        <div className="consent-paper-card">
                            <div className="consent-section">
                                <div className="consent-section-title-wrapper stripe-blue-purple">
                                    <span className="consent-stripe"></span>
                                    <h3 className="consent-section-title">{t.objectiveTitle}</h3>
                                </div>
                                <p className="consent-text">{t.objectiveText}</p>
                            </div>
                            <div className="consent-section">
                                <div className="consent-section-title-wrapper stripe-purple-green">
                                    <span className="consent-stripe"></span>
                                    <h3 className="consent-section-title">{t.purposeTitle}</h3>
                                </div>
                                <p className="consent-text">{t.purposeText}</p>
                            </div>
                            <div className="consent-section">
                                <div className="consent-section-title-wrapper stripe-green-orange">
                                    <span className="consent-stripe"></span>
                                    <h3 className="consent-section-title">{t.confidentialityTitle}</h3>
                                </div>
                                <p className="consent-text">{t.confidentialityText}</p>
                            </div>
                            <div className="consent-section">
                                <div className="consent-section-title-wrapper stripe-orange-blue">
                                    <span className="consent-stripe"></span>
                                    <h3 className="consent-section-title">{t.coordinationTitle}</h3>
                                </div>
                                <p className="consent-text">{t.coordinationText1}</p>
                                <p className="consent-text">{t.coordinationText2}</p>
                            </div>
                            <div className="consent-declaration-box">
                                <div className="declaration-header">
                                    <FaLock className="lock-icon-blue" />
                                    <h4 className="declaration-title">
                                        {selectedCategory === 'Personal' ? t.declarationTitleConsent : t.declarationTitleAssent}
                                    </h4>
                                </div>
                                <p className="declaration-body-text">
                                    {selectedCategory === 'Personal' ? t.declarationBodyConsent : t.declarationBodyAssent}
                                </p>
                            </div>
                        </div>

                        <div className="consent-checkbox-card">
                            <label className="checkbox-label-wrapper">
                                <input type="checkbox" className="consent-checkbox-input" checked={consentChecked} onChange={handleCheckboxChange} disabled={apiLoading} />
                                <span className="checkbox-label-text">{t.termsCheckbox}</span>
                            </label>
                            {apiLoading && <div className="consent-spinner-inline"></div>}
                        </div>

                        <div className="consent-action-wrapper">
                            <button
                                type="button"
                                className={`consent-continue-btn ${consentChecked ? 'enabled' : 'disabled'}`}
                                onClick={handleContinue}
                                disabled={!consentChecked || apiLoading}
                            >
                                {t.continue}
                            </button>
                        </div>
                    </main>
                </>
            )}

            {/* ════════════ MODULE INTRODUCTION MODAL ════════════ */}
            {introModalData && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card animate-scale-up">
                        <div className="mca-modal-header centered-header">
                            <div className="modal-brain-logo-wrapper">
                                <GiBrain className="modal-brain-logo" />
                            </div>
                            <h3 className="mca-modal-title uppercase-title">{introModalData.titulo}</h3>
                        </div>
                        <div className="mca-modal-body">
                            <p className="questionnaire-instructions-text" style={{ textAlign: 'justify' }}>
                                {introModalData.descripcion}
                            </p>
                            <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        className="consent-checkbox-input"
                                        checked={introAccepted}
                                        onChange={(e) => setIntroAccepted(e.target.checked)}
                                    />
                                    <span className="checkbox-label-text" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                        {lang === 'es' ? 'Acepto la introducción.' : 'I accept the introduction.'}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="mca-modal-footer dual-buttons" style={{ padding: '1rem 2rem 2.5rem' }}>
                            <button type="button" className="modal-btn-action btn-cancel" onClick={() => setIntroModalData(null)}>
                                {lang === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                type="button"
                                className="modal-btn-action btn-confirm-start"
                                onClick={handleIntroStart}
                                disabled={!introAccepted}
                                style={{
                                    opacity:    introAccepted ? 1 : 0.5,
                                    cursor:     introAccepted ? 'pointer' : 'not-allowed',
                                    background: introAccepted ? 'linear-gradient(180deg, #07afb8 0%, #911d80 100%)' : '#e2e8f0',
                                    color:      introAccepted ? '#ffffff' : '#94a3b8',
                                    boxShadow:  introAccepted ? '0 10px 20px rgba(145,29,128,0.25)' : 'none',
                                }}
                            >
                                {lang === 'es' ? 'Comenzar' : 'Start'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
