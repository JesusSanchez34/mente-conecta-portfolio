import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { registerApiISEM, getHospitalesISEM } from '../../../api/register';
import { loginISEM } from '../../../api/isem/authService.isem';
import { setToken } from '../../../api/token';
import { useAuth } from '../../../hooks/useAuth';
import './RegisterISEM.css';


export function RegistroPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [listaHospitales, setListaHospitales] = useState([]);

    // 3. CARGA LOS HOSPITALES CUANDO SE ABRE LA PÁGINA
    useEffect(() => {
        if (sessionStorage.getItem('propositoVisto') !== 'true') {
            navigate('/register/isem/policies', { replace: true });
        }

        // Llamada a la API
        const cargarHospitales = async () => {
            try {
                const data = await getHospitalesISEM();
                setListaHospitales(data);
            } catch (error) {
                toast.error("No se pudo cargar la lista de hospitales");
            }
        };
        
        cargarHospitales();
    }, [navigate]);

    useEffect(() => {
        if (sessionStorage.getItem('propositoVisto') !== 'true') {
            navigate('/register/isem/policies', { replace: true });
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            curp: '',
            direccion: '',
            municipio: '',
            telefono: '',
            telefono_casa: '',
            ocupacion: '',
            genero: '',
            username: '',
            email: '',
            password: '',
            confirm_password: '',

            hospital: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es obligatorio')
                .min(2, 'Mínimo 2 caracteres'),
            apellido_paterno: Yup.string()
                .required('El apellido paterno es obligatorio'),
            apellido_materno: Yup.string()
                .required('El apellido materno es obligatorio'),
            curp: Yup.string()
                .required('El CURP es obligatorio')
                .length(18, 'El CURP debe tener exactamente 18 caracteres')
                .matches(/^[A-Z0-9]+$/, 'Solo letras mayúsculas y números'),
            direccion: Yup.string()
                .required('La dirección es obligatoria'),
            municipio: Yup.string()
                .required('El municipio es obligatorio'),
            telefono: Yup.string()
                .required('El teléfono es obligatorio')
                .matches(/^\d{10}$/, 'Debe tener exactamente 10 dígitos'),
            telefono_casa: Yup.string()
                .required('El teléfono de casa es obligatorio')
                .matches(/^\d{0,10}$/, 'Máximo 10 dígitos'),
            ocupacion: Yup.string()
                .required('La ocupación es obligatoria'),
            genero: Yup.string()
                .required('El género es obligatorio'),
            username: Yup.string()
                .required('El nombre de usuario es obligatorio')
                .min(4, 'Mínimo 4 caracteres'),
            email: Yup.string()
                .required('El correo electrónico es obligatorio')
                .email('Ingrese un correo válido'),
            password: Yup.string()
                .required('La contraseña es obligatoria')
                .min(8, 'Mínimo 8 caracteres'),
            confirm_password: Yup.string()
                .required('Confirme su contraseña')
                .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
           
            hospital: Yup.string()
                .required('Seleccione un hospital'),
        }),
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const { confirm_password, ...submitData } = values;

                await registerApiISEM(submitData);

                let loginSuccess = false;
                try {
                    const loginResponse = await loginISEM({
                        username: values.username,
                        password: values.password,
                    });

                    console.log('✅ Login automático exitoso');
                    setToken(loginResponse.access);
                    await login(loginResponse.access, 1);
                    loginSuccess = true;

                    sessionStorage.removeItem('politicasAceptadas');
                    sessionStorage.removeItem('consentimientoAceptado');
                    sessionStorage.removeItem('propositoVisto');

                    navigate('/quien-realiza');
                } catch (loginError) {
                    console.warn('⚠️ Login automático falló:', loginError);
                    loginSuccess = false;
                }

                if (!loginSuccess) {
                    sessionStorage.removeItem('politicasAceptadas');
                    sessionStorage.removeItem('consentimientoAceptado');
                    sessionStorage.removeItem('propositoVisto');
                    setShowSuccess(true);
                }
            } catch (error) {
                toast.error(error.message || 'Error al registrar usuario');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="register-isem-bg">
            <div className="register-isem-wrapper">
                {/* Stepper */}
                <div className="register-isem-stepper">
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step completed"></div>
                    <div className="register-isem-step active"></div>
                </div>

                <div className="register-isem-card">
                    <h1 className="register-isem-title">REGÍSTRATE</h1>

                    <Form onSubmit={formik.handleSubmit} className="register-isem-form">

                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <Form.Control
                                id="nombre"
                                name="nombre"
                                type="text"
                                placeholder="Nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.nombre}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.nombre}
                            </Form.Control.Feedback>
                        </div>

                        {/* Apellidos */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                <Form.Control
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    type="text"
                                    placeholder="Apellido Paterno"
                                    value={formik.values.apellido_paterno}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.apellido_paterno}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.apellido_paterno}
                                </Form.Control.Feedback>
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido_materno">Apellido Materno</label>
                                <Form.Control
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    type="text"
                                    placeholder="Apellido Materno"
                                    value={formik.values.apellido_materno}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.apellido_materno}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.apellido_materno}
                                </Form.Control.Feedback>
                            </div>
                        </div>

                        {/* CURP */}
                        <div className="form-group">
                            <label htmlFor="curp">CURP</label>
                            <Form.Control
                                id="curp"
                                name="curp"
                                type="text"
                                placeholder="CURP"
                                maxLength={18}
                                value={formik.values.curp}
                                onChange={(e) => {
                                    formik.setFieldValue('curp', e.target.value.toUpperCase());
                                }}
                                isInvalid={!!formik.errors.curp}
                                disabled={isLoading}
                            />
                            <div className="char-counter">{formik.values.curp.length}/18</div>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.curp}
                            </Form.Control.Feedback>
                        </div>

                        {/* Dirección */}
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección</label>
                            <Form.Control
                                id="direccion"
                                name="direccion"
                                type="text"
                                placeholder="Dirección"
                                value={formik.values.direccion}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.direccion}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.direccion}
                            </Form.Control.Feedback>
                        </div>

                        {/* Municipio */}
                        <div className="form-group">
                            <label htmlFor="municipio">Municipio</label>
                            <Form.Control
                                id="municipio"
                                name="municipio"
                                type="text"
                                placeholder="Municipio"
                                value={formik.values.municipio}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.municipio}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.municipio}
                            </Form.Control.Feedback>
                        </div>

                        {/* Teléfonos */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono</label>
                                <Form.Control
                                    id="telefono"
                                    name="telefono"
                                    type="text"
                                    placeholder="Teléfono"
                                    maxLength={10}
                                    value={formik.values.telefono}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        formik.setFieldValue('telefono', val);
                                    }}
                                    isInvalid={!!formik.errors.telefono}
                                    disabled={isLoading}
                                />
                                <div className="char-counter">{formik.values.telefono.length}/10</div>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.telefono}
                                </Form.Control.Feedback>
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefono_casa">Teléfono Casa</label>
                                <Form.Control
                                    id="telefono_casa"
                                    name="telefono_casa"
                                    type="text"
                                    placeholder="Teléfono Casa"
                                    maxLength={10}
                                    value={formik.values.telefono_casa}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        formik.setFieldValue('telefono_casa', val);
                                    }}
                                    isInvalid={!!formik.errors.telefono_casa}
                                    disabled={isLoading}
                                />
                                <div className="char-counter">{formik.values.telefono_casa.length}/10</div>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.telefono_casa}
                                </Form.Control.Feedback>
                            </div>
                        </div>

                        {/* Ocupación */}
                        <div className="form-group">
                            <label htmlFor="ocupacion">Ocupación</label>
                            <Form.Control
                                id="ocupacion"
                                name="ocupacion"
                                type="text"
                                placeholder="Ocupación"
                                value={formik.values.ocupacion}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.ocupacion}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.ocupacion}
                            </Form.Control.Feedback>
                        </div>

                        {/* Género y Edad */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="genero">Género</label>
                                <Form.Select
                                    id="genero"
                                    name="genero"
                                    value={formik.values.genero}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.genero}
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccione género...</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.genero}
                                </Form.Control.Feedback>
                            </div>
                            
                        </div>

                        {/* Username */}
                        <div className="form-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <Form.Control
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Nombre de usuario"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.username}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.username}
                            </Form.Control.Feedback>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <Form.Control
                                id="email"
                                name="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.email}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.email}
                            </Form.Control.Feedback>
                        </div>

                        {/* Password */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <Form.Control
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.password}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.password}
                                </Form.Control.Feedback>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm_password">Confirmar Contraseña</label>
                                <Form.Control
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Confirmar Contraseña"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.confirm_password}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.confirm_password}
                                </Form.Control.Feedback>
                            </div>
                        </div>

                        {/* Hospital */}
                        <div className="form-group">
                            <label htmlFor="hospital">Seleccione un hospital</label>
                            <Form.Select
                                id="hospital"
                                name="hospital"
                                value={formik.values.hospital}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.hospital}
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un hospital...</option>
                                {/* 4. USAMOS LA LISTA DINÁMICA DE LA API */}
                                {listaHospitales.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.nombre || h.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.hospital}
                            </Form.Control.Feedback>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="register-isem-btn-primary"
                            disabled={isLoading}
                            style={{ marginTop: '8px' }}
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
                                    Registrando...
                                </>
                            ) : (
                                'Regístrate'
                            )}
                        </button>

                        <button
                            type="button"
                            className="register-isem-btn-back"
                            onClick={() => navigate('/register/isem/purpose')}
                            disabled={isLoading}
                        >
                            Regresar
                        </button>
                    </Form>

                    <p className="register-isem-footer-text">
                        Al registrarte, aceptas los términos de uso y la política de privacidad de tu usuario
                    </p>
                </div>
            </div>

            {/* Modal de éxito */}
            {showSuccess && (
                <div className="register-success-overlay">
                    <div className="register-success-modal">
                        <div className="register-success-header">
                            <div className="register-success-icon">✓</div>
                        </div>
                        <div className="register-success-body">
                            <h3>Usuario registrado correctamente.</h3>
                            <p>Redirigiendo...</p>
                            <button
                                className="register-success-btn"
                                onClick={() => navigate('/quien-realiza')}
                            >
                                Continuar...
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
