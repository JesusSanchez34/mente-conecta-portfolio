import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.scss';

import logoImg from '../../../../../../assets/img/Icono_home.jpeg';

// IMPORTA useAuth
import { useAuth } from '../../../../../../hooks';

export function Sidebar({ isOpen, onClose }) {

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const handleLogout = () => {
        logout();

        onClose();
        navigate('/login-fase1');
    };

    return (
        <>
            {/* MENÚ LATERAL DESPLEGABLE */}
            <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
                
                <div className="sidebar-header">
                    <img
                        src={logoImg}
                        alt="Logo Mente Conecta"
                        className="sidebar-logo"
                    />

                    <span className="sidebar-title">
                        {t('sidebar.brandName', { defaultValue: 'Mente conecta' })}
                    </span>

                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <hr className="sidebar-divider" />

                <nav className="sidebar-nav">

                    {/* SELECCIONAR OTRA PERSONA */}
                    <button
                        className="sidebar-link active"
                        onClick={() => navigate('/seleccion-usuario')}
                    >
                        <span className="icon">👤</span>
                        {t('sidebar.selectAnother')}
                    </button>

                    {/* DATOS GENERALES */}
                    <button
                        className="sidebar-link"
                        onClick={() => navigate('/personal/datos-generales', { state: { from: location.pathname } })}
                    >
                        <span className="icon">📋</span>
                        {t('sidebar.dataGeneral')}
                    </button>

                    {/* VER REPORTE */}
                    <button
                        className="sidebar-link"
                        onClick={() => navigate('/personal/reporte', { state: { from: location.pathname } })}
                    >
                        <span className="icon">📄</span>
                        {t('sidebar.viewReport')}
                    </button>

                    {/* VER REPORTE NOM-035 */}
                    <button
                        className="sidebar-link"
                        onClick={() => navigate('/personal/reporte-nom035', { state: { from: location.pathname } })}
                    >
                        <span className="icon">📄</span>
                        {t('sidebar.viewReportNom035', { defaultValue: 'Ver Reporte NOM-035' })}
                    </button>


                    {/* CERRAR SESIÓN */}
                    <button
                        className="sidebar-link logout"
                        onClick={handleLogout}
                    >
                        <span className="icon">↪</span>
                        {t('sidebar.logout')}
                    </button>

                </nav>
            </div>

            {/* FONDO OSCURO */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
}