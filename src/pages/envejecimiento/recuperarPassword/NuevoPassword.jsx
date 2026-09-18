import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoColor from '../../../assets/img/logoColor.png';
import { establecerNuevaContrasena } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import './NuevoPassword.css';
import './ForgotPassword.css';

export function NuevoPassword() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        window.history.pushState(null, null, window.location.href);
        const handlePopState = () => window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            toast.warning(t('llenarCampos'), { theme: 'colored' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning(t('contrasenasNoCoinciden'), { theme: 'colored' });
            return;
        }
        const email = sessionStorage.getItem('recoveryEmail') || '';
        try {
            setIsLoading(true);
            await establecerNuevaContrasena(email, newPassword);
            setNewPassword('');
            setConfirmPassword('');
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            toast.error(error.message || t('errorActualizarContrasena'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        setShowSuccessModal(false);
        sessionStorage.removeItem('recoveryEmail');
        navigate('/loginmen');
    };

    return (
        <div className="forgot-pwd-bg">
            <div className="nuevo-pwd-header">
                <h1>{t('cambioContrasena')}</h1>
            </div>

            <div className="nuevo-pwd-content">
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <p className="nuevo-pwd-label">{t('nuevaContrasenaLabel')}</p>
                    <div className="nuevo-pwd-input-wrapper">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder={t('nuevaContrasena')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="button" className="nuevo-pwd-eye-btn" onClick={() => setShowNewPassword(!showNewPassword)} tabIndex="-1">
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <p className="nuevo-pwd-label">{t('confirmarContrasenaLabel')}</p>
                    <div className="nuevo-pwd-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={t('confirmarContrasena')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="button" className="nuevo-pwd-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button type="submit" className="forgot-pwd-btn" disabled={isLoading} style={{ marginTop: '10px' }}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : t('actualizar')}
                    </button>
                </form>
            </div>

            {showSuccessModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-card">
                        <img src={logoColor} alt="Mente Conecta" className="custom-modal-logo" />
                        <h2 className="custom-modal-title">{t('contrasenaCambiada')}</h2>
                        <p className="custom-modal-text">{t('contrasenaCambiadaTexto')}</p>
                        <button className="custom-modal-btn" onClick={handleContinue}>{t('entendido')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
