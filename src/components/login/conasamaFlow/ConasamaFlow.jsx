import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FormLogin } from '../formLogin/FormLogin';
import { RegisterConasama } from '../registerConasama/RegisterConasama';
import './ConasamaFlow.css';
import logoMCA from '../../../assets/img/logoMCA.png'; 
import splashImg from '../../../assets/img/spash conasama.png';

export function ConasamaFlow({ onBack }) {
    const [step, setStep] = useState('splash'); // 'splash', 'carousel', 'login'
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Mente Conecta\nAdicciones",
            description: "",
            bgClass: "bg-slide-1",
            buttonText: "Ya tengo cuenta",
            action: () => setStep('login')
        },
        {
            title: "Evaluaciones Psicológicas",
            description: "Tests validados científicamente para detectar riesgos de adicciones, depresión, ansiedad y otros trastornos.",
            bgClass: "bg-slide-2",
            buttonText: "Ya tengo cuenta",
            action: () => setStep('login')
        },
        {
            title: "Consultas con Profesionales",
            description: "Conecta con psicólogos, psiquiatras y terapeutas certificados a través de videollamadas.",
            bgClass: "bg-slide-3",
            buttonText: "Ya tengo cuenta",
            action: () => setStep('login')
        },
        {
            title: "Seguimiento y Estadísticas",
            description: "Monitorea tu progreso emocional a lo largo del tiempo con gráficas y reportes detallados.",
            bgClass: "bg-slide-4",
            buttonText: "Ya tengo cuenta",
            action: () => setStep('login')
        },
        {
            title: "¿Cuánto tiempo me llevará responder los cuestionarios?",
            description: "Invertir unos minutos en responderlos es una forma práctica de cuidar tu salud hoy y tomar decisiones informadas para el futuro. Porque en temas de adicciones, detectar a tiempo no es exagerar... es prevenir con inteligencia.",
            bgClass: "bg-slide-5",
            isCustomSlide5: true,
            buttonText: "Registrarme",
            action: () => setStep('register')
        }
    ];

    // Simular el tiempo del Splash Screen
    useEffect(() => {
        if (step === 'splash') {
            const timer = setTimeout(() => {
                setStep('carousel');
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [step]);

    if (step === 'login') {
        return <FormLogin typeLogin={3} onBack={() => setStep('carousel')} />;
    }

    if (step === 'register') {
        return <RegisterConasama 
            onBack={() => {
                setStep('carousel');
                setCurrentSlide(4); // Regresar al slide 5 del carrusel
            }    
            } 
            onComplete={() => setStep('login')} 
        />;
    }

    return (
        <div className="conasama-flow-bg">
            <div className="conasama-card-wrapper">
                
                {step === 'splash' && (
                    <div className="splash-screen">
                        <div className="splash-header">
                            <img src={logoMCA} alt="Mente Conecta Adicciones" className="splash-logo" />
                        </div>
                        <div className="splash-body">
                            <img 
                                src={splashImg} 
                                alt="Alebrije Mente Conecta" 
                                className="alebrije-character"
                            />
                        </div>
                        <div className="splash-footer">
                            <p style={{fontSize: '0.8rem', color: '#7D1640', margin: 0, padding: '10px', fontWeight: 'bold'}}>
                                [Logos institucionales: Salud, CONASAMA...]
                            </p>
                        </div>
                    </div>
                )}

                {step === 'carousel' && (
                    <div className={`carousel-screen ${slides[currentSlide].bgClass}`}>
                        {!slides[currentSlide].isCustomSlide5 && <div className="carousel-overlay"></div>}
                        <div className="carousel-content">
                            
                            <div className="carousel-header">
                                <div className="lang-selector">
                                    🇲🇽 🌐
                                </div>
                            </div>
                            
                            <div className="carousel-center">
                                <div className="slide-content-wrapper">
                                    <h1 className={slides[currentSlide].isCustomSlide5 ? "carousel-title-small" : "carousel-title"}>
                                        {slides[currentSlide].title.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}<br/>
                                            </React.Fragment>
                                        ))}
                                    </h1>
                                    
                                    {slides[currentSlide].description && (
                                        <p className="carousel-description">
                                            {slides[currentSlide].description}
                                        </p>
                                    )}

                                    {slides[currentSlide].isCustomSlide5 && (
                                        <div className="custom-cards-container">
                                            <div className="custom-card card-sociodem">
                                                <div className="card-overlay"></div>
                                                <span>SOCIO DEMOGRÁFICO</span>
                                            </div>
                                            <div className="custom-card card-determinante">
                                                <div className="card-overlay"></div>
                                                <span>DETERMINANTE SOCIAL</span>
                                            </div>
                                            <div className="custom-card card-salud">
                                                <div className="card-overlay"></div>
                                                <span>SALUD MENTAL.</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="carousel-footer">
                                <div className="carousel-dots">
                                    {slides.map((_, index) => (
                                        <span 
                                            key={index} 
                                            className={`dot ${currentSlide === index ? 'active' : ''}`}
                                            onClick={() => setCurrentSlide(index)}
                                            style={{ cursor: 'pointer' }}
                                        ></span>
                                    ))}
                                </div>
                                <Button 
                                    className={slides[currentSlide].isCustomSlide5 ? "btn-registrarme" : "btn-tengo-cuenta"} 
                                    onClick={slides[currentSlide].action}
                                >
                                    {slides[currentSlide].buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
