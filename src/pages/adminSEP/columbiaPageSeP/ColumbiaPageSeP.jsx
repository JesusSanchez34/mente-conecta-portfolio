import React, { useEffect, useState } from "react";

import { usePacientesSensiblesSeP } from "../../../hooks/sep";
import { DividerIcon } from "../../../components/common";
import { TablePacientesSensibles } from "../../../components/adminsep/columbia/tablePacientesSensibles";

export function ColumbiaPageSeP() {
  const { pacientes, loadingPacientes, getPacientesSensibles } =
    usePacientesSensiblesSeP();

  const [refetch, setRefetch] = useState(false);
  const onRefetch = () => setRefetch((prev) => !prev);

  useEffect(() => {
    getPacientesSensibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return (
    <div>
      <center>
        <h1 style={{ color: "#4DB6AC" }}>
          Pacientes por grupo de riesgo - SEP
        </h1>
      </center>
      {loadingPacientes ? (
        <h3>Cargando...</h3>
      ) : (
        <TablePacientesSensibles
          data={pacientes}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
}

export default ColumbiaPageSeP;
