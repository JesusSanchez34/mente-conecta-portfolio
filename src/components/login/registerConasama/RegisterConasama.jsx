import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { MdOutlineKeyboardBackspace, MdDateRange } from 'react-icons/md';
import { toast } from 'react-toastify';
import { registerConasamaApi, sendOtpConasamaApi, validateOtpConasamaApi } from '../../../api/user';
import './RegisterConasama.css';
import logoMCA from '../../../assets/img/logoMCA.png';

export function RegisterConasama({ onBack, onComplete }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpSession, setOtpSession] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        correo: '',
        password: '',
        confirmPassword: '',
        emergenciaNombre: '',
        emergenciaParentesco: '',
        emergenciaTelefono: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateAge = (birthDateString) => {
        if (!birthDateString) return 0;
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const handleNext = async () => {
        // --- Paso 1: Datos personales ---
        if (currentStep === 1) {
            if (!formData.nombre.trim() || !formData.apellidoPaterno.trim() || !formData.apellidoMaterno.trim() || !formData.fechaNacimiento) {
                toast.error('Por favor completa todos los campos de información personal.');
                return;
            }
            setCurrentStep(2);

        // --- Paso 2: Correo y contraseña ---
        } else if (currentStep === 2) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.correo.trim() || !emailRegex.test(formData.correo)) {
                toast.error('Por favor ingresa un correo electrónico válido.');
                return;
            }
            if (!formData.password || formData.password.length < 6) {
                toast.error('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Las contraseñas no coinciden.');
                return;
            }
            setCurrentStep(3);

        // --- Paso 3: Contacto de emergencia ---
        } else if (currentStep === 3) {
            if (!formData.emergenciaNombre.trim() || !formData.emergenciaParentesco.trim() || !formData.emergenciaTelefono.trim()) {
                toast.error('Por favor completa los datos del contacto de emergencia.');
                return;
            }
            if (formData.emergenciaTelefono.replace(/\D/g, '').length !== 10) {
                toast.error('El teléfono de emergencia debe ser de 10 dígitos.');
                return;
            }
            setCurrentStep(4);

        // --- Paso 4: Términos → Registrar + Enviar OTP ---
        } else if (currentStep === 4) {
            if (!termsAccepted) {
                toast.error('Debes aceptar los términos y condiciones para continuar.');
                return;
            }

            try {
                setIsSubmitting(true);

                const cleanUsername = formData.correo
                    .split('@')[0]
                    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');

                const patientPayload = {
                    nombre:              formData.nombre,
                    apellido_paterno:    formData.apellidoPaterno,
                    apellido_materno:    formData.apellidoMaterno,
                    fecha_nacimiento:    formData.fechaNacimiento,
                    celular_paciente:    formData.emergenciaTelefono,
                    email_paciente:      formData.correo,
                    username:            cleanUsername,
                    password:            formData.password,
                    terminos:            termsAccepted,
                    sede_id:             1,
                    contacto_emergencia: [
                        {
                            nombre_completo: formData.emergenciaNombre,
                            parentesco: formData.emergenciaParentesco,
                            celular: formData.emergenciaTelefono,
                        }
                    ]
                };

                // 1. Crear cuenta en la BD
                await registerConasamaApi(patientPayload);

                // 2. Enviar OTP usando el endpoint de login de dos pasos
                const otpResponse = await sendOtpConasamaApi(formData.correo, formData.password);
                if (otpResponse && otpResponse.otp_session) {
                    setOtpSession(otpResponse.otp_session);
                }

                toast.success('Cuenta creada. Revisa tu correo para el código de verificación.');
                setCurrentStep(5);
            } catch (error) {
                console.error('Error en registro:', error);
                toast.error(error.message || 'Error al registrar la cuenta.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // --- Paso 5: Verificar OTP ---
    const handleVerify = async () => {
        if (!otpCode || otpCode.length !== 6) {
            toast.error('Por favor ingresa el código de 6 dígitos.');
            return;
        }
        try {
            setIsSubmitting(true);
            await validateOtpConasamaApi(otpCode, otpSession);
            toast.success('¡Cuenta verificada con éxito!');
            if (onComplete) onComplete();
            else onBack();
        } catch (error) {
            console.error('Error al verificar OTP:', error);
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else onBack();
    };

    const stepTitle = () => {
        switch (currentStep) {
            case 1: return 'REGISTRO';
            case 2: return 'REGISTRAR';
            case 3: return 'Contacto de emergencia';
            case 4: return 'Términos y condiciones';
            case 5: return 'Verificación';
            default: return '';
        }
    };

    return (
        <div className="register-conasama-bg">
            <div className="register-card-wrapper">
                {/* Header */}
                <div className="register-header">
                    <MdOutlineKeyboardBackspace className="back-icon" onClick={handleBack} />
                    <h2 className="register-title">{stepTitle()}</h2>
                    <div className="lang-selector-header">🇲🇽 🌐</div>
                </div>

                <div className="register-body">
                    <div className="floating-bg bg-icon-1">🧠</div>
                    <div className="floating-bg bg-icon-2">🛡️</div>
                    <div className="floating-bg bg-icon-3">💙</div>
                    <div className="floating-bg bg-icon-4">🧠</div>
                    <div className="floating-bg bg-icon-5">💙</div>

                    {(currentStep === 1 || currentStep === 2) && (
                        <div className="register-logo-container">
                            <img src={logoMCA} alt="Mente Conecta" className="register-logo" />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <h3 className="step-subtitle">Registra tu correo y<br />contraseña</h3>
                    )}

                    <div className={`register-form ${currentStep === 4 ? 'terms-form-layout' : ''}`}>
                        {currentStep === 1 && (
                            <>
                                <div className="custom-input-group">
                                    <label>Nombre</label>
                                    <FaUser className="input-icon" />
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ingresa tu nombre" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Apellido Paterno</label>
                                    <FaUser className="input-icon" />
                                    <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleInputChange} placeholder="Apellido paterno" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Apellido Materno</label>
                                    <FaUser className="input-icon" />
                                    <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleInputChange} placeholder="Apellido materno" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Fecha de Nacimiento</label>
                                    <MdDateRange className="input-icon" />
                                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className="date-input-field" />
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div className="custom-input-group">
                                    <label>Correo</label>
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="ejemplo@correo.com" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Contraseña</label>
                                    <FaLock className="input-icon" />
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Crea una contraseña" />
                                    {showPassword
                                        ? <FaEyeSlash className="input-action-icon" onClick={() => setShowPassword(false)} />
                                        : <FaEye className="input-action-icon" onClick={() => setShowPassword(true)} />}
                                </div>
                                <div className="custom-input-group">
                                    <label>Confirmar Contraseña</label>
                                    <FaLock className="input-icon" />
                                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirma tu contraseña" />
                                    {showConfirmPassword
                                        ? <FaEyeSlash className="input-action-icon" onClick={() => setShowConfirmPassword(false)} />
                                        : <FaEye className="input-action-icon" onClick={() => setShowConfirmPassword(true)} />}
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <div className="custom-input-group mt-4">
                                    <label>Nombre completo</label>
                                    <FaUser className="input-icon" />
                                    <input type="text" name="emergenciaNombre" value={formData.emergenciaNombre} onChange={handleInputChange} placeholder="Nombre del contacto" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Parentesco</label>
                                    <FaUser className="input-icon" />
                                    <input type="text" name="emergenciaParentesco" value={formData.emergenciaParentesco} onChange={handleInputChange} placeholder="Ej. Padre, Madre, Amigo" />
                                </div>
                                <div className="custom-input-group">
                                    <label>Teléfono</label>
                                    <div className="phone-prefix">
                                        <span className="dropdown-arrow">▼</span>
                                        <span className="flag">🇲🇽</span>
                                        <span className="prefix">+52</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="emergenciaTelefono"
                                        value={formData.emergenciaTelefono}
                                        onChange={(e) => {
                                            const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData(prev => ({ ...prev, emergenciaTelefono: clean }));
                                        }}
                                        placeholder="10 dígitos"
                                        className="phone-input"
                                    />
                                </div>
                                <div className="phone-counter">{formData.emergenciaTelefono.length}/10</div>
                            </>
                        )}

                        {currentStep === 4 && (
                            <div className="terms-container">
                                <h3 className="terms-main-title">Consentimiento Informado para Participación en el Estudio MINDS</h3>
                                <p className="terms-intro">Título del estudio: "Salud Mental e Intervención para Nuevos Médicos y Prevención del Suicidio" (Mental Health and Intervention for New Doctors and Suicide Prevention - MINDS)</p>

                                <h4 className="terms-section-title">Investigadores responsables</h4>
                                <ul className="terms-list">
                                    <li>Lic. Abril Téllez Buendía - Investigadora Principal.</li>
                                    <li>Dra. Pamela Espinosa Méndez - Co-Investigadora.</li>
                                </ul>

                                <h4 className="terms-section-title">Equipo colaborador nacional e internacional:</h4>
                                <p className="terms-text">CONASAMA, INMEGEN, Universidad Juárez Autónoma de Tabasco, Hospital Psiquiátrico Infantil "Dr. Juan N. Navarro" y Universidad de Yale.</p>

                                <h4 className="terms-section-title">Introducción</h4>
                                <p className="terms-text">Se te invita a participar en el estudio MINDS, cuyo propósito es evaluar y dar seguimiento a la salud mental de los médicos internos de pregrado y pasantes de servicio social de medicina en México.<br />Tu participación ayudará a identificar factores de riesgo y a ofrecerte intervenciones de apoyo según tu nivel de necesidad.</p>

                                <h4 className="terms-section-title">Objetivo</h4>
                                <p className="terms-text">Detectar de manera oportuna síntomas de depresión, ansiedad, consumo de sustancias, trastornos alimentarios y riesgo suicida, a través de cuestionarios electrónicos validados y un sistema automatizado de clasificación de riesgo.</p>

                                <h4 className="terms-section-title">Procedimientos</h4>
                                <ul className="terms-list">
                                    <li>Accederás a un enlace electrónico donde se te presentará este consentimiento informado.</li>
                                    <li>Si aceptas, completarás un cuestionario sociodemográfico y posteriormente responderás las escalas clínicas: PHQ-9, GAD-7, C-SSRS, ASSIST v3, S-EDE y Screener questionnaire.</li>
                                    <li>Los cuestionarios son aplicados y acompañados por el equipo de salud mental estatal, quien tiene la función de dar seguimiento inicial y mantener la vinculación con los servicios de salud en tu entidad.</li>
                                </ul>

                                <h4 className="terms-section-title">Entrega de resultados</h4>
                                <ul className="terms-list">
                                    <li>Grupo A (sin riesgo): deberás solicitar tus resultados enviando un correo a prevencion.suicidio@salud.gob.mx. El área estatal de salud mental te enviará además un Kit preventivo digital con estrategias de autocuidado y prevención.</li>
                                    <li>Grupos B, C y D (con riesgo): recibirás tus resultados de manera confidencial en tu correo electrónico registrado y el equipo de salud mental estatal dará seguimiento, tras la notificación enviada a través del correo prevencion.suicidio@salud.gob.mx.<br />Seguimiento: el mismo procedimiento se repetirá a los 6 meses para valorar tu evolución.</li>
                                </ul>

                                <h4 className="terms-section-title">Duración</h4>
                                <ul className="terms-list">
                                    <li>Responder los cuestionarios toma aproximadamente 30 a 40 minutos.</li>
                                    <li>Se repetirá el mismo procedimiento a los 6 meses para dar seguimiento a tu evolución.</li>
                                </ul>

                                <h4 className="terms-section-title">Beneficios</h4>
                                <ul className="terms-list">
                                    <li>Grupo A: recibirás un Kit preventivo digital con recursos prácticos para fortalecer tu autocuidado y bienestar durante tu formación médica.</li>
                                    <li>Grupos B, C y D: recibirás una retroalimentación personalizada sobre tu salud mental y se te ofrecerán intervenciones gratuitas, diferenciadas según tu nivel de riesgo (talleres grupales, psicoterapia breve, derivación a servicios especializados o protocolos de emergencia).</li>
                                    <li>Tu participación contribuirá a generar evidencia para mejorar los programas de salud mental en médicos en formación.</li>
                                </ul>

                                <h4 className="terms-section-title">Riesgos</h4>
                                <ul className="terms-list">
                                    <li>Algunas preguntas pueden generar incomodidad emocional; puedes omitir cualquier pregunta que no desees responder.</li>
                                    <li>En caso de riesgo alto o inminente, se notificará de inmediato al área de enseñanza y/o a los servicios de salud mental estatales, únicamente de acuerdo con la autorización que hayas otorgado en este consentimiento, con el propósito exclusivo de activar medidas de apoyo y protección a tu salud y bienestar.</li>
                                </ul>

                                <h4 className="terms-section-title">Confidencialidad</h4>
                                <p className="terms-text">Tus datos personales serán tratados conforme a la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados y la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>
                                <ul className="terms-list">
                                    <li>La información será almacenada en una plataforma electrónica segura, con acceso restringido únicamente al equipo de investigación autorizado.</li>
                                    <li>Tus resultados solo se utilizarán para los fines de este estudio y no se difundirán de forma que permitan identificarte.</li>
                                    <li>Puedes ejercer en cualquier momento tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) enviando tu solicitud a prevencion.suicidio@salud.gob.mx</li>
                                    <li>En caso de detectarse riesgo alto o inminente, tu información podrá compartirse exclusivamente con el área de enseñanza y los servicios de salud mental de tu estado, únicamente para activar protocolos de apoyo clínico.</li>
                                    <li>Podrás acercarte al equipo de salud mental estatal que te aplica los cuestionarios, quienes fungirán como primer enlace de apoyo y seguimiento en tu entidad federativa.</li>
                                </ul>

                                <h4 className="terms-section-title">Participación voluntaria</h4>
                                <p className="terms-text">Tu participación es libre y voluntaria. Puedes decidir no participar o retirarte en cualquier momento</p>

                                <h4 className="terms-section-title">Nota sobre muestras biológicas</h4>
                                <p className="terms-text">Este consentimiento corresponde únicamente a la parte clínica (cuestionarios y seguimiento). En caso de que aceptes donar muestra de sangre o raspado bucal, se te entregará un consentimiento independiente elaborado por el Instituto Nacional de Medicina Genómica (INMEGEN), responsable de la parte genética.</p>

                                <h4 className="terms-section-title">Contacto</h4>
                                <p className="terms-text">
                                    Dudas o aclaraciones: prevencion.suicidio@salud.gob.mx<br />
                                    Atención urgente: Línea de la Vida 800 911 2000 (24 horas).
                                </p>

                                <div className="terms-authorization">
                                    <label className="checkbox-container">
                                        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                                        <span className="auth-title">Autorizo</span>
                                    </label>
                                    <p className="auth-text">
                                        Que, en caso de riesgo alto o inminente, se notifique tanto al área de enseñanza como a los servicios de salud mental de mi estado, con el fin de activar protocolos de apoyo.
                                    </p>
                                </div>

                                {!termsAccepted && (
                                    <div className="terms-warning">
                                        Nota importante: Para completar el registro debes aceptar los términos y condiciones.<br />
                                        En caso contrario la cuenta no sera registrada.
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="verification-container">
                                <div className="verification-icon-wrapper">
                                    <FaShieldAlt className="verification-icon" />
                                </div>
                                <h3 className="verification-title">Verificación de<br />seguridad</h3>
                                <p className="verification-text">Hemos enviado un código de verificación de 6 dígitos a tu correo electrónico.</p>
                                <p className="verification-email">{formData.correo}</p>

                                <input
                                    type="text"
                                    className="verification-input"
                                    maxLength="6"
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                />

                                <Button className="btn-verificar" onClick={handleVerify} disabled={isSubmitting}>
                                    {isSubmitting ? 'Verificando...' : 'Verificar'}
                                </Button>

                                <p className="resend-text">
                                    ¿No recibiste el código?{' '}
                                    <span
                                        className="resend-link"
                                        style={{ cursor: 'pointer' }}
                                        onClick={async () => {
                                            try {
                                                setIsSubmitting(true);
                                                const res = await sendOtpConasamaApi(formData.correo, formData.password);
                                                if (res && res.otp_session) setOtpSession(res.otp_session);
                                                toast.success('Código de verificación reenviado.');
                                            } catch {
                                                toast.error('Error al reenviar el código.');
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}
                                    >
                                        Reenviar
                                    </span>
                                </p>
                            </div>
                        )}

                        {currentStep < 5 && (
                            <Button
                                className="btn-siguiente"
                                onClick={handleNext}
                                disabled={isSubmitting || (currentStep === 4 && !termsAccepted)}
                            >
                                {isSubmitting ? 'Registrando...' : currentStep >= 3 ? 'Continuar' : 'Siguiente'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <div className="loading-modal-overlay">
                    <div className="loading-modal-content">
                        <p>Cargando...</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="mca-modal-overlay">
                    <div className="mca-modal-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="mca-modal-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FaExclamationTriangle style={{ color: '#F2C94C', fontSize: '2.2rem', flexShrink: 0 }} />
                            <h3 className="mca-modal-title" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#EB5757', margin: 0, fontFamily: 'inherit' }}>
                                Código incorrecto
                            </h3>
                        </div>
                        <div className="mca-modal-body">
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#4A4A4A', lineHeight: '1.5', fontWeight: '500', textAlign: 'left', fontFamily: 'inherit' }}>
                                El código de seguridad ingresado no es válido o ha expirado. Por favor, verifica el código e inténtalo de nuevo.
                            </p>
                        </div>
                        <div className="mca-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                            <button
                                type="button"
                                className="mca-modal-btn"
                                style={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', borderRadius: '50px', padding: '10px 24px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                                onClick={() => setShowErrorModal(false)}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
