import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoColor from '../../../../assets/img/Icono_home.jpeg';
import { loginApiNeuroXpand, getMeApiNeuroXpand } from '../../../../api/user';
import { useAuth } from '../../../../hooks';
import { InputNX, LoaderNX } from '../../../adminNX';

import './FormLoginnx.css';

const EyeIcon = ({ visible }) => visible ? (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
) : (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export function FormLoginnx(props) {

    const { onBack } = props;
    const typeLogin = 8;
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showPassword, setShowPassword] = useState(false);

    const savedEmail = localStorage.getItem('rememberedEmail_nx') || "";
    const savedPassword = localStorage.getItem('rememberedPassword_nx') || "";

    const formik = useFormik({
        initialValues: {
            email: savedEmail,
            password: savedPassword,
            rememberMe: !!savedEmail,
        },
        validationSchema: Yup.object({
            email: Yup.string("Ingrese su correo electrónico")
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'El correo debe contener un "@", un dominio y terminar con un punto seguido de una extensión (ej. .com, .mx)'
                )
                .required("El correo es requerido"),

            password: Yup.string("Ingrese su contraseña")
                .required("La contraseña es requerida"),
        }),
        validateOnChange: false,
        onSubmit: async (formvalue) => {
            try {
                setIsLoading(true);
                setError(null);
                // LOGIN
                const response = await loginApiNeuroXpand(formvalue);
                console.log("LOGIN RESPONSE:", response);
                const { access } = response;
                // GUARDAR TOKEN
                await login(access, typeLogin);
                // OBTENER DATOS DEL USUARIO
                const userData = await getMeApiNeuroXpand(access, typeLogin);
                console.log("USER DATA:", userData);
                // GUARDAR NOMBRE COMPLETO
                localStorage.setItem(
                    'nombre',
                    `${userData.nombre} ${userData.apellido_paterno} ${userData.apellido_materno}`
                );
                if (formvalue.rememberMe) {
                    localStorage.setItem('rememberedEmail_nx', formvalue.email);
                    localStorage.setItem('rememberedPassword_nx', formvalue.password);
                } else {
                    localStorage.removeItem('rememberedEmail_nx');
                    localStorage.removeItem('rememberedPassword_nx');
                }
                
                toast.success("Iniciando sesión...");
                navigate('/seleccion-usuarioNX');

            } catch (error) {
                console.error(`Error en login Fase 1:`, error);
                setError(error.message);
                if (
                    error.message.includes("404") ||
                    error.message.includes("no encontrado")
                ) {
                    toast.error("Correo o contraseña incorrectos");
                } else if (
                    error.message.includes("no tiene acceso")
                ) {
                    toast.error("Tu cuenta no tiene acceso a esta plataforma");
                } else if (
                    error.message.includes("token")
                ) {
                    toast.error("Error de autenticación. Intenta de nuevo");
                } else {
                    toast.error(error.message || "Error al iniciar sesión");
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/carrusel-neuroXpand');
        }
    };

    return (
        <div className="nx-login-bg">
            <LoaderNX
                isOpen={isLoading}
                title={t('login.submitting', { defaultValue: 'Iniciando sesión...' })}
                message="Cargando Inicio de sesión"
            />
            <button
                className="nx-back-btn"
                onClick={handleBack}
                title="Volver"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Volver
            </button>

            <div className="nx-login-wrapper">
                <img
                    src={logoColor}
                    alt="Mente Conecta Logo"
                    className="nx-login-logo"
                />

                <h1 className="nx-login-title">
                    {t('login.title')}
                </h1>

                {error && (
                    <div
                        className="alert alert-danger alert-dismissible fade show"
                        style={{ borderRadius: '20px' }}
                        role="alert"
                    >
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                )}

                <Form onSubmit={formik.handleSubmit}>

                    <div className="mb-2">
                        <InputNX
                            type="text"
                            placeholder={t('login.email')}
                            {...formik.getFieldProps('email')}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-2">
                        <InputNX
                            type={showPassword ? "text" : "password"}
                            placeholder={t('login.password')}
                            {...formik.getFieldProps('password')}
                            error={formik.errors.password}
                            touched={formik.touched.password}
                            disabled={isLoading}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    style={{ border: 'none', background: 'none', padding: 0, cursor: isLoading ? 'default' : 'pointer', opacity: isLoading ? 0.5 : 0.7 }}
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            }
                        />
                    </div>

                    <div className="nx-login-options-row">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                onChange={formik.handleChange}
                                checked={formik.values.rememberMe}
                                disabled={isLoading}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                }}
                            />
                            <label
                                htmlFor="rememberMe"
                                style={{
                                    cursor: 'pointer',
                                    margin: 0
                                }}
                            >
                                {t('login.rememberMe')}
                            </label>
                        </div>

                        <span
                            className="nx-login-link"
                            onClick={() => navigate('/recuperar-password-neuroXpand')}
                        >
                            {t('login.forgotPassword')}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="nx-login-btn-primary"
                        disabled={isLoading}
                        style={{
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                {t('login.submitting')}
                            </>
                        ) : (
                            t('login.submit')
                        )}
                    </button>

                    <div className="nx-login-divider">
                        {t('login.noAccount')}
                    </div>

                    <button
                        type="button"
                        className="nx-login-btn-outline"
                        onClick={() => navigate('/registro-neuroXpand')}
                    >
                        {t('login.register')}
                    </button>

                    <button
                        type="button"
                        className="nx-login-btn-outline"
                        onClick={() => navigate('/registro-empresa-neuroXpand')}
                    >
                        {t('login.registerCompany')}
                    </button>
                </Form>
            </div>
        </div>
    );
}