import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSettings } from '../../../context/SettingsContext';
import { FloatingActionMenu } from '../FloatingActionMenu';
import { AuthContext } from '../../../context/AuthContext';
import './SeccionesScreen.css';

// Importación de imágenes
import logoColor from '../../../assets/img/logoColor.png';
import dSocialImg from '../../../assets/img/Dsocial.jpeg';
import sDemoImg from '../../../assets/img/Sdemo.jpeg';
import salEnvImg from '../../../assets/img/salenv1.jpeg';
import { obtenerSeccionesCuestionario, verificarInstruccionesSecciones, postCheckboxInstrucciones } from '../../../api/user';
import { Spinner } from 'react-bootstrap';


const CARD_COLORS = ['#26C6DA', '#009688', '#7E57C2', '#FFA726', '#EF5350'];

// Hardcoded fallback por si la API falla o está desconectada
const fallbackSecciones = [
    {
        id: 1,
        nombre_seccion: 'DETERMINANTES SOCIALES',
        img64: '',
    },
    {
        id: 2,
        nombre_seccion: 'SOCIODEMOGRÁFICOS',
        img64: '',
    },
    {
        id: 3,
        nombre_seccion: 'SALUD MENTAL Y ENVEJECIMIENTO',
        img64: '',
    }
];

export function SeccionesScreen() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const { auth } = useContext(AuthContext);
    const [secciones, setSecciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeccion, setSelectedSeccion] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isCheckingCard, setIsCheckingCard] = useState(false);

    // Helpers para acceder a propiedades
    const getSectionName = (sec) => sec.nombre_seccion || sec.nombre || sec.titulo || sec.name || sec.title || '';
    const getSectionImg = (sec) => sec.img64 || sec.imagen64 || sec.imagen || sec.base64 || sec.img || '';

    const getSectionDisplayData = (secName) => {
        const lowerName = secName.toLowerCase();
        if (lowerName.includes('social')) return { title: t('secSocialTitulo'), desc: t('secSocialDesc') };
        if (lowerName.includes('demo')) return { title: t('secDemoTitulo'), desc: t('secDemoDesc') };
        if (lowerName.includes('salud')) return { title: t('secSaludTitulo'), desc: t('secSaludDesc') };
        return { title: secName, desc: t('secSinDesc') };
    };

    useEffect(() => {
        const fetchSecciones = async () => {
            try {
                // Edad mock, o obtener de perfil
                const data = await obtenerSeccionesCuestionario(65);
                const getSortIndex = (name) => {
                    const lowerName = name.toLowerCase();
                    if (lowerName.includes('social')) return 1;
                    if (lowerName.includes('demo')) return 2;
                    if (lowerName.includes('salud')) return 3;
                    if (lowerName.includes('alzheimer')) return 4;
                    return 99;
                };

                // Extraer la lista si la API devuelve un objeto { data: [...] }
                let listaSecciones = Array.isArray(data) ? data : (data.data || []);

                const sortedData = listaSecciones.sort((a, b) => {
                    return getSortIndex(getSectionName(a)) - getSortIndex(getSectionName(b));
                });

                const lista = sortedData.length > 0 ? sortedData : fallbackSecciones;
                setSecciones(lista);
            } catch (error) {
                console.error("Error al obtener secciones", error);
                setSecciones(fallbackSecciones);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecciones();

        // Bloqueo de retroceso
        const handlePopState = (event) => {
            window.history.pushState(null, '', window.location.href);
            navigate('/quien-lo-realiza', { replace: true });
        };
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const navigateToSeccion = (seccion) => {
        const secName = getSectionName(seccion).toLowerCase();
        const displayData = getSectionDisplayData(getSectionName(seccion));
        const isSociodemo = secName.includes('demo');
        if (secName.includes('salud mental') || seccion.id === 7) {
            navigate('/envejecimiento/salud-mental');
        } else {
            navigate(`/envejecimiento/cuestionario/${seccion.id}`, {
                state: { seccionName: displayData.title, seccionDesc: displayData.desc, isSociodemograficos: isSociodemo }
            });
        }
    };

    const handleCardClick = async (seccion) => {
        if (isCheckingCard) return;
        setIsCheckingCard(true);
        try {
            const userId = auth?.userId;
            if (userId) {
                const result = await verificarInstruccionesSecciones(userId, seccion.id);
                if (result?.status_instrucciones === true) {
                    navigateToSeccion(seccion);
                    return;
                }
            }
        } catch (_) {}
        setIsCheckboxChecked(false);
        setSelectedSeccion(seccion);
        setIsCheckingCard(false);
    };

    const handleComenzar = async () => {
        if (!isCheckboxChecked) {
            toast.warning(t('aceptarIntroMsg'));
            return;
        }
        const userId = auth?.userId;
        if (userId) {
            await postCheckboxInstrucciones(userId, selectedSeccion.id).catch(() => {});
        }
        navigateToSeccion(selectedSeccion);
        setSelectedSeccion(null);
    };

    return (
        <div className="secciones-bg">
            <div className="secciones-header">
                <h1>{t('bienvenido')}</h1>
                <img src={logoColor} alt="Mente Conecta" className="secciones-logo" />
            </div>

            <div className="secciones-content">
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <Spinner animation="border" style={{ color: 'transparent' }} />
                    </div>
                ) : (
                    secciones.map((sec, index) => {
                        const secName = getSectionName(sec);
                        let imageSrc = logoColor;
                        const base64Img = getSectionImg(sec);
                        
                        if (base64Img) {
                            imageSrc = `data:image/jpeg;base64,${base64Img}`;
                        } else {
                            // Si no hay base64, usar imágenes estáticas locales según el nombre
                            const lowerName = secName.toLowerCase();
                            if (lowerName.includes('social')) imageSrc = dSocialImg;
                            else if (lowerName.includes('demo')) imageSrc = sDemoImg;
                            else if (lowerName.includes('salud')) imageSrc = salEnvImg;
                        }

                        return (
                            <div
                                key={sec.id || index}
                                className={`seccion-card delay-${index}`}
                                style={{ borderColor: CARD_COLORS[index % CARD_COLORS.length] }}
                                onClick={() => handleCardClick(sec)}
                            >
                                <img src={imageSrc} alt={secName} className="seccion-img" />
                                <div className="seccion-overlay">
                                    <h2 className="seccion-title">{getSectionDisplayData(secName).title}</h2>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <FloatingActionMenu />

            {selectedSeccion && (
                <div className="intro-modal-overlay">
                    <div className="intro-modal-card">
                        <img src={logoColor} alt="Mente Conecta" className="intro-modal-logo" />
                        
                        <h2 className="intro-modal-title">{getSectionDisplayData(getSectionName(selectedSeccion)).title}</h2>
                        
                        <p className="intro-modal-text">{getSectionDisplayData(getSectionName(selectedSeccion)).desc}</p>
                        
                        {(getSectionName(selectedSeccion).toUpperCase().includes('DEMO') ||
                          getSectionName(selectedSeccion).toUpperCase().includes('SALUD') ||
                          selectedSeccion.id === 2 || selectedSeccion.id === 3) && (
                            <p className="intro-modal-warning">{t('secImportante')}</p>
                        )}

                        <label className="intro-modal-checkbox-container">
                            <input
                                type="checkbox"
                                className="intro-modal-checkbox"
                                checked={isCheckboxChecked}
                                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                            />
                            <span className="intro-modal-checkbox-label">{t('aceptoIntroduccion')}</span>
                        </label>

                        <button className="intro-modal-btn" onClick={handleComenzar}>
                            {t('comenzar')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
