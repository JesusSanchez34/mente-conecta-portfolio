import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { GiBrain } from "react-icons/gi";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaGlobe, FaHeart, FaCheck, FaExclamationTriangle, FaKey, FaEnvelope, FaCheckCircle, FaShieldAlt, FaSignInAlt } from "react-icons/fa";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Navigate } from 'react-router-dom';
import Icono_home from "../../../assets/img/Icono_home.jpeg";
import logoMCA from '../../../assets/img/logoMCA.png';
import { loginApiISEM, loginApiFase1, loginApiConasama, loginApiSEP, loginApiMCSEP, loginApiEnvejecimiento, sendOtpConasamaApi, validateOtpConasamaApi, sendRecoveryEmailApi, validateRecoveryOtpApi, resetPasswordApi } from '../../../api/user';
import { useAuth } from '../../../hooks';
import { InputForm } from '../../ui';
import './FormLogin.css';

export function FormLogin(props) {
    const { typeLogin, onBack } = props;
    const { t } = useTranslation();
    const { auth, login, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [selectedLang, setSelectedLang] = useState(() => {
        if (typeLogin === 3) {
            return localStorage.getItem('mente_conecta_lang') || 'es';
        }
        return 'es';
    });
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    useEffect(() => {
        if (typeLogin === 3) {
            localStorage.setItem('mente_conecta_lang', selectedLang);
        }
    }, [selectedLang, typeLogin]);

    useEffect(() => {
        if (typeLogin !== 3) {
            setSelectedLang('es');
        } else {
            setSelectedLang(localStorage.getItem('mente_conecta_lang') || 'es');
        }
    }, [typeLogin]);

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // OTP states for 2-step verification (CONASAMA)
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [otpSession, setOtpSession] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [userCredentials, setUserCredentials] = useState({ username: "", password: "" });

    // Forgot Password states for CONASAMA
    const [recoveryStep, setRecoveryStep] = useState('login'); // 'login', 'request', 'verify', 'reset'
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryOtp, setRecoveryOtp] = useState('');
    const [showSentModal, setShowSentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


    const loginMap = {
        1: loginApiISEM,
        2: loginApiFase1,
        3: loginApiConasama,
        4: loginApiSEP, // SEP usa su propia API
        5: loginApiMCSEP,
        6: loginApiEnvejecimiento,
    };

    const getLoginApi = (typeLogin) => loginMap[typeLogin] || loginApiISEM;

    const renderLoadingOverlay = () => {
        if (!isLoading) return null;
        return (
            <div className="mca-loading-overlay">
                <div className="mca-loading-card">
                    <h3 className="mca-loading-title">
                        {loadingMessage || (selectedLang === 'es' ? 'Iniciando sesión ...' : 'Logging in ...')}
                    </h3>
                    <div className="mca-loading-spinner" />
                </div>
            </div>
        );
    };

    // Handle OTP verification submission
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.trim().length !== 6) {
            toast.error(selectedLang === 'es' ? "El código debe ser de 6 dígitos." : "Code must be 6 digits.");
            return;
        }

        try {
            setLoadingMessage(selectedLang === 'es' ? "Verificando código ..." : "Verifying code ...");
            setIsLoading(true);
            setError(null);

            const response = await validateOtpConasamaApi(otpCode, otpSession);
            if (response && response.access) {
                await login(response.access, 3);
                toast.success(selectedLang === 'es' ? "¡Cuenta verificada con éxito!" : "Account verified successfully!");
            } else {
                throw new Error("No se recibió token de acceso.");
            }
        } catch (err) {
            console.error("[FormLogin] Error validating OTP:", err);
            const isNetworkError = err.message?.includes("Failed to fetch") ||
                                   err.message?.includes("NetworkError") ||
                                   err.message?.includes("network") ||
                                   err.toString().includes("TypeError") ||
                                   err.message?.includes("timeout");
            if (isNetworkError) {
                toast.error(selectedLang === 'es'
                    ? "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
                    : "Could not connect to the server. Check your connection and try again.");
            } else {
                setShowErrorModal(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resending OTP code
    const handleResendOtp = async (e) => {
        e.preventDefault();
        try {
            setLoadingMessage(selectedLang === 'es' ? "Reenviando código ..." : "Resending code ...");
            setIsLoading(true);
            toast.info(selectedLang === 'es' ? "Reenviando código de verificación..." : "Resending verification code...");

            const response = await sendOtpConasamaApi(userCredentials.username, userCredentials.password);
            setOtpSession(response.otp_session);
            toast.success(selectedLang === 'es' ? "Código reenviado con éxito al correo." : "Verification code successfully resent.");
        } catch (err) {
            console.error("[FormLogin] Error resending OTP:", err);
            const isNetworkError = err.message?.includes("Failed to fetch") ||
                                   err.message?.includes("NetworkError") ||
                                   err.message?.includes("network") ||
                                   err.toString().includes("TypeError") ||
                                   err.message?.includes("timeout");
            if (isNetworkError) {
                toast.error(selectedLang === 'es'
                    ? "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
                    : "Could not connect to the server. Check your connection and try again.");
            } else {
                toast.error(err.message || (selectedLang === 'es' ? "Error al reenviar código." : "Error resending code."));
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- Forgot Password Handlers ---
    const handleSendRecoveryEmail = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!recoveryEmail || !emailRegex.test(recoveryEmail.trim())) {
            toast.error(selectedLang === 'es' ? "Por favor ingresa un correo electrónico válido." : "Please enter a valid email address.");
            return;
        }

        try {
            setLoadingMessage(selectedLang === 'es' ? "Enviando correo ..." : "Sending email ...");
            setIsLoading(true);
            setError(null);
            
            try {
                await sendRecoveryEmailApi(recoveryEmail.trim());
                setShowSentModal(true);
            } catch (err) {
                const isNetworkError = err.message?.includes("Failed to fetch") ||
                                       err.message?.includes("NetworkError") ||
                                       err.message?.includes("network") ||
                                       err.toString().includes("TypeError") ||
                                       err.message?.includes("timeout");
                if (isNetworkError) {
                    toast.error(selectedLang === 'es'
                        ? "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
                        : "Could not connect to the server. Check your connection and try again.");
                } else {
                    setError(err.message || (selectedLang === 'es' ? "Error al enviar el correo de recuperación." : "Error sending recovery email."));
                    toast.error(err.message || (selectedLang === 'es' ? "Error al enviar el correo." : "Error sending email."));
                }
            }
        } catch (err) {
            console.error("[FormLogin] Error sending recovery email:", err);
            toast.error(err.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyRecoveryOtp = async (e) => {
        e.preventDefault();
        if (!recoveryOtp || recoveryOtp.trim().length !== 6) {
            toast.error(selectedLang === 'es' ? "El código debe ser de 6 dígitos." : "Code must be 6 digits.");
            return;
        }

        try {
            setLoadingMessage(selectedLang === 'es' ? "Verificando código ..." : "Verifying code ...");
            setIsLoading(true);
            setError(null);

            try {
                await validateRecoveryOtpApi(recoveryEmail.trim(), recoveryOtp.trim());
                setRecoveryStep('reset');
            } catch (err) {
                const isNetworkError = err.message?.includes("Failed to fetch") ||
                                       err.message?.includes("NetworkError") ||
                                       err.message?.includes("network") ||
                                       err.toString().includes("TypeError") ||
                                       err.message?.includes("timeout");
                if (isNetworkError) {
                    toast.error(selectedLang === 'es'
                        ? "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
                        : "Could not connect to the server. Check your connection and try again.");
                } else {
                    setShowErrorModal(true);
                }
            }
        } catch (err) {
            console.error("[FormLogin] Error validating recovery OTP:", err);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendRecoveryOtp = async (e) => {
        e.preventDefault();
        try {
            setLoadingMessage(selectedLang === 'es' ? "Reenviando código ..." : "Resending code ...");
            setIsLoading(true);
            toast.info(selectedLang === 'es' ? "Reenviando código de recuperación..." : "Resending recovery code...");
            
            await sendRecoveryEmailApi(recoveryEmail.trim());
            toast.success(selectedLang === 'es' ? "Código reenviado con éxito al correo." : "Recovery code successfully resent.");
        } catch (err) {
            console.error("[FormLogin] Error resending recovery OTP:", err);
            toast.error(err.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error(selectedLang === 'es' ? "La contraseña debe tener al menos 6 caracteres." : "Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error(selectedLang === 'es' ? "Las contraseñas no coinciden." : "Passwords do not match.");
            return;
        }

        try {
            setLoadingMessage(selectedLang === 'es' ? "Restableciendo contraseña ..." : "Resetting password ...");
            setIsLoading(true);
            setError(null);

            try {
                await resetPasswordApi(recoveryEmail.trim(), recoveryOtp.trim(), newPassword);
                setShowSuccessModal(true);
            } catch (err) {
                const isNetworkError = err.message?.includes("Failed to fetch") ||
                                       err.message?.includes("NetworkError") ||
                                       err.message?.includes("network") ||
                                       err.toString().includes("TypeError") ||
                                       err.message?.includes("timeout");
                if (isNetworkError) {
                    toast.error(selectedLang === 'es'
                        ? "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
                        : "Could not connect to the server. Check your connection and try again.");
                } else {
                    setError(err.message || (selectedLang === 'es' ? "Error al restablecer la contraseña." : "Error resetting password."));
                    toast.error(err.message || (selectedLang === 'es' ? "Error al restablecer la contraseña." : "Error resetting password."));
                }
            }
        } catch (err) {
            console.error("[FormLogin] Error resetting password:", err);
            toast.error(err.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: initialValues(typeLogin),
        validationSchema: Yup.object(newSchema(typeLogin, t)),
        validateOnChange: false,
        onSubmit: async (formvalue) => {
            try {
                setLoadingMessage(selectedLang === 'es' ? "Iniciando sesión ..." : "Logging in ...");
                setIsLoading(true);
                setError(null);
                
                // If typeLogin === 3, trigger OTP flow
                if (typeLogin === 3) {
                    console.log(`[FormLogin] Iniciando OTP flow para CONASAMA: ${formvalue.username}`);
                    setUserCredentials({ username: formvalue.username, password: formvalue.password });
                    try {
                        const response = await sendOtpConasamaApi(formvalue.username, formvalue.password);
                        setOtpSession(response.otp_session);
                        setShowOtpScreen(true);
                        toast.success(selectedLang === 'es' ? "Código de verificación enviado." : "Verification code sent.");
                    } catch (err) {
                        console.error("[FormLogin] OTP API Error:", err);
                        const isNetworkError = err.message?.includes("Failed to fetch") ||
                                               err.message?.includes("NetworkError") ||
                                               err.message?.includes("network") ||
                                               err.toString().includes("TypeError");
                        if (isNetworkError) {
                            setError(selectedLang === 'es'
                                ? "No se pudo conectar con el servidor. Verifica que el backend esté activo."
                                : "Could not connect to the server. Make sure the backend is running.");
                            toast.error(selectedLang === 'es'
                                ? "Error de conexión. No se pudo contactar el servidor."
                                : "Connection error. Could not reach the server.");
                        } else {
                            setError(err.message || "Usuario o contraseña incorrectos.");
                            toast.error(err.message || "Error al iniciar sesión.");
                        }
                    }
                    return;
                }

                console.log(`[FormLogin] Iniciando login para typeLogin: ${typeLogin}`);
                
                // PASO 1: Llamar API de login
                console.log(`[FormLogin] Llamando API de login...`);
                const response = await getLoginApi(typeLogin)(formvalue, typeLogin);
                const { access } = response;
                console.log(`[FormLogin] ✓ Token recibido exitosamente`);
                
                // PASO 2: Guardar en contexto
                console.log(`[FormLogin] Guardando token en AuthContext...`);
                await login(access, typeLogin);
                console.log(`[FormLogin] ✓ Login completado. Esperando redirección...`);
                
                toast.success(t('formLogin.toastSigningIn'));
                
            } catch (error) {
                console.error(`[FormLogin]  Error en login:`, error);
                setError(error.message);
                
                 // Mostrar diferentes mensajes según el tipo de error
                if (error.message.includes("404") || error.message.includes("no encontrado")) {
                    toast.error(t('formLogin.toastInvalidUser'));
                } else if (error.message.includes("no tiene acceso")) {
                    toast.error(t('formLogin.toastNoAccess'));
                } else if (error.message.includes("token")) {
                    toast.error(t('formLogin.toastAuthError'));
                } else {
                    toast.error(error.message || t('formLogin.toastError'));
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    const renderSentModal = () => {
        return (
            <div className="mca-modal-overlay">
                <div className="mca-modal-card mca-sent-modal-card">
                    <div className="mca-sent-logo-wrapper">
                        <img src={logoMCA} alt="Mente Conecta Adicciones" className="mca-logo" />
                    </div>
                    <div className="mca-modal-header centered-header">
                        <h3 className="mca-modal-title success-title">
                            {selectedLang === 'es' ? 'Código enviado' : 'Code sent'}
                        </h3>
                    </div>
                    <div className="mca-modal-body">
                        <p className="mca-modal-text">
                            {selectedLang === 'es' 
                                ? 'Hemos enviado un código de verificación a tu correo electrónico. Por favor, revísalo.' 
                                : 'We have sent a verification code to your email. Please check it.'}
                        </p>
                    </div>
                    <div className="mca-modal-footer centered-footer">
                        <button
                            type="button"
                            className="mca-btn-gradient"
                            onClick={() => {
                                setShowSentModal(false);
                                setRecoveryStep('verify');
                            }}
                        >
                            {selectedLang === 'es' ? 'Entendido' : 'Understood'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSuccessModal = () => {
        return (
            <div className="mca-modal-overlay">
                <div className="mca-modal-card mca-success-reset-modal">
                    {/* Header con gradiente de cian a púrpura y círculo blanco con check */}
                    <div className="mca-success-modal-header">
                        <div className="mca-success-check-circle">
                            <FaCheck className="success-check-icon" />
                        </div>
                    </div>

                    <div className="mca-success-modal-body">
                        <h3 className="mca-success-modal-title">
                            {selectedLang === 'es' ? '¡Todo listo!' : 'All set!'}
                        </h3>
                        <p className="mca-success-modal-subtitle">
                            {selectedLang === 'es' 
                                ? 'Tu contraseña se cambió exitosamente' 
                                : 'Your password has been changed successfully'}
                        </p>

                        {/* Caja info azul claro con escudo */}
                        <div className="mca-shield-info-box">
                            <div className="mca-shield-icon-wrapper">
                                <FaShieldAlt className="mca-shield-icon" />
                            </div>
                            <div className="mca-shield-text-wrapper">
                                <h4 className="mca-shield-title">
                                    {selectedLang === 'es' ? 'Tu cuenta está protegida' : 'Your account is protected'}
                                </h4>
                                <p className="mca-shield-desc">
                                    {selectedLang === 'es' 
                                        ? 'Hemos guardado tu nueva contraseña de forma segura.' 
                                        : 'We have saved your new password securely.'}
                                </p>
                            </div>
                        </div>

                        {/* Botón 1: Iniciar Sesión (Fondo turquesa con icono de login) */}
                        <button
                            type="button"
                            className="mca-success-login-btn"
                            onClick={() => {
                                setShowSuccessModal(false);
                                setRecoveryStep('login');
                                setRecoveryEmail('');
                                setRecoveryOtp('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                            }}
                        >
                            <FaSignInAlt className="btn-login-icon" />
                            <span>{selectedLang === 'es' ? 'Iniciar Sesión' : 'Log In'}</span>
                        </button>

                        {/* Botón 2: Volver al inicio (Fondo blanco, borde/texto negro) */}
                        <button
                            type="button"
                            className="mca-success-home-btn"
                            onClick={() => {
                                setShowSuccessModal(false);
                                setRecoveryStep('login');
                                setRecoveryEmail('');
                                setRecoveryOtp('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                                onBack(); // Regresa al selector principal
                            }}
                        >
                            <span>{selectedLang === 'es' ? 'Volver al inicio' : 'Return to home'}</span>
                        </button>
                    </div>

                    {/* Footer text */}
                    <div className="mca-success-modal-footer">
                        <span className="mca-footer-help-text">
                            {selectedLang === 'es' ? '¿Necesitas ayuda? ' : 'Need help? '}
                            <a href="#" className="mca-footer-help-link" onClick={(e) => {
                                e.preventDefault();
                                toast.info(selectedLang === 'es' ? "Centro de soporte próximamente disponible." : "Support center coming soon.");
                            }}>
                                {selectedLang === 'es' ? 'Centro de soporte' : 'Support center'}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderRequestRecoveryUI = () => {
        return (
            <div className="mca-login-container">
                {/* Header */}
                <header className="mca-header">
                    <button 
                        type="button" 
                        className="mca-back-btn" 
                        onClick={() => {
                            setRecoveryStep('login');
                            setError(null);
                        }}
                        disabled={isLoading}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="mca-header-title">
                        {selectedLang === 'es' ? 'Recuperar contraseña' : 'Recover password'}
                    </h1>
                    <div style={{ width: '32px' }}></div>
                </header>

                {/* Floating Background Icons */}
                <div className="mca-floating-bg">
                    <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                    <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                </div>

                <div className="mca-body">
                    {/* Tarjeta de Recuperar Contraseña */}
                    <div className="mca-card mca-recovery-card">
                        <div className="mca-recovery-icon-wrapper">
                            <div className="mca-recovery-icon-circle key-circle">
                                <FaKey />
                            </div>
                        </div>

                        <h2 className="mca-welcome-title">
                            {selectedLang === 'es' ? 'Recuperar contraseña' : 'Recover password'}
                        </h2>
                        
                        <p className="mca-welcome-desc">
                            {selectedLang === 'es' 
                                ? 'Ingresa tu correo electrónico registrado para enviarte un código de recuperación.' 
                                : 'Enter your registered email to send you a recovery code.'}
                        </p>

                        <Form onSubmit={handleSendRecoveryEmail} className="mca-form">
                            {/* Input Correo */}
                            <div className="mca-input-group">
                                <label className="mca-input-label">
                                    {selectedLang === 'es' ? 'Correo electrónico' : 'Email address'}
                                </label>
                                <div className="mca-input-field-wrapper">
                                    <FaEnvelope className="mca-input-icon-left" />
                                    <input
                                        type="email"
                                        className="mca-input-control"
                                        placeholder="correo@ejemplo.com"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mca-btn-purple"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>{selectedLang === 'es' ? 'Enviando...' : 'Sending...'}</span>
                                    </>
                                ) : (
                                    <span>{selectedLang === 'es' ? 'Recuperar contraseña' : 'Recover password'}</span>
                                )}
                            </button>

                            <div className="mca-otp-links">
                                <a 
                                    href="#" 
                                    className="mca-forgot-link" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setRecoveryStep('login');
                                        setError(null);
                                    }}
                                >
                                    {selectedLang === 'es' ? 'Volver al inicio de sesión' : 'Back to login'}
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Modal overlay for Código Enviado */}
                {showSentModal && renderSentModal()}
                {renderLoadingOverlay()}
            </div>
        );
    };

    const renderVerifyRecoveryOtpUI = () => {
        return (
            <div className="mca-login-container">
                {/* Header */}
                <header className="mca-header">
                    <button 
                        type="button" 
                        className="mca-back-btn" 
                        onClick={() => {
                            setRecoveryStep('request');
                            setRecoveryOtp('');
                            setError(null);
                        }}
                        disabled={isLoading}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="mca-header-title">
                        {selectedLang === 'es' ? 'Verificación' : 'Verification'}
                    </h1>
                    <div style={{ width: '32px' }}></div>
                </header>

                {/* Floating Background Icons */}
                <div className="mca-floating-bg">
                    <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                    <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                </div>

                <div className="mca-body">
                    <div className="mca-card mca-recovery-card">
                        <div className="mca-recovery-icon-wrapper">
                            <div className="mca-recovery-icon-circle envelope-circle">
                                <FaEnvelope />
                            </div>
                        </div>

                        <h2 className="mca-welcome-title">
                            {selectedLang === 'es' ? 'Código de verificación' : 'Verification code'}
                        </h2>
                        
                        <p className="mca-welcome-desc">
                            {selectedLang === 'es' 
                                ? 'Ingresa el código de 6 dígitos enviado a tu correo' 
                                : 'Enter the 6-digit code sent to your email'}
                            <br />
                            <span className="mca-recovery-email-highlight">{recoveryEmail}</span>
                        </p>

                        <Form onSubmit={handleVerifyRecoveryOtp} className="mca-form">
                            <div className="mca-input-group">
                                <div className="mca-input-field-wrapper">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        className="mca-input-control otp-input-field"
                                        placeholder="000000"
                                        value={recoveryOtp}
                                        onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mca-btn-cyan"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>{selectedLang === 'es' ? 'Verificando...' : 'Verifying...'}</span>
                                    </>
                                ) : (
                                    <span>{selectedLang === 'es' ? 'Continuar' : 'Continue'}</span>
                                )}
                            </button>

                            <div className="mca-otp-links">
                                <a href="#" className="mca-forgot-link" onClick={handleResendRecoveryOtp}>
                                    {selectedLang === 'es' ? 'Reenviar código' : 'Resend code'}
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Incorrect code modal */}
                {showErrorModal && (
                    <div className="mca-modal-overlay">
                        <div className="mca-modal-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="mca-modal-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FaExclamationTriangle style={{ color: '#F2C94C', fontSize: '2.2rem', flexShrink: 0 }} />
                                <h3 className="mca-modal-title" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#EB5757', margin: 0, fontFamily: 'inherit' }}>
                                    {selectedLang === 'es' ? 'Código incorrecto' : 'Incorrect code'}
                                </h3>
                            </div>
                            <div className="mca-modal-body">
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#4A4A4A', lineHeight: '1.5', fontWeight: '500', textAlign: 'left', fontFamily: 'inherit' }}>
                                    {selectedLang === 'es' 
                                        ? 'El código de seguridad ingresado no es válido o ha expirado. Por favor, verifica el código e inténtalo de nuevo.' 
                                        : 'The safety code entered is invalid or has expired. Please check the code and try again.'}
                                </p>
                            </div>
                            <div className="mca-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                <button
                                    type="button"
                                    className="mca-modal-btn"
                                    style={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', borderRadius: '50px', padding: '10px 24px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                                    onClick={() => setShowErrorModal(false)}
                                >
                                    {selectedLang === 'es' ? 'Aceptar' : 'Accept'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {renderLoadingOverlay()}
            </div>
        );
    };

    const renderResetPasswordUI = () => {
        const isPasswordValid = newPassword.length >= 6;

        return (
            <div className="mca-login-container">
                {/* Header */}
                <header className="mca-header">
                    <button 
                        type="button" 
                        className="mca-back-btn" 
                        onClick={() => {
                            setRecoveryStep('verify');
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setError(null);
                        }}
                        disabled={isLoading}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="mca-header-title">
                        {selectedLang === 'es' ? 'Nueva contraseña' : 'New password'}
                    </h1>
                    <div style={{ width: '32px' }}></div>
                </header>

                {/* Floating Background Icons */}
                <div className="mca-floating-bg">
                    <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                    <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                </div>

                <div className="mca-body">
                    <div className="mca-card mca-recovery-card">
                        <div className="mca-recovery-icon-wrapper">
                            <div className="mca-recovery-icon-circle lock-circle">
                                <FaLock />
                            </div>
                        </div>

                        <h2 className="mca-welcome-title">
                            {selectedLang === 'es' ? 'Crear nueva contraseña' : 'Create new password'}
                        </h2>
                        
                        <p className="mca-welcome-desc">
                            {selectedLang === 'es' 
                                ? 'Crea una contraseña segura para proteger tu cuenta.' 
                                : 'Create a secure password to protect your account.'}
                        </p>

                        <Form onSubmit={handleResetPassword} className="mca-form">
                            {/* Nueva Contraseña */}
                            <div className="mca-input-group">
                                <label className="mca-input-label">
                                    {selectedLang === 'es' ? 'Nueva contraseña' : 'New password'}
                                </label>
                                <div className="mca-input-field-wrapper">
                                    <FaLock className="mca-input-icon-left" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        className="mca-input-control"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="mca-password-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="mca-input-group">
                                <label className="mca-input-label">
                                    {selectedLang === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                                </label>
                                <div className="mca-input-field-wrapper">
                                    <FaLock className="mca-input-icon-left" />
                                    <input
                                        type={showConfirmNewPassword ? 'text' : 'password'}
                                        className="mca-input-control"
                                        placeholder="••••••••"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="mca-password-toggle"
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    >
                                        {showConfirmNewPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {/* Checklist de Criterios */}
                            <div className="mca-password-criteria-box">
                                <p className="mca-criteria-title">
                                    {selectedLang === 'es' ? 'La contraseña debe contener:' : 'The password must contain:'}
                                </p>
                                <div className={`mca-criteria-item ${isPasswordValid ? 'valid' : 'invalid'}`}>
                                    {isPasswordValid ? (
                                        <FaCheckCircle className="criteria-icon valid-icon" />
                                    ) : (
                                        <span className="criteria-circle-bullet">○</span>
                                    )}
                                    <span className="criteria-text">
                                        {selectedLang === 'es' ? 'Al menos 6 caracteres' : 'At least 6 characters'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mca-btn-purple"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>{selectedLang === 'es' ? 'Restableciendo...' : 'Resetting...'}</span>
                                    </>
                                ) : (
                                    <span>{selectedLang === 'es' ? 'Restablecer Contraseña' : 'Reset Password'}</span>
                                )}
                            </button>
                        </Form>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && renderSuccessModal()}
                {renderLoadingOverlay()}
            </div>
        );
    };

    const renderConasamaUI = () => {
        // Si ya está autenticado
        if (auth && !auth.detail) {
            const isPatient = !auth.is_superuser && !auth.is_staff;
            if (isPatient) {
                // Redirigir pacientes directamente
                return <Navigate to="/paciente/inicio" replace />;
            }

            const userName = auth.me?.first_name 
                ? `${auth.me.first_name} ${auth.me.last_name || ''}`.trim()
                : auth.me?.username || auth.me?.email || 'Usuario';
            
            const userRole = auth.is_superuser ? 'Super Administrador' : 'Gestor / Administrador';
            
            const handleGoToDashboard = () => {
                if (auth.is_superuser) {
                    navigate('/admin/super-gestor/conasama');
                } else {
                    navigate('/admin/gestor/conasama');
                }
            };

            return (
                <div className="mca-login-container">
                    {/* Header */}
                    <header className="mca-header">
                        <button type="button" className="mca-back-btn" onClick={onBack}>
                            <FaArrowLeft />
                        </button>
                        <h1 className="mca-header-title">Mente Conecta</h1>
                        <div style={{ width: '32px' }}></div>
                    </header>

                    {/* Floating Background Icons */}
                    <div className="mca-floating-bg">
                        <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                        <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                        <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                        <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                    </div>

                    <div className="mca-body">
                        <div className="mca-card mca-success-card">
                            <img src={logoMCA} alt="Mente Conecta Adicciones" className="mca-logo" />
                            
                            <div className="mca-success-avatar">
                                <FaUser />
                            </div>

                            <h2 className="mca-success-title">
                                {selectedLang === 'es' ? '¡Ya iniciaste sesión!' : 'Already logged in!'}
                            </h2>
                            
                            <p style={{ margin: 0, fontWeight: 600 }}>
                                {selectedLang === 'es' 
                                    ? 'Actualmente tienes una sesión activa en la plataforma.'
                                    : 'You currently have an active session on the platform.'}
                            </p>

                            <div className="mca-success-info">
                                <div className="mca-info-item">
                                    <span className="mca-info-label">
                                        {selectedLang === 'es' ? 'Usuario: ' : 'User: '}
                                    </span>
                                    <span className="mca-info-val">{userName}</span>
                                </div>
                                <div className="mca-info-item">
                                    <span className="mca-info-label">
                                        {selectedLang === 'es' ? 'Rol: ' : 'Role: '}
                                    </span>
                                    <span className="mca-info-val">{userRole}</span>
                                </div>
                            </div>

                            <button 
                                type="button" 
                                className="mca-btn-gradient" 
                                onClick={handleGoToDashboard}
                                style={{ width: '100%' }}
                            >
                                {selectedLang === 'es' ? 'Ir al Panel de Administración' : 'Go to Admin Panel'}
                            </button>

                            <button 
                                type="button" 
                                className="mca-btn-secondary" 
                                onClick={logout}
                            >
                                {selectedLang === 'es' ? 'Cerrar Sesión' : 'Log Out'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Si estamos en algún paso de recuperación
        if (recoveryStep === 'request') {
            return renderRequestRecoveryUI();
        }
        if (recoveryStep === 'verify') {
            return renderVerifyRecoveryOtpUI();
        }
        if (recoveryStep === 'reset') {
            return renderResetPasswordUI();
        }

        // Si showOtpScreen es verdadero, renderizamos la pantalla de OTP
        if (showOtpScreen) {
            return (
                <div className="mca-login-container">
                    {/* Header */}
                    <header className="mca-header">
                        <button 
                            type="button" 
                            className="mca-back-btn" 
                            onClick={() => {
                                setShowOtpScreen(false);
                                setOtpCode("");
                            }}
                            disabled={isLoading}
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="mca-header-title">
                            {selectedLang === 'es' ? 'Verificación' : 'Verification'}
                        </h1>
                        <div style={{ width: '32px' }}></div>
                    </header>

                    {/* Floating Background Icons */}
                    <div className="mca-floating-bg">
                        <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                        <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                        <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                        <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                    </div>

                    <div className="mca-body">
                        <div className="mca-card mca-otp-card">
                            <img src={logoMCA} alt="Mente Conecta Adicciones" className="mca-logo" />
                            <h2 className="mca-welcome-title">
                                {selectedLang === 'es' ? 'Verificación de seguridad' : 'Security verification'}
                            </h2>
                            <p className="mca-welcome-desc">
                                {selectedLang === 'es' 
                                    ? 'Hemos enviado un código de seguridad de 6 dígitos a tu correo registrado.' 
                                    : 'We have sent a 6-digit security code to your registered email.'}
                            </p>



                            <Form onSubmit={handleVerifyOtp} className="mca-form">
                                <div className="mca-input-group">
                                    <label className="mca-input-label">
                                        {selectedLang === 'es' ? 'Código de verificación' : 'Verification code'}
                                    </label>
                                    <div className="mca-input-field-wrapper">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            className="mca-input-control otp-input-field"
                                            placeholder="000000"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mca-btn-gradient"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span>{selectedLang === 'es' ? 'Verificando...' : 'Verifying...'}</span>
                                        </>
                                    ) : (
                                        <span>{selectedLang === 'es' ? 'Verificar' : 'Verify'}</span>
                                    )}
                                </button>

                                <div className="mca-otp-links">
                                    <a href="#" className="mca-forgot-link" onClick={handleResendOtp}>
                                        {selectedLang === 'es' ? 'Reenviar código' : 'Resend code'}
                                    </a>
                                </div>
                            </Form>
                        </div>
                    </div>

                    {/* Custom Error Modal Dialog Popup */}
                    {showErrorModal && (
                        <div className="mca-modal-overlay">
                            <div className="mca-modal-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="mca-modal-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FaExclamationTriangle style={{ color: '#F2C94C', fontSize: '2.2rem', flexShrink: 0 }} />
                                    <h3 className="mca-modal-title" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#EB5757', margin: 0, fontFamily: 'inherit' }}>
                                        {selectedLang === 'es' ? 'Código incorrecto' : 'Incorrect code'}
                                    </h3>
                                </div>
                                <div className="mca-modal-body">
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#4A4A4A', lineHeight: '1.5', fontWeight: '500', textAlign: 'left', fontFamily: 'inherit' }}>
                                        {selectedLang === 'es' 
                                            ? 'El código de seguridad ingresado no es válido o ha expirado. Por favor, verifica el código e inténtalo de nuevo.' 
                                            : 'The safety code entered is invalid or has expired. Please check the code and try again.'}
                                    </p>
                                </div>
                                <div className="mca-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                    <button
                                        type="button"
                                        className="mca-modal-btn"
                                        style={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', borderRadius: '50px', padding: '10px 24px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                                        onClick={() => setShowErrorModal(false)}
                                    >
                                        {selectedLang === 'es' ? 'Aceptar' : 'Accept'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Si NO está autenticado y no está en pantalla OTP, mostrar el formulario estilizado responsivo
        return (
            <div className="mca-login-container">
                {/* Header */}
                <header className="mca-header">
                    <button type="button" className="mca-back-btn" onClick={onBack}>
                        <FaArrowLeft />
                    </button>
                    <h1 className="mca-header-title">
                        {selectedLang === 'es' ? 'Iniciar sesión' : 'Log in'}
                    </h1>
                    
                    <div 
                        className="mca-lang-container" 
                        onClick={() => setLangMenuOpen(!langMenuOpen)}
                    >
                        <span className="mca-lang-text">
                            {selectedLang === 'es' ? '🇲🇽' : '🇺🇸'}
                        </span>
                        <FaGlobe style={{ fontSize: '1.2rem', color: '#1A365D' }} />
                        
                        {langMenuOpen && (
                            <div className="mca-lang-dropdown">
                                <button 
                                    type="button" 
                                    className="mca-lang-option"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLang('es');
                                        setLangMenuOpen(false);
                                    }}
                                >
                                    🇲🇽 Español
                                </button>
                                <button 
                                    type="button" 
                                    className="mca-lang-option"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLang('en');
                                        setLangMenuOpen(false);
                                    }}
                                >
                                    🇺🇸 English
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Floating Background Icons */}
                <div className="mca-floating-bg">
                    <FaHeart className="mca-floating-icon mca-floating-heart-left" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-right" />
                    <FaHeart className="mca-floating-icon mca-floating-heart-bottom" />
                    <GiBrain className="mca-floating-icon mca-floating-brain-bottom" />
                </div>

                <div className="mca-body">
                    {/* Tarjeta 1: Bienvenido */}
                    <div className="mca-card mca-welcome-card">
                        <img src={logoMCA} alt="Mente Conecta Adicciones" className="mca-logo" />
                        <h2 className="mca-welcome-title">
                            {selectedLang === 'es' ? '¡Bienvenido/a!' : 'Welcome!'}
                        </h2>
                        <p className="mca-welcome-desc">
                            {selectedLang === 'es' 
                                ? 'Ingresa tu correo electronico y contraseña para continuar.' 
                                : 'Enter your email and password to continue.'}
                        </p>
                    </div>

                    {/* Tarjeta 2: Formulario */}
                    <div className="mca-card">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: '20px' }}>
                                <strong>Error:</strong> {error}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setError(null)}
                                ></button>
                            </div>
                        )}

                        <Form onSubmit={formik.handleSubmit} className="mca-form">
                            {/* Input Usuario */}
                            <div className="mca-input-group">
                                <label className="mca-input-label">
                                    {selectedLang === 'es' ? 'Usuario' : 'Username / Email'}
                                </label>
                                <div className="mca-input-field-wrapper">
                                    <FaUser className="mca-input-icon-left" />
                                    <input
                                        type="text"
                                        name="username"
                                        className={`mca-input-control ${formik.touched.username && formik.errors.username ? 'has-error' : ''}`}
                                        placeholder={selectedLang === 'es' ? 'Usuario' : 'Username'}
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {formik.touched.username && formik.errors.username && (
                                    <div className="mca-error-msg">{formik.errors.username}</div>
                                )}
                            </div>

                            {/* Input Contraseña */}
                            <div className="mca-input-group">
                                <label className="mca-input-label">
                                    {selectedLang === 'es' ? 'Contraseña' : 'Password'}
                                </label>
                                <div className="mca-input-field-wrapper">
                                    <FaLock className="mca-input-icon-left" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className={`mca-input-control ${formik.touched.password && formik.errors.password ? 'has-error' : ''}`}
                                        placeholder={selectedLang === 'es' ? 'Contraseña' : 'Password'}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="mca-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="mca-error-msg">{formik.errors.password}</div>
                                )}
                            </div>

                            {/* Opciones extras */}
                            <div className="mca-options-row">
                                <label className="mca-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="mca-checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>{selectedLang === 'es' ? 'Recuérdame' : 'Remember me'}</span>
                                </label>
                                <a href="#" className="mca-forgot-link" onClick={(e) => {
                                    e.preventDefault();
                                    setRecoveryEmail('');
                                    setRecoveryOtp('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                    setError(null);
                                    setRecoveryStep('request');
                                }}>
                                    {selectedLang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                                </a>
                            </div>

                            {/* Botón de Enviar */}
                            <button
                                type="submit"
                                className="mca-btn-gradient"
                                disabled={isLoading}
                            >
                                <span>{selectedLang === 'es' ? 'Iniciar Sesión' : 'Log In'}</span>
                            </button>
                        </Form>
                    </div>
                </div>
                {renderLoadingOverlay()}
            </div>
        );
    };

    if (typeLogin === 3) {
        return renderConasamaUI();
    }

    return (
        <div className="login-bg">
            <div className="login-wrapper">

             {/* HEADER */}
            <div className="login-header">
                <h2>{t('formLogin.headerTitle')}</h2>
                <p>{t('formLogin.headerSubtitle')}</p>

                <div className="logo-circle">
                <img src={Icono_home} alt="logo" />
                </div>
            </div>

            {/* FORM CARD */}
            <div className="login-card">
                
                {/* Mostrar error persistente si existe */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>{t('formLogin.errorTitle')}:</strong> {error}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                )}

                <Form onSubmit={formik.handleSubmit}>

                <InputForm
                    label={typeLogin === 2 ? t('formLogin.labelEmail') : t('formLogin.labelUsername')}
                    labelDirection="left"
                    nameInput={typeLogin === 2 ? "email" : "username"}
                    placeHolderInput={typeLogin === 2 ? t('formLogin.placeholderEmail') : t('formLogin.placeholderUsername')}
                    valueInput={typeLogin === 2 ? formik.values.email : formik.values.username}
                    onChangeInput={formik.handleChange}
                    type="text"
                    error={typeLogin === 2 ? formik.errors.email : formik.errors.username}
                    touched={typeLogin === 2 ? formik.touched.email : formik.touched.username}
                    disabled={isLoading}
                />

                <InputForm
                    label={t('formLogin.labelPassword')}
                    labelDirection="left"
                    nameInput="password"
                    placeHolderInput={t('formLogin.placeholderPassword')}
                    valueInput={formik.values.password}
                    onChangeInput={formik.handleChange}
                    type="password"
                    error={formik.errors.password}
                    touched={formik.touched.password}
                    disabled={isLoading}
                />

                 {/* Botón Iniciar Sesión con Spinner */}
                <Button 
                    type="submit" 
                    className="login-btn"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            {t('formLogin.loginLoading')}
                        </>
                    ) : (
                        t('formLogin.loginButton')
                    )}
                    Iniciar Sesión
                </Button>

                {/* Botón Regresar */}
                <Button
                    type="button"
                    className="login-btn login-btn-secondary"
                    onClick={onBack}
                    disabled={isLoading}
                >
                    {t('formLogin.goBack')}
                </Button>

                </Form>
            </div>

             {/* FOOTER */}
            <div className="login-footer">
                {t('formLogin.footerPrivacy')}
            </div>

            </div>
            {renderLoadingOverlay()}
        </div>
    )
}

function initialValues(typeLogin) {
    if (typeLogin === 2) {
        return {
            email: "",
            password: "",
        };
    }
    return {
        username: "",
        password: "",
    };
}

function newSchema(typeLogin, t) {
    if (typeLogin === 2) {
        return {
            email: Yup
                .string(t('formLogin.validation.emailInvalid'))
                .email(t('formLogin.validation.emailInvalid'))
                .required(t('formLogin.validation.emailRequired')),
            password: Yup
                .string(t('formLogin.validation.passwordRequired'))
                .required(t('formLogin.validation.passwordRequired')),
        };
    }
    return {
        username: Yup
            .string(t('formLogin.validation.usernameRequired'))
            .required(t('formLogin.validation.usernameRequired')),
        password: Yup
            .string(t('formLogin.validation.passwordRequired'))
            .required(t('formLogin.validation.passwordRequired')),
    };
}
