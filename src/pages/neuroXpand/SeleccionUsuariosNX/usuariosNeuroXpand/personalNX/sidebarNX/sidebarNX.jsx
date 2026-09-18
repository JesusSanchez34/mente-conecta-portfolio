import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiClipboard, FiFileText, FiLogOut } from 'react-icons/fi';
import './sidebarNX.scss';

import logoImg from '../../../../../../assets/img/Icono_home.jpeg';

import { useAuth } from '../../../../../../hooks';

export function SidebarNX({ isOpen, onClose }) {

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { t } = useTranslation();
    
    const handleLogout = () => {
        logout();
        onClose();
        navigate('/quienlorealiza'); 
    };

    return (
        <>
            <div className={`sidebarNX-menu ${isOpen ? 'open' : ''}`}>
                
                <div className="sidebarNX-header">
                    <img
                        src={logoImg}
                        alt="Logo Mente Conecta"
                        className="sidebarNX-logo"
                    />

                    <span className="sidebarNX-title">
                        {t('sidebar.brandName', { defaultValue: 'Mente conecta' })}
                    </span>

                    <button
                        className="sidebarNX-close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <hr className="sidebarNX-divider" />

                <nav className="sidebarNX-nav">

                    <button
                        className="sidebarNX-link active"
                        onClick={() => navigate('/seleccion-usuarioNX')}
                    >
                        <span className="iconNX"><FiUser /></span>
                        {t('sidebar.selectAnother')}
                    </button>

                    <button
                        className="sidebarNX-link"
                        onClick={() => navigate('/personalNX/datos-generalesNX', { state: { from: location.pathname } })}
                    >
                        <span className="iconNX"><FiClipboard /></span>
                        {t('sidebar.dataGeneral')}
                    </button>

                    <button
                        className="sidebarNX-link"
                        onClick={() => navigate('/personalNX/reporteNX', { state: { from: location.pathname } })}
                    >
                        <span className="iconNX"><FiFileText /></span>
                        {t('sidebar.viewReport')}
                    </button>

                    <button
                        className="sidebarNX-link logout"
                        onClick={handleLogout}
                    >
                        <span className="iconNX"><FiLogOut /></span>
                        {t('sidebar.logout')}
                    </button>

                </nav>
            </div>

            {isOpen && (
                <div
                    className="sidebarNX-overlay"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
}