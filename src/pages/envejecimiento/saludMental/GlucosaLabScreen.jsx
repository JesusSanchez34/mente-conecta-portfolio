import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { postRespuestasEnvejecimientoEspecial } from '../../../api/user';
import { AlertaGenericaModal, AlertaAvisoMedicoModal, AlertaConfirmacionModal } from '../../../components/alertas/AlertaModal';
import { useSettings } from '../../../context/SettingsContext';
import './GlucosaLabScreen.css';

const INSTRUCTIONS_TEXT = {
    es: 'Con los exámenes de laboratorio de rutina, podremos calcular tu edad fisiológica, es decir, la edad que tus órganos y sistemas tienen con respecto a tu edad cronológica y asociada a su funcionamiento.',
    en: 'With routine laboratory tests, we can calculate your physiological age, that is, the age your organs and systems are relative to your chronological age based on their function.',
};

const FIELDS_ES = [
    { key: 'edad', label: 'Edad', unit: 'años', min: 18, max: 120 },
    { key: 'albumina', label: 'Albúmina', unit: 'g/dL', min: 2, max: 7 },
    { key: 'creatinina', label: 'Creatinina', unit: 'mg/dL', min: 0.2, max: 2 },
    { key: 'glucosa', label: 'Glucosa', unit: 'mg/dL', min: 40, max: 300 },
    { key: 'proteinaC', label: 'Proteína C-reac (PCR)', unit: 'mg/L', min: 0, max: 50 },
    { key: 'linfocitos', label: 'Linfocitos', unit: '%', min: 0, max: 100 },
    { key: 'vcm', label: 'Volumen celular medio (VCM)', unit: 'fL', min: 70, max: 120 },
    { key: 'rdw', label: 'Ancho distribución glóbulos rojos (RDW)', unit: '%', min: 10, max: 20 },
    { key: 'fosfatasa', label: 'Fosfatasa alcalina', unit: 'U/L', min: 0, max: 200 },
    { key: 'globulos', label: 'Glóbulos blancos', unit: 'cells/mL', min: 2, max: 20 },
];

const FIELDS_EN = [
    { key: 'edad', label: 'Age', unit: 'years', min: 18, max: 120 },
    { key: 'albumina', label: 'Albumin', unit: 'g/dL', min: 2, max: 7 },
    { key: 'creatinina', label: 'Creatinine', unit: 'mg/dL', min: 0.2, max: 2 },
    { key: 'glucosa', label: 'Glucose', unit: 'mg/dL', min: 40, max: 300 },
    { key: 'proteinaC', label: 'C-reactive protein (CRP)', unit: 'mg/L', min: 0, max: 50 },
    { key: 'linfocitos', label: 'Lymphocytes', unit: '%', min: 0, max: 100 },
    { key: 'vcm', label: 'Mean corpuscular volume (MCV)', unit: 'fL', min: 70, max: 120 },
    { key: 'rdw', label: 'Red cell distribution width (RDW)', unit: '%', min: 10, max: 20 },
    { key: 'fosfatasa', label: 'Alkaline phosphatase', unit: 'U/L', min: 0, max: 200 },
    { key: 'globulos', label: 'White blood cells', unit: 'cells/mL', min: 2, max: 20 },
];

const LAB_LABELS = {
    es: { label: 'Laboratorio:', placeholder: 'Nombre del laboratorio' },
    en: { label: 'Laboratory:', placeholder: 'Laboratory name' },
};

const FIELD_REQUIRED_LABEL = {
    es: 'Campo requerido',
    en: 'Required field',
};

// FIELDS is kept for the formula calculation (uses same keys; label/unit don't matter there)
const FIELDS = FIELDS_ES;

function calcEdadFenotipica(vals, edadCronologica) {
    const albumina = parseFloat(vals.albumina) || 0;
    const creatinina = parseFloat(vals.creatinina) || 0;
    const glucosa = parseFloat(vals.glucosa) || 0;
    const proteinaC = parseFloat(vals.proteinaC) || 0;
    const linfocitos = parseFloat(vals.linfocitos) || 0;
    const vcm = parseFloat(vals.vcm) || 0;
    const rdw = parseFloat(vals.rdw) || 0;
    const fosfatasa = parseFloat(vals.fosfatasa) || 0;
    const globulos = parseFloat(vals.globulos) || 0;

    const albumina_conv = albumina * 10.0;
    const creatinina_conv = creatinina * 88.4;
    const glucosa_conv = glucosa * 0.0555;
    const proteinaC_adj = proteinaC <= 0 ? 0.0001 : proteinaC;
    const crp_conv = Math.log(proteinaC_adj * 0.1);

    const linComb = -19.9067
        + albumina_conv * (-0.0336)
        + creatinina_conv * 0.0095
        + glucosa_conv * 0.1953
        + crp_conv * 0.0954
        + linfocitos * (-0.012)
        + vcm * 0.0268
        + rdw * 0.3306
        + fosfatasa * 0.0019
        + globulos * 0.0554
        + edadCronologica * 0.0804;

    const gamma = 0.0076927;
    const t = 120;
    const exp_g_t = Math.exp(gamma * t);
    const term_mort = (exp_g_t - 1) / gamma;
    const mortalityScore = 1 - Math.exp(-Math.exp(linComb) * term_mort);

    const logArg = 1 - mortalityScore;
    const safeLog = logArg > 0 ? logArg : 1e-15;
    const phenoAge = 141.50225 + (Math.log(-0.00553 * Math.log(safeLog)) / 0.09165);
    const phenoAgeAdj = phenoAge / (1 + 1.28047 * Math.exp(0.0344329 * (-182.344 + phenoAge)));
    const dMScore = 1 - Math.exp(-0.000520363523 * Math.exp(0.090165 * phenoAgeAdj));

    const safe = v => isFinite(v) ? parseFloat(v.toFixed(4)) : 0;
    return { linComb: safe(linComb), mortalityScore: safe(mortalityScore), phenoAge: safe(phenoAge), phenoAgeLevine: safe(phenoAgeAdj), dMScore: safe(dMScore) };
}

export function GlucosaLabScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const [values, setValues] = useState({ edad: '', albumina: '', creatinina: '', glucosa: '', proteinaC: '', linfocitos: '', vcm: '', rdw: '', fosfatasa: '', globulos: '', laboratorio: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [exitModal, setExitModal] = useState(false);
    const [emptyModal, setEmptyModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    const ACTIVE_FIELDS = language === 'en' ? FIELDS_EN : FIELDS_ES;
    const requiredLabel = FIELD_REQUIRED_LABEL[language] || FIELD_REQUIRED_LABEL.es;
    const labLabels = LAB_LABELS[language] || LAB_LABELS.es;

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

    const validate = (key, val) => {
        const field = ACTIVE_FIELDS.find(f => f.key === key);
        if (!field) return null;
        const n = parseFloat(val);
        if (val === '' || isNaN(n)) return requiredLabel;
        if (n < field.min || n > field.max) return language === 'en'
            ? `Range: ${field.min} to ${field.max} ${field.unit}`
            : `Rango: ${field.min} a ${field.max} ${field.unit}`;
        return null;
    };

    const handleChange = (key, val) => {
        setValues(v => ({ ...v, [key]: val }));
        setErrors(e => ({ ...e, [key]: validate(key, val) }));
    };

    const doSubmit = async () => {
        setIsLoading(true);
        try {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            const edad = parseFloat(values.edad);
            const result = calcEdadFenotipica(values, edad);
            const phenoAge = result.phenoAge;

            const respuestas = {};
            FIELDS.forEach(f => { if (f.key !== 'edad') respuestas[f.key] = values[f.key]; });
            respuestas.laboratorio = values.laboratorio;
            respuestas.edad_cronologica = Math.round(edad).toString();
            respuestas.edad_fenotipica = phenoAge.toFixed(1);
            respuestas.diferencia_anios = (phenoAge - edad).toFixed(1);
            respuestas.phenoAge = result.phenoAge;
            respuestas.linComb = result.linComb;
            respuestas.mortalityScore = result.mortalityScore;
            respuestas.phenoAgeLevine = result.phenoAgeLevine;
            respuestas.d_mscore = result.dMScore.toString();

            await postRespuestasEnvejecimientoEspecial({
                id_usuario: parseInt(userId),
                id_cuestionario: 45,
                id_pregunta: 530,
                respuestas,
                puntuacion_final: phenoAge - edad,
                estatus: true,
            });
            setSuccessModal(true);
        } catch (err) {
            toast.error('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
        let hasEmpty = false;
        const rangeErrors = [];
        ACTIVE_FIELDS.forEach(({ key }) => {
            const err = validate(key, values[key]);
            if (err) {
                newErrors[key] = err;
                if (err === requiredLabel) hasEmpty = true;
                else rangeErrors.push(key);
            }
        });
        setErrors(newErrors);
        if (hasEmpty) {
            const firstEmpty = Object.keys(newErrors).find(k => newErrors[k] === requiredLabel);
            if (firstEmpty) {
                document.getElementById(`field-${firstEmpty}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setEmptyModal(true); 
            return; 
        }
        if (rangeErrors.length > 0) {
            document.getElementById(`field-${rangeErrors[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setConfirmModal(true);
            return;
        }
        doSubmit();
    };

    return (
        <div className="glucosa-bg">
            <div className="glucosa-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => setExitModal(true)} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="glucosa-info-btn" onClick={() => setShowInstructions(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>

            <div className="glucosa-content">
                {ACTIVE_FIELDS.map(({ key, label, unit }) => (
                    <div key={key} id={`field-${key}`} className={`glucosa-field-card ${errors[key] ? (errors[key] === requiredLabel ? 'has-error' : 'has-range-error') : ''}`}>
                        <label className="field-label">{label}</label>
                        <div className="field-input-row">
                            <input
                                type="number"
                                step="0.01"
                                value={values[key]}
                                onChange={e => handleChange(key, e.target.value)}
                                placeholder={language === 'en' ? 'Enter value' : 'Ingrese valor'}
                                className="field-input"
                            />
                            <span className="field-unit">{unit}</span>
                        </div>
                        {errors[key] && <span className={errors[key] === requiredLabel ? "field-error" : "field-range-error"}>{errors[key]}</span>}
                    </div>
                ))}

                <div className="glucosa-field-card">
                    <label className="field-label">{labLabels.label}</label>
                    <input
                        type="text"
                        value={values.laboratorio}
                        onChange={e => setValues(v => ({ ...v, laboratorio: e.target.value }))}
                        placeholder={labLabels.placeholder}
                        className="glucosa-text-input"
                    />
                </div>

                <button className="glucosa-btn" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? t('enviando') : t('enviar')}
                </button>
            </div>

            <AlertaGenericaModal
                isOpen={showInstructions}
                title={t('instrucciones')}
                description={INSTRUCTIONS_TEXT[language] || INSTRUCTIONS_TEXT.es}
                onConfirm={() => setShowInstructions(false)}
            />

            <AlertaGenericaModal
                isOpen={emptyModal}
                title={t('camposRequeridos')}
                description={t('camposRequeridosMsg')}
                confirmText={t('entendido')}
                onConfirm={() => setEmptyModal(false)}
            />

            <AlertaAvisoMedicoModal
                isOpen={confirmModal}
                title={t('parametroFueraRango')}
                description={t('parametroFueraRangoMsg')}
                onConfirm={() => { setConfirmModal(false); doSubmit(); }}
                onCancel={() => setConfirmModal(false)}
            />

            <AlertaConfirmacionModal
                isOpen={exitModal}
                title={t('estasSeguroSalir')}
                description={t('noGuardaranCambios')}
                onCancel={() => setExitModal(false)}
                onConfirm={() => navigate('/marcadores-biologicos')}
            />

            <AlertaGenericaModal
                isOpen={successModal}
                title={t('enviado')}
                description={t('respuestasLabGuardadas')}
                confirmText={t('entendido')}
                onConfirm={() => {
                    setSuccessModal(false);
                    navigate('/marcadores-biologicos');
                }}
            />
        </div>
    );
}
