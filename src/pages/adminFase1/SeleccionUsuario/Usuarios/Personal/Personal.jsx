import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../hooks';
import { obtenerSeccionesApi } from '../../../../../api/fase1/cuestionario';
import './Personal.scss';

import socioImg from '../../../../../assets/img/sociodemograficos.jpeg';
import mentalImg from '../../../../../assets/img/saludmental.jpeg';
import fisicaImg from '../../../../../assets/img/saludfisica.jpeg';
import socialImg from '../../../../../assets/img/determinantes.jpeg';
import covidImg from '../../../../../assets/img/covid.jpeg';
import nomImg from '../../../../../assets/img/nom035.jpeg';

import logoImg from '../../../../../assets/img/Icono_home.jpeg'; 

import { Sidebar } from './Sidebar'; 
import { LanguageSelector } from '../../../../../components/ui'; 

// Mapa de imágenes y colores para las secciones dinámicas (por ID)
const categoryMapById = {
    1: { slug: 'sociodemograficos', image: socioImg, borderColor: 'border-azul', defaultTitle: 'Sociodemográficos' },
    2: { slug: 'salud-mental', image: mentalImg, borderColor: 'border-verde', defaultTitle: 'Salud Mental' },
    3: { slug: 'salud-fisica', image: fisicaImg, borderColor: 'border-morado', defaultTitle: 'Salud Física' },
    4: { slug: 'determinantes-sociales', image: socialImg, borderColor: 'border-amarillo', defaultTitle: 'Determinantes Sociales' },
    5: { slug: 'covid-salud-mental', image: covidImg, borderColor: 'border-azul-claro', defaultTitle: 'COVID-19 y Salud Mental' },
    6: { slug: 'nom-035', image: nomImg, borderColor: 'border-rojo', defaultTitle: 'NOM 035' },
};
const defaultImage = logoImg;
const defaultBorder = 'border-gris';

export function Personal() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cards, setCards] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { t } = useTranslation();
    const { auth } = useAuth();

    useEffect(() => {
        localStorage.removeItem('selectedFamiliar');
        const nombreGuardado = localStorage.getItem('nombre');
        console.log("NOMBRE GUARDADO:", nombreGuardado);

        if (nombreGuardado) {
            setNombreUsuario(nombreGuardado);
        }
        
        cargarSecciones();
    }, [auth]);

    const cargarSecciones = async () => {
        try {
            if (auth && auth.token) {
                // Si la sesión no tiene edad (null/undefined), mandamos 0 o una edad por defecto como 18
                const edad = auth.me?.edad || 18; 
                const response = await obtenerSeccionesApi(edad, auth.token);
                
                if (response && Array.isArray(response)) {
                    // Filter out any NOM-035 coming from the backend to use the hardcoded one
                    const mappedCards = response
                        .filter(sec => !/nom\s*0?35|nom-?035/i.test(sec.titulo || sec.title || ''))
                        .map(sec => {
                        const tituloStr = sec.titulo || sec.title || '';
                        const mapInfo = categoryMapById[sec.id] || {};
                        const tituloReal = mapInfo.defaultTitle || tituloStr || 'SECCIÓN SIN NOMBRE';

                        const slug = mapInfo.slug || `seccion-${sec.id}`;

                        let image = mapInfo.image || defaultImage;
                        if ((!mapInfo.image || mapInfo.image === defaultImage) && /covid/i.test(tituloStr)) {
                            image = covidImg;
                        }

                        let borderColor = mapInfo.borderColor || defaultBorder;
                        if (!mapInfo.borderColor) {
                            if (/determinantes/i.test(tituloStr)) borderColor = 'border-amarillo';
                            else if (/covid/i.test(tituloStr)) borderColor = 'border-azul-claro';
                            else if (/sociodemografic/i.test(tituloStr)) borderColor = 'border-azul';
                            else if (/salud\s*mental/i.test(tituloStr)) borderColor = 'border-verde';
                            else if (/salud\s*f[ií]sica/i.test(tituloStr)) borderColor = 'border-morado';
                        }

                        return {
                            id: sec.id,
                            title: tituloReal,
                            slug: slug,
                            image: image,
                            borderColor: borderColor,
                            descripcion: sec.descripcion || ''
                        };
                    });

                    // Restore the EXACT NOM-035 logic from before the branch merge
                    mappedCards.push({
                        id: 7, // Strictly ID 7 as it was in the old code
                        title: 'NOM 035',
                        slug: 'nom-035',
                        image: nomImg,
                        borderColor: 'border-rojo',
                        descripcion: 'Evalúa factores de riesgo psicosocial en el trabajo según la normativa vigente.'
                    });

                    setCards(mappedCards);
                }
            }
        } catch (error) {
            console.error("Error al cargar secciones dinámicas:", error);
        } finally {
            setCargando(false);
        }
    };

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    return (
        <div className="personal-container">
            
            <Sidebar isOpen={menuAbierto} onClose={toggleMenu} />

            <header className="personal-header">
                <button className="menu-icon-btn" onClick={toggleMenu} aria-label={t('personal.openMenu')}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <h2 className="header-title">
                    {t('personal.welcome', { name: nombreUsuario })}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <LanguageSelector lightBg={true} />
                    <div className="header-logo-container">
                        <img src={logoImg} alt={t('personal.logoAlt', { defaultValue: 'Mente Conecta Logo' })} />
                    </div>
                </div>
            </header>

            <div className="cards-container">
                {cargando ? (
                    <div className="loading-container-centered">
                        <div className="loading-circle-centered">
                            <span className="loading-text">Cargando secciones...</span>
                        </div>
                    </div>
                ) : (
                    cards.map((card, index) => (
                        <Link
                            key={index}
                            to={`/personal/${card.slug}`}
                            state={{ sectionId: card.id, sectionTitle: card.title, sectionDesc: card.descripcion }}
                            className="card-link"
                            aria-label={t('personal.viewQuestionnairesFor', { section: t(`category.${card.slug}.title`, { defaultValue: card.title }) })}
                        >
                            <div className={`card-item ${card.borderColor}`}>
                                <img
                                    src={card.image}
                                    alt={t(`category.${card.slug}.title`, { defaultValue: card.title })}
                                    className={`card-img-${card.slug}`}
                                />
                                <div className="card-overlay">
                                    <h3>{t(`category.${card.slug}.title`, { defaultValue: card.title })}</h3>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
