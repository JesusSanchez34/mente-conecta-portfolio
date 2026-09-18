import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaArrowLeft } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import logoColor from '../../../assets/img/logoColor.png';
import MenteImg from '../../../assets/img/Mente_conecta_con_eslogan-Photo.png';
import { getUsuarioCuestionario, getDatosPuntuacionFecha } from '../../../api/user';
import { AlertaAvisoMedicoModal } from '../../../components/alertas/AlertaModal';
import { FloatingActionMenu } from '../FloatingActionMenu';
import { useSettings } from '../../../context/SettingsContext';
import { useAuth } from '../../../hooks';
import './CuestionarioSaludMentalScreen.css';

export function CuestionarioSaludMentalScreen() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [cuestionarios, setCuestionarios] = useState([]);
    const [puntuaciones, setPuntuaciones] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, ruta: null });
    const [finalizadoModal, setFinalizadoModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioId = auth?.userId || localStorage.getItem("user_id");
                
                if (!usuarioId) {
                    setIsLoading(false);
                    return;
                }

                setTimeout(async () => {
                    try {
                        const [dataCuest, dataPunt] = await Promise.all([
                            getUsuarioCuestionario(usuarioId),
                            getDatosPuntuacionFecha(usuarioId).catch(() => [])
                        ]);
                        setCuestionarios(dataCuest || []);
                        setPuntuaciones(Array.isArray(dataPunt) ? dataPunt : []);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                    }
                }, 1000); // 1 segundo de skeleton
            } catch (error) {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const verificarAutorizacion = (idCuestionarioRequerido) => {
        const registros = cuestionarios.filter(c => parseInt(c.id_cuestionario) === idCuestionarioRequerido || parseInt(c.id) === idCuestionarioRequerido);
        if (registros.length === 0) return true; // Si no hay datos previos, es autorizado
        // Ordenar por fecha y verificar el último
        registros.sort((a, b) => new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0));
        return registros[0].autorizado !== "no autorizado";
    };

    const verificarCompletado = (idCuestionarioRequerido) => {
        if (!idCuestionarioRequerido) return false;
        const registros = puntuaciones.filter(p => parseInt(p.id_cuestionario) === idCuestionarioRequerido);
        return registros.length > 0;
    };

    const handleTap = (ruta, idCuestionarioRequerido, completado) => {
        if (completado) {
            setFinalizadoModal(true);
            return;
        }
        if (idCuestionarioRequerido && !verificarAutorizacion(idCuestionarioRequerido)) {
            toast.error("Atención: No tienes autorización para realizar esta prueba en este momento.");
            return;
        }
        setModalState({ isOpen: true, ruta: ruta });
    };

    const handleConfirmar = () => {
        if (modalState.ruta) {
            navigate(modalState.ruta);
        }
        setModalState({ isOpen: false, ruta: null });
    };

    const handleCancelar = () => {
        setModalState({ isOpen: false, ruta: null });
    };

    const opciones = [
        { title: t('smMarcadoresBiologicos'), route: "/marcadores-biologicos", requiredId: null },
        { title: t('smEdadCognitiva'), route: "/secuenciavistas", requiredId: 47 },
        { title: t('smRiesgoDeterioroCognitivo'), route: "/Deterioro_Cognitivo", requiredId: 48 },
        { title: t('smEnvejecimientoSaludable'), route: "/envejecimiento-saludable", requiredId: null },
    ];



    return (
        <div className="salud-mental-bg">
            <div className="salud-mental-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/secciones')} />
                <h2>{t('smTitulo')}</h2>
                <img src={logoColor} alt="Logo" className="header-small-logo" />
            </div>

            <div className="salud-mental-content">
                <div className="salud-mental-cards-container">
                    {isLoading ? (
                        <>
                            <div className="salud-mental-skeleton"></div>
                            <div className="salud-mental-skeleton"></div>
                            <div className="salud-mental-skeleton"></div>
                            <div className="salud-mental-skeleton"></div>
                        </>
                    ) : (
                        opciones.map((opcion, index) => {
                            const completado = verificarCompletado(opcion.requiredId);
                            return (
                                <div 
                                    key={index} 
                                    className="salud-mental-card"
                                    onClick={() => handleTap(opcion.route, opcion.requiredId, completado)}
                                >
                                    <span className="salud-mental-card-title">{opcion.title}</span>
                                    {completado ? (
                                        <FiCheck className="salud-mental-play-icon" style={{ color: '#6ab0f3', fontSize: '1.8rem', strokeWidth: '3' }} />
                                    ) : (
                                        <FaPlayCircle className="salud-mental-play-icon" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="salud-mental-footer">
                    {isLoading ? (
                        <div className="image-skeleton-small"></div>
                    ) : (
                        <img src={MenteImg} alt="Mente Ligera" className="footer-image-watermark" />
                    )}
                </div>
            </div>

            <FloatingActionMenu />

            {finalizadoModal && (
                <div className="sm-finalizado-overlay" onClick={() => setFinalizadoModal(false)}>
                    <div className="sm-finalizado-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="sm-finalizado-logo" />
                        <h3>{t('finalizado')}</h3>
                        <p>{t('cuestionarioTerminado')}</p>
                        <button className="sm-finalizado-btn" onClick={() => setFinalizadoModal(false)}>{t('ok')}</button>
                    </div>
                </div>
            )}

            <AlertaAvisoMedicoModal
                isOpen={modalState.isOpen}
                onConfirm={handleConfirmar}
                onCancel={handleCancelar}
            />
        </div>
    );
}
