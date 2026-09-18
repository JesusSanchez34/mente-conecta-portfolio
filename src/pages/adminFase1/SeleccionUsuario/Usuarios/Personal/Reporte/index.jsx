import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PDFViewer } from '@react-pdf/renderer';
import { useAuth } from '../../../../../../hooks';
import { obtenerReporteApi } from '../../../../../../api/fase1/cuestionario';
import { ReportePdfDocument } from './ReportePdf';

import './Reporte.scss';

export function Reporte() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { auth } = useAuth();
    
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fromPath = location.state?.from || (() => {
        const fam = localStorage.getItem('selectedFamiliar');
        if (fam) {
            try {
                const parsed = JSON.parse(fam);
                if (parsed.cuidador_primario === 1 || parsed.cuidador === 1) {
                    return '/cuidador';
                }
            } catch (e) {}
            return '/familiar';
        }
        return '/personal';
    })();

    // The token logic matches other api calls
    const token = auth?.token;
    const selectedUserId = auth?.me?.id;

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedUserId || !token) {
                setLoading(false);
                return;
            }
            try {
                const lang = i18n.language.startsWith('en') ? 'en' : 'es';
                const data = await obtenerReporteApi(token, selectedUserId, lang);
                setReporte(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, selectedUserId, i18n.language]);

    return (
        <div className="reporte-container">
            {/* HEADER */}
            <div className="reporte-header">
                <button
                    className="back-btn"
                    onClick={() => navigate(fromPath)}
                >
                    ←
                </button>
                <h1>{t('sidebar.viewReport', { defaultValue: 'Ver Reporte' })}</h1>
            </div>

            <div className="pdf-viewer-container">
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        {t('general.loading', { defaultValue: 'Cargando reporte...' })}
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" style={{ margin: '2rem', color: '#b71c1c' }}>
                        {error}
                    </div>
                ) : reporte ? (
                    <PDFViewer style={{ width: '100%', height: '80vh', border: 'none' }}>
                        <ReportePdfDocument reporte={reporte} t={t} />
                    </PDFViewer>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        No se pudo cargar el reporte o no hay datos disponibles.
                    </div>
                )}
            </div>
        </div>
    );
}
