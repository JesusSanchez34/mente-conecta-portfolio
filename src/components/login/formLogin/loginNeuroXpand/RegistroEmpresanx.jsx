import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../../ui';
import { InputNX, CustomDropdownNX } from '../../../adminNX';
import { BASE_API_NX } from '../../../../utils/constants';
import './AuthFormsnx.css'

export function RegistroEmpresanx() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [nombre, setNombre] = useState('');
    const [numEmpleados, setNumEmpleados] = useState('');
    const [loading, setLoading] = useState(false);

    const [errores, setErrores] = useState({ nombre: '', numEmpleados: '' });
    const [touched, setTouched] = useState({ nombre: false, numEmpleados: false });
    const OPCIONES_EMPLEADOS = [
        { value: "1", label: "1 - 15" },
        { value: "2", label: "16 - 50" },
        { value: "3", label: "+50" }
    ];

    const registerEmpresaApi = async (formData) => {
        try {
            const url = `${BASE_API_NX}/catalogo/empresas/`;
            const params = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                throw new Error(result?.message || 'Error al registrar la empresa');
            }
            return result;
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouched({ nombre: true, numEmpleados: true });

        let hayErrores = false;
        const nuevosErrores = { nombre: '', numEmpleados: '' };

        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre de la empresa es obligatorio';
            hayErrores = true;
        }
        if (!numEmpleados) {
            nuevosErrores.numEmpleados = 'Debes seleccionar el número de empleados';
            hayErrores = true;
        }

        setErrores(nuevosErrores);

        if (hayErrores) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            const data = {
                nombre_empresa: nombre,
                numero_empleados: numEmpleados,
            };

            await registerEmpresaApi(data);
            toast.success(`Empresa "${nombre}" registrada con éxito`);

            setNombre('');
            setNumEmpleados('');
            setTouched({ nombre: false, numEmpleados: false });

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
        <div className="nx-auth-form-container">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}>
                <LanguageSelector lightBg={true} />
            </div>

            <div className="nx-auth-form-header">
                <button
                    type="button"
                    className="nx-auth-back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Regresar"
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="nx-auth-form-title">{t('company.title')}</h1>
                <div style={{ width: 40 }}></div>
            </div>

            <form onSubmit={handleSubmit} className="nx-auth-form-content">

                <InputNX
                    name="nombre"
                    placeholder={t('company.namePlaceholder')}
                    value={nombre}
                    onChange={(e) => {
                        setNombre(e.target.value);
                        if (e.target.value) setErrores(prev => ({ ...prev, nombre: '' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
                    error={errores.nombre}
                    touched={touched.nombre}
                />

                <CustomDropdownNX
                    value={numEmpleados}
                    onChange={(nuevoValor) => {
                        setNumEmpleados(nuevoValor);
                        if (nuevoValor) setErrores(prev => ({ ...prev, numEmpleados: '' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, numEmpleados: true }))}
                    options={OPCIONES_EMPLEADOS}
                    placeholder={t('company.selectEmployees')}
                    error={errores.numEmpleados}
                    touched={touched.numEmpleados}
                />

                {/* Botón */}
                <button type="submit" className="nx-auth-purple-btn" disabled={loading}>
                    {loading ? 'Registrando...' : t('company.submit')}
                </button>

                {/* Footer */}
                <p className="nx-auth-legal-footer">
                    {t('company.legalFooter')}
                </p>
            </form>
        </div>
    );
}