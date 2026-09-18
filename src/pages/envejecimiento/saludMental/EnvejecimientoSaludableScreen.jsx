import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import { getDatosPuntuacionFecha, getUsuarioRespuestasEnvejecimiento } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import logoColor from '../../../assets/img/logoColor.png';
import './EnvejecimientoSaludableScreen.css';

const BIO_RISK_LABELS = {
    es: { low: 'Riesgo Bajo', moderate: 'Riesgo Moderado', high: 'Riesgo Alto' },
    en: { low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk' },
};

const COGN_RISK_LABELS = {
    es: { high: 'Buena cognición', moderate: 'Cognición deteriorada', low: 'Cognición comprometida' },
    en: { high: 'Good cognition', moderate: 'Deteriorated cognition', low: 'Compromised cognition' },
};

const DET_RISK_LABELS = {
    es: { low: 'Cognición Normal', moderate: 'Deterioro Cognitivo', high: 'Probable Demencia' },
    en: { low: 'Normal Cognition', moderate: 'Cognitive Decline', high: 'Probable Dementia' },
};

function getBioRisk(diff, labels) {
    if (diff < 5) return { color: '#48bb78', label: labels.low };
    if (diff < 10) return { color: '#ed8936', label: labels.moderate };
    return { color: '#e53e3e', label: labels.high };
}

function getCognRisk(score, labels) {
    if (score >= 6) return { color: '#48bb78', label: labels.high };
    if (score >= 3) return { color: '#ed8936', label: labels.moderate };
    return { color: '#e53e3e', label: labels.low };
}

function getDetRisk(score, labels) {
    if (score <= 14) return { color: '#48bb78', label: labels.low };
    if (score <= 24) return { color: '#ed8936', label: labels.moderate };
    return { color: '#e53e3e', label: labels.high };
}

const RECOS_ES = {
    bio: {
        low: 'Felicidades. Tus hábitos han sido muy buenos. Sugerimos seguir consumiendo antioxidantes y durmiendo bien para mantener esta tendencia.',
        moderate: 'Tu reloj interno corre un poco más rápido. Tus órganos trabajan extra. Sugerimos ajustes urgentes en la alimentación y chequeos médicos generales de glucosa o riñones.',
        high: 'Alerta franca de envejecimiento biológico severo. Recomendamos acudir con un especialista (Geriatra, Nutriólogo) de manera directa.',
    },
    cogn: {
        low: 'Desempeño comprometido. Te invitamos de manera directa a consultar especialistas clínicos (Neurólogo, Neuropsicólogo, Geriatra) para descartar patologías mayores o demencias.',
        moderate: 'Desempeño moderado. Se notan fallos en atención y alerta. Sugerimos actividades cognitivas urgentes (lectura activa) e integrarse socialmente.',
        high: 'Desempeño adecuado. Te recomendamos no bajar el ritmo y seguir aprendiendo cosas nuevas (idiomas, instrumentos musicales) para mantener la neuroplasticidad del cerebro.',
    },
    det: {
        low: 'Riesgo bajo. Mantén tus hábitos actuales para preservar la velocidad de la memoria.',
        moderate: 'Riesgo moderado de deterioro. Presta atención al riesgo por comorbilidades (presión, diabetes), edad biológica y problemas motrices (caídas, vista).',
        high: 'Riesgo alto de deterioro cognitivo clínico. Es imperativo buscar una evaluación médica integral.',
    },
};

const RECOS_EN = {
    bio: {
        low: 'Congratulations. Your habits have been very good. We suggest continuing to consume antioxidants and sleeping well to maintain this trend.',
        moderate: 'Your internal clock runs a bit faster. Your organs are working extra hard. We suggest urgent dietary adjustments and general medical check-ups for glucose or kidneys.',
        high: 'Clear alert of severe biological aging. We recommend seeing a specialist (Geriatrician, Nutritionist) directly.',
    },
    cogn: {
        low: 'Compromised performance. We strongly encourage you to consult clinical specialists (Neurologist, Neuropsychologist, Geriatrician) to rule out major pathologies or dementia.',
        moderate: 'Moderate performance. Lapses in attention and alertness are noted. We suggest urgent cognitive activities (active reading) and social integration.',
        high: 'Adequate performance. We recommend keeping up the pace and continuing to learn new things (languages, musical instruments) to maintain brain neuroplasticity.',
    },
    det: {
        low: 'Low risk. Maintain your current habits to preserve memory speed.',
        moderate: 'Moderate risk of decline. Pay attention to risks from comorbidities (blood pressure, diabetes), biological age, and motor problems (falls, vision).',
        high: 'High risk of clinical cognitive decline. It is imperative to seek a comprehensive medical evaluation.',
    },
};

const NO_DATA_LABELS = {
    es: { noData: 'No hay datos disponibles', recoPrefix: 'Recomendaciones: ', noScore: 'No hay datos de puntuación disponibles para generar una recomendación.' },
    en: { noData: 'No data available', recoPrefix: 'Recommendations: ', noScore: 'No score data available to generate a recommendation.' },
};

const CARD_LABELS = {
    es: { lastResponse: 'Última respuesta generada', viewDetails: 'Ver detalles', bio: 'Marcadores biológicos de envejecimiento', cogn: 'Edad Cognitiva', det: 'Riesgo a Deterioro Cognitivo' },
    en: { lastResponse: 'Last generated response', viewDetails: 'View details', bio: 'Biological aging markers', cogn: 'Cognitive Age', det: 'Risk of Cognitive Decline' },
};

function RecoModal({ title, msg, onClose, acceptLabel }) {
    return (
        <div className="env-modal-overlay">
            <div className="env-modal">
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.2rem', fontWeight: '500' }}>{title}</h3>
                <p style={{ color: '#444', fontSize: '1rem', lineHeight: 1.4, margin: '10px 0' }}>{msg}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <button className="env-modal-btn" onClick={onClose}>{acceptLabel}</button>
                </div>
            </div>
        </div>
    );
}

export function EnvejecimientoSaludableScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const [isLoading, setIsLoading] = useState(true);
    const [bioData, setBioData] = useState(null);
    const [cognData, setCognData] = useState(null);
    const [detData, setDetData] = useState(null);
    const [reco, setReco] = useState(null);

    const RECOS = language === 'en' ? RECOS_EN : RECOS_ES;
    const noDataLabels = NO_DATA_LABELS[language] || NO_DATA_LABELS.es;
    const cardLabels = CARD_LABELS[language] || CARD_LABELS.es;
    const bioLabels = BIO_RISK_LABELS[language] || BIO_RISK_LABELS.es;
    const cognLabels = COGN_RISK_LABELS[language] || COGN_RISK_LABELS.es;
    const detLabels = DET_RISK_LABELS[language] || DET_RISK_LABELS.es;

    useEffect(() => {
        const fetchAll = async () => {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            try {
                const [respuestas, puntuaciones] = await Promise.all([
                    getUsuarioRespuestasEnvejecimiento(userId),
                    getDatosPuntuacionFecha(userId),
                ]);

                const sortByDateOrId = (a, b) => {
                    const dA = new Date(a.fecha_creacion || a.fecha || a.created_at);
                    const dB = new Date(b.fecha_creacion || b.fecha || b.created_at);
                    const validA = !isNaN(dA);
                    const validB = !isNaN(dB);
                    if (validA && validB) return dB - dA;
                    if (validA && !validB) return -1;
                    if (!validA && validB) return 1;
                    const idA = parseInt(a.id || a._id || 0);
                    const idB = parseInt(b.id || b._id || 0);
                    if (idA || idB) return idB - idA;
                    return 0;
                };

                const getLatest = (arr) => {
                    if (!arr || arr.length === 0) return null;
                    const sorted = [...arr].sort(sortByDateOrId);
                    const first = sorted[0];
                    const hasDate = !isNaN(new Date(first.fecha_creacion || first.fecha || first.created_at));
                    const hasId = !!(first.id || first._id);
                    if (!hasDate && !hasId) return sorted[sorted.length - 1];
                    return sorted[0];
                };

                // Bio markers: first check getUsuarioRespuestasEnvejecimiento for 'diferencia_anios'
                if (Array.isArray(respuestas) && respuestas.length > 0) {
                    const bioResp = respuestas.filter(r => r.id_cuestionario === 45);
                    const latestBioResp = getLatest(bioResp);
                    if (latestBioResp) {
                        const val = latestBioResp.diferencia_anios !== undefined ? latestBioResp.diferencia_anios : latestBioResp.puntuacion_final;
                        if (val !== undefined && val !== null && !isNaN(parseFloat(val))) {
                            setBioData(parseFloat(val));
                        }
                    }
                }
                
                // Fallback para bioData
                if (Array.isArray(puntuaciones)) {
                    setBioData(prevBioData => {
                        if (prevBioData !== null) return prevBioData;
                        const bioPunt = puntuaciones.filter(d => parseInt(d.id_cuestionario) === 45);
                        const latestBio = getLatest(bioPunt);
                        if (latestBio) return parseFloat(latestBio.puntuacion_final) || 0;
                        return null;
                    });

                    // Cognitive age (id 47)
                    const cogn = puntuaciones.filter(d => parseInt(d.id_cuestionario) === 47);
                    const latestCogn = getLatest(cogn);
                    if (latestCogn && latestCogn.puntuacion_final !== undefined) {
                        setCognData(parseFloat(latestCogn.puntuacion_final));
                    }

                    // Cognitive decline (id 48)
                    const det = puntuaciones.filter(d => parseInt(d.id_cuestionario) === 48);
                    const latestDet = getLatest(det);
                    if (latestDet && latestDet.puntuacion_final !== undefined) {
                        setDetData(parseFloat(latestDet.puntuacion_final));
                    }
                }
            } catch (_) {}
            setIsLoading(false);
        };
        fetchAll();
    }, [auth]);

    const bioRisk = bioData !== null ? getBioRisk(Math.abs(bioData), bioLabels) : null;
    const cognRisk = cognData !== null ? getCognRisk(cognData, cognLabels) : null;
    const detRisk = detData !== null ? getDetRisk(detData, detLabels) : null;

    const showReco = (type) => {
        let title, msg;
        if (type === 'bio') {
            title = cardLabels.bio;
            if (bioRisk) {
                const level = Math.abs(bioData) < 5 ? 'low' : Math.abs(bioData) < 10 ? 'moderate' : 'high';
                msg = `${noDataLabels.recoPrefix}${RECOS.bio[level]}`;
            } else {
                msg = noDataLabels.noScore;
            }
        } else if (type === 'cogn') {
            title = cardLabels.cogn;
            if (cognRisk) {
                const level = cognData >= 6 ? 'high' : cognData >= 3 ? 'moderate' : 'low';
                msg = `${noDataLabels.recoPrefix}${RECOS.cogn[level]}`;
            } else {
                msg = noDataLabels.noData;
            }
        } else if (type === 'det') {
            title = cardLabels.det;
            if (detRisk) {
                const level = detData <= 14 ? 'low' : detData <= 24 ? 'moderate' : 'high';
                msg = `${noDataLabels.recoPrefix}${RECOS.det[level]}`;
            } else {
                msg = noDataLabels.noData;
            }
        }
        setReco({ title, msg });
    };

    // Biological markers bar: range -10 to +20 years
    const bioBarPct = bioData !== null ? Math.min(Math.max(((bioData + 10) / 30) * 100, 0), 100) : 50;

    return (
        <div className="env-bg">
            <div className="env-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/envejecimiento/salud-mental')} />
                <h2>{cardLabels.det}</h2>
                <img src={logoColor} alt="Logo" className="header-small-logo" />
            </div>

            <div className="env-content">
                {isLoading ? (
                    <>
                        <div className="env-skeleton" />
                        <div className="env-skeleton" />
                        <div className="env-skeleton" />
                    </>
                ) : (
                    <>
                        {/* Card 1: Marcadores biológicos */}
                        <div className="env-card">
                            <div className="env-card-title-row">
                                <h3>{cardLabels.bio}</h3>
                            </div>
                            {bioData !== null ? (
                                <>
                                    <p className="env-diff-label">{cardLabels.lastResponse}</p>
                                    <div className="env-bio-gauge">
                                        <div className="env-bio-arrow" style={{ left: `calc(${bioBarPct}% - 10px)` }}>▼</div>
                                        <div className="env-bio-bar" />
                                    </div>
                                    <div className="env-risk-badge" style={{ color: bioRisk?.color }}>
                                        {bioRisk?.label === bioLabels.low ? '✔' : '●'} {bioRisk?.label}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="env-diff-label">{cardLabels.lastResponse}</p>
                                    <p className="env-no-data">{noDataLabels.noData}</p>
                                </>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button className="env-detail-btn" onClick={() => showReco('bio')}>{cardLabels.viewDetails}</button>
                            </div>
                        </div>

                        {/* Card 2: Edad cognitiva */}
                        <div className="env-card">
                            <div className="env-card-title-row">
                                <h3>{cardLabels.cogn}</h3>
                            </div>
                            {cognData !== null ? (
                                <>
                                    <p className="env-diff-label">{cardLabels.lastResponse}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 10 }}>
                                        <div className="env-solid-circle" style={{ backgroundColor: cognRisk?.color }}></div>
                                        <div className="env-solid-text" style={{ color: cognRisk?.color }}>
                                            {cognRisk?.label}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="env-diff-label" style={{ fontSize: '1.05rem', color: '#1a202c', textAlign: 'left', marginBottom: '8px' }}>{noDataLabels.noData}</p>
                                    <p className="env-diff-label" style={{ fontSize: '1.05rem', color: '#1a202c', textAlign: 'left' }}>{noDataLabels.noData}</p>
                                </>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', width: '100%' }}>
                                <button className="env-detail-btn" onClick={() => showReco('cogn')}>{cardLabels.viewDetails}</button>
                            </div>
                        </div>

                        {/* Card 3: Deterioro cognitivo */}
                        <div className="env-card">
                            <div className="env-card-title-row">
                                <h3>{cardLabels.det}</h3>
                            </div>
                            {detData !== null ? (
                                <>
                                    <p className="env-diff-label">{cardLabels.lastResponse}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 10 }}>
                                        <div className="env-solid-circle" style={{ backgroundColor: detRisk?.color }}></div>
                                        <div className="env-solid-text" style={{ color: detRisk?.color }}>
                                            {detRisk?.label}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="env-diff-label" style={{ fontSize: '1.05rem', color: '#1a202c', textAlign: 'left', marginBottom: '8px' }}>{noDataLabels.noData}</p>
                                    <p className="env-diff-label" style={{ fontSize: '1.05rem', color: '#1a202c', textAlign: 'left' }}>{noDataLabels.noData}</p>
                                </>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', width: '100%' }}>
                                <button className="env-detail-btn" onClick={() => showReco('det')}>{cardLabels.viewDetails}</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {reco && <RecoModal title={reco.title} msg={reco.msg} onClose={() => setReco(null)} acceptLabel={t('aceptar')} />}
        </div>
    );
}
