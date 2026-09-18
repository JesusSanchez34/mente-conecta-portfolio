import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { InputForm, SelectForm } from '../../ui';
import { useGestores } from "../../../hooks/conasama/useGestores";

export function RegisterGestorForm(props) {
    const { onClose, onReload, gestor, viewMode } = props;
    const [catalogs, setCatalogs] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const { getCatalogosGestores, getHospitales, nuevoGestor } = useGestores();

    useEffect(() => {
        (async () => {
            try {

                const result = await getCatalogosGestores();
                const host = await getHospitales();
                setCatalogs(result);
                setHospitals(host);
            } catch (error) {
                toast.error("No se pudieron cargar los catálogos");
            }
        })();
    }, []);

    const getOptions = (name) => {
        const catalog = catalogs.find((c) => c.nombre === name);
        return catalog ? catalog.data : [];
    };

    const formik = useFormik({
        initialValues: initialValues(gestor),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {
                await nuevoGestor(formValue);
                toast.success('Gestor registrado correctamente');
                onReload();
                onClose();
            } catch (error) {
                toast.error(error.message);
            }
        },
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Nombre"
                        nameInput="nombre"
                        placeHolderInput="Nombre"
                        valueInput={formik.values.nombre}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.nombre}
                        touched={formik.touched.nombre}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Apellido Paterno"
                        nameInput="apellido_paterno"
                        placeHolderInput="Apellido Paterno"
                        valueInput={formik.values.apellido_paterno}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.apellido_paterno}
                        touched={formik.touched.apellido_paterno}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Apellido Materno"
                        nameInput="apellido_materno"
                        placeHolderInput="Apellido Materno"
                        valueInput={formik.values.apellido_materno}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.apellido_materno}
                        touched={formik.touched.apellido_materno}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Email"
                        nameInput="email"
                        placeHolderInput="example@mail.com"
                        valueInput={formik.values.email}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.email}
                        touched={formik.touched.email}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    {!viewMode && <InputForm
                        label="Contraseña"
                        nameInput="password"
                        type="password"
                        placeHolderInput="********"
                        valueInput={formik.values.password}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.password}
                        touched={formik.touched.password}
                        disabled={viewMode}
                    />}
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Celular"
                        nameInput="celular_paciente"
                        placeHolderInput="5512345678"
                        valueInput={formik.values.celular_paciente}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.celular_paciente}
                        touched={formik.touched.celular_paciente}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <InputForm
                        label="Matrícula Laboral"
                        nameInput="matricula_laboral"
                        placeHolderInput="0000000000"
                        valueInput={formik.values.matricula_laboral}
                        onChangeInput={formik.handleChange}
                        error={formik.errors.matricula_laboral}
                        touched={formik.touched.matricula_laboral}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Sede"
                        name="sede_id"
                        options={hospitals.map(h => ({ id: h.id, opcion: h.nombre }))}
                        value={formik.values.sede_id}
                        onChange={formik.handleChange}
                        error={formik.errors.sede_id}
                        touched={formik.touched.sede_id}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <hr />
            <h5 className="text-center mb-3">Información Profesional</h5>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Grado"
                        name="id_grado"
                        options={getOptions("Grado")}
                        value={formik.values.id_grado}
                        onChange={formik.handleChange}
                        error={formik.errors.id_grado}
                        touched={formik.touched.id_grado}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Tipo de Contratación"
                        name="id_contratacion"
                        options={getOptions("Tipo de contratación")}
                        value={formik.values.id_contratacion}
                        onChange={formik.handleChange}
                        error={formik.errors.id_contratacion}
                        touched={formik.touched.id_contratacion}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Perfil"
                        name="id_perfil"
                        options={getOptions("Perfil")}
                        value={formik.values.id_perfil}
                        onChange={formik.handleChange}
                        error={formik.errors.id_perfil}
                        touched={formik.touched.id_perfil}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Nivel"
                        name="id_nivel"
                        options={getOptions("Nivel")}
                        value={formik.values.id_nivel}
                        onChange={formik.handleChange}
                        error={formik.errors.id_nivel}
                        touched={formik.touched.id_nivel}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Cargo"
                        name="id_cargo"
                        options={getOptions("Cargo")}
                        value={formik.values.id_cargo}
                        onChange={formik.handleChange}
                        error={formik.errors.id_cargo}
                        touched={formik.touched.id_cargo}
                        disabled={viewMode}
                    />
                </Col>
                <Col xs={12} md={6} className="mb-3">
                    <SelectForm
                        label="Profesión"
                        name="id_profesion"
                        options={getOptions("Profesión")}
                        value={formik.values.id_profesion}
                        onChange={formik.handleChange}
                        error={formik.errors.id_profesion}
                        touched={formik.touched.id_profesion}
                        disabled={viewMode}
                    />
                </Col>
            </Row>

            {!viewMode && (
                <div className="d-grid gap-2 mt-4">
                    <Button type="submit" variant="primary" style={{ background: "#4DB6AC", borderColor: "#4DB6AC" }}>
                        Registrar Gestor
                    </Button>
                </div>
            )}
        </Form>
    );
}

function initialValues(gestor) {
    return {
        nombre: gestor?.nombre || '',
        apellido_paterno: gestor?.apellido_paterno || '',
        apellido_materno: gestor?.apellido_materno || '',
        email: gestor?.email || '',
        password: gestor ? '********' : '',
        celular_paciente: gestor?.celular_paciente || '',
        matricula_laboral: gestor?.matricula_laboral || '',
        sede_id: gestor?.sede_id || '',
        is_active: gestor ? gestor.is_active : true,
        estatus: gestor?.estatus || 1,
        id_grado: gestor?.id_grado || '',
        id_contratacion: gestor?.id_contratacion || '',
        id_clues: gestor?.id_clues || 0,
        id_perfil: gestor?.id_perfil || '',
        id_nivel: gestor?.id_nivel || '',
        id_cargo: gestor?.id_cargo || '',
        id_profesion: gestor?.id_profesion || '',
    };
}

function newSchema() {
    return {
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido_paterno: Yup.string().required('El apellido paterno es obligatorio'),
        apellido_materno: Yup.string(),
        email: Yup.string().email('Email no válido').required('El email es obligatorio'),
        password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es obligatoria'),
        celular_paciente: Yup.string().min(10, 'El celular debe tener al menos 10 caracteres').max(10, 'El celular debe tener al menos 10 caracteres').required('El celular es obligatorio'),
        matricula_laboral: Yup.string().min(10, 'La matrícula debe tener al menos 10 caracteres').max(10, 'La matrícula debe tener al menos 10 caracteres').required('La matrícula es obligatoria'),
        sede_id: Yup.number().required('El ID de sede es obligatorio'),
        id_grado: Yup.number().required('El grado es obligatorio'),
        id_contratacion: Yup.number().required('El tipo de contratación es obligatorio'),
        id_perfil: Yup.number().required('El perfil es obligatorio'),
        id_nivel: Yup.number().required('El nivel es obligatorio'),
        id_cargo: Yup.number().required('El cargo es obligatorio'),
        id_profesion: Yup.number().required('La profesión es obligatoria'),
    };
}
