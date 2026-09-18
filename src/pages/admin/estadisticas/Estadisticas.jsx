import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import { TableInterpretacionDatos } from '../../../components/admin';
import { ExtractExcel } from '../../../components/common';
import { ModalBasic } from '../../../components/ui';
import { useDashboards } from '../../../hooks';

import './Estadisticas.css';
export function Estadisticas() {

    const {
        getGeneralDashboard,
        getTotalPacientesPorHospital,
        getTotalPacientesPorInterpretacion,
        dashboardInterpretaciones,
        pacientes,
        dashboard,
    } = useDashboards();

    const [titleModal, setTitleModal] = useState(null);
    const [showModal, setshowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const openCloseModal = () => setshowModal((prev) => !prev);

    useEffect(() => {
        const getData = async () => {
            await getGeneralDashboard();
            await getTotalPacientesPorHospital();
            await getTotalPacientesPorInterpretacion();
        }
        getData()
    }, [])

    const dataRowsExcel = (row) => {
        const rows = {
            // Nombre: row.nombre,
            Edad: row.edad,
            Genero: row.genero,
            // Municipio: row.municipio,
            Escolaridad: row.escolaridad,
            // Ocupacion: row.ocupacion,
            Direccion: row.direccion,
            // Telefono_casa: row.telefono_casa,
            // Telefono_movil: row.telefono_movil,
            // Correo: row.correo,
            Escala_esquizofrenia: row.escala_esquizofrenia,
            Escala_gad7: row.escala_gad7,
            Escala_gad7_interpretacion: row.escala_gad7_interpretacion,
            Escala_phq_9: row.escala_phq_9,
            Escala_phq_9_interpretacion: row.escala_phq_9_interpretacion,
            Escala_yale_brown: row.escala_yale_brown,
            Escala_yale_brown_interpretacion: row.escala_yale_brown_interpretacion,
            Escala_drogadiccion: row.escala_drogadiccion,
            Escala_drogadiccion_interpretacion: row.escala_drogadiccion_interpretacion,
            Escala_psl5: row.escala_psl5,
            Escala_psl5_interpretacion: row.escala_psl5_interpretacion,
            Escala_columia: row.escala_columia,
            Escala_columia_interpretacion: row.escala_columia_interpretacion,
            Escala_plutchck: row.escala_plutchck,
            Escala_plutchck_interpretacion: row.escala_plutchck_interpretacion,
            Escala_acf_trauma: row.escala_acf_trauma,
            Escala_acf_trauma_interpretacion: row.escala_acf_trauma_interpretacion,
            Escala_s_global_gaf: row.escala_s_global_gaf,
            Escala_s_global_gaf_interpretacion: row.escala_s_global_gaf_interpretacion,
            Escala_reciliencia: row.escala_reciliencia,
            Escala_reciliencia_interpretacion: row.escala_reciliencia_interpretacion,
            Escala__fagerstrom: row.escala__fagerstrom,
            Escala__fagerstrom_interpretacion: row.escala__fagerstrom_interpretacion,
            Escala_audit: row.escala_audit,
            Escala_audit_interpretacion: row.escala_audit_interpretacion,
        };
        return rows;
    };

    const downloadExcel = async () => {

        if (dashboardInterpretaciones.length > 0) {
            setTitleModal("Descargar Interpretaciones")
            setContentModal(
                <ExtractExcel
                    data={dashboardInterpretaciones}
                    onClose={openCloseModal}
                    dataRowsExcel={dataRowsExcel}
                    fileName="Informe - Interpretaciones salud Mental"
                />
            );
            openCloseModal();
        }
    };
    return (
        <div>
            <Button className='button-color' onClick={() => downloadExcel()}>Descargar Excel</Button>
            {/*<TablePrincipalDashboard data={dashboard} />*/}
            <TableInterpretacionDatos data={dashboardInterpretaciones} />
            <ModalBasic
                show={showModal}
                onClose={openCloseModal}
                title={titleModal}
                children={contentModal}
                size="xl"
            />
        </div>
    )
}
