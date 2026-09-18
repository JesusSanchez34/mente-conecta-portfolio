import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logoColor from "../../../assets/img/Icono_home.jpeg";
import { loginApiFase1, getMeApi } from '../../../api/user';
import { useAuth } from '../../../hooks';
import { InputForm } from '../../ui';

import './FormLoginFase1.css';

export function FormLoginFase1(props) {

    const { onBack } = props;

    const typeLogin = 2;

    const { login } = useAuth();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null);

    const formik = useFormik({

        initialValues: {

            email: "",
            password: "",

        },

        validationSchema: Yup.object({

            email: Yup.string("Ingrese su correo electrónico")
                .email("Ingrese un correo válido")
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
                const response = await loginApiFase1(formvalue);

                console.log("LOGIN RESPONSE:", response);

                const { access } = response;

                // GUARDAR TOKEN
                await login(access, typeLogin);

                // OBTENER DATOS DEL USUARIO
                const userData = await getMeApi(access, typeLogin);

                console.log("USER DATA:", userData);

                // GUARDAR NOMBRE COMPLETO
                localStorage.setItem(
                    'nombre',
                    `${userData.nombre} ${userData.apellido_paterno} ${userData.apellido_materno}`
                );

                // REDIRIGIR SEGÚN EL ROL
                if (userData.role === 5) {
                    navigate('/director/dashboard');
                } else if (userData.role === 4) {
                    navigate('/empresa/dashboard');
                } else {
                    navigate('/seleccion-usuario');
                }

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

            navigate('/carrusel');

        }

    };

    return (

        <div className="fase1-login-bg">

            {/* BOTÓN REGRESAR */}
            <button
                className="fase1-back-btn"
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

            <div className="fase1-login-wrapper">

                <img
                    src={logoColor}
                    alt="Mente Conecta Logo"
                    className="fase1-login-logo"
                />

                <h1 className="fase1-login-title">

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

                        <InputForm
                            label=""
                            nameInput="email"
                            placeHolderInput={t('login.email')}
                            valueInput={formik.values.email}
                            onChangeInput={formik.handleChange}
                            type="text"
                            error={formik.errors.email}
                            touched={formik.touched.email}
                            disabled={isLoading}
                        />

                    </div>

                    <div className="mb-2">

                        <InputForm
                            label=""
                            nameInput="password"
                            placeHolderInput={t('login.password')}
                            valueInput={formik.values.password}
                            onChangeInput={formik.handleChange}
                            type="password"
                            error={formik.errors.password}
                            touched={formik.touched.password}
                            disabled={isLoading}
                        />

                    </div>

                    <div className="fase1-login-options-row">

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
                            className="fase1-login-link"
                            onClick={() => navigate('/recuperar-password')}
                        >

                            {t('login.forgotPassword')}

                        </span>

                    </div>

                    <button
                        type="submit"
                        className="fase1-login-btn-primary"
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

                    <div className="fase1-login-divider">

                        {t('login.noAccount')}

                    </div>

                    <button
                        type="button"
                        className="fase1-login-btn-outline"
                        onClick={() => navigate('/registro-fase1')}
                    >

                        {t('login.register')}

                    </button>

                    <button
                        type="button"
                        className="fase1-login-btn-outline"
                        onClick={() => navigate('/registro-empresa')}
                    >

                        {t('login.registerCompany')}

                    </button>

                </Form>

            </div>

        </div>

    );

}