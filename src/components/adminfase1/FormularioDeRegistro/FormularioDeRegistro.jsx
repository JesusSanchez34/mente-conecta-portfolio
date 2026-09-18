import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2'; 
import { ConsentimientoInformado, PoliticaDePrivacidad, PropositoApp } from './ComponentesLegales';
import { LanguageSelector } from '../../ui';
import { registerApiFase1, getEdadesFase1, getEmpresasFase1 } from "../../../api/user";
import "./FormularioDeRegistro.scss";

export default function FormularioDeRegistro({ onBack }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const [pasoLegal, setPasoLegal] = useState(1);
    const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
    const [aceptaConsentimiento, setAceptaConsentimiento] = useState(false);
    const [aceptaProposito, setAceptaProposito] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '',
        curp: '', correo: '', password: '', confirmPassword: '',
        edad: '', empresa: ''
    });

    const [edadesList, setEdadesList] = useState([]);
    const [empresasList, setEmpresasList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchCatalogos() {
            try {
                const edades = await getEdadesFase1();
                const empresas = await getEmpresasFase1();
                setEdadesList(edades);
                setEmpresasList(empresas);
            } catch (error) {
                console.error("Error al cargar catálogos:", error);
            }
        }
        fetchCatalogos();
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleBack = () => onBack ? onBack() : navigate(-1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'curp') {
            setFormData({ ...formData, [name]: value.slice(0, 18).toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: t('register.passwordMismatch'), confirmButtonText: 'Aceptar' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                password: formData.password,
                nombre: formData.nombre,
                apellido_paterno: formData.apellidoPaterno,
                apellido_materno: formData.apellidoMaterno,
                curp: formData.curp,
                email: formData.correo,
                terminos_condiciones: true,
                edades: parseInt(formData.edad),
                empresa: parseInt(formData.empresa)
            };

            await registerApiFase1(payload);

            Swal.fire({ 
                icon: 'success', 
                title: '¡Registro exitoso!', 
                text: 'Tu cuenta ha sido creada correctamente.', 
                confirmButtonText: 'Aceptar', 
                confirmButtonColor: '#4DB6AC' 
            }).then(() => {
                navigate('/login-fase1');
            });
        } catch (error) {
            console.error("Error al registrar:", error);
            Swal.fire({ 
                icon: 'error', 
                title: 'Error al registrar', 
                text: error.message || 'Ocurrió un error al procesar tu registro.', 
                confirmButtonText: 'Reintentar', 
                confirmButtonColor: '#2196F3' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const EyeIcon = ({ visible }) => visible ? (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    );

    // --- RENDERIZADO DE PASOS ---
    if (pasoLegal === 1) return (
        <div className="registro-fullscreen-container legal-flow-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}><LanguageSelector lightBg={true} /></div>
            <div className="registro-header">
                <button type="button" className="btn-icon-minimal back-arrow" onClick={handleBack}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.privacyTitle')}</h2><div style={{ width: 42 }}></div>
            </div>
            <div className="legal-card"><div className="terminos-contenido"><PoliticaDePrivacidad /></div></div>
            <div className="legal-footer-controls">
                <div className="legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaPrivacidad} onChange={(e) => setAceptaPrivacidad(e.target.checked)} /><span>{t('register.privacyCheckbox')}</span></label>
                </div>
                <div className="terminos-footer-buttons"><button type="button" className="btn-terminos btn-aceptar" disabled={!aceptaPrivacidad} onClick={() => setPasoLegal(2)}>{t('register.continue')}</button></div>
            </div>
        </div>
    );

    if (pasoLegal === 2) return (
        <div className="registro-fullscreen-container legal-flow-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}><LanguageSelector lightBg={true} /></div>
            <div className="registro-header">
                <button type="button" className="btn-icon-minimal back-arrow" onClick={() => setPasoLegal(1)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.consentTitle')}</h2><div style={{ width: 42 }}></div>
            </div>
            <div className="legal-card"><div className="terminos-contenido"><ConsentimientoInformado /></div></div>
            <div className="legal-footer-controls">
                <div className="legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaConsentimiento} onChange={(e) => setAceptaConsentimiento(e.target.checked)} /><span>{t('register.consentCheckbox')}</span></label>
                </div>
                <div className="terminos-footer-buttons"><button type="button" className="btn-terminos btn-aceptar" disabled={!aceptaConsentimiento} onClick={() => setPasoLegal(3)}>{t('register.continue')}</button></div>
            </div>
        </div>
    );

    if (pasoLegal === 3) return (
        <div className="registro-fullscreen-container legal-flow-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}><LanguageSelector lightBg={true} /></div>
            <div className="registro-header">
                <button type="button" className="btn-icon-minimal back-arrow" onClick={() => setPasoLegal(2)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.purposeTitle')}</h2><div style={{ width: 42 }}></div>
            </div>
            <div className="legal-card proposito-card"><div className="terminos-contenido text-center-paragraphs"><PropositoApp /></div></div>
            <div className="legal-footer-controls">
                <div className="legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaProposito} onChange={(e) => setAceptaProposito(e.target.checked)} /><span>{t('register.purposeCheckbox')}</span></label>
                </div>
                <div className="terminos-footer-buttons"><button type="button" className="btn-terminos btn-aceptar" disabled={!aceptaProposito} onClick={() => setPasoLegal(0)}>{t('register.goToRegister')}</button></div>
            </div>
        </div>
    );

    return (
        <div className="registro-fullscreen-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}><LanguageSelector lightBg={true} /></div>
            <div className="registro-header">
                <button type="button" className="btn-icon-minimal back-arrow" onClick={() => setPasoLegal(3)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.registerTitle')}</h2>
                <button type="button" className="btn-icon-minimal home-icon" onClick={() => navigate('/login-fase1')}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></button>
            </div>
            <form className="registro-form-grid" onSubmit={handleSubmit}>
                <div className="input-group"><input type="text" name="nombre" placeholder={t('register.firstName')} value={formData.nombre} onChange={handleChange} required /></div>
                <div className="input-group"><input type="text" name="apellidoPaterno" placeholder={t('register.lastName')} value={formData.apellidoPaterno} onChange={handleChange} required /></div>
                <div className="input-group"><input type="text" name="apellidoMaterno" placeholder={t('register.secondLastName')} value={formData.apellidoMaterno} onChange={handleChange} required /></div>
                <div className="input-group curp-group"><input type="text" name="curp" placeholder={t('register.curp')} value={formData.curp} onChange={handleChange} required /><span className="char-counter">{formData.curp.length}/18</span></div>
                <div className="input-group"><input type="email" name="correo" placeholder={t('register.email')} value={formData.correo} onChange={handleChange} required /></div>
                <div className="input-group password-group">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder={t('register.password')} value={formData.password} onChange={handleChange} required />
                    <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}><EyeIcon visible={showPassword} /></button>
                </div>
                <div className="input-group password-group">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder={t('register.confirmPassword')} value={formData.confirmPassword} onChange={handleChange} required />
                    <button type="button" className="toggle-password-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><EyeIcon visible={showConfirmPassword} /></button>
                </div>
                <div className="select-group">
                    <select name="edad" value={formData.edad} 
                        onChange={handleChange} required>
                        <option value="" disabled hidden>{t('register.selectAge')}</option>
                        {edadesList.map((e) => (
                            <option key={e.id} value={e.id}>{e.rango_edades}</option>
                        ))}
                        {edadesList.length === 0 && (
                            <>
                                <option value="1">18 - 65</option>
                                <option value="2">65 - 100</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="select-group">
                    <select name="empresa" value={formData.empresa} 
                        onChange={handleChange} required>
                        <option value="" disabled hidden>{t('register.selectCompany')}</option>
                        {empresasList.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.nombre_empresa}</option>
                        ))}
                        {empresasList.length === 0 && (
                            <>
                                <option value="1">Loop Conexion</option>
                                <option value="15">ELEMIS</option>
                                <option value="16">Tequila</option>
                                <option value="17">Miel</option>
                                <option value="18">Confort</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="form-footer-full">
                    <button type="submit" className="btn-submit-registro" disabled={isSubmitting}>
                        {isSubmitting ? "Registrando..." : t('register.submit')}
                    </button>
                    <p className="legals-text">{t('register.footerText')}</p>
                </div>
            </form>
        </div>
    );
}