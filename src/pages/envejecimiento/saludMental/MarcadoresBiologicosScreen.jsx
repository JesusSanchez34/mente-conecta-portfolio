import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlayCircle } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';
import { getUsuarioCuestionario } from '../../../api/user';
import { FloatingActionMenu } from '../FloatingActionMenu';
import { AlertaAvisoMedicoModal } from '../../../components/alertas/AlertaModal';
import { useSettings } from '../../../context/SettingsContext';
import logoColor from '../../../assets/img/logoColor.png';
import MenteImg from '../../../assets/img/Mente_conecta_con_eslogan-Photo.png';
import './MarcadoresBiologicosScreen.css';



export function MarcadoresBiologicosScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t } = useSettings();
    const [isLoading, setIsLoading] = useState(true);
    const [cuestionarios, setCuestionarios] = useState([]);
    const [avisoModal, setAvisoModal] = useState({ open: false, ruta: null });
    const [finalizadoModal, setFinalizadoModal] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            let statusMap = { 45: 'autorizado', 46: 'autorizado' };
            let completadoMap = { 45: false, 46: false };
            try {
                const data = await getUsuarioCuestionario(userId);
                if (Array.isArray(data)) {
                    [45, 46].forEach(id => {
                        const registros = data.filter(item => parseInt(item.id_cuestionario) === id);
                        if (registros.length > 0) {
                            completadoMap[id] = true;
                            registros.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
                            statusMap[id] = (registros[0].autorizado ?? 'autorizado').toString().trim().toLowerCase();
                        }
                    });
                }
            } catch (_) {}
            setCuestionarios([
                { titulo: t('marcEdadFisiologica'), ruta: '/Cuestionario_Glucosa', id: 45, estado: statusMap[45], completado: completadoMap[45] },
                { titulo: t('marcEdadCelular'), ruta: '/CuestionarioEdadCelularPantalla', id: 46, estado: statusMap[46], completado: completadoMap[46] },
            ]);
            setIsLoading(false);
        };
        fetchStatus();
    }, [auth]);

    const handleTap = (ruta, estado, completado) => {
        if (completado) {
            setFinalizadoModal(true);
            return;
        }
        if (estado === 'no autorizado') return;
        setAvisoModal({ open: true, ruta });
    };

    return (
        <div className="marcadores-bg">
            <div className="marcadores-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/envejecimiento/salud-mental')} />
                <h2>{t('smTitulo')}</h2>
                <img src={logoColor} alt="Logo" className="header-small-logo" />
            </div>

            <div className="marcadores-content">
                {isLoading ? (
                    <>
                        <div className="marcadores-skeleton" />
                        <div className="marcadores-skeleton" />
                    </>
                ) : (
                    cuestionarios.map((item, i) => (
                        <div
                            key={i}
                            className="marcadores-card"
                            onClick={() => handleTap(item.ruta, item.estado, item.completado)}
                        >
                            <span className="marcadores-card-title">{item.titulo}</span>
                            {item.completado ? (
                                <FiCheck className="marcadores-play-icon" style={{ color: '#6ab0f3', strokeWidth: '3' }} />
                            ) : (
                                <FaPlayCircle className="marcadores-play-icon" />
                            )}
                        </div>
                    ))
                )}

                <div className="marcadores-footer">
                    <img src={MenteImg} alt="Mente Conecta" className="footer-image-watermark" />
                </div>
            </div>

            <FloatingActionMenu />

            {finalizadoModal && (
                <div className="aviso-overlay" onClick={() => setFinalizadoModal(false)}>
                    <div className="aviso-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="aviso-logo" />
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#1a202c' }}>{t('finalizado')}</h3>
                        <p className="aviso-text">{t('cuestionarioTerminado')}</p>
                        <div className="aviso-btns">
                            <button className="aviso-btn-primary" onClick={() => setFinalizadoModal(false)}>{t('ok')}</button>
                        </div>
                    </div>
                </div>
            )}

            <AlertaAvisoMedicoModal
                isOpen={avisoModal.open}
                onConfirm={() => {
                    navigate(avisoModal.ruta);
                    setAvisoModal({ open: false, ruta: null });
                }}
                onCancel={() => setAvisoModal({ open: false, ruta: null })}
            />
        </div>
    );
}
