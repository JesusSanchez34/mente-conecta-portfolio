import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../../ui';
import { validateResetTokenNeuroXpand, requestPasswordResetNeuroXpand } from '../../../../api/user';
import { LoaderNX, ResendTimerButtonNX } from '../../../adminNX';
import './AuthFormsnx.css';

export function VerificarCodigonx() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const email = location.state?.email || '';

    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Falta información del correo. Regresando...");
            navigate('/recuperar-password-neuroXpand');
        }
    }, [email, navigate]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Avanzar al siguiente recuadro
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (!pastedData) return;

        const newCode = [...code];
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);
        const nextFocusIndex = pastedData.length < 6 ? pastedData.length : 5;
        if (inputRefs.current[nextFocusIndex]) {
            inputRefs.current[nextFocusIndex].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                inputRefs.current[index - 1].focus();
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = code.join('');
        if (token.length < 6) {
            toast.error('Por favor ingresa el código completo de 6 dígitos.');
            return;
        }
        setIsVerifying(true);

        try {
            await validateResetTokenNeuroXpand(token);
            toast.success("Código verificado correctamente.");
            setTimeout(() => {
                navigate('/establecer-password-neuroXpand', { state: { email, token } });
            }, 1000);
        } catch (error) {
            toast.error(error.message || "Código inválido o expirado");
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await requestPasswordResetNeuroXpand(email);
            toast.success(`Se ha reenviado un nuevo código a: ${email}`);
            setCode(new Array(6).fill(''));
            if (inputRefs.current[0]) inputRefs.current[0].focus();
        } catch (error) {
            toast.error(error.message || "Error al reenviar el código");
            throw error;
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="nx-auth-form-container">
            <LoaderNX
                isOpen={isVerifying || isResending}
                title={isResending ? "Reenviando código..." : "Verificando código..."}
                message={isResending ? "Enviando un nuevo correo" : "Validando información en el sistema"}
            />

            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}>
                <LanguageSelector lightBg={true} />
            </div>

            <div className="nx-auth-form-header">
                <button type="button" className="nx-auth-back-btn" onClick={() => navigate(-1)} aria-label="Regresar">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="nx-auth-form-title">Verificación de código</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={handleSubmit} className="nx-auth-form-content">
                <p className="nx-auth-form-description">
                    Introduzca el código de verificación enviado a {email}
                </p>

                <div className="nx-auth-input-wrapper code-inputs" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    {code.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            ref={el => inputRefs.current[index] = el}
                            className="nx-auth-input code-input"
                            style={{ width: '40px', textAlign: 'center', fontSize: '20px', padding: '10px', borderBottom: '2px solid #ccc', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', background: 'transparent' }}
                            required
                            disabled={isVerifying || isResending}
                        />
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
                    <button
                        type="submit"
                        className="nx-auth-purple-btn"
                        disabled={isVerifying || isResending}
                        style={{ opacity: (isVerifying || isResending) ? 0.7 : 1 }}
                    >
                        Verificar
                    </button>
                    <ResendTimerButtonNX
                        onResend={handleResendCode}
                        isResending={isResending}
                        initialSeconds={300}
                    />
                </div>
            </form>
        </div>
    );
}