import React from 'react';
import CharacteristicCard from '../../../components/landingPage/characteristic/CharacteristicCard';
import './Characteristics.css';
import { FaChartBar, FaUsers, FaCog, FaMobileAlt } from 'react-icons/fa';

const characteristicsData = [
    {
        icon: <FaChartBar />,
        title: 'Análisis Avanzado',
        description: 'Herramientas de análisis completas que procesan la información recopilada para generar insights valiosos sobre el progreso y bienestar de los pacientes.',
    },
    {
        icon: <FaUsers />,
        title: 'Gestión de Usuarios',
        description: 'Panel administrativo completo que permite a las clínicas gestionar su plantilla de profesionales, pacientes y configuraciones de manera eficiente.',
    },
    {
        icon: <FaCog />,
        title: 'Configuración Adaptable',
        description: 'Sistema altamente configurable que se adapta a las necesidades específicas de cada clínica y tipo de tratamiento de salud mental.',
    },
    {
        icon: <FaMobileAlt />,
        title: 'App Movil Completa',
        description: 'Aplicación móvil intuitiva para pacientes que permite agendar citas, interactuar con el chatbot y acceder a todas las funcionalidades desde cualquier lugar.',
    },
];

const Characteristics = () => {
    return (
        <section className="characteristics-body">
            <div className="characteristics-container">
                <header className="characteristics-header">
                    <h1>Características Avanzadas</h1>
                    <p>
                        Funcionalidades diseñadas para optimizar la atención en salud mental y mejorar la experiencia tanto de profesionales como de pacientes.
                    </p>
                </header>
                <main className="characteristics-grid">
                    {characteristicsData.map((feature, index) => (
                        <CharacteristicCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            className={index % 2 === 0 ? 'card-from-left' : 'card-from-right'}
                        />
                    ))}
                </main>
            </div>
        </section>
    );
};

export default Characteristics;