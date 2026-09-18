import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
    FaArrowLeft, FaInfoCircle, FaCheck, FaTimes,
    FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useAuth, useCuestionario } from '../../hooks';
import { toast } from 'react-toastify';
import './PreguntasCuestionario.css';

export function PreguntasCuestionario() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        preguntas,
        respuestasUser,
        respuestasBack,
        setRespuesta,
        saveRespuestasUsuario,
        modificarRespuestasUsuario,
        saveDatosPaciente
    } = useCuestionario();

    const { cuestionarioId, tituloCuestionario } = location.state || {
        cuestionarioId: null,
        tituloCuestionario: 'Cuestionario'
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(preguntas.length / pageSize));
    const startIdx = currentPage * pageSize;
    const endIdx = Math.min(startIdx + pageSize, preguntas.length);
    const currentQuestions = preguntas.slice(startIdx, endIdx);

    // Guards AFTER all hooks
    if (auth === undefined) return null;
    if (!auth || auth?.detail || !cuestionarioId) {
        return <Navigate to="/paciente/inicio" replace />;
    }

    // ─── Handlers ────────────────────────────────────────────────────────────
    const handleBackClick = () => setShowExitModal(true);

    const confirmExit = () => {
        setShowExitModal(false);
        navigate('/paciente/cuestionarios');
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(p => p - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(p => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const valid = respuestasUser.filter(
                r => r.preguntaId !== 0 && (r.respuestaId !== 0 || r.respuestasUser !== '' || r.respuestaMultiOpcion !== '')
            );
            if (valid.length === 0) {
                toast.warning('Selecciona alguna respuesta antes de enviar.');
                return;
            }
            setShowConfirmSubmitModal(true);
        }
    };

    const handleSubmit = async () => {
        setShowConfirmSubmitModal(false);
        setSubmitting(true);
        try {
            const userId = auth.me?.id || auth.me?.user_id || 1;
            const valid = respuestasUser.filter(r => r.preguntaId !== 0);
            const isFinished = valid.length >= preguntas.length ? 1 : 0;

            // 🔍 LOG TEMPORAL — estado antes de guardar
            console.log('%c[PreguntasCuestionario] handleSubmit', 'color:#911d80;font-weight:bold');
            console.log('  userId:', userId);
            console.log('  cuestionarioId:', cuestionarioId);
            console.log('  total preguntas:', preguntas.length);
            console.log('  respuestas válidas:', valid.length);
            console.log('  estatus_finalizado:', isFinished);
            console.log('  respuestasBack (existing record):', respuestasBack);

            if (!respuestasBack || !respuestasBack?.id) {
                console.log('%c  → Creando NUEVO registro (POST)', 'color:#07afb8;font-weight:bold');
                await saveRespuestasUsuario(userId, cuestionarioId, isFinished, auth.token);
            } else {
                console.log('%c  → Modificando registro existente (PUT) id:', 'color:#f5a623;font-weight:bold', respuestasBack.id);
                await modificarRespuestasUsuario(respuestasBack.id, userId, cuestionarioId, isFinished, auth.token);
            }

            await saveDatosPaciente(userId, auth.token);
            toast.success('¡Respuestas guardadas con éxito!');
            navigate('/paciente/cuestionarios');
        } catch (error) {
            console.error('%c[PreguntasCuestionario] ERROR al guardar:', 'color:red;font-weight:bold', error);
            toast.error(error.message || 'Error al enviar el cuestionario.');
        } finally {
            setSubmitting(false);
        }
    };


    // ─── Response widget renderer ─────────────────────────────────────────────
    const renderResponseWidget = (pregunta) => {
        const userResp = respuestasUser.find(r => r.preguntaId === pregunta.id) || {
            respuestaId: 0,
            respuestasUser: '',
            respuestaMultiOpcion: '',
            respuestaOpcion: ''
        };

        const hasOptions = Array.isArray(pregunta.respuestas) && pregunta.respuestas.length > 0;

        // ── Questions WITH answer options (radio / checkbox) ─────────────────
        if (hasOptions) {
            const sorted = [...pregunta.respuestas].sort((a, b) => b.calificacion - a.calificacion);

            return (
                <div className="options-list-wrapper">
                    {sorted.map(option => {
                        const isChecked = pregunta.multiRespuesta
                            ? userResp.respuestaMultiOpcion.split(',').includes(option.id.toString())
                            : userResp.respuestaId === option.id;

                        const handleChange = (e) => {
                            const checked = e.target.checked;
                            if (pregunta.multiRespuesta) {
                                let list = userResp.respuestaMultiOpcion
                                    ? userResp.respuestaMultiOpcion.split(',').filter(x => x !== '')
                                    : [];
                                if (checked) list.push(option.id.toString());
                                else list = list.filter(id => id !== option.id.toString());
                                setRespuesta(option.id, pregunta.id, '', option.calificacion,
                                    list.join(','), pregunta.preguntaRegistro, pregunta.keyRegistro, option.respuesta);
                            } else {
                                if (checked) setRespuesta(option.id, pregunta.id, '', option.calificacion,
                                    '', pregunta.preguntaRegistro, pregunta.keyRegistro, option.respuesta);
                            }
                        };

                        return (
                            <div key={option.id} className="option-tile-item">
                                <label className="option-label-container">
                                    <input
                                        type={pregunta.multiRespuesta ? 'checkbox' : 'radio'}
                                        name={`question-${pregunta.id}`}
                                        checked={isChecked}
                                        onChange={handleChange}
                                        className="option-input-selector"
                                    />
                                    <span className="option-label-text">{option.respuesta}</span>
                                </label>

                                {option.especificarRespuesta && isChecked && (
                                    <div className="specification-box animate-fade-in">
                                        <input
                                            type="text"
                                            className="specification-text-input"
                                            placeholder={pregunta.detalleEspecificacion || 'Por favor, especifique'}
                                            value={userResp.respuestasUser}
                                            onChange={(e) =>
                                                setRespuesta(option.id, pregunta.id, e.target.value,
                                                    option.calificacion,
                                                    pregunta.multiRespuesta ? userResp.respuestaMultiOpcion : '',
                                                    pregunta.preguntaRegistro, pregunta.keyRegistro, option.respuesta)
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // ── Questions WITHOUT options: free-input widgets ─────────────────────
        const placeholder = pregunta.detalleEspecificacion || 'Escribe tu respuesta aquí...';
        const q = (pregunta.pregunta || '').toLowerCase();
        const tipo = pregunta.idTipoOpcion;

        const onChange = (val) =>
            setRespuesta(0, pregunta.id, val, 0, '', pregunta.preguntaRegistro, pregunta.keyRegistro, '');

        // DATE picker — idTipoOpcion 33 OR question mentions date/birth
        const isDate =
            tipo === 33 ||
            q.includes('fecha') || q.includes('nacimiento') ||
            q.includes('date')  || q.includes('birthday');

        if (isDate) {
            return (
                <div className="input-field-wrapper picker-input-wrapper">
                    <FaCalendarAlt className="picker-icon" />
                    <input
                        type="date"
                        className="custom-text-input-field picker-field"
                        value={userResp.respuestasUser}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );
        }

        // TIME picker — idTipoOpcion 32 OR question mentions time
        const isTime =
            tipo === 32 ||
            q.includes('hora') || q.includes('time');

        if (isTime) {
            return (
                <div className="input-field-wrapper picker-input-wrapper">
                    <FaClock className="picker-icon" />
                    <input
                        type="time"
                        className="custom-text-input-field picker-field"
                        value={userResp.respuestasUser}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );
        }

        // NUMERIC — idTipoOpcion 31 OR question mentions age/weight/height
        const isNumeric =
            tipo === 31 ||
            q.includes('edad')     || q.includes('años')     ||
            q.includes('peso')     || q.includes('kg')       ||
            q.includes('estatura') || q.includes('talla')    ||
            q.includes('cm')       || q.includes('imc')      ||
            q.includes('weight')   || q.includes('height')   ||
            q.includes('age')      || q.includes('meses');

        if (isNumeric) {
            return (
                <div className="input-field-wrapper">
                    <input
                        type="number"
                        className="custom-text-input-field"
                        placeholder={placeholder}
                        value={userResp.respuestasUser}
                        min="0"
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );
        }

        // DEFAULT — plain text (idTipoOpcion 2 or anything not recognised)
        return (
            <div className="input-field-wrapper">
                <input
                    type="text"
                    className="custom-text-input-field"
                    placeholder={placeholder}
                    value={userResp.respuestasUser}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="preguntas-container">
            {/* Top bar */}
            <header className="preguntas-top-bar">
                <button type="button" className="welcome-back-btn" onClick={handleBackClick} title="Volver">
                    <FaArrowLeft />
                </button>
                <h1 className="welcome-top-title header-title-shrink">{tituloCuestionario}</h1>
                <div className="preguntas-actions">
                    <button type="button" className="btn-text-action" onClick={() => setShowInstructionsModal(true)}>
                        <FaInfoCircle className="btn-icon-inside" />
                        Instrucciones
                    </button>
                </div>
            </header>

            {/* Question list */}
            <main className="preguntas-content-wrapper">
                <div className="preguntas-list">
                    {currentQuestions.map((pregunta, index) => (
                        <div key={pregunta.id} className="pregunta-glass-card animate-slide-up">
                            <div className="pregunta-header-row">
                                <span className="question-number">Pregunta {startIdx + index + 1}</span>
                                <h3 className="question-text-title">{pregunta.pregunta}</h3>
                                {pregunta.explicacionPregunta && (
                                    <div className="question-tooltip-wrapper" title={pregunta.explicacionPregunta}>
                                        <FaInfoCircle className="tooltip-trigger-icon" />
                                    </div>
                                )}
                            </div>
                            <hr className="question-divider" />
                            <div className="question-response-widget-container">
                                {renderResponseWidget(pregunta)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination bar */}
                <div className="preguntas-pagination-bar">
                    <button
                        type="button"
                        className={`pagination-btn-pill btn-back-prev ${currentPage === 0 ? 'disabled' : ''}`}
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                    >
                        <FaChevronLeft className="chevron-icon-left" />
                        Atrás
                    </button>

                    <div className="pagination-indicators-dots">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <span
                                key={idx}
                                className={`pagination-dot ${currentPage === idx ? 'active' : ''}`}
                                onClick={() => { setCurrentPage(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="pagination-btn-pill btn-forward-next"
                        onClick={handleNext}
                    >
                        {currentPage === totalPages - 1 ? 'Enviar' : 'Siguiente'}
                        {currentPage !== totalPages - 1 && <FaChevronRight className="chevron-icon-right" />}
                    </button>
                </div>
            </main>

            {/* ── Exit modal ── */}
            {showExitModal && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card animate-scale-up">
                        <div className="mca-modal-header centered-header">
                            <div className="modal-icon-warning-circle">
                                <FaTimes className="modal-icon-cross" />
                            </div>
                            <h3 className="mca-modal-title">¿Salir?</h3>
                        </div>
                        <div className="mca-modal-body text-center-body">
                            <p className="questionnaire-instructions-text">
                                Se perderán los cambios no guardados. ¿Deseas regresar?
                            </p>
                        </div>
                        <div className="mca-modal-footer dual-buttons">
                            <button type="button" className="modal-btn-action btn-cancel" onClick={() => setShowExitModal(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="modal-btn-action btn-confirm-exit" onClick={confirmExit}>
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Instructions modal ── */}
            {showInstructionsModal && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card animate-scale-up">
                        <div className="mca-modal-header centered-header">
                            <div className="modal-brain-logo-wrapper">
                                <FaInfoCircle className="modal-brain-logo" />
                            </div>
                            <h3 className="mca-modal-title">Instrucciones</h3>
                        </div>
                        <div className="mca-modal-body text-center-body">
                            <p className="questionnaire-instructions-text">
                                Por favor, responda cada pregunta basándose en cómo se ha sentido en las últimas semanas.
                            </p>
                        </div>
                        <div className="mca-modal-footer">
                            <button
                                type="button"
                                className="modal-btn-action btn-confirm-start"
                                style={{ width: '100%' }}
                                onClick={() => setShowInstructionsModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm submit modal ── */}
            {showConfirmSubmitModal && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card animate-scale-up">
                        <div className="mca-modal-header centered-header">
                            <div className="modal-icon-success-circle">
                                <FaCheck className="modal-icon-check" />
                            </div>
                            <h3 className="mca-modal-title">Finalizado</h3>
                        </div>
                        <div className="mca-modal-body text-center-body">
                            <p className="questionnaire-instructions-text">
                                Se guardarán tus respuestas. ¿Deseas continuar?
                            </p>
                        </div>
                        <div className="mca-modal-footer dual-buttons">
                            <button type="button" className="modal-btn-action btn-cancel" onClick={() => setShowConfirmSubmitModal(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="modal-btn-action btn-confirm-submit-save" onClick={handleSubmit}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Saving overlay ── */}
            {submitting && (
                <div className="loading-modal-overlay">
                    <div className="loading-modal-content">
                        <p>Guardando respuestas...</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
