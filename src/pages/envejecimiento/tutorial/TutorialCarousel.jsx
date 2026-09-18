import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiGlobe } from 'react-icons/fi';
import { useSettings } from '../../../context/SettingsContext';
import envejecimiento1 from '../../../assets/img/envejecimiento1.png';
import guiaremos from '../../../assets/img/guiaremos.jpeg';
import conoceLz from '../../../assets/img/conoceLz.png';
import imgacl from '../../../assets/img/imgacl.png';
import img4 from '../../../assets/img/img4.jpg';
import Sdemo from '../../../assets/img/Sdemo.jpeg';
import Dsocial from '../../../assets/img/Dsocial.jpeg';
import salenv1 from '../../../assets/img/salenv1.jpeg';
import './TutorialCarousel.css';

function getFlagEmoji(code) {
    return code.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
    );
}

export function TutorialCarousel() {
    const navigate = useNavigate();
    const { t, language, toggleLanguage } = useSettings();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const handleLogin = () => {
        navigate('/loginmen');
    };

    const handleRegister = () => {
        navigate('/registro');
    };

    const goPrev = () => {
        if (index > 0) setIndex(index - 1);
    };

    const goNext = () => {
        if (index < slides.length - 1) setIndex(index + 1);
    };

    const slidesES = [
        {
            image: envejecimiento1,
            alt: "Mente Conecta Envejecimiento",
            title: "Mente Conecta\nEnvejecimiento"
        },
        {
            image: guiaremos,
            alt: "Te guiaremos a través de cuestionarios",
            text: "Te guiaremos a través de cuestionarios para\nsaber si estas en riesgo de desarrollar\nAlzheimer, o si tienes envejecimiento\nacelerado podremos gestionar posibles\ntratamientos para desacelerar el\nenvejecimiento y tratar un posible deterioro"
        },
        {
            image: conoceLz,
            alt: "Riesgo de Alzheimer",
            title: "Riesgo de Alzheimer",
            text: "Conocer tu riesgo genómico de desarrollar\nAlzheimer te permite tomar el control.\nAdoptar mejores hábitos y un estilo de vida\nsaludable puede ayudarte a retrasar su\naparición. Descubre tu nivel de riesgo y\naprende las estrategias, habilidades y\ntratamientos personalizados para enfrentarlo\ncon tiempo."
        },
        {
            image: imgacl,
            alt: "El envejecimiento acelerado.",
            title: "El envejecimiento\nacelerado.",
            text: "Envejecer es parte natural de la vida, pero no\nse trata solo de cambios fisicos. El\nfuncionamiento de todo tu cuerpo tambien\nse ve afectado. La buena noticia: puedes\nmedir y desacelerar ese proceso. Aqui te\nmostraremos como hacerlo."
        },
        {
            image: img4,
            alt: "¿Cuánto tiempo me llevará responder los cuestionarios?",
            isFinalSlide: true,
            title: "¿Cuánto tiempo me llevará\nresponder los cuestionarios?",
            text: "Te ayudamos a que esta etapa sea con salud\ny dignidad, siempre con el respaldo de la\nciencia. Con unos pocos datos, sabremos si\ntu edad real y biologica coinciden.",
            cards: [
                { img: Sdemo, label: "Sociodemográficos", time: "10 min." },
                { img: Dsocial, label: "Determinantes Sociales", time: "8 min." },
                { img: salenv1, label: "Salud Mental y Envejecimiento", time: "18 min." }
            ]
        }
    ];

    const slidesEN = [
        {
            image: envejecimiento1,
            alt: "Mind Connect Aging",
            title: "Mind Connect\nAging"
        },
        {
            image: guiaremos,
            alt: "We will guide you through questionnaires",
            text: "We will guide you through questionnaires to\nfind out if you are at risk of developing\nAlzheimer's, or if you have accelerated\naging we can manage possible treatments\nto slow aging and address possible\ncognitive decline"
        },
        {
            image: conoceLz,
            alt: "Alzheimer's Risk",
            title: "Alzheimer's Risk",
            text: "Knowing your genomic risk of developing\nAlzheimer's allows you to take control.\nAdopting better habits and a healthy\nlifestyle can help delay its onset.\nDiscover your risk level and learn the\nstrategies, skills and personalized\ntreatments to face it in time."
        },
        {
            image: imgacl,
            alt: "Accelerated aging.",
            title: "Accelerated\naging.",
            text: "Aging is a natural part of life, but it's not\njust about physical changes. The\nfunctioning of your entire body is also\naffected. The good news: you can\nmeasure and slow down that process.\nHere we will show you how."
        },
        {
            image: img4,
            alt: "How long will it take me to answer the questionnaires?",
            isFinalSlide: true,
            title: "How long will it take me\nto answer the questionnaires?",
            text: "We help you to make this stage one of\nhealth and dignity, always backed by\nscience. With just a few data points,\nwe will know if your real and biological\nage match.",
            cards: [
                { img: Sdemo, label: "Sociodemographic", time: "10 min." },
                { img: Dsocial, label: "Social Determinants", time: "8 min." },
                { img: salenv1, label: "Mental Health and Aging", time: "18 min." }
            ]
        }
    ];

    const slides = language === 'en' ? slidesEN : slidesES;

    return (
        <div className="tutorial-carousel-container">
            {/* Language toggle — top right */}
            <button className="tut-lang-toggle" type="button" onClick={toggleLanguage} title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}>
                <span className="tut-lang-flag">{getFlagEmoji(language === 'en' ? 'us' : 'mx')}</span>
                <FiGlobe className="tut-lang-globe" />
            </button>

            {/* Zonas de clic transparentes para navegar */}
            {index > 0 && (
                <div className="tutorial-click-area tutorial-click-left" onClick={goPrev} />
            )}
            
            {index < slides.length - 1 && (
                <div className="tutorial-click-area tutorial-click-right" onClick={goNext} />
            )}

            <Carousel 
                key={language}
                activeIndex={index} 
                onSelect={handleSelect} 
                interval={null} // El usuario controla el deslizamiento
                controls={false}
                indicators={true}
            >
                {slides.map((slide, i) => (
                    <Carousel.Item key={i}>
                        <div className="tutorial-image-container">
                            <img
                                className="tutorial-image"
                                src={slide.image}
                                alt={slide.alt}
                            />
                            {/* Overlay y texto para la imagen (si tiene) */}
                            {(slide.title || slide.text || slide.isFinalSlide) && (
                                <div className={`tutorial-overlay ${slide.isFinalSlide ? 'tutorial-overlay-darker' : ''}`}>
                                    {slide.title && (
                                        <h1 className="tutorial-title" style={slide.isFinalSlide ? { marginBottom: '30px' } : {}}>
                                            {slide.title.split('\n').map((item, key) => (
                                                <React.Fragment key={key}>{item}<br/></React.Fragment>
                                            ))}
                                        </h1>
                                    )}
                                    {slide.text && (
                                        <p className="tutorial-text" style={slide.isFinalSlide ? { marginBottom: '20px' } : {}}>
                                            {slide.text.split('\n').map((item, key) => (
                                                <React.Fragment key={key}>{item}<br/></React.Fragment>
                                            ))}
                                        </p>
                                    )}
                                    
                                    {slide.isFinalSlide && slide.cards && (
                                        <div className="tutorial-cards-list">
                                            {slide.cards.map((card, ci) => (
                                                <div key={ci} className="tutorial-card">
                                                    <img src={card.img} alt={card.label} className="tutorial-card-bg" />
                                                    <div className="tutorial-card-overlay"></div>
                                                    <div className="tutorial-card-content">
                                                        <span className="tutorial-card-title">{card.label}</span>
                                                        <span className="tutorial-card-time">{card.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Botón en la primera imagen */}
                        {i === 0 && (
                            <div className="tutorial-action-container">
                                <button className="tutorial-btn-primary" onClick={handleLogin}>
                                    {t('tutYaTengoCuenta')}
                                </button>
                            </div>
                        )}

                        {/* Botón en la última imagen */}
                        {i === 4 && (
                            <div className="tutorial-action-container">
                                <button className="tutorial-btn-primary" onClick={handleRegister}>
                                    {t('tutComenzar')}
                                </button>
                            </div>
                        )}
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}
