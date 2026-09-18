import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { postRespuestasEnvejecimientoEspecial } from '../../../api/user';
import { AlertaGenericaModal, AlertaConfirmacionModal } from '../../../components/alertas/AlertaModal';
import logoColor from '../../../assets/img/logoColor.png';
import { useSettings } from '../../../context/SettingsContext';
import './DeterioroCognitivoScreen.css';

const PREGUNTAS_ES = [
    { pregunta: 'Indique su edad, por favor.', opciones: [{ texto: 'Mayor de 65 años', puntos: 3, respuesta: 'Mayor de 65' }, { texto: 'Entre 45 y 65 años', puntos: 1, respuesta: 'Entre 45 y 65' }, { texto: 'Menor de 45 años', puntos: 0, respuesta: 'Menos de 45' }] },
    { pregunta: '¿Ha tenido problemas de memoria?', opciones: [{ texto: 'Ha sido diagnosticado por un especialista con problemas de memoria', puntos: 5, respuesta: 'Diagnosticado' }, { texto: 'Se ha perdido en lugares que antes conocía', puntos: 3, respuesta: 'Se ha perdido' }, { texto: 'Olvida eventos importantes o nombres y rostros de personas conocidas', puntos: 2, respuesta: 'Olvida eventos' }, { texto: 'Olvida cosas recientes, como dónde dejó las llaves o sus lentes', puntos: 1, respuesta: 'Olvida cosas recientes' }, { texto: 'Nunca', puntos: 0, respuesta: 'Nunca' }] },
    { pregunta: '¿A algún miembro de su familia le han diagnosticado demencia o enfermedad de Alzheimer?', opciones: [{ texto: 'Sí, padres o hermanos', puntos: 5, respuesta: 'Familiares directos' }, { texto: 'Sí, solo abuelos, tíos o primos', puntos: 3, respuesta: 'Familiares indirectos' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Ha sido diagnosticado con hipertensión arterial?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Ha sido diagnosticado con diabetes mellitus?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Indique su índice de masa corporal (IMC), por favor.', opciones: [{ texto: 'IMC > 30 kg/m²', puntos: 2, respuesta: 'IMC > 30' }, { texto: 'IMC entre 25 y 30 kg/m²', puntos: 1, respuesta: 'IMC 25-30' }, { texto: 'IMC < 25 kg/m²', puntos: 0, respuesta: 'IMC < 25' }] },
    { pregunta: '¿Realiza usted algún deporte durante al menos 30 minutos, dos veces por semana?', opciones: [{ texto: 'Sí', puntos: 0, respuesta: 'Sí' }, { texto: 'No', puntos: 2, respuesta: 'No' }] },
    { pregunta: '¿Cuántos años de escolaridad ha completado usted?', opciones: [{ texto: 'Menos de 6 años', puntos: 3, respuesta: 'Menos de 6' }, { texto: 'Entre 6 y 9 años', puntos: 1, respuesta: 'Entre 6 y 9' }, { texto: 'Más de 9 años', puntos: 0, respuesta: 'Más de 9' }] },
    { pregunta: '¿Alguna vez ha sido diagnosticado por un especialista con trastorno depresivo mayor, ansiedad, esquizofrenia o trastorno bipolar?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Fuma usted o ha fumado durante más de un año?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Ha tenido un golpe fuerte en la cabeza que le haya hecho perder el conocimiento?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Ha sido diagnosticado con alguna enfermedad vascular cerebral?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Tiene problemas para escuchar?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Actualmente, con quién vive usted?', opciones: [{ texto: 'Vive solo', puntos: 2, respuesta: 'Vive solo' }, { texto: 'Vive en asilo o residencia y lo visitan poco', puntos: 1, respuesta: 'Vive en asilo' }, { texto: 'Vive con su familia', puntos: 0, respuesta: 'Vive con familia' }] },
    { pregunta: '¿Alguna vez en su vida ha consumido cuatro copas o más, al menos una vez al mes durante un periodo de un año?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Qué tan cansado se ha sentido usted en las últimas 4 semanas?', opciones: [{ texto: 'Todo el tiempo', puntos: 2, respuesta: 'Todo el tiempo' }, { texto: 'Algo de tiempo', puntos: 1, respuesta: 'Algo de tiempo' }, { texto: 'Nada de tiempo', puntos: 0, respuesta: 'Nada de tiempo' }] },
    { pregunta: '¿Tiene dificultad para subir 10 escalones?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: '¿Tiene dificultad para caminar más de 2 cuadras sin descansar?', opciones: [{ texto: 'Sí', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
];

const PREGUNTAS_EN = [
    { pregunta: 'Please indicate your age.', opciones: [{ texto: 'Over 65 years old', puntos: 3, respuesta: 'Mayor de 65' }, { texto: 'Between 45 and 65 years old', puntos: 1, respuesta: 'Entre 45 y 65' }, { texto: 'Under 45 years old', puntos: 0, respuesta: 'Menos de 45' }] },
    { pregunta: 'Have you had memory problems?', opciones: [{ texto: 'You have been diagnosed by a specialist with memory problems', puntos: 5, respuesta: 'Diagnosticado' }, { texto: 'You have gotten lost in places you previously knew', puntos: 3, respuesta: 'Se ha perdido' }, { texto: 'You forget important events or the names and faces of familiar people', puntos: 2, respuesta: 'Olvida eventos' }, { texto: 'You forget recent things, such as where you left your keys or glasses', puntos: 1, respuesta: 'Olvida cosas recientes' }, { texto: 'Never', puntos: 0, respuesta: 'Nunca' }] },
    { pregunta: 'Has any member of your family been diagnosed with dementia or Alzheimer\'s disease?', opciones: [{ texto: 'Yes, parents or siblings', puntos: 5, respuesta: 'Familiares directos' }, { texto: 'Yes, only grandparents, aunts/uncles or cousins', puntos: 3, respuesta: 'Familiares indirectos' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Have you been diagnosed with high blood pressure?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Have you been diagnosed with diabetes mellitus?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Please indicate your body mass index (BMI).', opciones: [{ texto: 'BMI > 30 kg/m²', puntos: 2, respuesta: 'IMC > 30' }, { texto: 'BMI between 25 and 30 kg/m²', puntos: 1, respuesta: 'IMC 25-30' }, { texto: 'BMI < 25 kg/m²', puntos: 0, respuesta: 'IMC < 25' }] },
    { pregunta: 'Do you exercise for at least 30 minutes, twice a week?', opciones: [{ texto: 'Yes', puntos: 0, respuesta: 'Sí' }, { texto: 'No', puntos: 2, respuesta: 'No' }] },
    { pregunta: 'How many years of schooling have you completed?', opciones: [{ texto: 'Less than 6 years', puntos: 3, respuesta: 'Menos de 6' }, { texto: 'Between 6 and 9 years', puntos: 1, respuesta: 'Entre 6 y 9' }, { texto: 'More than 9 years', puntos: 0, respuesta: 'Más de 9' }] },
    { pregunta: 'Have you ever been diagnosed by a specialist with major depressive disorder, anxiety, schizophrenia or bipolar disorder?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Do you smoke or have you smoked for more than one year?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Have you ever had a hard blow to the head that caused you to lose consciousness?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Have you been diagnosed with any cerebrovascular disease?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Do you have difficulty hearing?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Who do you currently live with?', opciones: [{ texto: 'Lives alone', puntos: 2, respuesta: 'Vive solo' }, { texto: 'Lives in a nursing home or residence and is rarely visited', puntos: 1, respuesta: 'Vive en asilo' }, { texto: 'Lives with family', puntos: 0, respuesta: 'Vive con familia' }] },
    { pregunta: 'Have you ever consumed four or more drinks at least once a month for a period of one year?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'How tired have you felt in the last 4 weeks?', opciones: [{ texto: 'All the time', puntos: 2, respuesta: 'Todo el tiempo' }, { texto: 'Some of the time', puntos: 1, respuesta: 'Algo de tiempo' }, { texto: 'None of the time', puntos: 0, respuesta: 'Nada de tiempo' }] },
    { pregunta: 'Do you have difficulty climbing 10 steps?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
    { pregunta: 'Do you have difficulty walking more than 2 blocks without resting?', opciones: [{ texto: 'Yes', puntos: 1, respuesta: 'Sí' }, { texto: 'No', puntos: 0, respuesta: 'No' }] },
];

export function DeterioroCognitivoScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const PREGUNTAS = language === 'en' ? PREGUNTAS_EN : PREGUNTAS_ES;
    const [seleccionadas, setSeleccionadas] = useState(Array(18).fill(null));
    const [pagina, setPagina] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [emptyModal, setEmptyModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [finalPunt, setFinalPunt] = useState(0);

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        const handlePopState = (e) => {
            e.preventDefault();
            setShowExitModal(true);
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const indicesPagina = pagina === 0 ? Array.from({ length: 9 }, (_, i) => i) : Array.from({ length: 9 }, (_, i) => i + 9);

    const handleSelect = (preguntaIdx, opcionIdx) => {
        const nuevo = [...seleccionadas];
        nuevo[preguntaIdx] = opcionIdx;
        setSeleccionadas(nuevo);
    };



    const handleSubmit = async () => {
        const incomplete = seleccionadas.some(s => s === null);
        if (incomplete) {
            setEmptyModal(true);
            return;
        }
        setIsLoading(true);
        try {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            let puntuacion = 0;
            const respuestasMap = {};
            PREGUNTAS.forEach((p, i) => {
                const idx = seleccionadas[i];
                puntuacion += p.opciones[idx].puntos;
                respuestasMap[`pregunta${i + 1}`] = p.opciones[idx].respuesta;
            });

            await postRespuestasEnvejecimientoEspecial({
                id_usuario: parseInt(userId),
                id_cuestionario: 48,
                id_pregunta: 533,
                respuestas: respuestasMap,
                puntuacion_final: puntuacion,
                estatus: true,
            });
            setFinalPunt(puntuacion);
            setShowSuccessModal(true);
        } catch (err) {
            toast.error('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="deterioro-bg">
            <div className="deterioro-header">
                <div className="deterioro-header-left">
                    <FaArrowLeft className="deterioro-back-icon" onClick={() => setShowExitModal(true)} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="deterioro-info-btn" onClick={() => setShowInfo(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>

            <div className="deterioro-content">
                {indicesPagina.map(idx => {
                    const p = PREGUNTAS[idx];
                    return (
                        <div key={idx} className="deterioro-question-card">
                            <p className="deterioro-question-text">{idx + 1}. {p.pregunta}</p>
                            {p.opciones.map((op, opIdx) => {
                                const selected = seleccionadas[idx] === opIdx;
                                return (
                                    <div
                                        key={opIdx}
                                        className={`deterioro-option ${selected ? 'selected' : ''}`}
                                        onClick={() => handleSelect(idx, opIdx)}
                                    >
                                        <span className="deterioro-option-text">{op.texto}</span>
                                        <span className={`deterioro-radio ${selected ? 'checked' : ''}`}>
                                            {selected ? '●' : '○'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                <div className="deterioro-footer-controls">
                    <div className="deterioro-pagination">
                        <div 
                            className={`deterioro-page-dot ${pagina === 0 ? 'active' : ''}`}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setPagina(0);
                            }}
                        >
                            1
                        </div>
                        <div 
                            className={`deterioro-page-dot ${pagina === 1 ? 'active' : ''}`}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setPagina(1);
                            }}
                        >
                            2
                        </div>
                    </div>

                    <button className="deterioro-btn-enviar" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? t('enviando') : t('enviar')}
                    </button>
                </div>
            </div>

            <AlertaGenericaModal
                isOpen={showInfo}
                title={t('instrucciones')}
                description={t('deterioroInstruccionesTexto')}
                confirmText="Cerrar"
                onConfirm={() => setShowInfo(false)}
            />

            <AlertaGenericaModal
                isOpen={emptyModal}
                title={t('atencion')}
                description={t('responderTodasPreguntas')}
                confirmText="Cerrar"
                onConfirm={() => setEmptyModal(false)}
            />

            <AlertaConfirmacionModal
                isOpen={showExitModal}
                title={t('estasSeguroSalir')}
                description={t('noGuardaranCambios')}
                onCancel={() => setShowExitModal(false)}
                onConfirm={() => navigate('/envejecimiento/salud-mental')}
            />

            {showSuccessModal && (
                <div className="deterioro-modal-overlay">
                    <div className="deterioro-modal-content">
                        <img src={logoColor} alt="Mente Conecta" className="deterioro-modal-logo" />
                        <h2 className="deterioro-modal-title">{t('enviado')}</h2>
                        <p className="deterioro-modal-text">{t('respuestasGuardadas')}</p>
                        <button className="deterioro-modal-btn" onClick={() => navigate('/semaforo-deterioro-cognitivo', { state: { puntuacion: finalPunt } })}>{t('entendido')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
