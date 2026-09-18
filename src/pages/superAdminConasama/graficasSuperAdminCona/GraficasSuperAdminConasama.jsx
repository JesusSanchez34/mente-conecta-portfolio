import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import SedeTabs from "../../../components/adminconasama/dashboard/SedeTabs";
import TipoGraficasTabs from "../../../components/adminconasama/dashboard/TipoGraficasTabs";
import GraficasGrid from "../../../components/adminconasama/dashboard/GraficasGrid";
import { useGraficasConasama, useAuth } from "../../../hooks";

const sedesPorOrganizacion = {
  1: [1, 2, 3, 4],
  2: [5, 6, 7],
};

export function GraficasSuperAdminConasama() {
  const [sede, setSede] = useState(null);
  const [tipo, setTipo] = useState("cuestionarios");
  const [graficas, setGraficas] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const { auth } = useAuth();

  const {
    getConteoPorNivelRiesgoCategoriaBySede,
    getGraficasPreguntasBySede,
    getRangoDePreguntasBySede
  } = useGraficasConasama();

  // Inicio Segun la Organizacion del SuperGestor
  useEffect(() => {
    const organizacion = auth?.me?.organizacion;
    if (!organizacion) return;

    const sedesDisponibles = sedesPorOrganizacion[organizacion];
    if (sedesDisponibles?.length) {
      setSede(sedesDisponibles[0]);
    }
  }, [auth]);

  // Refresh de Graficas Mostradas
  useEffect(() => {
    if (sede === null) return;

    const cargarDatos = async () => {
      setLoadingData(true);

      try {
        let data = [];

        if (tipo === "cuestionarios") {
          data = await getConteoPorNivelRiesgoCategoriaBySede(sede);
        }

        if (tipo === "preguntas") {
          data = await getGraficasPreguntasBySede(sede);
        }

        if (tipo === "rangos") {
          data = await getRangoDePreguntasBySede(sede);
        }

        setGraficas(data || []);
      } catch (error) {
        console.error("Error al cargar las gráficas:", error);
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatos();
  }, [sede, tipo]);

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Estadísticas CONASAMA</h1>

      <SedeTabs
        value={sede}
        onChange={setSede}
        organizacion={auth?.me?.organizacion}
      />

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