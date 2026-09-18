import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../ui';
import { validateResetToken } from '../../../api/user';
import './AuthForms.css';

export function VerificarCodigo() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const email = location.state?.email || '';

    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            toast.error("Falta información del correo. Regresando...");
            navigate('/recuperar-password');
        }
    }, [email, navigate]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return; // solo números

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Avanzar al siguiente recuadro
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

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

        try {
            await validateResetToken(token);
            toast.success("Código verificado correctamente.");
            setTimeout(() => {
                navigate('/establecer-password', { state: { email, token } });
            }, 1000);
        } catch (error) {
            toast.error(error.message || "Código inválido o expirado");
        }
    };

    return (
        <div className="auth-form-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}>
                <LanguageSelector lightBg={true} />
            </div>

            <div className="auth-form-header">
                <button type="button" className="auth-back-btn" onClick={() => navigate(-1)} aria-label="Regresar">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="auth-form-title">Verificación de código</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-content">
                <p className="auth-form-description">
                    Introduzca el código de verificación enviado a {email}
                </p>

                <div className="auth-input-wrapper code-inputs" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    {code.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={el => inputRefs.current[index] = el}
                            className="auth-input code-input"
                            style={{ width: '40px', textAlign: 'center', fontSize: '20px', padding: '10px', borderBottom: '2px solid #ccc', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0' }}
                            required
                        />
                    ))}
                </div>

                <button type="submit" className="auth-submit-btn">
                    Verificar
                </button>
            </form>
        </div>
    );
}
