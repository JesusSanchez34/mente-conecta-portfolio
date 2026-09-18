import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaLightbulb } from "react-icons/fa6";
import { useDemoQuestionnaire } from '../../hooks/demo/useDemoQuestionnaire';
import { anxietyQuestions } from '../../utils/demo/demoConstants';

export function DemoAnxietyQuestionnaire({ prevStep, onComplete }) {
    const [showExitModal, setShowExitModal] = useState(false);
    const {
        currentPage,
        answers,
        errors,
        showSuccessModal,
        currentQuestions,
        handleOptionChange,
        handleNext,
        handleSubmit,
        totalPages
    } = useDemoQuestionnaire(anxietyQuestions);

    useEffect(() => {
        const scrollArea = document.querySelector('.questions-scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = 0;
        }
    }, [currentPage]);

    return (
        <div className="questionnaire-container">
            <header className="questionnaire-header">
                <button className="icon-btn-back" onClick={() => setShowExitModal(true)}><FaArrowLeft /></button>
                <div className="header-title">Preguntas</div>
                <div className="header-placeholder"></div>
            </header>

            <div className="questions-scroll-area">
                <div className="question-instruction" style={{ padding: '15px', fontStyle: 'italic', color: '#666', fontWeight: 'bold' }}>
                    Piensa en las últimas 2 semanas, qué tan seguido le ha molestado lo siguiente:
                </div>
                {currentQuestions.map((q) => (
                    <div key={q.id}>
                        <div className={`question-card ${errors.includes(q.id) ? 'error' : ''}`}>
                            <p className="question-text">{q.text}</p>
                            {errors.includes(q.id) && <span className="error-mandatory">Responder obligatoriamente</span>}
                            <hr className="question-divider" />
                            <div className="options-container">
                                {q.type === "text" ? (
                                    <input 
                                        type="text" 
                                        className="question-text-input" 
                                        placeholder="Respuesta" 
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleOptionChange(q.id, e.target.value)}
                                    />
                                ) : (
                                    q.options.map((opt, idx) => (
                                        <label key={idx} className="option-label">
                                            <span>{opt}</span>
                                            <input 
                                                type="radio" 
                                                name={`question-${q.id}`} 
                                                className="option-radio" 
                                                checked={answers[q.id] === opt}
                                                onChange={() => handleOptionChange(q.id, opt)}
                                            />
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="questionnaire-footer">
                <div className="pagination-stepper">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button 
                            key={page} 
                            className={`page-dot ${currentPage === page ? 'active' : ''}`}
                            disabled={true}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                {currentPage < totalPages ? (
                    <button className="submit-btn" onClick={handleNext}>
                        Siguiente
                    </button>
                ) : (
                    <button className="submit-btn" onClick={handleSubmit}>
                        Enviar
                    </button>
                )}
            </footer>

            {showExitModal && (
                <div className="demo-modal-overlay" onClick={() => setShowExitModal(false)}>
                    <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="demo-modal-header-yellow">
                            <FaLightbulb className="modal-icon-lightbulb" />
                        </div>
                        <div className="demo-modal-body">
                            <h2 className="modal-title">¿Estás seguro que deseas salir?</h2>
                            <p className="modal-text">
                                Se guardarán tus preguntas al continuar.
                            </p>
                            <div className="modal-footer-btns">
                                <button className="modal-cancel-btn" onClick={() => setShowExitModal(false)}>
                                    Cancelar
                                </button>
                                <button className="modal-ok-btn" onClick={prevStep}>
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="demo-modal-overlay" onClick={onComplete}>
                    <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="demo-modal-header-yellow">
                            <FaLightbulb className="modal-icon-lightbulb" />
                        </div>
                        <div className="demo-modal-body">
                            <h2 className="modal-title">Cuestionario completado</h2>
                            <p className="modal-text">
                                Has completado el cuestionario de Ansiedad.
                            </p>
                            <button className="modal-ok-btn" onClick={onComplete}>
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
