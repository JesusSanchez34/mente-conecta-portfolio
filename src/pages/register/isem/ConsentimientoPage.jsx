import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterISEM.css';

export function ConsentimientoPage() {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    // Guard: debe haber aceptado políticas primero
    useEffect(() => {
        if (sessionStorage.getItem('politicasAceptadas') !== 'true') {
            navigate('/register/isem/policies', { replace: true });
        }
    }, [navigate]);

    const handleContinue = () => {
        sessionStorage.setItem('consentimientoAceptado', 'true');
        navigate('/register/isem/purpose');
    };

    return (
        <div className="register-isem-bg">
            <div className="register-isem-wrapper">
                {/* Stepper */}
                <div className="register-isem-stepper">
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step active"></div>
                    <div className="register-isem-step"></div>
                    <div className="register-isem-step"></div>
                </div>

                <div className="register-isem-card">
                    <h1 className="register-isem-title">Consentimiento Informado</h1>

                    <div className="register-isem-text-scroll">
                        <h3>Introducción</h3>
                        <p>
                            La salud mental debe ser valorada frecuentemente, así como lo es la salud física. Por lo
                            tanto, se presenta la presente valoración integral de la salud mental y del bienestar,
                            proponiendo un precedente para detectar problemas de salud mental y la estratificación por
                            nivel de riesgo de comportamientos suicidas y conductas alimentarias de riesgo, combinando
                            datos biológicos y mediciones validadas.
                        </p>

                        <h3>Objetivo</h3>
                        <p>
                            El objetivo es realizar cuestionarios que nos indicarán tu actual estado de salud mental y
                            darle seguimiento si lo requiere.
                        </p>

                        <h3>Propósito</h3>
                        <p>
                            Implementar a nivel nacional un sistema de detección y atención temprana para valorar la
                            salud mental general y poder ofrecerte diferentes intervenciones para atenderte en caso de
                            que detectemos algún problema de tipo emocional o, si no existen, ofrecerte opciones de
                            prevención.
                        </p>

                        <h3>Procedimientos</h3>
                        <p>Se te presentarán preguntas sobre tu salud mental.</p>

                        <h3>Beneficios</h3>
                        <p>
                            Podrás conocer si detectamos algún problema de ansiedad, depresión, uso riesgoso de alcohol
                            o sustancias psicoactivas, y se te notificará a través de tu correo electrónico con el fin
                            de brindarte una propuesta terapéutica individualizada que podrás aceptar de manera
                            voluntaria.
                        </p>

                        <h3>Confidencialidad</h3>
                        <p>
                            Tu participación en este estudio es absolutamente voluntaria. Estás en plena libertad de
                            negarte a participar o de retirar tu participación en este en cualquier momento. Tu decisión
                            de participar o no, no implicará ningún tipo de consecuencia negativa.
                        </p>

                        <h3>Riesgos Potenciales/Compensación</h3>
                        <p>
                            Los riesgos potenciales que implica tu participación en este estudio son mínimos. Si alguna
                            de las preguntas a contestar te hiciera sentir incómodo(a), tienes el derecho de no
                            responder.
                        </p>

                        <h3>Protección de Datos Personales</h3>
                        <p>
                            El Coordinador del Protocolo es responsable de guiarte en tu tratamiento y el resguardo de
                            los datos personales será responsabilidad del equipo de trabajo que atiende tu caso, los
                            cuales serán protegidos conforme a lo dispuesto por la Ley General de Protección de Datos
                            Personales en Posesión de Sujetos Obligados. Los datos personales que te solicitaremos serán
                            utilizados exclusivamente para investigación. Puedes solicitar la corrección de tus datos o
                            que tus datos se eliminen de nuestras bases de datos o retirar tu consentimiento para su uso.
                        </p>

                        <h3>Declaración de la persona que da su asentimiento</h3>
                        <ul>
                            <li>He leído esta carta de consentimiento.</li>
                            <li>Me han contestado mis preguntas relacionadas con mi participación.</li>
                        </ul>
                        <p>
                            Entendí la información que me han dado, y doy mi consentimiento para participar en este
                            estudio.
                        </p>
                    </div>

                    <label className="register-isem-checkbox">
                        <input
                            type="checkbox"
                            checked={!!accepted}
                            onChange={() => setAccepted((prev) => !prev)}
                        />
                        <span>Acepto los términos y condiciones</span>
                    </label>

                    <button
                        className="register-isem-btn-primary"
                        disabled={!accepted}
                        onClick={handleContinue}
                    >
                        Continuar
                    </button>

                    <button
                        className="register-isem-btn-back"
                        onClick={() => navigate('/register/isem/policies')}
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}
