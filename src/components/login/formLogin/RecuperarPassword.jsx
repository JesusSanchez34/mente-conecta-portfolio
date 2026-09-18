import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../ui';
import { requestPasswordReset } from '../../../api/user';
import './AuthForms.css';

export function RecuperarPassword() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        try {
            await requestPasswordReset(email);
            toast.success(`Se ha enviado un enlace de recuperación a: ${email}`);
            setTimeout(() => {
                navigate('/verificar-codigo', { state: { email } });
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Error al solicitar recuperación de contraseña");
        }
    };

    return (
        <div className="auth-form-container">
            {/* Floating Language Selector */}
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
                <h1 className="auth-form-title">{t('recovery.title')}</h1>
                {/* Spacer to align title to center */}
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-content">
                <p className="auth-form-description">
                    {t('recovery.description')}
                </p>

                <div className="auth-input-wrapper">
                    <input
                        type="email"
                        className="auth-input"
                        placeholder={t('recovery.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-submit-btn">
                    {t('recovery.submit')}
                </button>
            </form>
        </div>
    );
}
