import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks";
import { useReporteEvaluacionesBySedeSeP } from "../../../hooks/sep";
import { TableReportesEvaluacionesBySede } from "../../../components/adminsep/dashboard/tableReporteEvaluacionesBySede";

const sedesPorOrganizacion = {
  0: {
    29: "Centro de Estudios Tecnológicos Ecatepec",
    30: "Preparatoria Oficial No. 128",
    31: "Secundaria Técnica 55",
    32: "Universidad Tecnológica de Nezahualcóyotl",
    33: "CBT No. 2 Nezahualcóyotl",
    34: "UAEM - Unidad Académica Toluca",
    35: "Instituto Tecnológico de Toluca",
    36: "Escuela Secundaria Oficial No. 1",
    37: "UAM Iztapalapa - Plantel Central",
    38: "CETIS No. 53 Iztapalapa",
    39: "Secundaria Diurna No. 115",
    40: "IPN - Escuela Superior de Ingeniería (ESIME)",
    41: "Preparatoria Nacional Plantel 9 UNAM",
    42: "Facultad de Filosofía y Letras UNAM",
    43: "CBTIS No. 2 Coyoacán",
    44: "Secundaria Técnica No. 17",
  },
};

export function ReportesSuperAdminSeP() {
  const { auth } = useAuth();
  const { dataBySede, loadingBySede, getSedeData } =
    useReporteEvaluacionesBySedeSeP();

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
    if (!activeSede || loadingBySede[activeSede]) return;

    if (!dataBySede[activeSede]) {
      getSedeData(Number(activeSede));
    }
  }, [activeSede]);

  return (
    <div>
      <center>
        <h1 style={{ color: "#4DB6AC" }}>
          Reportes de Evaluaciones por Sede
        </h1>
      </center>

      {loadingBySede[activeSede] ? (
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

export default ReportesSuperAdminSeP;
