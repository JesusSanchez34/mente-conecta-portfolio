import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { postRespuestasEnvejecimientoEspecial } from '../../../api/user';
import { AlertaGenericaModal, AlertaAvisoMedicoModal, AlertaConfirmacionModal } from '../../../components/alertas/AlertaModal';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { useSettings } from '../../../context/SettingsContext';
import './EdadCelularScreen.css';

function calcLR(telA, telB, refA, refB) {
    const promTel = (telA + telB) / 2;
    const promRef = (refA + refB) / 2;
    const dCt = promTel - promRef;
    return Math.pow(2, -dCt);
}

const INSTRUCTIONS_TEXT = {
    es: (
        <div style={{ textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                <li style={{ marginBottom: '8px' }}>• Introduce valores para R. Telómeros (7-20) y R. Referencia (7-20) (A=B)</li>
                <li style={{ marginBottom: '8px' }}>• Usa enteros o decimales con "."</li>
                <li style={{ marginBottom: '8px' }}>• Telómeros: rango 7 - 20</li>
                <li style={{ marginBottom: '8px' }}>• Referencia: rango 7 - 20</li>
                <li>• Promedios y resultado automáticos</li>
            </ul>
        </div>
    ),
    en: (
        <div style={{ textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                <li style={{ marginBottom: '8px' }}>• Enter values for T. Telomeres (7-20) and R. Reference (7-20) (A=B)</li>
                <li style={{ marginBottom: '8px' }}>• Use integers or decimals with "."</li>
                <li style={{ marginBottom: '8px' }}>• Telomeres: range 7 - 20</li>
                <li style={{ marginBottom: '8px' }}>• Reference: range 7 - 20</li>
                <li>• Averages and result are automatic</li>
            </ul>
        </div>
    ),
};

const GRID_HEADERS = {
    es: { tel: 'R. Telómeros', ref: 'R. Referencia' },
    en: { tel: 'T. Telomeres', ref: 'R. Reference' },
};

const FIELD_ERRORS = {
    es: { required: 'Requerido', range: (min, max) => `Rango: ${min} a ${max}` },
    en: { required: 'Required', range: (min, max) => `Range: ${min} to ${max}` },
};

const INFO_BOX_TEXT = {
    es: (min, max) => `Ingresar los valores de CT de telomeros y del gen de referencia\nRango ${min} - ${max}`,
    en: (min, max) => `Enter the CT values of telomeres and the reference gene\nRange ${min} - ${max}`,
};

export function EdadCelularScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const [values, setValues] = useState({ telA: '', telB: '', refA: '', refB: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false });
    const [exitModal, setExitModal] = useState(false);

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        const handlePopState = (e) => {
            e.preventDefault();
            setExitModal(true);
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const RANGE = [7, 20];

    const validate = (key, val) => {
        const n = parseFloat(val);
        const errs = FIELD_ERRORS[language] || FIELD_ERRORS.es;
        if (val === '' || isNaN(n)) return errs.required;
        if (n < RANGE[0] || n > RANGE[1]) return errs.range(RANGE[0], RANGE[1]);
        return null;
    };

    const handleChange = (key, val) => {
        setValues(v => ({ ...v, [key]: val }));
        setErrors(e => ({ ...e, [key]: validate(key, val) }));
    };

    const handleSubmit = () => {
        const newErrors = {};
        let hasEmpty = false;
        let hasRange = false;
        const requiredLabel = (FIELD_ERRORS[language] || FIELD_ERRORS.es).required;
        Object.keys(values).forEach(k => {
            const err = validate(k, values[k]);
            if (err) {
                newErrors[k] = err;
                if (err === requiredLabel) hasEmpty = true;
                else hasRange = true;
            }
        });
        setErrors(newErrors);
        if (hasEmpty) {
            return;
        }
        if (hasRange) {
            setConfirmModal({ open: true });
            return;
        }
        doSubmit();
    };

    const doSubmit = async () => {
        setIsLoading(true);
        try {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            const telA = parseFloat(values.telA);
            const telB = parseFloat(values.telB);
            const refA = parseFloat(values.refA);
            const refB = parseFloat(values.refB);
            const lr = calcLR(telA, telB, refA, refB);

            await postRespuestasEnvejecimientoEspecial({
                id_usuario: parseInt(userId),
                id_cuestionario: 46,
                id_pregunta: 531,
                respuestas: { tel_A: telA, tel_B: telB, ref_A: refA, ref_B: refB },
                puntuacion_final: lr,
                estatus: true,
            });
            navigate('/ValorLongitudRelativa');
        } catch (err) {
            toast.error('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const gridHeaders = GRID_HEADERS[language] || GRID_HEADERS.es;
    const infoBoxText = (INFO_BOX_TEXT[language] || INFO_BOX_TEXT.es)(RANGE[0], RANGE[1]);
    const requiredLabel = (FIELD_ERRORS[language] || FIELD_ERRORS.es).required;

    return (
        <div className="edad-celular-bg">
            <div className="edad-celular-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => setExitModal(true)} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="edad-celular-info-btn" onClick={() => setShowInstructions(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>

            <div className="edad-celular-content">
                <div className="edad-celular-grid">
                    <div className="grid-header-row">
                        <div className="grid-empty"></div>
                        <div className="grid-title">{gridHeaders.tel}</div>
                        <div className="grid-title">{gridHeaders.ref}</div>
                    </div>

                    <div className="grid-input-row">
                        <div className="grid-label">A</div>
                        <div className="grid-input-column">
                            <div className={`grid-input-wrapper ${errors.telA ? (errors.telA === requiredLabel ? 'has-error' : 'has-range-error') : ''}`}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={RANGE[0]}
                                    max={RANGE[1]}
                                    value={values.telA}
                                    onChange={e => handleChange('telA', e.target.value)}
                                    onBlur={() => handleChange('telA', values.telA)}
                                    className="grid-input"
                                />
                            </div>
                            {errors.telA && <span className="grid-input-error-text">{errors.telA}</span>}
                        </div>
                        <div className="grid-input-column">
                            <div className={`grid-input-wrapper ${errors.refA ? (errors.refA === requiredLabel ? 'has-error' : 'has-range-error') : ''}`}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={RANGE[0]}
                                    max={RANGE[1]}
                                    value={values.refA}
                                    onChange={e => handleChange('refA', e.target.value)}
                                    onBlur={() => handleChange('refA', values.refA)}
                                    className="grid-input"
                                />
                            </div>
                            {errors.refA && <span className="grid-input-error-text">{errors.refA}</span>}
                        </div>
                    </div>

                    <div className="grid-input-row">
                        <div className="grid-label">B</div>
                        <div className="grid-input-column">
                            <div className={`grid-input-wrapper ${errors.telB ? (errors.telB === requiredLabel ? 'has-error' : 'has-range-error') : ''}`}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={RANGE[0]}
                                    max={RANGE[1]}
                                    value={values.telB}
                                    onChange={e => handleChange('telB', e.target.value)}
                                    onBlur={() => handleChange('telB', values.telB)}
                                    className="grid-input"
                                />
                            </div>
                            {errors.telB && <span className="grid-input-error-text">{errors.telB}</span>}
                        </div>
                        <div className="grid-input-column">
                            <div className={`grid-input-wrapper ${errors.refB ? (errors.refB === requiredLabel ? 'has-error' : 'has-range-error') : ''}`}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={RANGE[0]}
                                    max={RANGE[1]}
                                    value={values.refB}
                                    onChange={e => handleChange('refB', e.target.value)}
                                    onBlur={() => handleChange('refB', values.refB)}
                                    className="grid-input"
                                />
                            </div>
                            {errors.refB && <span className="grid-input-error-text">{errors.refB}</span>}
                        </div>
                    </div>
                </div>

                <div className="edad-celular-info-box">
                    <FaInfoCircle className="info-icon" />
                    <p>
                        {infoBoxText.split('\n').map((line, i) => (
                            <React.Fragment key={i}>{line}{i < infoBoxText.split('\n').length - 1 && <br/>}</React.Fragment>
                        ))}
                    </p>
                </div>

                <button
                    className="edad-celular-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? t('enviando') : t('enviar')}
                </button>
            </div>

            <AlertaGenericaModal
                isOpen={showInstructions}
                title={t('instrucciones')}
                description={INSTRUCTIONS_TEXT[language] || INSTRUCTIONS_TEXT.es}
                onConfirm={() => setShowInstructions(false)}
            />

            <AlertaAvisoMedicoModal
                isOpen={confirmModal.open}
                title={t('parametroFueraRango')}
                description={t('parametroFueraRangoMsg')}
                onConfirm={() => { setConfirmModal({ open: false }); doSubmit(); }}
                onCancel={() => setConfirmModal({ open: false })}
            />

            <AlertaConfirmacionModal
                isOpen={exitModal}
                title={t('estasSeguroSalir')}
                description={t('noGuardaranCambios')}
                onCancel={() => setExitModal(false)}
                onConfirm={() => navigate('/marcadores-biologicos')}
            />
        </div>
    );
}
