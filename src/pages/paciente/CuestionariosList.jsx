import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaArrowRight, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { useAuth, useCuestionario } from '../../hooks';
import { obtenerRespuestasUsuarioApi } from '../../api/cuestionarios';
import { toast } from 'react-toastify';
import './CuestionariosList.css';

const FIGMA_ESTILOS = {
    1: { color: '#3B82F6', icon: <FaClipboardList /> },
    2: { color: '#8B5CF6', icon: <GiBrain /> },
    3: { color: '#10B981', icon: <FaClipboardList /> },
    default: { color: '#64748B', icon: <FaClipboardList /> }
};

export function CuestionariosList() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        cuestionarios,
        getCuestionariosPorSeccion,
        setCuestionarioId,
        setGeneraResultado,
        setGeneraResultadoSumatoria,
        setInstrucciones,
        setDinamico,
        loadRespuestasUsuario,
        getPreguntasRespuestas
    } = useCuestionario();

    const { seccionId, titulo } = location.state || { seccionId: 1, titulo: 'Sociodemográficos' };

    const [loading, setLoading] = useState(true);
    const [statuses, setStatuses] = useState({});
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [showIntroModal, setShowIntroModal] = useState(false);

    // All hooks BEFORE any conditional returns
    useEffect(() => {
        const fetchQuestionnairesAndStatus = async () => {
            if (!auth?.token) return;
            setLoading(true);
            try {
                const list = await getCuestionariosPorSeccion(seccionId, titulo, auth.token);
                const statusMap = {};
                const userId = auth.me?.id || auth.me?.user_id || 1;

                await Promise.all((list || []).map(async (c) => {
                    const res = await obtenerRespuestasUsuarioApi(userId, c.id, auth.token);
                    statusMap[c.id] = res?.estatus_finalizado || 0;
                }));

                setStatuses(statusMap);
            } catch (error) {
                console.error('Error al cargar cuestionarios:', error);
                toast.error('Error al cargar la lista de cuestionarios.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionnairesAndStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seccionId, titulo, auth?.token]);

    // Route guards AFTER hooks
    if (auth === undefined) return null;
    if (!auth || auth?.detail) {
        return <Navigate to="/admin" replace />;
    }

    const handleBack = () => navigate('/paciente/inicio');

    const handleAction = (cuestionario) => {
        if (statuses[cuestionario.id] === 1) {
            toast.info('Este cuestionario ya ha sido completado.');
            return;
        }
        setSelectedQuestionnaire(cuestionario);
        setShowIntroModal(true);
    };

    const startCuestionario = async () => {
        if (!selectedQuestionnaire) return;
        setShowIntroModal(false);
        setLoading(true);
        try {
            const userId = auth.me?.id || auth.me?.user_id || 1;

            setCuestionarioId(selectedQuestionnaire.id);
            setGeneraResultado(selectedQuestionnaire.generaResultado ?? 0);
            setGeneraResultadoSumatoria(selectedQuestionnaire.generaResultadoSumatoria ?? 0);
            setInstrucciones(selectedQuestionnaire.instrucciones ?? '');
            setDinamico(selectedQuestionnaire.dinamico ?? false);

            await getPreguntasRespuestas(selectedQuestionnaire.id, auth.token);
            await loadRespuestasUsuario(userId, selectedQuestionnaire.id, auth.token);

            navigate('/paciente/preguntas', {
                state: {
                    cuestionarioId: selectedQuestionnaire.id,
                    tituloCuestionario: selectedQuestionnaire.titulo
                }
            });
        } catch (error) {
            console.error('Error al iniciar el cuestionario:', error);
            toast.error('Error al iniciar el cuestionario. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cuestionarios-list-container">
            {/* Top Navigation Header */}
            <header className="cuestionarios-top-bar">
                <button type="button" className="welcome-back-btn" onClick={handleBack} title="Volver">
                    <FaArrowLeft />
                </button>
                <h1 className="welcome-top-title">Cuestionarios</h1>
            </header>

            {/* Background Floating Elements */}
            <div className="patient-floating-bg">
                <GiBrain className="patient-floating-icon p-icon-1" />
                <FaClipboardList className="patient-floating-icon p-icon-2" />
                <GiBrain className="patient-floating-icon p-icon-3" />
                <FaClipboardList className="patient-floating-icon p-icon-4" />
            </div>

            {/* Main Content Area */}
            <main className="cuestionarios-content-wrapper">
                <div className="cuestionarios-section-header">
                    <h2 className="section-title-label">{titulo}</h2>
                    <p className="section-subtitle-label">Completa los cuestionarios correspondientes a esta sección</p>
                </div>

                {loading ? (
                    <div className="loading-spinner-wrapper">
                        <div className="loading-spinner"></div>
                        <p>Cargando cuestionarios...</p>
                    </div>
                ) : (
                    <div className="cuestionarios-grid">
                        {cuestionarios.length === 0 ? (
                            <div className="no-cuestionarios-card">
                                <FaExclamationTriangle className="no-data-icon" />
                                <p>No hay cuestionarios disponibles en esta sección por el momento.</p>
                            </div>
                        ) : (
                            cuestionarios.map((cuestionario) => {
                                const estilo = FIGMA_ESTILOS[cuestionario.id] || FIGMA_ESTILOS.default;
                                const isCompleted = statuses[cuestionario.id] === 1;

                                return (
                                    <div key={cuestionario.id} className="cuestionario-card-item">
                                        <div
                                            className="cuestionario-card-header"
                                            style={{ background: `linear-gradient(135deg, ${estilo.color} 0%, ${estilo.color}cc 100%)` }}
                                        >
                                            <div className="card-header-left">
                                                <span className="card-tag">CUESTIONARIO</span>
                                                <h3 className="card-main-title">{cuestionario.titulo}</h3>
                                            </div>
                                            <div className="card-header-right-icon">{estilo.icon}</div>
                                        </div>

                                        <div className="cuestionario-card-body">
                                            <p className="cuestionario-card-desc">
                                                {cuestionario.descripcion || 'Completa esta evaluación para conocer tu estado de salud integral.'}
                                            </p>
                                        </div>

                                        <div
                                            className={`cuestionario-card-action-bar ${isCompleted ? 'completed' : 'pending'}`}
                                            onClick={() => handleAction(cuestionario)}
                                        >
                                            <span className="action-text">
                                                {isCompleted ? 'Completado' : 'Comenzar cuestionario'}
                                            </span>
                                            <span className="action-icon">
                                                {isCompleted ? <FaCheckCircle className="check-ok-icon" /> : <FaArrowRight />}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                <div className="cuestionarios-privacy-notice">
                    <p>Importante: Estos cuestionarios son confidenciales y tus respuestas están protegidas.</p>
                </div>
            </main>

            {/* Questionnaire Introduction Modal */}
            {showIntroModal && selectedQuestionnaire && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card animate-scale-up">
                        <div className="mca-modal-header centered-header">
                            <div className="modal-brain-logo-wrapper">
                                <GiBrain className="modal-brain-logo" />
                            </div>
                            <h3 className="mca-modal-title uppercase-title">
                                {selectedQuestionnaire.titulo}
                            </h3>
                        </div>
                        <div className="mca-modal-body text-center-body">
                            <p className="questionnaire-instructions-text">
                                {selectedQuestionnaire.descripcion || 'Completa esta evaluación para conocer tu estado de salud integral.'}
                            </p>
                        </div>
                        <div className="mca-modal-footer dual-buttons">
                            <button
                                type="button"
                                className="modal-btn-action btn-cancel"
                                onClick={() => setShowIntroModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="modal-btn-action btn-confirm-start"
                                onClick={startCuestionario}
                            >
                                Comenzar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
