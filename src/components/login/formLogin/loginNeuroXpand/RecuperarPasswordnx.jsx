import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LanguageSelector } from '../../../ui';
import { requestPasswordResetNeuroXpand } from '../../../../api/user';
import { InputNX, LoaderNX } from '../../../adminNX';
import './AuthFormsnx.css'

export function RecuperarPasswordnx() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'El correo debe contener un "@", un dominio y terminar con un punto seguido de una extensión (ej. .com, .mx)'
                )
                .required('El correo electrónico es obligatorio')
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await requestPasswordResetNeuroXpand(values.email);
                toast.success(`Se ha enviado un enlace de recuperación a: ${values.email}`);

                setTimeout(() => {
                    navigate('/verificar-codigo-neuroXpand', { state: { email: values.email } });
                }, 2000);
            } catch (error) {
                toast.error(error.message || "Error al solicitar recuperación de contraseña");
                setIsLoading(false);
            }
        }
    });
    return (
        <div className="nx-auth-form-container">

            <LoaderNX
                isOpen={isLoading}
                title={t('recovery.sending', { defaultValue: 'Enviando enlace...' })}
                message="Validando tu correo en el sistema"
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

                <h1 className="nx-auth-form-title">{t('recovery.title')}</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={formik.handleSubmit} className="nx-auth-form-content">
                <p className="nx-auth-form-description">
                    {t('recovery.description')}
                </p>
                <div className="nx-auth-input-wrapper">
                    <InputNX
                        type="email"
                        placeholder={t('recovery.emailPlaceholder')}
                        {...formik.getFieldProps('email')}
                        error={formik.errors.email}
                        touched={formik.touched.email}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="nx-auth-submit-btn"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'default' : 'pointer' }}
                >
                    {t('recovery.submit')}
                </button>
            </form>
        </div>
    );
}