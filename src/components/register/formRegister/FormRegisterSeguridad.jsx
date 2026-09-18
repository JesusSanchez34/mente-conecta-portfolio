import React, { useState, useEffect } from 'react';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { getEmpresasMCPSApi, registerApiMCSP } from '../../../api/user';
import { useTranslation } from 'react-i18next';
import './FormRegisterSeguridad.css';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FormRegisterSeguridad({ showHeader = true, onSuccess }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        curp: '',
        correo: '',
        password: '',
        confirmPassword: '',
        edad: '',
        empresa: '',
        aceptaTerminos: false,
        aceptaProposito: false,
    });

    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [pageView, setPageView] = useState('form');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(false);

    useEffect(() => {
        async function fetchEmpresas() {
            setIsLoadingEmpresas(true);
            try {
                const response = await getEmpresasMCPSApi();
                const list = response?.value || response || [];
                setEmpresas(list);
            } catch (error) {
                console.error('Error al cargar empresas:', error);
            } finally {
                setIsLoadingEmpresas(false);
            }
        }
        fetchEmpresas();
    }, []);


    const validateField = (name, value, currentData = formData) => {
        const trimmedValue = typeof value === 'string' ? value.trim() : value;

        switch (name) {
            case 'nombre':
                if (!trimmedValue) return t('register.validation.name_req', 'Ingresa tu nombre');
                if (trimmedValue.length < 2)
                    return t('register.validation.name_min', 'El nombre debe tener al menos 2 caracteres');
                return '';
            case 'apellidoPaterno':
                if (!trimmedValue) return t('register.validation.paternal_req', 'Ingresa tu apellido paterno');
                if (trimmedValue.length < 2)
                    return t('register.validation.paternal_min', 'El apellido paterno debe tener al menos 2 caracteres');
                return '';
            case 'apellidoMaterno':
                if (!trimmedValue) return t('register.validation.maternal_req', 'Ingresa tu apellido materno');
                if (trimmedValue.length < 2)
                    return t('register.validation.maternal_min', 'El apellido materno debe tener al menos 2 caracteres');
                return '';
            case 'curp':
                if (!trimmedValue) return t('register.validation.curp_req', 'Ingresa tu CURP');
                if (trimmedValue.length !== 18)
                    return t('register.validation.curp_len', 'La CURP debe tener 18 caracteres');
                return '';
            case 'correo':
                if (!trimmedValue) return t('register.validation.email_req', 'Ingresa tu correo electrónico');
                if (!emailRegex.test(trimmedValue))
                    return t('register.validation.email_invalid', 'Ingresa un correo válido');
                return '';
            case 'password':
                if (!value) return t('register.validation.pass_req', 'Ingresa una contraseña');
                if (value.length < 8)
                    return t('register.validation.pass_min', 'La contraseña debe tener al menos 8 caracteres');
                if (
                    currentData.confirmPassword &&
                    value !== currentData.confirmPassword
                )
                    return t('register.validation.pass_match', 'Las contraseñas no coinciden');
                return '';
            case 'confirmPassword':
                if (!value) return t('register.validation.confirm_req', 'Confirma tu contraseña');
                if (value.length < 8)
                    return t('register.validation.pass_min', 'La contraseña debe tener al menos 8 caracteres');
                if (value !== currentData.password)
                    return t('register.validation.pass_match', 'Las contraseñas no coinciden');
                return '';
            case 'edad':
                if (!value) return t('register.validation.age_req', 'Selecciona tu edad');
                return '';
            case 'empresa':
                if (!value) return t('register.validation.company_req', 'Selecciona una empresa');
                return '';
            case 'aceptaTerminos':
                if (!value) return t('register.validation.terms_req', 'Debes aceptar los términos y condiciones');
                return '';
            case 'aceptaProposito':
                if (!value) return t('register.validation.purpose_req', 'Debes aceptar el propósito de uso de datos');
                return '';
            default:
                return '';
        }
    };

    const validateAll = (data) => {
        const errors = {};

        [
            'nombre',
            'apellidoPaterno',
            'apellidoMaterno',
            'curp',
            'correo',
            'password',
            'confirmPassword',
            'edad',
            'empresa',
            'aceptaTerminos',
            'aceptaProposito',
        ].forEach((name) => {
            const error = validateField(name, data[name], data);
            if (error) {
                errors[name] = error;
            }
        });

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        const updatedFormData = {
            ...formData,
            [name]: fieldValue,
        };

        const updatedErrors = {
            ...formErrors,
            [name]: validateField(name, fieldValue, updatedFormData),
        };

        if (name === 'password' || name === 'confirmPassword') {
            updatedErrors.password = validateField(
                'password',
                updatedFormData.password,
                updatedFormData,
            );
            updatedErrors.confirmPassword = validateField(
                'confirmPassword',
                updatedFormData.confirmPassword,
                updatedFormData,
            );
        }

        Object.keys(updatedErrors).forEach((key) => {
            if (!updatedErrors[key]) {
                delete updatedErrors[key];
            }
        });

        setFormData(updatedFormData);
        setFormErrors(updatedErrors);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const error = validateField(name, formData[name], formData);

        setTouched({
            ...touched,
            [name]: true,
        });
        setFormErrors({
            ...formErrors,
            ...(error ? { [name]: error } : {}),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateAll(formData);
        setTouched({
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
            curp: true,
            correo: true,
            password: true,
            confirmPassword: true,
            edad: true,
            empresa: true,
            aceptaTerminos: true,
            aceptaProposito: true,
        });
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        setIsLoading(true);
        try {
            console.log('Datos del formulario enviado al back:', formData);
            const result = await registerApiMCSP(formData);
            console.log('API Registration response:', result);
            
            // Activate success modal
            setShowSuccessModal(true);
            toast.success(t('register.success_title', '¡Usuario registrado correctamente!'));
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            toast.error(t('register.error_message', 'Error al registrar el usuario: ') + (error.message || 'Intente de nuevo.'));
        } finally {
            setIsLoading(false);
            console.log('Registration submission finished.');
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
                <label htmlFor="nombre">{t('register.name', 'Nombre')}</label>
                <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.name_placeholder', 'Ingresa tu nombre')}
                    className={
                        formErrors.nombre && touched.nombre ? 'invalid' : ''
                    }
                />
                {formErrors.nombre && touched.nombre && (
                    <div className="error-message">{formErrors.nombre}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="apellidoPaterno">{t('register.paternal_last_name', 'Apellido Paterno')}</label>
                <input
                    id="apellidoPaterno"
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.paternal_placeholder', 'Ingresa tu apellido paterno')}
                    className={
                        formErrors.apellidoPaterno && touched.apellidoPaterno
                            ? 'invalid'
                            : ''
                    }
                />
                {formErrors.apellidoPaterno && touched.apellidoPaterno && (
                    <div className="error-message">
                        {formErrors.apellidoPaterno}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="apellidoMaterno">{t('register.maternal_last_name', 'Apellido Materno')}</label>
                <input
                    id="apellidoMaterno"
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.maternal_placeholder', 'Ingresa tu apellido materno')}
                    className={
                        formErrors.apellidoMaterno && touched.apellidoMaterno
                            ? 'invalid'
                            : ''
                    }
                />
                {formErrors.apellidoMaterno && touched.apellidoMaterno && (
                    <div className="error-message">
                        {formErrors.apellidoMaterno}
                    </div>
                )}
            </div>

            <div className="form-group curp-container">
                <label htmlFor="curp">{t('register.curp', 'CURP')}</label>
                <input
                    id="curp"
                    type="text"
                    name="curp"
                    value={formData.curp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.curp_placeholder', 'Ingresa tu CURP')}
                    maxLength="18"
                    className={formErrors.curp && touched.curp ? 'invalid' : ''}
                />
                <span className="curp-count">{formData.curp.length}/18</span>
                {formErrors.curp && touched.curp && (
                    <div className="error-message">{formErrors.curp}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="correo">{t('register.email', 'Correo Electrónico')}</label>
                <input
                    id="correo"
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.email_placeholder', 'Ingresa tu correo')}
                    className={
                        formErrors.correo && touched.correo ? 'invalid' : ''
                    }
                />
                {formErrors.correo && touched.correo && (
                    <div className="error-message">{formErrors.correo}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="password">{t('register.password', 'Contraseña')}</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.password_placeholder', 'Ingresa tu contraseña')}
                    className={
                        formErrors.password && touched.password ? 'invalid' : ''
                    }
                />
                {formErrors.password && touched.password && (
                    <div className="error-message">{formErrors.password}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">{t('register.confirm_password', 'Confirmar Contraseña')}</label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('register.confirm_placeholder', 'Confirma tu contraseña')}
                    className={
                        formErrors.confirmPassword && touched.confirmPassword
                            ? 'invalid'
                            : ''
                    }
                />
                {formErrors.confirmPassword && touched.confirmPassword && (
                    <div className="error-message">
                        {formErrors.confirmPassword}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="edad">{t('register.age', 'Edad')}</label>
                <select
                    id="edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={formErrors.edad && touched.edad ? 'invalid' : ''}
                >
                    <option value="">{t('register.age_select', 'Seleccione una edad...')}</option>
                    {[...Array(83)].map((_, i) => (
                        <option key={i + 18} value={i + 18}>
                            {i + 18}
                        </option>
                    ))}
                </select>
                {formErrors.edad && touched.edad && (
                    <div className="error-message">{formErrors.edad}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="empresa">{t('register.company', 'Empresa')}</label>
                <select
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                        formErrors.empresa && touched.empresa ? 'invalid' : ''
                    }
                >
                    <option value="">
                        {isLoadingEmpresas
                            ? t('register.company_loading', 'Cargando empresas...')
                            : t('register.company_select', 'Selecciona una Empresa...')}
                    </option>
                    {empresas.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.nombre}
                        </option>
                    ))}

                </select>
                {formErrors.empresa && touched.empresa && (
                    <div className="error-message">{formErrors.empresa}</div>
                )}
            </div>

            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="checkbox-text">
                    <label htmlFor="aceptaTerminos">{t('register.accept_terms', 'Acepta los')}</label>
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => setPageView('terms')}
                    >
                        {t('register.terms_link', 'Términos y Condiciones')}
                    </button>
                </div>
            </div>
            {formErrors.aceptaTerminos && touched.aceptaTerminos && (
                <div className="checkbox-error">
                    {formErrors.aceptaTerminos}
                </div>
            )}

            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="aceptaProposito"
                    name="aceptaProposito"
                    checked={formData.aceptaProposito}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="checkbox-text">
                    <label htmlFor="aceptaProposito">{t('register.accept_purpose', 'Acepto el')}</label>
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => setPageView('purpose')}
                    >
                        {t('register.purpose_link', 'Propósito de uso de datos')}
                    </button>
                </div>
            </div>
            {formErrors.aceptaProposito && touched.aceptaProposito && (
                <div className="checkbox-error">
                    {formErrors.aceptaProposito}
                </div>
            )}

            <button type="submit" className="register-btn" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: '8px' }}
                        />
                        {t('register.registering', 'Registrando...')}
                    </>
                ) : (
                    t('register.register_btn', 'Registrate')
                )}
            </button>

            {showHeader && (
                <p className="register-footer">
                    {t('register.footer', 'Al registrarte, aceptas los terminos de uso y la politica de privacidad de tu usuario')}
                </p>
            )}
        </form>
    );

    const renderPageHeader = (title, description) => (
        <div className="register-page-header">
            <button
                type="button"
                className="back-btn"
                onClick={() => setPageView('form')}
                title={t('login.back_btn', 'Regresar')}
            >
                <FaArrowLeft size={16} />
            </button>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );

    const renderPageContent = (sections) => (
        <div className="page-content">
            {sections.map((section) => (
                <div key={section.title} className="page-section">
                    <h4>{section.title}</h4>
                    {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                    {section.list && (
                        <ul>
                            {section.list.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );

    if (pageView === 'terms') {
        return (
            <div
                className={
                    showHeader
                        ? 'register-card register-page-card'
                        : 'register-form-wrapper'
                }
            >
                {renderPageHeader(
                    t('register.terms.header_title', 'Términos y Condiciones'),
                    t('register.terms.header_subtitle', 'Revisa los términos y condiciones antes de continuar con tu registro.'),
                )}
                {renderPageContent([
                    {
                        title: t('register.terms.intro_title', '1. Introducción'),
                        paragraphs: [
                            t('register.terms.intro_p1', 'Bienvenido a Mente Conecta. Estos términos y condiciones regulan el uso de nuestro sitio web y servicios. Al utilizar nuestro sitio, aceptas estos términos en su totalidad.'),
                        ],
                    },
                    {
                        title: t('register.terms.collection_title', '2. Recopilación de Datos'),
                        paragraphs: [
                            t('register.terms.collection_p1', 'Recopilamos información personal que incluye: nombre, correo electrónico, información demográfica y datos de salud mental cuando los proporciona voluntariamente a través de cuestionarios.'),
                        ],
                    },
                    {
                        title: t('register.terms.use_title', '3. Uso de Datos'),
                        paragraphs: [
                            t('register.terms.use_p1', 'Los datos recopilados se utilizan para: mejorar nuestros servicios, análisis de salud mental, investigación médica autorizada y comunicación con usuarios sobre actualizaciones de servicios.'),
                        ],
                    },
                    {
                        title: t('register.terms.sharing_title', '4. Compartición de Datos'),
                        paragraphs: [
                            t('register.terms.sharing_p1', 'No compartimos datos personales con terceros sin consentimiento explícito, excepto cuando sea requerido por ley o para profesionales de salud mental autorizados.'),
                        ],
                    },
                    {
                        title: t('register.terms.security_title', '5. Seguridad'),
                        paragraphs: [
                            t('register.terms.security_p1', 'Implementamos medidas de seguridad técnicas y administrativas para proteger sus datos contra acceso no autorizado, alteración, divulgación o destrucción.'),
                        ],
                    },
                    {
                        title: t('register.terms.rights_title', '6. Derechos del Usuario'),
                        paragraphs: [
                            t('register.terms.rights_p1', 'Tiene derecho a acceder, rectificar, actualizar o solicitar la eliminación de su información personal. Para ejercer estos derechos, contacte a nuestro equipo de privacidad.'),
                        ],
                    },
                    {
                        title: t('register.terms.contact_title', '7. Contacto'),
                        paragraphs: [
                            t('register.terms.contact_p1', 'Si tiene preguntas sobre estos términos, contacte a: privacidad@menteconecta.com'),
                        ],
                    },
                ])}
            </div>
        );
    }

    if (pageView === 'purpose') {
        return (
            <div
                className={
                    showHeader
                        ? 'register-card register-page-card'
                        : 'register-form-wrapper'
                }
            >
                {renderPageHeader(
                    t('register.purpose.header_title', 'Propósito de Uso de Datos'),
                    t('register.purpose.header_subtitle', 'Consulta por qué necesitamos tus datos y cómo los utilizaremos en la plataforma.'),
                )}
                {renderPageContent([
                    {
                        title: t('register.purpose.what_title', '¿Qué es Mente Conecta?'),
                        paragraphs: [
                            t('register.purpose.what_p1', 'Mente Conecta es una plataforma de evaluación y seguimiento de salud mental diseñada para proporcionar herramientas de diagnóstico y apoyo a usuarios en contextos corporativos, educativos y de investigación.'),
                        ],
                    },
                    {
                        title: t('register.purpose.why_title', '¿Por qué necesitamos sus datos?'),
                        paragraphs: [
                            t('register.purpose.why_p1', 'Recopilamos información de salud mental para: evaluar su bienestar psicológico, proporcionar recomendaciones personalizadas, contribuir a investigaciones en salud mental, y mejorar continuamente nuestros servicios.'),
                        ],
                    },
                    {
                        title: t('register.purpose.cuestionarios_title', '¿Qué cuestionarios incluye?'),
                        paragraphs: [
                            t('register.purpose.cuestionarios_p1', 'Mente Conecta incluye cuestionarios estandarizados de evaluación de:'),
                        ],
                        list: [
                            t('register.purpose.cuestionarios_item1', 'Depresión y ansiedad'),
                            t('register.purpose.cuestionarios_item2', 'Estrés y sobrecarga laboral'),
                            t('register.purpose.cuestionarios_item3', 'Burnout profesional'),
                            t('register.purpose.cuestionarios_item4', 'Bienestar general'),
                            t('register.purpose.cuestionarios_item5', 'Riesgos psicosociales'),
                        ],
                    },
                    {
                        title: t('register.purpose.confidentiality_title', 'Confidencialidad y Protección'),
                        paragraphs: [
                            t('register.purpose.confidentiality_p1', 'Sus datos están protegidos bajo encriptación de nivel corporativo. Solo personal autorizado puede acceder a la información, y nunca se compartirá con terceros sin su consentimiento explícito.'),
                        ],
                    },
                    {
                        title: t('register.purpose.consent_title', 'Su Consentimiento'),
                        paragraphs: [
                            t('register.purpose.consent_p1', 'Al registrarse, consiente que sus respuestas se utilicen para los propósitos descritos. Puede revocar este consentimiento en cualquier momento contactando a nuestro equipo de soporte.'),
                        ],
                    },
                ])}
            </div>
        );
    }

    return (
        <>
            <div
                className={
                    showHeader ? 'register-card' : 'register-form-wrapper'
                }
            >
                {showHeader && (
                    <div className="register-header">
                        <h2>{t('register.title', 'Regístrate')}</h2>
                        <p>{t('register.subtitle_longer', 'Crea tu cuenta y accede a tus resultados.')}</p>
                    </div>
                )}
                {renderForm()}
            </div>

            <Modal
                show={showSuccessModal}
                centered
                backdrop="static"
                keyboard={false}
                className="success-modal"
                backdropClassName="success-modal-backdrop"
                style={{ zIndex: 100000 }}
            >
                <Modal.Body className="success-modal-body">
                    <div className="success-checkmark">
                        <svg
                             width="80"
                             height="80"
                             viewBox="0 0 80 80"
                             fill="none"
                        >
                            <circle cx="40" cy="40" r="40" fill="#1abc9c" />
                            <path
                                d="M25 40L35 50L55 30"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3>{t('register.success_title', 'Usuario registrado correctamente.')}</h3>
                    <p>{t('register.success_subtitle', 'Éxito')}</p>
                    <Button
                        className="success-modal-btn"
                        onClick={() => {
                            setShowSuccessModal(false);
                            if (onSuccess) {
                                onSuccess();
                            } else {
                                navigate('/');
                            }
                        }}
                    >
                        {t('register.success_continue', 'Continuar...')}
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}
