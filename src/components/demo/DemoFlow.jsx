import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import './DemoFlow.css';
import { DemoMentalHealthSubCategories } from './DemoMentalHealthSubCategories';
import { DemoEatingBehaviorQuestionnaire } from './DemoEatingBehaviorQuestionnaire';
import { DemoAnxietyQuestionnaire } from './DemoAnxietyQuestionnaire';

import personalImg from '../../assets/demo/Personal.jpeg';
import familiarImg from '../../assets/demo/Familia.jpeg';
import cuidadorImg from '../../assets/demo/Cuidador.jpeg';
import saludMentalImg from '../../assets/demo/Salud Mental.jpeg';

export function DemoFlow() {
    const [step, setStep] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [completedQuestionnaires, setCompletedQuestionnaires] = useState([]);
    const navigate = useNavigate();

    const nextStep = (categoryId = null) => {
        if (categoryId) setSelectedCategory(categoryId);
        setStep(step + 1);
        window.scrollTo(0, 0);
    };
    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };
    const goHome = () => {
        setCompletedQuestionnaires([]);
        setStep(0);
        navigate('/');
    };

    const onQuestionnaireComplete = (id) => {
        if (!completedQuestionnaires.includes(id)) {
            setCompletedQuestionnaires([...completedQuestionnaires, id]);
        }
        setStep(3); // Back to subcategories
        window.scrollTo(0, 0);
    };

    return (
        <div className="demo-flow-container">
            {step === 0 && <DemoIntro nextStep={nextStep} goHome={goHome} />}
            {step === 1 && <WhoIsPerforming nextStep={nextStep} goHome={goHome} />}
            {step === 2 && <CategorySelection nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && (
                <DemoMentalHealthSubCategories 
                    nextStep={nextStep} 
                    prevStep={prevStep} 
                    completedQuestionnaires={completedQuestionnaires}
                    goHome={goHome}
                />
            )}
            {step === 4 && (
                selectedCategory === 'eating' ? (
                    <DemoEatingBehaviorQuestionnaire 
                        prevStep={prevStep} 
                        onComplete={() => onQuestionnaireComplete('eating')} 
                    />
                ) : (
                    <DemoAnxietyQuestionnaire 
                        prevStep={prevStep} 
                        onComplete={() => onQuestionnaireComplete('anxiety')} 
                    />
                )
            )}
        </div>
    );
}

function DemoIntro({ nextStep, goHome }) {
    return (
        <div className="demo-intro-container">
            <button className="demo-back-button" onClick={goHome}>
                <FaArrowLeft size={20} />
                Exit
            </button>
            <div className="demo-header">
                <h1>Simulación de Demo</h1>
                <p className="demo-description">
                    Bienvenido a la simulación de nuestra plataforma. Aquí podrás experimentar 
                    cómo funciona el proceso de evaluación y seguimiento de manera guiada.
                </p>
                <button className="modal-ok-btn" onClick={nextStep} style={{ margin: '20px auto' }}>
                    Comenzar
                </button>
            </div>
        </div>
    );
}

function WhoIsPerforming({ nextStep, goHome }) {
    return (
        <div className="who-performing-container">
            <button className="demo-back-button" onClick={goHome}>
                <FaArrowLeft size={20} />
                Exit
            </button>
            <div className="demo-header">
                <h1>¿Quién lo realizará?</h1>
            </div>
            <div className="options-grid">
                <button className="option-item" onClick={nextStep}>
                    <img src={personalImg} alt="Personal" className="option-img" />
                    <div className="option-overlay">
                        <span>Personal</span>
                    </div>
                </button>
                <button className="option-item" onClick={nextStep}>
                    <img src={familiarImg} alt="Familiar" className="option-img" />
                    <div className="option-overlay">
                        <span>Familiar</span>
                    </div>
                </button>
                <button className="option-item" onClick={nextStep}>
                    <img src={cuidadorImg} alt="Cuidador Primario" className="option-img" />
                    <div className="option-overlay">
                        <span>Cuidador Primario</span>
                    </div>
                </button>
            </div>
        </div>
    );
}

function CategorySelection({ nextStep, prevStep }) {
    return (
        <div className="category-selection-container">
            <button className="demo-back-button" onClick={prevStep}>
                <FaArrowLeft size={20} />
                Volver
            </button>
            <div className="demo-header">
                <h1>Selecciona una Categoría</h1>
            </div>
            <div className="options-grid">
                <button className="option-item" onClick={nextStep}>
                    <img src={saludMentalImg} alt="Salud Mental" className="option-img" />
                    <div className="option-overlay">
                        <span>Salud Mental</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
