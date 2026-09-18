import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../hooks";
import { useNivelRiesgoBySedeSeP } from "../../../hooks/sep";
import { Container } from 'react-bootstrap';
import { TableNivelRiesgoBySede } from "../../../components/adminsep/dashboard/tableNivelRiesgoBySede/TableNivelRiesgoBySede";
import './PacientesSuperAdminSeP.css';

const sedesPorEstado = {
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

/**
 * Página de Pacientes en Riesgo para SuperGestores de SEP
 * Muestra pacientes identificados en riesgo por sede
 * 
 * Acceso: is_superuser === true (SuperGestor)
 * Protección: RoleRoute allowSuper
 */
export function PacientesSuperAdminSeP() {
  const { auth } = useAuth();
  const { dataBySede, loadingBySede, getSedeData } =
    useNivelRiesgoBySedeSeP();

  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Estado de México');
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);

  // Memoizar para evitar que se recalcule en cada renderizado
  const sedesDelEstado = useMemo(() => sedesPorEstado[estadoSeleccionado] || {}, [estadoSeleccionado]);
  const idsSedes = useMemo(() => Object.keys(sedesDelEstado), [sedesDelEstado]);

  // Establecer la primera sede cuando cambia el estado
  useEffect(() => {
    if (idsSedes.length > 0) {
      setSedeSeleccionada(Number(idsSedes[0]));
    }
  }, [estadoSeleccionado]);

  // Cargar datos de la sede seleccionada
  useEffect(() => {
    if (!sedeSeleccionada) return;

    // Si ya está cargando, no hacer nada
    if (loadingBySede[sedeSeleccionada]) {
      return;
    }

    // Si ya tiene datos, no hacer nada
    if (dataBySede[sedeSeleccionada]) {
      return;
    }

    // Cargar datos
    getSedeData(sedeSeleccionada).catch(err => {
      console.error(`Error al cargar datos para sede ${sedeSeleccionada}:`, err);
    });
  }, [sedeSeleccionada]);

  return (
    <Container fluid className="pacientes-riesgo-container">
      <header className="header-dashboard mb-5">
        <h1>👥 Estudiantes en Grupo de Riesgo por Sede</h1>
        <p className="lead">Identificación y seguimiento de casos en riesgo</p>
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

      {loadingBySede[sedeSeleccionada] ? (
        <div className="alert alert-info mt-4">
          <h5>Cargando datos de la sede...</h5>
        </div>
      ) : (
        <TableNivelRiesgoBySede
          dataBySede={dataBySede}
          sedesIds={idsSedes}
          nombresSedes={sedesDelEstado}
          activeSede={sedeSeleccionada}
          onChangeSede={setSedeSeleccionada}
          hideSedeTabs={true}
        />
      )}
    </Container>
  );
}

export default PacientesSuperAdminSeP;
