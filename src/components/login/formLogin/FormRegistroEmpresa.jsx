import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Icono_home from '../../../assets/img/Icono_home.jpeg';
import { InputForm } from '../../ui';
import { registerEmpresaApi } from '../../../api/user';
import { useTranslation } from 'react-i18next';
import './FormLoginSeguridad.css';

export function FormRegistroEmpresa(props) {
    const { onBack } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const empleadosOptions = [
        { value: '1-15', label: t('register_company.employees_range_1', '1 - 15 empleados') },
        { value: '16-50', label: t('register_company.employees_range_2', '16 - 50 empleados') },
        { value: '50+', label: t('register_company.employees_range_3', '50+ empleados') },
    ];

    const formik = useFormik({
        initialValues: {
            nombreEmpresa: '',
            numeroEmpleados: '',
        },
        validationSchema: Yup.object({
            nombreEmpresa: Yup.string()
                .required(t('register_company.validation_name_req', 'Por favor ingresa el nombre de la empresa'))
                .min(3, t('register_company.validation_name_min', 'El nombre debe tener al menos 3 caracteres')),
            numeroEmpleados: Yup.string().required(
                t('register_company.validation_employees_req', 'Por favor selecciona el número de empleados'),
            ),
        }),
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                console.log('Datos de empresa:', values);
                await registerEmpresaApi(values);
                toast.success(t('register_company.success_alert', 'Empresa registrada exitosamente'));
                if (onBack) onBack();
            } catch (error) {
                toast.error(error.message || t('register_company.error_alert', 'Error al registrar la empresa'));
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="login-bg">
            <div className="login-wrapper">
                {/* HEADER */}
                <div className="login-header">
                    <h2>{t('register_company.title', 'Registra tu Empresa')}</h2>
                    <p>{t('register_company.subtitle', 'Completa los datos de tu empresa')}</p>

                    <div className="logo-circle">
                        <img src={Icono_home} alt="logo" />
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="login-card">
                    <Form onSubmit={formik.handleSubmit}>
                        <InputForm
                            label={t('register_company.company_name', 'Nombre de la Empresa')}
                            labelDirection="left"
                            nameInput="nombreEmpresa"
                            placeHolderInput={t('register_company.company_placeholder', 'Mi Empresa S.A.')}
                            valueInput={formik.values.nombreEmpresa}
                            onChangeInput={formik.handleChange}
                            type="text"
                            error={formik.errors.nombreEmpresa}
                            touched={formik.touched.nombreEmpresa}
                            disabled={isLoading}
                        />

                        {/* Contenedor de selección de empleados */}
                        <div className="form-group mb-3">
                            <label
                                className="form-label text-start"
                                style={{ color: '#04547B', fontWeight: '500' }}
                            >
                                {t('register_company.employees_label', 'Selecciona el número de empleados')}
                            </label>
                            <select
                                name="numeroEmpleados"
                                value={formik.values.numeroEmpleados}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isLoading}
                                className="empleados-select"
                            >
                                <option value="">{t('register_company.employees_default', 'Elige una opción')}</option>
                                {empleadosOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.numeroEmpleados &&
                                formik.touched.numeroEmpleados && (
                                    <div
                                        className="text-danger mt-2"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {formik.errors.numeroEmpleados}
                                    </div>
                                )}
                        </div>
                        <label style={{ fontSize: '0.85rem', color: '#666' }}>
                            {t('register_company.agreement_label', 'Al registrar tu empresa, aceptas que los usuarios puedan darse de alta con ella para realizar sus test')}
                        </label>

                        {/* Botón Registrar */}
                        <Button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.7 : 1 }}
                        >
                            {isLoading ? t('register_company.registering_btn', 'Registrando...') : t('register_company.register_btn', 'Registrar Empresa')}
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
                    🔒 {t('login.privacy_footer', 'Tu privacidad es nuestra prioridad. Todos tus datos están cifrados y protegidos.')}
                </div>
            </div>
        </div>
    );
}
