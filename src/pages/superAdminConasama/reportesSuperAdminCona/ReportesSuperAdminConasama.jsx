import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks";
import { useReporteEvaluacionesBySede } from "../../../hooks/conasama";
import { TableReportesEvaluacionesBySede } from "../../../components/adminconasama/dashboard/tableReporteEvaluacionesBySede";

  const sedesPorOrganizacion = {
    //SuperUsuario de MC para reportes
    0: {
      1: "Ciudad de México",
      2: "Morelos",
      3: "Tlaxcala",
      4: "Hidalgo",
      5: "UPEM Ecatepec",
      6: "UPEM Tecamac",
      7: "Dra. Alma",
    },
    //Por si se habilitan los reportes a los clientes
    /*1: {
      1: "Ciudad de México",
      2: "Morelos",
      3: "Tlaxcala",
      4: "Hidalgo",
    },
    2: {
      5: "UPEM Ecatepec",
      6: "UPEM Tecamac",
      7: "Dra. Alma",
    },*/
  };

export function ReportesSuperAdminConasama() {
  const { auth } = useAuth();
  const { dataBySede, loadingBySede, getSedeData } =
    useReporteEvaluacionesBySede();

  const organizacion = auth?.me?.organizacion;
  const sedesDisponibles = sedesPorOrganizacion[organizacion] || {};
  const idsSedes = Object.keys(sedesDisponibles);

  const [activeSede, setActiveSede] = useState(null);

  // Inicio de Sede por Organizacion del Super Gestor
  useEffect(() => {
    if (idsSedes.length > 0) {
      setActiveSede(idsSedes[0]);
    }
  }, [organizacion]);

  // Mostrado de Sede Activa en TAB
  useEffect(() => {
    if (!activeSede) return;

    if (!dataBySede[activeSede]) {
      getSedeData(Number(activeSede));
    }
  }, [activeSede]);

  return (
    <div>
      <center>
        <h1 style={{ color: "#4DB6AC" }}>
          Reporte de Evaluaciones de Riesgo por Sede
        </h1>
      </center>

      {loadingBySede ? (
        <h3>Cargando datos de la sede...</h3>
      ) : (
        <TableReportesEvaluacionesBySede
          dataBySede={dataBySede}
          sedesIds={idsSedes}
          nombresSedes={sedesDisponibles}
          activeSede={activeSede}
          onChangeSede={setActiveSede}
        />
      )}
    </div>
  );
}