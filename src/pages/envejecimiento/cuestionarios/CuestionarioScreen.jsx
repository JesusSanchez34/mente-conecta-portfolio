import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaPlayCircle, FaArrowLeft } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { FloatingActionMenu } from '../FloatingActionMenu';
import MenteImg from '../../../assets/img/Mente_conecta_con_eslogan-Photo.png';
import logoColor from '../../../assets/img/logoColor.png';
import { obtenerCuestionariosPorSeccion, obtenerRespuestasGuardadas } from '../../../api/user';
import { AuthContext } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import './CuestionarioScreen.css';

const CUESTIONARIO_NAME_EN = {
    determinante: 'Social Determinants',
    sociodemog: 'Sociodemographic',
    'salud mental': 'Mental Health',
    ansiedad: 'Anxiety',
    'depresi': 'Depression',
    deterioro: 'Cognitive Decline',
    alzheimer: "Alzheimer's",
    genotipo: 'Genotype',
    secuencia: 'Sequences',
    telomer: 'Telomere Length',
    glucosa: 'Lab Results',
    laboratorio: 'Lab Results',
    marcador: 'Biological Markers',
};

function translateCuestionarioName(name, language) {
    if (language !== 'en') return name;
    const lower = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const [key, val] of Object.entries(CUESTIONARIO_NAME_EN)) {
        if (lower.includes(key)) return val;
    }
    return name;
}

export function CuestionarioScreen() {
    const { seccionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language } = useSettings();

    const seccionName = location.state?.seccionName || 'CUESTIONARIO';
    const isSociodemograficos = location.state?.isSociodemograficos || false;
    const { auth } = useContext(AuthContext);

    const getExpectedSkeletonCount = () => {
        const name = seccionName.toUpperCase();
        if (name.includes('SOCIODEMOGRÁFICO') || name.includes('DETERMINANTES SOCIALES') || name.includes('SOCIODEMOGRAFICO')) {
            return 1;
        }
        return 3;
    };

    const [isLoading, setIsLoading] = useState(true);
    const [cuestionarios, setCuestionarios] = useState([]);
    const [completados, setCompletados] = useState({});
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('[CuestionarioScreen] seccionId:', seccionId);
                const lista = await obtenerCuestionariosPorSeccion(seccionId);
                console.log('[CuestionarioScreen] cuestionarios recibidos:', lista);
                if (!lista || lista.length === 0) {
                    setCuestionarios([]);
                    setIsLoading(false);
                    return;
                }
                setCuestionarios(lista);

                const userId = auth?.userId || localStorage.getItem('user_id') || '1';
                if (auth?.userId) localStorage.setItem('user_id', String(auth.userId));
                const estadoMap = {};
                await Promise.all(
                    lista.map(async (c) => {
                        const saved = await obtenerRespuestasGuardadas(userId, c.id);
                        estadoMap[c.id] = !!(saved && saved.estatus_finalizado === 1);
                    })
                );
                setCompletados(estadoMap);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [seccionId, auth]);

    const handleCardClick = (cuestionario) => {
        const done = completados[cuestionario.id] === true;
        if (done) {
            setModal({ type: 'done', cuestionario });
        } else {
            setModal({ type: 'inicio', cuestionario });
        }
    };

    const closeModal = () => setModal(null);

    const handleConfirmar = () => {
        if (modal && modal.type === 'inicio') {
            navigate(`/preguntas/${modal.cuestionario.id}`, {
                state: {
                    cuestionarioName: modal.cuestionario.titulo || modal.cuestionario.nombre || '',
                    isSociodemograficos,
                }
            });
        }
        closeModal();
    };

    return (
        <div className="cuestionario-gen-bg">
            <div className="cuestionario-gen-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/secciones')} />
                <h2>{seccionName}</h2>
            </div>

            <div className="cuestionarios-lista">
                {isLoading ? (
                    <>
                        {Array.from({ length: getExpectedSkeletonCount() }).map((_, i) => (
                            <div key={i} className="cuestionario-skeleton" />
                        ))}
                        <div className="image-skeleton" style={{ marginTop: 20 }} />
                    </>
                ) : (
                    <>
                        {cuestionarios.map((c) => {
                            const done = completados[c.id] === true;
                            return (
                                <div
                                    key={c.id}
                                    className="cuestionario-item-card"
                                    onClick={() => handleCardClick(c)}
                                >
                                    <p className="cuestionario-item-titulo">
                                        {translateCuestionarioName(c.titulo || c.nombre || '', language).toUpperCase()}
                                    </p>
                                    {done ? (
                                        <FiCheck className="cuestionario-item-icon completado" style={{ color: '#6ab0f3', strokeWidth: '3' }} />
                                    ) : (
                                        <FaPlayCircle className="cuestionario-item-icon pendiente" />
                                    )}
                                </div>
                            );
                        })}

                        <div className="cuestionario-gen-footer">
                            <img
                                src={MenteImg}
                                alt="Mente Conecta"
                                className="footer-image-watermark"
                            />
                        </div>
                    </>
                )}
            </div>

            {modal && modal.type === 'done' && (
                <div className="cues-modal-overlay" onClick={() => navigate('/secciones')}>
                    <div className="cues-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="cues-modal-logo" />
                        <h3>{t('finalizado')}</h3>
                        <p>{t('cuestionarioTerminado')}</p>
                        <div className="cues-modal-btns">
                            <button className="cues-btn-primary" onClick={() => navigate('/secciones')}>{t('ok')}</button>
                        </div>
                    </div>
                </div>
            )}

            {modal && modal.type === 'inicio' && (
                <div className="cues-modal-overlay" onClick={closeModal}>
                    <div className="cues-modal" onClick={e => e.stopPropagation()}>
                        <img src={logoColor} alt="Logo" className="cues-modal-logo" />
                        <h3>{translateCuestionarioName(modal.cuestionario.titulo || modal.cuestionario.nombre || '', language).toUpperCase()}</h3>
                        {(modal.cuestionario.descripcion || modal.cuestionario.descripcion_en) ? (
                            <p>{language === 'en' ? (modal.cuestionario.descripcion_en || modal.cuestionario.description || modal.cuestionario.descripcion) : modal.cuestionario.descripcion}</p>
                        ) : null}
                        <div className="cues-modal-btns">
                            <button className="cues-btn-secondary" onClick={closeModal}>{t('regresar')}</button>
                            <button className="cues-btn-primary" onClick={handleConfirmar}>{t('ok')}</button>
                        </div>
                    </div>
                </div>
            )}

            <FloatingActionMenu />
        </div>
    );
}
