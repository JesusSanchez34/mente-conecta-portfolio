import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { obtenerReporte } from '../../api/envejecimientoService';
import jsPDF from 'jspdf';
import './ReportePaciente.css';

function loadImageAsDataURL(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = src;
    });
}

const PDF_TEXT = {
    es: {
        title: 'Mente Conecta Resultados',
        datosPersonales: 'Datos Personales',
        nombrePaciente: 'Nombre del Paciente: ',
        correo: 'Correo: ',
        telefono: 'Teléfono: ',
        cuestionario: 'Cuestionario',
        nota: 'Nota',
        interpretacion: 'Interpretación',
        notaImportante: 'Nota Importante: Esta información corresponde únicamente a un prediagnóstico. Te recomendamos consultar a un especialista para una evaluación completa y precisa.',
        confidencial: 'Este documento es confidencial y no sustituye la evaluación de un profesional.',
        fechaEmision: 'Fecha de Emisión:',
        locale: 'es-MX',
    },
    en: {
        title: 'Mente Conecta Results',
        datosPersonales: 'Personal Data',
        nombrePaciente: 'Patient Name: ',
        correo: 'Email: ',
        telefono: 'Phone: ',
        cuestionario: 'Questionnaire',
        nota: 'Score',
        interpretacion: 'Interpretation',
        notaImportante: 'Important Note: This information corresponds only to a pre-diagnosis. We recommend consulting a specialist for a complete and accurate evaluation.',
        confidencial: 'This document is confidential and does not substitute the evaluation of a professional.',
        fechaEmision: 'Issue Date:',
        locale: 'en-US',
    },
};

async function generarPDF(reporte, language) {
    const pdf = PDF_TEXT[language] || PDF_TEXT.es;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210;
    const H = 297;
    const margin = 15;

    let logoData = null;
    try { logoData = await loadImageAsDataURL('/image/mcLogo.jpeg'); } catch {}

    let y = 15;

    // Header title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(pdf.title, margin, y + 8);

    // Logo top right
    if (logoData) {
        doc.addImage(logoData, 'JPEG', W - margin - 38, y - 2, 38, 19);
    }
    y += 22;

    // Line under header
    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.6);
    doc.line(margin, y, W - margin, y);
    y += 10;

    // Datos Personales section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text(pdf.datosPersonales, margin, y);
    y += 4;

    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.4);
    doc.line(margin, y, W - margin, y);
    y += 8;

    // Patient info rows with bold labels
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);

    const infoRows = [
        [pdf.nombrePaciente, reporte.usuario ?? ''],
        [pdf.correo, reporte.correo ?? ''],
        [pdf.telefono, reporte.celular ?? ''],
    ];

    infoRows.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        const lw = doc.getTextWidth(label);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + lw, y);
        y += 7;
    });

    y += 8;

    // Table
    const tableWidth = W - margin * 2;
    const col1W = 72;
    const col2W = 18;
    const col3W = tableWidth - col1W - col2W;
    const colX = [margin, margin + col1W, margin + col1W + col2W];
    const colCX = [
        margin + col1W / 2,
        margin + col1W + col2W / 2,
        margin + col1W + col2W + col3W / 2,
    ];
    const headerH = 9;

    // Table header row — light gray background
    doc.setFillColor(225, 225, 225);
    doc.rect(margin, y, tableWidth, headerH, 'F');
    doc.setDrawColor(170, 170, 170);
    doc.setLineWidth(0.35);
    doc.rect(margin, y, tableWidth, headerH, 'S');
    // Vertical dividers in header
    doc.line(colX[1], y, colX[1], y + headerH);
    doc.line(colX[2], y, colX[2], y + headerH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(pdf.cuestionario, colCX[0], y + 6.2, { align: 'center' });
    doc.text(pdf.nota, colCX[1], y + 6.2, { align: 'center' });
    doc.text(pdf.interpretacion, colCX[2], y + 6.2, { align: 'center' });
    y += headerH;

    // Table body rows — white, no fill, borders + vertical dividers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    (reporte.resultados ?? []).forEach((r) => {
        const cuest = doc.splitTextToSize(r.cuestionario ?? '', col1W - 6);
        const interp = doc.splitTextToSize(r.interpretacion ?? '', col3W - 6);
        const lines = Math.max(cuest.length, interp.length, 1);
        const rowH = lines * 5 + 4;

        // White fill
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, y, tableWidth, rowH, 'F');
        // Row border
        doc.setDrawColor(190, 190, 190);
        doc.setLineWidth(0.25);
        doc.rect(margin, y, tableWidth, rowH, 'S');
        // Vertical dividers
        doc.line(colX[1], y, colX[1], y + rowH);
        doc.line(colX[2], y, colX[2], y + rowH);

        doc.setTextColor(30, 30, 30);
        // Cuestionario — centered in col
        doc.text(cuest, colCX[0], y + 5, { align: 'center' });
        // Nota — centered
        doc.text(String(r.nota ?? ''), colCX[1], y + 5, { align: 'center' });
        // Interpretación — centered
        doc.text(interp, colCX[2], y + 5, { align: 'center' });
        y += rowH;
    });

    y += 12;

    // Red italic note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(210, 35, 35);
    const noteText = pdf.notaImportante;
    const splitNote = doc.splitTextToSize(noteText, W - margin * 2);
    doc.text(splitNote, margin, y);

    // Bottom watermark — mcLogo.jpeg fills blank space between nota and footer
    const footerY = H - 20;
    if (logoData) {
        try {
            const wmAreaTop = y + 6;
            const wmAreaBot = footerY - 8;
            const wmAvailable = wmAreaBot - wmAreaTop;
            if (wmAvailable > 20) {
                // keep aspect ratio roughly square-ish, fill the available height
                const wmH = wmAvailable;
                const wmW = Math.min(wmH * 2.2, tableWidth); // logo is wider than tall
                const wmX = margin + (tableWidth - wmW) / 2;
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.10 }));
                doc.addImage(logoData, 'JPEG', wmX, wmAreaTop, wmW, wmH);
                doc.restoreGraphicsState();
            }
        } catch {}
    }

    // Footer
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 5, W - margin, footerY - 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(
        'menteconecta@loopconexion.com.mx  |  https://menteconecta.net/  |  (55) 7577 3500',
        W / 2, footerY, { align: 'center' }
    );
    doc.text(pdf.confidencial, W / 2, footerY + 5, { align: 'center' });
    const fechaStr = new Date().toLocaleDateString(pdf.locale, {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    doc.text(`${pdf.fechaEmision} ${fechaStr}`, W / 2, footerY + 10, { align: 'center' });

    doc.save(`reporte_${(reporte.usuario ?? 'paciente').replace(/\s+/g, '_')}.pdf`);
}

export function ReportePaciente() {
    const { usuarioId } = useParams();
    const { auth } = useContext(AuthContext);
    const { t, language } = useSettings();
    const navigate = useNavigate();

    const [reporte, setReporte] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [generando, setGenerando] = useState(false);

    useEffect(() => {
        const id = usuarioId ?? auth?.userId;
        obtenerReporte(id, language)
            .then(setReporte)
            .catch(() => setError(t('noReporte')))
            .finally(() => setCargando(false));
    }, [usuarioId, auth, language, t]);

    const handleExportarPdf = async () => {
        if (!reporte) return;
        setGenerando(true);
        try {
            await generarPDF(reporte, language);
        } finally {
            setGenerando(false);
        }
    };

    if (cargando) {
        return (
            <div className="rp-bg">
                <div className="rp-spinner" />
            </div>
        );
    }

    if (error || !reporte) {
        return (
            <div className="rp-bg">
                <div className="rp-card">
                    <p className="rp-error">{error ?? t('noReporte')}</p>
                    <button className="rp-back-btn" onClick={() => navigate(-1)}>← {t('regresar')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="rp-bg">
            <div className="rp-wrapper">
                <button className="rp-nav-back" onClick={() => navigate(-1)} title="Volver">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>

                <div className="rp-title-card">
                    <h1 className="rp-title">{t('reporteTitulo')}</h1>
                </div>

                <div className="rp-card">
                    <div className="rp-user-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>

                    <p className="rp-info-row"><strong>{t('usuario')}:</strong> {reporte.usuario}</p>
                    <p className="rp-info-row"><strong>{t('telefono')}:</strong> {reporte.celular}</p>
                    <p className="rp-info-row"><strong>{t('emailLabel')}:</strong> {reporte.correo}</p>

                    <button className="rp-pdf-btn" onClick={handleExportarPdf} disabled={generando}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#e53935' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        {generando ? t('enviando') : t('exportarPdf')}
                    </button>
                </div>
            </div>
        </div>
    );
}
