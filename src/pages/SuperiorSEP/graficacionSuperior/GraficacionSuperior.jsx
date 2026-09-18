import { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useGraficasSuperiorSeP } from "../../../hooks/SepSuperior";
import GraficasGrid from "../../../components/adminsep/dashboard/GraficasGrid";
import "./GraficasSuperior.css";

const sedesPorEstadoConstant = {
  'Subsistema de Universidades del Estado de México': {
    1: "U Digital del Estado de México",
    2: "U Mexiquense del Bicentenario",
    3: "U Intercultural del Estado de México",
  },
  'Subsistema Tecnológicos': {
    4: "TES Ecatepec",
    5: "TES Coacalco",
    6: "TES Chimalhuacán",
    7: "TES Chalco",
    8: "TES Cuatitlán Izcalli",
    9: "TES Huixquilucan",
    10: "TES Ixtapaluca",
    11: "TES Jocotitlán",
    12: "TES San Felipe del Progreso",
    13: "TES Tianguistengo",
    14: "TES Valle de Bravo",
    15: "TES Villa Guerrero"
  },
  'Subsistema de Universidades Politécnicas': {
    16:	"UP Valle de Toluca",
    17:	"UP Valle de México",
    18:	"UP Texcoco",
    19:	"UP Atlautla",	
    20:	"UP Tecamac",
    21:	"UP Atlacomulco",
    22:	"UP Otzolotepec",
    23:	"UP Cuatitlan Izcalli",
    24:	"UP Chimalhuacan"
},
  'Subsistema de Universidades Tecnológicas': {
    25: "UT del Valle de Toluca",
    26: "UT Fidel Velázquez",
    27: "UT de Coacalco",
    28: "UT de Nezahualcóyotl",
    29: "UT de Tecámac",
    30: "UT de Zinacantepec",
    31: "UT del Sur del Estado de México"
  }
};

export function GraficacionSuperior() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Subsistema de Universidades del Estado de México');
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
  const [tipoGrafica, setTipoGrafica] = useState('cuestionarios');
  const [graficas, setGraficas] = useState([]);
  const [loading, setLoading] = useState(false);

  const sedesPorEstado = useMemo(() => sedesPorEstadoConstant, []);
  const sedesDelEstado = useMemo(
    () => sedesPorEstado[estadoSeleccionado] || {},
    [estadoSeleccionado, sedesPorEstado]
  );
  const idsSedes = useMemo(() => Object.keys(sedesDelEstado), [sedesDelEstado]);

    const {
        getConteoPorNivelRiesgoCategoriaBySedeSeP,
        getGraficasPreguntasBySedeSeP,
        getRangoDePreguntasBySedeSeP
    } = useGraficasSuperiorSeP();

  useEffect(() => {
    if (idsSedes.length > 0) {
      setSedeSeleccionada(Number(idsSedes[0]));
    }
  }, [estadoSeleccionado, idsSedes]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sedeSeleccionada, tipoGrafica]);

  return (
    <Container className="container-graficas-sep">
      <header className="header-graficas">
        <h1>📊 Gráficas Estadísticas - SESyN</h1>
        <p className="lead">Análisis visual de cuestionarios y evaluaciones</p>
      </header>

      <div className="filtros-container-graficas mb-5">
        <div className="filtro-wrapper">
          <label className="filtro-label">📍 Tipo de Institución:</label>
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
            <label className="filtro-label">🏢 Seleccionar Institución:</label>
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

      {sedeSeleccionada && (
        <div className="estado-resumen mb-5">
          <div className="resumen-contenido">
            <h2 className="resumen-titulo">{sedesDelEstado[sedeSeleccionada]}</h2>
            <p className="resumen-subtitulo">
              {estadoSeleccionado} •{' '}
              {tipoGrafica === 'cuestionarios'
                ? 'Cuestionarios'
                : tipoGrafica === 'preguntas'
                ? 'Preguntas'
                : 'Rangos'}
            </p>
          </div>
        </div>
      )}

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

export default GraficacionSuperior;