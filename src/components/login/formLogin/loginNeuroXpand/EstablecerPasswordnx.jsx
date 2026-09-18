import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { LanguageSelector } from '../../../ui';
import { setNewPasswordNeuroXpand } from '../../../../api/user';
import { InputNX, LoaderNX } from '../../../adminNX';

import './AuthFormsnx.css';

const EyeIcon = ({ visible }) => visible ? (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
) : (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export function EstablecerPasswordnx() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const email = location.state?.email || '';

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Falta información del correo. Regresando...");
            navigate('/recuperar-password-neuroXpand');
        }
    }, [email, navigate]);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'La contraseña debe tener al menos 8 caracteres')
                .required('La contraseña es obligatoria'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
                .required('Confirma tu contraseña')
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await setNewPasswordNeuroXpand(email, values.password);
                toast.success("Contraseña actualizada exitosamente.");
                setTimeout(() => {
                    navigate('/login-neuroXpand');
                }, 2000);
            } catch (error) {
                toast.error(error.message || "Error al restablecer la contraseña");
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="nx-auth-form-container">
            <LoaderNX
                isOpen={isLoading}
                title="Guardando contraseña..."
                message="Actualizando tus credenciales de acceso"
            />

            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}>
                <LanguageSelector lightBg={true} />
            </div>

            <div className="nx-auth-form-header">
                <button type="button" className="nx-auth-back-btn" onClick={() => navigate(-1)} aria-label="Regresar">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="nx-auth-form-title">Nueva contraseña</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={formik.handleSubmit} className="nx-auth-form-content">
                <p className="nx-auth-form-description">
                    Establece tu nueva contraseña para {email}
                </p>

                <div className="nx-auth-input-wrapper">
                    <InputNX
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
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

                <div className="nx-auth-input-wrapper" style={{ marginTop: '15px' }}>
                    <InputNX
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        {...formik.getFieldProps('confirmPassword')}
                        error={formik.errors.confirmPassword}
                        touched={formik.touched.confirmPassword}
                        disabled={isLoading}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                style={{ border: 'none', background: 'none', padding: 0, cursor: isLoading ? 'default' : 'pointer', opacity: isLoading ? 0.5 : 0.7 }}
                            >
                                <EyeIcon visible={showConfirmPassword} />
                            </button>
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="nx-auth-purple-btn"
                    style={{ marginTop: '30px', opacity: isLoading ? 0.7 : 1 }}
                    disabled={isLoading}
                >
                    Guardar contraseña
                </button>
            </form>
        </div>
    );
}