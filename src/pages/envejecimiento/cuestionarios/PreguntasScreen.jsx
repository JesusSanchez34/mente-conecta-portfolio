import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSettings } from '../../../context/SettingsContext';
import { FloatingActionMenu } from '../FloatingActionMenu';
import logoColor from '../../../assets/img/logoColor.png';
import {
    obtenerPreguntasPorCuestionario,
    obtenerCuestionarioPorId,
    guardarRespuestasEnvejecimiento,
    actualizarRespuestasEnvejecimiento,
    obtenerRespuestasGuardadas,
    obtenerResultadosEnvejecimiento,
} from '../../../api/user';
import { AuthContext } from '../../../context/AuthContext';
import './PreguntasScreen.css';

const PAGE_SIZE = 10;

function isNingunaNone(texto) {
    return /ninguna|none/i.test(texto || '');
}

const ANSWER_MAP_EN = {
    'si': 'Yes', 'sí': 'Yes',
    'no': 'No',
    'prefiero no responder': 'Prefer not to answer',
    'ninguna': 'None', 'ninguno': 'None',
    'siempre': 'Always',
    'casi siempre': 'Almost always',
    'a veces': 'Sometimes', 'algunas veces': 'Sometimes',
    'casi nunca': 'Almost never',
    'nunca': 'Never',
    'muy frecuentemente': 'Very frequently',
    'frecuentemente': 'Frequently',
    'ocasionalmente': 'Occasionally',
    'raramente': 'Rarely', 'rara vez': 'Rarely',
    'todos los días': 'Every day',
    'diario': 'Daily',
    'semanal': 'Weekly',
    'mensual': 'Monthly',
    'anual': 'Yearly',
    'mucho': 'A lot',
    'poco': 'A little',
    'nada': 'Not at all',
    'excelente': 'Excellent',
    'buena': 'Good', 'bueno': 'Good',
    'regular': 'Fair',
    'mala': 'Poor', 'malo': 'Poor',
    'muy buena': 'Very good', 'muy bueno': 'Very good',
    'no aplica': 'Not applicable',
    'otro': 'Other', 'otra': 'Other', 'otros': 'Others',
    'soltero': 'Single', 'soltera': 'Single',
    'casado': 'Married', 'casada': 'Married',
    'divorciado': 'Divorced', 'divorciada': 'Divorced',
    'viudo': 'Widowed', 'viuda': 'Widowed',
    'unión libre': 'Common-law union',
    'separado': 'Separated', 'separada': 'Separated',
    'masculino': 'Male',
    'femenino': 'Female',
    'primaria': 'Primary school',
    'secundaria': 'Secondary school',
    'preparatoria': 'High school',
    'universidad': 'University',
    'posgrado': 'Postgraduate',
    'sin estudios': 'No education',
    'empleado': 'Employed', 'empleada': 'Employed',
    'desempleado': 'Unemployed', 'desempleada': 'Unemployed',
    'jubilado': 'Retired', 'jubilada': 'Retired',
    'estudiante': 'Student',
    'ama de casa': 'Homemaker',
    'trabajador independiente': 'Self-employed',
};

const CUESTIONARIO_NAME_EN = {
    'sociodemograf': 'Sociodemographic',
    'determinante': 'Social Determinants',
    'social': 'Social Determinants',
    'salud mental': 'Mental Health and Aging',
    'mental health': 'Mental Health and Aging',
    'envejecimiento': 'Aging',
    'alzheimer': 'Alzheimer',
    'cognitiv': 'Cognitive Assessment',
    'nutrici': 'Nutrition',
    'actividad f': 'Physical Activity',
    'sueño': 'Sleep',
    'sue': 'Sleep',
    'emocional': 'Emotional Health',
};

function translateCuestionarioName(name, language) {
    if (language !== 'en' || !name) return name;
    const lower = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const [key, val] of Object.entries(CUESTIONARIO_NAME_EN)) {
        if (lower.includes(key)) return val;
    }
    return name;
}

function translateAnswer(texto, language, answerEn) {
    if (language !== 'en' || !texto) return texto;
    if (answerEn) return answerEn;
    const key = texto.trim().toLowerCase();
    return ANSWER_MAP_EN[key] || texto;
}

function translateQuestion(pregunta, language) {
    if (language !== 'en') return pregunta.pregunta;
    return pregunta.pregunta_en || pregunta.pregunta_ingles || pregunta.question || pregunta.pregunta;
}

export function PreguntasScreen() {
    const { cuestionarioId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language } = useSettings();
    const { auth } = useContext(AuthContext);

    const navName = location.state?.cuestionarioName || '';
    const isSociodemograficos = location.state?.isSociodemograficos || false;

    const RANGOS_SOCIODEMO = [[0, 10], [10, 15], [15, 30], [30, 37]];

    const [cuestionarioInfo, setCuestionarioInfo] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingRecord, setExistingRecord] = useState(null);
    const [instrucciones, setInstrucciones] = useState('');
    const [showInstrucciones, setShowInstrucciones] = useState(false);
    const [resultadosModal, setResultadosModal] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('[PreguntasScreen] cuestionarioId desde URL:', cuestionarioId);
                const listPreguntas = await obtenerPreguntasPorCuestionario(cuestionarioId);
                console.log('[PreguntasScreen] preguntas recibidas:', listPreguntas);
                if (!listPreguntas || listPreguntas.length === 0) {
                    toast.error(t('noHayPreguntas'));
                    navigate(-1);
                    return;
                }

                const infoMeta = await obtenerCuestionarioPorId(cuestionarioId);
                setCuestionarioInfo(infoMeta);
                setInstrucciones(infoMeta?.instrucciones || infoMeta?.instructions || '');
                setPreguntas(listPreguntas);

                const userId = auth?.userId || localStorage.getItem('user_id') || '1';
                if (auth?.userId) localStorage.setItem('user_id', String(auth.userId));
                const existing = await obtenerRespuestasGuardadas(userId, cuestionarioId);
                if (existing && existing.id) {
                    setExistingRecord(existing);
                    if (existing.respuestas_json) {
                        try {
                            const prevAnswers = JSON.parse(existing.respuestas_json);
                            const mapped = {};
                            prevAnswers.forEach(r => {
                                mapped[r.preguntaId] = {
                                    respuestaId: r.respuestaId || 0,
                                    texto: r.respuestasUser || '',
                                    multiIds: r.respuestaMultiOpcion
                                        ? String(r.respuestaMultiOpcion).split(',').map(Number).filter(Boolean)
                                        : [],
                                    calificacion: r.calificacion || 0,
                                };
                            });
                            setRespuestas(mapped);
                        } catch (_) {}
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error(t('errorGuardar'));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [cuestionarioId, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

    const numPages = isSociodemograficos
        ? RANGOS_SOCIODEMO.length
        : Math.max(1, Math.ceil(preguntas.length / PAGE_SIZE));

    const pagPreguntas = isSociodemograficos
        ? (() => {
            const [ini, fin] = RANGOS_SOCIODEMO[currentPage] || [0, PAGE_SIZE];
            return preguntas.slice(ini, Math.min(fin, preguntas.length));
        })()
        : preguntas.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const getAnsweredCount = () =>
        Object.keys(respuestas).filter(pId => {
            const r = respuestas[pId];
            return r.respuestaId > 0 || r.texto || (r.multiIds && r.multiIds.length > 0);
        }).length;

    const buildAnswersArray = () =>
        preguntas.map(p => {
            const r = respuestas[p.id] || {};
            return {
                preguntaId: p.id,
                respuestaId: r.respuestaId || 0,
                respuestasUser: r.texto || '',
                calificacion: r.calificacion || 0,
                respuestaMultiOpcion: (r.multiIds || []).join(','),
            };
        }).filter(a => a.respuestaId !== 0 || a.respuestasUser !== '' || a.respuestaMultiOpcion !== '');

    const handleSelectSingle = (preguntaId, respuestaId, calificacion) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: {
                respuestaId,
                texto: prev[preguntaId]?.texto || '',
                multiIds: [],
                calificacion,
            },
        }));
    };

    const handleToggleMulti = (preguntaId, respuestaId, calificacion, textoOpcion) => {
        setRespuestas(prev => {
            const cur = prev[preguntaId] || { multiIds: [], respuestaId: 0, texto: '', calificacion: 0 };
            const alreadySelected = cur.multiIds.includes(respuestaId);

            let newIds;
            if (alreadySelected) {
                newIds = cur.multiIds.filter(id => id !== respuestaId);
            } else if (isNingunaNone(textoOpcion)) {
                newIds = [respuestaId];
            } else {
                const sinNinguna = cur.multiIds.filter(id => {
                    const pregunta = preguntas.find(p => p.id === preguntaId);
                    if (!pregunta) return true;
                    const op = (pregunta.respuestas || []).find(r => r.id === id);
                    return !isNingunaNone(op?.respuesta);
                });
                newIds = [...sinNinguna, respuestaId];
            }

            return { ...prev, [preguntaId]: { ...cur, multiIds: newIds, calificacion } };
        });
    };

    const handleTexto = (preguntaId, texto) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: {
                ...(prev[preguntaId] || { respuestaId: 0, multiIds: [], calificacion: 0 }),
                texto,
            },
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveAnswers = async (answersArray, esFinalizado) => {
        const payload = {
            respuestas_json: JSON.stringify(answersArray),
            estatus_finalizado: esFinalizado ? 1 : 0,
            id_usuario: parseInt(auth?.userId || localStorage.getItem('user_id') || '1'),
            id_cuestionario: parseInt(cuestionarioId),
        };

        if (existingRecord?.id) {
            return await actualizarRespuestasEnvejecimiento(existingRecord.id, payload);
        } else {
            return await guardarRespuestasEnvejecimiento(payload);
        }
    };

    const handleEnviar = async () => {
        const answeredCount = getAnsweredCount();

        if (answeredCount === 0) {
            toast.warning(t('seleccionaRespuesta'));
            return;
        }

        const esFinalizado = answeredCount === preguntas.length;

        if (!esFinalizado) {
            const confirmed = window.confirm(t('preguntasPendientes'));
            if (!confirmed) return;
        }

        setIsSubmitting(true);
        try {
            const answersArray = buildAnswersArray();
            await saveAnswers(answersArray, esFinalizado);

            if (esFinalizado) {
                const generaResultado = cuestionarioInfo?.genera_resultado;
                if (generaResultado === 1) {
                    const resultados = await obtenerResultadosEnvejecimiento(answersArray);
                    if (resultados && resultados.length > 0) {
                        setResultadosModal(resultados);
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            toast.success(esFinalizado ? t('cuestionarioCompletado') : t('progresoGuardado'));
            navigate('/secciones');
        } catch (err) {
            console.error(err);
            toast.error(t('errorGuardar'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="preguntas-bg">
                <div className="preguntas-header">
                    <FaArrowLeft className="preguntas-back-icon" onClick={() => navigate(-1)} />
                    <h2>{navName ? translateCuestionarioName(navName, language).toUpperCase() : t('cargando')}</h2>
                </div>
                <div className="preguntas-skeleton-container">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="preguntas-card-skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    const submitLabel = existingRecord ? t('completar') : t('enviar');

    return (
        <div className="preguntas-bg">
            <div className="preguntas-header">
                <FaArrowLeft
                    className="preguntas-back-icon"
                    onClick={() => {
                        if (getAnsweredCount() > 0) {
                            const confirmed = window.confirm(t('deseasSalirCambios'));
                            if (!confirmed) return;
                        }
                        navigate(-1);
                    }}
                />
                <h2>{translateCuestionarioName(navName || cuestionarioInfo?.titulo || cuestionarioInfo?.nombre || 'Preguntas', language).toUpperCase()}</h2>
                <button
                    className="preguntas-info-btn"
                    onClick={() => setShowInstrucciones(true)}
                    title={t('instrucciones')}
                >
                    <FaInfoCircle />
                    <span>{t('instrucciones')}</span>
                </button>
            </div>

            <div className="preguntas-progress-bar">
                <div
                    className="preguntas-progress-fill"
                    style={{ width: `${(getAnsweredCount() / Math.max(preguntas.length, 1)) * 100}%` }}
                />
            </div>
            <p className="preguntas-progress-text">
                {getAnsweredCount()} / {preguntas.length} {t('respondidas')}
            </p>

            <div className="preguntas-scroll-area" ref={scrollRef}>
                {preguntas.length === 0 ? (
                    <div className="preguntas-empty">
                        <p>{language === 'en' ? 'No questions found.' : 'No se encontraron preguntas.'}</p>
                        <p>{language === 'en' ? 'Please try again later.' : 'Inténtelo más tarde.'}</p>
                    </div>
                ) : (
                    pagPreguntas.map((pregunta, idx) => (
                        <PreguntaCard
                            key={pregunta.id}
                            pregunta={pregunta}
                            numero={currentPage * PAGE_SIZE + idx + 1}
                            respuesta={respuestas[pregunta.id]}
                            onSelectSingle={handleSelectSingle}
                            onToggleMulti={handleToggleMulti}
                            onTexto={handleTexto}
                            allPreguntas={preguntas}
                            language={language}
                        />
                    ))
                )}
            </div>

            {numPages > 1 && (
                <div className="preguntas-pagination">
                    {Array.from({ length: numPages }, (_, i) => (
                        <button
                            key={i}
                            className={`preguntas-page-btn ${currentPage === i ? 'active' : ''}`}
                            onClick={() => handlePageChange(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <div className="preguntas-footer">
                <button
                    className="preguntas-enviar-btn"
                    onClick={handleEnviar}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('enviando') : submitLabel}
                </button>
            </div>

            {showInstrucciones && (
                <div className="preguntas-modal-overlay" onClick={() => setShowInstrucciones(false)}>
                    <div className="preguntas-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="preguntas-modal-logo" />
                        <h3>{t('instrucciones')}</h3>
                        <p>{instrucciones || (language === 'en' ? 'No additional instructions for this questionnaire.' : 'No hay instrucciones adicionales para este cuestionario.')}</p>
                        <button onClick={() => setShowInstrucciones(false)}>{t('cerrar') || (language === 'en' ? 'Close' : 'Cerrar')}</button>
                    </div>
                </div>
            )}

            {resultadosModal && (
                <div className="preguntas-modal-overlay">
                    <div className="preguntas-resultados-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="preguntas-modal-logo" />
                        <h3 className="preguntas-resultados-titulo">{language === 'en' ? 'Results' : 'Resultados'}</h3>
                        <div className="preguntas-resultados-lista">
                            {resultadosModal.map((res, i) => (
                                <div key={i} className="preguntas-resultado-item">
                                    {res.especialidad || res.nombre ? (
                                        <p className="preguntas-resultado-especialidad">
                                            {res.especialidad || res.nombre}
                                        </p>
                                    ) : null}
                                    {res.puntuacion !== undefined ? (
                                        <p className="preguntas-resultado-puntuacion">
                                            {language === 'en' ? 'Score: ' : 'Puntuación: '}<strong>{res.puntuacion}</strong>
                                        </p>
                                    ) : null}
                                    {res.diagnostico || res.descripcion ? (
                                        <p className="preguntas-resultado-diagnostico">
                                            {res.diagnostico || res.descripcion}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        <button
                            className="preguntas-resultados-continuar"
                            onClick={() => {
                                setResultadosModal(null);
                                navigate('/secciones');
                            }}
                        >
                            {language === 'en' ? 'Continue' : 'Continuar'}
                        </button>
                    </div>
                </div>
            )}

            <FloatingActionMenu />
        </div>
    );
}

function PreguntaCard({ pregunta, numero, respuesta, onSelectSingle, onToggleMulti, onTexto, language }) {
    const respOrdenadas = [...(pregunta.respuestas || [])].sort(
        (a, b) => (b.calificacion || 0) - (a.calificacion || 0)
    );

    const isMulti = pregunta.opcion_multiple === true || pregunta.opcion_multiple === 1;
    const isEspecificar = pregunta.especificar_respuesta === true || pregunta.especificar_respuesta === 1;
    const tieneRespuestas = respOrdenadas.length > 0;

    if (!tieneRespuestas) {
        return (
            <div className="pregunta-card">
                <div className="pregunta-card-header">
                    <p className="pregunta-texto">
                        <span className="pregunta-numero">{numero}.</span> {translateQuestion(pregunta, language)}
                    </p>
                    {pregunta.explicacion_pregunta ? (
                        <span className="pregunta-info-icon" title={pregunta.explicacion_pregunta}>
                            <FaInfoCircle />
                        </span>
                    ) : null}
                </div>
                <div className="pregunta-divider" />
                <div className="pregunta-respuestas">
                    <InputDirecto
                        pregunta={pregunta}
                        respuesta={respuesta}
                        onTexto={onTexto}
                        language={language}
                    />
                </div>
            </div>
        );
    }

    if (isEspecificar) {
        return (
            <div className="pregunta-card">
                <div className="pregunta-card-header">
                    <p className="pregunta-texto">
                        <span className="pregunta-numero">{numero}.</span> {translateQuestion(pregunta, language)}
                    </p>
                    {pregunta.explicacion_pregunta ? (
                        <span className="pregunta-info-icon" title={pregunta.explicacion_pregunta}>
                            <FaInfoCircle />
                        </span>
                    ) : null}
                </div>
                <div className="pregunta-divider" />
                <div className="pregunta-respuestas">
                    {respOrdenadas.map(op => {
                        const checked = (respuesta?.multiIds || []).includes(op.id);
                        const opEspecifica = op.especificar_respuesta === true || op.especificar_respuesta === 1;
                        return (
                            <React.Fragment key={op.id}>
                                <label className="respuesta-opcion">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            onToggleMulti(
                                                pregunta.id,
                                                op.id,
                                                op.ponderacion || op.calificacion || 0,
                                                op.respuesta
                                            )
                                        }
                                    />
                                    <span>{translateAnswer(op.respuesta, language, op.answer)}</span>
                                </label>
                                {opEspecifica && checked && (
                                    <input
                                        type="text"
                                        className="respuesta-especificar"
                                        placeholder={(language === 'en' ? (pregunta.detail_specification || pregunta.detalle_especificacion) : pregunta.detalle_especificacion) || (language === 'en' ? 'Specify...' : 'Especifique...')}
                                        value={respuesta?.texto || ''}
                                        onChange={e => onTexto(pregunta.id, e.target.value)}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="pregunta-card">
            <div className="pregunta-card-header">
                <p className="pregunta-texto">
                    <span className="pregunta-numero">{numero}.</span> {translateQuestion(pregunta, language)}
                </p>
                {pregunta.explicacion_pregunta ? (
                    <span className="pregunta-info-icon" title={pregunta.explicacion_pregunta}>
                        <FaInfoCircle />
                    </span>
                ) : null}
            </div>
            <div className="pregunta-divider" />
            <div className="pregunta-respuestas">
                {isMulti
                    ? respOrdenadas.map(op => {
                        const checked = (respuesta?.multiIds || []).includes(op.id);
                        const opEspecifica = op.especificar_respuesta === true || op.especificar_respuesta === 1;
                        return (
                            <React.Fragment key={op.id}>
                                <label className="respuesta-opcion">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            onToggleMulti(
                                                pregunta.id,
                                                op.id,
                                                op.ponderacion || op.calificacion || 0,
                                                op.respuesta
                                            )
                                        }
                                    />
                                    <span>{translateAnswer(op.respuesta, language, op.answer)}</span>
                                </label>
                                {opEspecifica && checked && (
                                    <input
                                        type="text"
                                        className="respuesta-especificar"
                                        placeholder={(language === 'en' ? (pregunta.detail_specification || pregunta.detalle_especificacion) : pregunta.detalle_especificacion) || (language === 'en' ? 'Specify...' : 'Especifique...')}
                                        value={respuesta?.texto || ''}
                                        onChange={e => onTexto(pregunta.id, e.target.value)}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                    : respOrdenadas.map(op => {
                        const checked = respuesta?.respuestaId === op.id;
                        const opEspecifica = op.especificar_respuesta === true || op.especificar_respuesta === 1;
                        return (
                            <React.Fragment key={op.id}>
                                <label className="respuesta-opcion">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            onSelectSingle(
                                                pregunta.id,
                                                checked ? 0 : op.id,
                                                checked ? 0 : (op.ponderacion || op.calificacion || 0)
                                            )
                                        }
                                    />
                                    <span>{translateAnswer(op.respuesta, language, op.answer)}</span>
                                </label>
                                {opEspecifica && checked && (
                                    <input
                                        type="text"
                                        className="respuesta-especificar"
                                        placeholder={(language === 'en' ? (pregunta.detail_specification || pregunta.detalle_especificacion) : pregunta.detalle_especificacion) || (language === 'en' ? 'Specify...' : 'Especifique...')}
                                        value={respuesta?.texto || ''}
                                        onChange={e => onTexto(pregunta.id, e.target.value)}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

function InputDirecto({ pregunta, respuesta, onTexto, language }) {
    const tipo = pregunta.id_tipo_opcion;

    if (tipo === 2) {
        return (
            <input
                type="text"
                className="respuesta-input-directo"
                placeholder={language === 'en' ? 'Write your answer...' : 'Escriba su respuesta...'}
                value={respuesta?.texto || ''}
                onChange={e => onTexto(pregunta.id, e.target.value)}
            />
        );
    }

    if (tipo === 31) {
        return (
            <input
                type="number"
                className="respuesta-input-directo"
                placeholder={language === 'en' ? 'Enter a number...' : 'Ingrese un número...'}
                value={respuesta?.texto || ''}
                onChange={e => onTexto(pregunta.id, e.target.value)}
            />
        );
    }

    if (tipo === 32) {
        return (
            <input
                type="time"
                className="respuesta-input-directo"
                value={respuesta?.texto || ''}
                onChange={e => onTexto(pregunta.id, e.target.value)}
            />
        );
    }

    if (tipo === 33) {
        return (
            <input
                type="date"
                className="respuesta-input-directo"
                value={respuesta?.texto || ''}
                onChange={e => onTexto(pregunta.id, e.target.value)}
            />
        );
    }

    return null;
}
