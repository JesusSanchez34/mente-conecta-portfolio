import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterISEM.css';

export function PoliticasPage() {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    const handleContinue = () => {
        sessionStorage.setItem('politicasAceptadas', 'true');
        navigate('/register/isem/consent');
    };

    return (
        <div className="register-isem-bg">
            <div className="register-isem-wrapper">
                {/* Stepper */}
                <div className="register-isem-stepper">
                    <div className="register-isem-step active"></div>
                    <div className="register-isem-step"></div>
                    <div className="register-isem-step"></div>
                    <div className="register-isem-step"></div>
                </div>

                <div className="register-isem-card">
                    <h1 className="register-isem-title">Política de Privacidad</h1>

                    <div className="register-isem-text-scroll">
                        <h3>1. Introducción</h3>
                        <p>
                            Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la
                            información personal de los usuarios de nuestra aplicación móvil de atención médica.
                        </p>
                        <p>
                            Al utilizar nuestra aplicación, aceptas los términos de esta política de privacidad.
                        </p>

                        <h3>2. Información que Recopilamos</h3>
                        <p>
                            <strong>Datos Generales:</strong> Recopilamos información como nombre, dirección de correo
                            electrónico, fecha de nacimiento y género para crear y gestionar cuentas de usuario.
                        </p>
                        <p>
                            <strong>Datos Clínicos:</strong> Para proporcionar servicios médicos, recopilamos información
                            sobre síntomas, diagnósticos, tratamientos y medicamentos.
                        </p>

                        <h3>3. Uso de la Información</h3>
                        <p>Utilizamos la información recopilada para:</p>
                        <ul>
                            <li>Proporcionar servicios médicos y gestionar cuentas de usuario.</li>
                            <li>Personalizar la experiencia del usuario.</li>
                            <li>Realizar análisis estadísticos y mejorar nuestros servicios.</li>
                        </ul>

                        <h3>4. Compartir Información</h3>
                        <p>
                            No compartimos información personal con terceros sin el consentimiento del usuario, excepto
                            cuando sea necesario para brindar servicios médicos o cumplir con la ley.
                        </p>

                        <h3>5. Seguridad de Datos</h3>
                        <p>
                            Implementamos medidas de seguridad para proteger la información personal.
                        </p>
                        <p>
                            Los datos clínicos se almacenan de forma segura y solo son accesibles por profesionales
                            médicos autorizados.
                        </p>

                        <h3>6. Derechos del Usuario</h3>
                        <p>
                            Los usuarios tienen derecho a acceder, corregir o eliminar su información personal.
                            Pueden retirar su consentimiento en cualquier momento.
                        </p>

                        <h3>7. Contacto</h3>
                        <p>
                            Si tienes preguntas o preocupaciones sobre nuestra política de privacidad, contáctanos a
                            través de la dirección de correo electrónico.
                        </p>
                    </div>

                    <label className="register-isem-checkbox">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <span>Acepto los términos y condiciones</span>
                    </label>

                    <button
                        className="register-isem-btn-primary"
                        disabled={!accepted}
                        onClick={handleContinue}
                    >
                        Aceptar y Continuar
                    </button>

                    <button
                        className="register-isem-btn-back"
                        onClick={() => navigate('/login/isem')}
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}
