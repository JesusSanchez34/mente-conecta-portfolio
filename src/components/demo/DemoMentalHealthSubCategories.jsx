import React, { useState } from 'react';
import { FaArrowLeft, FaLightbulb, FaCircleCheck } from "react-icons/fa6";
import { CiPlay1 } from "react-icons/ci";

export function DemoMentalHealthSubCategories({ nextStep, prevStep, completedQuestionnaires, goHome }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        {
            id: 'eating',
            title: 'Conducta Alimentaria',
            description: 'Los alimentos que consumimos ayudan a nuestra salud física, aportan energía para el buen funcionamiento, pero también pueden mermar nuestra salud mental. Te pedimos respondas el siguiente cuestionario que te ayudará a conocer si es correcta tu forma de alimentarte.'
        },
        {
            id: 'anxiety',
            title: 'Ansiedad',
            description: 'Bienvenido al test de ansiedad GAD-7. Este cuestionario está diseñado para ayudarte a evaluar tus niveles de ansiedad en las últimas dos semanas.'
        }
    ];

    const allCompleted = categories.every(cat => completedQuestionnaires.includes(cat.id));

    const handleCardClick = (category) => {
        if (completedQuestionnaires.includes(category.id)) return;
        setSelectedCategory(category);
        setShowModal(true);
    };

    return (
        <div className="mh-subcategories-container">
            {!allCompleted && (
                <button className="demo-back-button" onClick={prevStep}>
                    <FaArrowLeft size={20} />
                    Volver
                </button>
            )}
            <div className="demo-header-mh">
                <h1>Salud Mental</h1>
                {allCompleted && <p className="completion-message">¡Has completado todas las evaluaciones!</p>}
            </div>
            <div className="subcategories-list">
                {categories.map((cat) => {
                    const isCompleted = completedQuestionnaires.includes(cat.id);
                    return (
                        <div 
                            key={cat.id} 
                            className={`mh-card ${isCompleted ? 'completed' : ''}`} 
                            onClick={() => handleCardClick(cat)} 
                            style={{ 
                                cursor: isCompleted ? 'default' : 'pointer', 
                                marginBottom: '15px',
                                opacity: isCompleted ? 0.7 : 1
                            }}
                        >
                            <span className="mh-card-title">{cat.title}</span>
                            <div className="mh-card-action">
                                {isCompleted ? (
                                    <>
                                        <div className="play-icon-container" style={{ background: '#4CAF50' }}>
                                            <FaCircleCheck size={25} color="white" />
                                        </div>
                                        <span className="mh-start-text" style={{ color: '#4CAF50' }}>COMPLETADO</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="play-icon-container">
                                            <CiPlay1 size={25} />
                                        </div>
                                        <span className="mh-start-text">INICIAR</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {allCompleted && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', width: '100%' }}>
                    <button className="modal-ok-btn" onClick={goHome}>
                        Finalizar
                    </button>
                </div>
            )}

            {showModal && selectedCategory && (
                <div className="demo-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="demo-modal-header-yellow">
                            <FaLightbulb className="modal-icon-lightbulb" />
                        </div>
                        <div className="demo-modal-body">
                            <h2 className="modal-title">{selectedCategory.title}</h2>
                            <p className="modal-text">
                                {selectedCategory.description}
                            </p>
                            <div className="modal-footer-btns">
                                <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                                    Regresar
                                </button>
                                <button className="modal-ok-btn" onClick={() => nextStep(selectedCategory.id)}>
                                    Comenzar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
