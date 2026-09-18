import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../ui';
import { BASE_API_F1 } from '../../../utils/constants';
import './AuthForms.css';

export function RegistroEmpresa() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [nombre, setNombre] = useState('');
    const [numEmpleados, setNumEmpleados] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNCIÓN PARA REGISTRAR EMPRESA EN API
    const registerEmpresaApi = async (formData) => {
        try {
            const url = `${BASE_API_F1}/catalogo/empresas/`;

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            };

            const response = await fetch(url, params);

            let result = null;

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.log(text);
            }

            if (response.status !== 201 && response.status !== 200) {
                throw new Error(
                    result?.message ||
                    'Error al registrar la empresa'
                );
            }

            return result;

        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !numEmpleados) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);

            const data = {
                nombre_empresa: nombre,
                numero_empleados: numEmpleados,
            };

            console.log('Enviando empresa:', data);

            await registerEmpresaApi(data);

            toast.success(`Empresa "${nombre}" registrada con éxito`);

            // LIMPIAR CAMPOS
            setNombre('');
            setNumEmpleados('');

            // REGRESAR
            setTimeout(() => {
                navigate(-1);
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error al registrar empresa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">

            {/* Selector de idioma */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 99999,
                }}
            >
                <LanguageSelector lightBg={true} />
            </div>

            {/* Header */}
            <div className="auth-form-header">

                <button
                    type="button"
                    className="auth-back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Regresar"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>

                <h1 className="auth-form-title">
                    {t('company.title')}
                </h1>

                <div style={{ width: 40 }}></div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="auth-form-content">

                {/* Nombre empresa */}
                <div className="auth-input-wrapper">
                    <input
                        type="text"
                        className="auth-input"
                        placeholder={t('company.namePlaceholder')}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* Número empleados */}
                <div className="auth-input-wrapper">
                    <select
                        className="auth-select"
                        value={numEmpleados}
                        onChange={(e) => setNumEmpleados(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            {t('company.selectEmployees')}
                        </option>

                        <option value="1">
                            {t('company.employeesOption1')}
                        </option>

                        <option value="2">
                            {t('company.employeesOption2')}
                        </option>

                        <option value="3">
                            {t('company.employeesOption3')}
                        </option>

                        <option value="4">
                            {t('company.employeesOption4')}
                        </option>
                    </select>
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="auth-purple-btn"
                    disabled={loading}
                >
                    {loading
                        ? 'Registrando...'
                        : t('company.submit')}
                </button>

                {/* Footer */}
                <p className="auth-legal-footer">
                    {t('company.legalFooter')}
                </p>
            </form>
        </div>
    );
}