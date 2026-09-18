import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { ReporteNom035PdfDocument } from './ReporteNom035Pdf';
import { useAuth } from '../../../../../../hooks';
import { useTranslation } from 'react-i18next';
import { obtenerReporteNom035Api } from '../../../../../../api/fase1/cuestionario';
import './ReporteNom035.scss';

export function ReporteNom035() {
    const { auth } = useAuth();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [guiaSeleccionada, setGuiaSeleccionada] = useState(0);

    const fromPath = location.state?.from || '/personal';
    const token = auth?.token;
    const selectedUserId = auth?.me?.id;

    useEffect(() => {
        const fetchNom035Data = async () => {
            if (!selectedUserId || !token) {
                setLoading(false);
                return;
            }
            try {
                // Siempre pedimos 'es' porque el backend local aún no tiene el endpoint 'EN' (ReporteNom035PorUsuarioEN)
                const lang = 'es';
                const response = await obtenerReporteNom035Api(token, selectedUserId, lang);
                setReporte(response);
                setLoading(false);
            } catch (err) {
                console.warn("La API real falló. Cargando datos de prueba para visualizar el diseño del PDF.");
                setTimeout(() => {
                    const mockData = {
                        usuario: auth?.me?.nombres || "Usuario de Prueba",
                        correo: auth?.me?.correo || "prueba@correo.com",
                        numeroEmpleados: "16 a 50 empleados",
                        guias: [
                            {
                                nombre: "Guía de Referencia I",
                                nivelRiesgo: "Requiere Valoración",
                                puntajeTotal: "3 Acontecimientos",
                                respuestas: [
                                    { id_pregunta: 523, texto_pregunta: "¿Accidente que tenga como consecuencia la muerte o lesión grave?", respuesta_texto: "Sí" },
                                    { id_pregunta: 524, texto_pregunta: "¿Asaltos?", respuesta_texto: "No" },
                                    { id_pregunta: 537, texto_pregunta: "¿Ha tenido usted dificultades para dormir?", respuesta_texto: "Sí" }
                                ]
                            },
                            {
                                nombre: "Guía de Referencia II",
                                nivelRiesgo: "Riesgo Medio",
                                puntajeTotal: "65 Puntos",
                                respuestas: [
                                    { id_pregunta: 546, texto_pregunta: "Por la cantidad de trabajo que tengo debo quedarme tiempo adicional a mi turno", respuesta_texto: "Casi siempre (3)" },
                                    { id_pregunta: 556, texto_pregunta: "Trabajo horas extras más de tres veces a la semana", respuesta_texto: "Siempre (4)" }
                                ]
                            }
                        ]
                    };
                    setReporte(mockData);
                    setError("⚠️ Mostrando Datos de Prueba (Mock). El endpoint del Backend aún no está listo o falló.");
                    setLoading(false);
                }, 800);
            }
        };
        fetchNom035Data();
    }, [token, selectedUserId, i18n.language, auth]);

    useEffect(() => {
        setGuiaSeleccionada(0);
    }, [reporte]);

    return (
        <div className="reporte-nom035-container">
            <div className="reporte-nom035-header">
                <button
                    className="back-btn"
                    onClick={() => navigate(fromPath)}
                >
                    ←
                </button>
                <h2>Reporte NOM-035</h2>
            </div>
            
            <div className="reporte-nom035-content">
                {error && <div className="error-message-nom035">{error}</div>}

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Generando reporte oficial...</p>
                    </div>
                ) : reporte?.guias?.length ? (
                    <>
                        {reporte.guias.length > 1 && (
                            <div className="guia-selector-nom035">
                                {reporte.guias.map((guia, i) => (
                                    <button
                                        key={i}
                                        className={`guia-selector-btn ${i === guiaSeleccionada ? 'active' : ''}`}
                                        onClick={() => setGuiaSeleccionada(i)}
                                    >
                                        {guia.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                        <PDFViewer className="pdf-viewer-nom035">
                            <ReporteNom035PdfDocument
                                reporte={{ ...reporte, guias: [reporte.guias[guiaSeleccionada]] }}
                                t={t}
                            />
                        </PDFViewer>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>No se encontraron datos para generar el reporte.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
