import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import logoColor from '../../../assets/img/logoColor.png';
import { postEmailRecuperacion } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import './ForgotPassword.css';

export function ForgotPassword() {
    const navigate = useNavigate();
    const { t, language } = useSettings();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleBack = () => navigate('/loginmen');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.warning(t('ingresaCorreoMsg'), { theme: 'colored' });
            return;
        }
        try {
            setIsLoading(true);
            await postEmailRecuperacion(trimmedEmail, language);
            sessionStorage.setItem('recoveryEmail', trimmedEmail);
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        setShowSuccessModal(false);
        navigate('/verificar-codigo');
    };

    return (
        <div className="forgot-pwd-bg">
            <div className="forgot-pwd-header">
                <button className="forgot-pwd-back-btn" onClick={handleBack}>
                    <FaArrowLeft />
                </button>
                <h1>{t('olvidasteContrasena')}</h1>
            </div>

            <div className="forgot-pwd-content">
                <p className="forgot-pwd-text">{t('ingresaCorreoRecuperar')}</p>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="forgot-pwd-input-wrapper">
                        <input
                            type="email"
                            className="forgot-pwd-input"
                            placeholder={t('correo')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="forgot-pwd-btn" disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : t('recuperarContrasena')}
                    </button>
                </form>
            </div>

            {showSuccessModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-card">
                        <img src={logoColor} alt="Mente Conecta" className="custom-modal-logo" />
                        <h2 className="custom-modal-title">{t('codigoEnviado')}</h2>
                        <p className="custom-modal-text">{t('mensajeEnviado')}</p>
                        <button className="custom-modal-btn" onClick={handleContinue}>{t('entendido')}</button>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-card">
                        <img src={logoColor} alt="Mente Conecta" className="custom-modal-logo" />
                        <h2 className="custom-modal-title error">Error</h2>
                        <p className="custom-modal-text">{t('errorCorreoNoAsociado')}</p>
                        <button className="custom-modal-btn" onClick={() => setShowErrorModal(false)}>{t('reintentar')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
