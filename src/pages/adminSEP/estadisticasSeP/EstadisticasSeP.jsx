import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import TipoGraficasTabs from "../../../components/adminsep/dashboard/TipoGraficasTabs";
import GraficasGrid from "../../../components/adminsep/dashboard/GraficasGrid";
import { useGraficasSeP } from "../../../hooks/sep";

export function EstadisticasSeP() {
  const [tipo, setTipo] = useState("cuestionarios");
  const [graficas, setGraficas] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const {
    getConteoPorNivelRiesgoCategoriaSeP,
    getGraficasPreguntasSeP,
    getRangoDePreguntasSeP
  } = useGraficasSeP();

  useEffect(() => {
    cargarDatos();
  }, [tipo]);

  async function cargarDatos() {
    setLoadingData(true);

    try {
      let data = [];

      if (tipo === "cuestionarios") {
        data = await getConteoPorNivelRiesgoCategoriaSeP();
      }

      if (tipo === "preguntas") {
        data = await getGraficasPreguntasSeP();
      }

      if (tipo === "rangos") {
        data = await getRangoDePreguntasSeP();
      }

      setGraficas(data || []);
    } catch (error) {
      console.error("Error cargando gráficas SEP:", error);
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Estadísticas SEP</h1>

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
