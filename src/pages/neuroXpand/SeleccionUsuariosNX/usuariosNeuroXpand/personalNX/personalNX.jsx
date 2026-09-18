import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../hooks';
import { obtenerSeccionesApi } from '../../../../../api/neuroXpand/cuestionarionx.service';
import './personalNX.scss';

import socioImg from '../../../../../assets/img/sociodemograficos.jpeg';
import mentalImg from '../../../../../assets/img/saludmental.jpeg';
import fisicaImg from '../../../../../assets/img/saludfisica.jpeg';
import socialImg from '../../../../../assets/img/determinantes.jpeg';
import covidImg from '../../../../../assets/img/covid.jpeg';
import nomImg from '../../../../../assets/img/nom035.jpeg';

import logoImg from '../../../../../assets/img/Icono_home.jpeg'; 

import { SidebarNX as Sidebar } from './sidebarNX'; 
import { LanguageSelector } from '../../../../../components/ui'; 

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

export function PersonalNX() {
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
                const edad = auth.me?.edad || 18; 
                const response = await obtenerSeccionesApi(edad, auth.token);
                
                if (response && Array.isArray(response)) {
                    const mappedCards = response.map(sec => {
                        const tituloStr = sec.titulo || sec.title || '';
                        const mapInfo = categoryMapById[sec.id] || {};
                        const tituloReal = mapInfo.defaultTitle || tituloStr || 'SECCIÓN SIN NOMBRE';

                      
                        const slug = mapInfo.slug || `seccion-${sec.id}`;

                
                        let image = mapInfo.image || defaultImage;
                        if ((!mapInfo.image || mapInfo.image === defaultImage) && /nom\s*0?35|nom-?035/i.test(tituloStr)) {
                            image = nomImg;
                        } else if ((!mapInfo.image || mapInfo.image === defaultImage) && /covid/i.test(tituloStr)) {
                            image = covidImg;
                        }

                        let borderColor = mapInfo.borderColor || defaultBorder;
                        if (!mapInfo.borderColor) {
                            if (/nom\s*0?35|nom-?035/i.test(tituloStr)) borderColor = 'border-rojo';
                            else if (/determinantes/i.test(tituloStr)) borderColor = 'border-amarillo';
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
        <div className="personalNX-container">
            
            <Sidebar isOpen={menuAbierto} onClose={toggleMenu} />

            <header className="personalNX-header">
                <button className="menu-icon-btn-personalNX" onClick={toggleMenu} aria-label={t('personal.openMenu')}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <h2>
                    {t('personal.welcome', { name: nombreUsuario })}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <LanguageSelector lightBg={true} />
                    <div className="header-logo-container-personalNX">
                        <img src={logoImg} alt={t('personal.logoAlt', { defaultValue: 'Mente Conecta Logo' })} />
                    </div>
                </div>
            </header>

            <div className="cards-container-personalNX">
                {cargando ? (
                    <div className="loading-container-centered-personalNX">
                        <div className="loading-circle-centered-personalNX">
                            <span className="loading-text">Cargando secciones...</span>
                        </div>
                    </div>
                ) : (
                    cards.map((card, index) => (
                        <Link
                            key={index}
                            to={`/personalNX/${card.slug}`}
                            state={{ sectionId: card.id, sectionTitle: card.title, sectionDesc: card.descripcion }}
                            className="card-link-personalNX"
                            aria-label={t('personal.viewQuestionnairesFor', { section: t(`category.${card.slug}.title`, { defaultValue: card.title }) })}
                        >
                            <div className={`card-item-personalNX ${card.borderColor}`}>
                                <img
                                    src={card.image}
                                    alt={t(`category.${card.slug}.title`, { defaultValue: card.title })}
                                    className={`card-img-${card.slug}`}
                                />
                                <div className="card-overlay-personalNX">
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