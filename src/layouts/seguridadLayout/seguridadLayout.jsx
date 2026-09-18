import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from '../../components/ui';
import { FaFilePdf } from 'react-icons/fa';
import { generarPDFResultadosApi } from '../../api/pdf';
import { toast } from 'react-toastify';
import './seguridadLayout.css';

export function SeguridadLayout(props) {
    const { children } = props;
    const { auth, logout, } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);

    // 1. Estatus de carga de credenciales
    if (auth === undefined) return null;

    // 2. Si no tiene sesión iniciada o no es de Seguridad Pública (typeLogin 6)
    if (!auth || Number(auth.typeLogin) !== 7) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/seguridad');
    };

    const handlePerson = () => {
        navigate('/seguridad/inicio');
    };

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        const toastId = toast.loading(t('safety_layout.generating_pdf', 'Generando reporte PDF...'));
        try {
            const currentLang = (i18n.language || 'es').split('-')[0].toLowerCase();
            await generarPDFResultadosApi(auth.token, auth.me.id, currentLang);
            toast.update(toastId, {
                render: t('safety_layout.pdf_success', '¡Reporte PDF generado con éxito!'),
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: t('safety_layout.pdf_error', {
                    error: error.message || error,
                    defaultValue: 'Error al generar PDF: {{error}}'
                }),
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="seguridad-layout">
            <header className="seguridad-header">
                <div className="header-container">
                    <div className="logo-section">
                        <span className="logo-text">
                            {t('safety_layout.header_title', 'Mente Conecta - Seguridad Pública')}
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center">
                        <button className="logout-btn" onClick={handlePerson}>
                            {t('safety_layout.select_person_btn', 'Seleccionar otra persona')}
                        </button>
                        <button
                            className="download-pdf-btn"
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            title={t('safety_layout.download_pdf_tooltip', 'Descargar reporte de cuestionarios en PDF')}
                        >
                            <FaFilePdf className="pdf-icon" />
                            <span>{isDownloading ? t('safety_layout.generating', 'Generando...') : t('safety_layout.download_pdf', 'Reporte PDF')}</span>
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            {t('safety_layout.logout_btn', 'Cerrar Sesión')}
                        </button>
                        <LanguageSelector variant="layout" />
                    </div>
                </div>
            </header>

            <main className="seguridad-content">{children}</main>

            <footer className="seguridad-footer">
                🔒 {t('safety_layout.footer_text', 'Tus respuestas son totalmente confidenciales y anónimas.')}
            </footer>
        </div>
    );
}
