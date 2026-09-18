import React from 'react';
import { useNavigate } from 'react-router-dom';
import personalImg from '../../../assets/img/personal.jpg';
import personalSaludImg from '../../../assets/img/personal_de_salud.jpg';
import familiarImg from '../../../assets/img/familiar.jpg';
import { FloatingActionMenu } from '../FloatingActionMenu';
import { useSettings } from '../../../context/SettingsContext';
import './QuienLoRealiza.css';

const CARD_COLORS = ['#26C6DA', '#009688', '#7E57C2'];

export function QuienLoRealiza() {
    const navigate = useNavigate();
    const { t } = useSettings();

    const handlePersonalClick = () => {
        // En una app real, aquí llamarías al Provider o guardarías el dato
        sessionStorage.setItem('parentescoId', '0');
        navigate('/consentimiento');
    };

    const handlePersonalSaludClick = () => {
        sessionStorage.setItem('parentescoId', '1');
        navigate('/asentimiento');
    };

    const handleFamiliarClick = () => {
        sessionStorage.setItem('parentescoId', '2'); // Simulando que requiere catálogo
        navigate('/asentimiento');
    };

    return (
        <div className="qlr-bg">
            <FloatingActionMenu />
            <div className="qlr-wrapper">
                <div className="qlr-title-card">
                    <h1 className="qlr-title">{t('quienRealizara')}</h1>
                </div>

                <div className="qlr-options">
                    <div className="qlr-card" style={{ borderColor: CARD_COLORS[0] }} onClick={handlePersonalClick}>
                        <img src={personalImg} alt="Personal" className="qlr-card-img" />
                        <div className="qlr-card-banner">
                            <span>{t('personal')}</span>
                        </div>
                    </div>

                    <div className="qlr-card" style={{ borderColor: CARD_COLORS[1] }} onClick={handlePersonalSaludClick}>
                        <img src={personalSaludImg} alt="Personal de salud" className="qlr-card-img" />
                        <div className="qlr-card-banner">
                            <span>{t('personalSalud')}</span>
                        </div>
                    </div>

                    <div className="qlr-card" style={{ borderColor: CARD_COLORS[2] }} onClick={handleFamiliarClick}>
                        <img src={familiarImg} alt="Familiar" className="qlr-card-img" />
                        <div className="qlr-card-banner">
                            <span>{t('familiar')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
