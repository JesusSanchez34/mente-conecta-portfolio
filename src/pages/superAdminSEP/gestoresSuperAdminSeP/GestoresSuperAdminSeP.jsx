import React, { useEffect, useState, useMemo } from 'react'
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'
import { ModalBasic } from '../../../components/ui/modalBasic'
import { RegisterGestorForm } from '../../../components/adminsep/gestores/RegisterGestorForm'
import { TableGestores } from '../../../components/adminsep/gestores/TableGestores';
import { useGestoresSEP } from "../../../hooks/sep/useGestoresSEP";
import './GestoresSuperAdminSeP.css';

const sedesPorEstadoConstant = {
  'Estado de México': {
    29: "Centro de Estudios Tecnológicos Ecatepec",
    30: "Preparatoria Oficial No. 128",
    32: "Universidad Tecnológica de Nezahualcóyotl",
    33: "CBT No. 2 Nezahualcóyotl",
    34: "UAEM - Unidad Académica Toluca",
    35: "Instituto Tecnológico de Toluca"
  },
  'Ciudad de México': {
    31: "Secundaria Técnica 55",
    36: "Escuela Secundaria Oficial No. 1",
    37: "UAM Iztapalapa - Plantel Central",
    38: "CETIS No. 53 Iztapalapa",
    39: "Secundaria Diurna No. 115",
    40: "IPN - Escuela Superior de Ingeniería (ESIME)",
    41: "Preparatoria Nacional Plantel 9 UNAM",
    42: "Facultad de Filosofía y Letras UNAM",
    43: "CBTIS No. 2 Coyoacán",
    44: "Secundaria Técnica No. 17"
  }
};

export function GestoresSuperAdminSeP() {
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [contentModal, setContentModal] = useState(null);
    const { loading, getGestores, gestores, getHospitales, hospitales } = useGestoresSEP();
    const [reload, setReload] = useState(false);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('Estado de México');
    const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
    const [gestoresFiltrados, setGestoresFiltrados] = useState([]);

    // Memoizar para evitar recálculos en cada render
    const sedesPorEstado = useMemo(() => sedesPorEstadoConstant, []);
    const sedesDelEstado = useMemo(() => sedesPorEstado[estadoSeleccionado] || {}, [estadoSeleccionado, sedesPorEstado]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const cargarDatos = async () => {
            await getGestores();
            await getHospitales();
        };
        cargarDatos();
    }, [reload]);

    // Establecer la primera sede cuando cambia el estado
    useEffect(() => {
        const primeraSede = Object.keys(sedesDelEstado)[0];
        setSedeSeleccionada(primeraSede ? Number(primeraSede) : null);
    }, [estadoSeleccionado]);

    // Filtrar gestores por sede seleccionada
    useEffect(() => {
        if (sedeSeleccionada && gestores.length > 0) {
            const filtered = gestores.filter(g => g.sede_id === sedeSeleccionada);
            setGestoresFiltrados(filtered);
        } else {
            setGestoresFiltrados([]);
        }
    }, [sedeSeleccionada, gestores]);

    const onReload = () => setReload((prev) => !prev);

    const openModal = (title, content) => {
        setTitleModal(title);
        setContentModal(content);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTitleModal("");
        setContentModal(null);
    };

    const addGestor = () => {
        openModal("Registrar Director, Profesor u Orientador", <RegisterGestorForm onClose={closeModal} onReload={onReload} />);
    };

    const viewGestor = (gestor) => {
        openModal("Información del Director, Profesor u Orientador", <RegisterGestorForm gestor={gestor} viewMode={true} onClose={closeModal} />);
    };

    return (
        <Container fluid className="gestores-container">
            <header className="header-dashboard mb-5">
                <h1>👨‍🏫 Gestión de Gestores SuperAdmin</h1>
                <p className="lead">Administración de directores, profesores y orientadores</p>
            </header>

            {/* Filtros en cascada */}
            <div className="filtros-container mb-5">
                <div className="filtro-wrapper">
                    <label className="filtro-label">📍 Seleccionar Estado:</label>
                    <select 
                        value={estadoSeleccionado}
                        onChange={(e) => setEstadoSeleccionado(e.target.value)}
                        className="filtro-select"
                    >
                        {Object.keys(sedesPorEstado).map((estado) => (
                            <option key={estado} value={estado}>
                                {estado} ({Object.keys(sedesPorEstado[estado]).length} sedes)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filtro-wrapper">
                    <label className="filtro-label">🏢 Seleccionar Sede:</label>
                    <select 
                        value={sedeSeleccionada || ''}
                        onChange={(e) => setSedeSeleccionada(Number(e.target.value))}
                        className="filtro-select"
                    >
                        {Object.entries(sedesDelEstado).map(([sedeId, sedeName]) => (
                            <option key={sedeId} value={sedeId}>
                                {sedeName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botón para agregar gestor */}
            <div className="btn-container mb-4">
                <Button className="btn-agregar" onClick={addGestor}>
                    <span className="btn-icon">➕</span>
                    Registrar Director, Profesor u Orientador
                </Button>
            </div>

            {loading && !gestores ? (
                <div className="alert alert-info mt-4">
                    <h5>Cargando gestores...</h5>
                </div>
            ) : (
                <>
                    {gestoresFiltrados.length === 0 ? (
                        <div className="alert alert-info mt-4">
                            No hay gestores registrados para la sede seleccionada.
                        </div>
                    ) : (
                        <TableGestores gestores={gestoresFiltrados} hospitales={hospitales} onViewGestor={viewGestor} />
                    )}
                </>
            )}

            <ModalBasic
                show={showModal}
                onClose={closeModal}
                title={titleModal}
                children={contentModal}
                size="lg"
            />
        </Container>
    )
}

export default GestoresSuperAdminSeP;
