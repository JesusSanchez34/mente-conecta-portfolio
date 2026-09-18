import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { obtenerDatosUsuario, actualizarDatosUsuario } from '../../api/envejecimientoService';
import './PerfilPaciente.css';

export function PerfilPaciente() {
    const { auth, logout } = useContext(AuthContext);
    const { t, language, saveSettings } = useSettings();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [datos, setDatos] = useState(null);
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [fotoFile, setFotoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const fotoKey = `u_${auth?.userId}_fotoUrl`;

    const aplicarFoto = (fotoPath) => {
        if (!fotoPath) return null;
        const baseUrl = process.env.REACT_APP_BASE_URL_ENVEJECIMIENTO?.replace(/\/$/, '') ?? '';
        return fotoPath.startsWith('/') ? `${baseUrl}${fotoPath}` : fotoPath;
    };

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerDatosUsuario(auth?.userId);
                setDatos(data);
                setEmail(data.email ?? '');
                setCelular(data.celular_paciente ?? '');
                if (data.foto) {
                    const url = aplicarFoto(data.foto);
                    setFotoPreview(url);
                    localStorage.setItem(fotoKey, url);
                } else {
                    const cached = localStorage.getItem(fotoKey);
                    if (cached) setFotoPreview(cached);
                }
            } catch {
                setError(t('errorCargar'));
                const cached = localStorage.getItem(fotoKey);
                if (cached) setFotoPreview(cached);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const handleGuardar = async () => {
        if (!email.trim()) { setError(t('correoObligatorio')); return; }
        if (!celular.trim()) { setError(t('celularObligatorio')); return; }
        setSaving(true);
        setError(null);
        try {
            const result = await actualizarDatosUsuario({
                usuarioId: auth?.userId,
                email: email.trim(),
                celularPaciente: celular.trim(),
                foto: fotoFile,
                token: auth?.token,
            });
            if (result.status === 1) {
                setSuccess(true);
                setFotoFile(null);
                // Re-fetch to get server photo URL and cache it
                try {
                    const updated = await obtenerDatosUsuario(auth?.userId);
                    if (updated.foto) {
                        const url = aplicarFoto(updated.foto);
                        setFotoPreview(url);
                        localStorage.setItem(fotoKey, url);
                    }
                } catch {}
                setTimeout(() => setSuccess(false), 2500);
            } else {
                setError(result.respuesta?.es ?? result.respuesta?.en ?? t('errorCargar'));
            }
        } catch (e) {
            setError(e.message || t('errorCargar'));
        } finally {
            setSaving(false);
        }
    };

    const handleVerReporte = () => {
        navigate(`/reporte/${auth?.userId}`);
    };

    const handleCerrarSesion = async () => {
        await saveSettings();
        logout();
        navigate('/loginmen');
    };

    if (loading) {
        return (
            <div className="pp-bg">
                <div className="pp-spinner" />
            </div>
        );
    }

    return (
        <div className="pp-bg">
            <div className="pp-wrapper">
                <button className="pp-back-btn" onClick={() => navigate(-1)} title="Volver">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>

                <div className="pp-title-card">
                    <h1 className="pp-title">{t('perfil')}</h1>
                </div>

                <div className="pp-card">
                    <div className="pp-avatar-section">
                        <div className="pp-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Foto de perfil" className="pp-avatar-img" />
                            ) : (
                                <div className="pp-avatar-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </div>
                            )}
                            <div className="pp-avatar-overlay">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
                        <p className="pp-avatar-hint">{t('tocaCambiarFoto')}</p>
                    </div>

                    <div className="pp-fields">
                        <div className="pp-field-row">
                            <label className="pp-field-label">{t('nombre')}</label>
                            <p className="pp-field-readonly">{datos?.nombre ?? '—'} {datos?.apellido_paterno ?? ''} {datos?.apellido_materno ?? ''}</p>
                        </div>

                        <div className="pp-field-row">
                            <label className="pp-field-label">{t('fechaNacimiento')}</label>
                            <p className="pp-field-readonly">{datos?.fecha_nacimiento ?? '—'}</p>
                        </div>

                        <div className="pp-field-row">
                            <label className="pp-field-label">{t('correo')}</label>
                            <input
                                type="email"
                                className="pp-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={language === 'en' ? 'email@example.com' : 'correo@ejemplo.com'}
                            />
                        </div>

                        <div className="pp-field-row">
                            <label className="pp-field-label">{t('celular')}</label>
                            <input
                                type="tel"
                                className="pp-input"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                placeholder="+52 55 0000 0000"
                            />
                        </div>
                    </div>
                </div>

                {error && <p className="pp-error">{error}</p>}
                {success && <p className="pp-success">{t('cambiosGuardados')}</p>}

                <button className="pp-reporte-btn" onClick={handleVerReporte}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: '#1976D2' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    {t('verReporte')}
                </button>

                <button className="pp-save-btn" disabled={saving} onClick={handleGuardar}>
                    {saving ? t('guardando') : t('guardarCambios')}
                </button>

                <button className="pp-logout-btn" onClick={handleCerrarSesion}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {t('cerrarSesion')}
                </button>
            </div>
        </div>
    );
}
