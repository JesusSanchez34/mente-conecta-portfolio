import React from 'react';
import './AlertaModal.css';
import logoColor from '../../assets/img/logoColor.png';
import { useSettings } from '../../context/SettingsContext';

export function AlertaGenericaModal({ isOpen, title, description, onConfirm, confirmText = "Ok" }) {
    if (!isOpen) return null;

    return (
        <div className="alerta-modal-overlay">
            <div className="alerta-modal-container generica">
                <div className="alerta-modal-header">
                    <img src={logoColor} alt="Logo" className="alerta-modal-logo" />
                </div>
                <div className="alerta-modal-content">
                    <h2 className="alerta-modal-title">{title}</h2>
                    <p className="alerta-modal-desc">{description}</p>
                </div>
                <div className="alerta-modal-footer">
                    <button className="alerta-btn-primary" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AlertaAvisoMedicoModal({ isOpen, title, description, onConfirm, onCancel }) {
    const { t } = useSettings();
    if (!isOpen) return null;

    const avisoTitle = title ?? t('avisoImportanteTitulo');
    const avisoText = description || t('avisoMedicoDesc');

    return (
        <div className="alerta-modal-overlay">
            <div className="alerta-modal-container aviso-medico">
                <div className="alerta-modal-header">
                    <img src={logoColor} alt="Logo" className="alerta-modal-logo" />
                </div>
                <div className="alerta-modal-content">
                    <h2 className="alerta-modal-title">{avisoTitle}</h2>
                    <p className="alerta-modal-desc">{avisoText}</p>
                </div>
                <div className="alerta-modal-footer dual">
                    <button className="alerta-btn-secondary" onClick={onCancel}>
                        {t('regresar')}
                    </button>
                    <button className="alerta-btn-primary" onClick={onConfirm}>
                        {t('aceptar')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AlertaConfirmacionModal({ isOpen, title, description, onCancel, onConfirm, cancelText, confirmText }) {
    const { t } = useSettings();
    if (!isOpen) return null;

    const resolvedCancelText = cancelText ?? t('cancelar');
    const resolvedConfirmText = confirmText ?? t('salir');

    return (
        <div className="alerta-modal-overlay">
            <div className="alerta-modal-container aviso-medico">
                <div className="alerta-modal-header">
                    <img src={logoColor} alt="Logo" className="alerta-modal-logo" />
                </div>
                <div className="alerta-modal-content">
                    <h2 className="alerta-modal-title">{title}</h2>
                    <p className="alerta-modal-desc">{description}</p>
                </div>
                <div className="alerta-modal-footer dual">
                    <button className="alerta-btn-secondary" onClick={onCancel}>
                        {resolvedCancelText}
                    </button>
                    <button className="alerta-btn-primary" onClick={onConfirm}>
                        {resolvedConfirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
