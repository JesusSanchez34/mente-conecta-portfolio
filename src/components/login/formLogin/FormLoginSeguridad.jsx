import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logoSegu from '../../../assets/img/logoSeguridad2.png';
import { loginApiMCSP } from '../../../api/user';
import { useAuth } from '../../../hooks';
import { InputForm, LanguageSelector } from '../../ui';
import { FormRegistroEmpresa } from './FormRegistroEmpresa';
import { useTranslation } from 'react-i18next';
import './FormLoginSeguridad.css';
import { FormRegisterSeguridad } from '../../register/formRegister/FormRegisterSeguridad';

export function FormLoginSeguridad(props) {
    const { typeLogin, onBack } = props;
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formularioActivo, setFormularioActivo] = useState('login');

    const loginMap = {
        6: loginApiMCSP,
    };

    const getLoginApi = (typeLogin) => loginMap[typeLogin] || loginApiMCSP;

    const formik = useFormik({
        initialValues: initialValues(typeLogin),
        validationSchema: Yup.object(newSchema(typeLogin, t)),
        validateOnChange: false,
        onSubmit: async (formvalue) => {
            try {
                setIsLoading(true);
                setError(null);
                console.log(
                    `[FormLogin] Iniciando login para typeLogin: ${typeLogin}`,
                );

                // Guardar o eliminar credenciales según la opción "Recuérdame"
                if (formvalue.rememberMe) {
                    const credentials =
                        typeLogin === 2
                            ?   {
                                    email: formvalue.email,
                                    password: formvalue.password,
                                }
                            :   {
                                    username: formvalue.username,
                                    password: formvalue.password,
                                };
                    localStorage.setItem(
                        'mcsp_credentials',
                        JSON.stringify(credentials),
                    );
                } else {
                    localStorage.removeItem('mcsp_credentials');
                }

                console.log(`[FormLogin] Llamando API de login...`);
                const response = await getLoginApi(typeLogin)(
                    formvalue,
                    typeLogin,
                );
                const { access } = response;
                console.log(`[FormLogin] ✓ Token recibido exitosamente`);

                console.log(`[FormLogin] Guardando token en AuthContext...`);
                await login(access, typeLogin);
                console.log(
                    `[FormLogin] ✓ Login completado. Redirigiendo a inicio...`,
                );

                toast.success('Iniciando sesión...');
                navigate('/seguridad/inicio');
            } catch (error) {
                console.error(`[FormLogin] Error en login:`, error);
                setError(error.message);

                if (
                    error.message.includes('404') ||
                    error.message.includes('no encontrado')
                ) {
                    toast.error(t('login.alert_error_404'));
                } else if (error.message.includes('no tiene acceso')) {
                    toast.error(t('login.alert_error_access'));
                } else if (error.message.includes('token')) {
                    toast.error(t('login.alert_error_auth'));
                } else {
                    toast.error(error.message || t('login.alert_error_generic'));
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <>
            {formularioActivo === 'login' && (
                <div className="login-bg">
                    <LanguageSelector variant="floating" />
                    <div className="login-wrapper">
                        {/* HEADER */}
                        <div className="login-header">
                            <h2>{t('login.welcome', '¡Bienvenido de nuevo!')}</h2>
                            <p>{t('login.access_space', 'Ingresa tus datos para acceder a tu cuenta')}</p>
                            <div className="logo-circle">
                                <img src={logoSegu} alt="logo seguridad" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            </div>
                        </div>

                        {/* FORM CARD */}
                        <div className="login-card">
                            {/* Mostrar error persistente si existe */}
                            {error && (
                                <div
                                    className="alert alert-danger alert-dismissible fade show"
                                    role="alert"
                                >
                                    <strong>Error:</strong> {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError(null)}
                                    ></button>
                                </div>
                            )}

                            <Form onSubmit={formik.handleSubmit}>
                                <InputForm
                                    label={
                                        typeLogin === 2
                                            ? t('login.email', 'Correo electrónico')
                                            : t('login.username', 'Usuario')
                                    }
                                    labelDirection="left"
                                    nameInput={
                                        typeLogin === 2 ? 'email' : 'username'
                                    }
                                    placeHolderInput={
                                        typeLogin === 2
                                            ? t('login.email_placeholder', 'correo@ejemplo.com')
                                            : t('login.username_placeholder', 'Ingrese su usuario')
                                    }
                                    valueInput={
                                        typeLogin === 2
                                            ? formik.values.email
                                            : formik.values.username
                                    }
                                    onChangeInput={formik.handleChange}
                                    type="text"
                                    error={
                                        typeLogin === 2
                                            ? formik.errors.email
                                            : formik.errors.username
                                    }
                                    touched={
                                        typeLogin === 2
                                            ? formik.touched.email
                                            : formik.touched.username
                                    }
                                    disabled={isLoading}
                                />

                                <InputForm
                                    label={t('login.password', 'Contraseña')}
                                    labelDirection="left"
                                    nameInput="password"
                                    placeHolderInput={t('login.password_placeholder', 'Contraseña')}
                                    valueInput={formik.values.password}
                                    onChangeInput={formik.handleChange}
                                    type="password"
                                    error={formik.errors.password}
                                    touched={formik.touched.password}
                                    disabled={isLoading}
                                />

                                 <Form.Group
                                    className="mb-3 d-flex align-items-center justify-content-start text-start"
                                    controlId="formBasicCheckbox"
                                >
                                    <Form.Check
                                        type="checkbox"
                                        name="rememberMe"
                                        label={t('login.remember_me', 'Recuérdame')}
                                        checked={formik.values.rememberMe}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                        style={{
                                            color: '#04547B',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                        }}
                                    />
                                </Form.Group>

                                {/* Botón Iniciar Sesión con Spinner */}
                                <Button
                                    type="submit"
                                    className="login-btn"
                                    disabled={isLoading}
                                    style={{ opacity: isLoading ? 0.7 : 1 }}
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
                                            {t('login.logging_in', 'Iniciando sesión...')}
                                        </>
                                    ) : (
                                        t('login.login_btn', 'Iniciar Sesión')
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    className="login-btn"
                                    onClick={() =>
                                        setFormularioActivo('registro')
                                    }
                                    disabled={isLoading}
                                    style={{ opacity: isLoading ? 0.7 : 1 }}
                                >
                                    {t('login.register_btn', '¡Regístrate!')}
                                </Button>

                                <Button
                                    type="button"
                                    className="login-btn"
                                    onClick={() =>
                                        setFormularioActivo('registroEmpresa')
                                    }
                                    disabled={isLoading}
                                    style={{ opacity: isLoading ? 0.7 : 1 }}
                                >
                                    {t('login.register_company_btn', '¡Registrar Empresa!')}
                                </Button>

                                {/* Botón Regresar */}
                                <Button
                                    type="button"
                                    className="login-btn login-btn-secondary"
                                    onClick={onBack}
                                    disabled={isLoading}
                                >
                                    {t('login.back_btn', 'Regresar')}
                                </Button>
                            </Form>
                        </div>

                        {/* FOOTER */}
                        <div className="login-footer">
                            🔒 {t('login.privacy_footer', 'Información protegida y confidencial')}
                        </div>
                    </div>
                </div>
            )}

            {formularioActivo === 'registroEmpresa' && (
                <FormRegistroEmpresa
                    onBack={() => setFormularioActivo('login')}
                />
            )}

            {formularioActivo === 'registro' && (
                <div className="login-bg">
                    <div className="login-wrapper">
                        <div className="login-header">
                            <h2>{t('register.title')}</h2>
                            <p>{t('register.subtitle')}</p>
                            <div className="logo-circle">
                                <img src={logoSegu} alt="logo seguridad" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            </div>
                        </div>
                        <div className="login-card">
                            <FormRegisterSeguridad
                                showHeader={false}
                                onSuccess={() => setFormularioActivo('login')}
                            />
                            <Button
                                type="button"
                                className="login-btn login-btn-secondary"
                                onClick={() => setFormularioActivo('login')}
                            >
                                {t('login.back_btn', 'Regresar')}
                            </Button>
                        </div>
                        <div className="login-footer">
                            {t('login.privacy_footer', 'Información protegida y confidencial')}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function initialValues(typeLogin) {
    const savedCredentials = JSON.parse(
        localStorage.getItem('mcsp_credentials') || '{}',
    );
    if (typeLogin === 2) {
        return {
            email: savedCredentials.email || '',
            password: savedCredentials.password || '',
            rememberMe: !!savedCredentials.email,
        };
    }
    return {
        username: savedCredentials.username || '',
        password: savedCredentials.password || '',
        rememberMe: !!savedCredentials.username,
    };
}

function newSchema(typeLogin, t) {
    if (typeLogin === 2) {
        return {
            email: Yup.string(t('register.validation.email_req', 'Ingrese su correo electrónico'))
                .email(t('register.validation.email_invalid', 'Ingrese un correo válido'))
                .required(t('register.validation.email_req', 'Ingrese su correo electrónico')),
            password: Yup.string(t('register.validation.pass_req', 'Ingrese su contraseña')).required(
                t('register.validation.pass_req', 'Ingrese su contraseña'),
            ),
            rememberMe: Yup.boolean(),
        };
    }
    return {
        username:
            Yup.string(t('register.validation.username_req', 'Ingrese su usuario')).required(t('register.validation.username_req', 'Ingrese su usuario')),
        password: Yup.string(t('register.validation.pass_req', 'Ingrese su contraseña')).required(
            t('register.validation.pass_req', 'Ingrese su contraseña'),
        ),
        rememberMe: Yup.boolean(),
    };
}
