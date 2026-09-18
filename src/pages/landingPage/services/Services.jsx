import React from 'react';
import './Services.css';
import { CiChat1 } from "react-icons/ci";
import { TbClipboardList } from "react-icons/tb";
import { PiVideoCamera } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { IoTrendingUpOutline } from "react-icons/io5";
import { FaSquare } from "react-icons/fa6";

const servicesCards = [
    {
        imageUrl: '/image/service-1.jpg',
        icon: <CiChat1 size={24} />,
        title: 'Chat de Apoyo 24/7',
        description: 'Habla cuando lo necesites con nuestro chatbot de IA entrenado en salud mental y con moderadores humanos disponibles.',
        options: ['Respuestas inmediatas','Completamente anónimo','Disponible cualquier día y hora']
    },
    {
        imageUrl: '/image/service-2.jpg',
        icon: <TbClipboardList size={24} />,
        title: 'Evaluaciones Psicológicas',
        description: 'Tests validados científicamente para detectar riesgos de adicciones, depresión, ansiedad y otros trastornos.',
        options: ['Tests certificados','Resultados instantáneos','Recomendaciones personaliadas']
    },
    {
        imageUrl: '/image/service-3.jpg',
        icon: <PiVideoCamera size={24} />,
        title: 'Consultas con Profesionales',
        description: 'Conecta con psicólogos, psiquiatras y terapeutas certificados a través de videollamadas.',
        options: ['Profesionales certificados','Consultas remotas','Planes de tratamiento']
    },
    {
        imageUrl: '/image/service-4.jpg',
        icon: <RiGroupLine size={24} />,
        title: 'Grupos de Apoyo',
        description: 'Únete a comunidades seguras de personas que comparten experiencias similares.',
        options: ['Grupos moderados','Sesiones guiadas','Conexión con pares']
    },
    {
        imageUrl: '/image/service-5.jpg',
        icon: <IoTrendingUpOutline size={24} />,
        title: 'Seguimiento y Estadísticas',
        description: 'Monitorea tu progreso emocional a lo largo del tiempo con gráficas y reportes detallados.',
        options: ['Dashboard personalizado','Gráficas de progreso','Alertas preventivas']
    }
];

const Services = () => {
    return (
        <div className="services-body">
            <div className="services-header">
                <h1>Nuestros Servicios</h1>
                <p>Herramientas integrales diseñadas para apoyar tu bienestar mental en cada etapa.</p>
            </div>
            <div className="row services-cards gap-3">
                {servicesCards.map((service, index) => (
                    <div class="col-sm-10 col-md-5 col-lg-5 col-xl-3 col-xxl-2" key={index}>
                        <div class="card h-100 pb-5">
                            <img src={service.imageUrl} className="card-image" alt={service.title} />
                            <div class="card-body" style={{ margin: '20px 0px'}}>
                                <button className="services-card-icon">
                                    <div className="button-icon">
                                        {service.icon}
                                    </div>
                                </button>
                                <span className='card-title'>{service.title}</span>
                                <p class="card-text">{service.description}</p>
                            </div>
                            <div class="card-list">
                                <ul style={{ margin: 0, padding: 0 }}>
                                    {service.options.map((element, index) => (
                                        <li class="list-group-item" key={index}>
                                            <FaSquare size={10} color='#71BEE9' />
                                            <span className='list-element'>{element}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
                {/* <div className="security-content">
                    <div className="security-features-list">
                        {securityFeatures.map((feature, index) => (
                            <div className="feature-item" key={index}>
                                <div className="feature-icon" style={{ backgroundColor: feature.iconBg }}>
                                    {React.cloneElement(feature.icon, { style: { color: feature.iconColor } })}
                                </div>
                                <div className="feature-text">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="security-guarantee-card">
                        <div className="guarantee-icon">
                            <img src="/seguridad.svg" alt="Icono de escudo de seguridad" style={{ height: '11.16rem' }} />
                        </div>
                        <h3>Protección Garantizada</h3>
                        <p>Utilizamos tecnología de punta para garantizar que la información de salud mental de tus pacientes esté completamente protegida.</p>
                    </div>
                </div> */}
        </div>
    );
};

export default Services;