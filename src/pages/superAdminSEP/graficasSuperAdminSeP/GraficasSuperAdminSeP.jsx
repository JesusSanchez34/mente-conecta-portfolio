import { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../../hooks";
import { useGraficasSeP } from "../../../hooks/sep";
import GraficasGrid from "../../../components/adminsep/dashboard/GraficasGrid";
import "./GraficasSuperAdminSeP.css";

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

export function GraficasSuperAdminSeP() {
  const { auth } = useAuth();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Estado de México');
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
  const [tipoGrafica, setTipoGrafica] = useState('cuestionarios');
  const [graficas, setGraficas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoizar para evitar recálculos en cada render
  const sedesPorEstado = useMemo(() => sedesPorEstadoConstant, []);
  const sedesDelEstado = useMemo(() => sedesPorEstado[estadoSeleccionado] || {}, [estadoSeleccionado, sedesPorEstado]);
  const idsSedes = useMemo(() => Object.keys(sedesDelEstado), [sedesDelEstado]);

  const {
    getConteoPorNivelRiesgoCategoriaBySedeSeP,
    getGraficasPreguntasBySedeSeP,
    getRangoDePreguntasBySedeSeP
  } = useGraficasSeP();

  // Inicializar sede cuando cambia el estado
  useEffect(() => {
    if (idsSedes.length > 0) {
      setSedeSeleccionada(Number(idsSedes[0]));
    }
  }, [estadoSeleccionado, idsSedes]);

  // Cargar gráficas cuando cambia sede o tipo
  useEffect(() => {
    const cargarGraficas = async () => {
      if (sedeSeleccionada === null) return;

      try {
        setLoading(true);
        let data = [];

        if (tipoGrafica === 'cuestionarios') {
          data = await getConteoPorNivelRiesgoCategoriaBySedeSeP(sedeSeleccionada);
        } else if (tipoGrafica === 'preguntas') {
          data = await getGraficasPreguntasBySedeSeP(sedeSeleccionada);
        } else if (tipoGrafica === 'rangos') {
          data = await getRangoDePreguntasBySedeSeP(sedeSeleccionada);
        }

        setGraficas(data || []);
      } catch (error) {
        console.error('Error al cargar gráficas:', error);
        setGraficas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarGraficas();
  }, [sedeSeleccionada, tipoGrafica]);
  return (
    <Container className="container-graficas-sep">
      <header className="header-graficas">
        <h1>📊 Gráficas Estadísticas - SEP</h1>
        <p className="lead">Análisis visual de cuestionarios y evaluaciones</p>
      </header>

      {/* Filtros en cascada - Estado, Sede y Tipo */}
      <div className="filtros-container-graficas mb-5">
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
              onChange={(e) => setSedeSeleccionada(Number(e.target.value))}
            >
              {idsSedes.map((id) => (
                <option key={id} value={id}>
                  {sedesDelEstado[id]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filtro-wrapper">
          <label className="filtro-label">📈 Tipo de Gráfica:</label>
          <select 
            className="filtro-select"
            value={tipoGrafica}
            onChange={(e) => setTipoGrafica(e.target.value)}
          >
            <option value="cuestionarios">Cuestionarios</option>
            <option value="preguntas">Preguntas</option>
            <option value="rangos">Rangos</option>
          </select>
        </div>
      </div>

      {/* Resumen de la Sede */}
      {sedeSeleccionada && (
        <div className="estado-resumen mb-5">
          <div className="resumen-contenido">
            <h2 className="resumen-titulo">{sedesDelEstado[sedeSeleccionada]}</h2>
            <p className="resumen-subtitulo">
              {estadoSeleccionado} • {tipoGrafica === 'cuestionarios' ? 'Cuestionarios' : tipoGrafica === 'preguntas' ? 'Preguntas' : 'Rangos'}
            </p>
          </div>
        </div>
      )}

      {/* Contenido de Gráficas */}
      {loading ? (
        <div className="loading-container-graficas">
          <Spinner animation="border" role="status" className="loading-spinner-graficas" />
          <p className="loading-text-graficas">Cargando gráficas...</p>
        </div>
      ) : (
        <div className="graficas-container">
          <GraficasGrid graficas={graficas} loading={loading} />
        </div>
      )}
    </Container>
  );
}

export default GraficasSuperAdminSeP;
