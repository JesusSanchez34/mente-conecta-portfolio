import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { postRespuestasEnvejecimientoEspecial } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import logoColor from '../../../assets/img/logoColor.png';
import './GenotipoScreen.css';

const GENOTIPOS = ['E1', 'E2', 'E3', 'E4'];

const RISK_MSGS = {
    es: {
        low: 'Su genotipo le confiere riesgo bajo, es difícil que se asocie con Alzheimer, sin embargo, hay que mantener su estilo de vida adecuado.',
        moderate: 'Su genotipo le confiere riesgo medio a Alzheimer. Es necesario mantener revisiones periódicas de su estilo de vida y consultar regularmente al médico, especialmente si es mayor a 65 años.',
        high: 'Su genotipo le confiere riesgo alto a Alzheimer. Es necesario que acuda a un especialista para evaluaciones complementarias e inicie tratamiento.',
    },
    en: {
        low: 'Your genotype confers a low risk; it is unlikely to be associated with Alzheimer\'s. However, maintaining a healthy lifestyle is recommended.',
        moderate: 'Your genotype confers a moderate risk of Alzheimer\'s. Periodic lifestyle check-ups and regular medical consultations are necessary, especially if you are over 65.',
        high: 'Your genotype confers a high risk of Alzheimer\'s. You should see a specialist for complementary evaluations and begin treatment.',
    },
};

function getRisk(v1, v2, riskLabel, riskMsgs) {
    if (!v1 || !v2) return null;
    const sorted = [v1, v2].sort().join('/');
    if (['E1/E1', 'E1/E2', 'E2/E2'].includes(sorted)) return { label: riskLabel.low, color: '#48bb78', msg: riskMsgs.low };
    if (['E1/E3', 'E2/E3', 'E3/E3'].includes(sorted)) return { label: riskLabel.moderate, color: '#ed8936', msg: riskMsgs.moderate };
    if (['E1/E4', 'E2/E4', 'E3/E4', 'E4/E4'].includes(sorted)) return { label: riskLabel.high, color: '#e53e3e', msg: riskMsgs.high };
    return null;
}

function getPuntuacion(v1, v2) {
    const sorted = [v1, v2].sort().join('/');
    if (['E1/E1', 'E1/E2', 'E2/E2', 'E2/E3'].includes(sorted)) return -1;
    if (['E1/E4', 'E2/E4', 'E3/E4'].includes(sorted)) return 4;
    if (sorted === 'E4/E4') return 7;
    return 0;
}

function getPuntuacionGenotipos(v1, v2) {
    const sorted = [v1, v2].sort().join('/');
    if (['E1/E1', 'E1/E2', 'E2/E2'].includes(sorted)) return 1;
    if (['E1/E3', 'E2/E3', 'E3/E3'].includes(sorted)) return 2;
    if (['E1/E4', 'E2/E4', 'E3/E4', 'E4/E4'].includes(sorted)) return 3;
    return 0;
}

function DropdownSelect({ value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="geno-dropdown">
            <div className="geno-dropdown-btn" onClick={() => setOpen(o => !o)}>
                <span style={{ color: value ? '#000' : '#999' }}>{value || placeholder}</span>
                <FaChevronDown className="geno-chevron" />
            </div>
            {open && (
                <div className="geno-dropdown-menu">
                    {GENOTIPOS.map(g => (
                        <div key={g} className="geno-dropdown-item" onClick={() => { onChange(g); setOpen(false); }}>
                            {g}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function GenotipoScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const [valor1, setValor1] = useState(null);
    const [valor2, setValor2] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const riskLabel = { low: t('genoRiesgoBajo'), moderate: t('genoRiesgoModerado'), high: t('genoRiesgoAlto') };
    const riskMsgs = RISK_MSGS[language] || RISK_MSGS.es;
    const risk = getRisk(valor1, valor2, riskLabel, riskMsgs);

    const handleSubmit = async () => {
        if (!valor1 || !valor2) {
            toast.warning(t('genoSeleccionaValores'));
            return;
        }
        setIsLoading(true);
        try {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            const puntuacion = getPuntuacion(valor1, valor2);
            const puntuacionGenotipos = getPuntuacionGenotipos(valor1, valor2);

            await postRespuestasEnvejecimientoEspecial({
                id_usuario: parseInt(userId),
                id_cuestionario: 49,
                id_pregunta: 534,
                respuesta_indices: {
                    pregunta1: { version: 1, respuesta1: valor1, respuesta2: valor2, raw: puntuacion }
                },
                puntuacion_final: puntuacion,
                puntuacion_genotipos: puntuacionGenotipos,
                estatus: true,
            });
            setShowSuccessModal(true);
        } catch (err) {
            toast.error('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="geno-bg">
            <div className="geno-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/envejecimiento/salud-mental')} />
                <h2>{t('genoTitulo')}</h2>
            </div>

            <div className="geno-content">
                <p className="geno-instructions">
                    {t('genoInstrucciones')}
                </p>

                <div className="geno-selectors">
                    <DropdownSelect value={valor1} onChange={v => setValor1(v)} placeholder="E1" />
                    <DropdownSelect value={valor2} onChange={v => setValor2(v)} placeholder="APOE" />
                </div>

                {risk && (
                    <div className="geno-result-card" style={{ borderColor: risk.color }}>
                        <div className="geno-result-row">
                            <span className="geno-combo">{valor1}/{valor2}</span>
                            <div className="geno-color-chip" style={{ background: risk.color }} />
                        </div>
                        <p className="geno-risk-label" style={{ color: risk.color }}>{risk.label}</p>
                        <p className="geno-risk-msg">{risk.msg}</p>
                    </div>
                )}
            </div>

            <div className="geno-footer">
                <button className="geno-btn" onClick={handleSubmit} disabled={isLoading || !valor1 || !valor2}>
                    {isLoading ? t('enviando') : t('enviar')}
                </button>
            </div>

            {showSuccessModal && (
                <div className="geno-modal-overlay">
                    <div className="geno-modal-content">
                        <img src={logoColor} alt="Mente Conecta" className="geno-modal-logo" />
                        <h2 className="geno-modal-title">{t('enviado')}</h2>
                        <p className="geno-modal-text">{t('respuestasLabGuardadas')}</p>
                        <button className="geno-modal-btn" onClick={() => navigate('/envejecimiento/salud-mental')}>{t('entendido')}</button>
                    </div>
                </div>
            )}

            <style>{`.back-icon { font-size:1.4rem; cursor:pointer; color:#1a202c; position:absolute; left:20px; }`}</style>
        </div>
    );
}
