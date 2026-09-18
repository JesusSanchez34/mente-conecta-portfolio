import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterISEM.css';

export function PropositoPage() {
    const navigate = useNavigate();

    // Guard: debe haber aceptado consentimiento primero
    useEffect(() => {
        if (sessionStorage.getItem('consentimientoAceptado') !== 'true') {
            navigate('/register/isem/consent', { replace: true });
        }
    }, [navigate]);

    const handleContinue = () => {
        sessionStorage.setItem('propositoVisto', 'true');
        navigate('/register/isem/form');
    };

    return (
        <div className="register-isem-bg">
            <div className="register-isem-wrapper">
                {/* Stepper */}
                <div className="register-isem-stepper">
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step active"></div>
                    <div className="register-isem-step"></div>
                </div>

                <div className="register-isem-card">
                    <h1 className="register-isem-title">Propósito</h1>

                    <div className="register-isem-info-text">
                        <p>Esta APP de ayuda en salud mental.</p>

                        <p>
                            Muchos de nosotros pasamos por periodos de ansiedad o depresión, y aunque nos esforzamos,
                            volvemos a sentir ese malestar. El ritmo vertiginoso de la vida muchas veces nos impide
                            asistir al médico para una revisión.
                        </p>

                        <p>
                            Esta app es una herramienta diseñada para auxiliarte, orientándote hacia un posible
                            diagnóstico de alguna enfermedad psiquiátrica que pudiera estar detrás de tus malestares.
                        </p>

                        <p>
                            Dentro encontrarás cuestionarios que nos permitirán orientarte sobre qué puedes tener y
                            dónde acudir para recibir tratamiento y sentirte mejor, mediante especialistas.
                        </p>
                    </div>

                    <button
                        className="register-isem-btn-primary"
                        onClick={handleContinue}
                    >
                        Continuar
                    </button>

                    <button
                        className="register-isem-btn-back"
                        onClick={() => navigate('/register/isem/consent')}
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}
