import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import TipoGraficasTabs from "../../../components/adminconasama/dashboard/TipoGraficasTabs";
import GraficasGrid from "../../../components/adminconasama/dashboard/GraficasGrid";
import { useGraficasConasama } from "../../../hooks";

export function EstadisticaConasama() {
  const [tipo, setTipo] = useState("cuestionarios");
  const [graficas, setGraficas] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const {
    getConteoPorNivelRiesgoCategoria,
    getGraficasPreguntas,
    getRangoDePreguntas
  } = useGraficasConasama();

  useEffect(() => {
    cargarDatos();
  }, [tipo]);

  async function cargarDatos() {
    setLoadingData(true);

    try {
      let data = [];

      if (tipo === "cuestionarios") {
        data = await getConteoPorNivelRiesgoCategoria();
      }

      if (tipo === "preguntas") {
        data = await getGraficasPreguntas();
      }

      if (tipo === "rangos") {
        data = await getRangoDePreguntas();
      }

      setGraficas(data || []);
    } catch (error) {
      console.error("Error cargando gráficas:", error);
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Estadísticas CONASAMA</h1>

      <TipoGraficasTabs value={tipo} onChange={setTipo} />
      <div style={{ height: 20 }} />

      {loadingData ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      ) : (
        <GraficasGrid graficas={graficas} />
      )}
    </Container>
  );
}