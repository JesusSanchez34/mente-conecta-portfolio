import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Bienvenida.css';

// TODO: Solo cambia el nombre 'personalS.png' por el nombre de tus imágenes descargadas.
import imgSocio from '../../../assets/img/familiar.jpg';
import imgMental from '../../../assets/img/saludmental.jpg'
import imgFisica from '../../../assets/img/saludfisica.jpg';
import imgDeterminantes from '../../../assets/img/determiantessociales.jpg';
import imgNom035 from '../../../assets/img/NOM035.jpg';

export function Bienvenida() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="bienvenida-layout">
            {/* Contenedor de Tarjetas */}
            <main className="bienvenida-cards-container">
                <div
                    className="bienvenida-card card-socio"
                    style={{ backgroundImage: `url(${imgSocio})` }}
                    onClick={() => navigate('/seguridad/evaluacion-socio')}
                >
                    <div className="card-overlay">
                        <h2>{t('safety_welcome.card_sociodemographic', 'Sociodemográfica')}</h2>
                    </div>
                </div>

                <div
                    className="bienvenida-card card-mental"
                    style={{ backgroundImage: `url(${imgMental})` }}
                    onClick={() => navigate('/seguridad/evaluacion-mental')}
                >
                    <div className="card-overlay">
                        <h2>{t('safety_welcome.card_mental_health', 'Salud Mental')}</h2>
                    </div>
                </div>

                <div
                    className="bienvenida-card card-fisica"
                    style={{ backgroundImage: `url(${imgFisica})` }}
                    onClick={() => navigate('/seguridad/evaluacion-fisica')}
                >
                    <div className="card-overlay">
                        <h2>{t('safety_welcome.card_physical_health', 'Salud Fisica')}</h2>
                    </div>
                </div>

                <div
                    className="bienvenida-card card-determinantes"
                    style={{ backgroundImage: `url(${imgDeterminantes})` }}
                    onClick={() =>
                        navigate('/seguridad/evaluacion-determinantes')
                    }
                >
                    <div className="card-overlay">
                        <h2>{t('safety_welcome.card_social_determinants', 'Determinantes Sociales')}</h2>
                    </div>
                </div>

                <div
                    className="bienvenida-card card-nom035"
                    style={{ backgroundImage: `url(${imgNom035})` }}
                    onClick={() => navigate('/seguridad/evaluacion-nom035')}
                >
                    <div className="card-overlay">
                        <h2>{t('safety_welcome.card_nom035', 'NOM 035')}</h2>
                    </div>
                </div>
            </main>
        </div>
    );
}
