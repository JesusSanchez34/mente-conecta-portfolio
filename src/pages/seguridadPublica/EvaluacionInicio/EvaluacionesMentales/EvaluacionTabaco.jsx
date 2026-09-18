import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../../hooks';
import {
    getCuestionariosPorSeccionApi,
    getPreguntasCuestionarioApi,
    getRespuestasUsuarioApi,
    guardarRespuestasUsuarioApi,
    modificarRespuestasUsuarioApi,
    obtenerResultadosCuestionarioApi,
    obtenerResultadoSumatoriaApi,
    guardarResultadoFinalApi
} from '../../../../api/cuestionario';
import '../Evaluacion.css';

export function EvaluacionTabaco() {
    const { t, i18n } = useTranslation();
    const tituloSeccion = "Evaluación de Tabaco";
    const navigate = useNavigate();
    const { auth } = useAuth();
    const token = auth?.token;
    const userId = auth?.me?.id;

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Questionnaire and Questions
    const [cuestionario, setCuestionario] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    
    // Response tracking
    const [respuestasUser, setRespuestasUser] = useState({});
    const [idRespuestaBack, setIdRespuestaBack] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [sections, setSections] = useState([]);
    const questionsPerPage = 1000;

    const rebuildQuestionsAndAnswers = (allSections, currentAnswers) => {
        let activePreguntas = [];
        let currentSectionId = 1;
        const visited = new Set();
        const cleanedAnswers = {};

        while (currentSectionId) {
            if (visited.has(currentSectionId)) break;
            visited.add(currentSectionId);

            const currId = currentSectionId;
            const section = allSections.find(s => s.posicion_cuestionario_id === currId);
            if (!section) break;

            activePreguntas.push(...section.preguntas);

            const sectionPreguntas = section.preguntas;
            sectionPreguntas.forEach(q => {
                if (currentAnswers[q.id]) {
                    cleanedAnswers[q.id] = {
                        ...currentAnswers[q.id],
                        id: currId,
                        ponderacionId: section.ponderacion,
                        longitud: sectionPreguntas.length
                    };
                }
            });

            const allAnswered = sectionPreguntas.every(q => currentAnswers[q.id]);
            if (!allAnswered) {
                break;
            }

            let sumScore = 0;
            sectionPreguntas.forEach(q => {
                const ans = currentAnswers[q.id];
                const cal = ans ? parseInt(ans.calificacion || 0, 10) : 0;
                sumScore += cal;
            });

            const nextSectionId = sumScore >= section.ponderacion
                ? section.cuestionario_siguiente
                : section.cuestionario_avanzar;

            if (nextSectionId === 1) {
                break;
            }
            currentSectionId = nextSectionId;
        }

        return { activePreguntas, cleanedAnswers };
    };

    // Custom text input states
    const [textInputs, setTextInputs] = useState({});

    // Success/Results dialog state
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [resultsData, setResultsData] = useState([]);
    const [sumatoriaResult, setSumatoriaResult] = useState(null);

    // Exit modal state
    const [showExitModal, setShowExitModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);

    // Finished modal state
    const [showFinishedModal, setShowFinishedModal] = useState(false);

    useEffect(() => {
        if (!token || !userId) return;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                
                const cuestionarios = await getCuestionariosPorSeccionApi(token, 2);
                const foundCuestionario = cuestionarios.find(
                    c => c.titulo.toUpperCase().trim() === tituloSeccion.toUpperCase().trim()
                );

                if (!foundCuestionario) {
                    throw new Error(`Cuestionario "${tituloSeccion}" no encontrado en el sistema.`);
                }
                setCuestionario(foundCuestionario);

                const dataPreguntas = await getPreguntasCuestionarioApi(token, foundCuestionario.id);
                let loadedAnswers = {};

                const idParentesco = parseInt(sessionStorage.getItem('idParentesco') || '0');
                const respuestasPrevias = await getRespuestasUsuarioApi(token, userId, foundCuestionario.id, idParentesco);

                const rJson = respuestasPrevias ? (respuestasPrevias.respuestas_json || respuestasPrevias.respuestasJson) : null;
                if (rJson) {
                    setIdRespuestaBack(respuestasPrevias.id);
                    const parsedAnswers = JSON.parse(rJson);
                    
                    const textsMap = {};
                    parsedAnswers.forEach(ans => {
                        loadedAnswers[ans.preguntaId] = ans;
                        textsMap[ans.preguntaId] = ans.respuestasUser;
                    });
                    
                    setTextInputs(textsMap);
                }

                if (foundCuestionario.dinamico) {
                    setSections(dataPreguntas);
                    const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(dataPreguntas, loadedAnswers);
                    setPreguntas(activePreguntas);
                    setRespuestasUser(cleanedAnswers);
                } else {
                    dataPreguntas.sort((a, b) => (a.posicion || 0) - (b.posicion || 0));
                    setPreguntas(dataPreguntas);
                    setRespuestasUser(loadedAnswers);
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar la evaluación');
            } finally {
                setLoading(false);
            }
        })();
    }, [token, userId]);

    const handleOptionSelect = (pregunta, respuesta, textVal = '') => {
        const isMulti = pregunta.multiRespuesta;
        let newRespuestasUser = { ...respuestasUser };
        
        if (isMulti) {
            let currentAnswers = respuestasUser[pregunta.id]?.respuestaId ? [...respuestasUser[pregunta.id].respuestaId] : [];
            let currentTexts = respuestasUser[pregunta.id]?.respuestasUser ? [...respuestasUser[pregunta.id].respuestasUser] : [];

            const index = currentAnswers.indexOf(respuesta.id);
            if (index > -1) {
                currentAnswers.splice(index, 1);
                currentTexts.splice(index, 1);
            } else {
                currentAnswers.push(respuesta.id);
                currentTexts.push(textVal || (i18n.language?.startsWith('en') ? (respuesta.answers || respuesta.answer || respuesta.respuesta) : respuesta.respuesta));
            }

            if (currentAnswers.length === 0) {
                delete newRespuestasUser[pregunta.id];
            } else {
                newRespuestasUser[pregunta.id] = {
                    preguntaId: pregunta.id,
                    respuestaId: currentAnswers,
                    respuestasUser: currentTexts.join(', '),
                    calificacion: respuesta.ponderacion || 0,
                    respuestaMultiOpcion: currentTexts.join(', ')
                };
            }
        } else {
            newRespuestasUser[pregunta.id] = {
                preguntaId: pregunta.id,
                respuestaId: respuesta.id,
                respuestasUser: textVal || (i18n.language?.startsWith('en') ? (respuesta.answers || respuesta.answer || respuesta.respuesta) : respuesta.respuesta),
                calificacion: respuesta.ponderacion || 0,
                respuestaMultiOpcion: ""
            };
        }

        if (cuestionario?.dinamico) {
            const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(sections, newRespuestasUser);
            setPreguntas(activePreguntas);
            setRespuestasUser(cleanedAnswers);
        } else {
            setRespuestasUser(newRespuestasUser);
        }
    };

    const handleTextChange = (pregunta, respuesta, textVal) => {
        setTextInputs(prev => ({
            ...prev,
            [pregunta.id]: textVal
        }));

        if (respuestasUser[pregunta.id]) {
            handleOptionSelect(pregunta, respuesta, textVal);
        }
    };

    const totalPages = Math.ceil(preguntas.length / questionsPerPage);
    const paginatedQuestions = preguntas.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const progressPercent = Math.round((Object.keys(respuestasUser).length / preguntas.length) * 100) || 0;

    const handleSubmit = () => {
        const listRespuestas = Object.values(respuestasUser);
        if (listRespuestas.length === 0) {
            alert(t('survey.alert_select_at_least_one', 'Por favor contesta al menos una pregunta antes de enviar.'));
            return;
        }
        setShowFinishedModal(true);
    };

    const executeSubmit = async () => {
        setShowFinishedModal(false);
        const listRespuestas = Object.values(respuestasUser);

        try {
            setSubmitting(true);
            const idParentesco = parseInt(sessionStorage.getItem('idParentesco') || '0');
            
            const payload = {
                respuestas_json: JSON.stringify(listRespuestas),
                estatus_finalizado: listRespuestas.length === preguntas.length ? 1 : 0,
                id_sub_usuario: idParentesco === 0 ? null : idParentesco,
                id_usuario: userId,
                id_cuestionario: cuestionario.id,
                encuestador: idParentesco
            };

            let responseRecordId = idRespuestaBack;

            if (responseRecordId) {
                await modificarRespuestasUsuarioApi(token, responseRecordId, payload);
            } else {
                const saveResult = await guardarRespuestasUsuarioApi(token, payload);
                responseRecordId = saveResult.id;
                setIdRespuestaBack(responseRecordId);
            }

            if (payload.estatus_finalizado === 1 && cuestionario.genera_resultados === 1) {
                if (cuestionario.genera_resultados_sumatoria === 1) {
                    const sumResult = await obtenerResultadoSumatoriaApi(token, payload.respuestas_json);
                    setSumatoriaResult(sumResult);
                    await guardarResultadoFinalApi(token, responseRecordId, {
                        resultado: "",
                        total_resultado: sumResult
                    });
                } else {
                    const diagResult = await obtenerResultadosCuestionarioApi(token, payload.respuestas_json);
                    setResultsData(diagResult);

                    if (diagResult.length > 0) {
                        if (diagResult.length > 1) {
                            const formattedResults = diagResult.map(r => ({
                                diagnostico: r.especialidadNombre,
                                calificacion: r.especialidadEvaluacion
                            }));
                            await guardarResultadoFinalApi(token, responseRecordId, {
                                resultado: JSON.stringify(formattedResults),
                                total_resultado: 0
                            });
                        } else {
                            await guardarResultadoFinalApi(token, responseRecordId, {
                                resultado: diagResult[0].especialidadNombre,
                                total_resultado: diagResult[0].especialidadEvaluacion
                            });
                        }
                    }
                }
                setShowResultsModal(true);
            } else {
                alert(t('survey.alert_saved_success', 'Tus respuestas se han guardado con éxito.'));
                navigate('/seguridad/evaluacion-mental');
            }

        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al guardar las respuestas');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="evaluacion-layout">
                <div className="evaluacion-question-card text-center" style={{ padding: '60px' }}>
                    <div className="mental-loader-dots" style={{ margin: '0 auto 20px' }}>
                        <div className="mental-loader-dot" />
                        <div className="mental-loader-dot" />
                        <div className="mental-loader-dot" />
                        <div className="mental-loader-dot" />
                    </div>
                    <h3>{t('survey.loading_questions_details', 'Cargando preguntas de la evaluación...')}</h3>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="evaluacion-layout">
                <div className="evaluacion-question-card text-center" style={{ padding: '50px' }}>
                    <h3 className="text-danger">{t('survey.something_went_wrong', '¡Vaya! Algo salió mal')}</h3>
                    <p style={{ margin: '20px 0', color: '#64748b' }}>{error}</p>
                    <button className="btn-regresar" onClick={() => navigate('/seguridad/evaluacion-mental')}>
                        {t('survey.return_to_eval', 'Volver a la evaluación')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="evaluacion-layout">
            <div className="evaluacion-question-card">
                <div className="cuestionario-header-row">
                    <button
                        className="btn-regresar"
                        onClick={() => setShowExitModal(true)}
                        title={t('safety_layout.select_person_btn', 'Regresar')}
                    >
                        <FaArrowLeft size={16} />
                    </button>
                    
                    {(i18n.language?.startsWith('en') && cuestionario?.instructions ? cuestionario?.instructions : cuestionario?.instrucciones) && (
                        <button
                            className="btn-instrucciones"
                            onClick={() => setShowInstructionsModal(true)}
                        >
                            {t('survey.instructions_btn', 'ℹ️ Instrucciones')}
                        </button>
                    )}
                </div>

                <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>{(i18n.language?.startsWith('en') && cuestionario?.title ? cuestionario?.title : cuestionario?.titulo) || t('evaluations.mental_sub_modal_title_6', 'Evaluación de Tabaco')}</h2>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    <span className="progress-bar-text">{progressPercent}% {t('survey.completed_label', 'completado')} ({Object.keys(respuestasUser).length}/{preguntas.length})</span>
                </div>

                <div className="preguntas-list-container">
                    {paginatedQuestions.map((pregunta, index) => {
                        const questionIndex = currentPage * questionsPerPage + index + 1;
                        const savedAnswer = respuestasUser[pregunta.id];
                        
                        return (
                            <div key={pregunta.id} className="pregunta-card-item">
                                <div className="pregunta-title-row">
                                    <h4 className="pregunta-title">
                                        {questionIndex}. {(i18n.language?.startsWith('en') && pregunta.question ? pregunta.question : pregunta.pregunta)}
                                    </h4>
                                    {(((i18n.language?.startsWith('en') ? (pregunta.explanation_question || pregunta.explanationQuestion || pregunta.explicacionPregunta || pregunta.explicacion_pregunta) : (pregunta.explicacionPregunta || pregunta.explicacion_pregunta)))) && (
                                        <span 
                                            className="pregunta-help-icon"
                                            data-tooltip={(i18n.language?.startsWith('en') ? (pregunta.explanation_question || pregunta.explanationQuestion || pregunta.explicacionPregunta || pregunta.explicacion_pregunta) : (pregunta.explicacionPregunta || pregunta.explicacion_pregunta))}
                                            onClick={() => alert((i18n.language?.startsWith('en') ? (pregunta.explanation_question || pregunta.explanationQuestion || pregunta.explicacionPregunta || pregunta.explicacion_pregunta) : (pregunta.explicacionPregunta || pregunta.explicacion_pregunta)))}
                                        >
                                            <svg viewBox="0 0 24 24" width="22" height="22" style={{ cursor: 'pointer', verticalAlign: 'middle', display: 'inline-block' }}>
                                                <circle cx="12" cy="12" r="10" fill="#e91e63" />
                                                <path d="M12 8v.01M12 11v5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <hr className="pregunta-divider" />

                                <div className="respuestas-list">
                                    {pregunta.respuestas.map((resp) => {
                                        const isSelected = Array.isArray(savedAnswer?.respuestaId)
                                            ? savedAnswer.respuestaId.includes(resp.id)
                                            : savedAnswer?.respuestaId === resp.id;

                                        return (
                                            <div key={resp.id} className="respuesta-option-wrapper">
                                                <label className={`respuesta-option-label ${isSelected ? 'selected' : ''}`}>
                                                    <input
                                                        type={pregunta.multiRespuesta ? "checkbox" : "radio"}
                                                        name={`pregunta_${pregunta.id}`}
                                                        checked={isSelected}
                                                        onChange={() => handleOptionSelect(pregunta, resp, textInputs[pregunta.id])}
                                                        className="respuesta-radio-input"
                                                    />
                                                    <span className="respuesta-option-text">{(i18n.language?.startsWith('en') ? (resp.answers || resp.answer || resp.respuesta) : resp.respuesta)}</span>
                                                </label>

                                                {isSelected && resp.especificarRespuesta && (
                                                    <div className="especificar-text-wrapper">
                                                        <input
                                                            type="text"
                                                            placeholder={pregunta.detalleEspecificacion || t('survey.write_here', 'Escriba aquí...')}
                                                            value={textInputs[pregunta.id] || ''}
                                                            onChange={(e) => handleTextChange(pregunta, resp, e.target.value)}
                                                            className="especificar-text-input"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {(!pregunta.respuestas || pregunta.respuestas.length === 0) && (
                                        <div className="especificar-text-wrapper" style={{ marginTop: '10px' }}>
                                            {pregunta.idTipoOpcion === 33 ? (
                                                <input
                                                    type="date"
                                                    value={textInputs[pregunta.id] || ''}
                                                    onChange={(e) => {
                                                        const textVal = e.target.value;
                                                        setTextInputs(prev => ({ ...prev, [pregunta.id]: textVal }));
                                                        
                                                        let newRespuestasUser = {
                                                            ...respuestasUser,
                                                            [pregunta.id]: {
                                                                preguntaId: pregunta.id,
                                                                respuestaId: 0,
                                                                respuestasUser: textVal,
                                                                calificacion: 0,
                                                                respuestaMultiOpcion: ""
                                                            }
                                                        };
                                                        
                                                        if (cuestionario?.dinamico) {
                                                            const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(sections, newRespuestasUser);
                                                            setPreguntas(activePreguntas);
                                                            setRespuestasUser(cleanedAnswers);
                                                        } else {
                                                            setRespuestasUser(newRespuestasUser);
                                                        }
                                                    }}
                                                    className="especificar-text-input"
                                                    style={{ borderRadius: '25px', padding: '12px 20px' }}
                                                />
                                            ) : pregunta.idTipoOpcion === 32 ? (
                                                <input
                                                    type="time"
                                                    value={textInputs[pregunta.id] || ''}
                                                    onChange={(e) => {
                                                        const textVal = e.target.value;
                                                        setTextInputs(prev => ({ ...prev, [pregunta.id]: textVal }));
                                                        
                                                        let newRespuestasUser = {
                                                            ...respuestasUser,
                                                            [pregunta.id]: {
                                                                preguntaId: pregunta.id,
                                                                respuestaId: 0,
                                                                respuestasUser: textVal,
                                                                calificacion: 0,
                                                                respuestaMultiOpcion: ""
                                                            }
                                                        };
                                                        
                                                        if (cuestionario?.dinamico) {
                                                            const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(sections, newRespuestasUser);
                                                            setPreguntas(activePreguntas);
                                                            setRespuestasUser(cleanedAnswers);
                                                        } else {
                                                            setRespuestasUser(newRespuestasUser);
                                                        }
                                                    }}
                                                    className="especificar-text-input"
                                                    style={{ borderRadius: '25px', padding: '12px 20px' }}
                                                />
                                            ) : (
                                                <input
                                                    type={pregunta.idTipoOpcion === 31 ? "number" : "text"}
                                                    placeholder={pregunta.detalleEspecificacion || t('survey.write_response_here', 'Escriba su respuesta aquí...')}
                                                    value={textInputs[pregunta.id] || ''}
                                                    onChange={(e) => {
                                                        const textVal = e.target.value;
                                                        setTextInputs(prev => ({ ...prev, [pregunta.id]: textVal }));
                                                        
                                                        let newRespuestasUser = {
                                                            ...respuestasUser,
                                                            [pregunta.id]: {
                                                                preguntaId: pregunta.id,
                                                                respuestaId: 0,
                                                                respuestasUser: textVal,
                                                                calificacion: 0,
                                                                respuestaMultiOpcion: ""
                                                            }
                                                        };
                                                        
                                                        if (cuestionario?.dinamico) {
                                                            const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(sections, newRespuestasUser);
                                                            setPreguntas(activePreguntas);
                                                            setRespuestasUser(cleanedAnswers);
                                                        } else {
                                                            setRespuestasUser(newRespuestasUser);
                                                        }
                                                    }}
                                                    className="especificar-text-input"
                                                    style={{ borderRadius: '25px', padding: '12px 20px' }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {pregunta.especificarRespuesta && (
                                        <div className="especificar-text-wrapper" style={{ marginTop: '15px' }}>
                                            <textarea
                                                rows="3"
                                                placeholder={pregunta.detalleEspecificacion || t('survey.write_detailed_response_here', 'Escriba su respuesta detallada aquí...')}
                                                value={textInputs[pregunta.id] || ''}
                                                onChange={(e) => {
                                                    const textVal = e.target.value;
                                                    setTextInputs(prev => ({ ...prev, [pregunta.id]: textVal }));
                                                    
                                                    let newRespuestasUser = {
                                                        ...respuestasUser,
                                                        [pregunta.id]: {
                                                            preguntaId: pregunta.id,
                                                            respuestaId: 0,
                                                            respuestasUser: textVal,
                                                            calificacion: 0,
                                                            respuestaMultiOpcion: ""
                                                        }
                                                    };
                                                    
                                                    if (cuestionario?.dinamico) {
                                                        const { activePreguntas, cleanedAnswers } = rebuildQuestionsAndAnswers(sections, newRespuestasUser);
                                                        setPreguntas(activePreguntas);
                                                        setRespuestasUser(cleanedAnswers);
                                                    } else {
                                                        setRespuestasUser(newRespuestasUser);
                                                    }
                                                }}
                                                className="especificar-textarea"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cuestionario-footer-buttons">
                    <div className="pagination-arrows">
                        {currentPage > 0 && (
                            <button className="btn-paginator" onClick={handlePrevPage}>{t('survey.prev_btn', 'Anterior')}</button>
                        )}
                        {currentPage < totalPages - 1 && (
                            <button className="btn-paginator" onClick={handleNextPage}>{t('survey.next_btn', 'Siguiente')}</button>
                        )}
                    </div>

                    <button 
                        className="btn-enviar-cuestionario"
                        onClick={handleSubmit}
                    >
                        {Object.keys(respuestasUser).length === preguntas.length ? t('survey.finish_send_btn', 'Finalizar y Enviar') : t('survey.save_progress_btn', 'Guardar Progreso')}
                    </button>
                </div>
            </div>

                        {/* Modal de Instrucciones */}
            {showInstructionsModal && (
                <div className="mental-modal-overlay" onClick={() => setShowInstructionsModal(false)}>
                    <div className="mental-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="mental-modal-header" style={{ background: 'linear-gradient(135deg, #ffd043, #fecb3e)' }}>
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mental-modal-lightbulb">
                                <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-top" />
                                <path d="M19 7L17.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tr" />
                                <path d="M5 7L6.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tl" />
                                <path d="M22 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-r" />
                                <path d="M4 12H2" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-l" />
                                <path d="M12 5C8.5 5 6 7.5 6 11C6 13.5 7.5 15.5 9 16.5V19C9 19.5 9.5 20 10 20H14C14.5 20 15 19.5 15 19V16.5C16.5 15.5 18 13.5 18 11C18 7.5 15.5 5 12 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 22H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M11 24H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 13C11 12 13 12 14 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M12 13.5V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="mental-modal-body">
                            <h3 className="mental-modal-title">{t('survey.instructions_title', 'Instrucciones')}</h3>
                            <p className="mental-modal-description">
                                {(i18n.language?.startsWith('en') && cuestionario?.instructions ? cuestionario?.instructions : cuestionario?.instrucciones)}
                            </p>
                            <button className="mental-modal-btn" onClick={() => setShowInstructionsModal(false)}>{t('survey.close_btn', 'Cerrar')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para salir */}
            {showExitModal && (
                <div className="mental-modal-overlay" onClick={() => setShowExitModal(false)}>
                    <div className="mental-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="mental-modal-header">
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mental-modal-lightbulb">
                                <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-top" />
                                <path d="M19 7L17.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tr" />
                                <path d="M5 7L6.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tl" />
                                <path d="M22 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-r" />
                                <path d="M4 12H2" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-l" />
                                <path d="M12 5C8.5 5 6 7.5 6 11C6 13.5 7.5 15.5 9 16.5V19C9 19.5 9.5 20 10 20H14C14.5 20 15 19.5 15 19V16.5C16.5 15.5 18 13.5 18 11C18 7.5 15.5 5 12 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 22H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M11 24H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 13C11 12 13 12 14 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M12 13.5V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="mental-modal-body">
                            <h3 className="mental-modal-title">{t('survey.exit_confirm_title', '¿Está seguro que desea salir?')}</h3>
                            <p className="mental-modal-description">{t('survey.exit_confirm_desc', 'No se guardarán los cambios realizados')}</p>
                            <div className="exit-modal-footer">
                                <button className="exit-modal-btn-cancel" onClick={() => setShowExitModal(false)}>{t('survey.cancel_btn', 'Cancelar')}</button>
                                <button className="exit-modal-btn-exit" onClick={() => navigate('/seguridad/evaluacion-mental')}>
                                    {t('survey.exit_btn', 'Salir')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Finalizado con Botones Atras y Guardar */}
            {showFinishedModal && (
                <div className="mental-modal-overlay" onClick={() => setShowFinishedModal(false)}>
                    <div className="mental-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="mental-modal-header finished-bg">
                            <div className="finished-concentric-rings">
                                <svg viewBox="0 0 100 100" width="80" height="80">
                                    <circle cx="50" cy="50" r="30" className="concentric-ring-outer" />
                                    <circle cx="50" cy="50" r="10" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className="mental-modal-body">
                            <h3 className="mental-modal-title">{t('survey.finished_title', 'Finalizado')}</h3>
                            <p className="mental-modal-description">{t('survey.finished_desc', 'Se guardarán tus preguntas al continuar.')}</p>
                            <div className="exit-modal-footer">
                                <button className="exit-modal-btn-cancel" onClick={() => setShowFinishedModal(false)}>{t('survey.back_btn', 'Atrás')}</button>
                                <button className="exit-modal-btn-exit" onClick={executeSubmit}>{t('survey.save_btn', 'Guardar')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cargando al Guardar Respuestas */}
            {submitting && (
                <div className="mental-modal-overlay">
                    <div className="mental-modal-content">
                        <div className="mental-modal-header loader-bg">
                            <div className="mental-loader-dots">
                                <div className="mental-loader-dot" />
                                <div className="mental-loader-dot" />
                                <div className="mental-loader-dot" />
                                <div className="mental-loader-dot" />
                            </div>
                        </div>
                        <div className="mental-modal-body">
                            <h3 className="mental-modal-title" style={{ marginBottom: '8px' }}>{t('survey.saving_responses', 'Guardando respuestas')}</h3>
                            <p className="mental-loader-dots-text">...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Resultados de la Evaluación */}
            {showResultsModal && (
                <div className="mental-modal-overlay">
                    <div className="mental-modal-content" style={{ maxWidth: '480px' }}>
                        <div className="mental-modal-header" style={{ backgroundColor: '#2196f3', height: '150px' }}>
                            <span style={{ fontSize: '70px' }}>📊</span>
                        </div>
                        <div className="mental-modal-body" style={{ padding: '25px' }}>
                            <h3 className="mental-modal-title" style={{ color: '#2196f3' }}>{t('survey.eval_completed', 'Evaluación Completada')}</h3>
                            
                            {sumatoriaResult !== null ? (
                                <div style={{ margin: '15px 0' }}>
                                    <p className="mental-modal-description" style={{ marginBottom: '8px' }}>
                                        {t('survey.total_score_obtained', 'Tu puntaje total obtenido en la escala es:')}
                                    </p>
                                    <h1 style={{ fontSize: '3.5rem', color: '#1e293b', fontWeight: '800' }}>
                                        {sumatoriaResult}
                                    </h1>
                                </div>
                            ) : (
                                <div style={{ width: '100%', margin: '15px 0', textAlign: 'left' }}>
                                    <p className="mental-modal-description" style={{ textAlign: 'center', marginBottom: '15px' }}>
                                        {t('survey.diag_results_obtained', 'Resultados de diagnóstico obtenidos:')}
                                    </p>
                                    {resultsData.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                                            {t('evaluations.no_risks_detected', 'No se detectaron riesgos en este cuestionario.')}
                                        </p>
                                    ) : (
                                        <div className="results-list-wrapper" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                            {resultsData.map((res, index) => (
                                                <div key={index} className="result-item-card" style={{
                                                    backgroundColor: '#f8fafc',
                                                    borderLeft: `5px solid ${res.especialidadEvaluacion > 7 ? '#ef4444' : '#f59e0b'}`,
                                                    padding: '12px 16px',
                                                    marginBottom: '10px',
                                                    borderRadius: '0 8px 8px 0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <strong style={{ color: '#0f172a' }}>{res.especialidadNombre}</strong>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('survey.risk_diagnosis', 'Diagnóstico de Riesgo')}</div>
                                                    </div>
                                                    <span style={{
                                                        backgroundColor: res.especialidadEvaluacion > 7 ? '#fee2e2' : '#fef3c7',
                                                        color: res.especialidadEvaluacion > 7 ? '#991b1b' : '#92400e',
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {t('survey.level', 'Nivel')}: {res.especialidadEvaluacion}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '10px', marginBottom: '24px' }}>
                                {t('survey.view_status_main', 'Puedes ver el estado de todos tus cuestionarios en la pantalla principal.')}
                            </p>

                            <button 
                                className="mental-modal-btn" 
                                onClick={() => {
                                    setShowResultsModal(false);
                                    navigate('/seguridad/evaluacion-mental');
                                }}
                            >
                                {t('survey.continue_btn', 'Continuar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
