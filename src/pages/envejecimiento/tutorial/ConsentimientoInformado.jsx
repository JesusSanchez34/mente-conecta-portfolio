import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import { activarConsentimiento, activarAsentimiento } from '../../../api/envejecimientoService';
import './ConsentimientoInformado.css';

const SECCIONES_ES = [
    { titulo: 'Introducción', texto: 'El envejecimiento es un proceso natural, gradual y continuo en el que diversas funciones del cuerpo comienzan a disminuir de manera progresiva. Tradicionalmente, se considera que la edad de 65 años marca el inicio de esta etapa de la vida, coincidiendo con la jubilación y con cambios importantes en los hábitos y en distintos aspectos personales y sociales.\n\nSabemos que, en muchas ocasiones, hablar del envejecimiento puede generar temor o incertidumbre. Sin embargo, queremos acompañarle en esta etapa para que la viva de forma saludable, con dignidad y confianza, sabiendo que todo lo que le ofrecemos está respaldado por la ciencia.\n\nSi está leyendo este consentimiento, es porque le interesa cuidar su salud y comprender mejor su proceso de envejecimiento.' },
    { titulo: 'Objetivo', texto: 'El objetivo de este estudio es evaluar si su proceso de envejecimiento se desarrolla de manera saludable, mediante la aplicación de cuestionarios y procedimientos biológicos que nos permitirán conocer su estado actual y ofrecerle seguimiento si así lo requiere.' },
    { titulo: 'Propósito', texto: 'Implementar un sistema que permita la detección y atención temprana del proceso de envejecimiento, con el fin de ofrecerle distintas intervenciones que puedan favorecer su bienestar. Además, si se detecta algún problema emocional o de otra índole, se le informará de manera oportuna.' },
    { titulo: 'Procedimientos', texto: 'Se le presentarán preguntas relacionadas con su salud médica y su vida cotidiana, con la opción de guardar su información para fines de evaluación y seguimiento.' },
    { titulo: 'Beneficios', texto: 'Podrá conocer su edad epigenética en comparación con su edad cronológica, así como identificar posibles indicadores de ansiedad, depresión o riesgo genético de deterioro neurocognitivo. Esta información permitirá brindarle una propuesta terapéutica personalizada, que usted podrá aceptar de manera totalmente voluntaria.' },
    { titulo: 'Confidencialidad', texto: 'Toda la información que nos proporcione será tratada con absoluta confidencialidad y utilizada únicamente con fines de evaluación. Sus datos no serán compartidos con ningún tercero y quedarán identificados mediante un número de registro.' },
    { titulo: 'Participación voluntaria y retiro', texto: 'Su participación en este estudio es completamente voluntaria. Usted tiene plena libertad para decidir si desea participar o retirarse en cualquier momento, sin que esto implique consecuencia negativa alguna para usted.' },
    { titulo: 'Riesgos potenciales y compensación', texto: 'Los posibles riesgos derivados de su participación son mínimos. Si alguna de las preguntas le resulta incómoda, tiene el derecho de no responder.' },
    { titulo: 'Coordinación del programa y protección de datos personales', texto: 'El coordinador será responsable de orientarle durante su participación, y la protección de sus datos personales estará a cargo del equipo profesional que atiende su caso. Todos los datos serán resguardados conforme a lo dispuesto por la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.\n\nLos datos solicitados serán utilizados exclusivamente en este estudio. En cualquier momento, usted podrá solicitar la corrección o eliminación de su información, así como retirar su consentimiento para su uso.' },
    { titulo: 'Declaración de consentimiento', lista: ['He leído esta carta de consentimiento.', 'He recibido respuestas satisfactorias a mis preguntas.', 'Entiendo la información proporcionada y doy mi consentimiento para participar.'] },
];

const SECCIONES_EN = [
    { titulo: 'Introduction', texto: 'Aging is a natural, gradual, and continuous process in which various body functions begin to progressively decline. Traditionally, age 65 is considered the beginning of this stage of life, coinciding with retirement and important changes in habits and various personal and social aspects.\n\nWe know that talking about aging can sometimes cause fear or uncertainty. However, we want to accompany you through this stage so that you can live it in a healthy, dignified, and confident way, knowing that everything we offer is backed by science.\n\nIf you are reading this consent, it is because you are interested in taking care of your health and better understanding your aging process.' },
    { titulo: 'Objective', texto: 'The objective of this study is to evaluate whether your aging process is developing in a healthy way, through questionnaires and biological procedures that will allow us to understand your current state and offer follow-up if needed.' },
    { titulo: 'Purpose', texto: 'To implement a system that enables early detection and attention to the aging process, in order to offer various interventions that may promote your well-being. Additionally, if any emotional or other issue is detected, you will be informed in a timely manner.' },
    { titulo: 'Procedures', texto: 'You will be presented with questions related to your medical health and daily life, with the option to save your information for evaluation and follow-up purposes.' },
    { titulo: 'Benefits', texto: 'You will be able to learn your epigenetic age compared to your chronological age, as well as identify possible indicators of anxiety, depression, or genetic risk for neurocognitive decline. This information will allow us to provide a personalized therapeutic proposal, which you may accept on a completely voluntary basis.' },
    { titulo: 'Confidentiality', texto: 'All information you provide will be treated with absolute confidentiality and used solely for evaluation purposes. Your data will not be shared with any third party and will be identified by a registration number.' },
    { titulo: 'Voluntary participation and withdrawal', texto: 'Your participation in this study is completely voluntary. You are free to decide whether to participate or withdraw at any time, without any negative consequence to you.' },
    { titulo: 'Potential risks and compensation', texto: 'The possible risks arising from your participation are minimal. If any question makes you uncomfortable, you have the right not to answer.' },
    { titulo: 'Program coordination and personal data protection', texto: 'The coordinator will be responsible for guiding you during your participation, and the protection of your personal data will be managed by the professional team handling your case. All data will be safeguarded in accordance with the General Law on Protection of Personal Data Held by Obligated Parties.\n\nThe data requested will be used exclusively for this study. At any time, you may request the correction or deletion of your information, as well as withdraw your consent for its use.' },
    { titulo: 'Declaration of consent', lista: ['I have read this consent letter.', 'I have received satisfactory answers to my questions.', 'I understand the information provided and give my consent to participate.'] },
];

const IosSpinner = () => (
    <div style={{ position: 'relative', width: '20px', height: '20px' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    top: '8px',
                    left: '9px',
                    width: '2px',
                    height: '5px',
                    backgroundColor: '#a0aec0',
                    borderRadius: '1px',
                    transform: `rotate(${i * 45}deg) translateY(-7px)`,
                    animation: `ios-spin 0.8s linear infinite`,
                    animationDelay: `-${(8 - i) * 0.1}s`,
                }}
            />
        ))}
        <style>
            {`
            @keyframes ios-spin {
                0% { opacity: 1; }
                100% { opacity: 0.2; }
            }
            `}
        </style>
    </div>
);

export function ConsentimientoInformado() {
    const [aceptado, setAceptado] = useState(false);
    const [checkingBox, setCheckingBox] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const SECCIONES = language === 'en' ? SECCIONES_EN : SECCIONES_ES;
    const navigate = useNavigate();
    const location = useLocation();

    const isConsentimiento = location.pathname === '/consentimiento';

    const handleContinuar = async () => {
        if (!aceptado || loading) return;
        setLoading(true);
        setError(null);
        try {
            const usuarioId = auth?.userId;
            const token = auth?.token;
            if (isConsentimiento) {
                await activarConsentimiento(usuarioId, token);
            } else {
                await activarAsentimiento(usuarioId, token);
            }
            navigate('/inicio-paciente');
        } catch (err) {
            setError(err.message || t('errorGuardar'));
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (e) => {
        if (checkingBox || loading) return;
        const isChecked = e.target.checked;
        if (isChecked) {
            setCheckingBox(true);
            setTimeout(() => {
                setCheckingBox(false);
                setAceptado(true);
            }, 1000);
        } else {
            setAceptado(false);
        }
    };

    return (
        <div className="ci-bg">
            <div className="ci-wrapper">
                <div className="ci-title-card">
                    <h1 className="ci-title">{t('consentimientoTitulo')}</h1>
                </div>

                <div className="ci-content">
                    {SECCIONES.map((sec) => (
                        <div key={sec.titulo} className="ci-seccion">
                            <h2 className="ci-seccion-titulo">{sec.titulo}</h2>
                            {sec.texto && sec.texto.split('\n\n').map((parrafo, i) => (
                                <p key={i} className="ci-parrafo">{parrafo}</p>
                            ))}
                            {sec.lista && (
                                <ul className="ci-lista">
                                    {sec.lista.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                <div className="ci-footer">
                    <div className="ci-checkbox-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <label style={{ display: 'flex', alignItems: 'center', margin: 0, cursor: (loading || checkingBox) ? 'not-allowed' : 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={aceptado}
                                onChange={handleCheckboxChange}
                                className="ci-checkbox"
                                disabled={loading || checkingBox}
                            />
                            <span>{t('aceptarTerminos')}</span>
                        </label>
                        {checkingBox && (
                            <IosSpinner />
                        )}
                    </div>

                    {error && <p className="ci-error">{error}</p>}

                    <button
                        className="ci-btn"
                        disabled={!aceptado || loading}
                        onClick={handleContinuar}
                    >
                        {loading ? t('procesando') : t('continuar')}
                    </button>
                </div>
            </div>
        </div>
    );
}
