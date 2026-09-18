import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../hooks';
import {
    getCuestionariosPorSeccionApi,
    getRespuestasUsuarioApi,
    obtenerResultadosCuestionarioApi
} from '../../../api/cuestionario';
import avatarImg from '../../../assets/img/avatar.jpg';
import './Evaluacion.css';

export function EvaluacionMental() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { auth } = useAuth();
    const token = auth?.token;
    const userId = auth?.me?.id;

    const [activeEval, setActiveEval] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const [cuestionariosStatus, setCuestionariosStatus] = useState({});
    const [fetchingStatus, setFetchingStatus] = useState(true);

    // Results Modal states
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [resultsTitle, setResultsTitle] = useState('');
    const [resultsData, setResultsData] = useState([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);



    const subEvaluaciones = [
        {
            title: 'SINTOMATOLOGÍA PSIQUIÁTRICA',
            displayTitle: t('evaluations.mental_sub_title_1', 'SINTOMATOLOGÍA PSIQUIÁTRICA'),
            modalTitle: t('evaluations.mental_sub_modal_title_1', 'Sintomatología Psiquiátrica'),
            description: t('evaluations.mental_sub_desc_1', 'La salud mental, es un estado de bienestar que permite a las personas hacer frente a los momentos de estrés de la vida. Pero si hay un desequilibrio, es necesario atenderlo. Aquí encontrará cuestionarios que le ayudaran a saber sobre su salud mental y recomendaciones de que hacer.'),
            path: '/seguridad/evaluacion-mental/sintomatologia'
        },
        {
            title: 'CONDUCTA ALIMENTARIA',
            displayTitle: t('evaluations.mental_sub_title_2', 'CONDUCTA ALIMENTARIA'),
            modalTitle: t('evaluations.mental_sub_modal_title_2', 'Conducta Alimentaria'),
            description: t('evaluations.mental_sub_desc_2', 'Los alimentos que consumimos ayudan a nuestra salud física, aportan energía para el buen funcionamiento, pero también pueden mermar nuestra salud mental. Te pedimos respondas el siguiente cuestionario que te ayudará a conocer si es correcta tu forma de alimentarte.'),
            path: '/seguridad/evaluacion-mental/conducta-alimentaria'
        },
        {
            title: 'FUNCIONAMIENTO GLOBAL',
            displayTitle: t('evaluations.mental_sub_title_3', 'FUNCIONAMIENTO GLOBAL'),
            modalTitle: t('evaluations.mental_sub_modal_title_3', 'Funcionamiento Global'),
            description: t('evaluations.mental_sub_desc_3', 'Esta escala evalúa la funcionalidad global existente en su vida, que tan funcional eres tomando varios aspectos de tu vida.'),
            path: '/seguridad/evaluacion-mental/funcionamiento-global'
        },
        {
            title: 'EVENTOS TRAUMÁTICOS',
            displayTitle: t('evaluations.mental_sub_title_4', 'EVENTOS TRAUMÁTICOS'),
            modalTitle: t('evaluations.mental_sub_modal_title_4', 'Eventos Traumáticos'),
            description: t('evaluations.mental_sub_desc_4', 'Todos hemos sufrido algún trauma, o eventos que nos han marcado, este cuestionario nos ayudará a ver si estos fueron significativos en nuestra salud mental.'),
            path: '/seguridad/evaluacion-mental/eventos-traumaticos'
        },
        {
            title: 'ESCALA DE RESILIENCIA',
            displayTitle: t('evaluations.mental_sub_title_5', 'ESCALA DE RESILIENCIA'),
            modalTitle: t('evaluations.mental_sub_modal_title_5', 'Escala de Resiliencia'),
            description: t('evaluations.mental_sub_desc_5', 'La resiliencia es la capacidad de adaptación frente situaciones adversas, en este cuestionario encontrarás preguntas donde se describen situaciones que pasaste y cómo las solucionaste.'),
            path: '/seguridad/evaluacion-mental/resiliencia'
        },
        {
            title: 'EVALUACIÓN DE TABACO',
            displayTitle: t('evaluations.mental_sub_title_6', 'EVALUACIÓN DE TABACO'),
            modalTitle: t('evaluations.mental_sub_modal_title_6', 'Evaluación de Tabaco'),
            description: t('evaluations.mental_sub_desc_6', 'El consumo de tabaco tiene un impacto directo en la salud física y mental. Este cuestionario nos ayudará a conocer tus hábitos respecto al consumo de tabaco y ofrecerte recomendaciones oportunas.'),
            path: '/seguridad/evaluacion-mental/tabaco'
        },
        {
            title: 'EVALUACIÓN DE ALCOHOL',
            displayTitle: t('evaluations.mental_sub_title_7', 'EVALUACIÓN DE ALCOHOL'),
            modalTitle: t('evaluations.mental_sub_modal_title_7', 'Evaluación de Alcohol'),
            description: t('evaluations.mental_sub_desc_7', 'El consumo de alcohol puede afectar tu bienestar general y tus relaciones personales. Este cuestionario nos permitirá evaluar tu nivel de consumo de alcohol y proporcionarte orientación adecuada.'),
            path: '/seguridad/evaluacion-mental/alcohol'
        }
    ];

    useEffect(() => {
        if (!token || !userId) return;

        (async () => {
            try {
                setFetchingStatus(true);
                const idParentesco = parseInt(sessionStorage.getItem('idParentesco') || '0');
                const cuestionarios = await getCuestionariosPorSeccionApi(token, 2);

                const statusMap = {};
                await Promise.all(
                    cuestionarios.map(async (c) => {
                        const respuestas = await getRespuestasUsuarioApi(token, userId, c.id, idParentesco);
                        if (respuestas) {
                            const isFinalizado = respuestas.estatus_finalizado !== undefined
                                ? respuestas.estatus_finalizado === 1
                                : respuestas.estatusFinalizado === 1;
                            const rJson = respuestas.respuestas_json || respuestas.respuestasJson;

                            statusMap[c.titulo.toUpperCase().trim()] = {
                                finalizado: isFinalizado,
                                respuestasJson: rJson,
                                recordId: respuestas.id,
                                generaResultado: c.genera_resultados ?? c.generaResultado ?? 0
                            };
                        }
                    })
                );
                setCuestionariosStatus(statusMap);
            } catch (error) {
                console.error("Error fetching questionnaire statuses:", error);
            } finally {
                setFetchingStatus(false);
            }
        })();
    }, [token, userId]);

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

    const handleCardClick = async (item) => {
        const statusInfo = cuestionariosStatus[item.title.toUpperCase().trim()];
        const isCompleted = statusInfo?.finalizado;
        
        if (isCompleted) {
            if (statusInfo.generaResultado === 1 && statusInfo.respuestasJson) {
                try {
                    setShowLoading(true);
                    const diagResult = await obtenerResultadosCuestionarioApi(token, statusInfo.respuestasJson);
                    setResultsTitle(item.modalTitle);
                    setResultsData(diagResult);
                    setSelectedDiagnosis(null);
                    setShowResultsModal(true);
                } catch (e) {
                    console.error(e);
                    alert(t('evaluations.alert_error_results', 'Error al cargar los resultados de la evaluación.'));
                } finally {
                    setShowLoading(false);
                }
            } else {
                alert(t('evaluations.alert_completed', 'Cuestionario terminado / Finalizado'));
            }
        } else {
            setActiveEval(item);
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
                <h2>{t('evaluations.mental_health_title', 'Evaluación de Salud Mental')}</h2>

                {fetchingStatus ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="mental-loader-dots" style={{ margin: '0 auto 20px' }}>
                            <div className="mental-loader-dot" />
                            <div className="mental-loader-dot" />
                            <div className="mental-loader-dot" />
                            <div className="mental-loader-dot" />
                        </div>
                        <h3>{t('evaluations.synchronizing_status', 'Sincronizando estados de la evaluación...')}</h3>
                    </div>
                ) : (
                    <div className="mental-buttons-container">
                        {subEvaluaciones.map((item, index) => {
                            const statusInfo = cuestionariosStatus[item.title.toUpperCase().trim()];
                            const isCompleted = statusInfo?.finalizado;

                            return (
                                <div
                                    key={index}
                                    className={`mental-button-card ${isCompleted ? 'completo' : 'realizar'}`}
                                    onClick={() => handleCardClick(item)}
                                >
                                    <span className="mental-button-title">{item.displayTitle || item.title}</span>
                                    
                                    <div className="mental-button-action">
                                        {isCompleted ? (
                                            <div className="mental-completed-badge" style={{ pointerEvents: 'auto' }}>
                                                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" fill="#10b981" />
                                                    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="mental-completed-text">{t('evaluations.action_completed', 'COMPLETO')}</span>
                                                {statusInfo.generaResultado === 1 && (
                                                    <button 
                                                        className="btn-ver-resultados"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCardClick(item);
                                                        }}
                                                    >
                                                        {t('evaluations.action_results', 'RESULTADOS')}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mental-play-icon">
                                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                                                        <path d="M10 8.5V15.5L15.5 12L10 8.5Z" fill="white" />
                                                    </svg>
                                                </div>
                                                <span className="mental-button-action-text">{t('evaluations.action_perform', 'REALIZAR')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de Alerta con Animación de Foco */}
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

            {/* Modal de Resultados y Pre-diagnósticos */}
            {showResultsModal && (
                <div className="mental-modal-overlay" onClick={() => setShowResultsModal(false)}>
                    <div className="mental-modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
                        
                        {selectedDiagnosis ? (
                            <div className="mental-detail-back-row">
                                <button className="btn-modal-back" onClick={() => setSelectedDiagnosis(null)}>
                                    ← {t('evaluations.back_to_results', 'Ver todos los resultados')}
                                </button>
                            </div>
                        ) : (
                            <div className="mental-results-header">
                                <span style={{ fontSize: '70px' }}>📊</span>
                            </div>
                        )}

                        <div className="mental-modal-body" style={{ padding: '25px', paddingTop: selectedDiagnosis ? '10px' : '25px' }}>
                            {!selectedDiagnosis ? (
                                <>
                                    <h3 className="mental-modal-title" style={{ color: '#2196f3', marginBottom: '8px' }}>
                                        {t('evaluations.results_for', 'Resultados de')} {resultsTitle}
                                    </h3>
                                    <p className="mental-modal-description" style={{ marginBottom: '15px' }}>
                                        {t('evaluations.click_diagnosis', 'Haz clic en un diagnóstico para ver recomendaciones y especialista.')}
                                    </p>
                                    
                                    <div className="mental-results-grid" style={{ width: '100%', boxSizing: 'border-box' }}>
                                        {resultsData.length === 0 ? (
                                            <p style={{ fontStyle: 'italic', color: '#64748b' }}>
                                                {t('evaluations.no_risks_detected', 'No se detectaron riesgos en este cuestionario.')}
                                            </p>
                                        ) : (
                                            resultsData.map((res, idx) => {
                                                const espNombre = res.especialidad_nombre || res.especialidadNombre;
                                                return (
                                                    <div 
                                                        key={idx} 
                                                        className="mental-result-card-item"
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' }}
                                                        onClick={() => setSelectedDiagnosis(res)}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                border: '2px solid #10b981',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#10b981',
                                                                fontWeight: 'bold',
                                                                fontSize: '1.1rem'
                                                            }}>✓</div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '2px' }}>
                                                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{t('evaluations.pre_diagnosis', 'PRE-DIAGNÓSTICO:')}</span>
                                                                <strong style={{ fontSize: '1.15rem', color: '#1e293b', textTransform: 'uppercase', fontWeight: '800' }}>{espNombre}</strong>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>{t('evaluations.status_ready', 'LISTO')}</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', width: '100%' }}>
                                        <button className="mental-modal-btn" style={{ background: '#64748b' }} onClick={() => setShowResultsModal(false)}>
                                            {t('evaluations.close_btn', 'Cerrar')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        width: 'calc(100% + 48px)',
                                        margin: '-10px -24px 20px -24px',
                                        height: '140px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg viewBox="0 0 24 24" width="70" height="70" fill="none" xmlns="http://www.w3.org/2000/svg" className="mental-modal-lightbulb">
                                            <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-top" />
                                            <path d="M19 7L17.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tr" />
                                            <path d="M5 7L6.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" className="ray ray-tl" />
                                            <path d="M12 5C8.5 5 6 7.5 6 11C6 13.5 7.5 15.5 9 16.5V19C9 19.5 9.5 20 10 20H14C14.5 20 15 19.5 15 19V16.5C16.5 15.5 18 13.5 18 11C18 7.5 15.5 5 12 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 22H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M10 13C11 12 13 12 14 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M12 13.5V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <h3 className="mental-modal-title" style={{ textTransform: 'uppercase', fontSize: '1.7rem', fontWeight: '800', margin: '0 0 16px 0', lineHeight: '1.3' }}>
                                        {t('evaluations.pre_diagnosis', 'PRE-DIAGNÓSTICO:')}<br />
                                        <span style={{ color: '#111827', fontWeight: '900' }}>{selectedDiagnosis.especialidad_nombre || selectedDiagnosis.especialidadNombre}</span>
                                    </h3>
                                    
                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#374151',
                                        lineHeight: '1.6',
                                        textAlign: 'center',
                                        margin: '0 0 20px 0',
                                        maxHeight: '220px',
                                        overflowY: 'auto',
                                        padding: '0 12px',
                                        boxSizing: 'border-box'
                                    }}>
                                        {selectedDiagnosis.descripcion_diagnostico || selectedDiagnosis.descripcionDiagnostico || selectedDiagnosis.especialidad_descripcion || selectedDiagnosis.especialidadDescripcion}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px', marginBottom: '15px' }}>
                                        <img 
                                            src={avatarImg} 
                                            alt="Especialista" 
                                            style={{
                                                width: '180px',
                                                height: '180px',
                                                objectFit: 'cover',
                                                borderRadius: '16px',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                                            }} 
                                        />
                                    </div>

                                    {selectedDiagnosis.especialista && selectedDiagnosis.especialista.length > 0 && (
                                        <div className="specialist-card-container">
                                            <div className="specialist-title">{t('evaluations.recommended_specialist', 'Especialista Recomendado')}</div>
                                            {selectedDiagnosis.especialista.map((esp, i) => {
                                                const lastName = esp.apellido_paterno || esp.apellido_1 || esp.apellido1 || '';
                                                const initials = `${esp.nombre?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
                                                return (
                                                    <div key={i} className="specialist-profile" style={{ marginBottom: i < selectedDiagnosis.especialista.length - 1 ? '12px' : '0' }}>
                                                        <div className="specialist-avatar">
                                                            {(esp.imagen || esp.img) ? (
                                                                <img src={esp.imagen || esp.img} alt={`${esp.nombre}`} />
                                                            ) : (
                                                                <span className="specialist-initials">{initials}</span>
                                                            )}
                                                        </div>
                                                        <div className="specialist-info">
                                                            <span className="specialist-name">Dr(a). {esp.nombre} {lastName} {esp.apellido_materno || esp.apellido_2 || esp.apellido2 || ''}</span>
                                                            <div className="specialist-contact">
                                                                <span>📧 {esp.email}</span>
                                                                <span>📞 Tel: {esp.telefono || 'S/N'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <button className="mental-modal-btn" style={{ marginTop: '24px' }} onClick={() => setSelectedDiagnosis(null)}>
                                        {t('login.back_btn', 'Regresar')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cargando con Animación de 4 Puntos */}
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
