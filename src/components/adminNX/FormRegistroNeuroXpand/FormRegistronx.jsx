import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputNX } from '../inputNX/InputNX';
import { CustomDropdownNX } from '../dropDown';
import { ConsentimientoInformado, PoliticaDePrivacidad, PropositoApp } from './ComponentesLegalesNeuroXpand';
import { Consentimientonx, Privacidadnx, Propositonx } from './ComponentesLegalesNeuroXpand'
import { LanguageSelector } from '../../ui';
import { registerApiNeuroXpand, getEdadesNeuroXpand, getEmpresasNeuroXpand } from "../../../api/user";

import "./FormRegistronx.scss";

export default function FormRegistronx({ onBack }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [pasoLegal, setPasoLegal] = useState(1);
    const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
    const [aceptaConsentimiento, setAceptaConsentimiento] = useState(false);
    const [aceptaProposito, setAceptaProposito] = useState(false);

    const [edadesList, setEdadesList] = useState([]);
    const [empresasList, setEmpresasList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        async function fetchCatalogos() {
            try {
                const edades = await getEdadesNeuroXpand();
                const empresas = await getEmpresasNeuroXpand();
                setEdadesList(edades);
                setEmpresasList(empresas);
            } catch (error) {
                console.error("Error al cargar catálogos:", error);
            }
        }
        fetchCatalogos();
    }, []);

    useEffect(() => {
        const scrollContainer = document.querySelector('.nx-terminos-contenido');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pasoLegal]);

    const handleBack = () => onBack ? onBack() : navigate(-1);

    const formik = useFormik({
        initialValues: {
            nombre: '', apellidoPaterno: '', apellidoMaterno: '',
            curp: '', correo: '', password: '', confirmPassword: '',
            edad: '', empresa: ''
        },
        validationSchema: validationSchema(),

        onSubmit: async (formValue) => {
            setIsSubmitting(true);
            try {
                const payload = {
                    password: formValue.password,
                    nombre: formValue.nombre,
                    apellido_paterno: formValue.apellidoPaterno,
                    apellido_materno: formValue.apellidoMaterno,
                    curp: formValue.curp,
                    email: formValue.correo,
                    terminos_condiciones: true,
                    edades: parseInt(formValue.edad),
                    empresa: parseInt(formValue.empresa)
                };

                await registerApiNeuroXpand(payload);

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#4DB6AC'
                }).then(() => {
                    navigate('/login-neuroXpand');
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
        }
    });

    const EyeIcon = ({ visible }) => visible ? (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    );

    if (pasoLegal === 1) return (
        <div className="nx-registro-fullscreen-container nx-legal-flow-container">
            <div className="nx-registro-header">
                <button type="button" className="nx-btn-icon-minimal nx-back-arrow" onClick={handleBack}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.privacyTitle')}</h2><div className="nx-header-actions-right">
                    <LanguageSelector lightBg={true} />
                </div>
            </div>
            <div className="nx-legal-card"><div className="nx-terminos-contenido"><Privacidadnx /></div></div>
            <div className="nx-legal-footer-controls">
                <div className="nx-legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaPrivacidad} onChange={(e) => setAceptaPrivacidad(e.target.checked)} /><span>{t('register.privacyCheckbox')}</span></label>
                </div>
                <div className="nx-terminos-footer-buttons"><button type="button" className="nx-btn-terminos nx-btn-aceptar" disabled={!aceptaPrivacidad} onClick={() => setPasoLegal(2)}>{t('register.continue')}</button></div>
            </div>
        </div>
    );

    if (pasoLegal === 2) return (
        <div className="nx-registro-fullscreen-container nx-legal-flow-container">
            <div className="nx-registro-header">
                <button type="button" className="nx-btn-icon-minimal nx-back-arrow" onClick={() => setPasoLegal(1)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.consentTitle')}</h2><div className="nx-header-actions-right">
                    <LanguageSelector lightBg={true} />
                </div>
            </div>
            <div className="nx-legal-card"><div className="nx-terminos-contenido"><Consentimientonx /></div></div>
            <div className="nx-legal-footer-controls">
                <div className="nx-legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaConsentimiento} onChange={(e) => setAceptaConsentimiento(e.target.checked)} /><span>{t('register.consentCheckbox')}</span></label>
                </div>
                <div className="nx-terminos-footer-buttons"><button type="button" className="nx-btn-terminos nx-btn-aceptar" disabled={!aceptaConsentimiento} onClick={() => setPasoLegal(3)}>{t('register.continue')}</button></div>
            </div>
        </div>
    );

    if (pasoLegal === 3) return (
        <div className="nx-registro-fullscreen-container nx-legal-flow-container">
            <div className="nx-registro-header">
                <button type="button" className="nx-btn-icon-minimal nx-back-arrow" onClick={() => setPasoLegal(2)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.purposeTitle')}</h2><div className="nx-header-actions-right">
                    <LanguageSelector lightBg={true} />
                </div>
            </div>
            <div className="nx-legal-card nx-proposito-card"><div className="nx-terminos-contenido nx-text-center-paragraphs"><Propositonx /></div></div>
            <div className="nx-legal-footer-controls">
                <div className="nx-legal-checkbox-container">
                    <label className="pure-material-checkbox"><input type="checkbox" checked={aceptaProposito} onChange={(e) => setAceptaProposito(e.target.checked)} /><span>{t('register.purposeCheckbox')}</span></label>
                </div>
                <div className="nx-terminos-footer-buttons"><button type="button" className="nx-btn-terminos nx-btn-aceptar" disabled={!aceptaProposito} onClick={() => setPasoLegal(0)}>{t('register.goToRegister')}</button></div>
            </div>
        </div>
    );

    return (
        <div className="nx-registro-fullscreen-container">
            <div className="nx-registro-header">
                <button type="button" className="nx-btn-icon-minimal nx-back-arrow" onClick={() => setPasoLegal(3)}><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h2>{t('register.registerTitle')}</h2>
                <div className="nx-header-actions-right">
                    <button type="button" className="nx-btn-icon-minimal nx-home-icon" onClick={() => navigate('/login-neuroXpand')}>
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </button>
                    <LanguageSelector lightBg={true} />
                </div>
            </div>

            <form className="nx-registro-form-grid" onSubmit={formik.handleSubmit}>

                <InputNX
                    placeholder={t('register.firstName')}
                    {...formik.getFieldProps('nombre')}
                    error={formik.errors.nombre}
                    touched={formik.touched.nombre}
                />

                <InputNX
                    placeholder={t('register.lastName')}
                    {...formik.getFieldProps('apellidoPaterno')}
                    error={formik.errors.apellidoPaterno}
                    touched={formik.touched.apellidoPaterno}
                />

                <InputNX
                    placeholder={t('register.secondLastName')}
                    {...formik.getFieldProps('apellidoMaterno')}
                    error={formik.errors.apellidoMaterno}
                    touched={formik.touched.apellidoMaterno}
                />

                <InputNX
                    placeholder={t('register.curp')}
                    {...formik.getFieldProps('curp')}
                    onChange={(e) => {
                        formik.setFieldValue('curp', e.target.value.toUpperCase().slice(0, 18));
                    }}
                    error={formik.errors.curp}
                    touched={formik.touched.curp}
                    rightElement={
                        <span style={{ fontSize: '0.85rem', color: '#777', paddingRight: '5px' }}>
                            {formik.values.curp.length}/18
                        </span>
                    }
                />

                <InputNX
                    type="email"
                    placeholder={t('register.email')}
                    {...formik.getFieldProps('correo')}
                    error={formik.errors.correo}
                    touched={formik.touched.correo}
                />

                <InputNX
                    type={showPassword ? "text" : "password"}
                    placeholder={t('register.password')}
                    {...formik.getFieldProps('password')}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            <EyeIcon visible={showPassword} />
                        </button>
                    }
                />

                <InputNX
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('register.confirmPassword')}
                    {...formik.getFieldProps('confirmPassword')}
                    error={formik.errors.confirmPassword}
                    touched={formik.touched.confirmPassword}
                    rightElement={
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <EyeIcon visible={showConfirmPassword} />
                        </button>
                    }
                />

                <CustomDropdownNX
                    placeholder={t('register.selectAge')}
                    value={formik.values.edad}
                    onChange={(val) => formik.setFieldValue('edad', val)}
                    onBlur={() => formik.setFieldTouched('edad', true)}
                    error={formik.errors.edad}
                    touched={formik.touched.edad}
                    options={
                        edadesList.length > 0
                            ? edadesList.map((e) => ({ value: e.id.toString(), label: e.rango_edades }))
                            : [
                                { value: "1", label: "18 - 65" },
                                { value: "2", label: "65 - 100" }
                            ]
                    }
                />

                <CustomDropdownNX
                    placeholder={t('register.selectCompany')}
                    value={formik.values.empresa}
                    onChange={(val) => formik.setFieldValue('empresa', val)}
                    onBlur={() => formik.setFieldTouched('empresa', true)}
                    error={formik.errors.empresa}
                    touched={formik.touched.empresa}
                    options={
                        empresasList.length > 0
                            ? empresasList.map((emp) => ({ value: emp.id.toString(), label: emp.nombre_empresa }))
                            : [
                                { value: "1", label: "Loop Conexion" },
                                { value: "15", label: "ELEMIS" },
                                { value: "16", label: "Tequila" },
                                { value: "17", label: "Miel" },
                                { value: "18", label: "Confort" }
                            ]
                    }
                />

                <div className="nx-form-footer-full">
                    <button type="submit" className="nx-btn-submit-registro" disabled={isSubmitting}>
                        {isSubmitting ? "Registrando..." : t('register.submit')}
                    </button>
                    <p className="nx-legals-text">{t('register.footerText')}</p>
                </div>
            </form>
        </div>
    );
}

const validationSchema = () => Yup.object({
    nombre: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios')
        .required('El nombre es obligatorio'),
    apellidoPaterno: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios')
        .required('El apellido paterno es obligatorio'),
    apellidoMaterno: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios')
        .required('El apellido materno es obligatorio'),
    curp: Yup.string()
        .length(18, 'El CURP debe tener exactamente 18 caracteres')
        .required('El CURP es obligatorio'),
    correo: Yup.string()
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'El correo debe contener un "@", un dominio y terminar con un punto seguido de una extensión (ej. .com, .mx)'
    )
    .required('El correo electrónico es obligatorio'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
    edad: Yup.string().required('Debes seleccionar una edad'),
    empresa: Yup.string().required('Debes seleccionar una empresa')
});