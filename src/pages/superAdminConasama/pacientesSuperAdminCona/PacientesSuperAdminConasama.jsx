import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks";
import { useNivelRiesgoBySede } from "../../../hooks/conasama";
import { TableNivelRiesgoBySede } from "../../../components/adminconasama/dashboard/tableNivelRiesgoBySede";

  const sedesPorOrganizacion = {
    0: {
      1: "Ciudad de México",
      2: "Morelos",
      3: "Tlaxcala",
      4: "Hidalgo",
      5: "UPEM Ecatepec",
      6: "UPEM Tecamac",
      7: "Dra. Alma",
    },
    1: {
      1: "Ciudad de México",
      2: "Morelos",
      3: "Tlaxcala",
      4: "Hidalgo",
    },
    2: {
      5: "UPEM Ecatepec",
      6: "UPEM Tecamac",
      7: "Dra. Alma",
    },
  };

export function PacientesSuperAdminConasama() {
  const { auth } = useAuth();
  const { dataBySede, loadingBySede, getSedeData } =
    useNivelRiesgoBySede();

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
          Pacientes en Grupo de Riesgo por Sede
        </h1>
      </center>

      {loadingBySede ? (
        <h3>Cargando datos de la sede...</h3>
      ) : (
        <TableNivelRiesgoBySede
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
