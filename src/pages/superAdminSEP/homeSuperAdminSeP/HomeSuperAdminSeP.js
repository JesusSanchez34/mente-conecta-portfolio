import { Container } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../hooks';
import { CardInfoNavigation } from '../../../components/common';
import { getConteoNivelRiesgoSePBySedeApi } from '../../../api/sep/gestoresSEP';

import './HomeSuperAdminSeP.css';

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

export function HomeSuperAdminSeP() {
    const { auth } = useAuth();
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('Estado de México');
    const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
    const [sedesData, setSedesData] = useState({});
    const [loading, setLoading] = useState(false);

    // Memoizar para evitar recálculos en cada render
    const sedesPorEstado = useMemo(() => sedesPorEstadoConstant, []);
    const sedesDelEstado = useMemo(() => sedesPorEstado[estadoSeleccionado] || {}, [estadoSeleccionado, sedesPorEstado]);
    const idsSedes = useMemo(() => Object.keys(sedesDelEstado), [sedesDelEstado]);

    // Inicializar sede cuando cambia el estado
    useEffect(() => {
        if (idsSedes.length > 0) {
            setSedeSeleccionada(idsSedes[0]);
        }
    }, [estadoSeleccionado]);

    // Cargar datos de la sede seleccionada
    useEffect(() => {
        const cargarDatos = async () => {
            if (!auth?.token || !sedeSeleccionada) return;

            try {
                setLoading(true);
                const data = await getConteoNivelRiesgoSePBySedeApi(Number(sedeSeleccionada), auth.token);
                setSedesData({
                    [sedeSeleccionada]: data || []
                });
            } catch (error) {
                console.error("Error cargando datos:", error);
                setSedesData({ [sedeSeleccionada]: [] });
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [sedeSeleccionada, auth?.token]);

    return (
        <Container className="container-super-admin-sep">
            <header className="header-dashboard mb-5">
                <h1>🏥 Panel de Supervisión - SEP</h1>
                <p className="lead">Sistema de Evaluación y Prevención de Riesgos</p>
            </header>

            {/* Filtros en cascada - Estado y Sede */}
            <div className="filtros-container mb-5">
                <div className="filtro-wrapper">
                    <label className="filtro-label">📍 Seleccionar Estado:</label>
                    <select 
                        className="filtro-select"
                        value={estadoSeleccionado}
                        onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    >
                        {Object.keys(sedesPorEstado).map((estado) => (
                            <option key={estado} value={estado}>
                                {estado} ({Object.keys(sedesPorEstado[estado]).length} sedes)
                            </option>
                        ))}
                    </select>
                </div>

                {idsSedes.length > 0 && (
                    <div className="filtro-wrapper">
                        <label className="filtro-label">🏢 Seleccionar Sede:</label>
                        <select 
                            className="filtro-select"
                            value={sedeSeleccionada || ''}
                            onChange={(e) => setSedeSeleccionada(e.target.value)}
                        >
                            {idsSedes.map((id) => (
                                <option key={id} value={id}>
                                    {sedesDelEstado[id]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Resumen de la Sede */}
            {sedeSeleccionada && (
                <div className="estado-resumen mb-5">
                    <div className="resumen-contenido">
                        <h2 className="resumen-titulo">{sedesDelEstado[sedeSeleccionada]}</h2>
                        <p className="resumen-subtitulo">{estadoSeleccionado}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-container-super">
                    <div className="loading-spinner-super" role="status"></div>
                    <p className="loading-text-super">Sincronizando datos...</p>
                </div>
            ) : sedeSeleccionada && sedesData[sedeSeleccionada] ? (
                <div className="sedes-container">
                    <div className="sedes-grid-super">
                        {sedesData[sedeSeleccionada].length > 0 ? (
                            sedesData[sedeSeleccionada].map((item) => (
                                <div key={item.id_cuestionario} className="sede-card-super">
                                    <div className="sede-card-header">
                                        <h4 className="sede-nombre">{item.Cuestionario}</h4>
                                    </div>
                                    <div className="sede-card-content">
                                        <CardInfoNavigation
                                            riskLevel={item.score}
                                            account={item.score}
                                            title={item.Cuestionario}
                                            subTitle={sedesDelEstado[sedeSeleccionada]}
                                            textLink="Ver Reporte"
                                            link={`/admin/super-gestor/sep/pacientes-riesgo`}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="sede-sin-datos">
                                <p>Sin datos de evaluación</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="loading-container-super">
                    <p className="loading-text-super">Selecciona una sede para ver los datos</p>
                </div>
            )}
        </Container>
    );
}

export default HomeSuperAdminSeP;
