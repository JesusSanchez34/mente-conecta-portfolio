import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getDatosPuntuacionFecha } from '../../../api/user';
import { useSettings } from '../../../context/SettingsContext';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import logoColor from '../../../assets/img/logoColor.png';
import { AlertaGenericaModal } from '../../../components/alertas/AlertaModal';
import { FloatingActionMenu } from '../FloatingActionMenu';
import './ValorLongitudRelativaScreen.css';

function getRiskLevel(lr) {
    if (lr >= 0.062) return { color: '#48bb78', bgColor: '#e8f5e9', level: 0 };
    if (lr >= 0.0095) return { color: '#ed8936', bgColor: '#fff3e0', level: 1 };
    return { color: '#e53e3e', bgColor: '#fdeeea', level: 2 };
}

function formatLR(lr) {
    if (lr === 0 || lr === 0.0) return '0.00';
    const paso = 100;
    const valorTruncado = Math.trunc(lr * paso) / paso;
    return valorTruncado.toFixed(2);
}

export function ValorLongitudRelativaScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { t } = useSettings();
    const [lr, setLr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const userId = auth?.userId || localStorage.getItem('user_id') || '1';
            try {
                const data = await getDatosPuntuacionFecha(userId);
                const filtered = Array.isArray(data)
                    ? data.filter(d => parseInt(d.id_cuestionario) === 46)
                    : [];
                if (filtered.length > 0) {
                    filtered.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
                    setLr(parseFloat(filtered[0].puntuacion_final));
                }
            } catch (_) {}
            setIsLoading(false);
        };
        fetchData();
    }, [auth]);

    const risk = lr !== null ? getRiskLevel(lr) : null;

    const getArrowPercent = (lrVal) => {
        if (lrVal >= 0.062) {
            const pct = 33.33 - Math.min(((lrVal - 0.062) / (0.1 - 0.062)) * 33.33, 33.33);
            return pct;
        } else if (lrVal >= 0.0095) {
            const pct = 66.66 - (((lrVal - 0.0095) / (0.062 - 0.0095)) * 33.33);
            return pct;
        } else {
            const pct = 100 - Math.min((lrVal / 0.0095) * 33.33, 33.33);
            return pct;
        }
    };

    const riskLabel = risk
        ? [t('vlrConcuerda'), t('vlrDesgasteLeve'), t('vlrEdadAcelerada')][risk.level]
        : '';

    return (
        <div className="vlr-bg">
            <div className="edad-celular-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => navigate('/marcadores-biologicos')} />
                    <h2>{t('marcEdadCelular') || 'Edad Celular'}</h2>
                </div>
                <button className="edad-celular-info-btn" onClick={() => setIsInfoModalOpen(true)}>
                    <FaInfoCircle /> {t('instrucciones') || 'Instrucciones'}
                </button>
            </div>

            <AlertaGenericaModal 
                isOpen={isInfoModalOpen}
                title={t('instrucciones') || 'Instrucciones'}
                description={
                    <div style={{ textAlign: 'left', fontSize: '1rem', lineHeight: '1.5' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>El valor de Longitud Relativa (LR) se obtiene del reporte.</li>
                            <li style={{ marginBottom: '8px' }}>Fórmula usada: LR = 2^-ΔCt</li>
                            <li>El resultado se interpreta automáticamente.</li>
                        </ul>
                    </div>
                }
                onConfirm={() => setIsInfoModalOpen(false)}
                confirmText={t('cerrar') || 'Cerrar'}
            />

            <div className="vlr-content">
                {isLoading ? (
                    <div className="vlr-loading">{t('vlrCargando')}</div>
                ) : lr === null ? (
                    <div className="vlr-no-data">{t('vlrNoData')}</div>
                ) : (
                    <>
                        <div className="vlr-input-display">
                            <span className="vlr-floating-label">Longitud Telomérica Relativa (LR)</span>
                            <span className="vlr-input-value">{formatLR(lr)}</span>
                        </div>
                        <p className="vlr-formula-text">Fórmula: LR = 2^-ΔCt (ΔCt = Prom.Telómeros - Prom.Referencia)</p>

                        <div className="vlr-gauge-container">
                            <div className="vlr-arrow" style={{ left: `calc(${getArrowPercent(lr)}% - 12px)` }}>▼</div>
                            <div className="vlr-gradient-bar" />
                        </div>

                        <div className="vlr-risk-box" style={{ borderColor: risk.color, backgroundColor: risk.bgColor }}>
                            <p className="vlr-risk-lr-text">Longitud Relativa: {formatLR(lr)}</p>
                            <p className="vlr-risk-title" style={{ color: risk.color }}>{riskLabel}</p>
                            <p className="vlr-risk-desc">
                                {risk.level === 2 
                                    ? "El resultado de su reloj indica un acortamiento telomérico marcado, asociado a mayor riesgo de disfunción celular y procesos de envejecimiento acelerado, es importante acudir con su médico." 
                                    : risk.level === 1 
                                    ? "El resultado indica un desgaste leve en los telómeros. Le sugerimos mejorar sus hábitos de vida y alimentación." 
                                    : "El resultado concuerda con lo esperado para su edad, indicando un desgaste telomérico normal."}
                            </p>
                        </div>

                        <div className="vlr-note-box">
                            <FaInfoCircle className="vlr-note-icon" />
                            <p>
                                <em>Nota: El presente resultado se obtuvo a partir de pacientes mayores de 60 años, lo que podría limitar su precisión al aplicarse a individuos menores de esta edad.</em>
                            </p>
                        </div>
                        
                        <button className="vlr-btn" onClick={() => navigate('/marcadores-biologicos')}>
                            {t('aceptar') || 'Aceptar'}
                        </button>
                    </>
                )}
            </div>

            <FloatingActionMenu />
        </div>
    );
}
