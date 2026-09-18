import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useSettings } from '../../../context/SettingsContext';
import './SemaforoDeterioroScreen.css';

function getRisk(score) {
    if (score <= 14) return { color: '#48bb78', label: 'Bajo', msgKey: 'semCognicionNormal', light: 'bottom' };
    if (score <= 24) return { color: '#ecc94b', label: 'Medio', msgKey: 'semDeterioroCognitivo', light: 'middle' };
    return { color: '#e53e3e', label: 'Alto', msgKey: 'semProbableDemencia', light: 'top' };
}

export function SemaforoDeterioroScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useSettings();
    const puntuacion = location.state?.puntuacion ?? 0;
    const risk = getRisk(puntuacion);

    return (
        <div className="sem-bg">
            <h2 className="sem-header-title">{t('semRiesgo')}: {risk.label}</h2>

            <div className="sem-content">
                <div className="sem-light-box">
                    <div className={`sem-light-circle ${risk.light === 'top' ? 'red-on' : 'off'}`} />
                    <div className={`sem-light-circle ${risk.light === 'middle' ? 'yellow-on' : 'off'}`} />
                    <div className={`sem-light-circle ${risk.light === 'bottom' ? 'green-on' : 'off'}`} />
                </div>

                <div className="sem-diag-card">
                    <FiCheckCircle className="sem-diag-icon" />
                    <span className="sem-diag-text">{t('semPreDiagnostico')}: {t(risk.msgKey)}</span>
                </div>

                <button className="sem-btn-aceptar" onClick={() => navigate('/genotipo')}>
                    {t('aceptar')}
                </button>
            </div>
        </div>
    );
}
