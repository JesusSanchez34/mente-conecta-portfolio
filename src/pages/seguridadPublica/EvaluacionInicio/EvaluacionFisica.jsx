import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import './Evaluacion.css';

export function EvaluacionFisica() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeEval, setActiveEval] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const subEvaluaciones = [
        {
            title: t('evaluations.physical_sub_title_1', 'ESTADO GENERAL'),
            modalTitle: t('evaluations.physical_sub_modal_title_1', 'Estado General'),
            description: t('evaluations.physical_sub_desc_1', 'Cuestionario para conocer tu estado general de salud física, antecedentes médicos y hábitos de vida diarios.'),
            path: '/seguridad/evaluacion-fisica/estado-general'
        },
        {
            title: t('evaluations.physical_sub_title_2', 'CALIDAD DE SUEÑO'),
            modalTitle: t('evaluations.physical_sub_modal_title_2', 'Calidad de Sueño'),
            description: t('evaluations.physical_sub_desc_2', 'Este cuestionario evalúa tus patrones de descanso, horas de sueño y posibles dificultades para lograr un descanso óptimo.'),
            path: '/seguridad/evaluacion-fisica/calidad-sueno'
        },
        {
            title: t('evaluations.physical_sub_title_3', 'ACTIVIDAD FÍSICA'),
            modalTitle: t('evaluations.physical_sub_modal_title_3', 'Actividad Física'),
            description: t('evaluations.physical_sub_desc_3', 'En esta sección conoceremos tu nivel de actividad física diaria, frecuencia e intensidad del ejercicio que realizas.'),
            path: '/seguridad/evaluacion-fisica/actividad-fisica'
        },
        {
            title: t('evaluations.physical_sub_title_4', 'SALUD GLOBAL'),
            modalTitle: t('evaluations.physical_sub_modal_title_4', 'Salud Global'),
            description: t('evaluations.physical_sub_desc_4', 'Evaluación integral que relaciona diversos factores de tu estado de salud global físico y de bienestar.'),
            path: '/seguridad/evaluacion-fisica/salud-global'
        }
    ];

    const handleStartEvaluation = () => {
        if (activeEval) {
            const path = activeEval.path;
            setActiveEval(null);
            setShowLoading(true);

            setTimeout(() => {
                navigate(path);
                setShowLoading(false);
            }, 1800);
        }
    };

    return (
        <div className="evaluacion-layout">
            <div className="evaluacion-question-card">
                <button
                    className="btn-regresar"
                    onClick={() => navigate('/seguridad/Bienvenida')}
                    title={t('safety_layout.select_person_btn', 'Regresar')}
                >
                    <FaArrowLeft size={16} />
                </button>
                <h2>{t('evaluations.physical_health_title', 'Evaluación de Salud Física')}</h2>

                <div className="mental-buttons-container">
                    {subEvaluaciones.map((item, index) => (
                        <div
                            key={index}
                            className="mental-button-card"
                            onClick={() => setActiveEval(item)}
                        >
                            <span className="mental-button-title">{item.title}</span>
                            <div className="mental-button-action">
                                <div className="mental-play-icon">
                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                                        <path d="M10 8.5V15.5L15.5 12L10 8.5Z" fill="white" />
                                    </svg>
                                </div>
                                <span className="mental-button-action-text">{t('evaluations.action_perform', 'REALIZAR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Aviso */}
            {activeEval && (
                <div className="mental-modal-overlay" onClick={() => setActiveEval(null)}>
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
                            <h3 className="mental-modal-title">{activeEval.modalTitle}</h3>
                            <p className="mental-modal-description">{activeEval.description}</p>
                            <button className="mental-modal-btn" onClick={handleStartEvaluation}>
                                {t('evaluations.modal_ok', 'Ok')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cargando */}
            {showLoading && (
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
                            <h3 className="mental-modal-title" style={{ marginBottom: '8px' }}>{t('evaluations.loading_questions', 'Cargando preguntas')}</h3>
                            <p className="mental-loader-dots-text">...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
