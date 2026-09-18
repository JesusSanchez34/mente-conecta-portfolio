import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../ui';
import { setNewPassword } from '../../../api/user';
import './AuthForms.css';

export function EstablecerPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const email = location.state?.email || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!email) {
            toast.error("Falta información del correo. Regresando...");
            navigate('/recuperar-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        try {
            await setNewPassword(email, password);
            toast.success("Contraseña actualizada exitosamente.");
            setTimeout(() => {
                // Return to login
                navigate('/login-fase1'); // or wherever the login is
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Error al restablecer la contraseña");
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
                <h1 className="auth-form-title">Nueva contraseña</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-content">
                <p className="auth-form-description">
                    Establece tu nueva contraseña para {email}
                </p>

                <div className="auth-input-wrapper">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-input-wrapper" style={{ marginTop: '15px' }}>
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-submit-btn" style={{ marginTop: '30px' }}>
                    Guardar contraseña
                </button>
            </form>
        </div>
    );
}
