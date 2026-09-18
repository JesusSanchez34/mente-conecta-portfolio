import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { postRespuestasEnvejecimientoEspecial } from '../../../api/user';
import { toast } from 'react-toastify';
import logoColor from '../../../assets/img/logoColor.png';
import { useSettings } from '../../../context/SettingsContext';
import './ResultadoSecuenciasScreen.css';

function colorAudio(raw) {
    const n = Math.floor(raw / 3);
    if (n === 3) return '#48bb78';
    if (n >= 1) return '#ed8936';
    return '#e53e3e';
}
function colorReloj(raw) {
    if (raw === 2) return '#48bb78';
    if (raw === 1) return '#ed8936';
    return '#e53e3e';
}
function colorPalabras(raw) {
    if (raw === 3) return '#48bb78';
    if (raw >= 1) return '#ed8936';
    return '#e53e3e';
}
function colorTotal(t) {
    if (t >= 6) return '#48bb78';
    if (t >= 3) return '#ed8936';
    return '#e53e3e';
}
function textoTotalKey(total) {
    if (total >= 6) return 'resBuenaCognicion';
    if (total >= 3) return 'resCognicionDeteriorada';
    return 'resCognicionComprometida';
}

export function ResultadoSecuenciasScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t } = useSettings();
    const [scores, setScores] = useState({ audio: 0, reloj: 0, palabras: 0, total: 0 });
    const [isSending, setIsSending] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const audioScore = parseInt(sessionStorage.getItem('audio_score') || '0');
        const relojScore = parseInt(sessionStorage.getItem('reloj_score') || '0');
        const palabrasData = sessionStorage.getItem('palabras_data');
        let palabrasRaw = 0;
        if (palabrasData) {
            try { palabrasRaw = JSON.parse(palabrasData).respuesta_completa?.raw ?? 0; } catch (_) {}
        }
        const audioN = Math.floor(audioScore / 3);
        setScores({ audio: audioScore, reloj: relojScore, palabras: palabrasRaw, total: audioN + relojScore + palabrasRaw });
    }, []);

    const handleSend = async () => {
        if (isSending) return;
        setIsSending(true);
        try {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            const audioData = sessionStorage.getItem('audio_data');
            const relojData = sessionStorage.getItem('reloj_data');
            const palabrasData = sessionStorage.getItem('palabras_data');

            const respuestas = [];
            if (audioData) respuestas.push(JSON.parse(audioData));
            else respuestas.push({ id_cuestionario: 47, id_pregunta: 1, respuesta_completa: { version: 'N/A', respuestas_seleccionadas: [], raw: 0 } });
            if (relojData) respuestas.push(JSON.parse(relojData));
            else respuestas.push({ id_pregunta: 2, respuesta_completa: { version: 'N/A', respuesta: 'N/A', raw: 0 } });
            if (palabrasData) respuestas.push(JSON.parse(palabrasData));
            else respuestas.push({ id_cuestionario: 47, id_pregunta: 3, respuesta_completa: { version: 'N/A', respuestas_seleccionadas: [], raw: 0 } });

            await postRespuestasEnvejecimientoEspecial({
                id_usuario: parseInt(userId),
                id_cuestionario: 47,
                id_pregunta: 532,
                puntuacion_final: scores.total,
                respuestas,
                estatus: true,
            });

            ['audio_data', 'reloj_data', 'palabras_data', 'audio_score', 'reloj_score', 'audio_version', 'audio_selected', 'sv_start_time'].forEach(k => sessionStorage.removeItem(k));
            setShowSuccessModal(true);
        } catch (_) {
            toast.error('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    const total = scores.total;
    const maxTotal = 8;
    const arrowPct = (1 - Math.min(total / maxTotal, 1)) * 100;

    return (
        <div className="res-bg">
            <div className="res-header">
                <h2>{t('resResultadosTitulo')}</h2>
            </div>

            <div className="res-content">
                <h3 className="res-eval-title">{t('resEvalCognitiva')}</h3>

                <div className="res-activities">
                    <div className="res-activity-row">
                        <span className="res-activity-text">{t('resAuditivo')}</span>
                        <div className="res-solid-circle" style={{ backgroundColor: colorAudio(scores.audio) }} />
                    </div>
                    <div className="res-divider" />
                    <div className="res-activity-row">
                        <span className="res-activity-text">{t('resReloj')}</span>
                        <div className="res-solid-circle" style={{ backgroundColor: colorReloj(scores.reloj) }} />
                    </div>
                    <div className="res-divider" />
                    <div className="res-activity-row">
                        <span className="res-activity-text">{t('resPalabras')}</span>
                        <div className="res-solid-circle" style={{ backgroundColor: colorPalabras(scores.palabras) }} />
                    </div>
                </div>

                <div className="res-gauge">
                    <div className="res-arrow" style={{ left: `calc(${arrowPct}% - 14px)` }}>▼</div>
                    <div className="res-bar" />
                </div>

                <div className="res-diag-box" style={{ background: colorTotal(total) + '22', borderColor: colorTotal(total), color: colorTotal(total) }}>
                    {t(textoTotalKey(total))}
                </div>

                <button className="res-btn" onClick={handleSend} disabled={isSending}>
                    {isSending ? t('enviando') : t('enviar')}
                </button>
            </div>

            {showSuccessModal && (
                <div className="res-modal-overlay">
                    <div className="res-modal-content">
                        <img src={logoColor} alt="Mente Conecta" className="res-modal-logo" />
                        <h2 className="res-modal-title">{t('enviado')}</h2>
                        <p className="res-modal-text">{t('respuestasLabGuardadas')}</p>
                        <button className="res-modal-btn" onClick={() => navigate('/envejecimiento/salud-mental')}>{t('entendido')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
