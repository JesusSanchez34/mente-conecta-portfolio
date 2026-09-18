import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import imagenPersonal from '../../../assets/img/personalS.png';
import './QuienLoRealiza.css';

export function QuienLoRealiza() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const seleccionarRol = (idParentesco) => {
        sessionStorage.setItem('idParentesco', idParentesco);

        navigate('/seguridad/bienvenida');
    };

    return (
        <div className="quien-realiza-container">
            <div className="quien-realiza-card">
                <h1 className="quien-realiza-title">{t('safety_welcome.who_title', '¿QUIÉN LO REALIZARÁ?')}</h1>
                <p className="quien-realiza-subtitle">
                    {t('safety_welcome.who_subtitle', 'Selecciona tu perfil de acceso para continuar con la valoración.')}
                </p>

                <div className="options-grid">
                    {/* Botón Personal */}
                    <div
                        className="option-item option-personal"
                        onClick={() => seleccionarRol(0)}
                    >
                        <div className="icon-wrapper image-avatar-wrapper">
                            <img
                                src={imagenPersonal}
                                alt={t('safety_welcome.avatar_alt', 'Personal de seguridad')}
                                className="avatar-image"
                            />
                        </div>
                        <br />
                        <div className="option-info">
                            <h3>{t('safety_welcome.profile_personal', 'Personal')}</h3>
                            <p>
                                {t('safety_welcome.profile_personal_desc', 'Realizo la valoración para mí mismo de forma privada.')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
