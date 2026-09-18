import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { validarCodigoRecuperacion } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import './ValidarCodigo.css';
import './ForgotPassword.css'; // Para reusar fondo y botones

export function ValidarCodigo() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);

    // Prevenir el uso del botón "Atrás" del navegador
    useEffect(() => {
        window.history.pushState(null, null, window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, null, window.location.href);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return; // Solo números

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus al siguiente input
        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Regresar al input anterior al presionar borrar si está vacío
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const codigo = otp.join("");
        
        if (codigo.length < 6) {
            toast.warning(t('ingresa6Digitos'), { theme: 'colored' });
            return;
        }

        const email = sessionStorage.getItem('recoveryEmail') || "";

        try {
            setIsLoading(true);
            await validarCodigoRecuperacion(codigo);
            // Éxito: sin alertas, redirige silenciosamente
            navigate('/nueva-contrasena');
        } catch (error) {
            console.error(error);
            toast.warning(t('codigoIncorrecto'), { theme: 'colored' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-pwd-bg">
            <div className="validar-codigo-header">
                <h1>{t('recuperarContrasenaTitulo')}</h1>
            </div>

            <div className="validar-codigo-content">
                <p className="forgot-pwd-text">{t('ingresaCodigo')}</p>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="validar-codigo-otp-container">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="validar-codigo-input"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    ref={el => inputRefs.current[index] = el}
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                            );
                        })}
                    </div>

                    <button 
                        type="submit" 
                        className="forgot-pwd-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner animation="border" size="sm" /> : t('continuar')}
                    </button>
                </form>
            </div>
        </div>
    );
}
